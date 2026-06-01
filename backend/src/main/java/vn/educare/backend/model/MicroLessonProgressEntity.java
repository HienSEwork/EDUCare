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
@Table(name = "micro_lesson_progress")
@Getter
@Setter
public class MicroLessonProgressEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(name = "micro_lesson_id", nullable = false)
  private Long microLessonId;

  @Column(name = "completed")
  private Boolean completed;

  @Column(name = "completed_at")
  private Instant completedAt;
}
