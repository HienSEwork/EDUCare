package vn.educare.backend.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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
class CommunityControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void authenticatedUserCanCreateReplyLikeAndDeletePost() throws Exception {
    String token = registerAndLogin("minhanh", "minhanh@educare.vn");

    MvcResult createPostResult = mockMvc.perform(post("/api/community/posts")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "content": "Bai test workflow community",
                  "anonymous": false
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content").value("Bai test workflow community"))
        .andReturn();

    JsonNode createdPost = objectMapper.readTree(createPostResult.getResponse().getContentAsString());
    long postId = createdPost.get("id").asLong();

    mockMvc.perform(post("/api/community/posts/{postId}/replies", postId)
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "content": "Reply test",
                  "anonymous": true
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.replies[0].content").value("Reply test"));

    mockMvc.perform(post("/api/community/posts/{postId}/likes", postId)
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.likes").value(1))
        .andExpect(jsonPath("$.liked").value(true));

    mockMvc.perform(delete("/api/community/posts/{postId}", postId)
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[?(@.id == " + postId + ")]").doesNotExist());
  }

  @Test
  void publicCommunityEndpointsReturnSeedData() throws Exception {
    String token = registerAndLogin("publicseed", "publicseed@educare.vn");

    mockMvc.perform(post("/api/community/posts")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "content": "Chủ đề công khai để kiểm tra danh sách",
                  "anonymous": false
                }
                """))
        .andExpect(status().isOk());

    mockMvc.perform(post("/api/community/questions")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "question": "Làm sao để cân bằng học và nghỉ ngơi?"
                }
                """))
        .andExpect(status().isOk());

    mockMvc.perform(get("/api/community/posts"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].content").isNotEmpty());

    mockMvc.perform(get("/api/community/questions"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].question").isNotEmpty());
  }

  private String registerAndLogin(String username, String email) throws Exception {
    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "fullName": "Test User %s",
                  "email": "%s",
                  "username": "%s",
                  "password": "Admin@123",
                  "age": 16
                }
                """.formatted(username, email, username)))
        .andExpect(status().isOk());

    return login(username, "Admin@123");
  }

  private String login(String login, String password) throws Exception {
    MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "login": "%s",
                  "password": "%s"
                }
                """.formatted(login, password)))
        .andExpect(status().isOk())
        .andReturn();

    return objectMapper.readTree(loginResult.getResponse().getContentAsString()).get("token").asText();
  }
}
