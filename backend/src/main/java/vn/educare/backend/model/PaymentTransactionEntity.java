package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
public class PaymentTransactionEntity {

  @Id
  private String id; // generated transaction ID / Order ID

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @ManyToOne
  @JoinColumn(name = "plan_id", nullable = false)
  private SubscriptionPlanEntity plan;

  @Column(nullable = false)
  private BigDecimal amount;

  @Column(nullable = false)
  private String status = "PENDING"; // PENDING, SUCCESS, FAILED

  @Column(name = "payment_method")
  private String paymentMethod = "PAYOS";

  @Column(name = "gateway_reference")
  private String gatewayReference;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @PrePersist
  protected void onCreate() {
    Instant now = Instant.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = Instant.now();
  }
}
