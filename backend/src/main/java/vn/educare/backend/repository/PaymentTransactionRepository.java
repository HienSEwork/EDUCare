package vn.educare.backend.repository;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.PaymentTransactionEntity;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransactionEntity, String> {
  List<PaymentTransactionEntity> findByUserId(String userId);
  List<PaymentTransactionEntity> findByStatusAndCreatedAtBefore(String status, Instant cutoff);
}

