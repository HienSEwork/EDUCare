# V24 Phân loại gói cước VIP

## Purpose
- Cung cấp thuộc tính phân loại loại gói cước (REGULAR, TRIAL, PROMOTION) để quản lý hiển thị và luồng đăng ký dùng thử tự động linh hoạt hơn.

## Data Contract
- `planType`: Enum (`PlanType`), không được null, mặc định là `REGULAR`. Các giá trị hợp lệ: `REGULAR`, `TRIAL`, `PROMOTION`.

## Backend Integration
- Entity `SubscriptionPlanEntity` có trường `planType`.
- Repository `SubscriptionPlanRepository` hỗ trợ tìm kiếm `findByPlanType`.
- Service `AuthService` tìm kiếm gói học thử dựa trên `planType = PlanType.TRIAL` đang hoạt động.
- DTO `PlanUpsertRequest` trong `PlanDtos` bổ sung thuộc tính `planType`.
- Controller `AdminPlanController` đồng bộ ánh xạ dữ liệu `planType`.

## Database Integration
- Bảng `subscription_plans` thêm cột `plan_type VARCHAR(50) NOT NULL DEFAULT 'REGULAR'`.
- File cập nhật: `data/init.sql` và `data/educare_new.sql`.

## Frontend Integration
- Kiểu `SubscriptionPlan` trong `frontend/src/types/api.ts` thêm `planType`.
- Form tạo/chỉnh sửa gói cước và bảng hiển thị trong `AdminDashboardPage.tsx`.
- Hiển thị bảng giá và nhận diện gói cước đặc biệt trong `PricingPage.tsx`.

## Compatibility
- Dữ liệu cũ tự động nhận giá trị mặc định `REGULAR`. An toàn cho hệ thống.

## Verification
- `mvn -f backend/pom.xml test`
- `npm --prefix frontend run build`
