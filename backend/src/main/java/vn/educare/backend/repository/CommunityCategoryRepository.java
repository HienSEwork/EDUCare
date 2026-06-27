package vn.educare.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.CommunityCategoryEntity;

public interface CommunityCategoryRepository extends JpaRepository<CommunityCategoryEntity, Long> {
  Optional<CommunityCategoryEntity> findBySlug(String slug);
}
