package vn.educare.backend.service;

import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vn.educare.backend.api.AuthDtos.UserResponse;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserSubscriptionEntity;
import vn.educare.backend.repository.UserSubscriptionRepository;

@Component
@RequiredArgsConstructor
public class UserMapper {

  private final UserSubscriptionRepository userSubscriptionRepository;

  public UserResponse toResponse(UserEntity user, List<String> completedLessons) {
    // Find active subscription
    List<UserSubscriptionEntity> activeSubs = userSubscriptionRepository.findByUserIdAndStatus(user.getId(), "ACTIVE");
    String subEndDate = null;
    String subPlanId = "FREE";
    if (!activeSubs.isEmpty()) {
      // Find the subscription that expires last
      UserSubscriptionEntity latestSub = activeSubs.stream()
          .max((s1, s2) -> s1.getEndDate().compareTo(s2.getEndDate()))
          .orElse(null);
      if (latestSub != null) {
        subPlanId = latestSub.getPlan().getId();
        subEndDate = latestSub.getEndDate().toString();
      }
    }

    return new UserResponse(
        user.getId(),
        user.getFullName(),
        user.getEmail(),
        user.getUsername(),
        user.getAge(),
        user.getPlan().name().toLowerCase(),
        user.getXp(),
        user.getStreak(),
        user.getQuizScoreTotal(),
        user.getAvatarUrl(),
        user.getRole().name().toLowerCase(),
        user.getRole().name().equals("ADMIN"),
        completedLessons,
        user.getCreatedAt() == null ? Instant.now().toString() : user.getCreatedAt().toString(),
        subEndDate,
        subPlanId);
  }
}
