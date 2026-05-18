package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "quiz_attempts")
@Getter
@Setter
public class QuizAttemptEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id")
  private String userId;

  @Column(nullable = false)
  private String mode;

  @Column(name = "total_questions", nullable = false)
  private Integer totalQuestions;

  @Column(name = "correct_answers", nullable = false)
  private Integer correctAnswers;

  @Column(nullable = false)
  private Integer score;

  @Column(name = "xp_awarded", nullable = false)
  private Integer xpAwarded;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;
}
