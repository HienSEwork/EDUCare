package vn.educare.backend.service;

import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Component;
import vn.educare.backend.api.AuthDtos.UserResponse;
import vn.educare.backend.model.UserEntity;

@Component
public class UserMapper {

  public UserResponse toResponse(UserEntity user, List<String> completedLessons) {
    return new UserResponse(
        user.getId(),
        user.getFullName(),
        user.getEmail(),
        user.getUsername(),
        user.getAge(),
        user.getPlan().name().toLowerCase(),
        user.getXp(),
        user.getStreak(),
        user.getQuizScoreTotal(),
        user.getAvatarUrl(),
        user.getRole().name().toLowerCase(),
        user.getRole().name().equals("ADMIN"),
        completedLessons,
        user.getCreatedAt() == null ? Instant.now().toString() : user.getCreatedAt().toString());
  }
}
