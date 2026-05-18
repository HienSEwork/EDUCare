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
@Table(name = "games")
@Getter
@Setter
public class GameEntity {

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
  private String description;

  @Column(name = "game_type", nullable = false)
  private String gameType;

  @Column(name = "play_path", nullable = false)
  private String playPath;

  @Column(name = "cover_image")
  private String coverImage;

  @Column(name = "accent_color", nullable = false)
  private String accentColor;

  @Column(name = "is_published", nullable = false)
  private Boolean isPublished = true;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;
}
