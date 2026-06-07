# V2 micro-lesson-progress

## Purpose
- Refactor the database representation of micro lesson progress to be at the micro lesson level rather than the block/card level. This optimizes the row count by 6x and simplifies progress queries on the backend.

## Data Contract
- `id`: BIGINT PRIMARY KEY AUTO_INCREMENT, NOT NULL.
- `user_id`: VARCHAR(36), NOT NULL.
- `micro_lesson_id`: BIGINT, NOT NULL (references `micro_lessons(id)`).
- `completed`: BOOLEAN, DEFAULT FALSE.
- `completed_at`: TIMESTAMP, NULL.

## Backend Integration
- Entity: Update `MicroLessonProgressEntity` to use `microLessonId` and map it to column `micro_lesson_id`.
- Repository: Update query method in `MicroLessonProgressRepository` to `findByUserIdAndMicroLessonId`.
- Service:
  - Update `ContentService` to query completed micro lesson IDs and map them directly to `MicroLessonResponse`.
  - Update `ProgressService` to save exactly 1 progress row per micro lesson completion, removing dependency on `MicroLessonBlockRepository`.

## Database Integration
- SQL file updated: `data/KhoaV1.sql` modified to replace `micro_lesson_block_id` column with `micro_lesson_id` and update foreign key constraints.

## Frontend Integration
- No changes required on the React frontend since the API contract and JSON types remain identical.

## Compatibility
- Existing `micro_lesson_progress` table should be dropped and recreated. Migration is clean as the feature is in active development.

## Verification
- Manual verification on local dev server.
