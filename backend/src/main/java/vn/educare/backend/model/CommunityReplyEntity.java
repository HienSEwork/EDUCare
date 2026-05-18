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
@Table(name = "community_replies")
@Getter
@Setter
public class CommunityReplyEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "post_id", nullable = false)
  private Long postId;

  @Column(name = "user_id")
  private String userId;

  @Column(name = "author_name", nullable = false)
  private String authorName;

  @Column(nullable = false)
  private Boolean anonymous;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  @Column(name = "likes_count", nullable = false)
  private Integer likesCount = 0;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;
}
