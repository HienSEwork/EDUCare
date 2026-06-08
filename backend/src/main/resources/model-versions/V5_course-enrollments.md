# V5 Course Enrollments

## Purpose
- Support enrolling students into specific courses.
- Allow displaying progress on enrolled courses under a "My Learning" tab or dashboard.

## Data Contract
- Table: `course_enrollments`
  - `id`: BIGINT PRIMARY KEY AUTO_INCREMENT
  - `user_id`: VARCHAR(36) NOT NULL (references `users(id)`)
  - `course_id`: BIGINT NOT NULL (references `courses(id)`)
  - `enrolled_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  - UNIQUE KEY `uq_user_course` (`user_id`, `course_id`)

## Backend Integration
- Entity: `CourseEnrollmentEntity` in `vn.educare.backend.model`.
- Repository: `CourseEnrollmentRepository` in `vn.educare.backend.repository` with queries:
  - `boolean existsByUserIdAndCourseId(String userId, Long courseId)`
  - `List<CourseEnrollmentEntity> findAllByUserId(String userId)`
- Service: Update `ContentService` to query enrollment status and expose `/api/courses/{courseId}/enroll` and `/api/courses/my-learning` APIs.
- DTO: Update `AuthDtos.CourseResponse` to include `boolean enrolled`.

## Database Integration
- SQL file: `data/KhoaV3.sql` contains the schema creation script for `course_enrollments` table.

## Frontend Integration
- Types: Update `frontend/src/types/api.ts` to include `enrolled` status inside `Course`.
- Pages: 
  - Redesign `CoursesPage.tsx` as a grid catalog with "My Learning" top section.
  - Implement `CourseDetailPage.tsx` at `/course/:id` with syllabus and enrollment actions.
  - Update `DashboardPage.tsx` to list active enrollments and progress bars.

## Compatibility
- Clean migration. Backward compatible.
