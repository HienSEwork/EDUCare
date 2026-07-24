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
import vn.educare.backend.api.AuthDtos.LoginRequest;
import vn.educare.backend.api.AuthDtos.GoogleLoginRequest;
import vn.educare.backend.api.AuthDtos.ForgotPasswordRequest;
import vn.educare.backend.api.AuthDtos.ResetPasswordRequest;
import vn.educare.backend.api.AuthDtos.MessageResponse;
import vn.educare.backend.api.AuthDtos.RegisterRequest;
import vn.educare.backend.api.AuthDtos.UserResponse;
import vn.educare.backend.service.AuthService;
import vn.educare.backend.service.PasswordResetService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final CurrentUser currentUser;
  private final PasswordResetService passwordResetService;

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }

  @PostMapping("/google")
  public AuthResponse google(@Valid @RequestBody GoogleLoginRequest request) {
    return authService.loginWithGoogle(request);
  }

  @PostMapping("/forgot-password")
  public MessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
    passwordResetService.sendOtp(request.email());
    return new MessageResponse("Nếu email tồn tại, mã OTP đã được gửi.");
  }

  @PostMapping("/reset-password")
  public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
    passwordResetService.resetPassword(request.email(), request.otp(), request.newPassword());
    return new MessageResponse("Đặt lại mật khẩu thành công.");
  }

  @GetMapping("/me")
  public Map<String, UserResponse> me() {
    return Map.of("user", authService.me(currentUser.id()));
  }
}
