package vn.educare.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.AnonymousQuestionLikeEntity;

public interface AnonymousQuestionLikeRepository extends JpaRepository<AnonymousQuestionLikeEntity, Long> {
  Optional<AnonymousQuestionLikeEntity> findByQuestionIdAndUserId(Long questionId, String userId);
  List<AnonymousQuestionLikeEntity> findAllByQuestionIdInAndUserId(List<Long> questionIds, String userId);
}
