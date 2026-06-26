# V13 Chat Gamification

## Purpose
- Hỗ trợ người dùng thể hiện cảm xúc trên từng tin nhắn chat bằng Emoji để tăng tính tương tác.
- Tự động hiển thị Cấp bậc (User Level) và Huy hiệu (Badges) dựa trên XP, Streak, và danh hiệu để khuyến khích học sinh hoạt động tích cực.
- Cho phép gửi Sticker và ảnh GIF ngập tràn cảm xúc để phòng chat trở nên sống động, gần gũi với giới trẻ.

## Data Contract

### Tạo Model mới `ChatMessageReactionEntity`:
- `id`: Long, PK, tự tăng.
- `messageId`: Long, không được trống, khoá ngoại tham chiếu đến `chat_messages.id`.
- `userId`: String, không được trống, khoá ngoại tham chiếu đến `users.id`.
- `emoji`: String, không được trống (ví dụ: "👍", "❤️", "😂", "😢", "😮", "🙏").
- Khoá duy nhất (Unique Key) trên cặp (`messageId`, `userId`) để mỗi người chỉ thả tối đa 1 emoji trên mỗi tin nhắn.

### Cập nhật `ChatMessageResponse` DTO:
- `reactions`: List của `ChatMessageReactionResponse` chứa thông tin cảm xúc đã thả.
- `authorXp`: Integer, lưu số điểm XP của người gửi để tính cấp bậc trên UI.
- `authorStreak`: Integer, lưu streak học tập của người gửi.
- `authorRole`: String, vai trò (STUDENT/ADMIN) để hiển thị danh hiệu chuyên gia/admin.

## Backend Integration
- Tạo mới thực thể JPA `vn.educare.backend.model.ChatMessageReactionEntity`.
- Tạo mới repository `vn.educare.backend.repository.ChatMessageReactionRepository`.
- Cập nhật DTO `ChatMessageResponse` và thêm `ChatMessageReactionResponse`, `ChatMessageReactionRequest` trong `vn.educare.backend.api.AuthDtos`.
- Cập nhật `vn.educare.backend.service.CommunityService` và `vn.educare.backend.api.CommunityController` để:
  - Thêm endpoint `POST /api/community/chat-messages/{messageId}/reactions` để thả/huỷ/đổi cảm xúc.
  - Lấy thông tin reactions và XP/Streak/Role của tác giả khi tải tin nhắn.
- Cập nhật `vn.educare.backend.security.ChatWebSocketHandler` để phát sóng sự kiện `MESSAGE_REACTION` tới toàn bộ thành viên đang online trong phòng chat.

## Database Integration
- Cập nhật schema trong `data/init.sql`.
- Tạo bảng `chat_message_reactions`:
  ```sql
  CREATE TABLE `chat_message_reactions` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `message_id` bigint(20) NOT NULL,
    `user_id` varchar(36) NOT NULL,
    `emoji` varchar(50) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_chat_message_reactions_user` (`message_id`, `user_id`),
    CONSTRAINT `fk_chat_message_reactions_message` FOREIGN KEY (`message_id`) REFERENCES `chat_messages` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_chat_message_reactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  ```

## Frontend Integration
- Cập nhật các interface trong `frontend/src/types/api.ts` để đồng bộ thuộc tính `reactions`, `authorXp`, `authorStreak`, `authorRole`.
- Cập nhật `frontend/src/pages/ChatRoomsPage.tsx` để:
  - Tích hợp giao diện chọn Emoji khi di chuột/click vào tin nhắn.
  - Hiển thị danh sách cảm xúc và thống kê số lượng dưới tin nhắn.
  - Lắng nghe sự kiện reaction từ WebSocket để đồng bộ tức thì.
  - Hiển thị Huy hiệu & Cấp bậc bên cạnh tên người nhắn.
  - Thiết lập bộ chọn GIF/Sticker và cơ chế render tương ứng.

## Compatibility
- Các tin nhắn cũ chưa có cảm xúc sẽ nhận danh sách trống và hoạt động bình thường.
- Cột XP/Streak/Role kế thừa trực tiếp từ bảng `users`, không ảnh hưởng tới dữ liệu cũ.

## Verification
- Chạy thử toàn bộ các bài test:
  - `mvn -f backend/pom.xml test`
  - `npm --prefix frontend test`
