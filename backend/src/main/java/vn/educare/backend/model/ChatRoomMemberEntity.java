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
@Table(name = "chat_room_members")
@Getter
@Setter
public class ChatRoomMemberEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "room_id", nullable = false)
  private Long roomId;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(name = "joined_at", nullable = false)
  private Instant joinedAt;

  @Column(name = "status", nullable = false)
  private String status = "ACTIVE";

  @Column(name = "role", nullable = false)
  private String role = "MEMBER";
}
