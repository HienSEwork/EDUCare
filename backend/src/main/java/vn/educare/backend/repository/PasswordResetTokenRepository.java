package vn.educare.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.PasswordResetTokenEntity;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, Long> {
  Optional<PasswordResetTokenEntity> findByToken(String token);

  void deleteAllByUserId(String userId);
}
