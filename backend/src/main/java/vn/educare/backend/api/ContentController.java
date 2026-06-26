package vn.educare.backend.api;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.AuthDtos.BlogPostResponse;
import vn.educare.backend.api.AuthDtos.GameLeaderboardResponse;
import vn.educare.backend.api.AuthDtos.GameResponse;
import vn.educare.backend.api.AuthDtos.GameScoreSubmitRequest;
import vn.educare.backend.api.AuthDtos.GameScoreSubmitResponse;
import vn.educare.backend.api.AuthDtos.LeaderboardEntry;
import vn.educare.backend.api.AuthDtos.LeaderboardResponse;
import vn.educare.backend.api.AuthDtos.LessonResponse;
import vn.educare.backend.model.UserRole;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.service.ContentService;
import vn.educare.backend.service.GameScoreService;
import vn.educare.backend.api.AuthDtos.CourseResponse;
import vn.educare.backend.api.AuthDtos.RecommendQuestionResponse;

@RestController
@RequiredArgsConstructor
public class ContentController {

  private final ContentService contentService;
  private final UserRepository userRepository;
  private final GameScoreService gameScoreService;
  private final CurrentUser currentUser;

  @GetMapping("/api/courses/questions")
  public List<RecommendQuestionResponse> recommendQuestions() {
    return contentService.recommendQuestions();
  }

  @GetMapping("/api/courses")
  public List<CourseResponse> courses() {
    return contentService.courses();
  }

  @GetMapping("/api/courses/{id}")
  public CourseResponse course(@PathVariable Long id) {
    return contentService.course(id);
  }

  @GetMapping("/api/lessons")
  public List<LessonResponse> lessons() {
    return contentService.lessons();
  }

  @GetMapping("/api/lessons/{slug}")
  public LessonResponse lesson(@PathVariable String slug) {
    return contentService.lesson(slug);
  }

  @GetMapping("/api/blog-posts")
  public List<BlogPostResponse> blogPosts() {
    return contentService.blogPosts();
  }

  @GetMapping("/api/blog-posts/{slug}")
  public BlogPostResponse blogPost(@PathVariable String slug) {
    return contentService.blogPost(slug);
  }

  @GetMapping("/api/games")
  public List<GameResponse> games() {
    return contentService.games();
  }

  @PostMapping("/api/games/{slug}/score")
  public GameScoreSubmitResponse submitScore(
      @PathVariable String slug,
      @RequestBody GameScoreSubmitRequest request) {
    return gameScoreService.submitScore(slug, currentUser.id(), request);
  }

  @GetMapping("/api/games/{slug}/leaderboard")
  public GameLeaderboardResponse gameLeaderboard(@PathVariable String slug) {
    return gameScoreService.leaderboard(slug, currentUser.idOrNull());
  }

  @GetMapping("/api/leaderboard")
  public LeaderboardResponse leaderboard() {
    return new LeaderboardResponse(
        userRepository.findTop10ByRoleAndStreakGreaterThanEqualOrderByStreakDescQuizScoreTotalDescXpDesc(
                UserRole.STUDENT, 7)
            .stream()
            .map(user -> new LeaderboardEntry(
                user.getFullName(),
                user.getXp(),
                user.getStreak(),
                user.getQuizScoreTotal(),
                user.getAvatarUrl() == null ? "avatar" : user.getAvatarUrl()))
            .toList());
  }

  @PostMapping("/api/courses/{courseId}/enroll")
  public void enroll(@PathVariable Long courseId) {
    contentService.enroll(courseId);
  }

  @GetMapping("/api/courses/my-learning")
  public List<CourseResponse> myLearning() {
    return contentService.myLearning();
  }
}
