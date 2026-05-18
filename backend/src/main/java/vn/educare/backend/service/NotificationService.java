package vn.educare.backend.service;

import java.time.Instant;
import java.util.Collection;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.model.NotificationEntity;
import vn.educare.backend.repository.NotificationRepository;

@Service
@RequiredArgsConstructor
public class NotificationService {

  private final NotificationRepository notificationRepository;

  @Transactional
  public void create(String userId, String type, String title, String message) {
    NotificationEntity notification = new NotificationEntity();
    notification.setUserId(userId);
    notification.setType(type);
    notification.setTitle(title);
    notification.setMessage(message);
    notification.setIsRead(false);
    notification.setCreatedAt(Instant.now());
    notificationRepository.save(notification);
  }

  @Transactional
  public void createMany(Collection<String> userIds, String type, String title, String message) {
    userIds.stream()
        .distinct()
        .forEach(userId -> create(userId, type, title, message));
  }
}
