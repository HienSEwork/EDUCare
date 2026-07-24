package vn.educare.backend.config;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(100)
@RequiredArgsConstructor
@Slf4j
public class AdminCredentialMigrationRunner implements CommandLineRunner {

  static final String VERSION = "V27__admin_credentials";
  private final DataSource dataSource;
  private final AppProperties appProperties;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) throws Exception {
    try (Connection connection = dataSource.getConnection()) {
      boolean originalAutoCommit = connection.getAutoCommit();
      connection.setAutoCommit(false);
      try {
        createHistoryTable(connection);
        if (isApplied(connection)) {
          log.info("Database migration {} already applied; skipping", VERSION);
          connection.commit();
          return;
        }

        String email = appProperties.admin().email().trim().toLowerCase();
        String password = appProperties.admin().password();
        if (email.isBlank() || password == null || password.length() < 8) {
          throw new IllegalStateException("Admin email/password configuration is missing or too weak");
        }

        ensureEmailAvailable(connection, email);
        try (PreparedStatement update = connection.prepareStatement("""
            UPDATE users
            SET email = ?, password_hash = ?, role = 'ADMIN', updated_at = CURRENT_TIMESTAMP
            WHERE username = 'educare_admin' AND role = 'ADMIN'
            """)) {
          update.setString(1, email);
          update.setString(2, passwordEncoder.encode(password));
          if (update.executeUpdate() != 1) {
            throw new IllegalStateException("Cannot find the primary legacy admin account educare_admin");
          }
        }

        try (PreparedStatement history = connection.prepareStatement(
            "INSERT INTO app_schema_migrations (version, description) VALUES (?, ?)")) {
          history.setString(1, VERSION);
          history.setString(2, "Move the primary legacy admin to configured credentials");
          history.executeUpdate();
        }
        connection.commit();
        log.info("Database migration {} applied successfully", VERSION);
      } catch (Exception exception) {
        connection.rollback();
        throw exception;
      } finally {
        connection.setAutoCommit(originalAutoCommit);
      }
    }
  }

  private void createHistoryTable(Connection connection) throws Exception {
    try (Statement statement = connection.createStatement()) {
      statement.execute("""
          CREATE TABLE IF NOT EXISTS app_schema_migrations (
            version VARCHAR(100) NOT NULL PRIMARY KEY,
            description VARCHAR(255) NOT NULL,
            installed_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
          """);
    }
  }

  private boolean isApplied(Connection connection) throws Exception {
    try (PreparedStatement statement = connection.prepareStatement(
        "SELECT COUNT(*) FROM app_schema_migrations WHERE version = ?")) {
      statement.setString(1, VERSION);
      try (ResultSet resultSet = statement.executeQuery()) {
        return resultSet.next() && resultSet.getLong(1) > 0;
      }
    }
  }

  private void ensureEmailAvailable(Connection connection, String email) throws Exception {
    try (PreparedStatement statement = connection.prepareStatement(
        "SELECT COUNT(*) FROM users WHERE lower(email) = ? AND username <> 'educare_admin'")) {
      statement.setString(1, email);
      try (ResultSet resultSet = statement.executeQuery()) {
        if (resultSet.next() && resultSet.getLong(1) > 0) {
          throw new IllegalStateException("Configured admin email already belongs to another account");
        }
      }
    }
  }
}
