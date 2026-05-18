package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.ChatRoomEntity;

public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, Long> {
  List<ChatRoomEntity> findAllByOrderByIdAsc();
  Optional<ChatRoomEntity> findBySlug(String slug);
}
