package vn.educare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.CategoryEntity;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
}
