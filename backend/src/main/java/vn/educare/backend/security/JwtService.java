package vn.educare.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;
import vn.educare.backend.config.AppProperties;
import vn.educare.backend.model.UserEntity;

@Service
public class JwtService {

  private final SecretKey secretKey;
  private final long expirationHours;

  public JwtService(AppProperties appProperties) {
    this.secretKey = Keys.hmacShaKeyFor(appProperties.jwt().secret().getBytes(StandardCharsets.UTF_8));
    this.expirationHours = appProperties.jwt().expirationHours();
  }

  public String generateToken(UserEntity user) {
    Instant now = Instant.now();
    return Jwts.builder()
        .subject(user.getId())
        .claim("role", user.getRole().name())
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plus(expirationHours, ChronoUnit.HOURS)))
        .signWith(secretKey)
        .compact();
  }

  public String extractUserId(String token) {
    return extractClaims(token).getSubject();
  }

  public boolean isTokenValid(String token, UserEntity user) {
    Claims claims = extractClaims(token);
    return user.getId().equals(claims.getSubject()) && claims.getExpiration().after(new Date());
  }

  private Claims extractClaims(String token) {
    return Jwts.parser()
        .verifyWith(secretKey)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}
