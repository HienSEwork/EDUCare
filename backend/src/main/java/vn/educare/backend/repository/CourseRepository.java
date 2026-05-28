package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.CourseEntity;

public interface CourseRepository extends JpaRepository<CourseEntity, Long> {
  List<CourseEntity> findAllByOrderByCourseOrderAsc();
}