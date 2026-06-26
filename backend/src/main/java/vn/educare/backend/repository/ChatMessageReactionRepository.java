package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.educare.backend.model.ChatMessageReactionEntity;

@Repository
public interface ChatMessageReactionRepository extends JpaRepository<ChatMessageReactionEntity, Long> {

  List<ChatMessageReactionEntity> findAllByMessageId(Long messageId);

  List<ChatMessageReactionEntity> findAllByMessageIdIn(List<Long> messageIds);

  Optional<ChatMessageReactionEntity> findByMessageIdAndUserId(Long messageId, String userId);

  void deleteByMessageIdAndUserId(Long messageId, String userId);

  boolean existsByMessageIdAndUserId(Long messageId, String userId);
}
