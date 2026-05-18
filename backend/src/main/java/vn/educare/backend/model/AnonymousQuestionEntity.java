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
@Table(name = "anonymous_questions")
@Getter
@Setter
public class AnonymousQuestionEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id")
  private String userId;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String question;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String answer;

  @Column(name = "likes_count", nullable = false)
  private Integer likesCount = 0;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;
}
