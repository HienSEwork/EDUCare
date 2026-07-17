# V22 Quản lý gói VIP dành cho Admin

## Purpose
- Cung cấp giao diện và API CRUD độc lập để Admin quản lý (thêm, sửa, xóa) cấu hình các gói cước VIP trong cơ sở dữ liệu.

## Data Contract
- `SubscriptionPlanEntity` (Bảng `subscription_plans`):
  - `id`: String (Mã gói cước, khóa chính, ví dụ: FREE, VIP_TRIAL, VIP_1M).
  - `name`: String (Tên gói cước hiển thị).
  - `price`: BigDecimal (Giá cước).
  - `durationDays`: Integer (Số ngày hiệu lực).
  - `description`: String (Mô tả chi tiết gói).
  - `createdAt`: Instant (Thời gian tạo).

## Backend Integration
- `PlanDtos.java`: Record `PlanUpsertRequest` phục vụ nhận và xác thực dữ liệu đầu vào.
- `UserSubscriptionRepository.java`: Bổ sung `existsByPlanId` để kiểm tra ràng buộc trước khi xóa gói.
- `AdminPlanService.java`: Triển khai logic nghiệp vụ CRUD, ngăn chặn xóa các gói mặc định (`FREE`, `VIP_TRIAL`) và các gói đang có học viên sử dụng.
- `AdminPlanController.java`: Khai báo các API đầu cuối `/api/admin/plans` bảo mật bằng `@PreAuthorize("hasRole('ADMIN')")`.

## Database Integration
- Tác động lên bảng `subscription_plans`.
- Không thay đổi schema vật lý, các thay đổi dữ liệu được thực hiện động thông qua giao diện Admin Web.

## Frontend Integration
- Cập nhật `AdminDashboardPage.tsx` tích hợp Tab `"plans"` trên Sidebar Admin, thiết kế bảng danh sách gói cước VIP và Modal thêm/sửa gói cước.

## Compatibility
- Giữ nguyên cấu trúc dữ liệu hiện tại, kế thừa hoàn hảo các gói cước cũ.
- Tương thích 100% với dữ liệu hiện tại.

## Verification
- Chạy unit/integration test backend: `mvn test`
- Build frontend: `npm run build`
