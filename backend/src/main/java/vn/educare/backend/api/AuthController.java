package vn.educare.backend.api;

import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.AuthDtos.AuthResponse;
import vn.educare.backend.api.AuthDtos.ForgotPasswordRequest;
import vn.educare.backend.api.AuthDtos.LoginRequest;
import vn.educare.backend.api.AuthDtos.PasswordResetRequest;
import vn.educare.backend.api.AuthDtos.PasswordResetResponse;
import vn.educare.backend.api.AuthDtos.RegisterRequest;
import vn.educare.backend.api.AuthDtos.UserResponse;
import vn.educare.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final CurrentUser currentUser;

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }

  @PostMapping("/logout")
  public Map<String, String> logout() {
    return Map.of("status", "ok");
  }

  @PostMapping("/forgot-password")
  public PasswordResetResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
    return authService.requestPasswordReset(request.email());
  }

  @PostMapping("/reset-password")
  public Map<String, String> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
    authService.resetPassword(request.token(), request.password());
    return Map.of("status", "success");
  }

  @GetMapping("/me")
  public Map<String, UserResponse> me() {
    return Map.of("user", authService.me(currentUser.id()));
  }
}
