# V1 password-reset-token

## Purpose
- Thêm luồng quên mật khẩu cho module Authentication mà không sửa sâu vào hệ thống User hiện tại.
- Lưu trữ mã reset token một cách riêng biệt để bảo mật và hỗ trợ reset mật khẩu an toàn.

## Data Contract
- `id`: bigint, primary key, tự tăng.
- `token`: varchar(255), không null, unique.
- `user_id`: varchar(36), không null, khóa ngoại tới bảng `users(id)`.
- `expires_at`: timestamp, không null, thời hạn token.
- `created_at`: timestamp, không null, mặc định current_timestamp.

## Backend Integration
- Entity: `backend/src/main/java/vn/educare/backend/model/PasswordResetTokenEntity.java`.
- Repository: `backend/src/main/java/vn/educare/backend/repository/PasswordResetTokenRepository.java`.
- Service: cập nhật `AuthService` để sinh token, lưu token, kiểm tra hạn, và đổi mật khẩu.
- Controller: cập nhật `AuthController` với endpoint `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/logout`.
- Validation: dùng `@Email` và `@NotBlank` cho yêu cầu quên mật khẩu và reset mật khẩu.

## Database Integration
- Thêm bảng `password_reset_tokens` trong `data/init.sql`.
- Bảng mới giữ nguyên cấu trúc hiện tại của `users` và không thay đổi bảng cũ.
- Bảng mới thiết kế với khóa ngoại `user_id` và xóa token khi user bị xóa.

## Frontend Integration
- Thêm trang `frontend/src/pages/ForgotPasswordPage.tsx`.
- Thêm trang `frontend/src/pages/ResetPasswordPage.tsx`.
- Cập nhật `frontend/src/App.tsx` để đăng ký route `/forgot-password` và `/reset-password`.
- Cập nhật `frontend/src/pages/LoginPage.tsx` để thêm link quên mật khẩu.
- Cập nhật nội dung `frontend/src/content/uiCopy.ts` và kiểu `frontend/src/types/api.ts`.

## Compatibility
- Không thay đổi tên bảng hoặc kiểu dữ liệu cũ.
- Không xóa cột cũ.
- Các endpoint cũ vẫn hoạt động bình thường.

## Verification
- Chạy `mvn -f backend/pom.xml test -q` để kiểm tra backend.
- Chạy `npm --prefix frontend run build` để xác thực frontend.
