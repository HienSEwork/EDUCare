package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "subscription_plans")
@Getter
@Setter
public class SubscriptionPlanEntity {

  @Id
  private String id; // e.g. FREE, VIP_1M, PREMIUM_3M

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private BigDecimal price;

  @Column(name = "duration_days", nullable = false)
  private Integer durationDays;

  @Column
  private String description;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;
}
