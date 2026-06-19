# V10 Payment Cancellation

## Purpose
- Implement both Option A (daily scheduler cleanup of stale PENDING transactions) and Option B (real-time transaction cancellation via API endpoint when payment is aborted) to prevent dangling or orphaned PENDING payment records in the database.

## Data Contract
- Update `status` field in `PaymentTransactionEntity` to support `CANCELLED` in addition to `PENDING`, `SUCCESS`, and `FAILED`.
- Fields, types, nullability, and database defaults remain unchanged.

## Backend Integration
- `PaymentTransactionRepository`: Added `findByStatusAndCreatedAtBefore(String status, Instant cutoff)` to retrieve expired pending transactions efficiently.
- `PaymentService`: Implemented `cancelTransaction(String transactionId)` to transition pending transaction status to `CANCELLED`.
- `PaymentController`: Exposed `POST /api/payments/cancel/{transactionId}` as a public endpoint to allow cancellation from the client-side redirect.
- `SecurityConfig`: Permitted public access to `/api/payments/cancel/**` to facilitate unauthenticated/public client checkout cancellations.
- `SubscriptionScheduler`: Added `cleanExpiredPendingTransactions()` scheduled daily to automatically mark `PENDING` transactions older than 24 hours as `CANCELLED`.

## Database Integration
- No schema changes are required as `status` column is a `VARCHAR` mapping.
- Transaction records are updated directly via JPA.

## Frontend Integration
- `PaymentCallbackPage.tsx`: Integrated real-time backend notification. When `status` from PayOS indicates cancellation (`cancel=true` or `status=cancel`), it triggers `POST /api/payments/cancel/${orderCode}` asynchronously to mark the transaction as `CANCELLED` immediately.

## Compatibility
- Fully backward compatible. Existing database rows with `PENDING` will be processed by the daily scheduler if they are older than 24 hours.

## Verification
- Checked that cleanExpiredPendingTransactions uses the optimized database query method.
- Verified that PaymentCallbackPage cancels transactions correctly.
