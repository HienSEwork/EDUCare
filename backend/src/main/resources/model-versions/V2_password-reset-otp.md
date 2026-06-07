# V2 password-reset-otp

## Purpose
- Chuyển cơ chế xác nhận quên mật khẩu từ đường link token dài sang mã OTP 6 chữ số gửi qua email.
- Giữ riêng thông tin Gmail SMTP ra cấu hình để không hardcode tài khoản/mật khẩu trong mã nguồn.

## Data Contract
- `password_reset_tokens` vẫn dùng chung bảng hiện tại.
- Trường `token` giờ chứa mã OTP 6 chữ số thay vì UUID link token.
- `created_at` và `expires_at` vẫn giữ để kiểm soát thời hạn mã.

## Backend Integration
- `MailService.sendResetToken(...)` được đổi tên và nội dung thành `sendResetOtp(...)`, gửi email HTML/PlainText với mã OTP đậm.
- `AuthService.requestPasswordReset(...)` sinh mã OTP 6 chữ số từ `SecureRandom`, lưu vào DB với thời hạn 15 phút.
- `AuthService.resetPassword(...)` vẫn dùng cùng endpoint `/api/auth/reset-password`, nhưng giờ chấp nhận mã OTP thay vì token link.
- Không thêm thư viện mới; vẫn dùng Spring Boot JavaMail (`spring-boot-starter-mail`).

## Database Integration
- Không cần thay đổi schema SQL hiện tại.
- Bảng `password_reset_tokens` đã tồn tại và tiếp tục dùng cho mã OTP.
- Nếu cần, có thể thêm chỉ mục hoặc làm sạch dữ liệu cũ theo nhu cầu.

## Frontend Integration
- Frontend vẫn gửi email trong luồng quên mật khẩu tới endpoint `/api/auth/forgot-password`.
- Phần reset mật khẩu hiện nên yêu cầu người dùng nhập mã OTP 6 chữ số thay vì truy cập link.

## Compatibility
- Đổi giá trị API `requestPasswordReset` thông điệp trả về để nói "mã" thay vì "link".
- Với profile `dev`, response vẫn trả lại giá trị OTP để dễ kiểm tra nội bộ.

## Verification
- Chạy `mvn -f backend test` để kiểm tra biên dịch và unit test backend.
- Kiểm tra cấu hình Gmail SMTP bằng cách khởi động backend với profile `smtp` và biến môi trường:
  - `SPRING_MAIL_USERNAME`
  - `SPRING_MAIL_PASSWORD`
