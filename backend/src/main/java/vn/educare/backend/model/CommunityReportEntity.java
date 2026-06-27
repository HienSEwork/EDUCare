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
@Table(name = "community_reports")
@Getter
@Setter
public class CommunityReportEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "reporter_id", nullable = false)
  private String reporterId;

  @Column(name = "post_id")
  private Long postId;

  @Column(name = "reply_id")
  private Long replyId;

  @Column(nullable = false)
  private String reason;

  @Column(nullable = false)
  private String status = "PENDING";

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;
}
