# V26 database migration history

## Purpose
- Apply additive database changes once in both local and production environments.
- Add bonus blog posts without deleting or replacing existing posts.

## Data Contract
- `app_schema_migrations.version`: non-null migration identifier and primary key.
- `app_schema_migrations.description`: non-null human-readable description.
- `app_schema_migrations.installed_on`: non-null application timestamp.

## Backend Integration
- `DatabaseMigrationRunner` runs before seed initialization.
- Migration `V26__blog_posts_bonus` extracts only the `blog_posts` insert from `seed_bonus.sql`.
- Existing blog slugs are left unchanged; only missing slugs are inserted.

## Database Integration
- Adds `app_schema_migrations` with no foreign keys and no destructive statements.
- Updates `data/init.sql` so new MySQL databases contain the history table.
- No existing table, column, row, or Docker volume is deleted.

## Frontend Integration
- No API or frontend contract changes.

## Compatibility
- Safe for existing MySQL databases and the local H2 database in MySQL mode.
- Re-running the application skips a migration already recorded in the history table.

## Verification
- Run `mvn -f backend/pom.xml test`.
- Start the backend twice and verify one `V26__blog_posts_bonus` history row.
