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
@Table(name = "lesson_progress")
@Getter
@Setter
public class LessonProgressEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(name = "lesson_id", nullable = false)
  private Long lessonId;

  @Column(name = "xp_awarded", nullable = false)
  private Integer xpAwarded;

  @Column(name = "completed_at", nullable = false)
  private Instant completedAt;
}
