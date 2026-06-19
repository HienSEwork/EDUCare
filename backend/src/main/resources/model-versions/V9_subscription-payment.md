# V9 subscription-payment

## Purpose
- Cần có mô hình để quản lý thông tin các gói dịch vụ học tập VIP/Premium (giá cả, số ngày áp dụng), ghi nhận đăng ký thuê bao của học viên, và quản lý lịch sử giao dịch thanh toán qua cổng VietQR (PayOS) phục vụ nâng cấp vai trò tài khoản.

## Data Contract

### SubscriptionPlan
- `id` (String, PK, NOT NULL): Mã định danh gói (ví dụ: 'FREE', 'VIP_1M', 'PREMIUM_3M').
- `name` (String, NOT NULL): Tên gói dịch vụ.
- `price` (BigDecimal, NOT NULL): Giá gói.
- `durationDays` (Integer, NOT NULL): Thời hạn hiệu lực của gói bằng ngày.
- `description` (String, nullable): Mô tả gói.
- `createdAt` (Instant, NOT NULL): Ngày tạo gói.

### UserSubscription
- `id` (Long, PK, AUTO_INCREMENT): Mã định danh đăng ký.
- `userId` (String, NOT NULL): ID người dùng liên kết.
- `planId` (String, NOT NULL): Gói dịch vụ đăng ký.
- `startDate` (Instant, NOT NULL): Ngày bắt đầu kích hoạt gói.
- `endDate` (Instant, NOT NULL): Ngày hết hạn gói.
- `status` (String, NOT NULL): Trạng thái gói ('ACTIVE', 'EXPIRED', 'CANCELLED').
- `createdAt` (Instant, NOT NULL): Thời điểm đăng ký.
- `updatedAt` (Instant, NOT NULL): Thời điểm cập nhật cuối.

### PaymentTransaction
- `id` (String, PK, NOT NULL): Mã đơn hàng giao dịch sinh ra từ hệ thống.
- `userId` (String, NOT NULL): ID người dùng mua gói.
- `planId` (String, NOT NULL): Gói đăng ký liên quan.
- `amount` (BigDecimal, NOT NULL): Số tiền thanh toán.
- `status` (String, NOT NULL): Trạng thái đơn ('PENDING', 'SUCCESS', 'FAILED').
- `paymentMethod` (String, nullable): Cổng thanh toán (ví dụ: 'PAYOS', 'VNPAY').
- `gatewayReference` (String, nullable): Mã tham chiếu giao dịch từ cổng thanh toán.
- `createdAt` (Instant, NOT NULL): Thời điểm tạo đơn.
- `updatedAt` (Instant, NOT NULL): Thời điểm cập nhật cuối.

## Backend Integration
- **Entities**: 
  - `SubscriptionPlanEntity` đại diện cho `subscription_plans`
  - `UserSubscriptionEntity` đại diện cho `user_subscriptions`
  - `PaymentTransactionEntity` đại diện cho `payment_transactions`
- **Repositories**: `SubscriptionPlanRepository`, `UserSubscriptionRepository`, `PaymentTransactionRepository`
- **Services**: `PaymentService` tính chữ ký SHA-256 bảo mật và xử lý đơn hàng/Webhook.
- **Controllers**: `PaymentController` cung cấp `/api/payments/checkout`, `/api/payments/webhook`, `/api/payments/status/{id}`.
- **Security**: Cho phép truy cập công khai endpoint `/api/payments/webhook` để nhận dữ liệu từ PayOS Webhook.

## Database Integration
- Bổ sung bảng `subscription_plans`, `user_subscriptions`, và `payment_transactions` cùng các ràng buộc khóa ngoại (foreign keys) trong `data/init.sql`.
- Chèn dữ liệu seed các gói dịch vụ cơ bản vào bảng `subscription_plans` trong `data/init.sql`.

## Frontend Integration
- **Types**: Định nghĩa các kiểu `SubscriptionPlan`, `UserSubscription`, `PaymentTransaction`, `CheckoutResponse` trong `frontend/src/types/api.ts`.
- **Pages**:
  - `PricingPage.tsx`: Hiển thị bảng giá các gói và nút đăng ký.
  - `PaymentCallbackPage.tsx`: Nhận kết quả thanh toán từ cổng PayOS điều hướng về để đối soát và hiển thị thông báo.
- **Components**: Sidebar/Navbar hiển thị nhãn VIP/Premium.

## Compatibility
- Các tài khoản người dùng cũ mặc định có plan = `FREE` trong DB.
- Khi người dùng đăng nhập, hệ thống sẽ đối soát thời hạn gói trong bảng `user_subscriptions` để tự động khôi phục về `FREE` nếu gói cũ đã hết hạn.

## Verification
- Kiểm tra biên dịch backend: `mvn clean compile`
- Kiểm tra biên dịch frontend: `npm run build`
