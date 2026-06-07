package vn.educare.backend.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.core.env.Environment;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.AuthResponse;
import vn.educare.backend.api.AuthDtos.LoginRequest;
import vn.educare.backend.api.AuthDtos.PasswordResetResponse;
import vn.educare.backend.api.AuthDtos.RegisterRequest;
import vn.educare.backend.api.AuthDtos.UserResponse;
import vn.educare.backend.model.LessonProgressEntity;
import vn.educare.backend.model.PasswordResetTokenEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserPlan;
import vn.educare.backend.model.UserRole;
import vn.educare.backend.repository.LessonRepository;
import vn.educare.backend.repository.LessonProgressRepository;
import vn.educare.backend.repository.PasswordResetTokenRepository;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

  private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);
  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  private final UserRepository userRepository;
  private final LessonProgressRepository lessonProgressRepository;
  private final LessonRepository lessonRepository;
  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final UserMapper userMapper;
  private final MailService mailService;
  private final Environment env;

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    if (userRepository.findByEmail(request.email()).isPresent()) {
      throw new ApiException(409, "Email already exists");
    }
    if (userRepository.findByUsername(request.username()).isPresent()) {
      throw new ApiException(409, "Username already exists");
    }

    UserEntity user = new UserEntity();
    user.setId(UUID.randomUUID().toString());
    user.setFullName(request.fullName());
    user.setEmail(request.email());
    user.setUsername(request.username());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setAge(request.age());
    user.setPlan(UserPlan.FREE);
    user.setRole(UserRole.STUDENT);
    user.setXp(0);
    user.setStreak(0);
    user.setQuizScoreTotal(0);
    user.setCreatedAt(Instant.now());
    user.setUpdatedAt(Instant.now());
    userRepository.save(user);

    String token = jwtService.generateToken(user);
    return new AuthResponse(token, mapUser(user));
  }

  public AuthResponse login(LoginRequest request) {
    UserEntity user = userRepository.findByEmailOrUsername(request.login(), request.login())
        .orElseThrow(() -> new ApiException(401, "Invalid credentials"));

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new ApiException(401, "Invalid credentials");
    }

    String token = jwtService.generateToken(user);
    return new AuthResponse(token, mapUser(user));
  }

  public UserResponse me(String userId) {
    UserEntity user = userRepository.findById(userId).orElseThrow(() -> new ApiException(404, "User not found"));
    return mapUser(user);
  }

  @Transactional
  public PasswordResetResponse requestPasswordReset(String email) {
    var optionalUser = userRepository.findByEmail(email);
    if (optionalUser.isEmpty()) {
      return new PasswordResetResponse("If the email exists, a reset code has been sent", null);
    }

    UserEntity user = optionalUser.get();
    passwordResetTokenRepository.deleteAllByUserId(user.getId());

    PasswordResetTokenEntity resetToken = new PasswordResetTokenEntity();
    resetToken.setToken(generateOtpCode());
    resetToken.setUserId(user.getId());
    resetToken.setCreatedAt(Instant.now());
    resetToken.setExpiresAt(Instant.now().plus(15, ChronoUnit.MINUTES));
    passwordResetTokenRepository.save(resetToken);

    boolean smtpActive = Arrays.stream(env.getActiveProfiles()).anyMatch("smtp"::equals);
    if (smtpActive) {
      try {
        mailService.sendResetOtp(user.getEmail(), resetToken.getToken());
      } catch (Exception e) {
        LOGGER.error("Failed to send reset OTP email", e);
      }
      return new PasswordResetResponse("If the email exists, a reset code has been sent", null);
    }

    boolean devActive = Arrays.stream(env.getActiveProfiles()).anyMatch("dev"::equals);
    if (devActive) {
      return new PasswordResetResponse("If the email exists, a reset code has been sent", resetToken.getToken());
    }

    return new PasswordResetResponse("If the email exists, a reset code has been sent", null);
  }

  private String generateOtpCode() {
    int code = SECURE_RANDOM.nextInt(1_000_000);
    return String.format("%06d", code);
  }

  @Transactional
  public void resetPassword(String email, String token, String password) {
    // Ensure the email exists first
    var optionalUser = userRepository.findByEmail(email);
    if (optionalUser.isEmpty()) {
      throw new ApiException(400, "Invalid email or reset token");
    }
    UserEntity user = optionalUser.get();

    PasswordResetTokenEntity resetToken = passwordResetTokenRepository.findByToken(token)
        .orElseThrow(() -> new ApiException(400, "Invalid or expired reset token"));

    // Token must belong to the same user (email) that requested the reset
    if (!resetToken.getUserId().equals(user.getId())) {
      throw new ApiException(400, "Invalid reset token for this email");
    }

    if (resetToken.getExpiresAt().isBefore(Instant.now())) {
      passwordResetTokenRepository.delete(resetToken);
      throw new ApiException(400, "Invalid or expired reset token");
    }

    user.setPasswordHash(passwordEncoder.encode(password));
    userRepository.save(user);
    passwordResetTokenRepository.delete(resetToken);
  }

  public UserResponse mapUser(UserEntity user) {
    List<Long> completedLessonIds = lessonProgressRepository.findAllByUserIdOrderByCompletedAtAsc(user.getId())
        .stream()
        .map(LessonProgressEntity::getLessonId)
        .toList();

    List<String> completedSlugs = lessonRepository.findAllById(completedLessonIds)
        .stream()
        .sorted((a, b) -> Integer.compare(a.getLessonOrder(), b.getLessonOrder()))
        .map(vn.educare.backend.model.LessonEntity::getSlug)
        .toList();

    return userMapper.toResponse(user, completedSlugs);
  }
}
