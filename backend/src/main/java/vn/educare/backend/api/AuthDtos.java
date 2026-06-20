package vn.educare.backend.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import vn.educare.backend.model.MoodCode;

public final class AuthDtos {

  private AuthDtos() {
  }

  public record RegisterRequest(
      @NotBlank @Size(min = 2, max = 120) String fullName,
      @NotBlank @Email String email,
      @NotBlank @Size(min = 3, max = 50) String username,
      @NotBlank @Size(min = 6, max = 120) String password,
      @Min(10) @Max(20) int age) {
  }

  public record LoginRequest(@NotBlank String login, @NotBlank String password) {
  }

  public record AuthResponse(String token, UserResponse user) {
  }

  public record UserResponse(
      String id,
      String fullName,
      String email,
      String username,
      Integer age,
      String plan,
      Integer xp,
      Integer streak,
      Integer quizScore,
      String avatar,
      String role,
      boolean isAdmin,
      List<String> completedLessons,
      String createdAt,
      String subscriptionEndDate,
      String subscriptionPlanId) {
  }

public record LessonSourceResponse(
    Long id,
    String sourceName,
    String sourceUrl,
    String sourceType
) {}

public record LessonResponse(
    Long id,
    String slug,
    String title,
    String summary,
    String content,
    Integer order,
    Boolean isFree,

    Long courseId,
    Integer xpReward,
    Integer estimatedMinutes,
    String courseColorTheme,
    String teaserVideoId,
    String fullVideoId,
    List<MicroLessonResponse> microLessons,
    List<LessonSourceResponse> sources
) {}

  public record MicroLessonBlockResponse(
    Long id,
    String blockType,
    String contentJson,
    Integer orderIndex
) {}

public record MicroLessonResponse(
    Long id,
    String title,
    Integer order,
    Boolean completed,
    List<MicroLessonBlockResponse> blocks
) {}

public record RecommendQuestionResponse(
    Long id,
    String emoji,
    String question,
    String reason,
    String targetTag
) {}

public record CategoryResponse(
    Long id,
    String slug,
    String name,
    String icon,
    String colorTheme
) {}

public record CourseResponse(
    Long id,
    String title,
    String description,
    String thumbnail,
    String colorTheme,
    Integer order,
    List<LessonResponse> lessons,
    Boolean enrolled,
    CategoryResponse category
) {}

  public record BlogPostResponse(
      Long id,
      String slug,
      String title,
      String excerpt,
      String content,
      String category,
      String date,
      String readTime,
      String emoji) {
  }

  public record QuizQuestionResponse(
      Long id,
      String question,
      List<String> options,
      Integer correct,
      String explanation) {
  }

  public record GameResponse(
      Long id,
      String slug,
      String title,
      String summary,
      String description,
      String gameType,
      String playPath,
      String coverImage,
      String accentColor,
      boolean published) {
  }

  public record QuizPlayQuestionResponse(
      Long id,
      String question,
      List<String> options,
      String category,
      String difficulty) {
  }

  public record QuizSessionResponse(String mode, int totalQuestions, List<QuizPlayQuestionResponse> questions) {
  }

  public record QuizAnswerRequest(Long questionId, Integer selectedIndex) {
  }

  public record QuizSubmitRequest(@NotBlank String mode, List<QuizAnswerRequest> answers) {
  }

  public record QuizReviewResponse(
      Long questionId,
      String question,
      Integer selectedIndex,
      Integer correctIndex,
      String explanation) {
  }

  public record QuizResultResponse(
      int correctAnswers,
      int totalQuestions,
      int score,
      int awardedXp,
      int streak,
      int quizScore,
      List<QuizReviewResponse> reviews,
      UserResponse user) {
  }

  public record LeaderboardResponse(List<LeaderboardEntry> entries) {
  }

  public record LeaderboardEntry(String name, int xp, int streak, int quizScore, String avatar) {
  }

  public record DashboardResponse(
      Summary summary,
      List<RecentLesson> recentLessons,
      NextLesson nextLesson,
      List<NotificationResponse> notifications) {
    public record Summary(int totalLessons, int completedLessons, int progressPercentage, int xp, int streak, int quizScore, String plan) {
    }

    public record RecentLesson(String slug, String title, Integer order, String completedAt) {
    }

    public record NextLesson(String slug, String title, Integer order, boolean isFree) {
    }
  }

  public record ProgressResponse(UserResponse user, int awardedXp) {
  }

  public record CompleteLessonRequest() {
  }

  public record AddXpRequest(@Min(1) @Max(500) int amount) {
  }

  public record CommunityPostRequest(@NotBlank @Size(max = 2000) String content, boolean anonymous) {
  }

  public record CommunityReplyRequest(@NotBlank @Size(max = 1000) String content, boolean anonymous) {
  }

  public record CommunityPostResponse(
      Long id,
      String author,
      String authorId,
      String content,
      boolean anonymous,
      int likes,
      boolean liked,
      String createdAt,
      List<CommunityReplyResponse> replies) {
  }

  public record CommunityReplyResponse(
      Long id,
      String author,
      String authorId,
      String content,
      boolean anonymous,
      int likes,
      boolean liked,
      String createdAt) {
  }

  public record ChatRoomResponse(Long id, String slug, String name, String description, long messageCount) {
  }

  public record ChatMessageRequest(@NotBlank @Size(max = 1000) String content) {
  }

  public record ChatMessageResponse(Long id, String author, String authorId, String content, String createdAt) {
  }

  public record AnonymousQuestionRequest(@NotBlank @Size(max = 1000) String question) {
  }

  public record AnonymousQuestionResponse(Long id, String question, String answer, int likes, boolean liked, String createdAt) {
  }

  public record MoodRequest(MoodCode moodCode, String note) {
  }

  public record MoodEntryResponse(Long id, MoodCode moodCode, String note, LocalDate entryDate) {
  }

  public record NotificationResponse(Long id, String type, String title, String message, boolean read, String createdAt) {
  }

  public record AdminDashboardResponse(
      AdminSummary summary,
      List<AdminRecentUser> recentUsers,
      List<AdminPlanDistribution> planDistribution,
      List<AdminLessonCompletion> lessonCompletion,
      List<AdminChatRoom> chatRooms) {
    public record AdminSummary(
        long totalUsers,
        long totalAdmins,
        long premiumUsers,
        long averageXp,
        long lessonCompletions,
        long communityPosts,
        long anonymousQuestions,
        long totalQuizQuestions,
        long totalGames,
        long totalQuizAttempts) {
    }

    public record AdminRecentUser(String id, String fullName, String email, String username, String plan, String role, int xp, String createdAt) {
    }

    public record AdminPlanDistribution(String plan, long total) {
    }

    public record AdminLessonCompletion(String slug, String title, long total) {
    }

    public record AdminChatRoom(String slug, String name, long messageCount) {
    }
  }

  public record AdminContentResponse(
      AdminContentMetrics metrics,
      List<LessonResponse> lessons,
      List<BlogPostResponse> blogPosts,
      List<AdminQuizQuestionResponse> quizQuestions,
      List<GameResponse> games) {
  }

  public record AdminContentMetrics(long lessons, long blogPosts, long quizQuestions, long games) {
  }

  public record AdminQuizQuestionResponse(
      Long id,
      String slug,
      String question,
      List<String> options,
      Integer correct,
      String explanation,
      String category,
      String difficulty,
      boolean active) {
  }

  public record LessonUpsertRequest(
      @NotBlank String slug,
      @NotBlank String title,
      @NotBlank String summary,
      @NotBlank String content,
      Integer order,
      Boolean isFree) {
  }

  public record BlogPostUpsertRequest(
      @NotBlank String slug,
      @NotBlank String title,
      @NotBlank String excerpt,
      @NotBlank String content,
      @NotBlank String category,
      @NotBlank String date,
      Integer readTimeMinutes,
      @NotBlank String emoji) {
  }

  public record QuizQuestionUpsertRequest(
      @NotBlank String slug,
      @NotBlank String question,
      List<String> options,
      Integer correct,
      String explanation,
      @NotBlank String category,
      @NotBlank String difficulty,
      Boolean active) {
  }

  public record GameUpsertRequest(
      @NotBlank String slug,
      @NotBlank String title,
      @NotBlank String summary,
      @NotBlank String description,
      @NotBlank String gameType,
      @NotBlank String playPath,
      String coverImage,
      String accentColor,
      Boolean published) {
  }
}
