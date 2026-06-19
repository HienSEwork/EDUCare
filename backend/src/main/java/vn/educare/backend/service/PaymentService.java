package vn.educare.backend.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import vn.educare.backend.model.PaymentTransactionEntity;
import vn.educare.backend.model.SubscriptionPlanEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserPlan;
import vn.educare.backend.model.UserSubscriptionEntity;
import vn.educare.backend.repository.PaymentTransactionRepository;
import vn.educare.backend.repository.SubscriptionPlanRepository;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.repository.UserSubscriptionRepository;
import vn.educare.backend.security.PayOSCryptoUtils;

@Service
@RequiredArgsConstructor
public class PaymentService {

  private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
  private final RestTemplate restTemplate = new RestTemplate();

  private final PaymentTransactionRepository transactionRepository;
  private final SubscriptionPlanRepository planRepository;
  private final UserSubscriptionRepository subscriptionRepository;
  private final UserRepository userRepository;

  @Value("${app.payos.client-id}")
  private String payosClientId;

  @Value("${app.payos.api-key}")
  private String payosApiKey;

  @Value("${app.payos.checksum-key}")
  private String payosChecksumKey;

  @Transactional
  public String createPaymentLink(String userId, String planId, String cancelUrl, String returnUrl) {
    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    SubscriptionPlanEntity plan = planRepository.findById(planId)
        .orElseThrow(() -> new IllegalArgumentException("Plan not found: " + planId));

    // Generate unique numeric transaction ID for PayOS (orderCode must be numeric)
    String transactionId = String.valueOf(System.currentTimeMillis() * 10 + (int) (Math.random() * 10));

    PaymentTransactionEntity transaction = new PaymentTransactionEntity();
    transaction.setId(transactionId);
    transaction.setUser(user);
    transaction.setPlan(plan);
    transaction.setAmount(plan.getPrice());
    transaction.setStatus("PENDING");
    transactionRepository.save(transaction);

    // Call PayOS to get Checkout URL
    try {
      long orderCode = Long.parseLong(transactionId);
      int amount = plan.getPrice().intValue();
      String description = "EDUcare VIP " + planId; // Max 25 chars
      if (description.length() > 25) {
        description = description.substring(0, 25);
      }

      // Calculate Signature for creation
      Map<String, Object> signData = new HashMap<>();
      signData.put("amount", amount);
      signData.put("cancelUrl", cancelUrl);
      signData.put("description", description);
      signData.put("orderCode", orderCode);
      signData.put("returnUrl", returnUrl);

      String signature = PayOSCryptoUtils.generateSignature(signData, payosChecksumKey);

      // Prepare request
      HttpHeaders headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_JSON);
      headers.set("x-client-id", payosClientId);
      headers.set("x-api-key", payosApiKey);

      Map<String, Object> requestBody = new HashMap<>();
      requestBody.put("orderCode", orderCode);
      requestBody.put("amount", amount);
      requestBody.put("description", description);
      requestBody.put("cancelUrl", cancelUrl);
      requestBody.put("returnUrl", returnUrl);
      requestBody.put("signature", signature);

      HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
      log.info("Calling PayOS to create payment request for orderCode: {}", orderCode);
      
      ResponseEntity<Map> response = restTemplate.postForEntity(
          "https://api-merchant.payos.vn/v2/payment-requests", 
          requestEntity, 
          Map.class
      );

      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        Map responseBody = response.getBody();
        String code = (String) responseBody.get("code");
        if ("00".equals(code)) {
          Map data = (Map) responseBody.get("data");
          return (String) data.get("checkoutUrl");
        } else {
          String desc = (String) responseBody.get("desc");
          log.error("PayOS API returned failure code: {}, description: {}", code, desc);
          throw new RuntimeException("Cổng thanh toán phản hồi lỗi: " + desc);
        }
      } else {
        log.error("PayOS status code error: {}", response.getStatusCode());
        throw new RuntimeException("Không thể kết nối cổng thanh toán.");
      }
    } catch (Exception e) {
      log.error("Error creating payment link for transaction: {}", transactionId, e);
      throw new RuntimeException("Tạo liên kết thanh toán thất bại: " + e.getMessage(), e);
    }
  }

  @Transactional
  public boolean processWebhook(Map<String, Object> webhookBody) {
    if (webhookBody == null || !webhookBody.containsKey("data") || !webhookBody.containsKey("signature")) {
      log.warn("Invalid webhook body received");
      return false;
    }

    Map<String, Object> data = (Map<String, Object>) webhookBody.get("data");
    String signature = (String) webhookBody.get("signature");

    // Verify webhook signature
    String computedSignature = PayOSCryptoUtils.generateSignature(data, payosChecksumKey);
    if (!computedSignature.equalsIgnoreCase(signature)) {
      log.error("Webhook signature verification failed! Computed: {}, Received: {}", computedSignature, signature);
      return false;
    }

    // Process payment
    Object orderCodeObj = data.get("orderCode");
    if (orderCodeObj == null) {
      log.warn("No orderCode found in webhook data");
      return false;
    }

    String transactionId = orderCodeObj.toString();
    Optional<PaymentTransactionEntity> transactionOpt = transactionRepository.findById(transactionId);
    if (transactionOpt.isEmpty()) {
      log.warn("Transaction not found for ID: {}", transactionId);
      return false;
    }

    PaymentTransactionEntity transaction = transactionOpt.get();
    if ("SUCCESS".equals(transaction.getStatus())) {
      log.info("Transaction {} already processed", transactionId);
      return true; // Already processed (idempotent)
    }

    // Update transaction status
    transaction.setStatus("SUCCESS");
    if (data.containsKey("reference")) {
      transaction.setGatewayReference(data.get("reference").toString());
    }
    transactionRepository.save(transaction);

    // Upgrade user plan
    UserEntity user = transaction.getUser();
    SubscriptionPlanEntity plan = transaction.getPlan();

    // Map subscription plan to UserPlan enum
    UserPlan userPlan = UserPlan.FREE;
    String planIdUpper = plan.getId().toUpperCase();
    if (planIdUpper.contains("PREMIUM")) {
      userPlan = UserPlan.PREMIUM;
    } else if (!"FREE".equals(planIdUpper)) {
      userPlan = UserPlan.POPULAR; // Any custom paid plan defaults to VIP (POPULAR)
    }
    user.setPlan(userPlan);
    userRepository.save(user);

    // Create or update subscription record
    Instant now = Instant.now();
    UserSubscriptionEntity subscription = new UserSubscriptionEntity();
    subscription.setUser(user);
    subscription.setPlan(plan);
    subscription.setStartDate(now);
    subscription.setEndDate(now.plus(plan.getDurationDays(), ChronoUnit.DAYS));
    subscription.setStatus("ACTIVE");
    subscriptionRepository.save(subscription);

    log.info("User {} upgraded to {} (Plan ID: {}) until {}", 
        user.getUsername(), userPlan, plan.getId(), subscription.getEndDate());
    return true;
  }

  @Transactional(readOnly = true)
  public String getTransactionStatus(String transactionId) {
    return transactionRepository.findById(transactionId)
        .map(PaymentTransactionEntity::getStatus)
        .orElse("NOT_FOUND");
  }

  @Transactional
  public boolean cancelTransaction(String transactionId) {
    Optional<PaymentTransactionEntity> transactionOpt = transactionRepository.findById(transactionId);
    if (transactionOpt.isPresent()) {
      PaymentTransactionEntity transaction = transactionOpt.get();
      if ("PENDING".equals(transaction.getStatus())) {
        transaction.setStatus("CANCELLED");
        transactionRepository.save(transaction);
        log.info("Transaction {} marked as CANCELLED.", transactionId);
        return true;
      }
    }
    return false;
  }

  @Transactional(readOnly = true)
  public java.util.List<SubscriptionPlanEntity> getAllPlans() {
    return planRepository.findAll();
  }
}
