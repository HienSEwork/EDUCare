# V8 Recommender Questions Database Normalization

## Purpose
- Store the "Hỏi nhanh - Gợi ý chuẩn" recommender questions in the database instead of hardcoding them in the React client.
- Allow questions to be managed dynamically by linking each question to its corresponding Category.

## Data Contract

### 1. Recommender Questions Table (`recommend_questions`)
- `id` (BIGINT, Primary Key, Auto-increment)
- `emoji` (VARCHAR(20), Not Null): Emoji associated with the question (e.g., `"🌸"`).
- `question` (VARCHAR(500), Not Null): The user question text.
- `reason` (TEXT, Not Null): The EDUcare recommend reasoning message.
- `category_id` (BIGINT, Nullable): Foreign key referencing `categories(id)`.
- `question_order` (INT, Default 0): Display ordering index.

### 2. API DTO Changes
- `RecommendQuestionResponse` record introduced in `AuthDtos.java`:
  ```java
  public record RecommendQuestionResponse(
      Long id,
      String emoji,
      String question,
      String reason,
      String targetTag // category slug
  ) {}
  ```

## Backend Integration
- **Entity**: Create `RecommendQuestionEntity.java` in `vn.educare.backend.model`.
- **Repository**: Create `RecommendQuestionRepository.java` in `vn.educare.backend.repository`.
- **Controller & Endpoint**: 
  - Add `GET /courses/questions` to `ContentController.java` to fetch the list of active recommender questions.
- **Service**: 
  - Add query logic and DTO mapping in `ContentService.java`.

## Database Integration
- **init.sql**: Create table `recommend_questions`, add foreign key constraint, and seed default questions.

## Frontend Integration
- **Types**: Define `RecommendQuestion` type in `frontend/src/types/api.ts`.
- **CoursesPage.tsx**: Fetch dynamic questions from `/courses/questions` API on mount and render them instead of the hardcoded `RECOMMEND_QUESTIONS`.

## Compatibility
- Backwards compatible. The seeded database questions map to the same category slugs (`day-thi`, `ranh-gioi`, `cam-xuc`, `an-toan`, `moi-quan-he`).

## Verification
- Spring Boot compiles successfully.
- React frontend builds successfully.
