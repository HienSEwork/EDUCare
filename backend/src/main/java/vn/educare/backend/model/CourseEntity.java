package vn.educare.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "courses")
@Getter
@Setter
public class CourseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "thumbnail")
  private String thumbnail;

  @Column(name = "color_theme")
  private String colorTheme;

  @Column(name = "course_order")
  private Integer courseOrder;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private CategoryEntity category;

  @Column(name = "created_at")
  private Instant createdAt;

  @Column(name = "updated_at")
  private Instant updatedAt;
}