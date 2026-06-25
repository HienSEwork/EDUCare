package vn.educare.backend.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import vn.educare.backend.api.AuthDtos.AdminUserListResponse;
import vn.educare.backend.api.AuthDtos.AdminUserResponse;
import vn.educare.backend.api.AuthDtos.AdminUserUpdateRequest;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.UserPlan;
import vn.educare.backend.model.UserRole;
import vn.educare.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AdminUserService {

  private final UserRepository userRepository;

  public AdminUserListResponse listUsers(String q, String planStr, String roleStr) {
    UserPlan plan = parseEnum(UserPlan.class, planStr);
    UserRole role = parseEnum(UserRole.class, roleStr);
    String search = (q == null || q.isBlank()) ? null : q.trim();

    List<UserEntity> users = userRepository.searchUsers(search, plan, role);
    List<AdminUserResponse> dtos = users.stream().map(this::toResponse).toList();
    return new AdminUserListResponse(dtos, dtos.size());
  }

  public AdminUserResponse getUser(String id) {
    return toResponse(findOrThrow(id));
  }

  @Transactional
  public AdminUserResponse updateUser(String id, AdminUserUpdateRequest req) {
    UserEntity user = findOrThrow(id);

    if (req.plan() != null && !req.plan().isBlank()) {
      try {
        user.setPlan(UserPlan.valueOf(req.plan().toUpperCase()));
      } catch (IllegalArgumentException e) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Gói không hợp lệ: " + req.plan());
      }
    }

    if (req.role() != null && !req.role().isBlank()) {
      try {
        user.setRole(UserRole.valueOf(req.role().toUpperCase()));
      } catch (IllegalArgumentException e) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ: " + req.role());
      }
    }

    return toResponse(userRepository.save(user));
  }

  @Transactional
  public void deleteUser(String id) {
    if (!userRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy học viên");
    }
    userRepository.deleteById(id);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private UserEntity findOrThrow(String id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy học viên"));
  }

  private AdminUserResponse toResponse(UserEntity u) {
    return new AdminUserResponse(
        u.getId(),
        u.getFullName(),
        u.getEmail(),
        u.getUsername(),
        u.getAge(),
        u.getPlan().name().toLowerCase(),
        u.getRole().name().toLowerCase(),
        u.getXp(),
        u.getStreak(),
        u.getQuizScoreTotal(),
        u.getAvatarUrl(),
        u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
  }

  private <E extends Enum<E>> E parseEnum(Class<E> cls, String value) {
    if (value == null || value.isBlank()) return null;
    try {
      return Enum.valueOf(cls, value.toUpperCase());
    } catch (IllegalArgumentException e) {
      return null;
    }
  }
}
