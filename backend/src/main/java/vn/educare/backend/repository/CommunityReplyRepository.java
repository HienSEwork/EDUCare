package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.CommunityReplyEntity;

public interface CommunityReplyRepository extends JpaRepository<CommunityReplyEntity, Long> {
  List<CommunityReplyEntity> findAllByPostIdInOrderByCreatedAtAsc(List<Long> postIds);
  List<CommunityReplyEntity> findAllByPostIdOrderByCreatedAtAsc(Long postId);
  void deleteAllByPostId(Long postId);
}
