package vn.educare.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "mood_entries")
@Getter
@Setter
public class MoodEntryEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private String userId;

  @Enumerated(EnumType.STRING)
  @Column(name = "mood_code", nullable = false)
  private MoodCode moodCode;

  @Column(columnDefinition = "TEXT")
  private String note;

  @Column(name = "entry_date", nullable = false)
  private LocalDate entryDate;
}
