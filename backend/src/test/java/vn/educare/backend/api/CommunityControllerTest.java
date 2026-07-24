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
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.model.UserRole;
import vn.educare.backend.model.UserEntity;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CommunityControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private UserRepository userRepository;

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

  @Test
  void testCommunityDiscussionOptimizations() throws Exception {
    String studentToken = registerAndLogin("student1", "student1@educare.vn");

    MvcResult post1Result = mockMvc.perform(post("/api/community/posts")
            .header("Authorization", "Bearer " + studentToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "content": "Post 1 content",
                  "anonymous": false
                }
                """))
        .andExpect(status().isOk())
        .andReturn();
    JsonNode post1Node = objectMapper.readTree(post1Result.getResponse().getContentAsString());
    long post1Id = post1Node.get("id").asLong();

    MvcResult post2Result = mockMvc.perform(post("/api/community/posts")
            .header("Authorization", "Bearer " + studentToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "content": "Post 2 content",
                  "anonymous": false
                }
                """))
        .andExpect(status().isOk())
        .andReturn();
    JsonNode post2Node = objectMapper.readTree(post2Result.getResponse().getContentAsString());
    long post2Id = post2Node.get("id").asLong();

    MvcResult reply1Result = mockMvc.perform(post("/api/community/posts/{postId}/replies", post2Id)
            .header("Authorization", "Bearer " + studentToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "content": "First level reply",
                  "anonymous": false
                }
                """))
        .andExpect(status().isOk())
        .andReturn();
    JsonNode reply1Node = objectMapper.readTree(reply1Result.getResponse().getContentAsString());
    long reply1Id = reply1Node.get("replies").get(0).get("id").asLong();

    mockMvc.perform(post("/api/community/posts/{postId}/replies", post2Id)
            .header("Authorization", "Bearer " + studentToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "content": "Nested reply to reply1",
                  "anonymous": false,
                  "parentId": %d
                }
                """.formatted(reply1Id)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.replies[1].parentId").value(reply1Id));

    mockMvc.perform(get("/api/community/posts?sortBy=hot")
            .header("Authorization", "Bearer " + studentToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[?(@.id == " + post2Id + ")].id").exists())
        .andExpect(jsonPath("$[?(@.id == " + post1Id + ")].id").exists());

    mockMvc.perform(get("/api/community/posts?sortBy=unanswered")
            .header("Authorization", "Bearer " + studentToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[?(@.id == " + post1Id + ")].id").exists())
        .andExpect(jsonPath("$[?(@.id == " + post2Id + ")].id").exists());

    mockMvc.perform(get("/api/community/link-preview")
            .param("url", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.image").value(org.hamcrest.Matchers.containsString("dQw4w9WgXcQ")));
  }

  @Test
  void testCommunityPinningAndAnnouncements() throws Exception {
    String studentToken = registerAndLogin("student_pin", "student_pin@educare.vn");
    
    registerAndLogin("educare_admin_test", "admin_test@educare.vn");
    UserEntity adminUser = userRepository.findByUsername("educare_admin_test")
        .orElseThrow(() -> new AssertionError("Admin test user not found"));
    adminUser.setRole(UserRole.ADMIN);
    userRepository.save(adminUser);
    
    String adminToken = login("educare_admin_test", "Admin@123");

    MvcResult postResult = mockMvc.perform(post("/api/community/posts")
            .header("Authorization", "Bearer " + studentToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "content": "Post to pin",
                  "anonymous": false
                }
                """))
        .andExpect(status().isOk())
        .andReturn();
    JsonNode postNode = objectMapper.readTree(postResult.getResponse().getContentAsString());
    long postId = postNode.get("id").asLong();

    mockMvc.perform(post("/api/community/posts/{postId}/pin", postId)
            .header("Authorization", "Bearer " + studentToken))
        .andExpect(status().isForbidden());

    mockMvc.perform(post("/api/community/posts/{postId}/pin", postId)
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.pinned").value(true));

    mockMvc.perform(post("/api/community/posts/{postId}/pin", postId)
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.pinned").value(false));

    MvcResult roomResult = mockMvc.perform(post("/api/community/chat-rooms")
            .header("Authorization", "Bearer " + studentToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "name": "Test Pin Room",
                  "description": "Room for pinning test #CAM-XUC-TUOI-DAY-THI"
                }
                """))
        .andExpect(status().isOk())
        .andReturn();
    JsonNode roomNode = objectMapper.readTree(roomResult.getResponse().getContentAsString());
    String slug = roomNode.get("slug").asText();

    MvcResult messageResult = mockMvc.perform(post("/api/community/chat-rooms/{slug}/messages", slug)
            .header("Authorization", "Bearer " + studentToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "content": "Please read this important message!"
                }
                """))
        .andExpect(status().isOk())
        .andReturn();
    JsonNode messagesNode = objectMapper.readTree(messageResult.getResponse().getContentAsString());
    long messageId = messagesNode.get(messagesNode.size() - 1).get("id").asLong();

    mockMvc.perform(post("/api/community/chat-rooms/{slug}/pin/{messageId}", slug, messageId)
            .header("Authorization", "Bearer " + studentToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.pinnedMessageId").value(messageId))
        .andExpect(jsonPath("$.pinnedMessageAuthor").value(org.hamcrest.Matchers.notNullValue()))
        .andExpect(jsonPath("$.pinnedMessageContent").value("Please read this important message!"));

    mockMvc.perform(post("/api/community/chat-rooms/{slug}/unpin", slug)
            .header("Authorization", "Bearer " + studentToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.pinnedMessageId").value(org.hamcrest.Matchers.nullValue()));
  }

  private String registerAndLogin(String username, String email) throws Exception {
    if (userRepository.findByUsername(username).isPresent() || userRepository.findByEmail(email).isPresent()) {
      return login(username, "Admin@123");
    }

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

  @Test
  void testPrivateCrewBotChatAndAI() throws Exception {
    String studentAToken = registerAndLogin("student_a", "student_a@educare.vn");
    String studentBToken = registerAndLogin("student_b", "student_b@educare.vn");

    MvcResult roomsAResult = mockMvc.perform(get("/api/community/chat-rooms")
            .header("Authorization", "Bearer " + studentAToken))
        .andExpect(status().isOk())
        .andReturn();
    
    JsonNode roomsA = objectMapper.readTree(roomsAResult.getResponse().getContentAsString());
    boolean hasCrewBotA = false;
    for (JsonNode room : roomsA) {
      if ("crew-bot".equals(room.get("slug").asText())) {
        hasCrewBotA = true;
      }
    }
    org.junit.jupiter.api.Assertions.assertTrue(hasCrewBotA);

    MvcResult roomsBResult = mockMvc.perform(get("/api/community/chat-rooms")
            .header("Authorization", "Bearer " + studentBToken))
        .andExpect(status().isOk())
        .andReturn();
    JsonNode roomsB = objectMapper.readTree(roomsBResult.getResponse().getContentAsString());
    boolean hasCrewBotB = false;
    for (JsonNode room : roomsB) {
      if ("crew-bot".equals(room.get("slug").asText())) {
        hasCrewBotB = true;
      }
    }
    org.junit.jupiter.api.Assertions.assertTrue(hasCrewBotB);

    mockMvc.perform(post("/api/community/chat-rooms/crew-bot/messages")
            .header("Authorization", "Bearer " + studentAToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "content": "Tôi đang bị stress chuyện học hành"
                }
                """))
        .andExpect(status().isOk());

    MvcResult messagesAResult = mockMvc.perform(get("/api/community/chat-rooms/crew-bot/messages")
            .header("Authorization", "Bearer " + studentAToken))
        .andExpect(status().isOk())
        .andReturn();
    JsonNode messagesA = objectMapper.readTree(messagesAResult.getResponse().getContentAsString());
    
    org.junit.jupiter.api.Assertions.assertTrue(messagesA.size() >= 3);
    
    MvcResult messagesBResult = mockMvc.perform(get("/api/community/chat-rooms/crew-bot/messages")
            .header("Authorization", "Bearer " + studentBToken))
        .andExpect(status().isOk())
        .andReturn();
    JsonNode messagesB = objectMapper.readTree(messagesBResult.getResponse().getContentAsString());
    
    org.junit.jupiter.api.Assertions.assertTrue(messagesB.size() >= 1 && !messagesB.toString().contains("chuyện học hành"));
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
