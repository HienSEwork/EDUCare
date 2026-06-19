package vn.educare.backend.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.security.AppUserDetails;
import vn.educare.backend.service.PaymentService;

@RestController
@RequiredArgsConstructor
public class PaymentController {

  private static final Logger log = LoggerFactory.getLogger(PaymentController.class);
  private final PaymentService paymentService;

  public static record CheckoutRequest(
      @NotBlank(message = "Plan ID is required") String planId,
      @NotBlank(message = "Cancel URL is required") String cancelUrl,
      @NotBlank(message = "Return URL is required") String returnUrl
  ) {}

  @PostMapping("/api/payments/checkout")
  public Map<String, String> checkout(Authentication authentication, @Valid @RequestBody CheckoutRequest request) {
    String userId = getUserId(authentication);
    if (userId == null) {
      throw new ApiException(401, "Bạn cần đăng nhập để mua gói dịch vụ.");
    }

    String checkoutUrl = paymentService.createPaymentLink(
        userId, 
        request.planId(), 
        request.cancelUrl(), 
        request.returnUrl()
    );

    Map<String, String> response = new HashMap<>();
    response.put("checkoutUrl", checkoutUrl);
    return response;
  }

  @GetMapping("/api/payments/status/{transactionId}")
  public Map<String, String> getStatus(@PathVariable String transactionId) {
    String status = paymentService.getTransactionStatus(transactionId);
    Map<String, String> response = new HashMap<>();
    response.put("status", status);
    return response;
  }

  @PostMapping("/api/payments/cancel/{transactionId}")
  public Map<String, Object> cancelTransaction(@PathVariable String transactionId) {
    boolean cancelled = paymentService.cancelTransaction(transactionId);
    Map<String, Object> response = new HashMap<>();
    response.put("success", cancelled);
    return response;
  }

  @PostMapping("/api/payments/webhook")
  public Map<String, Object> webhook(@RequestBody Map<String, Object> webhookBody) {
    log.info("Received payment Webhook from PayOS: {}", webhookBody);
    boolean processed = paymentService.processWebhook(webhookBody);
    
    Map<String, Object> response = new HashMap<>();
    if (processed) {
      response.put("code", "00");
      response.put("desc", "success");
      response.put("data", null);
    } else {
      response.put("code", "01");
      response.put("desc", "Webhook processing failed or invalid signature");
      response.put("data", null);
    }
    return response;
  }

  @GetMapping("/api/payments/plans")
  public java.util.List<vn.educare.backend.model.SubscriptionPlanEntity> getPlans() {
    return paymentService.getAllPlans();
  }

  private String getUserId(Authentication authentication) {
    if (authentication == null || !(authentication.getPrincipal() instanceof AppUserDetails details)) {
      return null;
    }
    return details.user().getId();
  }
}
