package vn.educare.backend.api;

import java.util.List;
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
import vn.educare.backend.api.AuthDtos.*;
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

  // Course Endpoints
  @GetMapping("/api/admin/courses")
  public List<CourseResponse> getCourses() {
    return adminContentService.getCourses();
  }

  @PostMapping("/api/admin/courses")
  public CourseResponse createCourse(@Valid @RequestBody CourseUpsertRequest request) {
    return adminContentService.saveCourse(null, request);
  }

  @PutMapping("/api/admin/courses/{id}")
  public CourseResponse updateCourse(@PathVariable Long id, @Valid @RequestBody CourseUpsertRequest request) {
    return adminContentService.saveCourse(id, request);
  }

  @DeleteMapping("/api/admin/courses/{id}")
  public void deleteCourse(@PathVariable Long id) {
    adminContentService.deleteCourse(id);
  }

  // Lesson Sources Endpoints
  @PostMapping("/api/admin/lessons/{lessonId}/sources")
  public LessonSourceResponse createLessonSource(@PathVariable Long lessonId, @Valid @RequestBody LessonSourceUpsertRequest request) {
    return adminContentService.saveLessonSource(lessonId, null, request);
  }

  @DeleteMapping("/api/admin/lessons/sources/{id}")
  public void deleteLessonSource(@PathVariable Long id) {
    adminContentService.deleteLessonSource(id);
  }

  // Micro Lessons Endpoints
  @PostMapping("/api/admin/lessons/{lessonId}/micro-lessons")
  public MicroLessonResponse createMicroLesson(@PathVariable Long lessonId, @Valid @RequestBody MicroLessonUpsertRequest request) {
    return adminContentService.saveMicroLesson(lessonId, null, request);
  }

  @PutMapping("/api/admin/micro-lessons/{id}")
  public MicroLessonResponse updateMicroLesson(@PathVariable Long id, @Valid @RequestBody MicroLessonUpsertRequest request) {
    return adminContentService.saveMicroLesson(null, id, request);
  }

  @DeleteMapping("/api/admin/micro-lessons/{id}")
  public void deleteMicroLesson(@PathVariable Long id) {
    adminContentService.deleteMicroLesson(id);
  }

  // Micro Lesson Blocks Endpoints
  @PostMapping("/api/admin/micro-lessons/{microLessonId}/blocks")
  public MicroLessonBlockResponse createMicroLessonBlock(@PathVariable Long microLessonId, @Valid @RequestBody MicroLessonBlockUpsertRequest request) {
    return adminContentService.saveMicroLessonBlock(microLessonId, null, request);
  }

  @PutMapping("/api/admin/micro-lessons/blocks/{id}")
  public MicroLessonBlockResponse updateMicroLessonBlock(@PathVariable Long id, @Valid @RequestBody MicroLessonBlockUpsertRequest request) {
    return adminContentService.saveMicroLessonBlock(null, id, request);
  }

  @DeleteMapping("/api/admin/micro-lessons/blocks/{id}")
  public void deleteMicroLessonBlock(@PathVariable Long id) {
    adminContentService.deleteMicroLessonBlock(id);
  }

  @PutMapping("/api/admin/micro-lessons/{microLessonId}/blocks/reorder")
  public void reorderMicroLessonBlocks(@PathVariable Long microLessonId, @Valid @RequestBody ReorderRequest request) {
    adminContentService.reorderMicroLessonBlocks(microLessonId, request);
  }

  // Categories Endpoints
  @GetMapping("/api/admin/categories")
  public List<CategoryResponse> getCategories() {
    return adminContentService.getCategories();
  }

  @PostMapping("/api/admin/categories")
  public CategoryResponse createCategory(@Valid @RequestBody CategoryUpsertRequest request) {
    return adminContentService.saveCategory(request);
  }

  @PutMapping("/api/admin/categories/{id}")
  public CategoryResponse updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryUpsertRequest request) {
    return adminContentService.updateCategory(id, request);
  }

  @DeleteMapping("/api/admin/categories/{id}")
  public void deleteCategory(@PathVariable Long id) {
    adminContentService.deleteCategory(id);
  }
}

