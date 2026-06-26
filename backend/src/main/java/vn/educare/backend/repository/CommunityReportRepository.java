package vn.educare.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.CommunityReportEntity;

public interface CommunityReportRepository extends JpaRepository<CommunityReportEntity, Long> {
  List<CommunityReportEntity> findAllByOrderByCreatedAtDesc();
  List<CommunityReportEntity> findAllByPostId(Long postId);
  List<CommunityReportEntity> findAllByReplyId(Long replyId);
}
