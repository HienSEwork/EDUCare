package vn.educare.backend.api;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.AuthDtos.BlogPostResponse;
import vn.educare.backend.api.AuthDtos.GameResponse;
import vn.educare.backend.api.AuthDtos.LeaderboardEntry;
import vn.educare.backend.api.AuthDtos.LeaderboardResponse;
import vn.educare.backend.api.AuthDtos.LessonResponse;
import vn.educare.backend.model.UserRole;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.service.ContentService;
import vn.educare.backend.api.AuthDtos.CourseResponse;

@RestController
@RequiredArgsConstructor
public class ContentController {

  private final ContentService contentService;
  private final UserRepository userRepository;

@GetMapping("/api/courses")
public List<CourseResponse> courses() {
  return contentService.courses();
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

  @GetMapping("/api/leaderboard")
  public LeaderboardResponse leaderboard() {
    return new LeaderboardResponse(
        userRepository.findTop10ByRoleAndStreakGreaterThanEqualOrderByStreakDescQuizScoreTotalDescXpDesc(UserRole.STUDENT, 7)
            .stream()
            .map(user -> new LeaderboardEntry(
                user.getFullName(),
                user.getXp(),
                user.getStreak(),
                user.getQuizScoreTotal(),
                user.getAvatarUrl() == null ? "avatar" : user.getAvatarUrl()))
            .toList());
  }
}
