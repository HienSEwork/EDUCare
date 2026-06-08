# V1 micro-lesson-progress

## Purpose
- Tracking user progress for individual micro lesson blocks (cards) and displaying completed state checkmarks in the sidebar list of micro lessons.

## Data Contract
- `id`: BIGINT PRIMARY KEY AUTO_INCREMENT, NOT NULL.
- `user_id`: VARCHAR(36), NOT NULL.
- `micro_lesson_block_id`: BIGINT, NOT NULL.
- `completed`: BOOLEAN, DEFAULT FALSE.
- `completed_at`: TIMESTAMP, NULL.

## Backend Integration
- Entity: `MicroLessonProgressEntity` in `vn.educare.backend.model`.
- Repository: `MicroLessonProgressRepository` in `vn.educare.backend.repository`.
- Service: Update `ProgressService` to support completing micro lessons, and `ContentService` to query and return completion status in `MicroLessonResponse`.
- Controller: Update `DashboardController` with endpoint `POST /api/progress/micro-lessons/{microLessonId}/complete`.

## Database Integration
- Table: `micro_lesson_progress` already created in `data/KhoaV1.sql`.
- How the change stays runnable with MySQL: Table created as `IF NOT EXISTS` in `data/KhoaV1.sql`.

## Frontend Integration
- Types: Update `MicroLesson` inside `frontend/src/types/api.ts` to include `completed?: boolean`.
- Pages: Update `LessonPage.tsx` to render the checkmark in the sidebar list and render a "Complete" button under the cards.

## Compatibility
- Clean migration. No impact on existing user data or lessons.

## Verification
- Standard manual verification on local dev server.
