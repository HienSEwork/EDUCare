package vn.educare.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import vn.educare.backend.config.AppProperties;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {

  private final AppProperties appProperties;
  private final ObjectMapper objectMapper;
  private final HttpClient httpClient = HttpClient.newBuilder()
      .connectTimeout(Duration.ofSeconds(10))
      .build();

  public String generateReply(String userMessage) {
    String apiKey = appProperties.gemini() != null ? appProperties.gemini().apiKey() : null;
    if (apiKey == null || apiKey.trim().isEmpty()) {
      log.warn("Gemini API key is not configured. Falling back to keyword-based matching.");
      return null;
    }

    try {
      String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=" + apiKey;

      // Define strict system instructions for crewBot
      String systemPrompt = "Bạn là crewBot, trợ lý ảo đồng hành chuyên biệt về giáo dục giới tính, tâm sinh lý tuổi teen và tâm lý học đường của dự án EDUcare. "
          + "Nhiệm vụ duy nhất của bạn là hỗ trợ, chia sẻ và cung cấp kiến thức về giáo dục giới tính, những thay đổi của cơ thể, tình bạn/tình yêu tuổi học trò, căng thẳng học tập và các chủ đề tâm lý liên quan.\n\n"
          + "BẮT BUỘC tuân thủ các quy tắc sau:\n"
          + "1. Chỉ trả lời các câu hỏi hoặc chia sẻ nằm trong phạm vi giáo dục giới tính, tâm sinh lý, sức khỏe sinh sản, tình cảm tuổi teen và học tập.\n"
          + "2. Đối với bất kỳ câu hỏi nào nằm ngoài phạm vi này (ví dụ: toán học '1+1', khoa học khác, viết code, đố vui không liên quan...), bạn phải từ chối trả lời một cách lịch sự. "
          + "Mẫu từ chối: \"Mình là crewBot, trợ lý đồng hành chuyên biệt về giáo dục giới tính và tâm sinh lý học đường của EDUcare. Hiện tại mình chỉ hỗ trợ các chủ đề liên quan đến giáo dục giới tính, thay đổi cơ thể, tình cảm tuổi teen và học tập thôi nha. Bạn có câu hỏi nào về các chủ đề này không?\"\n"
          + "3. Hãy phản hồi bằng tiếng Việt với giọng điệu vô cùng ấm áp, gần gũi, đồng cảm sâu sắc như một người bạn thân hay người anh/chị đáng tin cậy.\n"
          + "4. Nguyên tắc độ dài và cấu trúc tin nhắn:\n"
          + "   - Đối với câu chào hỏi, làm quen hoặc bộc lộ cảm xúc ngắn (ví dụ: 'chào bạn', 'mình buồn quá'): Trả lời ngắn gọn (2-3 câu), tập trung thể hiện sự lắng nghe, đồng cảm và hỏi han gợi mở để người dùng chia sẻ thêm.\n"
          + "   - Đối với câu hỏi cụ thể hoặc chia sẻ chi tiết (ví dụ: 'làm sao để hết stress', 'bạn đó không thích mình'): Cung cấp câu trả lời có cấu trúc rõ ràng (khoảng 3-6 câu), chia nhỏ đoạn văn hoặc sử dụng gạch đầu dòng ngắn gọn để dễ đọc trên khung chat. Đưa ra 1-2 hành động/bài tập cụ thể (như thở sâu, viết nhật ký, cách nhắn tin...) thay vì khuyên chung chung.\n"
          + "   - Tránh viết một đoạn văn quá dài liền mạch. Hãy xuống dòng hợp lý và in đậm các từ khóa quan trọng để tin nhắn trực quan và dễ tiếp nhận.";

      Map<String, Object> systemInstruction = Map.of(
          "parts", List.of(Map.of("text", systemPrompt))
      );

      Map<String, Object> contentPart = Map.of("text", userMessage);
      Map<String, Object> content = Map.of(
          "role", "user",
          "parts", List.of(contentPart)
      );

      Map<String, Object> requestBody = Map.of(
          "contents", List.of(content),
          "systemInstruction", systemInstruction
      );

      String requestBodyJson = objectMapper.writeValueAsString(requestBody);

      HttpRequest request = HttpRequest.newBuilder()
          .uri(URI.create(url))
          .header("Content-Type", "application/json")
          .POST(HttpRequest.BodyPublishers.ofString(requestBodyJson))
          .timeout(Duration.ofSeconds(10))
          .build();

      int maxRetries = 2;
      HttpResponse<String> response = null;
      for (int attempt = 1; attempt <= maxRetries; attempt++) {
        response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() == 200) {
          break;
        } else if (response.statusCode() == 503 && attempt < maxRetries) {
          log.warn("Gemini API returned 503 (High Demand). Retrying in 1000ms... (Attempt {}/{})", attempt, maxRetries);
          Thread.sleep(1000);
        } else {
          break;
        }
      }

      if (response != null && response.statusCode() == 200) {
        Map<?, ?> responseMap = objectMapper.readValue(response.body(), Map.class);
        List<?> candidates = (List<?>) responseMap.get("candidates");
        if (candidates != null && !candidates.isEmpty()) {
          Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
          Map<?, ?> responseContent = (Map<?, ?>) candidate.get("content");
          if (responseContent != null) {
            List<?> parts = (List<?>) responseContent.get("parts");
            if (parts != null && !parts.isEmpty()) {
              Map<?, ?> part = (Map<?, ?>) parts.get(0);
              String replyText = (String) part.get("text");
              if (replyText != null) {
                return replyText.trim();
              }
            }
          }
        }
      } else if (response != null) {
        log.error("Gemini API call failed with status: {}, body: {}", response.statusCode(), response.body());
      }
    } catch (Exception e) {
      log.error("Error generating reply from Gemini API", e);
    }

    return null;
  }
}
