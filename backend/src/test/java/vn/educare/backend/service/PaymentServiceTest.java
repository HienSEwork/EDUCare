package vn.educare.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.model.PaymentTransactionEntity;
import vn.educare.backend.model.SubscriptionPlanEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.repository.PaymentTransactionRepository;
import vn.educare.backend.repository.SubscriptionPlanRepository;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.repository.UserSubscriptionRepository;
import vn.educare.backend.security.PayOSCryptoUtils;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

  private static final String CHECKSUM_KEY = "test-checksum-key";

  @Mock PaymentTransactionRepository transactionRepository;
  @Mock SubscriptionPlanRepository planRepository;
  @Mock UserSubscriptionRepository subscriptionRepository;
  @Mock UserRepository userRepository;

  private PaymentService paymentService;
  private PaymentTransactionEntity transaction;

  @BeforeEach
  void setUp() {
    paymentService = new PaymentService(
        transactionRepository, planRepository, subscriptionRepository, userRepository);
    ReflectionTestUtils.setField(paymentService, "payosChecksumKey", CHECKSUM_KEY);

    UserEntity user = new UserEntity();
    user.setId("user-1");
    user.setUsername("student");

    SubscriptionPlanEntity plan = new SubscriptionPlanEntity();
    plan.setId("VIP_1M");
    plan.setDurationDays(30);
    plan.setPrice(new BigDecimal("29000"));

    transaction = new PaymentTransactionEntity();
    transaction.setId("123456");
    transaction.setUser(user);
    transaction.setPlan(plan);
    transaction.setAmount(new BigDecimal("29000"));
    transaction.setStatus("PENDING");
  }

  @Test
  void processWebhookFulfillsOnlyMatchingSuccessfulPayment() {
    when(transactionRepository.findById("123456")).thenReturn(Optional.of(transaction));
    Map<String, Object> webhook = webhookWithAmount(29000);

    assertThat(paymentService.processWebhook(webhook)).isTrue();
    assertThat(transaction.getStatus()).isEqualTo("SUCCESS");
    verify(userRepository).save(transaction.getUser());
    verify(subscriptionRepository).save(any());
  }

  @Test
  void processWebhookRejectsAmountMismatch() {
    when(transactionRepository.findById("123456")).thenReturn(Optional.of(transaction));
    Map<String, Object> webhook = webhookWithAmount(1000);

    assertThat(paymentService.processWebhook(webhook)).isFalse();
    assertThat(transaction.getStatus()).isEqualTo("PENDING");
    verify(userRepository, never()).save(any());
    verify(subscriptionRepository, never()).save(any());
  }

  @Test
  void processWebhookRejectsInvalidSignature() {
    Map<String, Object> webhook = webhookWithAmount(29000);
    webhook.put("signature", "invalid");

    assertThat(paymentService.processWebhook(webhook)).isFalse();
    verify(userRepository, never()).save(any());
  }

  @Test
  void createPaymentLinkReportsMissingGatewayConfiguration() {
    assertThatThrownBy(() -> paymentService.createPaymentLink(
        "user-1", "VIP_1M", "http://localhost/cancel", "http://localhost/return"))
        .isInstanceOf(ApiException.class)
        .hasMessageContaining("chưa được cấu hình");

    verify(userRepository, never()).findById(any());
    verify(transactionRepository, never()).save(any());
  }

  private Map<String, Object> webhookWithAmount(int amount) {
    Map<String, Object> data = new HashMap<>();
    data.put("orderCode", 123456);
    data.put("amount", amount);
    data.put("code", "00");
    data.put("reference", "PAYOS-REF");

    Map<String, Object> webhook = new HashMap<>();
    webhook.put("code", "00");
    webhook.put("success", true);
    webhook.put("data", data);
    webhook.put("signature", PayOSCryptoUtils.generateSignature(data, CHECKSUM_KEY));
    return webhook;
  }
}
