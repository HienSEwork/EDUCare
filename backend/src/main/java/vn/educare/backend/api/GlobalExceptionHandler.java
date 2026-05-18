package vn.educare.backend.api;

import jakarta.validation.ConstraintViolationException;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<Map<String, Object>> handleApiException(ApiException exception) {
    return ResponseEntity.status(exception.getStatus()).body(Map.of("message", exception.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException exception) {
    return ResponseEntity.badRequest().body(Map.of("message", "Invalid request"));
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<Map<String, Object>> handleConstraint(ConstraintViolationException exception) {
    return ResponseEntity.badRequest().body(Map.of("message", "Invalid request"));
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException exception) {
    return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleUnexpected(Exception exception) {
    exception.printStackTrace();
    return ResponseEntity.status(500).body(Map.of("message", "Internal server error"));
  }
}
