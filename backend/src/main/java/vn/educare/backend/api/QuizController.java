package vn.educare.backend.api;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.AuthDtos.QuizResultResponse;
import vn.educare.backend.api.AuthDtos.QuizSessionResponse;
import vn.educare.backend.api.AuthDtos.QuizSubmitRequest;
import vn.educare.backend.security.AppUserDetails;
import vn.educare.backend.service.QuizService;

@RestController
@RequiredArgsConstructor
public class QuizController {

  private final QuizService quizService;

  @GetMapping("/api/quizzes/session")
  public QuizSessionResponse session(@RequestParam(defaultValue = "quick") String mode) {
    return quizService.startSession(mode);
  }

  @PostMapping("/api/quizzes/submit")
  public QuizResultResponse submit(Authentication authentication, @Valid @RequestBody QuizSubmitRequest request) {
    return quizService.submit(optionalUserId(authentication), request);
  }

  private String optionalUserId(Authentication authentication) {
    if (authentication == null || !(authentication.getPrincipal() instanceof AppUserDetails details)) {
      return null;
    }

    return details.user().getId();
  }
}
