package vn.educare.backend.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.AssistantDtos.AssistantChatRequest;
import vn.educare.backend.api.AssistantDtos.AssistantChatResponse;
import vn.educare.backend.service.AssistantRateLimiter;
import vn.educare.backend.service.GeminiService;
import vn.educare.backend.service.GeminiService.ChatTurn;

@RestController
@RequiredArgsConstructor
public class AssistantController {

  private final GeminiService geminiService;
  private final AssistantRateLimiter rateLimiter;

  @PostMapping("/api/assistant/chat")
  public AssistantChatResponse chat(
      @Valid @RequestBody AssistantChatRequest request,
      HttpServletRequest httpRequest
  ) {
    if (!rateLimiter.allow(clientAddress(httpRequest))) {
      throw new ApiException(429, "Bạn đang gửi quá nhanh. Vui lòng thử lại sau ít phút.");
    }

    List<ChatTurn> history = request.history() == null
        ? List.of()
        : request.history().stream()
            .map(turn -> new ChatTurn(turn.role(), turn.content()))
            .toList();

    String reply = geminiService.generateAssistantReply(request.message(), history);
    if (reply == null || reply.isBlank()) {
      throw new ApiException(503, "Trợ lý EDUcare đang bận. Bạn vui lòng thử lại sau.");
    }
    return new AssistantChatResponse(reply);
  }

  private String clientAddress(HttpServletRequest request) {
    String realIp = request.getHeader("X-Real-IP");
    return realIp == null || realIp.isBlank() ? request.getRemoteAddr() : realIp.trim();
  }
}
