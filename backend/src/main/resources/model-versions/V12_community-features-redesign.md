# V12 Community Features Redesign

## Purpose
- Cải thiện tính an toàn của diễn đàn bằng cách thêm tính năng báo cáo vi phạm bài viết/bình luận.
- Hỗ trợ học sinh tự tạo phòng chat nhóm riêng tư và mời người dùng khác tham gia bằng username.
- Cho phép đội ngũ admin/chuyên gia quản lý và trực tiếp trả lời các câu hỏi ẩn danh từ học sinh.

## Data Contract

### Bổ sung trường trong Model `ChatRoomEntity`:
- `ownerId`: String, Nullable (lưu trữ ID của người dùng tạo phòng chat; NULL đối với các phòng chat hệ thống như `crew-bot`).

### Tạo Model mới `ChatRoomMemberEntity`:
- `id`: Long, PK, tự tăng.
- `roomId`: Long, không được trống, khoá ngoại tham chiếu đến `chat_rooms.id`.
- `userId`: String, không được trống, khoá ngoại tham chiếu đến `users.id`.
- `joinedAt`: Instant, mặc định thời gian hiện tại.

### Tạo Model mới `CommunityReportEntity`:
- `id`: Long, PK, tự tăng.
- `reporterId`: String, không được trống, khoá ngoại tham chiếu đến `users.id`.
- `postId`: Long, Nullable, khoá ngoại tham chiếu đến `community_posts.id`.
- `replyId`: Long, Nullable, khoá ngoại tham chiếu đến `community_replies.id`.
- `reason`: String, không được trống.
- `status`: String, mặc định là 'PENDING' (các giá trị hợp lệ: 'PENDING', 'RESOLVED', 'DISMISSED').
- `createdAt`: Instant, mặc định thời gian hiện tại.

## Backend Integration
- Cập nhật `vn.educare.backend.model.ChatRoomEntity` để thêm cột `ownerId`.
- Tạo mới `vn.educare.backend.model.ChatRoomMemberEntity` và `vn.educare.backend.model.CommunityReportEntity`.
- Tạo mới các JPA Repositories: `ChatRoomMemberRepository`, `CommunityReportRepository`.
- Cập nhật `vn.educare.backend.api.AuthDtos` để thêm các request/response cho DTO tương ứng.
- Cập nhật `vn.educare.backend.service.CommunityService` và `vn.educare.backend.api.CommunityController` để xử lý logic API:
  - Lọc phòng chat dựa trên quyền thành viên.
  - Xử lý tạo phòng, mời thành viên và gửi báo cáo vi phạm.
  - Quản lý câu hỏi ẩn danh và cập nhật trạng thái trả lời của chuyên gia.

## Database Integration
- Cập nhật schema trong `data/init.sql`.
- Các câu lệnh SQL thêm vào:
  ```sql
  ALTER TABLE `chat_rooms` ADD COLUMN `owner_id` VARCHAR(36) DEFAULT NULL;
  
  CREATE TABLE `chat_room_members` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `room_id` bigint(20) NOT NULL,
    `user_id` varchar(36) NOT NULL,
    `joined_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`room_id`) REFERENCES `chat_rooms`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE `community_reports` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `reporter_id` varchar(36) NOT NULL,
    `post_id` bigint(20) DEFAULT NULL,
    `reply_id` bigint(20) DEFAULT NULL,
    `reason` varchar(255) NOT NULL,
    `status` varchar(50) NOT NULL DEFAULT 'PENDING',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`post_id`) REFERENCES `community_posts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`reply_id`) REFERENCES `community_replies`(`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  ```

## Frontend Integration
- Cập nhật file `frontend/src/types/api.ts` để đồng bộ interface `ChatRoom` (thêm `ownerId`) và thêm các interface `CommunityReport`, `AnonymousQuestion`.
- Thêm tính năng báo cáo vi phạm bài đăng/bình luận vào `frontend/src/pages/CommunityPage.tsx`.
- Thêm tính năng tạo phòng chat & mời thành viên vào `frontend/src/pages/ChatRoomsPage.tsx`.
- Thêm giao diện duyệt báo cáo và trả lời câu hỏi ẩn danh vào `frontend/src/pages/AdminDashboardPage.tsx`.

## Compatibility
- Các phòng chat cũ không có `owner_id` sẽ nhận giá trị `NULL` và hoạt động như phòng chat công cộng bình thường.
- Cơ chế báo cáo không ảnh hưởng tới dữ liệu cũ. Các câu hỏi ẩn danh cũ đã có `answer` vẫn hiển thị bình thường.

## Verification
- Chạy thử toàn bộ các bài test:
  - `mvn -f backend/pom.xml test`
  - `npm --prefix frontend test`
