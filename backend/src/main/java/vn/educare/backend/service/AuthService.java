package vn.educare.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.AuthResponse;
import vn.educare.backend.api.AuthDtos.LoginRequest;
import vn.educare.backend.api.AuthDtos.RegisterRequest;
import vn.educare.backend.api.AuthDtos.UserResponse;
import vn.educare.backend.model.LessonProgressEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserPlan;
import vn.educare.backend.model.UserRole;
import vn.educare.backend.repository.LessonRepository;
import vn.educare.backend.repository.LessonProgressRepository;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.repository.UserSubscriptionRepository;
import vn.educare.backend.model.UserSubscriptionEntity;
import vn.educare.backend.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final LessonProgressRepository lessonProgressRepository;
  private final LessonRepository lessonRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final UserMapper userMapper;
  private final UserSubscriptionRepository userSubscriptionRepository;

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

  private void checkAndUpdateSubscription(UserEntity user) {
    List<UserSubscriptionEntity> activeSubs = userSubscriptionRepository.findByUserIdAndStatus(user.getId(), "ACTIVE");
    boolean hasActive = false;
    Instant now = Instant.now();

    for (UserSubscriptionEntity sub : activeSubs) {
      if (sub.getEndDate().isBefore(now)) {
        sub.setStatus("EXPIRED");
        userSubscriptionRepository.save(sub);
      } else {
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
        .sorted((a, b) -> Integer.compare(a.getLessonOrder(), b.getLessonOrder()))
        .map(vn.educare.backend.model.LessonEntity::getSlug)
        .toList();

    return userMapper.toResponse(user, completedSlugs);
  }
}
