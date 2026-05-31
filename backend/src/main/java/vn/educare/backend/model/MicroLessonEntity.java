package vn.educare.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "micro_lessons")
@Getter
@Setter
public class MicroLessonEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "lesson_id", nullable = false)
  private Long lessonId;

  @Column(nullable = false)
  private String title;

  @Column(name = "micro_order")
  private Integer microOrder;

  @Column(name = "created_at")
  private Instant createdAt;

  @Column(name = "updated_at")
  private Instant updatedAt;
}