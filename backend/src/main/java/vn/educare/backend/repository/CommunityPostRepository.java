package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.CommunityPostEntity;

public interface CommunityPostRepository extends JpaRepository<CommunityPostEntity, Long> {
  List<CommunityPostEntity> findAllByOrderByCreatedAtDesc();
}
