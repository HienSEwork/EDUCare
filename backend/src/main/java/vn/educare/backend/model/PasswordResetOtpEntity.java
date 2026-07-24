package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "password_reset_otps")
@Getter
@Setter
public class PasswordResetOtpEntity {

  @Id
  @Column(length = 255)
  private String email;

  @Column(name = "code_hash", nullable = false, length = 100)
  private String codeHash;

  @Column(name = "expires_at", nullable = false)
  private Instant expiresAt;

  @Column(name = "sent_at", nullable = false)
  private Instant sentAt;

  @Column(nullable = false)
  private int attempts;
}
