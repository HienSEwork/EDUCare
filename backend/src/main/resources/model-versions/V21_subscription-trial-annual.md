# V21 subscription-trial-annual

## Purpose
- Cải tiến mô hình kinh doanh của hệ thống EDUcare theo nhận xét của Mentor:
  - Tăng giá gói VIP 1 Tháng từ 29.000đ lên 49.000đ làm gói neo giá (Price Anchoring).
  - Bổ sung gói cước mới VIP 1 Năm với mức giá hấp dẫn 99.000đ để kích thích người dùng cam kết dài hạn.
  - Cung cấp gói dùng thử VIP 7 ngày (Free Trial) cho mọi tài khoản mới đăng ký để trải nghiệm đầy đủ tính năng trước khi chuyển sang gói có phí.

## Data Contract
- Bổ sung gói cước ẩn `VIP_TRIAL` vào danh sách `SubscriptionPlan` của hệ thống:
  - `id`: `"VIP_TRIAL"`
  - `name`: `"Học thử VIP 7 Ngày"`
  - `price`: `0.00`
  - `durationDays`: `7`
  - `description`: `"Đăng ký tài khoản mới được học thử 7 ngày."`
- Thay đổi thông tin gói cước `VIP_1M`:
  - `price`: `49000.00` (thay vì 29000.00)
- Thay đổi/Thêm gói cước `VIP_1Y` (thay cho gói `PREMIUM_4M` cũ để tinh giản biểu giá):
  - `id`: `"VIP_1Y"`
  - `name`: `"Học viên VIP 1 Năm"`
  - `price`: `99000.00`
  - `durationDays`: `365`
  - `description`: `"Xem 100% bài học chuyên sâu, Làm tất cả bài tập quiz, Chơi game tình huống đầy đủ, Tích lũy Streak & XP xếp hạng, Hỗ trợ tư vấn trực tuyến."`

## Backend Integration
- **AuthService**: Cập nhật phương thức `register(RegisterRequest request)` để tự động tạo và lưu một thực thể `UserSubscriptionEntity` hoạt động (`status = "ACTIVE"`) liên kết với gói `VIP_TRIAL` trong vòng 7 ngày cho người dùng mới đăng ký, đồng thời đặt `user.plan` ban đầu là `UserPlan.POPULAR`.
- **PaymentService**: Cập nhật phương thức `getAllPlans()` lọc bỏ thực thể có ID `"VIP_TRIAL"` để gói học thử này không bị lộ ra ngoài API công khai của biểu giá.

## Database Integration
- Cập nhật các câu lệnh SQL trong `data/init.sql` và `data/educare_new.sql` của bảng `subscription_plans`:
  - Chèn bản ghi gói dùng thử `VIP_TRIAL` (giá 0đ, 7 ngày).
  - Cập nhật giá gói `VIP_1M` thành `49000.00`.
  - Thay gói `PREMIUM_4M` cũ thành gói năm `VIP_1Y` giá `99000.00`, thời hạn `365` ngày.
- Đảm bảo tương thích hoàn toàn với MySQL.

## Frontend Integration
- **PricingPage.tsx**:
  - Cập nhật danh sách các gói cước tĩnh dự phòng (fallback) tương ứng với giá trị cước mới (VIP 1 Tháng - 49.000đ; VIP 1 Năm - 99.000đ).
  - Thiết kế làm nổi bật gói Năm (`VIP_1Y`) bằng hiệu ứng và nhãn *"⚡ Tiết kiệm nhất - Khuyên dùng"*.
  - Thêm thông báo trên giao diện về việc hỗ trợ dùng thử 7 ngày miễn phí cho người dùng mới.
  - Cập nhật logic tính toán `isCurrentPlan` so khớp với gói `VIP_1Y`.

## Compatibility
- Các tài khoản đã đăng ký từ trước vẫn giữ nguyên thời hạn đăng ký hiện tại của họ.
- Các gói cước mới áp dụng cho mọi giao dịch thanh toán và đăng ký mới.

## Verification
- Chạy biên dịch toàn bộ mã nguồn backend: `mvn clean compile`
- Chạy kiểm thử tự động backend: `mvn test`
- Chạy build kiểm thử frontend: `npm run build`
