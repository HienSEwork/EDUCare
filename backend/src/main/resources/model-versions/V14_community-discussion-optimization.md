# V14 community-discussion-optimization

## Purpose
- Tối ưu hóa Luồng thảo luận (Forum/Reddit-style)
- Sắp xếp thông minh (Sorting): Mới nhất (New), Nổi bật (Hot), Cần giải đáp (Chưa có chuyên gia trả lời).
- Thảo luận dạng Chuỗi (Threaded Replies): Thêm parent_id vào CommunityReplyEntity.
- Xem trước liên kết (Link Preview): Tự động hiển thị tiêu đề, mô tả và hình ảnh thu nhỏ của liên kết khi người dùng đăng bài viết.

## Data Contract
- `CommunityPostEntity` / `CommunityPostResponse`:
  - `linkUrl`: String (Nullable)
  - `linkTitle`: String (Nullable)
  - `linkDescription`: String (Nullable)
  - `linkImage`: String (Nullable)
- `CommunityReplyEntity` / `CommunityReplyResponse`:
  - `parentId`: Long (Nullable)
  - `authorRole`: String (e.g. STUDENT, ADMIN) for reply authors to easily label expert comments.

## Backend Integration
- `vn.educare.backend.model.CommunityPostEntity`: Add `linkUrl`, `linkTitle`, `linkDescription`, `linkImage`.
- `vn.educare.backend.model.CommunityReplyEntity`: Add `parentId`.
- `vn.educare.backend.service.LinkPreviewService`: Add new service to extract metadata using JSoup.
- `vn.educare.backend.service.CommunityService`:
  - Map new fields from request to entity.
  - Load all replies for a post, fetch reply authors' roles, identify unanswered posts (no ADMIN replies), and sort by:
    - `new`: Order posts by `createdAt` desc.
    - `hot`: Order posts by `likesCount` + `replies.size()` desc, then `createdAt` desc.
    - `unanswered`: Filter posts where no replies are by an ADMIN user, order by `createdAt` desc.
- `vn.educare.backend.api.CommunityController`:
  - Add optional `sortBy` to `/api/community/posts` endpoint.
  - Add `/api/community/link-preview` helper endpoint.
- `vn.educare.backend.api.AuthDtos`: Add new request/response fields.

## Database Integration
- Update `data/init.sql` and `data/Educare.txt`.
- SQL commands to execute:
  ```sql
  ALTER TABLE `community_posts` 
    ADD COLUMN `link_url` VARCHAR(512) DEFAULT NULL,
    ADD COLUMN `link_title` VARCHAR(255) DEFAULT NULL,
    ADD COLUMN `link_description` VARCHAR(512) DEFAULT NULL,
    ADD COLUMN `link_image` VARCHAR(512) DEFAULT NULL;

  ALTER TABLE `community_replies` 
    ADD COLUMN `parent_id` BIGINT(20) DEFAULT NULL,
    ADD KEY `fk_community_reply_parent` (`parent_id`),
    ADD CONSTRAINT `fk_community_reply_parent` FOREIGN KEY (`parent_id`) REFERENCES `community_replies` (`id`) ON DELETE CASCADE;
  ```

## Frontend Integration
- Update `frontend/src/types/api.ts` with new interface fields.
- Update `frontend/src/pages/CommunityPage.tsx` to handle nested replies, sort selectors, and url detection preview cards.

## Compatibility
- Existing posts will have null link fields.
- Existing replies will have null `parentId`.
- Fully backward compatible.

## Verification
- Run: `mvn -f backend/pom.xml test`
- Run: `npm --prefix frontend test`
- Run: `npm --prefix frontend run build`
