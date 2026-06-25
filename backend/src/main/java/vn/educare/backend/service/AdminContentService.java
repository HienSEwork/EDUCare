package vn.educare.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.AdminContentMetrics;
import vn.educare.backend.api.AuthDtos.AdminContentResponse;
import vn.educare.backend.api.AuthDtos.AdminQuizQuestionResponse;
import vn.educare.backend.api.AuthDtos.BlogPostResponse;
import vn.educare.backend.api.AuthDtos.BlogPostUpsertRequest;
import vn.educare.backend.api.AuthDtos.GameResponse;
import vn.educare.backend.api.AuthDtos.GameUpsertRequest;
import vn.educare.backend.api.AuthDtos.LessonResponse;
import vn.educare.backend.api.AuthDtos.LessonUpsertRequest;
import vn.educare.backend.api.AuthDtos.QuizQuestionUpsertRequest;
import vn.educare.backend.model.BlogPostEntity;
import vn.educare.backend.model.GameEntity;
import vn.educare.backend.model.LessonEntity;
import vn.educare.backend.model.QuizQuestionEntity;
import vn.educare.backend.repository.BlogPostRepository;
import vn.educare.backend.repository.GameRepository;
import vn.educare.backend.repository.LessonRepository;
import vn.educare.backend.repository.QuizQuestionRepository;

@Service
@RequiredArgsConstructor
public class AdminContentService {

  private final LessonRepository lessonRepository;
  private final BlogPostRepository blogPostRepository;
  private final QuizQuestionRepository quizQuestionRepository;
  private final GameRepository gameRepository;
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
    lesson.setXpReward(request.xpReward() != null ? request.xpReward() : (lesson.getXpReward() != null ? lesson.getXpReward() : 10));
    lesson.setEstimatedMinutes(request.estimatedMinutes() != null ? request.estimatedMinutes() : (lesson.getEstimatedMinutes() != null ? lesson.getEstimatedMinutes() : 10));
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
    post.setEmoji(request.emoji());
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
    try {
      return new AdminQuizQuestionResponse(
          question.getId(),
          question.getSlug(),
          question.getPrompt(),
          objectMapper.readValue(question.getOptionsJson(), objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)),
          question.getCorrectIndex(),
          question.getExplanation(),
          question.getCategory(),
          question.getDifficulty(),
          Boolean.TRUE.equals(question.getIsActive()));
    } catch (Exception exception) {
      throw new ApiException(500, "Quiz question configuration is invalid");
    }
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
}
