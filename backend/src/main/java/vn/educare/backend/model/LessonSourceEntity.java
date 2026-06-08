package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "lesson_sources")
@Getter
@Setter
public class LessonSourceEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "lesson_id", nullable = false)
  private Long lessonId;

  @Column(name = "source_name", nullable = false)
  private String sourceName;

  @Column(name = "source_url", nullable = false, columnDefinition = "TEXT")
  private String sourceUrl;

  @Column(name = "source_type")
  private String sourceType;
}
