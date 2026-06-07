package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.educare.backend.model.LessonSourceEntity;

@Repository
public interface LessonSourceRepository extends JpaRepository<LessonSourceEntity, Long> {
  List<LessonSourceEntity> findAllByLessonId(Long lessonId);
}
