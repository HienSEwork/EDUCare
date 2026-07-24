package vn.educare.backend.config;

import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
@Slf4j
public class DatabaseMigrationRunner implements CommandLineRunner {

  static final String VERSION = "V26__blog_posts_bonus";
  private static final String DESCRIPTION = "Add bonus blog posts without deleting existing posts";
  private static final String RESOURCE_PATH = "migration-data/seed_bonus.sql";

  private final DataSource dataSource;

  @Override
  public void run(String... args) throws Exception {
    String sourceSql = new ClassPathResource(RESOURCE_PATH).getContentAsString(StandardCharsets.UTF_8);
    String migrationSql = extractBlogInsert(sourceSql);

    try (Connection connection = dataSource.getConnection()) {
      boolean originalAutoCommit = connection.getAutoCommit();
      connection.setAutoCommit(false);
      try {
        createHistoryTable(connection);
        if (isApplied(connection, VERSION)) {
          log.info("Database migration {} already applied; skipping", VERSION);
        } else {
          log.info("Applying additive database migration {}", VERSION);
          ScriptUtils.executeSqlScript(
              connection,
              new EncodedResource(
                  new org.springframework.core.io.ByteArrayResource(
                      migrationSql.getBytes(StandardCharsets.UTF_8)),
                  StandardCharsets.UTF_8));
          recordMigration(connection, VERSION, DESCRIPTION);
          log.info("Database migration {} applied successfully", VERSION);
        }

        connection.commit();
      } catch (Exception exception) {
        connection.rollback();
        throw exception;
      } finally {
        connection.setAutoCommit(originalAutoCommit);
      }
    }
  }

  static String extractBlogInsert(String sourceSql) {
    int start = sourceSql.indexOf("INSERT INTO blog_posts");
    int end = sourceSql.indexOf("INSERT INTO community_posts", start);
    if (start < 0 || end < 0 || end <= start) {
      throw new IllegalStateException("Cannot isolate blog_posts data from seed_bonus.sql");
    }

    String blogSql = sourceSql.substring(start, end).trim();
    int duplicateClause = blogSql.lastIndexOf("ON DUPLICATE KEY UPDATE");
    if (duplicateClause < 0) {
      throw new IllegalStateException("blog_posts seed must have an idempotent duplicate-key clause");
    }

    // Existing slugs remain untouched. Only rows whose slug does not exist are inserted.
    return blogSql.substring(0, duplicateClause)
        + "ON DUPLICATE KEY UPDATE slug = VALUES(slug);";
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

  private boolean isApplied(Connection connection, String version) throws Exception {
    try (PreparedStatement statement = connection.prepareStatement(
        "SELECT COUNT(*) FROM app_schema_migrations WHERE version = ?")) {
      statement.setString(1, version);
      try (ResultSet resultSet = statement.executeQuery()) {
        return resultSet.next() && resultSet.getLong(1) > 0;
      }
    }
  }

  private void recordMigration(Connection connection, String version, String description) throws Exception {
    try (PreparedStatement statement = connection.prepareStatement(
        "INSERT INTO app_schema_migrations (version, description) VALUES (?, ?)")) {
      statement.setString(1, version);
      statement.setString(2, description);
      statement.executeUpdate();
    }
  }

}
