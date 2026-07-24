package vn.educare.backend.service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.model.PasswordResetOtpEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.repository.PasswordResetOtpRepository;
import vn.educare.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

  private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);
  private static final Duration OTP_TTL = Duration.ofMinutes(15);
  private static final Duration RESEND_DELAY = Duration.ofSeconds(60);
  private static final int MAX_ATTEMPTS = 5;
  private static final SecureRandom RANDOM = new SecureRandom();

  private final UserRepository userRepository;
  private final PasswordResetOtpRepository otpRepository;
  private final PasswordEncoder passwordEncoder;
  private final MailService mailService;

  @Transactional
  public void sendOtp(String rawEmail) {
    String email = normalizeEmail(rawEmail);
    UserEntity user = userRepository.findByEmail(email).orElse(null);
    if (user == null) {
      return; // Không tiết lộ email có tồn tại trong hệ thống hay không.
    }
    if (!mailService.isConfigured()) {
      throw new ApiException(503, "Dịch vụ email chưa được cấu hình.");
    }

    Instant now = Instant.now();
    otpRepository.findById(email).ifPresent(existing -> {
      if (existing.getSentAt().plus(RESEND_DELAY).isAfter(now)) {
        throw new ApiException(429, "Vui lòng chờ 60 giây trước khi yêu cầu mã mới.");
      }
    });

    String otp = String.format(Locale.ROOT, "%06d", RANDOM.nextInt(1_000_000));
    PasswordResetOtpEntity entity = new PasswordResetOtpEntity();
    entity.setEmail(email);
    entity.setCodeHash(passwordEncoder.encode(otp));
    entity.setExpiresAt(now.plus(OTP_TTL));
    entity.setSentAt(now);
    entity.setAttempts(0);
    otpRepository.save(entity);

    try {
      mailService.sendResetOtp(email, user.getFullName(), otp);
    } catch (RuntimeException exception) {
      otpRepository.deleteById(email);
      log.error("Failed to send password reset OTP to {}", maskEmail(email), exception);
      throw new ApiException(503, "Không thể gửi email OTP. Vui lòng thử lại sau.");
    }
  }

  @Transactional
  public void resetPassword(String rawEmail, String otp, String newPassword) {
    String email = normalizeEmail(rawEmail);
    PasswordResetOtpEntity entity = otpRepository.findById(email)
        .orElseThrow(() -> new ApiException(400, "Mã OTP không hợp lệ hoặc đã hết hạn."));

    if (entity.getExpiresAt().isBefore(Instant.now())) {
      otpRepository.delete(entity);
      throw new ApiException(400, "Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
    }
    if (entity.getAttempts() >= MAX_ATTEMPTS) {
      otpRepository.delete(entity);
      throw new ApiException(429, "Bạn đã nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới.");
    }
    if (!passwordEncoder.matches(otp, entity.getCodeHash())) {
      entity.setAttempts(entity.getAttempts() + 1);
      otpRepository.save(entity);
      throw new ApiException(400, "Mã OTP không chính xác.");
    }

    UserEntity user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ApiException(400, "Yêu cầu đặt lại mật khẩu không hợp lệ."));
    user.setPasswordHash(passwordEncoder.encode(newPassword));
    userRepository.save(user);
    otpRepository.delete(entity);
  }

  private String normalizeEmail(String email) {
    return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
  }

  private String maskEmail(String email) {
    int at = email.indexOf('@');
    return at <= 1 ? "***" : email.charAt(0) + "***" + email.substring(at);
  }
}
