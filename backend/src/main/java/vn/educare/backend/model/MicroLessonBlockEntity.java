package vn.educare.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "micro_lesson_blocks")
@Getter
@Setter
public class MicroLessonBlockEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "micro_lesson_id", nullable = false)
  private Long microLessonId;

  @Column(name = "block_type", nullable = false)
  private String blockType;

  // Map JSON column as text to keep it simple
  @Column(name = "content_json", nullable = false, columnDefinition = "JSON")
  private String contentJson;

  @Column(name = "order_index")
  private Integer orderIndex;

  @Column(name = "created_at")
  private Instant createdAt;

  @Column(name = "updated_at")
  private Instant updatedAt;
}