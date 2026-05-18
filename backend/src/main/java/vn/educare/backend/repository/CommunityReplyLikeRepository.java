package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.CommunityReplyLikeEntity;

public interface CommunityReplyLikeRepository extends JpaRepository<CommunityReplyLikeEntity, Long> {
  Optional<CommunityReplyLikeEntity> findByReplyIdAndUserId(Long replyId, String userId);
  List<CommunityReplyLikeEntity> findAllByReplyIdInAndUserId(List<Long> replyIds, String userId);
  void deleteAllByReplyId(Long replyId);
  void deleteAllByReplyIdIn(List<Long> replyIds);
}
