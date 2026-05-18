package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.GameEntity;

public interface GameRepository extends JpaRepository<GameEntity, Long> {
  List<GameEntity> findAllByOrderByCreatedAtDesc();
  List<GameEntity> findAllByIsPublishedTrueOrderByCreatedAtDesc();
  Optional<GameEntity> findBySlug(String slug);
}
