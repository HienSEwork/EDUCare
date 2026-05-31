package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.MicroLessonEntity;

public interface MicroLessonRepository extends JpaRepository<MicroLessonEntity, Long> {
  List<MicroLessonEntity> findAllByLessonIdOrderByMicroOrderAsc(Long lessonId);
}