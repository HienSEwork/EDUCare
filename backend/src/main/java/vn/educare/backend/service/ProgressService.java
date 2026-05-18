package vn.educare.backend.service;

import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.ProgressResponse;
import vn.educare.backend.model.LessonEntity;
import vn.educare.backend.model.LessonProgressEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.repository.LessonProgressRepository;
import vn.educare.backend.repository.LessonRepository;
import vn.educare.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ProgressService {

  private final LessonRepository lessonRepository;
  private final LessonProgressRepository lessonProgressRepository;
  private final UserRepository userRepository;
  private final AuthService authService;
  private final NotificationService notificationService;

  @Transactional
  public ProgressResponse completeLesson(String userId, String lessonSlug) {
    LessonEntity lesson = lessonRepository.findBySlug(lessonSlug)
        .or(() -> resolveLegacyLesson(lessonSlug))
        .orElseThrow(() -> new ApiException(404, "Lesson not found"));
    UserEntity user = userRepository.findById(userId).orElseThrow(() -> new ApiException(404, "User not found"));

    if (lessonProgressRepository.findByUserIdAndLessonId(userId, lesson.getId()).isPresent()) {
      return new ProgressResponse(authService.mapUser(user), 0);
    }

    LessonProgressEntity progress = new LessonProgressEntity();
    progress.setUserId(userId);
    progress.setLessonId(lesson.getId());
    progress.setXpAwarded(50);
    progress.setCompletedAt(Instant.now());
    lessonProgressRepository.save(progress);

    user.setXp(user.getXp() + 50);
    user.setStreak(user.getStreak() + 1);
    userRepository.save(user);

    notificationService.create(userId, "lesson", "Lesson completed", "You completed " + lesson.getTitle() + " and earned 50 XP.");
    return new ProgressResponse(authService.mapUser(user), 50);
  }

  @Transactional
  public ProgressResponse addXp(String userId, int amount) {
    UserEntity user = userRepository.findById(userId).orElseThrow(() -> new ApiException(404, "User not found"));
    user.setXp(user.getXp() + amount);
    userRepository.save(user);
    notificationService.create(userId, "xp", "XP updated", "You received " + amount + " XP.");
    return new ProgressResponse(authService.mapUser(user), amount);
  }

  private java.util.Optional<LessonEntity> resolveLegacyLesson(String lessonSlug) {
    if (!lessonSlug.startsWith("lesson-")) {
      return java.util.Optional.empty();
    }

    try {
      int lessonOrder = Integer.parseInt(lessonSlug.substring("lesson-".length()));
      return lessonRepository.findAllByOrderByLessonOrderAsc().stream()
          .filter(lesson -> lesson.getLessonOrder() == lessonOrder)
          .findFirst();
    } catch (NumberFormatException exception) {
      return java.util.Optional.empty();
    }
  }
}
