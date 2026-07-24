package vn.educare.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.AuthResponse;
import vn.educare.backend.api.AuthDtos.LoginRequest;
import vn.educare.backend.api.AuthDtos.GoogleLoginRequest;
import vn.educare.backend.api.AuthDtos.RegisterRequest;
import vn.educare.backend.api.AuthDtos.UserResponse;
import vn.educare.backend.config.AppProperties;
import vn.educare.backend.model.LessonProgressEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserPlan;
import vn.educare.backend.model.UserRole;
import vn.educare.backend.model.UserSubscriptionEntity;
import vn.educare.backend.repository.LessonRepository;
import vn.educare.backend.repository.LessonProgressRepository;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.repository.UserSubscriptionRepository;
import vn.educare.backend.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

  private static final Logger log = LoggerFactory.getLogger(AuthService.class);

  private final UserRepository userRepository;
  private final LessonProgressRepository lessonProgressRepository;
  private final LessonRepository lessonRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final UserMapper userMapper;
  private final UserSubscriptionRepository userSubscriptionRepository;
  private final AppProperties appProperties;
  private final TrialActivationService trialActivationService;

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
    user.setPlan(UserPlan.FREE); // Default to FREE plan
    user.setRole(UserRole.STUDENT);
    user.setXp(0);
    user.setStreak(0);
    user.setQuizScoreTotal(0);
    user.setCreatedAt(Instant.now());
    user.setUpdatedAt(Instant.now());
    userRepository.save(user);

    trialActivationService.activateTrial(user);

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

  public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
    String googleClientId = appProperties.google() == null ? null : appProperties.google().clientId();
    if (googleClientId == null || googleClientId.isBlank()) {
      throw new ApiException(503, "Đăng nhập Google chưa được cấu hình.");
    }

    GoogleIdToken.Payload tokenInfo;
    try {
      GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
          GoogleNetHttpTransport.newTrustedTransport(),
          GsonFactory.getDefaultInstance())
          .setAudience(Collections.singletonList(googleClientId))
          .build();
      GoogleIdToken idToken = verifier.verify(request.credential());
      if (idToken == null) throw new ApiException(401, "Thông tin đăng nhập Google không hợp lệ.");
      tokenInfo = idToken.getPayload();
    } catch (GeneralSecurityException | IOException exception) {
      log.warn("Google credential verification unavailable", exception);
      throw new ApiException(503, "Không thể xác minh tài khoản Google lúc này. Vui lòng thử lại.");
    }

    String email = tokenInfo.getEmail() == null ? "" : tokenInfo.getEmail().trim().toLowerCase(Locale.ROOT);
    if (!Boolean.TRUE.equals(tokenInfo.getEmailVerified())) throw new ApiException(401, "Email Google chưa được xác minh.");
    if (email.isBlank() || "null".equals(email) || email.indexOf('@') <= 0) {
      throw new ApiException(401, "Google không cung cấp email đã xác thực.");
    }

    UserEntity existingUser = userRepository.findByEmail(email).orElse(null);
    if (existingUser != null) {
      return new AuthResponse(jwtService.generateToken(existingUser), mapUser(existingUser));
    }

    UserEntity user;
    try {
      user = createGoogleUser(tokenInfo, email);
    } catch (DataIntegrityViolationException exception) {
      // A concurrent request may have created the same email after our first lookup.
      user = userRepository.findByEmail(email).orElseThrow(() -> {
        log.warn("Unable to create Google account for {}", email, exception);
        return new ApiException(409, "Không thể tạo tài khoản Google vì email hoặc tên đăng nhập đã tồn tại.");
      });
    }

    try {
      trialActivationService.activateTrial(user);
    } catch (RuntimeException exception) {
      // Trial is optional. A missing/outdated subscription table must never block authentication.
      log.error("Google account {} was created but trial activation failed", user.getId(), exception);
    }

    return new AuthResponse(jwtService.generateToken(user), mapUser(user));
  }

  private UserEntity createGoogleUser(GoogleIdToken.Payload tokenInfo, String email) {
    UserEntity user = new UserEntity();
    user.setId(UUID.randomUUID().toString());
    String name = valueOrNull(tokenInfo.get("name"));
    user.setFullName(name == null ? email.substring(0, email.indexOf('@')) : name);
    user.setEmail(email);
    user.setUsername(uniqueGoogleUsername(email));
    user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
    user.setAge(16);
    user.setPlan(UserPlan.FREE);
    user.setRole(UserRole.STUDENT);
    user.setXp(0);
    user.setStreak(0);
    user.setQuizScoreTotal(0);
    String picture = valueOrNull(tokenInfo.get("picture"));
    user.setAvatarUrl(picture != null && picture.length() <= 255 ? picture : null);
    return userRepository.saveAndFlush(user);
  }

  private String uniqueGoogleUsername(String email) {
    String base = email.substring(0, email.indexOf('@')).toLowerCase(Locale.ROOT)
        .replaceAll("[^a-z0-9_]", "_");
    if (base.length() < 3) base = "google_user";
    if (base.length() > 40) base = base.substring(0, 40);
    String candidate = base;
    while (userRepository.findByUsername(candidate).isPresent()) {
      candidate = base + "_" + UUID.randomUUID().toString().substring(0, 6);
    }
    return candidate;
  }

  private String valueOrNull(Object value) {
    if (value == null) return null;
    String text = String.valueOf(value).trim();
    return text.isEmpty() || "null".equals(text) ? null : text;
  }

  public UserResponse me(String userId) {
    UserEntity user = userRepository.findById(userId).orElseThrow(() -> new ApiException(404, "User not found"));
    return mapUser(user);
  }

  private void checkAndUpdateSubscription(UserEntity user) {
    List<UserSubscriptionEntity> activeSubs = userSubscriptionRepository.findByUserIdAndStatus(user.getId(), "ACTIVE");
    boolean hasActive = false;
    Instant now = Instant.now();

    for (UserSubscriptionEntity sub : activeSubs) {
      if (sub.getEndDate() != null && sub.getEndDate().isBefore(now)) {
        sub.setStatus("EXPIRED");
        userSubscriptionRepository.save(sub);
      } else if (sub.getEndDate() != null) {
        hasActive = true;
      }
    }

    if (!hasActive && user.getPlan() != UserPlan.FREE) {
      user.setPlan(UserPlan.FREE);
      userRepository.save(user);
    }
  }

  public UserResponse mapUser(UserEntity user) {
    checkAndUpdateSubscription(user);

    List<Long> completedLessonIds = lessonProgressRepository.findAllByUserIdOrderByCompletedAtAsc(user.getId())
        .stream()
        .map(LessonProgressEntity::getLessonId)
        .toList();

    List<String> completedSlugs = lessonRepository.findAllById(completedLessonIds)
        .stream()
        .sorted((a, b) -> Integer.compare(
            a.getLessonOrder() != null ? a.getLessonOrder() : 0,
            b.getLessonOrder() != null ? b.getLessonOrder() : 0
        ))
        .map(vn.educare.backend.model.LessonEntity::getSlug)
        .toList();

    return userMapper.toResponse(user, completedSlugs);
  }
}
