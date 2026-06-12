package vn.educare.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "recommend_questions")
@Getter
@Setter
public class RecommendQuestionEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String emoji;

  @Column(nullable = false, length = 500)
  private String question;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String reason;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private CategoryEntity category;

  @Column(name = "question_order")
  private Integer questionOrder;
}
