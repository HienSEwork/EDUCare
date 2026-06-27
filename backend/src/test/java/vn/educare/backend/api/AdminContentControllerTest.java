package vn.educare.backend.api;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import vn.educare.backend.model.UserRole;
import vn.educare.backend.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminContentControllerTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private UserRepository userRepository;

  private String adminToken;

  @BeforeEach
  void setUp() throws Exception {
    // Register a user
    MvcResult reg = mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "fullName": "Admin Content Test",
                  "email": "admin_content_test@educare.vn",
                  "username": "admin_content_test",
                  "password": "Admin@123",
                  "age": 18
                }
                """))
        .andReturn();

    JsonNode regJson = objectMapper.readTree(reg.getResponse().getContentAsString());
    String userId = regJson.path("user").path("id").asText("");

    // Promote to ADMIN directly via repository
    if (!userId.isBlank()) {
      userRepository.findById(userId).ifPresent(u -> {
        u.setRole(UserRole.ADMIN);
        userRepository.save(u);
      });
    }

    // Login to get token
    MvcResult login = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                { "login": "admin_content_test@educare.vn", "password": "Admin@123" }
                """))
        .andReturn();

    JsonNode loginJson = objectMapper.readTree(login.getResponse().getContentAsString());
    adminToken = loginJson.path("token").asText("");
  }

  // ── GET /api/admin/content ─────────────────────────────────────────────────

  @Test
  void contentOverview_requiresAdmin() throws Exception {
    mockMvc.perform(get("/api/admin/content"))
        .andExpect(status().isForbidden());
  }

  @Test
  void contentOverview_returnsMetrics() throws Exception {
    mockMvc.perform(get("/api/admin/content")
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.metrics").exists())
        .andExpect(jsonPath("$.lessons").isArray())
        .andExpect(jsonPath("$.blogPosts").isArray())
        .andExpect(jsonPath("$.quizQuestions").isArray())
        .andExpect(jsonPath("$.games").isArray());
  }

  // ── Lessons CRUD ───────────────────────────────────────────────────────────

  @Test
  void createLesson_success() throws Exception {
    String slug = "test-lesson-" + System.currentTimeMillis();
    String body = String.format("""
        {
          "slug": "%s",
          "title": "Test Lesson CRUD",
          "summary": "Summary for test lesson",
          "content": "Full content here",
          "order": 99,
          "isFree": true,
          "estimatedMinutes": 10
        }
        """, slug);
    MvcResult result = mockMvc.perform(post("/api/admin/lessons")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").isNumber())
        .andExpect(jsonPath("$.title").value("Test Lesson CRUD"))
        .andReturn();

    // Update it
    long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

    String updateBody = String.format("""
        {
          "slug": "%s",
          "title": "Test Lesson CRUD Updated",
          "summary": "Summary updated",
          "content": "Updated content",
          "order": 99,
          "isFree": false
        }
        """, slug);

    mockMvc.perform(put("/api/admin/lessons/" + id)
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(updateBody))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("Test Lesson CRUD Updated"))
        .andExpect(jsonPath("$.isFree").value(false));

    // Delete it
    mockMvc.perform(delete("/api/admin/lessons/" + id)
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk());
  }

  @Test
  void createLesson_missingTitle_returns400() throws Exception {
    mockMvc.perform(post("/api/admin/lessons")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "slug": "no-title-lesson",
                  "summary": "s",
                  "content": "c"
                }
                """))
        .andExpect(status().isBadRequest());
  }

  @Test
  void createLesson_requiresAdmin() throws Exception {
    mockMvc.perform(post("/api/admin/lessons")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                { "slug":"x", "title":"x", "summary":"x", "content":"x" }
                """))
        .andExpect(status().isForbidden());
  }

  // ── Blog Posts CRUD ────────────────────────────────────────────────────────

  @Test
  void createBlogPost_success() throws Exception {
    String slug = "test-blog-" + System.currentTimeMillis();
    String body = String.format("""
        {
          "slug": "%s",
          "title": "Test Blog Post",
          "excerpt": "Short excerpt",
          "content": "Full blog content",
          "category": "Test",
          "date": "2025-06-01",
          "readTimeMinutes": 3,
          "emoji": "test"
        }
        """, slug);

    MvcResult result = mockMvc.perform(post("/api/admin/blog-posts")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").isNumber())
        .andReturn();

    long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

    String updateBody = String.format("""
        {
          "slug": "%s",
          "title": "Test Blog Post Updated",
          "excerpt": "Updated excerpt",
          "content": "Updated content",
          "category": "Updated",
          "date": "2025-06-15",
          "readTimeMinutes": 5,
          "emoji": "test2"
        }
        """, slug);

    mockMvc.perform(put("/api/admin/blog-posts/" + id)
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(updateBody))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("Test Blog Post Updated"));

    mockMvc.perform(delete("/api/admin/blog-posts/" + id)
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk());
  }

  @Test
  void createBlogPost_missingSlug_returns400() throws Exception {
    mockMvc.perform(post("/api/admin/blog-posts")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "title": "No Slug Post",
                  "excerpt": "e",
                  "content": "c",
                  "category": "cat",
                  "date": "2025-01-01",
                  "emoji": "📝"
                }
                """))
        .andExpect(status().isBadRequest());
  }

  // ── Quiz Questions CRUD ────────────────────────────────────────────────────

  @Test
  void createQuizQuestion_success() throws Exception {
    String slug = "test-quiz-" + System.currentTimeMillis();
    String body = String.format("""
        {
          "slug": "%s",
          "question": "Which is a safe online behavior?",
          "options": ["Share your password", "Use strong passwords", "Click unknown links", "Ignore updates"],
          "correct": 1,
          "explanation": "Strong passwords protect your account",
          "category": "Safety",
          "difficulty": "easy",
          "active": true
        }
        """, slug);

    MvcResult result = mockMvc.perform(post("/api/admin/quiz-questions")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").isNumber())
        .andExpect(jsonPath("$.correct").value(1))
        .andExpect(jsonPath("$.options", hasSize(4)))
        .andReturn();

    long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

    String updateBody = String.format("""
        {
          "slug": "%s",
          "question": "Updated question text",
          "options": ["A", "B", "C", "D"],
          "correct": 2,
          "explanation": "Updated explanation",
          "category": "Safety",
          "difficulty": "medium",
          "active": false
        }
        """, slug);

    mockMvc.perform(put("/api/admin/quiz-questions/" + id)
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(updateBody))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.correct").value(2))
        .andExpect(jsonPath("$.active").value(false));

    mockMvc.perform(delete("/api/admin/quiz-questions/" + id)
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk());
  }

  @Test
  void createQuizQuestion_missingQuestion_returns400() throws Exception {
    mockMvc.perform(post("/api/admin/quiz-questions")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "slug": "no-question",
                  "category": "Safety",
                  "difficulty": "easy"
                }
                """))
        .andExpect(status().isBadRequest());
  }

  // ── Games CRUD ─────────────────────────────────────────────────────────────

  @Test
  void createGame_success() throws Exception {
    String slug = "test-game-" + System.currentTimeMillis();
    String body = String.format("""
        {
          "slug": "%s",
          "title": "Test Game",
          "summary": "A test game summary",
          "description": "Detailed description of the test game",
          "gameType": "QUIZ",
          "playPath": "/games/test-game",
          "published": true
        }
        """, slug);

    MvcResult result = mockMvc.perform(post("/api/admin/games")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(body))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").isNumber())
        .andExpect(jsonPath("$.published").value(true))
        .andReturn();

    long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

    String updateBody = String.format("""
        {
          "slug": "%s",
          "title": "Test Game Updated",
          "summary": "Updated summary",
          "description": "Updated description",
          "gameType": "STORY",
          "playPath": "/games/test-game-v2",
          "published": false
        }
        """, slug);

    mockMvc.perform(put("/api/admin/games/" + id)
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(updateBody))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("Test Game Updated"))
        .andExpect(jsonPath("$.published").value(false));

    mockMvc.perform(delete("/api/admin/games/" + id)
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk());
  }

  @Test
  void createGame_missingPlayPath_returns400() throws Exception {
    mockMvc.perform(post("/api/admin/games")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "slug": "no-path-game",
                  "title": "No Path",
                  "summary": "s",
                  "description": "d",
                  "gameType": "QUIZ"
                }
                """))
        .andExpect(status().isBadRequest());
  }

  @Test
  void deleteNonExistentLesson_returns404() throws Exception {
    mockMvc.perform(delete("/api/admin/lessons/99999")
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isNotFound());
  }

  @Test
  void deleteNonExistentBlogPost_returns404() throws Exception {
    mockMvc.perform(delete("/api/admin/blog-posts/99999")
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isNotFound());
  }
}
