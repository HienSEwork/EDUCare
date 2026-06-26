package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.ChatRoomMemberEntity;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMemberEntity, Long> {
  List<ChatRoomMemberEntity> findAllByRoomId(Long roomId);
  List<ChatRoomMemberEntity> findAllByUserId(String userId);
  Optional<ChatRoomMemberEntity> findByRoomIdAndUserId(Long roomId, String userId);
  boolean existsByRoomIdAndUserId(Long roomId, String userId);
  boolean existsByRoomIdAndUserIdAndStatus(Long roomId, String userId, String status);
  List<ChatRoomMemberEntity> findAllByUserIdAndStatus(String userId, String status);
  List<ChatRoomMemberEntity> findAllByRoomIdAndStatus(Long roomId, String status);
}
