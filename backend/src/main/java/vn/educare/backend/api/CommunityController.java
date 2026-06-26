package vn.educare.backend.api;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.educare.backend.api.AuthDtos.AnonymousQuestionRequest;
import vn.educare.backend.api.AuthDtos.AnonymousQuestionResponse;
import vn.educare.backend.api.AuthDtos.ChatMessageRequest;
import vn.educare.backend.api.AuthDtos.ChatMessageResponse;
import vn.educare.backend.api.AuthDtos.ChatMessageReactionRequest;
import vn.educare.backend.api.AuthDtos.ChatRoomResponse;
import vn.educare.backend.api.AuthDtos.CommunityPostRequest;
import vn.educare.backend.api.AuthDtos.CommunityPostResponse;
import vn.educare.backend.api.AuthDtos.CommunityReplyRequest;
import vn.educare.backend.api.AuthDtos.MoodEntryResponse;
import vn.educare.backend.api.AuthDtos.CommunityCategoryResponse;
import vn.educare.backend.api.AuthDtos.MoodRequest;
import vn.educare.backend.api.AuthDtos.ChatRoomCreateRequest;
import vn.educare.backend.api.AuthDtos.ChatRoomInviteRequest;
import vn.educare.backend.api.AuthDtos.ChatRoomMemberResponse;
import vn.educare.backend.api.AuthDtos.ChatRoomUpdateRequest;
import vn.educare.backend.api.AuthDtos.CommunityReportRequest;
import vn.educare.backend.api.AuthDtos.CommunityReportResponse;
import vn.educare.backend.api.AuthDtos.AnonymousQuestionAnswerRequest;
import vn.educare.backend.api.AuthDtos.ChatStickerResponse;
import vn.educare.backend.security.AppUserDetails;
import vn.educare.backend.service.CommunityService;
import vn.educare.backend.service.LinkPreviewService;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

  private final CommunityService communityService;
  private final CurrentUser currentUser;
  private final LinkPreviewService linkPreviewService;

  @GetMapping("/categories")
  public List<CommunityCategoryResponse> categories() {
    return communityService.categories();
  }

  @GetMapping("/posts")
  public List<CommunityPostResponse> posts(
      Authentication authentication,
      @RequestParam(required = false) String sortBy,
      @RequestParam(required = false) Long categoryId,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) Integer size
  ) {
    return communityService.posts(optionalUserId(authentication), sortBy, categoryId, page, size);
  }

  @GetMapping("/link-preview")
  public LinkPreviewService.LinkPreviewDto linkPreview(@RequestParam String url) {
    return linkPreviewService.getPreview(url);
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

  @PostMapping("/posts/{postId}/pin")
  @PreAuthorize("hasRole('ADMIN')")
  public CommunityPostResponse togglePostPin(@PathVariable Long postId) {
    return communityService.togglePostPin(currentUser.id(), postId);
  }

  @DeleteMapping("/replies/{replyId}")
  public CommunityPostResponse deleteReply(@PathVariable Long replyId) {
    return communityService.deleteReply(currentUser.id(), replyId);
  }

  @GetMapping("/chat-rooms")
  public List<ChatRoomResponse> rooms(Authentication authentication) {
    return communityService.chatRooms(optionalUserId(authentication));
  }

  @GetMapping("/chat-rooms/invitations")
  public List<ChatRoomResponse> invitations() {
    return communityService.chatRoomInvitations(currentUser.id());
  }

  @PostMapping("/chat-rooms")
  public ChatRoomResponse createChatRoom(@Valid @RequestBody ChatRoomCreateRequest request) {
    return communityService.createChatRoom(currentUser.id(), request);
  }

  @PostMapping("/chat-rooms/{slug}/invite")
  public void inviteToChatRoom(@PathVariable String slug, @Valid @RequestBody ChatRoomInviteRequest request) {
    communityService.inviteToChatRoom(currentUser.id(), slug, request);
  }

  @PostMapping("/chat-rooms/{slug}/accept")
  public ChatRoomResponse acceptInvitation(@PathVariable String slug) {
    return communityService.acceptInvitation(currentUser.id(), slug);
  }

  @PostMapping("/chat-rooms/{slug}/reject")
  public void rejectInvitation(@PathVariable String slug) {
    communityService.rejectInvitation(currentUser.id(), slug);
  }

  @PostMapping("/chat-rooms/{slug}/leave")
  public void leaveChatRoom(@PathVariable String slug) {
    communityService.leaveChatRoom(currentUser.id(), slug);
  }

  @PostMapping("/chat-rooms/{slug}/kick/{targetUserId}")
  public void kickMember(@PathVariable String slug, @PathVariable String targetUserId) {
    communityService.kickMember(currentUser.id(), slug, targetUserId);
  }

  @PutMapping("/chat-rooms/{slug}")
  public ChatRoomResponse updateChatRoom(@PathVariable String slug, @Valid @RequestBody ChatRoomUpdateRequest request) {
    return communityService.updateChatRoom(currentUser.id(), slug, request);
  }

  @GetMapping("/chat-rooms/{slug}/members")
  public List<ChatRoomMemberResponse> getRoomMembers(@PathVariable String slug) {
    return communityService.getRoomMembers(currentUser.id(), slug);
  }

  @PostMapping("/chat-rooms/{slug}/pin/{messageId}")
  public ChatRoomResponse pinChatMessage(@PathVariable String slug, @PathVariable Long messageId) {
    return communityService.togglePinChatMessage(currentUser.id(), slug, messageId);
  }

  @PostMapping("/chat-rooms/{slug}/unpin")
  public ChatRoomResponse unpinChatMessage(@PathVariable String slug) {
    return communityService.unpinChatMessage(currentUser.id(), slug);
  }

  @GetMapping("/chat-rooms/{slug}/messages")
  public List<ChatMessageResponse> messages(@PathVariable String slug, Authentication authentication) {
    return communityService.messages(optionalUserId(authentication), slug);
  }

  @PostMapping("/chat-rooms/{slug}/messages")
  public List<ChatMessageResponse> postMessage(@PathVariable String slug, @Valid @RequestBody ChatMessageRequest request) {
    return communityService.postMessage(currentUser.id(), slug, request);
  }

  @PostMapping("/chat-messages/{messageId}/reactions")
  public List<ChatMessageResponse> toggleMessageReaction(
      @PathVariable Long messageId,
      @Valid @RequestBody ChatMessageReactionRequest request
  ) {
    return communityService.toggleMessageReaction(currentUser.id(), messageId, request);
  }

  @PostMapping("/reports")
  public void createReport(@Valid @RequestBody CommunityReportRequest request) {
    communityService.createReport(currentUser.id(), request);
  }

  @GetMapping("/admin/reports")
  @PreAuthorize("hasRole('ADMIN')")
  public List<CommunityReportResponse> getReports() {
    return communityService.reports();
  }

  @PutMapping("/admin/reports/{reportId}/resolve")
  @PreAuthorize("hasRole('ADMIN')")
  public void resolveReport(@PathVariable Long reportId, @RequestParam(defaultValue = "true") boolean deleteContent) {
    communityService.resolveReport(reportId, deleteContent);
  }

  @GetMapping("/admin/questions")
  @PreAuthorize("hasRole('ADMIN')")
  public List<AnonymousQuestionResponse> getAdminQuestions(Authentication authentication) {
    return communityService.unansweredQuestions(optionalUserId(authentication));
  }

  @PostMapping("/admin/questions/{questionId}/answer")
  @PreAuthorize("hasRole('ADMIN')")
  public AnonymousQuestionResponse answerQuestion(@PathVariable Long questionId, @Valid @RequestBody AnonymousQuestionAnswerRequest request) {
    return communityService.answerQuestion(questionId, request);
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

  @GetMapping("/stickers")
  public List<ChatStickerResponse> stickers() {
    return communityService.getStickers();
  }

  private String optionalUserId(Authentication authentication) {
    if (authentication == null || !(authentication.getPrincipal() instanceof AppUserDetails details)) {
      return null;
    }
    return details.user().getId();
  }
}
