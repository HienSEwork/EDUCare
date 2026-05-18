package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.CommunityPostLikeEntity;

public interface CommunityPostLikeRepository extends JpaRepository<CommunityPostLikeEntity, Long> {
  Optional<CommunityPostLikeEntity> findByPostIdAndUserId(Long postId, String userId);
  List<CommunityPostLikeEntity> findAllByPostIdInAndUserId(List<Long> postIds, String userId);
  void deleteAllByPostId(Long postId);
}
