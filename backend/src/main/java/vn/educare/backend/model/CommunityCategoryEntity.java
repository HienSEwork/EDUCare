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
@Table(name = "community_categories")
@Getter
@Setter
public class CommunityCategoryEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false, unique = true)
  private String slug;

  @Column(length = 500)
  private String description;

  @Column(length = 100)
  private String icon;

  @Column(name = "color_theme", length = 100)
  private String colorTheme;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();
}
