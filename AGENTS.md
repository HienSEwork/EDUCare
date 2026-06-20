# AI Agent Rules for EDUcare VN

This file defines the required rules for AI agents working in the `educare-vn` repository.

## Goals

- Keep the fullstack structure clear: `backend/` is the Spring Boot API, `frontend/` is the React/Vite app, and `data/` contains SQL schema and seed files.
- Move quickly without introducing bugs, duplicate code, or unnecessary rewrites.
- Prefer updating existing code and preserving backward compatibility whenever possible.

## Working Principles

1. Read the existing code before making changes.
2. Do not delete old code and rewrite from scratch when a smaller update or refactor is enough.
3. Do not introduce a new framework, folder structure, or pattern when the project already has a suitable pattern.
4. Do not commit build artifacts or local dependencies: `node_modules`, `dist`, `target`, `*.log`, `.env`.
5. Do not hard-code credentials, production URLs, secrets, tokens, or passwords.
6. When changing backend code, run at least `mvn -f backend/pom.xml test`.
7. When changing frontend code, run at least `npm --prefix frontend test` or `npm --prefix frontend run build`, depending on the change.
8. When changing the full app, prefer running both `npm run test` and `npm run build`.

## Model Versioning Rule

Whenever a new logic, feature, or function requires adding or changing a model/domain model, the agent must create a new model version file.

File naming convention:

```text
backend/src/main/resources/model-versions/V1_<model-name>.md
backend/src/main/resources/model-versions/V2_<model-name>.md
backend/src/main/resources/model-versions/V3_<model-name>.md
```

Versioning rules:

- Find the highest existing version in `backend/src/main/resources/model-versions/`.
- Create the next version file. Do not edit or delete old version files unless the user explicitly asks for it.
- Use short kebab-case or snake_case names for `<model-name>`, for example `V1_user-profile.md` or `V2_quiz-attempt.md`.
- If the change affects multiple models, create one feature-level version file, for example `V3_learning-progress.md`.

Required content for each model version file:

```md
# Vx <model or feature name>

## Purpose
- Why this model/change is needed.

## Data Contract
- Fields, types, nullability, and defaults.
- Valid enum values or allowed values, if any.

## Backend Integration
- Affected entity/model.
- Repository, service, controller, and DTO updates.
- Authentication, role, and validation rules, if any.

## Database Integration
- Tables, columns, indexes, and foreign keys to add or update.
- SQL files to update: `data/init.sql`, `data/seed.sql`, or another related seed file.
- How the change stays runnable with MySQL.

## Frontend Integration
- Types, API client usage, pages, or components to update if the feature has frontend impact.

## Compatibility
- Impact on existing data.
- Migration, seed, or backfill notes if needed.

## Verification
- Commands that were run.
- Test cases that were added or updated.
```

## Automatic Integration When Running the App

When a model version file is created, the agent must integrate the change into the app so backend-only runs and full-app runs do not have contract mismatches.

- Backend:
  - Update the Java entity in `backend/src/main/java/vn/educare/backend/model`.
  - Update repositories, services, controllers, and DTOs if the model is exposed through the API.
  - Update validation and exception handling when new input rules are introduced.
  - Update `data/init.sql` for the MySQL schema.
  - Update `data/seed.sql` or `data/quizbank.sql` when the UI/API needs sample data.
  - Keep `spring.jpa.hibernate.ddl-auto=validate`; do not change it to `update` to hide schema problems.
- Frontend:
  - Update `frontend/src/types/api.ts` if the API contract changes.
  - Update API client usage, pages, components, and tests that depend on the changed contract.
  - Do not let mock data drift from the backend contract.
- Full app:
  - Root scripts must remain runnable: `npm run dev`, `npm run build`, and `npm run test`.

## Backend Coding Rules

- Controllers should only handle HTTP mappings, authentication/current-user access, and request/response DTOs.
- Business logic belongs in `service/`.
- Database access belongs in `repository/`.
- Entities should only map database structure and simple lifecycle hooks.
- Use `ApiException` for business errors; do not throw raw runtime exceptions when the client needs a clear message.
- Do not use `print7StackTrace`; use an SLF4J logger.
- Public endpoints must be explicitly declared in `SecurityConfig`.
- Every data-writing endpoint needs input validation and authentication unless it is intentionally public.

## Frontend Coding Rules

- API calls must use `frontend/src/lib/api/client.ts`.
- Request and response types must live in `frontend/src/types/api.ts`.
- UI copy should use files in `frontend/src/content/` when a matching content module already exists.
- Do not duplicate large data sets inside pages when an API source or content module already exists.
- New components must support a real workflow; do not add decorative UI only.

## Database Rules

- `data/init.sql` is the main MySQL schema file.
- `data/seed.sql` is the main app seed file.
- New tables must use the appropriate `utf8mb4` character set and collation.
- Foreign keys, unique keys, and indexes must be explicit when there is a relationship or frequent query path.
- Do not delete old columns or tables without a migration/backfill plan and explicit user approval.

## Git Rules

- Before committing, run `git status --short --branch`.
- Do not revert changes you did not make unless the user explicitly asks for it.
- Use short commit messages with a clear intent.
- Push to `main` only after the relevant tests/builds pass, or after clearly documenting why they could not be run.

## Definition of Done

A task is only complete when:

- The code compiles.
- Relevant tests/builds were run.
- A model version file was created when the task changed a model/domain contract.
- Schema, API, and frontend types are not out of sync.
- No local artifacts are tracked by git.
- The worktree is clean, or only reasonable ignored local files remain.
