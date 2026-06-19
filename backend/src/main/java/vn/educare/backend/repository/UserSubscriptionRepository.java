package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.UserSubscriptionEntity;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscriptionEntity, Long> {
  List<UserSubscriptionEntity> findByUserIdAndStatus(String userId, String status);
  List<UserSubscriptionEntity> findByUserId(String userId);
  List<UserSubscriptionEntity> findByStatus(String status);
}
