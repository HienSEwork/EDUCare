package vn.educare.backend.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserPlan;
import vn.educare.backend.model.UserSubscriptionEntity;
import vn.educare.backend.model.PaymentTransactionEntity;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.repository.UserSubscriptionRepository;
import vn.educare.backend.repository.PaymentTransactionRepository;

@Component
@RequiredArgsConstructor
public class SubscriptionScheduler {

  private static final Logger log = LoggerFactory.getLogger(SubscriptionScheduler.class);

  private final UserSubscriptionRepository userSubscriptionRepository;
  private final UserRepository userRepository;
  private final PaymentTransactionRepository transactionRepository;

  // Run every hour to check and deactivate expired subscriptions
  @Scheduled(cron = "0 0 * * * *")
  @Transactional
  public void checkExpiredSubscriptions() {
    log.info("SubscriptionScheduler: Checking for expired subscriptions...");
    List<UserSubscriptionEntity> activeSubs = userSubscriptionRepository.findByStatus("ACTIVE");
    Instant now = Instant.now();
    int expiredCount = 0;

    for (UserSubscriptionEntity sub : activeSubs) {
      if (sub.getEndDate().isBefore(now)) {
        sub.setStatus("EXPIRED");
        userSubscriptionRepository.save(sub);
        expiredCount++;

        // Verify if user has other active subscriptions
        UserEntity user = sub.getUser();
        List<UserSubscriptionEntity> userActiveSubs = userSubscriptionRepository
            .findByUserIdAndStatus(user.getId(), "ACTIVE");
            
        boolean hasRemainingActive = userActiveSubs.stream()
            .anyMatch(s -> s.getEndDate().isAfter(now));

        if (!hasRemainingActive && user.getPlan() != UserPlan.FREE) {
          user.setPlan(UserPlan.FREE);
          userRepository.save(user);
          log.info("SubscriptionScheduler: User {} plan downgraded to FREE due to subscription expiration.", user.getUsername());
        }
      }
    }

    if (expiredCount > 0) {
      log.info("SubscriptionScheduler: Expired {} subscriptions.", expiredCount);
    }
  }

  // Run daily at 1:00 AM to clean up expired pending transactions
  @Scheduled(cron = "0 0 1 * * *")
  @Transactional
  public void cleanExpiredPendingTransactions() {
    log.info("SubscriptionScheduler: Cleaning up expired pending transactions...");
    Instant cutoff = Instant.now().minus(24, ChronoUnit.HOURS);
    List<PaymentTransactionEntity> pendingTransactions = transactionRepository
        .findByStatusAndCreatedAtBefore("PENDING", cutoff);
    int cancelledCount = 0;

    for (PaymentTransactionEntity tx : pendingTransactions) {
      tx.setStatus("CANCELLED");
      transactionRepository.save(tx);
      cancelledCount++;
    }

    if (cancelledCount > 0) {
      log.info("SubscriptionScheduler: Automatically marked {} pending transactions as CANCELLED.", cancelledCount);
    }
  }
}
