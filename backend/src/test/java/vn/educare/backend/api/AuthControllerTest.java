package vn.educare.backend.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void registerAndFetchCurrentUser() throws Exception {
    MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "fullName": "Test Student",
                  "email": "teststudent@educare.vn",
                  "username": "teststudent",
                  "password": "Password@123",
                  "age": 16
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").isString())
        .andExpect(jsonPath("$.user.email").value("teststudent@educare.vn"))
        .andReturn();

    JsonNode json = objectMapper.readTree(registerResult.getResponse().getContentAsString());
    String token = json.get("token").asText();

    mockMvc.perform(get("/api/auth/me")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.user.username").value("teststudent"))
        .andExpect(jsonPath("$.user.role").value("student"));
  }

  @Test
  void seededAdminCanLogin() throws Exception {
    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "fullName": "Seed Test User",
                  "email": "seedtest@educare.vn",
                  "username": "seedtest",
                  "password": "Admin@123",
                  "age": 16
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.user.isAdmin").value(false))
        .andExpect(jsonPath("$.user.email").value("seedtest@educare.vn"));

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "login": "seedtest",
                  "password": "Admin@123"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.user.username").value("seedtest"));
  }
}
