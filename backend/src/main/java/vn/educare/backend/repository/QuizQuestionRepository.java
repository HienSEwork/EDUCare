package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.QuizQuestionEntity;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestionEntity, Long> {
  List<QuizQuestionEntity> findAllByOrderBySortOrderAsc();
  List<QuizQuestionEntity> findAllByIsActiveTrueOrderBySortOrderAsc();
  Optional<QuizQuestionEntity> findBySlug(String slug);
}
