package vn.educare.backend.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "chat_message_reactions")
@Getter
@Setter
public class ChatMessageReactionEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "message_id", nullable = false)
  private Long messageId;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(nullable = false)
  private String emoji;
}
