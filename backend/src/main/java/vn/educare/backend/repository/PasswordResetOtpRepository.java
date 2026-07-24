package vn.educare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.PasswordResetOtpEntity;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtpEntity, String> {
}
