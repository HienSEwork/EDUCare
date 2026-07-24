package vn.educare.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.FileSystemResource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;
import org.springframework.core.annotation.Order;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.repository.BlogPostRepository;

import javax.sql.DataSource;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
@Order(0)
@ConditionalOnProperty(name = "app.database.seed-enabled", havingValue = "true", matchIfMissing = true)
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializer implements CommandLineRunner {

    private final DataSource dataSource;
    private final UserRepository userRepository;
    private final BlogPostRepository blogPostRepository;

    @Override
    public void run(String... args) throws Exception {
        boolean hasOldDummyPosts = blogPostRepository.findAll().stream().anyMatch(p -> p.getSourceUrl() == null && p.getVideoUrl() == null);
        if (userRepository.count() > 0 && !hasOldDummyPosts && blogPostRepository.count() >= 15) {
            log.info("Database already initialized with fresh blog posts. Skipping initial SQL seed.");
            return;
        }

        log.info("Database is empty. Initializing local database with seed data files...");

        ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
        populator.setContinueOnError(true);
        populator.setIgnoreFailedDrops(true);
        populator.setSqlScriptEncoding(StandardCharsets.UTF_8.name());

        List<File> sqlFiles = new ArrayList<>();

        // Add root SQL data files
        addIfExists(sqlFiles, "../data/init.sql");
        addIfExists(sqlFiles, "../data/seed_users.sql");
        addIfExists(sqlFiles, "../data/insert_game.sql");
        addIfExists(sqlFiles, "../data/seed_bonus.sql");
        addIfExists(sqlFiles, "data/init.sql");
        addIfExists(sqlFiles, "data/seed_users.sql");
        addIfExists(sqlFiles, "data/insert_game.sql");
        addIfExists(sqlFiles, "data/seed_bonus.sql");

        // Add CourseSQL files
        File courseDir1 = new File("../data/CourseSQL");
        File courseDir2 = new File("data/CourseSQL");
        File courseDir = courseDir1.exists() ? courseDir1 : (courseDir2.exists() ? courseDir2 : null);

        if (courseDir != null && courseDir.isDirectory()) {
            File[] files = courseDir.listFiles((dir, name) -> name.endsWith(".sql"));
            if (files != null) {
                for (File f : files) {
                    sqlFiles.add(f);
                }
            }
        }

        if (sqlFiles.isEmpty()) {
            log.warn("No SQL seed files found in data directory.");
            return;
        }

        for (File sqlFile : sqlFiles) {
            log.info("Loading SQL seed file: {}", sqlFile.getCanonicalPath());
            populator.addScript(new FileSystemResource(sqlFile));
        }

        try {
            populator.execute(dataSource);
            log.info("Successfully populated local database from SQL data files! Total users count: {}", userRepository.count());
        } catch (Exception e) {
            log.warn("Notice during database seed execution: {}", e.getMessage());
        }
    }

    private void addIfExists(List<File> list, String path) {
        File file = new File(path);
        if (file.exists() && file.isFile() && !list.contains(file)) {
            list.add(file);
        }
    }
}
