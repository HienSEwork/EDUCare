package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.LessonEntity;

public interface LessonRepository extends JpaRepository<LessonEntity, Long> {
  List<LessonEntity> findAllByOrderByLessonOrderAsc();
  Optional<LessonEntity> findBySlug(String slug);

  // NEW: list lessons by course
  List<LessonEntity> findAllByCourseIdOrderByLessonOrderAsc(Long courseId);
}