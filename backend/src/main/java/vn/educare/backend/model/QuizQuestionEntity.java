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
@Table(name = "quiz_questions")
@Getter
@Setter
public class QuizQuestionEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String slug;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String prompt;

  @Column(nullable = false)
  private String category;

  @Column(nullable = false)
  private String difficulty;

  @Column(name = "question_type", nullable = false)
  private String questionType;

  @Column(name = "options_json", nullable = false, columnDefinition = "TEXT")
  private String optionsJson;

  @Column(name = "correct_index", nullable = false)
  private Integer correctIndex;

  @Column(columnDefinition = "TEXT")
  private String explanation;

  @Column(name = "sort_order", nullable = false)
  private Integer sortOrder;

  @Column(name = "is_active", nullable = false)
  private Boolean isActive = true;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;
}
