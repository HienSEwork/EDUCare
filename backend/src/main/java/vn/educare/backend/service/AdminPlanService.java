package vn.educare.backend.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import vn.educare.backend.model.SubscriptionPlanEntity;
import vn.educare.backend.model.PlanType;
import vn.educare.backend.repository.SubscriptionPlanRepository;
import vn.educare.backend.repository.UserSubscriptionRepository;

@Service
@RequiredArgsConstructor
public class AdminPlanService {

  private final SubscriptionPlanRepository planRepository;
  private final UserSubscriptionRepository userSubscriptionRepository;

  public List<SubscriptionPlanEntity> listPlans() {
    return planRepository.findAll();
  }

  private void validateDates(SubscriptionPlanEntity plan) {
    if (plan.getStartDate() != null && plan.getEndDate() != null) {
      if (plan.getStartDate().isAfter(plan.getEndDate())) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày bắt đầu ưu đãi phải trước ngày kết thúc.");
      }
    }
  }

  @Transactional
  public SubscriptionPlanEntity createPlan(SubscriptionPlanEntity plan) {
    if (planRepository.existsById(plan.getId())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã gói cước đã tồn tại.");
    }
    validateDates(plan);
    return planRepository.save(plan);
  }

  @Transactional
  public SubscriptionPlanEntity updatePlan(String id, SubscriptionPlanEntity updated) {
    SubscriptionPlanEntity plan = planRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy gói cước."));
    
    plan.setName(updated.getName());
    plan.setPrice(updated.getPrice());
    plan.setDurationDays(updated.getDurationDays());
    plan.setDescription(updated.getDescription());
    plan.setActive(updated.getActive());
    plan.setStartDate(updated.getStartDate());
    plan.setEndDate(updated.getEndDate());
    plan.setPlanType(updated.getPlanType());
    validateDates(plan);
    return planRepository.save(plan);
  }

  @Transactional
  public void deletePlan(String id) {
    if (id.equalsIgnoreCase("FREE")) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể xóa gói cước mặc định hệ thống (FREE).");
    }
    SubscriptionPlanEntity plan = planRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy gói cước."));
    
    if (id.equalsIgnoreCase("VIP_TRIAL")) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể xóa gói cước dùng thử mặc định hệ thống (VIP_TRIAL).");
    }
    
    // Nếu gói cước đã được liên kết sử dụng bởi học viên, ta chỉ hủy kích hoạt (active = false)
    if (userSubscriptionRepository.existsByPlanId(id)) {
      plan.setActive(false);
      planRepository.save(plan);
    } else {
      // Nếu gói cước chưa từng được sử dụng lần nào, ta thực hiện xóa cứng ra khỏi database
      planRepository.delete(plan);
    }
  }
}
