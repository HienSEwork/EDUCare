package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.AnonymousQuestionEntity;

public interface AnonymousQuestionRepository extends JpaRepository<AnonymousQuestionEntity, Long> {
  List<AnonymousQuestionEntity> findTop20ByOrderByCreatedAtDesc();
}
