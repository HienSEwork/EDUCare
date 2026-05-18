package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.educare.backend.model.QuizAttemptEntity;

public interface QuizAttemptRepository extends JpaRepository<QuizAttemptEntity, Long> {
  List<QuizAttemptEntity> findTop10ByUserIdOrderByCreatedAtDesc(String userId);

  @Query("select count(q) from QuizAttemptEntity q")
  long totalAttempts();
}
