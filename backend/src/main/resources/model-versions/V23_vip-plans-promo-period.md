# V23 VIP Plans Promotion Period

## Purpose
- Hỗ trợ thiết lập thời hạn chạy chương trình khuyến mãi/ưu đãi (ví dụ: dùng thử VIP_TRIAL) trong một khoảng thời gian cụ thể (từ ngày... đến ngày...) hoặc vô thời hạn.
- Giải quyết triệt để việc ẩn/hiện banner ưu đãi thông minh ở Frontend dựa trên hiệu lực thực tế của gói dùng thử.

## Data Contract
- Bảng `subscription_plans`:
  - `start_date` (Timestamp/Datetime, nullable, mặc định NULL): Thời gian bắt đầu khuyến mãi.
  - `end_date` (Timestamp/Datetime, nullable, mặc định NULL): Thời gian kết thúc khuyến mãi.
  - Trạng thái `active` được tính toán động (Computed Property) ở API: `active = true` khi trạng thái kích hoạt được bật VÀ thời gian hiện tại nằm trong khoảng `[start_date, end_date]`.

## Backend Integration
- **Entity (`SubscriptionPlanEntity.java`):** Bổ sung `startDate` và `endDate` kiểu `Instant`. Override lại hàm `getActive()` để tự động so sánh thời gian thực.
- **DTO (`PlanDtos.java`):** Bổ sung `Instant startDate` và `Instant endDate` vào `PlanUpsertRequest`.
- **Controller (`AdminPlanController.java`):** Ánh xạ các trường ngày vào Entity khi Thêm/Sửa.
- **Service (`AuthService.java`):** Kiểm tra `trialPlanOpt.get().getActive()` trước khi cấp dùng thử VIP 7 ngày để đảm bảo tính thời hạn.

## Database Integration
- Cập nhật tệp `data/init.sql` và `data/educare_new.sql` để thêm cột `start_date` và `end_date` vào định nghĩa bảng `subscription_plans`.

## Frontend Integration
- **Types (`api.ts`):** Thêm `startDate?: string | null` và `endDate?: string | null` vào `SubscriptionPlan`.
- **Admin Dashboard (`AdminDashboardPage.tsx`):**
  - Thêm các ô chọn ngày giờ `startDate` và `endDate` vào modal form.
  - Đóng gói dữ liệu gửi lên API.
- **Pricing Page (`PricingPage.tsx`):** Thêm state `hasTrialPromo` để kiểm tra sự tồn tại của gói dùng thử `VIP_TRIAL` có `active = true` trước khi vẽ banner ưu đãi quà tặng.

## Verification
- Biên dịch thành công dự án.
- Chạy toàn bộ integration test suite của Spring Boot (`mvn test`).
- Build frontend production (`npm run build`).
