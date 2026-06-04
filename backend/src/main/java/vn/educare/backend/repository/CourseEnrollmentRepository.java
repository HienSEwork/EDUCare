package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.educare.backend.model.CourseEnrollmentEntity;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollmentEntity, Long> {
  List<CourseEnrollmentEntity> findAllByUserId(String userId);
  Optional<CourseEnrollmentEntity> findByUserIdAndCourseId(String userId, Long courseId);
  boolean existsByUserIdAndCourseId(String userId, Long courseId);
}
