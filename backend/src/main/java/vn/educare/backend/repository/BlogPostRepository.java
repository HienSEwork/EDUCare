package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.BlogPostEntity;

public interface BlogPostRepository extends JpaRepository<BlogPostEntity, Long> {
  List<BlogPostEntity> findAllByOrderByPublishedAtDesc();
  Optional<BlogPostEntity> findBySlug(String slug);
}
