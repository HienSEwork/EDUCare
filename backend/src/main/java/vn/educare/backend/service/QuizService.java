package vn.educare.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.QuizAnswerRequest;
import vn.educare.backend.api.AuthDtos.QuizPlayQuestionResponse;
import vn.educare.backend.api.AuthDtos.QuizQuestionResponse;
import vn.educare.backend.api.AuthDtos.QuizResultResponse;
import vn.educare.backend.api.AuthDtos.QuizReviewResponse;
import vn.educare.backend.api.AuthDtos.QuizSessionResponse;
import vn.educare.backend.api.AuthDtos.QuizSubmitRequest;
import vn.educare.backend.api.AuthDtos.UserResponse;
import vn.educare.backend.model.QuizAttemptEntity;
import vn.educare.backend.model.QuizQuestionEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.repository.QuizAttemptRepository;
import vn.educare.backend.repository.QuizQuestionRepository;
import vn.educare.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class QuizService {

  private final QuizQuestionRepository quizQuestionRepository;
  private final QuizAttemptRepository quizAttemptRepository;
  private final UserRepository userRepository;
  private final NotificationService notificationService;
  private final AuthService authService;
  private final ObjectMapper objectMapper;

  public QuizSessionResponse startSession(String mode) {
    int totalQuestions = totalQuestions(mode);
    List<QuizQuestionEntity> activeQuestions = new ArrayList<>(quizQuestionRepository.findAllByIsActiveTrueOrderBySortOrderAsc());

    if (activeQuestions.size() < totalQuestions) {
      throw new ApiException(400, "Not enough quiz questions in the bank");
    }

    Collections.shuffle(activeQuestions);

    List<QuizPlayQuestionResponse> questions = activeQuestions.stream()
        .limit(totalQuestions)
        .map(this::toPlayableQuestion)
        .toList();

    return new QuizSessionResponse(mode.toLowerCase(), totalQuestions, questions);
  }

  @Transactional
  public QuizResultResponse submit(String userId, QuizSubmitRequest request) {
    int totalQuestions = totalQuestions(request.mode());
    List<QuizAnswerRequest> answers = request.answers() == null ? List.of() : request.answers();

    if (answers.size() != totalQuestions) {
      throw new ApiException(400, "Quiz answer count does not match the selected mode");
    }

    List<Long> questionIds = answers.stream()
        .map(QuizAnswerRequest::questionId)
        .toList();

    Map<Long, QuizQuestionEntity> questionMap = quizQuestionRepository.findAllById(questionIds).stream()
        .collect(java.util.stream.Collectors.toMap(QuizQuestionEntity::getId, item -> item));

    if (questionMap.size() != questionIds.size()) {
      throw new ApiException(400, "One or more quiz questions are invalid");
    }

    int correctAnswers = 0;
    List<QuizReviewResponse> reviews = new ArrayList<>();

    for (QuizAnswerRequest answer : answers) {
      QuizQuestionEntity question = questionMap.get(answer.questionId());

      if (question == null) {
        throw new ApiException(400, "Quiz question not found");
      }

      if (answer.selectedIndex() != null && answer.selectedIndex().equals(question.getCorrectIndex())) {
        correctAnswers += 1;
      }

      reviews.add(new QuizReviewResponse(
          question.getId(),
          question.getPrompt(),
          answer.selectedIndex(),
          question.getCorrectIndex(),
          question.getExplanation()));
    }

    reviews.sort(Comparator.comparing(QuizReviewResponse::questionId));

    int score = correctAnswers * 10;
    int awardedXp = score;
    UserResponse userResponse = null;
    int streak = 0;
    int quizScore = 0;

    if (userId != null) {
      UserEntity user = userRepository.findById(userId).orElseThrow(() -> new ApiException(404, "User not found"));
      user.setXp(user.getXp() + awardedXp);
      user.setQuizScoreTotal(user.getQuizScoreTotal() + score);
      user.setStreak(user.getStreak() + 1);
      userRepository.save(user);

      QuizAttemptEntity attempt = new QuizAttemptEntity();
      attempt.setUserId(userId);
      attempt.setMode(request.mode().toLowerCase());
      attempt.setTotalQuestions(totalQuestions);
      attempt.setCorrectAnswers(correctAnswers);
      attempt.setScore(score);
      attempt.setXpAwarded(awardedXp);
      attempt.setCreatedAt(Instant.now());
      quizAttemptRepository.save(attempt);

      notificationService.create(
          userId,
          "quiz",
          "Quiz completed",
          "You finished a " + request.mode().toLowerCase() + " quiz with " + correctAnswers + "/" + totalQuestions + " correct answers.");

      userResponse = authService.mapUser(user);
      streak = user.getStreak();
      quizScore = user.getQuizScoreTotal();
    }

    return new QuizResultResponse(correctAnswers, totalQuestions, score, awardedXp, streak, quizScore, reviews, userResponse);
  }

  public List<QuizQuestionResponse> quizBank() {
    return quizQuestionRepository.findAllByOrderBySortOrderAsc().stream().map(this::toQuizBankQuestion).toList();
  }

  private QuizPlayQuestionResponse toPlayableQuestion(QuizQuestionEntity question) {
    try {
      return new QuizPlayQuestionResponse(
          question.getId(),
          question.getPrompt(),
          objectMapper.readValue(question.getOptionsJson(), new TypeReference<List<String>>() {
          }),
          question.getCategory(),
          question.getDifficulty());
    } catch (Exception exception) {
      throw new ApiException(500, "Quiz question configuration is invalid");
    }
  }

  private QuizQuestionResponse toQuizBankQuestion(QuizQuestionEntity question) {
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

  private int totalQuestions(String mode) {
    if ("long".equalsIgnoreCase(mode)) {
      return 30;
    }
    if ("quick".equalsIgnoreCase(mode)) {
      return 10;
    }
    throw new ApiException(400, "Quiz mode must be quick or long");
  }
}
