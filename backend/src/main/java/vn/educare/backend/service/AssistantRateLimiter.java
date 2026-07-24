package vn.educare.backend.service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AssistantRateLimiter {

  private static final int MAX_REQUESTS_PER_MINUTE = 20;
  private static final long WINDOW_SECONDS = 60;
  private final Map<String, RequestWindow> windows = new ConcurrentHashMap<>();

  public boolean allow(String clientKey) {
    long now = Instant.now().getEpochSecond();
    RequestWindow window = windows.computeIfAbsent(clientKey, ignored -> new RequestWindow(now));

    synchronized (window) {
      if (now - window.startedAt >= WINDOW_SECONDS) {
        window.startedAt = now;
        window.count = 0;
      }
      if (window.count >= MAX_REQUESTS_PER_MINUTE) {
        return false;
      }
      window.count++;
      return true;
    }
  }

  @Scheduled(fixedDelay = 300_000)
  void removeExpiredWindows() {
    long cutoff = Instant.now().getEpochSecond() - (WINDOW_SECONDS * 2);
    windows.entrySet().removeIf(entry -> entry.getValue().startedAt < cutoff);
  }

  private static final class RequestWindow {
    private long startedAt;
    private int count;

    private RequestWindow(long startedAt) {
      this.startedAt = startedAt;
    }
  }
}
