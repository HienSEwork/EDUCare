package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
    name = "game_scores",
    indexes = {
      @Index(name = "idx_gs_slug_score", columnList = "game_slug, score DESC"),
      @Index(name = "idx_gs_user", columnList = "user_id")
    })
@Getter
@Setter
public class GameScoreEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "game_slug", nullable = false, length = 100)
  private String gameSlug;

  @Column(name = "user_id", nullable = false, length = 36)
  private String userId;

  @Column(name = "player_name", nullable = false, length = 120)
  private String playerName;

  @Column(nullable = false)
  private Integer score;

  @Column(nullable = false, length = 20)
  private String difficulty = "medium";

  @Column(name = "user_streak", nullable = false)
  private Integer userStreak = 0;

  @Column(name = "user_xp", nullable = false)
  private Integer userXp = 0;

  @Column(name = "played_at", nullable = false)
  private Instant playedAt;
}
