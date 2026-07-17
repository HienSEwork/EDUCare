package vn.educare.backend.api;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.PlanDtos.PlanUpsertRequest;
import vn.educare.backend.model.SubscriptionPlanEntity;
import vn.educare.backend.service.AdminPlanService;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPlanController {

  private final AdminPlanService adminPlanService;

  @GetMapping("/api/admin/plans")
  public List<SubscriptionPlanEntity> listPlans() {
    return adminPlanService.listPlans();
  }

  @PostMapping("/api/admin/plans")
  public SubscriptionPlanEntity createPlan(@Valid @RequestBody PlanUpsertRequest request) {
    SubscriptionPlanEntity plan = new SubscriptionPlanEntity();
    plan.setId(request.id());
    plan.setName(request.name());
    plan.setPrice(request.price());
    plan.setDurationDays(request.durationDays());
    plan.setDescription(request.description());
    plan.setActive(request.active());
    plan.setStartDate(request.startDate());
    plan.setEndDate(request.endDate());
    plan.setPlanType(request.planType());
    return adminPlanService.createPlan(plan);
  }

  @PutMapping("/api/admin/plans/{id}")
  public SubscriptionPlanEntity updatePlan(
      @PathVariable String id,
      @Valid @RequestBody PlanUpsertRequest request) {
    SubscriptionPlanEntity plan = new SubscriptionPlanEntity();
    plan.setName(request.name());
    plan.setPrice(request.price());
    plan.setDurationDays(request.durationDays());
    plan.setDescription(request.description());
    plan.setActive(request.active());
    plan.setStartDate(request.startDate());
    plan.setEndDate(request.endDate());
    plan.setPlanType(request.planType());
    return adminPlanService.updatePlan(id, plan);
  }

  @DeleteMapping("/api/admin/plans/{id}")
  public void deletePlan(@PathVariable String id) {
    adminPlanService.deletePlan(id);
  }
}
