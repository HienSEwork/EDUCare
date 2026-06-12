# V7 Course Category Table Normalization

## Purpose
- Normalize course categories in the database by splitting them into a separate `categories` table.
- Eliminate raw category strings in the `courses` table and replace them with a foreign key `category_id`.
- Enable dynamic loading of categories, icons, and theme colors from the database, eliminating hardcoded maps on the frontend and preparing the application for future Admin Dashboard integration.

## Data Contract

### 1. Categories Table (`categories`)
- `id` (BIGINT, Primary Key, Auto-increment)
- `slug` (VARCHAR(100), Not Null, Unique): Clean identifier (e.g., `"day-thi"`, `"ranh-gioi"`).
- `name` (VARCHAR(255), Not Null): Human-friendly name with emoji (e.g., `"🌸 Cơ thể & Dậy thì"`).
- `icon` (VARCHAR(100), Not Null): Lucide icon identifier (e.g., `"Compass"`, `"ShieldCheck"`).
- `color_theme` (VARCHAR(50), Not Null): HEX color string (e.g., `"#f77f00"`).

### 2. Courses Table (`courses`)
- `category_id` (BIGINT, Nullable): Foreign key referencing `categories(id)`.

### 3. API DTO changes
- `CategoryResponse` record introduced in `AuthDtos.java`:
  ```java
  public record CategoryResponse(
      Long id,
      String slug,
      String name,
      String icon,
      String colorTheme
  ) {}
  ```
- `CourseResponse` record updated to include:
  ```java
  CategoryResponse category
  ```
  instead of the old raw string field.

## Backend Integration
- **Entity**: Create `CategoryEntity.java`.
- **Repository**: Create `CategoryRepository.java`.
- **Course Relationship**: Add `@ManyToOne` mapping in `CourseEntity.java` for `category_id`.
- **Mapper**: Update `ContentService.java` to map `course.getCategory()` relation to `CategoryResponse` in `toCourseResponse()`.

## Database Integration
- **init.sql**: Create table `categories`, add column `category_id` to `courses`, and define foreign key constraint.
- **seed.sql / CourseSQL**: Update insert statements to seed categories first, and reference their IDs when creating courses.

## Frontend Integration
- **Types**: Define `Category` type and update `Course` in `frontend/src/types/api.ts`.
- **CoursesPage.tsx**: Dynamically extract category metadata from fetched courses list to render the Tag Bar and Filter dynamically.

## Compatibility
- Database seeds are updated. Rerunning `init.sql` will backfill all existing courses with their correct `category_id`.

## Verification
- Verified Spring Boot project compiles.
- Verified Vite frontend compiles.
