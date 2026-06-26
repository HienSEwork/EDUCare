package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "chat_stickers")
@Getter
@Setter
public class ChatStickerEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(nullable = false, length = 512)
  private String url;

  @Column(nullable = false, length = 20)
  private String type; // STICKER or GIF

  @Column(nullable = false, length = 50)
  private String category;

  @Column(length = 500)
  private String keywords; // Comma-separated search tags

  @Column(name = "created_at", insertable = false, updatable = false)
  private LocalDateTime createdAt;
}
