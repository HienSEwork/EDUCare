package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.NotificationEntity;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
  List<NotificationEntity> findTop10ByUserIdOrderByCreatedAtDesc(String userId);
}
