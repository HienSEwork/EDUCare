# V11 Dynamic Subscription Plans

## Purpose
- Avoid hardcoding subscription plans in the frontend code. Expose available plans dynamically from the database via a backend API, allowing the frontend to dynamically render any plans created from the admin dashboard.
- Link the user's specific active subscription plan ID to the user profile payload to resolve current subscription status dynamically in the client.

## Data Contract
- `UserResponse` (DTO): Added field `subscriptionPlanId` (String, nullable) to identify the specific `plan_id` currently active for the user (e.g. `VIP_1M`, `PREMIUM_3M`, or `FREE` if no active subscription).
- `SubscriptionPlan` (DTO / Entity): Fields exposed to the client:
  - `id` (String): Unique identifier.
  - `name` (String): Display name.
  - `price` (BigDecimal): Price.
  - `durationDays` (Integer): Active period.
  - `description` (String, nullable): Features list / description text.

## Backend Integration
- `PaymentService`: Added `getAllPlans()` to retrieve all subscription plans from the database.
- `PaymentController`: Exposed `GET /api/payments/plans` as a public, unauthenticated endpoint to query all available plans.
- `SecurityConfig`: Configured `/api/payments/plans` for public GET access.
- `UserMapper`: Updated to retrieve the latest active subscription and map its plan ID to the `UserResponse` payload under `subscriptionPlanId`.
- `AuthDtos`: Updated `UserResponse` record to include the `subscriptionPlanId` field.

## Database Integration
- Reads directly from the `subscription_plans` and `user_subscriptions` tables. No schema changes are needed.

## Frontend Integration
- `types/api.ts`: Added `subscriptionPlanId?: string | null;` to the `User` interface.
- `PricingPage.tsx`:
  - Fetches plans dynamically from `GET /api/payments/plans` on load.
  - Maps API plans to `PlanItem` UI configs. If the description has multiple items (separated by newline/semicolon), it splits them dynamically.
  - Computes `isCurrentPlan` using the user's active `subscriptionPlanId`.
  - Dynamically calculates `isLowerTier` based on comparative subscription tier levels (`FREE` = 1, `VIP`/`POPULAR` = 2, `PREMIUM` = 3) to render the "Đã bao gồm trong Premium" status properly for any dynamic plans.
  - Falls back gracefully to static plans in case of API failure.

## Compatibility
- Fully backward compatible. Legacy users without a subscription record default to `FREE` for both tier and `subscriptionPlanId`.

## Verification
- Verified that all components compile cleanly.
- Verified that dynamic plans are sorted by price and rendered dynamically in the UI.
