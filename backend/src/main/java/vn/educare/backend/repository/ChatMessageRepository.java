package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.ChatMessageEntity;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
  List<ChatMessageEntity> findTop50ByRoomIdOrderByCreatedAtDesc(Long roomId);
  long countByRoomId(Long roomId);
}
