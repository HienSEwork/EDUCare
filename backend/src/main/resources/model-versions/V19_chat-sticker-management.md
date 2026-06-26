# V19 chat-sticker-management

## Purpose
- Shift Stickers and GIFs from a static compilation file to a database-driven table managed by administrative CRUD operations.
- Admin can dynamically create, edit, or delete chat stickers/GIFs directly from the dashboard.

## Data Contract

### Bảng `chat_stickers`
- `id` (bigint AUTO_INCREMENT PRIMARY KEY)
- `name` (varchar(120) NOT NULL): Tên hiển thị/mô tả của nhãn dán.
- `url` (varchar(512) NOT NULL): Link ảnh tĩnh (Sticker) hoặc ảnh động (GIF) lưu trên Cloudinary/CDN.
- `type` (varchar(20) NOT NULL): Phân loại `'STICKER'` hoặc `'GIF'`.
- `category` (varchar(50) NOT NULL): Nhóm chủ đề (`'study'`, `'motivation'`, `'emotion'`, `'funny'`, `'congrats'`).
- `keywords` (varchar(500) DEFAULT NULL): Chuỗi từ khóa hỗ trợ tìm kiếm nội bộ, cách nhau bằng dấu phẩy.
- `created_at` (timestamp DEFAULT current_timestamp)

## Backend Integration
- **`ChatStickerEntity`**: Model JPA ánh xạ bảng `chat_stickers`.
- **`ChatStickerRepository`**: Repository Spring Data JPA.
- **`AuthDtos`**:
  - `ChatStickerResponse` DTO record.
  - `ChatStickerRequest` DTO record for creation/updates.
- **`CommunityService`**:
  - `getStickers()`: Trả về danh sách tất cả các sticker/GIF.
  - `saveSticker(Long id, ChatStickerRequest request)`: Thêm mới hoặc cập nhật thông tin sticker.
  - `deleteSticker(Long id)`: Xóa sticker theo ID.
- **`CommunityController`**:
  - `GET /api/community/stickers` (Public GET).
- **`AdminContentController`**:
  - `POST /api/admin/stickers` (Admin required).
  - `PUT /api/admin/stickers/{id}` (Admin required).
  - `DELETE /api/admin/stickers/{id}` (Admin required).

## Database Integration
- Table definition and initial data seeds mapped to `data/init.sql`.

## Frontend Integration
- Update frontend types in `frontend/src/types/api.ts`.
- Fetch stickers from the database dynamically in `ChatRoomsPage.tsx` instead of static import.
- Build a CRUD admin dashboard management section for Stickers and GIFs in `AdminDashboardPage.tsx`.

## Compatibility
- Non-breaking change. Fully backwards-compatible. New database installs will include the seeded tables.

## Verification
- Run backend unit tests: `mvn -f backend/pom.xml test`.
- Run frontend build: `npm --prefix frontend run build`.
