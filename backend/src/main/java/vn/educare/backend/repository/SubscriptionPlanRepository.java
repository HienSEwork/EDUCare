package vn.educare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.SubscriptionPlanEntity;

public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlanEntity, String> {
}
