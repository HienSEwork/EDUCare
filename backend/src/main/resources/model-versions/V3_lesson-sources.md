# V3 lesson-sources

## Purpose
- Support displaying lesson reference sources (e.g. WHO, UNFPA, books, medical articles) on the sidebar of the lesson page to build authority and trust for the course content.

## Data Contract
- `id`: BIGINT PRIMARY KEY AUTO_INCREMENT, NOT NULL.
- `lesson_id`: BIGINT, NOT NULL (references `lessons(id)`).
- `source_name`: VARCHAR(255), NOT NULL.
- `source_url`: TEXT, NOT NULL.
- `source_type`: VARCHAR(50), NULL.

## Backend Integration
- Entity: `LessonSourceEntity` in `vn.educare.backend.model`.
- Repository: `LessonSourceRepository` in `vn.educare.backend.repository` with `findAllByLessonId(Long lessonId)`.
- Service: Update `ContentService` to query and return reference materials in `LessonResponse`.
- DTO: Update `AuthDtos` with `LessonSourceResponse` record and add `List<LessonSourceResponse> sources` to `LessonResponse`.

## Database Integration
- SQL file: `data/KhoaV2.sql` contains the schema creation script for `lesson_sources` table.

## Frontend Integration
- Types: Update `frontend/src/types/api.ts` to include `LessonSource` and add `sources?: LessonSource[]` to `Lesson`.
- Pages: Render reference card on the bottom of the right sidebar in `LessonPage.tsx`.

## Compatibility
- Clean migration. Backward compatible.

## Verification
- Manual verification on local dev server.
