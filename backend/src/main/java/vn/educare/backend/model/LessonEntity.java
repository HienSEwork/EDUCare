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
@Table(name = "lessons")
@Getter
@Setter
public class LessonEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String slug;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String summary;

  @Column(nullable = false, columnDefinition = "LONGTEXT")
  private String content;

  @Column(name = "lesson_order", nullable = false)
  private Integer lessonOrder;

  @Column(name = "is_free", nullable = false)
  private Boolean isFree;

  // NEW FIELDS (theo Khoa.sql mới)
  @Column(name = "course_id")
  private Long courseId;

  @Column(name = "xp_reward", nullable = false)
  private Integer xpReward;

  @Column(name = "estimated_minutes", nullable = false)
  private Integer estimatedMinutes;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;
}