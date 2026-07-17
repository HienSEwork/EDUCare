package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.PlanType;
import vn.educare.backend.model.SubscriptionPlanEntity;

public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlanEntity, String> {
  List<SubscriptionPlanEntity> findByActiveTrue();
  List<SubscriptionPlanEntity> findByPlanType(PlanType planType);
}
