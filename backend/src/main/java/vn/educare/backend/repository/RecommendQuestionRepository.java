package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.RecommendQuestionEntity;

public interface RecommendQuestionRepository extends JpaRepository<RecommendQuestionEntity, Long> {
  List<RecommendQuestionEntity> findAllByOrderByQuestionOrderAsc();
}
