package vn.educare.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.*;
import vn.educare.backend.model.*;
import vn.educare.backend.repository.*;

@Service
@RequiredArgsConstructor
public class AdminContentService {

  private final LessonRepository lessonRepository;
  private final BlogPostRepository blogPostRepository;
  private final QuizQuestionRepository quizQuestionRepository;
  private final GameRepository gameRepository;
  private final CourseRepository courseRepository;
  private final CategoryRepository categoryRepository;
  private final LessonSourceRepository lessonSourceRepository;
  private final MicroLessonRepository microLessonRepository;
  private final MicroLessonBlockRepository microLessonBlockRepository;
  private final ContentService contentService;
  private final ObjectMapper objectMapper;

  public AdminContentResponse overview() {
    List<LessonResponse> lessons = lessonRepository.findAllByOrderByLessonOrderAsc().stream().map(contentService::toLessonResponse).toList();
    List<BlogPostResponse> blogPosts = blogPostRepository.findAllByOrderByPublishedAtDesc().stream().map(contentService::toBlogResponse).toList();
    List<AdminQuizQuestionResponse> quizQuestions = quizQuestionRepository.findAllByOrderBySortOrderAsc().stream().map(this::toAdminQuizQuestion).toList();
    List<GameResponse> games = gameRepository.findAllByOrderByCreatedAtDesc().stream().map(contentService::toGameResponse).toList();

    return new AdminContentResponse(
        new AdminContentMetrics(lessons.size(), blogPosts.size(), quizQuestions.size(), games.size()),
        lessons,
        blogPosts,
        quizQuestions,
        games);
  }

  @Transactional
  public LessonResponse saveLesson(Long id, LessonUpsertRequest request) {
    LessonEntity lesson = id == null ? new LessonEntity() : lessonRepository.findById(id).orElseThrow(() -> new ApiException(404, "Lesson not found"));
    if (lesson.getCreatedAt() == null) {
      lesson.setCreatedAt(Instant.now());
    }
    lesson.setUpdatedAt(Instant.now());
    lesson.setSlug(request.slug());
    lesson.setTitle(request.title());
    lesson.setSummary(request.summary());
    lesson.setContent(request.content());
    lesson.setLessonOrder(request.order() == null ? nextLessonOrder() : request.order());
    lesson.setIsFree(Boolean.TRUE.equals(request.isFree()));
    lesson.setCourseId(request.courseId());
    lesson.setXpReward(request.xpReward() != null ? request.xpReward() : (lesson.getXpReward() != null ? lesson.getXpReward() : 10));
    lesson.setEstimatedMinutes(request.estimatedMinutes() != null ? request.estimatedMinutes() : (lesson.getEstimatedMinutes() != null ? lesson.getEstimatedMinutes() : 10));
    lesson.setTeaserVideoId(request.teaserVideoId());
    lesson.setFullVideoId(request.fullVideoId());
    return contentService.toLessonResponse(lessonRepository.save(lesson));
  }

  @Transactional
  public void deleteLesson(Long id) {
    lessonRepository.delete(lessonRepository.findById(id).orElseThrow(() -> new ApiException(404, "Lesson not found")));
  }

  @Transactional
  public BlogPostResponse saveBlogPost(Long id, BlogPostUpsertRequest request) {
    BlogPostEntity post = id == null ? new BlogPostEntity() : blogPostRepository.findById(id).orElseThrow(() -> new ApiException(404, "Blog post not found"));
    if (post.getCreatedAt() == null) {
      post.setCreatedAt(Instant.now());
    }
    post.setUpdatedAt(Instant.now());
    post.setSlug(request.slug());
    post.setTitle(request.title());
    post.setExcerpt(request.excerpt());
    post.setContent(request.content());
    post.setCategory(request.category());
    post.setPublishedAt(LocalDate.parse(request.date()));
    post.setReadTimeMinutes(request.readTimeMinutes() == null ? 5 : request.readTimeMinutes());
    post.setEmoji(request.emoji() == null ? "" : request.emoji().trim());
    post.setAuthor(request.author());
    post.setAuthorTitle(request.authorTitle());
    post.setSourceUrl(request.sourceUrl());
    post.setSourceName(request.sourceName());
    post.setVideoUrl(request.videoUrl());
    return contentService.toBlogResponse(blogPostRepository.save(post));
  }

  @Transactional
  public void deleteBlogPost(Long id) {
    blogPostRepository.delete(blogPostRepository.findById(id).orElseThrow(() -> new ApiException(404, "Blog post not found")));
  }

  @Transactional
  public AdminQuizQuestionResponse saveQuizQuestion(Long id, QuizQuestionUpsertRequest request) {
    QuizQuestionEntity question = id == null ? new QuizQuestionEntity() : quizQuestionRepository.findById(id).orElseThrow(() -> new ApiException(404, "Quiz question not found"));
    if (question.getCreatedAt() == null) {
      question.setCreatedAt(Instant.now());
    }
    question.setUpdatedAt(Instant.now());
    question.setSlug(request.slug());
    question.setPrompt(request.question());
    question.setCategory(request.category());
    question.setDifficulty(request.difficulty());
    question.setQuestionType("MULTIPLE_CHOICE");
    question.setOptionsJson(toOptionsJson(request.options()));
    question.setCorrectIndex(request.correct() == null ? 0 : request.correct());
    question.setExplanation(request.explanation());
    question.setSortOrder(question.getSortOrder() == null ? nextQuizSortOrder() : question.getSortOrder());
    question.setIsActive(request.active() == null || request.active());
    return toAdminQuizQuestion(quizQuestionRepository.save(question));
  }

  @Transactional
  public void deleteQuizQuestion(Long id) {
    quizQuestionRepository.delete(quizQuestionRepository.findById(id).orElseThrow(() -> new ApiException(404, "Quiz question not found")));
  }

  @Transactional
  public GameResponse saveGame(Long id, GameUpsertRequest request) {
    GameEntity game = id == null ? new GameEntity() : gameRepository.findById(id).orElseThrow(() -> new ApiException(404, "Game not found"));
    if (game.getCreatedAt() == null) {
      game.setCreatedAt(Instant.now());
    }
    game.setUpdatedAt(Instant.now());
    game.setSlug(request.slug());
    game.setTitle(request.title());
    game.setSummary(request.summary());
    game.setDescription(request.description());
    game.setGameType(request.gameType());
    game.setPlayPath(request.playPath());
    game.setCoverImage(request.coverImage());
    game.setAccentColor(request.accentColor() == null || request.accentColor().isBlank() ? "#9b5de5" : request.accentColor());
    game.setIsPublished(request.published() == null || request.published());
    return contentService.toGameResponse(gameRepository.save(game));
  }

  @Transactional
  public void deleteGame(Long id) {
    gameRepository.delete(gameRepository.findById(id).orElseThrow(() -> new ApiException(404, "Game not found")));
  }

  private AdminQuizQuestionResponse toAdminQuizQuestion(QuizQuestionEntity question) {
    List<String> options = List.of();
    try {
      if (question.getOptionsJson() != null && question.getOptionsJson().trim().startsWith("[")) {
        options = objectMapper.readValue(question.getOptionsJson(), objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
      } else if (question.getOptionsJson() != null && !question.getOptionsJson().isBlank()) {
        options = List.of(question.getOptionsJson().split(",\\s*"));
      }
    } catch (Exception ignored) {
      if (question.getOptionsJson() != null) {
        options = List.of(question.getOptionsJson().split(",\\s*"));
      }
    }
    return new AdminQuizQuestionResponse(
        question.getId(),
        question.getSlug(),
        question.getPrompt(),
        options,
        question.getCorrectIndex() != null ? question.getCorrectIndex() : 0,
        question.getExplanation(),
        question.getCategory(),
        question.getDifficulty(),
        Boolean.TRUE.equals(question.getIsActive()));
  }

  private String toOptionsJson(List<String> options) {
    try {
      if (options == null || options.size() < 2) {
        throw new ApiException(400, "Quiz question must have at least two options");
      }
      return objectMapper.writeValueAsString(options);
    } catch (ApiException exception) {
      throw exception;
    } catch (Exception exception) {
      throw new ApiException(500, "Unable to save quiz options");
    }
  }

  private int nextLessonOrder() {
    return lessonRepository.findAllByOrderByLessonOrderAsc().stream().mapToInt(LessonEntity::getLessonOrder).max().orElse(0) + 1;
  }

  private int nextQuizSortOrder() {
    return quizQuestionRepository.findAllByOrderBySortOrderAsc().stream().mapToInt(QuizQuestionEntity::getSortOrder).max().orElse(0) + 1;
  }

  // Course CRUD
  @Transactional(readOnly = true)
  public List<CourseResponse> getCourses() {
    return courseRepository.findAll().stream()
        .map(contentService::toCourseResponse)
        .toList();
  }

  @Transactional
  public CourseResponse saveCourse(Long id, CourseUpsertRequest request) {
    CourseEntity course = id == null ? new CourseEntity() : courseRepository.findById(id)
        .orElseThrow(() -> new ApiException(404, "Course not found"));
    
    if (course.getCreatedAt() == null) {
      course.setCreatedAt(Instant.now());
    }
    course.setUpdatedAt(Instant.now());
    course.setTitle(request.title());
    course.setDescription(request.description());
    course.setThumbnail(request.thumbnail());
    course.setColorTheme(request.colorTheme());
    course.setCourseOrder(request.order() == null ? nextCourseOrder() : request.order());
    
    if (request.categoryId() != null) {
      CategoryEntity category = categoryRepository.findById(request.categoryId())
          .orElseThrow(() -> new ApiException(404, "Category not found"));
      course.setCategory(category);
    } else {
      course.setCategory(null);
    }
    
    return contentService.toCourseResponse(courseRepository.save(course));
  }

  @Transactional
  public void deleteCourse(Long id) {
    CourseEntity course = courseRepository.findById(id)
        .orElseThrow(() -> new ApiException(404, "Course not found"));
    courseRepository.delete(course);
  }

  // Lesson Sources
  @Transactional
  public LessonSourceResponse saveLessonSource(Long lessonId, Long id, LessonSourceUpsertRequest request) {
    LessonSourceEntity source = id == null ? new LessonSourceEntity() : lessonSourceRepository.findById(id)
        .orElseThrow(() -> new ApiException(404, "Lesson source not found"));
    
    if (lessonId != null) {
      source.setLessonId(lessonId);
    }
    source.setSourceName(request.sourceName());
    source.setSourceUrl(request.sourceUrl());
    source.setSourceType(request.sourceType() == null ? "website" : request.sourceType());
    
    return toLessonSourceResponse(lessonSourceRepository.save(source));
  }

  @Transactional
  public void deleteLessonSource(Long id) {
    LessonSourceEntity source = lessonSourceRepository.findById(id)
        .orElseThrow(() -> new ApiException(404, "Lesson source not found"));
    lessonSourceRepository.delete(source);
  }

  // Micro Lessons
  @Transactional
  public MicroLessonResponse saveMicroLesson(Long lessonId, Long id, MicroLessonUpsertRequest request) {
    MicroLessonEntity ml = id == null ? new MicroLessonEntity() : microLessonRepository.findById(id)
        .orElseThrow(() -> new ApiException(404, "Micro lesson not found"));
    
    if (ml.getCreatedAt() == null) {
      ml.setCreatedAt(Instant.now());
    }
    ml.setUpdatedAt(Instant.now());
    if (lessonId != null) {
      ml.setLessonId(lessonId);
    }
    ml.setTitle(request.title());
    ml.setMicroOrder(request.order() == null ? nextMicroOrder(ml.getLessonId()) : request.order());
    
    return toMicroLessonResponse(microLessonRepository.save(ml));
  }

  @Transactional
  public void deleteMicroLesson(Long id) {
    MicroLessonEntity ml = microLessonRepository.findById(id)
        .orElseThrow(() -> new ApiException(404, "Micro lesson not found"));
    
    // Also delete associated blocks to maintain database integrity
    microLessonBlockRepository.deleteAll(microLessonBlockRepository.findAllByMicroLessonIdOrderByOrderIndexAsc(id));
    microLessonRepository.delete(ml);
  }

  // Micro Lesson Blocks
  @Transactional
  public MicroLessonBlockResponse saveMicroLessonBlock(Long microLessonId, Long id, MicroLessonBlockUpsertRequest request) {
    MicroLessonBlockEntity block = id == null ? new MicroLessonBlockEntity() : microLessonBlockRepository.findById(id)
        .orElseThrow(() -> new ApiException(404, "Micro lesson block not found"));
    
    if (block.getCreatedAt() == null) {
      block.setCreatedAt(Instant.now());
    }
    block.setUpdatedAt(Instant.now());
    if (microLessonId != null) {
      block.setMicroLessonId(microLessonId);
    }
    block.setBlockType(request.blockType());
    block.setContentJson(request.contentJson());
    if (request.orderIndex() != null) {
      block.setOrderIndex(request.orderIndex());
    } else if (block.getOrderIndex() == null) {
      block.setOrderIndex(nextBlockOrderIndex(block.getMicroLessonId()));
    }
    
    return toMicroLessonBlockResponse(microLessonBlockRepository.save(block));
  }

  @Transactional
  public void deleteMicroLessonBlock(Long id) {
    MicroLessonBlockEntity block = microLessonBlockRepository.findById(id)
        .orElseThrow(() -> new ApiException(404, "Micro lesson block not found"));
    microLessonBlockRepository.delete(block);
  }

  @Transactional
  public void reorderMicroLessonBlocks(Long microLessonId, ReorderRequest request) {
    if (!microLessonRepository.existsById(microLessonId)) {
      throw new ApiException(404, "Micro lesson not found");
    }
    List<Long> blockIds = request.blockIds();
    if (blockIds == null || blockIds.isEmpty()) {
      return;
    }
    List<MicroLessonBlockEntity> blocks = microLessonBlockRepository.findAllByMicroLessonIdOrderByOrderIndexAsc(microLessonId);
    for (int i = 0; i < blockIds.size(); i++) {
      Long blockId = blockIds.get(i);
      int orderIndex = i + 1;
      blocks.stream()
          .filter(b -> b.getId().equals(blockId))
          .findFirst()
          .ifPresent(b -> {
            b.setOrderIndex(orderIndex);
            microLessonBlockRepository.save(b);
          });
    }
  }

  private int nextCourseOrder() {
    return courseRepository.findAll().stream()
        .mapToInt(c -> c.getCourseOrder() != null ? c.getCourseOrder() : 0)
        .max()
        .orElse(0) + 1;
  }

  private int nextMicroOrder(Long lessonId) {
    if (lessonId == null) return 1;
    return microLessonRepository.findAllByLessonIdOrderByMicroOrderAsc(lessonId).stream()
        .mapToInt(ml -> ml.getMicroOrder() != null ? ml.getMicroOrder() : 0)
        .filter(order -> order < 99)
        .max()
        .orElse(0) + 1;
  }

  private int nextBlockOrderIndex(Long microLessonId) {
    if (microLessonId == null) return 1;
    return microLessonBlockRepository.findAllByMicroLessonIdOrderByOrderIndexAsc(microLessonId).stream()
        .mapToInt(b -> b.getOrderIndex() != null ? b.getOrderIndex() : 0)
        .max()
        .orElse(0) + 1;
  }

  private LessonSourceResponse toLessonSourceResponse(LessonSourceEntity s) {
    return new LessonSourceResponse(s.getId(), s.getSourceName(), s.getSourceUrl(), s.getSourceType());
  }

  private MicroLessonResponse toMicroLessonResponse(MicroLessonEntity ml) {
    List<MicroLessonBlockResponse> blocks = microLessonBlockRepository
        .findAllByMicroLessonIdOrderByOrderIndexAsc(ml.getId()).stream()
        .map(b -> new MicroLessonBlockResponse(b.getId(), b.getBlockType(), b.getContentJson(), b.getOrderIndex()))
        .toList();
    return new MicroLessonResponse(ml.getId(), ml.getTitle(), ml.getMicroOrder(), false, blocks);
  }

  private MicroLessonBlockResponse toMicroLessonBlockResponse(MicroLessonBlockEntity b) {
    return new MicroLessonBlockResponse(b.getId(), b.getBlockType(), b.getContentJson(), b.getOrderIndex());
  }

  @Transactional(readOnly = true)
  public List<CategoryResponse> getCategories() {
    return categoryRepository.findAll().stream()
        .map(this::toCategoryResponse)
        .toList();
  }

  @Transactional
  public CategoryResponse saveCategory(CategoryUpsertRequest request) {
    if (categoryRepository.existsBySlug(request.slug())) {
      throw new ApiException(400, "Đường dẫn danh mục (slug) đã tồn tại");
    }
    CategoryEntity cat = new CategoryEntity();
    cat.setName(request.name());
    cat.setSlug(request.slug());
    cat.setIcon(request.icon() == null || request.icon().isBlank() ? "HelpCircle" : request.icon());
    cat.setColorTheme(request.colorTheme() == null || request.colorTheme().isBlank() ? "#4361ee" : request.colorTheme());
    return toCategoryResponse(categoryRepository.save(cat));
  }

  @Transactional
  public CategoryResponse updateCategory(Long id, CategoryUpsertRequest request) {
    CategoryEntity cat = categoryRepository.findById(id)
        .orElseThrow(() -> new ApiException(404, "Danh mục không tồn tại"));
    if (!cat.getSlug().equals(request.slug()) && categoryRepository.existsBySlug(request.slug())) {
      throw new ApiException(400, "Đường dẫn danh mục (slug) đã tồn tại");
    }
    cat.setName(request.name());
    cat.setSlug(request.slug());
    cat.setIcon(request.icon() == null || request.icon().isBlank() ? "HelpCircle" : request.icon());
    cat.setColorTheme(request.colorTheme() == null || request.colorTheme().isBlank() ? "#4361ee" : request.colorTheme());
    return toCategoryResponse(categoryRepository.save(cat));
  }

  @Transactional
  public void deleteCategory(Long id) {
    CategoryEntity cat = categoryRepository.findById(id)
        .orElseThrow(() -> new ApiException(404, "Danh mục không tồn tại"));
    
    // Dissociate courses belonging to this category
    List<CourseEntity> courses = courseRepository.findAllByCategoryId(id);
    for (CourseEntity course : courses) {
      course.setCategory(null);
      courseRepository.save(course);
    }
    
    categoryRepository.delete(cat);
  }

  private CategoryResponse toCategoryResponse(CategoryEntity cat) {
    if (cat == null) return null;
    return new CategoryResponse(
        cat.getId(),
        cat.getSlug(),
        cat.getName(),
        cat.getIcon(),
        cat.getColorTheme()
    );
  }
}
