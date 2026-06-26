# V17 Community Forum Redesign

## Purpose
- Tái cấu trúc tính năng Thảo luận (Community) thành Diễn đàn phân cấp với các Chủ đề lớn (Categories), các bài đăng/Chủ đề nhỏ (Posts/Threads) hỗ trợ tiêu đề và đính kèm hình ảnh (Cloudinary), cùng hệ thống Bình luận (Replies) hỗ trợ gửi ảnh.

## Data Contract
### `CommunityCategory`
- `id`: number (primary key)
- `name`: string (tên danh mục)
- `slug`: string (đường dẫn chuyên mục duy nhất)
- `description`: string (mô tả ngắn về chuyên mục)
- `icon`: string (tên icon hiển thị)
- `colorTheme`: string (tông màu hiển thị)

### `CommunityPost`
- `id`: number (primary key)
- `categoryId`: number (id chuyên mục liên kết, nullable)
- `title`: string (tiêu đề bài viết, nullable)
- `imageUrl`: string (đường dẫn hình ảnh đính kèm từ Cloudinary, nullable)

### `CommunityReply`
- `imageUrl`: string (đường dẫn hình ảnh đính kèm bình luận từ Cloudinary, nullable)

## Backend Integration
- **Entities**:
  - `CommunityCategoryEntity` (mới): Ánh xạ thực thể danh mục thảo luận.
  - `CommunityPostEntity` (cập nhật): Thêm `categoryId`, `title`, `imageUrl`.
  - `CommunityReplyEntity` (cập nhật): Thêm `imageUrl`.
- **Repositories**:
  - `CommunityCategoryRepository` (mới).
  - `CommunityPostRepository` (cập nhật): Thêm phương thức truy vấn bài đăng theo Category ID.
- **DTOs**:
  - `CommunityCategoryResponse` (mới).
  - `CommunityPostRequest`, `CommunityPostResponse`, `CommunityReplyRequest`, `CommunityReplyResponse` (cập nhật).
- **Service**:
  - `CommunityService` (cập nhật): Hỗ trợ lấy categories, lọc posts theo category, lưu thông tin categoryId, title, và các image đính kèm.
- **Controller**:
  - `CommunityController` (cập nhật): Thêm `/community/categories` endpoint và cập nhật `/community/posts` hỗ trợ lọc theo category.

## Database Integration
- Bảng mới: `community_categories` với 5 dòng seed mặc định.
- Cập nhật bảng `community_posts` (cột `category_id`, `title`, `image_url` và khóa ngoại `fk_community_posts_category`).
- Cập nhật bảng `community_replies` (cột `image_url`).

## Frontend Integration
- **Types**: `api.ts` cập nhật kiểu `CommunityCategory`, `CommunityPost` và `CommunityReply`.
- **Pages**: `CommunityPage.tsx` được thiết kế lại hoàn toàn giao diện phân cấp (xem danh mục, xem danh sách bài viết theo chuyên mục, xem chi tiết bài đăng và gửi bình luận đính kèm hình ảnh).

## Compatibility
- Cột `category_id` trong `community_posts` cho phép NULL và được gán mặc định về Category 1 (`Cảm xúc & Tâm lý`) cho toàn bộ bài đăng cũ nhằm tương thích ngược và bảo toàn dữ liệu.

## Verification
- Xác thực bằng cách chạy biên dịch backend (`mvn compile`) và frontend (`npm run build`).
- Chạy toàn bộ các test suite kiểm thử (`mvn test` và `npm run test`).
