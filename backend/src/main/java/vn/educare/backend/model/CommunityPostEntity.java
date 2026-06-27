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
@Table(name = "community_posts")
@Getter
@Setter
public class CommunityPostEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

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

  @Column(name = "link_url", length = 512)
  private String linkUrl;

  @Column(name = "link_title")
  private String linkTitle;

  @Column(name = "link_description", length = 512)
  private String linkDescription;

  @Column(name = "link_image", length = 512)
  private String linkImage;

  @Column(nullable = false)
  private Boolean pinned = false;

  @Column(name = "category_id")
  private Long categoryId;

  @Column
  private String title;

  @Column(name = "image_url", length = 500)
  private String imageUrl;
}
