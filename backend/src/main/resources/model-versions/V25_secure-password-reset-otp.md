# V25 Secure password reset OTP

## Purpose
- Provide a two-step forgot-password flow using a one-time code delivered by email.

## Data Contract
- OTP codes contain exactly 6 digits, expire after 15 minutes, and can be used once.
- A new password contains 8 to 120 characters.
- At most 5 invalid OTP attempts are accepted; resend requests are limited to one per 60 seconds.

## Backend Integration
- `PasswordResetService` creates and validates hashed OTP values.
- `MailService` sends a Vietnamese HTML and plain-text reset email.
- `POST /api/auth/forgot-password` accepts an email without revealing whether it exists.
- `POST /api/auth/reset-password` accepts `email`, `otp`, and `newPassword`.

## Database Integration
- `password_reset_otps` stores email, BCrypt code hash, expiry, send time, and failed attempts.
- The table is defined with `utf8mb4` in `data/init.sql`.

## Frontend Integration
- `/forgot-password` guides the user through email, OTP/password, and completion steps.
- The resend action has a 60-second countdown.

## Compatibility
- Existing users and passwords are unchanged.
- Existing reset OTP values become invalid after their recorded expiry.

## Verification
- Run `mvn -f backend/pom.xml test`.
- Run `npm --prefix frontend run build`.
