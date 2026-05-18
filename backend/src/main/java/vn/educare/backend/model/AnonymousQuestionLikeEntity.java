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
@Table(name = "anonymous_question_likes")
@Getter
@Setter
public class AnonymousQuestionLikeEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "question_id", nullable = false)
  private Long questionId;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;
}
