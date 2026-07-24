package vn.educare.backend.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.model.PlanType;
import vn.educare.backend.model.SubscriptionPlanEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserPlan;
import vn.educare.backend.model.UserSubscriptionEntity;
import vn.educare.backend.repository.SubscriptionPlanRepository;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.repository.UserSubscriptionRepository;

@Service
@RequiredArgsConstructor
public class TrialActivationService {

  private final UserRepository userRepository;
  private final UserSubscriptionRepository userSubscriptionRepository;
  private final SubscriptionPlanRepository subscriptionPlanRepository;

  @Transactional
  public void activateTrial(UserEntity user) {
    List<SubscriptionPlanEntity> trials = subscriptionPlanRepository.findByPlanType(PlanType.TRIAL);
    SubscriptionPlanEntity trialPlan = trials.stream()
        .filter(SubscriptionPlanEntity::getActive)
        .findFirst()
        .orElse(null);

    if (trialPlan == null) {
      return;
    }

    UserSubscriptionEntity subscription = new UserSubscriptionEntity();
    subscription.setUser(user);
    subscription.setPlan(trialPlan);
    subscription.setStartDate(Instant.now());
    subscription.setEndDate(Instant.now().plus(trialPlan.getDurationDays(), ChronoUnit.DAYS));
    subscription.setStatus("ACTIVE");
    userSubscriptionRepository.save(subscription);

    user.setPlan(UserPlan.POPULAR);
    userRepository.save(user);
  }
}
