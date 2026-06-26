package vn.educare.backend.api;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.AuthDtos.AdminContentResponse;
import vn.educare.backend.api.AuthDtos.AdminQuizQuestionResponse;
import vn.educare.backend.api.AuthDtos.BlogPostResponse;
import vn.educare.backend.api.AuthDtos.BlogPostUpsertRequest;
import vn.educare.backend.api.AuthDtos.GameResponse;
import vn.educare.backend.api.AuthDtos.GameUpsertRequest;
import vn.educare.backend.api.AuthDtos.LessonResponse;
import vn.educare.backend.api.AuthDtos.LessonUpsertRequest;
import vn.educare.backend.api.AuthDtos.QuizQuestionUpsertRequest;
import vn.educare.backend.api.AuthDtos.ChatStickerRequest;
import vn.educare.backend.api.AuthDtos.ChatStickerResponse;
import vn.educare.backend.service.AdminContentService;
import vn.educare.backend.service.CommunityService;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminContentController {

  private final AdminContentService adminContentService;
  private final CommunityService communityService;

  @GetMapping("/api/admin/content")
  public AdminContentResponse overview() {
    return adminContentService.overview();
  }

  @PostMapping("/api/admin/lessons")
  public LessonResponse createLesson(@Valid @RequestBody LessonUpsertRequest request) {
    return adminContentService.saveLesson(null, request);
  }

  @PutMapping("/api/admin/lessons/{id}")
  public LessonResponse updateLesson(@PathVariable Long id, @Valid @RequestBody LessonUpsertRequest request) {
    return adminContentService.saveLesson(id, request);
  }

  @DeleteMapping("/api/admin/lessons/{id}")
  public void deleteLesson(@PathVariable Long id) {
    adminContentService.deleteLesson(id);
  }

  @PostMapping("/api/admin/blog-posts")
  public BlogPostResponse createBlogPost(@Valid @RequestBody BlogPostUpsertRequest request) {
    return adminContentService.saveBlogPost(null, request);
  }

  @PutMapping("/api/admin/blog-posts/{id}")
  public BlogPostResponse updateBlogPost(@PathVariable Long id, @Valid @RequestBody BlogPostUpsertRequest request) {
    return adminContentService.saveBlogPost(id, request);
  }

  @DeleteMapping("/api/admin/blog-posts/{id}")
  public void deleteBlogPost(@PathVariable Long id) {
    adminContentService.deleteBlogPost(id);
  }

  @PostMapping("/api/admin/quiz-questions")
  public AdminQuizQuestionResponse createQuizQuestion(@Valid @RequestBody QuizQuestionUpsertRequest request) {
    return adminContentService.saveQuizQuestion(null, request);
  }

  @PutMapping("/api/admin/quiz-questions/{id}")
  public AdminQuizQuestionResponse updateQuizQuestion(@PathVariable Long id, @Valid @RequestBody QuizQuestionUpsertRequest request) {
    return adminContentService.saveQuizQuestion(id, request);
  }

  @DeleteMapping("/api/admin/quiz-questions/{id}")
  public void deleteQuizQuestion(@PathVariable Long id) {
    adminContentService.deleteQuizQuestion(id);
  }

  @PostMapping("/api/admin/games")
  public GameResponse createGame(@Valid @RequestBody GameUpsertRequest request) {
    return adminContentService.saveGame(null, request);
  }

  @PutMapping("/api/admin/games/{id}")
  public GameResponse updateGame(@PathVariable Long id, @Valid @RequestBody GameUpsertRequest request) {
    return adminContentService.saveGame(id, request);
  }

  @DeleteMapping("/api/admin/games/{id}")
  public void deleteGame(@PathVariable Long id) {
    adminContentService.deleteGame(id);
  }

  @PostMapping("/api/admin/stickers")
  public ChatStickerResponse createSticker(@Valid @RequestBody ChatStickerRequest request) {
    return communityService.saveSticker(null, request);
  }

  @PutMapping("/api/admin/stickers/{id}")
  public ChatStickerResponse updateSticker(@PathVariable Long id, @Valid @RequestBody ChatStickerRequest request) {
    return communityService.saveSticker(id, request);
  }

  @DeleteMapping("/api/admin/stickers/{id}")
  public void deleteSticker(@PathVariable Long id) {
    communityService.deleteSticker(id);
  }
}
