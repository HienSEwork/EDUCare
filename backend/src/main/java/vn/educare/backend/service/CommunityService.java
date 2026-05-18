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
import vn.educare.backend.api.AuthDtos.MoodEntryResponse;
import vn.educare.backend.api.AuthDtos.MoodRequest;
import vn.educare.backend.model.AnonymousQuestionEntity;
import vn.educare.backend.model.AnonymousQuestionLikeEntity;
import vn.educare.backend.model.ChatMessageEntity;
import vn.educare.backend.model.ChatRoomEntity;
import vn.educare.backend.model.CommunityPostEntity;
import vn.educare.backend.model.CommunityPostLikeEntity;
import vn.educare.backend.model.CommunityReplyEntity;
import vn.educare.backend.model.CommunityReplyLikeEntity;
import vn.educare.backend.model.MoodEntryEntity;
import vn.educare.backend.model.UserEntity;
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

  public List<CommunityPostResponse> posts(String userId) {
    List<CommunityPostEntity> posts = communityPostRepository.findAllByOrderByCreatedAtDesc();
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

    return posts.stream()
        .map(post -> new CommunityPostResponse(
            post.getId(),
            post.getAnonymous() ? "Ẩn danh" : post.getAuthorName(),
            post.getUserId(),
            post.getContent(),
            post.getAnonymous(),
            post.getLikesCount(),
            likedPosts.containsKey(post.getId()),
            post.getCreatedAt().toString(),
            repliesByPost.getOrDefault(post.getId(), List.of()).stream()
                .map(reply -> new CommunityReplyResponse(
                    reply.getId(),
                    reply.getAnonymous() ? "Ẩn danh" : reply.getAuthorName(),
                    reply.getUserId(),
                    reply.getContent(),
                    reply.getAnonymous(),
                    reply.getLikesCount(),
                    likedReplies.containsKey(reply.getId()),
                    reply.getCreatedAt().toString()))
                .toList()))
        .toList();
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

  public List<ChatRoomResponse> chatRooms() {
    ensureCrewBotRoom();
    return chatRoomRepository.findAllByOrderByIdAsc().stream()
        .map(room -> new ChatRoomResponse(
            room.getId(),
            room.getSlug(),
            room.getName(),
            room.getDescription(),
            chatMessageRepository.countByRoomId(room.getId())))
        .toList();
  }

  public List<ChatMessageResponse> messages(String slug) {
    ChatRoomEntity room = findRoom(slug);
    seedCrewBotWelcome(room);

    return chatMessageRepository.findTop50ByRoomIdOrderByCreatedAtDesc(room.getId())
        .stream()
        .sorted(Comparator.comparing(ChatMessageEntity::getCreatedAt))
        .map(message -> new ChatMessageResponse(
            message.getId(),
            message.getAuthorName(),
            message.getUserId(),
            message.getContent(),
            message.getCreatedAt().toString()))
        .toList();
  }

  @Transactional
  public List<ChatMessageResponse> postMessage(String userId, String slug, ChatMessageRequest request) {
    UserEntity user = findUser(userId);
    ChatRoomEntity room = findRoom(slug);

    ChatMessageEntity message = new ChatMessageEntity();
    message.setRoomId(room.getId());
    message.setUserId(userId);
    message.setAuthorName(user.getFullName());
    message.setContent(request.content());
    message.setCreatedAt(Instant.now());
    chatMessageRepository.save(message);
    bumpStreak(user);

    if (CREW_BOT_SLUG.equals(room.getSlug())) {
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
    } else {
      notificationService.createMany(
          otherUserIds(userId),
          "chat",
          "Có tin nhắn mới trong cộng đồng",
          user.getFullName() + " vừa gửi tin nhắn trong nhóm " + room.getName() + ".");
    }

    return messages(slug);
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
    String answer = answerFor(request.question());
    question.setUserId(userId);
    question.setQuestion(request.question());
    question.setAnswer(answer);
    question.setCreatedAt(Instant.now());
    anonymousQuestionRepository.save(question);

    notificationService.create(
        userId,
        "anonymous_question",
        "Phản hồi cho câu hỏi ẩn danh",
        answer);

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

  private ChatRoomEntity findRoom(String slug) {
    if (CREW_BOT_SLUG.equals(slug)) {
      return ensureCrewBotRoom();
    }

    return chatRoomRepository.findBySlug(slug).orElseThrow(() -> new ApiException(404, "Chat room not found"));
  }

  @Transactional
  private ChatRoomEntity ensureCrewBotRoom() {
    ChatRoomEntity room = chatRoomRepository.findBySlug(CREW_BOT_SLUG).orElseGet(() -> {
      ChatRoomEntity entity = new ChatRoomEntity();
      entity.setSlug(CREW_BOT_SLUG);
      entity.setName(CREW_BOT_NAME);
      entity.setDescription("Không gian chat riêng với trợ lý đồng hành của EDUcare.");
      return chatRoomRepository.save(entity);
    });

    seedCrewBotWelcome(room);
    return room;
  }

  private void seedCrewBotWelcome(ChatRoomEntity room) {
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
}
