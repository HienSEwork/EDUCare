package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.educare.backend.model.MicroLessonProgressEntity;

@Repository
public interface MicroLessonProgressRepository extends JpaRepository<MicroLessonProgressEntity, Long> {
  List<MicroLessonProgressEntity> findAllByUserId(String userId);
  Optional<MicroLessonProgressEntity> findByUserIdAndMicroLessonId(String userId, Long microLessonId);
}
