# V27 admin credentials

## Purpose
- Move the primary legacy administrator account to the required production login.

## Data Contract
- Primary admin username remains `educare_admin`.
- Email is provided by `APP_ADMIN_EMAIL` and must match the required configured address.
- Password is provided by `APP_ADMIN_PASSWORD` and is stored only as a BCrypt hash.

## Backend Integration
- `DatabaseMigrationRunner` applies `V27__admin_credentials` once.
- Startup fails safely if the target email belongs to another account or the primary admin is missing.

## Database Integration
- Updates one existing `users` row and records the migration in `app_schema_migrations`.
- No user, table, or other application data is deleted.

## Frontend Integration
- No API contract change.

## Compatibility
- Existing admin-owned content and relationships remain attached to the same user ID.

## Verification
- Verify the migration history row and authenticate using the configured admin account.
