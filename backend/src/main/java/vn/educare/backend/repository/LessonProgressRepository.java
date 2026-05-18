package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.educare.backend.model.LessonProgressEntity;

public interface LessonProgressRepository extends JpaRepository<LessonProgressEntity, Long> {
  List<LessonProgressEntity> findAllByUserIdOrderByCompletedAtAsc(String userId);
  List<LessonProgressEntity> findTop3ByUserIdOrderByCompletedAtDesc(String userId);
  Optional<LessonProgressEntity> findByUserIdAndLessonId(String userId, Long lessonId);
  long countByUserId(String userId);

  @Query("select count(lp) from LessonProgressEntity lp")
  long totalCompletions();
}
