package vn.educare.backend.api;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.AuthDtos.AnonymousQuestionRequest;
import vn.educare.backend.api.AuthDtos.AnonymousQuestionResponse;
import vn.educare.backend.api.AuthDtos.ChatMessageRequest;
import vn.educare.backend.api.AuthDtos.ChatMessageResponse;
import vn.educare.backend.api.AuthDtos.ChatRoomResponse;
import vn.educare.backend.api.AuthDtos.CommunityPostRequest;
import vn.educare.backend.api.AuthDtos.CommunityPostResponse;
import vn.educare.backend.api.AuthDtos.CommunityReplyRequest;
import vn.educare.backend.api.AuthDtos.MoodEntryResponse;
import vn.educare.backend.api.AuthDtos.MoodRequest;
import vn.educare.backend.security.AppUserDetails;
import vn.educare.backend.service.CommunityService;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

  private final CommunityService communityService;
  private final CurrentUser currentUser;

  @GetMapping("/posts")
  public List<CommunityPostResponse> posts(Authentication authentication) {
    return communityService.posts(optionalUserId(authentication));
  }

  @PostMapping("/posts")
  public CommunityPostResponse createPost(@Valid @RequestBody CommunityPostRequest request) {
    return communityService.createPost(currentUser.id(), request);
  }

  @PostMapping("/posts/{postId}/replies")
  public CommunityPostResponse reply(@PathVariable Long postId, @Valid @RequestBody CommunityReplyRequest request) {
    return communityService.reply(currentUser.id(), postId, request);
  }

  @PostMapping("/posts/{postId}/likes")
  public CommunityPostResponse togglePostLike(@PathVariable Long postId) {
    return communityService.togglePostLike(currentUser.id(), postId);
  }

  @PostMapping("/replies/{replyId}/likes")
  public CommunityPostResponse toggleReplyLike(@PathVariable Long replyId) {
    return communityService.toggleReplyLike(currentUser.id(), replyId);
  }

  @DeleteMapping("/posts/{postId}")
  public List<CommunityPostResponse> deletePost(@PathVariable Long postId) {
    return communityService.deletePost(currentUser.id(), postId);
  }

  @DeleteMapping("/replies/{replyId}")
  public CommunityPostResponse deleteReply(@PathVariable Long replyId) {
    return communityService.deleteReply(currentUser.id(), replyId);
  }

  @GetMapping("/chat-rooms")
  public List<ChatRoomResponse> rooms() {
    return communityService.chatRooms();
  }

  @GetMapping("/chat-rooms/{slug}/messages")
  public List<ChatMessageResponse> messages(@PathVariable String slug) {
    return communityService.messages(slug);
  }

  @PostMapping("/chat-rooms/{slug}/messages")
  public List<ChatMessageResponse> postMessage(@PathVariable String slug, @Valid @RequestBody ChatMessageRequest request) {
    return communityService.postMessage(currentUser.id(), slug, request);
  }

  @GetMapping("/questions")
  public List<AnonymousQuestionResponse> questions(Authentication authentication) {
    return communityService.questions(optionalUserId(authentication));
  }

  @PostMapping("/questions")
  public AnonymousQuestionResponse createQuestion(@Valid @RequestBody AnonymousQuestionRequest request) {
    return communityService.createQuestion(currentUser.id(), request);
  }

  @PostMapping("/questions/{questionId}/likes")
  public List<AnonymousQuestionResponse> toggleQuestionLike(@PathVariable Long questionId) {
    return communityService.toggleQuestionLike(currentUser.id(), questionId);
  }

  @GetMapping("/moods")
  public List<MoodEntryResponse> moods() {
    return communityService.moods(currentUser.id());
  }

  @PostMapping("/moods")
  public List<MoodEntryResponse> saveMood(@RequestBody MoodRequest request) {
    return communityService.saveMood(currentUser.id(), request);
  }

  private String optionalUserId(Authentication authentication) {
    if (authentication == null || !(authentication.getPrincipal() instanceof AppUserDetails details)) {
      return null;
    }
    return details.user().getId();
  }
}
