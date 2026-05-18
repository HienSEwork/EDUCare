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
@Table(name = "community_reply_likes")
@Getter
@Setter
public class CommunityReplyLikeEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "reply_id", nullable = false)
  private Long replyId;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;
}
