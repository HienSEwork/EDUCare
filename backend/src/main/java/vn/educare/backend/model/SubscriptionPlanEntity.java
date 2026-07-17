package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "subscription_plans")
@Getter
@Setter
public class SubscriptionPlanEntity {

  @Id
  private String id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private BigDecimal price;

  @Column(name = "duration_days", nullable = false)
  private Integer durationDays;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt = Instant.now();

  @Column(nullable = false)
  private Boolean active = true;

  @Column(name = "start_date")
  private Instant startDate;

  @Column(name = "end_date")
  private Instant endDate;

  @Column(name = "plan_type", nullable = false)
  @Enumerated(EnumType.STRING)
  private PlanType planType = PlanType.REGULAR;

  public Boolean getActive() {
    if (active == null || !active) {
      return false;
    }
    Instant now = Instant.now();
    if (startDate != null && now.isBefore(startDate)) {
      return false;
    }
    if (endDate != null && now.isAfter(endDate)) {
      return false;
    }
    return true;
  }
}
