package vn.educare.backend.service;

import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.AdminDashboardResponse;
import vn.educare.backend.api.AuthDtos.DashboardResponse;
import vn.educare.backend.api.AuthDtos.NotificationResponse;
import vn.educare.backend.model.ChatRoomEntity;
import vn.educare.backend.model.LessonEntity;
import vn.educare.backend.model.LessonProgressEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserPlan;
import vn.educare.backend.model.UserRole;
import vn.educare.backend.repository.AnonymousQuestionRepository;
import vn.educare.backend.repository.ChatMessageRepository;
import vn.educare.backend.repository.ChatRoomRepository;
import vn.educare.backend.repository.CommunityPostRepository;
import vn.educare.backend.repository.GameRepository;
import vn.educare.backend.repository.LessonProgressRepository;
import vn.educare.backend.repository.LessonRepository;
import vn.educare.backend.repository.NotificationRepository;
import vn.educare.backend.repository.QuizAttemptRepository;
import vn.educare.backend.repository.QuizQuestionRepository;
import vn.educare.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class DashboardService {

  private final UserRepository userRepository;
  private final LessonRepository lessonRepository;
  private final LessonProgressRepository lessonProgressRepository;
  private final NotificationRepository notificationRepository;
  private final CommunityPostRepository communityPostRepository;
  private final AnonymousQuestionRepository anonymousQuestionRepository;
  private final ChatRoomRepository chatRoomRepository;
  private final ChatMessageRepository chatMessageRepository;
  private final GameRepository gameRepository;
  private final QuizQuestionRepository quizQuestionRepository;
  private final QuizAttemptRepository quizAttemptRepository;

  public DashboardResponse userDashboard(String userId) {
    UserEntity user = userRepository.findById(userId).orElseThrow(() -> new ApiException(404, "User not found"));
    List<LessonEntity> lessons = lessonRepository.findAllByOrderByLessonOrderAsc();
    List<LessonProgressEntity> progress = lessonProgressRepository.findAllByUserIdOrderByCompletedAtAsc(userId);
    List<Long> completedIds = progress.stream().map(LessonProgressEntity::getLessonId).toList();
    List<LessonEntity> recentLessons = lessons.stream()
        .filter(lesson -> completedIds.contains(lesson.getId()))
        .sorted(Comparator.comparing(LessonEntity::getLessonOrder).reversed())
        .limit(3)
        .toList();
    LessonEntity nextLesson = lessons.stream().filter(lesson -> !completedIds.contains(lesson.getId())).findFirst().orElse(null);

    return new DashboardResponse(
        new DashboardResponse.Summary(
            lessons.size(),
            completedIds.size(),
            lessons.isEmpty() ? 0 : Math.round((completedIds.size() * 100f) / lessons.size()),
            user.getXp(),
            user.getStreak(),
            user.getQuizScoreTotal(),
            user.getPlan().name().toLowerCase()),
        recentLessons.stream()
            .map(lesson -> new DashboardResponse.RecentLesson(lesson.getSlug(), lesson.getTitle(), lesson.getLessonOrder(), progress.stream()
                .filter(item -> item.getLessonId().equals(lesson.getId()))
                .findFirst()
                .map(item -> item.getCompletedAt().toString())
                .orElse(null)))
            .toList(),
        nextLesson == null ? null : new DashboardResponse.NextLesson(nextLesson.getSlug(), nextLesson.getTitle(), nextLesson.getLessonOrder(), nextLesson.getIsFree()),
        notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(item -> new NotificationResponse(item.getId(), item.getType(), item.getTitle(), item.getMessage(), item.getIsRead(), item.getCreatedAt().toString()))
            .toList());
  }

  public AdminDashboardResponse adminDashboard() {
    List<UserEntity> users = userRepository.findAll();
    List<LessonEntity> lessons = lessonRepository.findAllByOrderByLessonOrderAsc();
    List<ChatRoomEntity> rooms = chatRoomRepository.findAllByOrderByIdAsc();

    long premiumUsers = users.stream().filter(user -> user.getPlan() == UserPlan.POPULAR || user.getPlan() == UserPlan.PREMIUM).count();
    long averageXp = Math.round(userRepository.averageXp() == null ? 0 : userRepository.averageXp());

    return new AdminDashboardResponse(
        new AdminDashboardResponse.AdminSummary(
            users.size(),
            userRepository.countByRole(UserRole.ADMIN),
            premiumUsers,
            averageXp,
            lessonProgressRepository.totalCompletions(),
            communityPostRepository.count(),
            anonymousQuestionRepository.count(),
            quizQuestionRepository.count(),
            gameRepository.count(),
            quizAttemptRepository.totalAttempts()),
        users.stream()
            .sorted(Comparator.comparing(UserEntity::getCreatedAt).reversed())
            .limit(8)
            .map(user -> new AdminDashboardResponse.AdminRecentUser(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getUsername(),
                user.getPlan().name().toLowerCase(),
                user.getRole().name().toLowerCase(),
                user.getXp(),
                user.getCreatedAt().toString()))
            .toList(),
        List.of(
            new AdminDashboardResponse.AdminPlanDistribution("free", users.stream().filter(user -> user.getPlan() == UserPlan.FREE).count()),
            new AdminDashboardResponse.AdminPlanDistribution("popular", users.stream().filter(user -> user.getPlan() == UserPlan.POPULAR).count()),
            new AdminDashboardResponse.AdminPlanDistribution("premium", users.stream().filter(user -> user.getPlan() == UserPlan.PREMIUM).count())),
        lessons.stream()
            .map(lesson -> new AdminDashboardResponse.AdminLessonCompletion(
                lesson.getSlug(),
                lesson.getTitle(),
                lessonProgressRepository.findAll().stream().filter(progress -> progress.getLessonId().equals(lesson.getId())).count()))
            .toList(),
        rooms.stream()
            .map(room -> new AdminDashboardResponse.AdminChatRoom(room.getSlug(), room.getName(), chatMessageRepository.countByRoomId(room.getId())))
            .toList());
  }
}
