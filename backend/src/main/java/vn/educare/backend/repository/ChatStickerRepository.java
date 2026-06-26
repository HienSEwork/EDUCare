package vn.educare.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.educare.backend.model.ChatStickerEntity;

@Repository
public interface ChatStickerRepository extends JpaRepository<ChatStickerEntity, Long> {
}
