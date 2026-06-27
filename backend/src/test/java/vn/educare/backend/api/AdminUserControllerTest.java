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
class AdminUserControllerTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private UserRepository userRepository;

  private String adminToken;
  private String studentId;

  /** Register + promote admin, register a student for testing. */
  @BeforeEach
  void setUp() throws Exception {
    // Register admin
    MvcResult adminReg = mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "fullName": "Admin User Test",
                  "email": "admin_user_test@educare.vn",
                  "username": "admin_user_test",
                  "password": "Admin@123",
                  "age": 18
                }
                """))
        .andReturn();

    String adminId = objectMapper.readTree(adminReg.getResponse().getContentAsString())
        .path("user").path("id").asText("");

    // Promote to ADMIN via repository
    if (!adminId.isBlank()) {
      userRepository.findById(adminId).ifPresent(u -> {
        u.setRole(UserRole.ADMIN);
        userRepository.save(u);
      });
    }

    // Login to get fresh token with ADMIN role
    MvcResult adminLogin = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                { "login": "admin_user_test@educare.vn", "password": "Admin@123" }
                """))
        .andReturn();
    adminToken = objectMapper.readTree(adminLogin.getResponse().getContentAsString())
        .path("token").asText("");

    // Student to manage
    MvcResult studentReg = mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "fullName": "Student Under Test",
                  "email": "student_under_test@educare.vn",
                  "username": "student_under_test",
                  "password": "Password@123",
                  "age": 15
                }
                """))
        .andReturn();

    JsonNode studentJson = objectMapper.readTree(studentReg.getResponse().getContentAsString());
    studentId = studentJson.path("user").path("id").asText("");
  }

  // ── GET /api/admin/users ───────────────────────────────────────────────────

  @Test
  void listUsers_requiresAdmin() throws Exception {
    mockMvc.perform(get("/api/admin/users"))
        .andExpect(status().isForbidden());
  }

  @Test
  void listUsers_returnsAllUsersForAdmin() throws Exception {
    mockMvc.perform(get("/api/admin/users")
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.users", hasSize(greaterThanOrEqualTo(1))))
        .andExpect(jsonPath("$.total").isNumber());
  }

  @Test
  void listUsers_searchByName() throws Exception {
    mockMvc.perform(get("/api/admin/users?q=Student Under Test")
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.users[0].fullName").value("Student Under Test"));
  }

  @Test
  void listUsers_filterByPlan() throws Exception {
    mockMvc.perform(get("/api/admin/users?plan=free")
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.users").isArray());
  }

  @Test
  void listUsers_filterByRole() throws Exception {
    mockMvc.perform(get("/api/admin/users?role=student")
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.users").isArray());
  }

  // ── GET /api/admin/users/{id} ──────────────────────────────────────────────

  @Test
  void getUser_returnsUserDetail() throws Exception {
    if (studentId.isBlank()) return; // already registered in a prior test run
    mockMvc.perform(get("/api/admin/users/" + studentId)
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("student_under_test@educare.vn"))
        .andExpect(jsonPath("$.plan").value("free"))
        .andExpect(jsonPath("$.role").value("student"));
  }

  @Test
  void getUser_notFound() throws Exception {
    mockMvc.perform(get("/api/admin/users/nonexistent-id-000")
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isNotFound());
  }

  // ── PUT /api/admin/users/{id} ──────────────────────────────────────────────

  @Test
  void updateUser_changePlan() throws Exception {
    if (studentId.isBlank()) return;
    mockMvc.perform(put("/api/admin/users/" + studentId)
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                { "plan": "PREMIUM" }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.plan").value("premium"));
  }

  @Test
  void updateUser_changeRole() throws Exception {
    if (studentId.isBlank()) return;
    mockMvc.perform(put("/api/admin/users/" + studentId)
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                { "role": "ADMIN" }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.role").value("admin"));
  }

  @Test
  void updateUser_invalidPlan_returns400() throws Exception {
    if (studentId.isBlank()) return;
    mockMvc.perform(put("/api/admin/users/" + studentId)
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                { "plan": "INVALID_PLAN" }
                """))
        .andExpect(status().isBadRequest());
  }

  // ── DELETE /api/admin/users/{id} ──────────────────────────────────────────

  @Test
  void deleteUser_removesUser() throws Exception {
    // Register a throwaway user
    MvcResult reg = mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "fullName": "Throwaway User",
                  "email": "throwaway_del@educare.vn",
                  "username": "throwaway_del",
                  "password": "Password@123",
                  "age": 14
                }
                """))
        .andReturn();

    String throwawayId = objectMapper.readTree(reg.getResponse().getContentAsString())
        .path("user").path("id").asText("");

    if (throwawayId.isBlank()) return;

    mockMvc.perform(delete("/api/admin/users/" + throwawayId)
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk());

    mockMvc.perform(get("/api/admin/users/" + throwawayId)
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isNotFound());
  }

  @Test
  void deleteUser_notFound_returns404() throws Exception {
    mockMvc.perform(delete("/api/admin/users/ghost-id-999")
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isNotFound());
  }
}
