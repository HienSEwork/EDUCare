package vn.educare.backend.service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
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
import vn.educare.backend.api.ApiException;
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

  @PostConstruct
  void logGatewayReadiness() {
    if (isPayOSConfigured()) {
      log.info("PayOS/VietQR payment gateway configuration: ready");
    } else {
      log.warn("PayOS/VietQR payment gateway configuration: missing credentials");
    }
  }

  @Transactional
  public String createPaymentLink(String userId, String planId, String cancelUrl, String returnUrl) {
    requirePayOSConfiguration();

    UserEntity user = userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(404, "Không tìm thấy tài khoản."));

    SubscriptionPlanEntity plan = planRepository.findById(planId)
        .orElseThrow(() -> new ApiException(404, "Gói đăng ký không tồn tại."));

    if (!plan.getActive() || plan.getPrice() == null || plan.getPrice().signum() <= 0) {
      throw new ApiException(400, "Gói đăng ký hiện không thể thanh toán.");
    }
    validateRedirectUrl(cancelUrl);
    validateRedirectUrl(returnUrl);

    final int amount;
    try {
      amount = plan.getPrice().intValueExact();
    } catch (ArithmeticException exception) {
      throw new ApiException(400, "Giá gói đăng ký không hợp lệ.");
    }

    // Generate unique numeric transaction ID for PayOS (orderCode must be numeric)
    String transactionId = String.valueOf(System.currentTimeMillis() * 1000 + (int) (Math.random() * 1000));

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
      String description = "EDU" + transactionId.substring(transactionId.length() - 6);

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
          Object checkoutUrl = data == null ? null : data.get("checkoutUrl");
          if (checkoutUrl instanceof String url && url.startsWith("https://")) {
            return url;
          }
          throw new ApiException(502, "Cổng thanh toán không trả về liên kết hợp lệ.");
        } else {
          String desc = (String) responseBody.get("desc");
          log.error("PayOS API returned failure code: {}, description: {}", code, desc);
          throw new ApiException(502, "Cổng thanh toán phản hồi lỗi: " + (desc == null ? "Không xác định" : desc));
        }
      } else {
        log.error("PayOS status code error: {}", response.getStatusCode());
        throw new ApiException(502, "Không thể kết nối cổng thanh toán.");
      }
    } catch (ApiException exception) {
      throw exception;
    } catch (Exception e) {
      log.error("Error creating payment link for transaction: {}", transactionId, e);
      throw new ApiException(502, "Tạo liên kết thanh toán thất bại. Vui lòng thử lại.");
    }
  }

  private void validateRedirectUrl(String value) {
    try {
      URI uri = URI.create(value);
      String scheme = uri.getScheme();
      if (uri.getHost() == null || !("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme))) {
        throw new IllegalArgumentException("Invalid redirect URL");
      }
    } catch (IllegalArgumentException exception) {
      throw new ApiException(400, "Địa chỉ quay lại sau thanh toán không hợp lệ.");
    }
  }

  @Transactional
  public boolean processWebhook(Map<String, Object> webhookBody) {
    if (!hasText(payosChecksumKey)) {
      log.error("PayOS webhook rejected because the checksum key is not configured");
      return false;
    }

    if (webhookBody == null || !Boolean.TRUE.equals(webhookBody.get("success"))
        || !"00".equals(String.valueOf(webhookBody.get("code")))
        || !(webhookBody.get("data") instanceof Map) || !(webhookBody.get("signature") instanceof String)) {
      log.warn("Invalid webhook body received");
      return false;
    }

    Map<String, Object> data = (Map<String, Object>) webhookBody.get("data");
    String signature = (String) webhookBody.get("signature");

    // Verify webhook signature
    String computedSignature = PayOSCryptoUtils.generateSignature(data, payosChecksumKey);
    if (!MessageDigest.isEqual(
        computedSignature.toLowerCase().getBytes(StandardCharsets.UTF_8),
        signature.toLowerCase().getBytes(StandardCharsets.UTF_8))) {
      log.error("Webhook signature verification failed");
      return false;
    }

    if (!"00".equals(String.valueOf(data.get("code")))) {
      log.warn("Ignoring unsuccessful PayOS webhook event");
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

    BigDecimal receivedAmount;
    try {
      receivedAmount = new BigDecimal(String.valueOf(data.get("amount")));
    } catch (RuntimeException exception) {
      log.warn("Webhook amount is missing or invalid for transaction {}", transactionId);
      return false;
    }
    if (transaction.getAmount().compareTo(receivedAmount) != 0) {
      log.error("Webhook amount mismatch for transaction {}", transactionId);
      return false;
    }

    String gatewayRef = data.containsKey("reference") ? data.get("reference").toString() : null;
    fulfillPayment(transaction, gatewayRef);
    return true;
  }

  private void fulfillPayment(PaymentTransactionEntity transaction, String gatewayRef) {
    if ("SUCCESS".equals(transaction.getStatus())) {
      return;
    }

    // Update transaction status
    transaction.setStatus("SUCCESS");
    transaction.setGatewayReference(gatewayRef);
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
    subscriptionRepository.findByUserIdAndStatus(user.getId(), "ACTIVE").forEach(activeSubscription -> {
      activeSubscription.setStatus("EXPIRED");
      activeSubscription.setEndDate(now);
      subscriptionRepository.save(activeSubscription);
    });

    UserSubscriptionEntity subscription = new UserSubscriptionEntity();
    subscription.setUser(user);
    subscription.setPlan(plan);
    subscription.setStartDate(now);
    subscription.setEndDate(now.plus(plan.getDurationDays(), ChronoUnit.DAYS));
    subscription.setStatus("ACTIVE");
    subscriptionRepository.save(subscription);

    log.info("User {} upgraded to {} (Plan ID: {}) until {}", 
        user.getUsername(), userPlan, plan.getId(), subscription.getEndDate());
  }

  private void syncStatusFromPayOS(PaymentTransactionEntity transaction) {
    if (!isPayOSConfigured()) {
      log.warn("Skipping PayOS status sync because payment credentials are not configured");
      return;
    }

    try {
      String url = "https://api-merchant.payos.vn/v2/payment-requests/" + transaction.getId();

      HttpHeaders headers = new HttpHeaders();
      headers.set("x-client-id", payosClientId);
      headers.set("x-api-key", payosApiKey);
      headers.setContentType(MediaType.APPLICATION_JSON);

      HttpEntity<Void> entity = new HttpEntity<>(headers);
      ResponseEntity<Map> response = restTemplate.exchange(
          url,
          org.springframework.http.HttpMethod.GET,
          entity,
          Map.class
      );

      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        Map body = response.getBody();
        String code = (String) body.get("code");
        if ("00".equals(code)) {
          Map data = (Map) body.get("data");
          String payosStatus = (String) data.get("status");

          if ("PAID".equals(payosStatus)) {
            BigDecimal confirmedAmount;
            try {
              confirmedAmount = new BigDecimal(String.valueOf(data.get("amount")));
            } catch (RuntimeException exception) {
              log.warn("PayOS status amount is invalid for transaction {}", transaction.getId());
              return;
            }
            if (transaction.getAmount().compareTo(confirmedAmount) != 0) {
              log.error("PayOS status amount mismatch for transaction {}", transaction.getId());
              return;
            }
            String gatewayRef = null;
            java.util.List txs = (java.util.List) data.get("transactions");
            if (txs != null && !txs.isEmpty()) {
              Map firstTx = (Map) txs.get(0);
              if (firstTx != null && firstTx.containsKey("reference")) {
                gatewayRef = firstTx.get("reference").toString();
              }
            }
            fulfillPayment(transaction, gatewayRef);
          } else if ("CANCELLED".equals(payosStatus)) {
            transaction.setStatus("CANCELLED");
            transactionRepository.save(transaction);
            log.info("Transaction {} synced from PayOS as CANCELLED.", transaction.getId());
          }
        }
      }
    } catch (Exception e) {
      log.error("Error calling PayOS API to sync status for transaction: {}", transaction.getId(), e);
    }
  }

  @Transactional
  public String getTransactionStatus(String userId, String transactionId) {
    Optional<PaymentTransactionEntity> transactionOpt = transactionRepository.findById(transactionId);
    if (transactionOpt.isEmpty()) {
      return "NOT_FOUND";
    }

    PaymentTransactionEntity transaction = transactionOpt.get();
    if (!transaction.getUser().getId().equals(userId)) {
      throw new ApiException(404, "Không tìm thấy giao dịch.");
    }
    if ("PENDING".equals(transaction.getStatus())) {
      syncStatusFromPayOS(transaction);
    }
    return transaction.getStatus();
  }

  @Transactional
  public boolean cancelTransaction(String userId, String transactionId) {
    Optional<PaymentTransactionEntity> transactionOpt = transactionRepository.findById(transactionId);
    if (transactionOpt.isPresent()) {
      PaymentTransactionEntity transaction = transactionOpt.get();
      if (!transaction.getUser().getId().equals(userId)) {
        throw new ApiException(404, "Không tìm thấy giao dịch.");
      }
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
    return planRepository.findByActiveTrue();
  }

  private void requirePayOSConfiguration() {
    if (!isPayOSConfigured()) {
      throw new ApiException(503, "Cổng thanh toán chưa được cấu hình. Vui lòng liên hệ quản trị viên.");
    }
  }

  private boolean isPayOSConfigured() {
    return hasText(payosClientId) && hasText(payosApiKey) && hasText(payosChecksumKey);
  }

  private boolean hasText(String value) {
    return value != null && !value.isBlank();
  }
}
