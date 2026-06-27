# V15 community-features-pinning-and-announcements

## Purpose
- Hỗ trợ Ghim tin nhắn/Bài viết (Pin/Announcements): Admin có thể ghim bài viết diễn đàn lên trên cùng. Chủ phòng chat/Admin có thể ghim tin nhắn quan trọng trong phòng chat lên một thanh biểu ngữ ở đầu.
- Hashtag & Phân kênh chuyên đề: Cho phép phân loại và lọc các phòng chat dựa trên hashtag (ví dụ: #ap-luc-thi-cu, #cam-xuc-tuoi-day-thi, #giai-dap-gioi-tinh) một cách linh hoạt bằng cách trích xuất hashtag từ tên và mô tả phòng chat.

## Data Contract
- `CommunityPostEntity` / `CommunityPostResponse`:
  - `pinned`: boolean (Nullable / Default 0)
- `ChatRoomEntity` / `ChatRoomResponse`:
  - `pinnedMessageId`: Long (Nullable)
  - `pinnedMessageAuthor`: String (Nullable)
  - `pinnedMessageContent`: String (Nullable)

## Backend Integration
- `vn.educare.backend.model.CommunityPostEntity`: Thêm trường `pinned`.
- `vn.educare.backend.model.ChatRoomEntity`: Thêm trường `pinnedMessageId`.
- `vn.educare.backend.api.AuthDtos`: Cập nhật `CommunityPostResponse` và `ChatRoomResponse`.
- `vn.educare.backend.security.ChatWebSocketHandler`: Thêm phương thức `broadcastRoomPinUpdate` để gửi sự kiện `ROOM_PIN_UPDATE` dạng real-time tới tất cả người dùng trong phòng chat.
- `vn.educare.backend.service.CommunityService`:
  - Tích hợp logic sắp xếp bài đăng: Bài viết ghim luôn đứng đầu, sau đó mới tới các bài viết khác được sắp xếp theo `sortBy`.
  - Bổ sung logic ghim/bỏ ghim bài viết diễn đàn (`togglePostPin`).
  - Bổ sung logic ghim/bỏ ghim tin nhắn chat (`togglePinChatMessage`) và gửi thông báo websocket.
- `vn.educare.backend.api.CommunityController`: Expose các endpoint ghim/bỏ ghim.

## Database Integration
- Cập nhật `data/init.sql` và `data/Educare.txt`.
- SQL commands to execute:
  ```sql
  ALTER TABLE `community_posts` ADD COLUMN `pinned` tinyint(1) NOT NULL DEFAULT 0;

  ALTER TABLE `chat_rooms` ADD COLUMN `pinned_message_id` bigint(20) DEFAULT NULL;
  ALTER TABLE `chat_rooms` ADD CONSTRAINT `fk_chat_rooms_pinned_msg` FOREIGN KEY (`pinned_message_id`) REFERENCES `chat_messages` (`id`) ON DELETE SET NULL;
  ```

## Frontend Integration
- Cập nhật `frontend/src/types/api.ts` với các trường mới.
- Cập nhật `frontend/src/pages/CommunityPage.tsx` để bổ sung tính năng ghim bài đăng và hiển thị thanh công cụ Markdown.
- Cập nhật `frontend/src/pages/ChatRoomsPage.tsx` để bổ sung tính năng lọc hashtag và hiển thị tin nhắn ghim dạng banner.

## Compatibility
- Các bài đăng cũ sẽ nhận giá trị `pinned = 0` (false).
- Các phòng chat cũ sẽ nhận giá trị `pinned_message_id = NULL` (không ghim tin nhắn).
- Hoàn toàn tương thích ngược.

## Verification
- Chạy: `mvn -f backend/pom.xml test`
- Chạy: `npm --prefix frontend test`
- Chạy: `npm --prefix frontend run build`
