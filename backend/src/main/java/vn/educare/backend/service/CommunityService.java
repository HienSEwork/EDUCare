package vn.educare.backend.service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.educare.backend.api.ApiException;
import vn.educare.backend.api.AuthDtos.AnonymousQuestionRequest;
import vn.educare.backend.api.AuthDtos.AnonymousQuestionResponse;
import vn.educare.backend.api.AuthDtos.ChatMessageRequest;
import vn.educare.backend.api.AuthDtos.ChatMessageResponse;
import vn.educare.backend.api.AuthDtos.ChatRoomResponse;
import vn.educare.backend.api.AuthDtos.CommunityPostRequest;
import vn.educare.backend.api.AuthDtos.CommunityPostResponse;
import vn.educare.backend.api.AuthDtos.CommunityReplyRequest;
import vn.educare.backend.api.AuthDtos.CommunityReplyResponse;
import vn.educare.backend.api.AuthDtos.CommunityCategoryResponse;
import vn.educare.backend.api.AuthDtos.MoodEntryResponse;
import vn.educare.backend.api.AuthDtos.MoodRequest;
import vn.educare.backend.api.AuthDtos.ChatRoomCreateRequest;
import vn.educare.backend.api.AuthDtos.ChatRoomInviteRequest;
import vn.educare.backend.api.AuthDtos.ChatRoomMemberResponse;
import vn.educare.backend.api.AuthDtos.ChatRoomUpdateRequest;
import vn.educare.backend.api.AuthDtos.CommunityReportRequest;
import vn.educare.backend.api.AuthDtos.CommunityReportResponse;
import vn.educare.backend.api.AuthDtos.AnonymousQuestionAnswerRequest;
import vn.educare.backend.api.AuthDtos.ChatMessageReactionResponse;
import vn.educare.backend.api.AuthDtos.ChatMessageReactionRequest;
import vn.educare.backend.model.AnonymousQuestionEntity;
import vn.educare.backend.model.AnonymousQuestionLikeEntity;
import vn.educare.backend.model.ChatMessageEntity;
import vn.educare.backend.model.ChatMessageReactionEntity;
import vn.educare.backend.model.ChatRoomEntity;
import vn.educare.backend.repository.ChatMessageReactionRepository;
import vn.educare.backend.model.CommunityCategoryEntity;
import vn.educare.backend.repository.CommunityCategoryRepository;
import vn.educare.backend.model.CommunityPostEntity;
import vn.educare.backend.model.CommunityPostLikeEntity;
import vn.educare.backend.model.CommunityReplyEntity;
import vn.educare.backend.model.CommunityReplyLikeEntity;
import vn.educare.backend.model.MoodEntryEntity;
import vn.educare.backend.model.UserEntity;
import vn.educare.backend.model.CommunityReportEntity;
import vn.educare.backend.model.ChatRoomMemberEntity;
import vn.educare.backend.repository.AnonymousQuestionLikeRepository;
import vn.educare.backend.repository.AnonymousQuestionRepository;
import vn.educare.backend.repository.ChatMessageRepository;
import vn.educare.backend.repository.ChatRoomRepository;
import vn.educare.backend.repository.CommunityPostLikeRepository;
import vn.educare.backend.repository.CommunityPostRepository;
import vn.educare.backend.repository.CommunityReplyLikeRepository;
import vn.educare.backend.repository.CommunityReplyRepository;
import vn.educare.backend.repository.MoodEntryRepository;
import vn.educare.backend.repository.UserRepository;
import vn.educare.backend.repository.CommunityReportRepository;
import vn.educare.backend.repository.ChatRoomMemberRepository;
import vn.educare.backend.repository.NotificationRepository;
import vn.educare.backend.security.ChatWebSocketHandler;
import vn.educare.backend.model.ChatStickerEntity;
import vn.educare.backend.repository.ChatStickerRepository;
import vn.educare.backend.api.AuthDtos.ChatStickerRequest;
import vn.educare.backend.api.AuthDtos.ChatStickerResponse;

@Service
@RequiredArgsConstructor
public class CommunityService {

  private static final String CREW_BOT_SLUG = "crew-bot";
  private static final String CREW_BOT_NAME = "crewBot";
  private static final String CREW_BOT_AUTHOR = "crewBot";

  private final CommunityPostRepository communityPostRepository;
  private final CommunityReplyRepository communityReplyRepository;
  private final CommunityPostLikeRepository communityPostLikeRepository;
  private final CommunityReplyLikeRepository communityReplyLikeRepository;
  private final ChatRoomRepository chatRoomRepository;
  private final ChatMessageRepository chatMessageRepository;
  private final AnonymousQuestionRepository anonymousQuestionRepository;
  private final AnonymousQuestionLikeRepository anonymousQuestionLikeRepository;
  private final MoodEntryRepository moodEntryRepository;
  private final UserRepository userRepository;
  private final NotificationService notificationService;
  private final CommunityReportRepository communityReportRepository;
  private final ChatRoomMemberRepository chatRoomMemberRepository;
  private final ChatWebSocketHandler chatWebSocketHandler;
  private final ChatMessageReactionRepository chatMessageReactionRepository;
  private final CommunityCategoryRepository communityCategoryRepository;
  private final NotificationRepository notificationRepository;
  private final ChatStickerRepository chatStickerRepository;
  private final GeminiService geminiService;

  public List<CommunityCategoryResponse> categories() {
    return communityCategoryRepository.findAll().stream()
        .map(cat -> new CommunityCategoryResponse(
            cat.getId(),
            cat.getName(),
            cat.getSlug(),
            cat.getDescription(),
            cat.getIcon(),
            cat.getColorTheme(),
            cat.getCreatedAt().toString()
        ))
        .toList();
  }

  public List<CommunityPostResponse> posts(String userId, String sortBy, Long categoryId, Integer page, Integer size) {
    List<CommunityPostResponse> allPosts = posts(userId, sortBy, categoryId);
    if (page == null || size == null || size <= 0) {
      return allPosts;
    }
    int fromIndex = page * size;
    if (fromIndex >= allPosts.size()) {
      return List.of();
    }
    int toIndex = Math.min(fromIndex + size, allPosts.size());
    return allPosts.subList(fromIndex, toIndex);
  }

  public List<CommunityPostResponse> posts(String userId) {
    return posts(userId, "new", null);
  }

  public List<CommunityPostResponse> posts(String userId, String sortBy) {
    return posts(userId, sortBy, null);
  }

  public List<CommunityPostResponse> posts(String userId, String sortBy, Long categoryId) {
    List<CommunityPostEntity> posts;
    if (categoryId != null) {
      posts = communityPostRepository.findAllByCategoryIdOrderByCreatedAtDesc(categoryId);
    } else {
      posts = communityPostRepository.findAllByOrderByCreatedAtDesc();
    }
    List<Long> postIds = posts.stream().map(CommunityPostEntity::getId).toList();
    List<CommunityReplyEntity> replies = postIds.isEmpty()
        ? List.of()
        : communityReplyRepository.findAllByPostIdInOrderByCreatedAtAsc(postIds);
    Map<Long, List<CommunityReplyEntity>> repliesByPost =
        replies.stream().collect(Collectors.groupingBy(CommunityReplyEntity::getPostId));
    Map<Long, Boolean> likedPosts = userId == null
        ? Map.of()
        : communityPostLikeRepository.findAllByPostIdInAndUserId(postIds, userId)
            .stream()
            .collect(Collectors.toMap(CommunityPostLikeEntity::getPostId, item -> true));
    Map<Long, Boolean> likedReplies = userId == null
        ? Map.of()
        : communityReplyLikeRepository.findAllByReplyIdInAndUserId(
                replies.stream().map(CommunityReplyEntity::getId).toList(),
                userId)
            .stream()
            .collect(Collectors.toMap(CommunityReplyLikeEntity::getReplyId, item -> true));

    List<String> replyUserIds = replies.stream()
        .map(CommunityReplyEntity::getUserId)
        .filter(java.util.Objects::nonNull)
        .distinct()
        .toList();
    Map<String, String> userRoles = replyUserIds.isEmpty()
        ? Map.of()
        : userRepository.findAllById(replyUserIds).stream()
            .collect(Collectors.toMap(
                vn.educare.backend.model.UserEntity::getId,
                user -> user.getRole().name()
            ));

    List<CommunityPostResponse> mapped = posts.stream()
        .map(post -> {
          List<CommunityReplyEntity> postReplies = repliesByPost.getOrDefault(post.getId(), List.of());
          return new CommunityPostResponse(
              post.getId(),
              post.getAnonymous() ? "Ẩn danh" : post.getAuthorName(),
              post.getUserId(),
              post.getContent(),
              post.getAnonymous(),
              post.getLikesCount(),
              likedPosts.containsKey(post.getId()),
              post.getCreatedAt().toString(),
              postReplies.stream()
                  .map(reply -> new CommunityReplyResponse(
                      reply.getId(),
                      reply.getAnonymous() ? "Ẩn danh" : reply.getAuthorName(),
                      reply.getUserId(),
                      reply.getContent(),
                      reply.getAnonymous(),
                      reply.getLikesCount(),
                      likedReplies.containsKey(reply.getId()),
                      reply.getCreatedAt().toString(),
                      reply.getParentId(),
                      userRoles.getOrDefault(reply.getUserId(), "STUDENT"),
                      reply.getImageUrl()
                  ))
                  .toList(),
              post.getLinkUrl(),
              post.getLinkTitle(),
              post.getLinkDescription(),
              post.getLinkImage(),
              Boolean.TRUE.equals(post.getPinned()),
              post.getCategoryId() != null ? post.getCategoryId() : 1L,
              post.getTitle(),
              post.getImageUrl()
          );
        })
        .toList();

    List<CommunityPostResponse> pinnedList = mapped.stream()
        .filter(CommunityPostResponse::pinned)
        .sorted((a, b) -> b.createdAt().compareTo(a.createdAt()))
        .toList();

    List<CommunityPostResponse> unpinnedList = mapped.stream()
        .filter(p -> !p.pinned())
        .toList();

    List<CommunityPostResponse> sortedUnpinned;
    if ("hot".equalsIgnoreCase(sortBy)) {
      sortedUnpinned = unpinnedList.stream()
          .sorted((a, b) -> {
            int scoreA = a.likes() + a.replies().size();
            int scoreB = b.likes() + b.replies().size();
            if (scoreA != scoreB) {
              return Integer.compare(scoreB, scoreA);
            }
            return b.createdAt().compareTo(a.createdAt());
          })
          .toList();
    } else if ("unanswered".equalsIgnoreCase(sortBy)) {
      sortedUnpinned = unpinnedList.stream()
          .filter(post -> post.replies().stream()
              .noneMatch(reply -> "ADMIN".equals(reply.authorRole())))
          .sorted((a, b) -> b.createdAt().compareTo(a.createdAt()))
          .toList();
    } else {
      sortedUnpinned = unpinnedList.stream()
          .sorted((a, b) -> b.createdAt().compareTo(a.createdAt()))
          .toList();
    }

    List<CommunityPostResponse> result = new java.util.ArrayList<>();
    result.addAll(pinnedList);
    result.addAll(sortedUnpinned);
    return result;
  }

  @Transactional
  public CommunityPostResponse createPost(String userId, CommunityPostRequest request) {
    UserEntity user = findUser(userId);
    CommunityPostEntity post = new CommunityPostEntity();
    post.setUserId(userId);
    post.setAuthorName(user.getFullName());
    post.setAnonymous(request.anonymous());
    post.setContent(request.content());
    post.setCreatedAt(Instant.now());
    post.setLinkUrl(request.linkUrl());
    post.setLinkTitle(request.linkTitle());
    post.setLinkDescription(request.linkDescription());
    post.setLinkImage(request.linkImage());
    post.setCategoryId(request.categoryId() != null ? request.categoryId() : 1L);
    post.setTitle(request.title());
    post.setImageUrl(request.imageUrl());
    communityPostRepository.save(post);
    bumpStreak(user);

    notificationService.createMany(
        otherUserIds(userId),
        "community",
        "Có bài thảo luận mới",
        user.getFullName() + " vừa chia sẻ một chủ đề mới trong cộng đồng.");

    return posts(userId).stream().filter(item -> item.id().equals(post.getId())).findFirst().orElseThrow();
  }

  @Transactional
  public CommunityPostResponse reply(String userId, Long postId, CommunityReplyRequest request) {
    UserEntity user = findUser(userId);
    CommunityPostEntity post =
        communityPostRepository.findById(postId).orElseThrow(() -> new ApiException(404, "Post not found"));

    CommunityReplyEntity reply = new CommunityReplyEntity();
    reply.setPostId(post.getId());
    reply.setUserId(userId);
    reply.setAuthorName(user.getFullName());
    reply.setAnonymous(request.anonymous());
    reply.setContent(request.content());
    reply.setCreatedAt(Instant.now());
    reply.setImageUrl(request.imageUrl());

    if (request.parentId() != null) {
      CommunityReplyEntity parentReply = communityReplyRepository.findById(request.parentId())
          .orElseThrow(() -> new ApiException(404, "Parent reply not found"));
      if (!parentReply.getPostId().equals(postId)) {
        throw new ApiException(400, "Parent reply does not belong to this post");
      }
      reply.setParentId(parentReply.getId());
    }

    communityReplyRepository.save(reply);
    bumpStreak(user);

    if (!userId.equals(post.getUserId())) {
      notificationService.create(
          post.getUserId(),
          "community",
          "Có phản hồi mới cho bài viết của bạn",
          user.getFullName() + " vừa trả lời trong chủ đề bạn đang theo dõi.");
    }

    return posts(userId).stream().filter(item -> item.id().equals(postId)).findFirst().orElseThrow();
  }

  @Transactional
  public CommunityPostResponse togglePostLike(String userId, Long postId) {
    CommunityPostEntity post =
        communityPostRepository.findById(postId).orElseThrow(() -> new ApiException(404, "Post not found"));

    communityPostLikeRepository.findByPostIdAndUserId(postId, userId).ifPresentOrElse(existing -> {
      communityPostLikeRepository.delete(existing);
      post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
    }, () -> {
      CommunityPostLikeEntity like = new CommunityPostLikeEntity();
      like.setPostId(postId);
      like.setUserId(userId);
      like.setCreatedAt(Instant.now());
      communityPostLikeRepository.save(like);
      post.setLikesCount(post.getLikesCount() + 1);
    });

    communityPostRepository.save(post);
    return posts(userId).stream().filter(item -> item.id().equals(postId)).findFirst().orElseThrow();
  }

  @Transactional
  public CommunityPostResponse toggleReplyLike(String userId, Long replyId) {
    CommunityReplyEntity reply =
        communityReplyRepository.findById(replyId).orElseThrow(() -> new ApiException(404, "Reply not found"));

    communityReplyLikeRepository.findByReplyIdAndUserId(replyId, userId).ifPresentOrElse(existing -> {
      communityReplyLikeRepository.delete(existing);
      reply.setLikesCount(Math.max(0, reply.getLikesCount() - 1));
    }, () -> {
      CommunityReplyLikeEntity like = new CommunityReplyLikeEntity();
      like.setReplyId(replyId);
      like.setUserId(userId);
      like.setCreatedAt(Instant.now());
      communityReplyLikeRepository.save(like);
      reply.setLikesCount(reply.getLikesCount() + 1);
    });

    communityReplyRepository.save(reply);
    return posts(userId).stream().filter(item -> item.id().equals(reply.getPostId())).findFirst().orElseThrow();
  }

  @Transactional
  public List<CommunityPostResponse> deletePost(String userId, Long postId) {
    CommunityPostEntity post =
        communityPostRepository.findById(postId).orElseThrow(() -> new ApiException(404, "Post not found"));

    if (!userId.equals(post.getUserId())) {
      throw new ApiException(403, "You cannot delete this post");
    }

    List<Long> replyIds = communityReplyRepository.findAllByPostIdOrderByCreatedAtAsc(postId).stream()
        .map(CommunityReplyEntity::getId)
        .toList();

    if (!replyIds.isEmpty()) {
      communityReplyLikeRepository.deleteAllByReplyIdIn(replyIds);
    }

    communityReplyRepository.deleteAllByPostId(postId);
    communityPostLikeRepository.deleteAllByPostId(postId);
    communityPostRepository.delete(post);
    return posts(userId);
  }

  @Transactional
  public CommunityPostResponse deleteReply(String userId, Long replyId) {
    CommunityReplyEntity reply =
        communityReplyRepository.findById(replyId).orElseThrow(() -> new ApiException(404, "Reply not found"));

    if (!userId.equals(reply.getUserId())) {
      throw new ApiException(403, "You cannot delete this reply");
    }

    Long postId = reply.getPostId();
    communityReplyLikeRepository.deleteAllByReplyId(replyId);
    communityReplyRepository.delete(reply);
    return posts(userId).stream().filter(item -> item.id().equals(postId)).findFirst().orElseThrow();
  }

  private void checkRoomAccess(String userId, ChatRoomEntity room) {
    if (room.getOwnerId() == null) {
      return;
    }
    if (userId == null) {
      throw new ApiException(401, "Authentication required to access this private room");
    }
    if (room.getOwnerId().equals(userId)) {
      return;
    }
    if (!chatRoomMemberRepository.existsByRoomIdAndUserIdAndStatus(room.getId(), userId, "ACTIVE")) {
      throw new ApiException(403, "You do not have access to this room");
    }
  }

  private ChatRoomResponse mapToChatRoomResponse(ChatRoomEntity room) {
    String slug = room.getSlug();
    if (slug.startsWith(CREW_BOT_SLUG + "-")) {
      slug = CREW_BOT_SLUG;
    }
    String pinnedAuthor = null;
    String pinnedContent = null;
    if (room.getPinnedMessageId() != null) {
      var msgOpt = chatMessageRepository.findById(room.getPinnedMessageId());
      if (msgOpt.isPresent()) {
        var msg = msgOpt.get();
        pinnedAuthor = msg.getAuthorName();
        pinnedContent = msg.getContent();
      }
    }

    var latestMsgOpt = chatMessageRepository.findFirstByRoomIdOrderByIdDesc(room.getId());
    String lastMessageContent = null;
    String lastMessageTime = null;
    if (latestMsgOpt.isPresent()) {
      var msg = latestMsgOpt.get();
      lastMessageContent = msg.getContent();
      lastMessageTime = msg.getCreatedAt().toString();
    }

    return new ChatRoomResponse(
        room.getId(),
        slug,
        room.getName(),
        room.getDescription(),
        chatMessageRepository.countByRoomId(room.getId()),
        room.getOwnerId(),
        room.getPinnedMessageId(),
        pinnedAuthor,
        pinnedContent,
        lastMessageContent,
        lastMessageTime
    );
  }

  public List<ChatRoomResponse> chatRooms(String userId) {
    if (userId != null) {
      ensureCrewBotRoom(userId);
    }
    return chatRoomRepository.findAllByOrderByIdAsc().stream()
        .filter(room -> {
          if (room.getSlug().startsWith(CREW_BOT_SLUG)) {
            if (userId == null) {
              return false;
            }
            return room.getSlug().equals(CREW_BOT_SLUG + "-" + userId);
          }
          if (room.getOwnerId() == null) {
            return true;
          }
          if (userId == null) {
            return false;
          }
          if (room.getOwnerId().equals(userId)) {
            return true;
          }
          return chatRoomMemberRepository.existsByRoomIdAndUserIdAndStatus(room.getId(), userId, "ACTIVE");
        })
        .map(this::mapToChatRoomResponse)
        .toList();
  }

  public List<ChatRoomResponse> chatRoomInvitations(String userId) {
    if (userId == null) {
      return List.of();
    }
    return chatRoomMemberRepository.findAllByUserIdAndStatus(userId, "PENDING").stream()
        .map(member -> chatRoomRepository.findById(member.getRoomId()).orElse(null))
        .filter(java.util.Objects::nonNull)
        .map(this::mapToChatRoomResponse)
        .toList();
  }

  @Transactional
  public ChatRoomResponse createChatRoom(String userId, ChatRoomCreateRequest request) {
    UserEntity user = findUser(userId);
    ChatRoomEntity room = new ChatRoomEntity();
    String slug = "room-" + System.currentTimeMillis();
    room.setSlug(slug);
    room.setName(request.name());
    room.setDescription(request.description());
    room.setOwnerId(userId);
    chatRoomRepository.save(room);

    // Auto add owner as an active member and owner role
    ChatRoomMemberEntity member = new ChatRoomMemberEntity();
    member.setRoomId(room.getId());
    member.setUserId(userId);
    member.setJoinedAt(Instant.now());
    member.setStatus("ACTIVE");
    member.setRole("OWNER");
    chatRoomMemberRepository.save(member);

    return new ChatRoomResponse(
        room.getId(),
        room.getSlug(),
        room.getName(),
        room.getDescription(),
        0L,
        room.getOwnerId(),
        null,
        null,
        null,
        null,
        null
    );
  }

  @Transactional
  public void inviteToChatRoom(String userId, String slug, ChatRoomInviteRequest request) {
    ChatRoomEntity room = findRoom(slug, userId);
    if (room.getOwnerId() == null || !room.getOwnerId().equals(userId)) {
      throw new ApiException(403, "Only the room owner can invite members");
    }

    UserEntity invitee = userRepository.findByUsername(request.username())
        .orElseThrow(() -> new ApiException(404, "Invitee not found"));

    if (chatRoomMemberRepository.existsByRoomIdAndUserId(room.getId(), invitee.getId())) {
      throw new ApiException(400, "User is already a member or has a pending invitation for this room");
    }

    ChatRoomMemberEntity member = new ChatRoomMemberEntity();
    member.setRoomId(room.getId());
    member.setUserId(invitee.getId());
    member.setJoinedAt(Instant.now());
    member.setStatus("PENDING");
    member.setRole("MEMBER");
    chatRoomMemberRepository.save(member);

    notificationService.create(
        invitee.getId(),
        "chat_invite:" + room.getSlug(),
        "Bạn được mời vào nhóm chat mới",
        "Bạn vừa được mời tham gia nhóm chat " + room.getName() + "."
    );
  }

  private ChatMessageResponse mapToChatMessageResponse(ChatMessageEntity message) {
    List<ChatMessageReactionResponse> reactions = chatMessageReactionRepository.findAllByMessageId(message.getId())
        .stream()
        .map(r -> {
          String reactUsername = userRepository.findById(r.getUserId())
              .map(UserEntity::getFullName)
              .orElse("Ai đó");
          return new ChatMessageReactionResponse(r.getId(), r.getUserId(), reactUsername, r.getEmoji());
        })
        .toList();

    Integer authorXp = 0;
    Integer authorStreak = 0;
    String authorRole = "STUDENT";

    if (message.getUserId() != null) {
      UserEntity author = userRepository.findById(message.getUserId()).orElse(null);
      if (author != null) {
        authorXp = author.getXp();
        authorStreak = author.getStreak();
        authorRole = author.getRole().name();
      }
    } else if (CREW_BOT_AUTHOR.equals(message.getAuthorName())) {
      authorRole = "BOT";
    }

    return new ChatMessageResponse(
        message.getId(),
        message.getAuthorName(),
        message.getUserId(),
        message.getContent(),
        message.getCreatedAt().toString(),
        reactions,
        authorXp,
        authorStreak,
        authorRole,
        message.getImageUrl(),
        message.getAudioUrl(),
        message.getAudioName(),
        message.getIsSystem() != null ? message.getIsSystem() : false
    );
  }

  public List<ChatMessageResponse> messages(String userId, String slug) {
    ChatRoomEntity room = findRoom(slug, userId);
    checkRoomAccess(userId, room);
    seedCrewBotWelcome(room);

    return chatMessageRepository.findTop50ByRoomIdOrderByCreatedAtDesc(room.getId())
        .stream()
        .sorted(Comparator.comparing(ChatMessageEntity::getCreatedAt))
        .map(this::mapToChatMessageResponse)
        .toList();
  }

  @Transactional
  public List<ChatMessageResponse> postMessage(String userId, String slug, ChatMessageRequest request) {
    UserEntity user = findUser(userId);
    ChatRoomEntity room = findRoom(slug, userId);
    checkRoomAccess(userId, room);

    ChatMessageEntity message = new ChatMessageEntity();
    message.setRoomId(room.getId());
    message.setUserId(userId);
    message.setAuthorName(user.getFullName());
    message.setContent(request.content());
    message.setImageUrl(request.imageUrl());
    message.setAudioUrl(request.audioUrl());
    message.setAudioName(request.audioName());
    message.setCreatedAt(Instant.now());
    chatMessageRepository.save(message);
    bumpStreak(user);

    // Broadcast user's message
    ChatMessageResponse userMsgDto = mapToChatMessageResponse(message);
    chatWebSocketHandler.broadcastNewMessage(room.getSlug(), userMsgDto);

    if (room.getSlug().startsWith(CREW_BOT_SLUG)) {
      ChatMessageEntity botReply = new ChatMessageEntity();
      botReply.setRoomId(room.getId());
      botReply.setUserId(null);
      botReply.setAuthorName(CREW_BOT_AUTHOR);
      botReply.setContent(crewBotReply(request.content()));
      botReply.setCreatedAt(Instant.now().plusMillis(300));
      chatMessageRepository.save(botReply);

      notificationService.create(
          userId,
          "chat",
          "crewBot vừa phản hồi",
          "crewBot đã gửi trả lời mới trong phòng chat của bạn.");

      // Broadcast bot's message
      ChatMessageResponse botMsgDto = mapToChatMessageResponse(botReply);
      chatWebSocketHandler.broadcastNewMessage(room.getSlug(), botMsgDto);
    } else {
      notificationService.createMany(
          otherUserIds(userId),
          "chat",
          "Có tin nhắn mới trong cộng đồng",
          user.getFullName() + " vừa gửi tin nhắn trong nhóm " + room.getName() + ".");
    }

    return messages(userId, slug);
  }

  @Transactional
  public List<ChatMessageResponse> toggleMessageReaction(String userId, Long messageId, ChatMessageReactionRequest request) {
    ChatMessageEntity message = chatMessageRepository.findById(messageId)
        .orElseThrow(() -> new ApiException(404, "Message not found"));

    ChatRoomEntity room = chatRoomRepository.findById(message.getRoomId())
        .orElseThrow(() -> new ApiException(404, "Room not found"));

    checkRoomAccess(userId, room);

    ChatMessageReactionEntity reaction = chatMessageReactionRepository.findByMessageIdAndUserId(messageId, userId)
        .orElse(null);

    if (reaction != null) {
      if (reaction.getEmoji().equals(request.emoji())) {
        // If same emoji, remove it (toggle off)
        chatMessageReactionRepository.delete(reaction);
      } else {
        // If different emoji, change it
        reaction.setEmoji(request.emoji());
        chatMessageReactionRepository.save(reaction);
      }
    } else {
      // If no reaction, create new
      ChatMessageReactionEntity newReaction = new ChatMessageReactionEntity();
      newReaction.setMessageId(messageId);
      newReaction.setUserId(userId);
      newReaction.setEmoji(request.emoji());
      chatMessageReactionRepository.save(newReaction);
    }

    // Broadcast reaction update
    ChatMessageResponse updatedMsgDto = mapToChatMessageResponse(message);
    chatWebSocketHandler.broadcastMessageReaction(room.getSlug(), updatedMsgDto);

    return messages(userId, room.getSlug());
  }

  @Transactional
  public void createReport(String userId, CommunityReportRequest request) {
    if (request.postId() == null && request.replyId() == null) {
      throw new ApiException(400, "Either postId or replyId must be provided");
    }

    CommunityReportEntity report = new CommunityReportEntity();
    report.setReporterId(userId);
    report.setPostId(request.postId());
    report.setReplyId(request.replyId());
    report.setReason(request.reason());
    report.setStatus("PENDING");
    report.setCreatedAt(Instant.now());
    communityReportRepository.save(report);
  }

  public List<CommunityReportResponse> reports() {
    return communityReportRepository.findAllByOrderByCreatedAtDesc().stream()
        .map(report -> {
          String reporterName = userRepository.findById(report.getReporterId())
              .map(UserEntity::getFullName)
              .orElse("Unknown");
          String contentPreview = "";
          if (report.getPostId() != null) {
            contentPreview = communityPostRepository.findById(report.getPostId())
                .map(p -> "[Bài viết] " + p.getContent())
                .orElse("[Bài viết đã bị xoá]");
          } else if (report.getReplyId() != null) {
            contentPreview = communityReplyRepository.findById(report.getReplyId())
                .map(r -> "[Bình luận] " + r.getContent())
                .orElse("[Bình luận đã bị xoá]");
          }

          return new CommunityReportResponse(
              report.getId(),
              reporterName,
              report.getPostId(),
              report.getReplyId(),
              report.getReason(),
              report.getStatus(),
              report.getCreatedAt().toString(),
              contentPreview
          );
        })
        .toList();
  }

  @Transactional
  public void resolveReport(Long reportId, boolean deleteContent) {
    CommunityReportEntity report = communityReportRepository.findById(reportId)
        .orElseThrow(() -> new ApiException(404, "Report not found"));

    if (deleteContent) {
      if (report.getPostId() != null) {
        communityPostRepository.findById(report.getPostId()).ifPresent(post -> {
          List<Long> replyIds = communityReplyRepository.findAllByPostIdOrderByCreatedAtAsc(post.getId()).stream()
              .map(CommunityReplyEntity::getId)
              .toList();
          if (!replyIds.isEmpty()) {
            communityReplyLikeRepository.deleteAllByReplyIdIn(replyIds);
          }
          communityReplyRepository.deleteAllByPostId(post.getId());
          communityPostLikeRepository.deleteAllByPostId(post.getId());
          communityPostRepository.delete(post);
        });
      } else if (report.getReplyId() != null) {
        communityReplyRepository.findById(report.getReplyId()).ifPresent(reply -> {
          communityReplyLikeRepository.deleteAllByReplyId(reply.getId());
          communityReplyRepository.delete(reply);
        });
      }
      report.setStatus("RESOLVED");
    } else {
      report.setStatus("DISMISSED");
    }

    communityReportRepository.save(report);
  }

  public List<AnonymousQuestionResponse> unansweredQuestions(String userId) {
    List<AnonymousQuestionEntity> questions = anonymousQuestionRepository.findAll().stream()
        .sorted((q1, q2) -> {
          boolean q1Unanswered = q1.getAnswer() == null || q1.getAnswer().trim().isEmpty();
          boolean q2Unanswered = q2.getAnswer() == null || q2.getAnswer().trim().isEmpty();
          if (q1Unanswered && !q2Unanswered) return -1;
          if (!q1Unanswered && q2Unanswered) return 1;
          return q2.getCreatedAt().compareTo(q1.getCreatedAt());
        })
        .toList();

    List<Long> ids = questions.stream().map(AnonymousQuestionEntity::getId).toList();
    Map<Long, Boolean> liked = userId == null
        ? Map.of()
        : anonymousQuestionLikeRepository.findAllByQuestionIdInAndUserId(ids, userId)
            .stream()
            .collect(Collectors.toMap(AnonymousQuestionLikeEntity::getQuestionId, item -> true));

    return questions.stream()
        .map(question -> new AnonymousQuestionResponse(
            question.getId(),
            question.getQuestion(),
            question.getAnswer(),
            question.getLikesCount(),
            liked.containsKey(question.getId()),
            question.getCreatedAt().toString()))
        .toList();
  }

  @Transactional
  public AnonymousQuestionResponse answerQuestion(Long questionId, AnonymousQuestionAnswerRequest request) {
    AnonymousQuestionEntity question = anonymousQuestionRepository.findById(questionId)
        .orElseThrow(() -> new ApiException(404, "Question not found"));

    question.setAnswer(request.answer());
    anonymousQuestionRepository.save(question);

    if (question.getUserId() != null) {
      notificationService.create(
          question.getUserId(),
          "anonymous_question",
          "Phản hồi từ chuyên gia",
          "Chuyên gia vừa phản hồi câu hỏi ẩn danh của bạn: \"" + request.answer() + "\""
      );
    }

    return new AnonymousQuestionResponse(
        question.getId(),
        question.getQuestion(),
        question.getAnswer(),
        question.getLikesCount(),
        false,
        question.getCreatedAt().toString()
    );
  }

  public List<AnonymousQuestionResponse> questions(String userId) {
    List<AnonymousQuestionEntity> questions = anonymousQuestionRepository.findTop20ByOrderByCreatedAtDesc();
    List<Long> ids = questions.stream().map(AnonymousQuestionEntity::getId).toList();
    Map<Long, Boolean> liked = userId == null
        ? Map.of()
        : anonymousQuestionLikeRepository.findAllByQuestionIdInAndUserId(ids, userId)
            .stream()
            .collect(Collectors.toMap(AnonymousQuestionLikeEntity::getQuestionId, item -> true));

    return questions.stream()
        .map(question -> new AnonymousQuestionResponse(
            question.getId(),
            question.getQuestion(),
            question.getAnswer(),
            question.getLikesCount(),
            liked.containsKey(question.getId()),
            question.getCreatedAt().toString()))
        .toList();
  }

  @Transactional
  public AnonymousQuestionResponse createQuestion(String userId, AnonymousQuestionRequest request) {
    AnonymousQuestionEntity question = new AnonymousQuestionEntity();
    question.setUserId(userId);
    question.setQuestion(request.question());
    question.setAnswer(""); // Set answer as empty initially
    question.setCreatedAt(Instant.now());
    anonymousQuestionRepository.save(question);

    notificationService.create(
        userId,
        "anonymous_question",
        "Đã nhận câu hỏi ẩn danh",
        "Câu hỏi của bạn đã được gửi thành công và đang chờ phản hồi từ chuyên gia.");

    return questions(userId).stream().filter(item -> item.id().equals(question.getId())).findFirst().orElseThrow();
  }

  @Transactional
  public List<AnonymousQuestionResponse> toggleQuestionLike(String userId, Long questionId) {
    AnonymousQuestionEntity question = anonymousQuestionRepository.findById(questionId)
        .orElseThrow(() -> new ApiException(404, "Question not found"));

    anonymousQuestionLikeRepository.findByQuestionIdAndUserId(questionId, userId).ifPresentOrElse(existing -> {
      anonymousQuestionLikeRepository.delete(existing);
      question.setLikesCount(Math.max(0, question.getLikesCount() - 1));
    }, () -> {
      AnonymousQuestionLikeEntity like = new AnonymousQuestionLikeEntity();
      like.setQuestionId(questionId);
      like.setUserId(userId);
      like.setCreatedAt(Instant.now());
      anonymousQuestionLikeRepository.save(like);
      question.setLikesCount(question.getLikesCount() + 1);
    });

    anonymousQuestionRepository.save(question);
    return questions(userId);
  }

  public List<MoodEntryResponse> moods(String userId) {
    return moodEntryRepository.findTop7ByUserIdOrderByEntryDateDesc(userId)
        .stream()
        .sorted(Comparator.comparing(MoodEntryEntity::getEntryDate))
        .map(item -> new MoodEntryResponse(item.getId(), item.getMoodCode(), item.getNote(), item.getEntryDate()))
        .toList();
  }

  @Transactional
  public List<MoodEntryResponse> saveMood(String userId, MoodRequest request) {
    MoodEntryEntity entry = moodEntryRepository.findByUserIdAndEntryDate(userId, LocalDate.now())
        .orElseGet(MoodEntryEntity::new);
    entry.setUserId(userId);
    entry.setMoodCode(request.moodCode());
    entry.setNote(request.note());
    entry.setEntryDate(LocalDate.now());
    moodEntryRepository.save(entry);
    return moods(userId);
  }

  private UserEntity findUser(String userId) {
    return userRepository.findById(userId).orElseThrow(() -> new ApiException(404, "User not found"));
  }

  private ChatRoomEntity findRoom(String slug, String userId) {
    if (CREW_BOT_SLUG.equals(slug)) {
      if (userId == null) {
        throw new ApiException(401, "Authentication required to access crew-bot chat");
      }
      return ensureCrewBotRoom(userId);
    }

    return chatRoomRepository.findBySlug(slug).orElseThrow(() -> new ApiException(404, "Chat room not found"));
  }

  @Transactional
  private ChatRoomEntity ensureCrewBotRoom(String userId) {
    String slug = CREW_BOT_SLUG + "-" + userId;
    ChatRoomEntity room = chatRoomRepository.findBySlug(slug).orElseGet(() -> {
      ChatRoomEntity entity = new ChatRoomEntity();
      entity.setSlug(slug);
      entity.setName(CREW_BOT_NAME);
      entity.setDescription("Không gian chat riêng với trợ lý đồng hành của EDUcare.");
      entity.setOwnerId(null);
      return chatRoomRepository.save(entity);
    });

    seedCrewBotWelcome(room);
    return room;
  }

  private void seedCrewBotWelcome(ChatRoomEntity room) {
    if (!room.getSlug().startsWith(CREW_BOT_SLUG)) {
      return;
    }
    if (chatMessageRepository.countByRoomId(room.getId()) > 0) {
      return;
    }

    ChatMessageEntity greeting = new ChatMessageEntity();
    greeting.setRoomId(room.getId());
    greeting.setUserId(null);
    greeting.setAuthorName(CREW_BOT_AUTHOR);
    greeting.setContent("Chào bạn, mình là crewBot. Bạn có thể tâm sự, hỏi cách học nhẹ nhàng hơn hoặc xin gợi ý khi đang thấy rối.");
    greeting.setCreatedAt(Instant.now());
    chatMessageRepository.save(greeting);
  }

  private List<String> otherUserIds(String actorId) {
    return userRepository.findAll().stream()
        .map(UserEntity::getId)
        .filter(id -> !id.equals(actorId))
        .toList();
  }

  private String answerFor(String question) {
    String lower = question.toLowerCase();

    if (lower.contains("stress") || lower.contains("căng thẳng") || lower.contains("áp lực")) {
      return "Căng thẳng ở tuổi teen là điều khá phổ biến. Em có thể thử chia nhỏ việc cần làm, nghỉ ngắn giữa các chặng học và nói chuyện với người em tin tưởng để nhẹ đầu hơn.";
    }
    if (lower.contains("internet") || lower.contains("mạng") || lower.contains("online")) {
      return "Nếu gặp điều khiến em không an toàn trên mạng, hãy dừng tương tác, lưu lại bằng chứng và báo ngay cho người lớn đáng tin cậy để được hỗ trợ.";
    }
    if (lower.contains("friend") || lower.contains("bạn")) {
      return "Một tình bạn lành mạnh sẽ khiến em thấy được tôn trọng, lắng nghe và an toàn. Nếu một mối quan hệ làm em mệt mỏi kéo dài, em có quyền lùi lại để bảo vệ mình.";
    }
    if (lower.contains("body") || lower.contains("cơ thể") || lower.contains("dậy thì")) {
      return "Những thay đổi của cơ thể ở tuổi dậy thì đến ở mỗi người với nhịp khác nhau. Điều đó là bình thường, và em không cần phải ép mình giống bất kỳ ai.";
    }
    if (lower.contains("emotion") || lower.contains("cảm xúc") || lower.contains("buồn") || lower.contains("lo")) {
      return "Cảm xúc thay đổi nhanh ở tuổi teen là chuyện dễ gặp. Nghỉ ngắn, viết ra điều mình đang thấy và tìm người đáng tin để chia sẻ thường sẽ giúp em ổn hơn.";
    }

    return "Cảm ơn em đã gửi câu hỏi. Đây là băn khoăn rất đáng được lắng nghe. Em có thể xem thêm bài học phù hợp trên EDUcare hoặc tìm người lớn đáng tin cậy để nhận hỗ trợ gần gũi hơn.";
  }

  private String crewBotReply(String prompt) {
    String reply = geminiService.generateReply(prompt);
    if (reply != null && !reply.isEmpty()) {
      return reply;
    }

    String lower = prompt.toLowerCase();

    if (lower.contains("quiz") || lower.contains("trò chơi") || lower.contains("game")) {
      return "Nếu muốn bắt đầu nhẹ nhàng, bạn thử Quiz tăng tốc 10 câu trước nhé. Khi đã quen nhịp, bạn có thể sang Quiz bứt phá 30 câu để thử sức sâu hơn.";
    }
    if (lower.contains("buồn") || lower.contains("mệt") || lower.contains("lo") || lower.contains("stress")) {
      return "Nghe có vẻ bạn đang khá nặng đầu. Mình gợi ý bạn nghỉ ngắn vài phút, hít thở sâu và thử viết ra đúng một điều đang làm bạn mệt nhất lúc này.";
    }
    if (lower.contains("học") || lower.contains("kiểm tra") || lower.contains("thi")) {
      return "Nếu bạn đang áp lực chuyện học, hãy thử chia việc thành từng chặng 20 đến 25 phút. Làm xong một chặng rồi nghỉ ngắn sẽ dễ theo hơn là ôm hết một lúc.";
    }
    if (lower.contains("bố mẹ") || lower.contains("gia đình")) {
      return "Khi khó nói chuyện với bố mẹ, bạn có thể bắt đầu bằng một câu ngắn như: “Con đang có điều hơi khó nói, nhưng con muốn bố mẹ nghe con một chút.”";
    }

    return "Mình đang ở đây để đồng hành cùng bạn. Bạn có thể kể cụ thể hơn một chút về điều bạn đang băn khoăn, mình sẽ gợi ý theo hướng gần với tình huống của bạn hơn.";
  }

  private void bumpStreak(UserEntity user) {
    user.setStreak(user.getStreak() + 1);
    userRepository.save(user);
  }

  @Transactional
  public CommunityPostResponse togglePostPin(String userId, Long postId) {
    UserEntity user = findUser(userId);
    if (!"ADMIN".equals(user.getRole().name())) {
      throw new ApiException(403, "Only admins can pin posts");
    }
    CommunityPostEntity post = communityPostRepository.findById(postId)
        .orElseThrow(() -> new ApiException(404, "Post not found"));
    post.setPinned(!Boolean.TRUE.equals(post.getPinned()));
    communityPostRepository.save(post);
    return posts(userId).stream().filter(item -> item.id().equals(postId)).findFirst().orElseThrow();
  }

  @Transactional
  public ChatRoomResponse togglePinChatMessage(String userId, String slug, Long messageId) {
    UserEntity user = findUser(userId);
    ChatRoomEntity room = findRoom(slug, userId);

    boolean isOwner = userId.equals(room.getOwnerId());
    boolean isAdmin = "ADMIN".equals(user.getRole().name());
    if (!isOwner && !isAdmin) {
      throw new ApiException(403, "Only the room owner or admin can pin messages");
    }

    if (messageId != null) {
      ChatMessageEntity message = chatMessageRepository.findById(messageId)
          .orElseThrow(() -> new ApiException(404, "Message not found"));
      if (!message.getRoomId().equals(room.getId())) {
        throw new ApiException(400, "Message does not belong to this room");
      }
      room.setPinnedMessageId(messageId);
    } else {
      room.setPinnedMessageId(null);
    }

    chatRoomRepository.save(room);

    ChatRoomResponse response = chatRooms(userId).stream()
        .filter(r -> r.slug().equals(slug))
        .findFirst()
        .orElseThrow();

    chatWebSocketHandler.broadcastRoomPinUpdate(slug, response);

    return response;
  }

  @Transactional
  public ChatRoomResponse unpinChatMessage(String userId, String slug) {
    return togglePinChatMessage(userId, slug, null);
  }

  @Transactional
  public ChatRoomResponse acceptInvitation(String userId, String slug) {
    ChatRoomEntity room = findRoom(slug, userId);
    ChatRoomMemberEntity member = chatRoomMemberRepository.findByRoomIdAndUserId(room.getId(), userId)
        .orElseThrow(() -> new ApiException(404, "Lời mời không tồn tại"));
    if (!"PENDING".equals(member.getStatus())) {
      throw new ApiException(400, "Thành viên đã ở trạng thái hoạt động");
    }
    member.setStatus("ACTIVE");
    member.setJoinedAt(Instant.now());
    chatRoomMemberRepository.save(member);

    // Create system message
    UserEntity user = findUser(userId);
    ChatMessageEntity systemMsg = new ChatMessageEntity();
    systemMsg.setRoomId(room.getId());
    systemMsg.setUserId(null);
    systemMsg.setAuthorName("Hệ thống");
    systemMsg.setContent(user.getFullName() + " đã tham gia phòng chat");
    systemMsg.setIsSystem(true);
    systemMsg.setCreatedAt(Instant.now());
    chatMessageRepository.save(systemMsg);

    // Broadcast system message via WebSocket
    chatWebSocketHandler.broadcastNewMessage(slug, mapToChatMessageResponse(systemMsg));

    // Mark invitation notification as read
    notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId).stream()
        .filter(n -> n.getType().equals("chat_invite:" + slug))
        .forEach(n -> {
          n.setIsRead(true);
          notificationRepository.save(n);
        });

    return mapToChatRoomResponse(room);
  }

  @Transactional
  public void rejectInvitation(String userId, String slug) {
    ChatRoomEntity room = findRoom(slug, userId);
    ChatRoomMemberEntity member = chatRoomMemberRepository.findByRoomIdAndUserId(room.getId(), userId)
        .orElseThrow(() -> new ApiException(404, "Lời mời không tồn tại"));
    chatRoomMemberRepository.delete(member);

    // Mark invitation notification as read
    notificationRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId).stream()
        .filter(n -> n.getType().equals("chat_invite:" + slug))
        .forEach(n -> {
          n.setIsRead(true);
          notificationRepository.save(n);
        });
  }

  @Transactional
  public void leaveChatRoom(String userId, String slug) {
    ChatRoomEntity room = findRoom(slug, userId);
    ChatRoomMemberEntity member = chatRoomMemberRepository.findByRoomIdAndUserId(room.getId(), userId)
        .orElseThrow(() -> new ApiException(404, "Bạn không phải thành viên phòng chat này"));
    
    chatRoomMemberRepository.delete(member);

    // Create system message
    UserEntity user = findUser(userId);
    ChatMessageEntity systemMsg = new ChatMessageEntity();
    systemMsg.setRoomId(room.getId());
    systemMsg.setUserId(null);
    systemMsg.setAuthorName("Hệ thống");
    systemMsg.setContent(user.getFullName() + " đã rời cuộc trò chuyện");
    systemMsg.setIsSystem(true);
    systemMsg.setCreatedAt(Instant.now());
    chatMessageRepository.save(systemMsg);

    // Broadcast system message via WebSocket
    chatWebSocketHandler.broadcastNewMessage(slug, mapToChatMessageResponse(systemMsg));
  }

  @Transactional
  public void kickMember(String userId, String slug, String targetUserId) {
    ChatRoomEntity room = findRoom(slug, userId);
    if (room.getOwnerId() == null || !room.getOwnerId().equals(userId)) {
      throw new ApiException(403, "Chỉ chủ phòng mới có quyền trục xuất thành viên");
    }
    if (userId.equals(targetUserId)) {
      throw new ApiException(400, "Bạn không thể trục xuất chính mình");
    }
    ChatRoomMemberEntity member = chatRoomMemberRepository.findByRoomIdAndUserId(room.getId(), targetUserId)
        .orElseThrow(() -> new ApiException(404, "Người dùng này không phải thành viên phòng chat"));

    chatRoomMemberRepository.delete(member);

    // Create system message
    UserEntity targetUser = findUser(targetUserId);
    UserEntity owner = findUser(userId);
    ChatMessageEntity systemMsg = new ChatMessageEntity();
    systemMsg.setRoomId(room.getId());
    systemMsg.setUserId(null);
    systemMsg.setAuthorName("Hệ thống");
    systemMsg.setContent(owner.getFullName() + " đã mời " + targetUser.getFullName() + " ra khỏi phòng chat");
    systemMsg.setIsSystem(true);
    systemMsg.setCreatedAt(Instant.now());
    chatMessageRepository.save(systemMsg);

    // Broadcast system message via WebSocket
    chatWebSocketHandler.broadcastNewMessage(slug, mapToChatMessageResponse(systemMsg));
  }

  @Transactional
  public ChatRoomResponse updateChatRoom(String userId, String slug, ChatRoomUpdateRequest request) {
    ChatRoomEntity room = findRoom(slug, userId);
    if (room.getOwnerId() == null || !room.getOwnerId().equals(userId)) {
      throw new ApiException(403, "Chỉ chủ phòng mới có quyền thay đổi thông tin phòng");
    }
    room.setName(request.name());
    room.setDescription(request.description());
    chatRoomRepository.save(room);

    ChatRoomResponse response = mapToChatRoomResponse(room);
    chatWebSocketHandler.broadcastRoomInfoUpdate(slug, response);

    return response;
  }

  public List<ChatRoomMemberResponse> getRoomMembers(String userId, String slug) {
    ChatRoomEntity room = findRoom(slug, userId);
    checkRoomAccess(userId, room);

    return chatRoomMemberRepository.findAllByRoomId(room.getId()).stream()
        .map(member -> {
          UserEntity memberUser = userRepository.findById(member.getUserId()).orElse(null);
          String username = memberUser != null ? memberUser.getFullName() : "Ai đó";
          Integer xp = memberUser != null ? memberUser.getXp() : 0;
          String userRole = memberUser != null ? memberUser.getRole().name() : "STUDENT";
          return new ChatRoomMemberResponse(
              member.getUserId(),
              username,
              member.getRole(),
              member.getStatus(),
              xp,
              userRole
          );
        })
        .toList();
  }

  @Transactional(readOnly = true)
  public List<ChatStickerResponse> getStickers() {
    return chatStickerRepository.findAll().stream()
        .map(entity -> new ChatStickerResponse(
            entity.getId(),
            entity.getName(),
            entity.getUrl(),
            entity.getType(),
            entity.getCategory(),
            entity.getKeywords() == null || entity.getKeywords().isBlank()
                ? List.of()
                : java.util.Arrays.stream(entity.getKeywords().split(",")).map(String::trim).toList()
        ))
        .toList();
  }

  @Transactional
  public ChatStickerResponse saveSticker(Long id, ChatStickerRequest request) {
    ChatStickerEntity entity;
    if (id == null) {
      entity = new ChatStickerEntity();
    } else {
      entity = chatStickerRepository.findById(id)
          .orElseThrow(() -> new ApiException(404, "Không tìm thấy nhãn dán/GIF với ID: " + id));
    }

    entity.setName(request.name());
    entity.setUrl(request.url());
    entity.setType(request.type());
    entity.setCategory(request.category());
    
    if (request.keywords() != null) {
      entity.setKeywords(String.join(", ", request.keywords()));
    } else {
      entity.setKeywords("");
    }

    ChatStickerEntity saved = chatStickerRepository.save(entity);
    return new ChatStickerResponse(
        saved.getId(),
        saved.getName(),
        saved.getUrl(),
        saved.getType(),
        saved.getCategory(),
        saved.getKeywords() == null || saved.getKeywords().isBlank()
            ? List.of()
            : java.util.Arrays.stream(saved.getKeywords().split(",")).map(String::trim).toList()
    );
  }

  @Transactional
  public void deleteSticker(Long id) {
    if (!chatStickerRepository.existsById(id)) {
      throw new ApiException(404, "Không tìm thấy nhãn dán/GIF với ID: " + id);
    }
    chatStickerRepository.deleteById(id);
  }
}
