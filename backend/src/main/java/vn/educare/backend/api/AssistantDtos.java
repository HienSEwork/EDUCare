package vn.educare.backend.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public final class AssistantDtos {

  private AssistantDtos() {
  }

  public record ChatTurnRequest(
      @NotBlank @Pattern(regexp = "user|model") String role,
      @NotBlank @Size(max = 2000) String content
  ) {
  }

  public record AssistantChatRequest(
      @NotBlank @Size(max = 1200) String message,
      @Size(max = 12) List<@Valid ChatTurnRequest> history
  ) {
  }

  public record AssistantChatResponse(String reply) {
  }
}
