package vn.educare.backend.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.nio.file.Files;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;

@Component
@Order(1)
@ConditionalOnProperty(name = "app.database.seed-enabled", havingValue = "true", matchIfMissing = true)
@RequiredArgsConstructor
@Slf4j
public class CourseDetailJsonInitializer implements CommandLineRunner {

    private static final String MIGRATION_VERSION = "LOCAL_V1__course_details_json";
    private static final String MIGRATION_DESCRIPTION = "Restore local course details from CourseJSON exports";
    private static final long COMPLETE_MICRO_LESSON_COUNT = 500;
    private static final long COMPLETE_BLOCK_COUNT = 3_000;

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (isMigrationApplied()) {
            log.info("Local course detail migration {} is already applied; skipping JSON scan.", MIGRATION_VERSION);
            return;
        }

        Long existingMicroLessons = countRows("micro_lessons");
        Long existingBlocks = countRows("micro_lesson_blocks");
        if (existingMicroLessons >= COMPLETE_MICRO_LESSON_COUNT && existingBlocks >= COMPLETE_BLOCK_COUNT) {
            recordMigration();
            log.info(
                    "Existing local course details are complete (microLessons={}, blocks={}); migration marked as applied.",
                    existingMicroLessons,
                    existingBlocks);
            return;
        }

        File jsonDirectory = resolveJsonDirectory();
        if (jsonDirectory == null) {
            log.warn("Course detail JSON directory was not found; skipping local detail restoration.");
            return;
        }

        File[] candidates = jsonDirectory.listFiles((directory, name) -> name.endsWith(".json"));
        if (candidates == null || candidates.length == 0) {
            log.warn("No course detail JSON files were found in {}.", jsonDirectory.getCanonicalPath());
            return;
        }

        List<File> files = new ArrayList<>(List.of(candidates));
        files.sort(Comparator.comparing((File file) -> !file.getName().equals("educare.json"))
                .thenComparing(File::getName));

        int insertedSources = 0;
        int insertedMicroLessons = 0;
        int insertedBlocks = 0;

        for (File file : files) {
            JsonNode export = objectMapper.readTree(Files.readString(file.toPath()));
            Map<String, List<JsonNode>> tables = collectTables(export);
            Map<Long, Long> lessonIds = resolveLessonIds(tables.getOrDefault("lessons", List.of()));

            insertedSources += restoreSources(tables.getOrDefault("lesson_sources", List.of()), lessonIds);

            MicroLessonRestoreResult microResult = restoreMicroLessons(
                    tables.getOrDefault("micro_lessons", List.of()), lessonIds);
            insertedMicroLessons += microResult.insertedCount();
            insertedBlocks += restoreBlocks(
                    tables.getOrDefault("micro_lesson_blocks", List.of()), microResult.idMap());
        }

        Long totalMicroLessons = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM micro_lessons", Long.class);
        Long totalBlocks = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM micro_lesson_blocks", Long.class);
        recordMigration();
        log.info(
                "Course details ready: inserted sources={}, microLessons={}, blocks={}; totals microLessons={}, blocks={}",
                insertedSources,
                insertedMicroLessons,
                insertedBlocks,
                totalMicroLessons,
                totalBlocks);
    }

    private boolean isMigrationApplied() {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM app_schema_migrations WHERE version = ?",
                Integer.class,
                MIGRATION_VERSION);
        return count != null && count > 0;
    }

    private long countRows(String tableName) {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tableName, Long.class);
        return count == null ? 0 : count;
    }

    private void recordMigration() {
        jdbcTemplate.update(
                "INSERT INTO app_schema_migrations (version, description) "
                        + "SELECT ?, ? WHERE NOT EXISTS "
                        + "(SELECT 1 FROM app_schema_migrations WHERE version = ?)",
                MIGRATION_VERSION,
                MIGRATION_DESCRIPTION,
                MIGRATION_VERSION);
    }

    private File resolveJsonDirectory() {
        File parentDataDirectory = new File("../data/CourseJSON");
        if (parentDataDirectory.isDirectory()) {
            return parentDataDirectory;
        }

        File rootDataDirectory = new File("data/CourseJSON");
        return rootDataDirectory.isDirectory() ? rootDataDirectory : null;
    }

    private Map<String, List<JsonNode>> collectTables(JsonNode export) {
        Map<String, List<JsonNode>> tables = new HashMap<>();
        if (!export.isArray()) {
            return tables;
        }

        for (JsonNode entry : export) {
            if (!"table".equals(entry.path("type").asText()) || !entry.path("data").isArray()) {
                continue;
            }

            List<JsonNode> rows = tables.computeIfAbsent(entry.path("name").asText(), ignored -> new ArrayList<>());
            entry.path("data").forEach(rows::add);
        }
        return tables;
    }

    private Map<Long, Long> resolveLessonIds(List<JsonNode> lessons) {
        Map<Long, Long> ids = new HashMap<>();
        for (JsonNode lesson : lessons) {
            Long currentId = queryOptionalLong(
                    "SELECT id FROM lessons WHERE slug = ?",
                    lesson.path("slug").asText());
            if (currentId != null) {
                ids.put(lesson.path("id").asLong(), currentId);
            }
        }
        return ids;
    }

    private int restoreSources(List<JsonNode> sources, Map<Long, Long> lessonIds) {
        int inserted = 0;
        for (JsonNode source : sources) {
            Long lessonId = lessonIds.get(source.path("lesson_id").asLong());
            if (lessonId == null) {
                continue;
            }

            String sourceUrl = nullableText(source, "source_url");
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM lesson_sources WHERE lesson_id = ? AND source_url = ?",
                    Integer.class,
                    lessonId,
                    sourceUrl);
            if (count != null && count > 0) {
                continue;
            }

            jdbcTemplate.update(
                    "INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES (?, ?, ?, ?)",
                    lessonId,
                    nullableText(source, "source_name"),
                    sourceUrl,
                    nullableText(source, "source_type"));
            inserted++;
        }
        return inserted;
    }

    private MicroLessonRestoreResult restoreMicroLessons(List<JsonNode> microLessons, Map<Long, Long> lessonIds) {
        Map<Long, Long> ids = new HashMap<>();
        int inserted = 0;

        for (JsonNode microLesson : microLessons) {
            Long lessonId = lessonIds.get(microLesson.path("lesson_id").asLong());
            if (lessonId == null) {
                continue;
            }

            int order = microLesson.path("micro_order").asInt();
            Long currentId = queryOptionalLong(
                    "SELECT id FROM micro_lessons WHERE lesson_id = ? AND micro_order = ?",
                    lessonId,
                    order);
            if (currentId == null) {
                KeyHolder keyHolder = new GeneratedKeyHolder();
                jdbcTemplate.update(connection -> {
                    PreparedStatement statement = connection.prepareStatement(
                            "INSERT INTO micro_lessons (lesson_id, title, micro_order, created_at, updated_at) "
                                    + "VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                            Statement.RETURN_GENERATED_KEYS);
                    statement.setLong(1, lessonId);
                    statement.setString(2, nullableText(microLesson, "title"));
                    statement.setInt(3, order);
                    return statement;
                }, keyHolder);
                Number generatedId = keyHolder.getKey();
                currentId = generatedId == null ? null : generatedId.longValue();
                inserted++;
            }

            if (currentId != null) {
                ids.put(microLesson.path("id").asLong(), currentId);
            }
        }
        return new MicroLessonRestoreResult(ids, inserted);
    }

    private int restoreBlocks(List<JsonNode> blocks, Map<Long, Long> microLessonIds) {
        int inserted = 0;
        for (JsonNode block : blocks) {
            Long microLessonId = microLessonIds.get(block.path("micro_lesson_id").asLong());
            if (microLessonId == null) {
                continue;
            }

            int order = block.path("order_index").asInt();
            String blockType = nullableText(block, "block_type");
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM micro_lesson_blocks "
                            + "WHERE micro_lesson_id = ? AND order_index = ? AND block_type = ?",
                    Integer.class,
                    microLessonId,
                    order,
                    blockType);
            if (count != null && count > 0) {
                continue;
            }

            JsonNode contentNode = block.path("content_json");
            String contentJson = contentNode.isTextual() ? contentNode.asText() : contentNode.toString();
            jdbcTemplate.update(
                    "INSERT INTO micro_lesson_blocks "
                            + "(micro_lesson_id, block_type, content_json, order_index, created_at, updated_at) "
                            + "VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                    microLessonId,
                    blockType,
                    contentJson,
                    order);
            inserted++;
        }
        return inserted;
    }

    private Long queryOptionalLong(String sql, Object... arguments) {
        List<Long> results = jdbcTemplate.query(sql, (resultSet, rowNumber) -> resultSet.getLong(1), arguments);
        return results.isEmpty() ? null : results.get(0);
    }

    private String nullableText(JsonNode node, String fieldName) {
        JsonNode value = node.get(fieldName);
        return value == null || value.isNull() ? null : value.asText();
    }

    private record MicroLessonRestoreResult(Map<Long, Long> idMap, int insertedCount) {
    }
}
