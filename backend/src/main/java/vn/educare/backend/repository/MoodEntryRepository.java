package vn.educare.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.educare.backend.model.MoodEntryEntity;

public interface MoodEntryRepository extends JpaRepository<MoodEntryEntity, Long> {
  List<MoodEntryEntity> findTop7ByUserIdOrderByEntryDateDesc(String userId);
  Optional<MoodEntryEntity> findByUserIdAndEntryDate(String userId, LocalDate entryDate);
}
