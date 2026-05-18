package vn.educare.backend.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Cors cors, Jwt jwt, Admin admin) {

  public record Cors(String allowedOrigins) {
    public List<String> asList() {
      return Arrays.stream(allowedOrigins.split(","))
          .map(String::trim)
          .filter(value -> !value.isBlank())
          .toList();
    }
  }

  public record Jwt(String secret, long expirationHours) {
  }

  public record Admin(String email, String password, String fullName, String username) {
  }
}
