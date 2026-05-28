package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.MicroLessonBlockEntity;

public interface MicroLessonBlockRepository extends JpaRepository<MicroLessonBlockEntity, Long> {
  List<MicroLessonBlockEntity> findAllByMicroLessonIdOrderByOrderIndexAsc(Long microLessonId);
}