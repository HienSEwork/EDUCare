package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.GameScoreEntity;

public interface GameScoreRepository extends JpaRepository<GameScoreEntity, Long> {

  List<GameScoreEntity> findTop10ByGameSlugOrderByScoreDescPlayedAtAsc(String gameSlug);

  Optional<GameScoreEntity> findTopByGameSlugAndUserIdOrderByScoreDesc(String gameSlug, String userId);

  long countByGameSlugAndScoreGreaterThan(String gameSlug, int score);
}
