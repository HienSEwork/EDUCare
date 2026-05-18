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

  @GetMapping("/me")
  public Map<String, UserResponse> me() {
    return Map.of("user", authService.me(currentUser.id()));
  }
}
