package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "blog_posts")
@Getter
@Setter
public class BlogPostEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String slug;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String excerpt;

  @Column(nullable = false, columnDefinition = "LONGTEXT")
  private String content;

  @Column(nullable = false)
  private String category;

  @Column(name = "published_at", nullable = false)
  private LocalDate publishedAt;

  @Column(name = "read_time_minutes", nullable = false)
  private Integer readTimeMinutes;

  @Column(nullable = false)
  private String emoji;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;
}
