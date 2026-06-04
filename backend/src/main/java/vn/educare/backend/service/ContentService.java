package vn.educare.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.BlogPostResponse;
import vn.educare.backend.api.AuthDtos.GameResponse;
import vn.educare.backend.api.AuthDtos.LessonResponse;
import vn.educare.backend.api.AuthDtos.MicroLessonBlockResponse;
import vn.educare.backend.api.AuthDtos.MicroLessonResponse;
import vn.educare.backend.api.AuthDtos.QuizQuestionResponse;
import vn.educare.backend.model.BlogPostEntity;
import vn.educare.backend.model.GameEntity;
import vn.educare.backend.model.LessonEntity;
import vn.educare.backend.model.MicroLessonBlockEntity;
import vn.educare.backend.model.MicroLessonEntity;
import vn.educare.backend.model.QuizQuestionEntity;
import vn.educare.backend.repository.BlogPostRepository;
import vn.educare.backend.repository.GameRepository;
import vn.educare.backend.repository.LessonRepository;
import vn.educare.backend.repository.MicroLessonBlockRepository;
import vn.educare.backend.repository.MicroLessonRepository;
import vn.educare.backend.repository.QuizQuestionRepository;
import vn.educare.backend.api.AuthDtos.CourseResponse;
import vn.educare.backend.api.AuthDtos.LessonSourceResponse;
import vn.educare.backend.api.CurrentUser;
import vn.educare.backend.model.CourseEntity;
import vn.educare.backend.model.LessonSourceEntity;
import vn.educare.backend.model.MicroLessonProgressEntity;
import vn.educare.backend.repository.CourseRepository;
import vn.educare.backend.repository.LessonSourceRepository;
import vn.educare.backend.repository.MicroLessonProgressRepository;
import vn.educare.backend.repository.CourseEnrollmentRepository;

@Service
@RequiredArgsConstructor
public class ContentService {

  private final LessonRepository lessonRepository;
  private final BlogPostRepository blogPostRepository;
  private final GameRepository gameRepository;
  private final QuizQuestionRepository quizQuestionRepository;

  // NEW repositories for micro lessons structure
  private final MicroLessonRepository microLessonRepository;
  private final MicroLessonBlockRepository microLessonBlockRepository;
  private final CourseRepository courseRepository;
  private final CurrentUser currentUser;
  private final MicroLessonProgressRepository microLessonProgressRepository;
  private final LessonSourceRepository lessonSourceRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;


  private final ObjectMapper objectMapper;

  public List<LessonResponse> lessons() {
    // Note: This will now include microLessons as well (N+1 queries).
    // If performance becomes an issue, we can optimize with batch fetching or custom queries.
    return lessonRepository.findAllByOrderByLessonOrderAsc()
        .stream()
        .map(this::toLessonResponse)
        .toList();
  }

public List<CourseResponse> courses() {
  return courseRepository.findAllByOrderByCourseOrderAsc()
      .stream()
      .map(this::toCourseResponse)
      .toList();
}

public CourseResponse course(Long id) {
  return courseRepository.findById(id)
      .map(this::toCourseResponse)
      .orElseThrow(() -> new ApiException(404, "Course not found"));
}

  public LessonResponse lesson(String slug) {
    return lessonRepository.findBySlug(slug)
        .map(this::toLessonResponse)
        .orElseThrow(() -> new ApiException(404, "Lesson not found"));
  }

  public List<BlogPostResponse> blogPosts() {
    return blogPostRepository.findAllByOrderByPublishedAtDesc()
        .stream()
        .map(this::toBlogResponse)
        .toList();
  }

  public BlogPostResponse blogPost(String slug) {
    return blogPostRepository.findBySlug(slug)
        .map(this::toBlogResponse)
        .orElseThrow(() -> new ApiException(404, "Blog post not found"));
  }

  public List<GameResponse> games() {
    return gameRepository.findAllByIsPublishedTrueOrderByCreatedAtDesc()
        .stream()
        .map(this::toGameResponse)
        .toList();
  }

  public List<QuizQuestionResponse> quizzes() {
    return quizQuestionRepository.findAllByOrderBySortOrderAsc()
        .stream()
        .map(this::toQuizResponse)
        .toList();
  }

  public LessonResponse toLessonResponse(LessonEntity lesson) {
    // Load micro lessons
    List<MicroLessonEntity> microLessons = microLessonRepository
        .findAllByLessonIdOrderByMicroOrderAsc(lesson.getId());

    String userId = currentUser.idOrNull();
    final List<Long> completedMicroLessonIds;
    if (userId != null) {
      completedMicroLessonIds = microLessonProgressRepository.findAllByUserId(userId).stream()
          .filter(p -> Boolean.TRUE.equals(p.getCompleted()))
          .map(MicroLessonProgressEntity::getMicroLessonId)
          .toList();
    } else {
      completedMicroLessonIds = List.of();
    }

    // Map micro lessons -> include blocks
    List<MicroLessonResponse> microLessonResponses = microLessons.stream()
        .map(ml -> toMicroLessonResponse(ml, completedMicroLessonIds))
        .toList();

    // NEW: resolve course color theme for accent UI
    String courseColorTheme = null;
    if (lesson.getCourseId() != null) {
      courseColorTheme = courseRepository.findById(lesson.getCourseId())
          .map(CourseEntity::getColorTheme)
          .orElse(null);
    }

    // Load lesson sources
    List<LessonSourceResponse> sourceResponses = lessonSourceRepository.findAllByLessonId(lesson.getId()).stream()
        .map(s -> new LessonSourceResponse(s.getId(), s.getSourceName(), s.getSourceUrl(), s.getSourceType()))
        .toList();

    return new LessonResponse(
        lesson.getId(),
        lesson.getSlug(),
        lesson.getTitle(),
        lesson.getSummary(),
        lesson.getContent(),
        lesson.getLessonOrder(),
        lesson.getIsFree(),

        lesson.getCourseId(),
        lesson.getXpReward(),
        lesson.getEstimatedMinutes(),

        courseColorTheme, 

        microLessonResponses,
        sourceResponses
    );
  }

  private MicroLessonResponse toMicroLessonResponse(MicroLessonEntity microLesson, List<Long> completedMicroLessonIds) {
    List<MicroLessonBlockEntity> blocks = microLessonBlockRepository
        .findAllByMicroLessonIdOrderByOrderIndexAsc(microLesson.getId());

    List<MicroLessonBlockResponse> blockResponses = blocks.stream()
        .map(b -> new MicroLessonBlockResponse(
            b.getId(),
            b.getBlockType(),
            b.getContentJson(),
            b.getOrderIndex()
        ))
        .toList();

    boolean completed = completedMicroLessonIds.contains(microLesson.getId());

    return new MicroLessonResponse(
        microLesson.getId(),
        microLesson.getTitle(),
        microLesson.getMicroOrder(),
        completed,
        blockResponses
    );
  }

  private CourseResponse toCourseResponse(CourseEntity course) {
    var lessons = lessonRepository.findAllByCourseIdOrderByLessonOrderAsc(course.getId())
        .stream()
        .map(this::toLessonResponse)
        .toList();

    String userId = currentUser.idOrNull();
    boolean enrolled = false;
    if (userId != null) {
      enrolled = courseEnrollmentRepository.existsByUserIdAndCourseId(userId, course.getId());
    }

    return new CourseResponse(
        course.getId(),
        course.getTitle(),
        course.getDescription(),
        course.getThumbnail(),
        course.getColorTheme(),
        course.getCourseOrder(),
        lessons,
        enrolled
    );
  }

  public BlogPostResponse toBlogResponse(BlogPostEntity post) {
    return new BlogPostResponse(
        post.getId(),
        post.getSlug(),
        post.getTitle(),
        post.getExcerpt(),
        post.getContent(),
        post.getCategory(),
        post.getPublishedAt().toString(),
        post.getReadTimeMinutes() + " phut",
        post.getEmoji());
  }

  public QuizQuestionResponse toQuizResponse(QuizQuestionEntity question) {
    try {
      return new QuizQuestionResponse(
          question.getId(),
          question.getPrompt(),
          objectMapper.readValue(question.getOptionsJson(), new TypeReference<List<String>>() {
          }),
          question.getCorrectIndex(),
          question.getExplanation());
    } catch (Exception exception) {
      throw new ApiException(500, "Quiz question configuration is invalid");
    }
  }

  public GameResponse toGameResponse(GameEntity game) {
    return new GameResponse(
        game.getId(),
        game.getSlug(),
        game.getTitle(),
        game.getSummary(),
        game.getDescription(),
        game.getGameType(),
        game.getPlayPath(),
        game.getCoverImage(),
        game.getAccentColor(),
        Boolean.TRUE.equals(game.getIsPublished()));
  }

  public void enroll(Long courseId) {
    String userId = currentUser.id();
    if (!courseRepository.existsById(courseId)) {
      throw new ApiException(404, "Course not found");
    }
    if (courseEnrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
      return;
    }
    vn.educare.backend.model.CourseEnrollmentEntity enrollment = new vn.educare.backend.model.CourseEnrollmentEntity();
    enrollment.setUserId(userId);
    enrollment.setCourseId(courseId);
    enrollment.setEnrolledAt(java.time.Instant.now());
    courseEnrollmentRepository.save(enrollment);
  }

  public List<CourseResponse> myLearning() {
    String userId = currentUser.id();
    List<vn.educare.backend.model.CourseEnrollmentEntity> enrollments = courseEnrollmentRepository.findAllByUserId(userId);
    List<Long> courseIds = enrollments.stream().map(vn.educare.backend.model.CourseEnrollmentEntity::getCourseId).toList();
    return courseRepository.findAllById(courseIds)
        .stream()
        .map(this::toCourseResponse)
        .toList();
  }
}