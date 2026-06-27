package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
public class ChatMessageEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "room_id", nullable = false)
  private Long roomId;

  @Column(name = "user_id")
  private String userId;

  @Column(name = "author_name", nullable = false)
  private String authorName;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  @Column(name = "image_url")
  private String imageUrl;

  @Column(name = "audio_url")
  private String audioUrl;

  @Column(name = "audio_name")
  private String audioName;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "is_system", nullable = false)
  private Boolean isSystem = false;
}
