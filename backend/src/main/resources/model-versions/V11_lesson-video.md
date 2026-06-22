# V11 Lesson Video Integration

## Purpose
- Tích hợp tính năng phát video bài học dạng ngắn (teaser) ngoài thư viện và bài học đầy đủ (full video) bên trong trang chi tiết bài học.
- Hỗ trợ lưu trữ các mã nhận diện (Youtube Video ID) cho từng bài học.

## Data Contract
Bổ sung các trường thông tin video vào đối tượng `Lesson`:
- `teaserVideoId`: String, Nullable, lưu mã định danh video xem thử (teaser) trên Youtube (ví dụ: `abc123teaser`).
- `fullVideoId`: String, Nullable, lưu mã định danh video bài giảng đầy đủ trên Youtube (ví dụ: `xyz789full`).

## Backend Integration
- Cập nhật `vn.educare.backend.model.LessonEntity` để thêm các trường `teaserVideoId` và `fullVideoId`.
- Cập nhật record DTO `LessonResponse` trong `vn.educare.backend.api.AuthDtos`.
- Cập nhật `vn.educare.backend.service.ContentService` ở hàm `toLessonResponse` để ánh xạ dữ liệu.

## Database Integration
- Cập nhật cấu trúc bảng `lessons` bằng cách thêm hai cột `teaser_video_id` (VARCHAR) và `full_video_id` (VARCHAR).
- SQL files cập nhật:
  - `data/init.sql`
  - `data/CourseSQL/seed_course_consent.sql`

## Frontend Integration
- Cập nhật types `Lesson` trong `frontend/src/types/api.ts` để khai báo thêm hai trường `teaserVideoId` và `fullVideoId`.
- Xây dựng trang `/videos` tương ứng component `VideoGalleryPage.tsx` hiển thị danh sách video teaser, có modal xem video và CTA pop-up dẫn vào bài học chính thức.
- Tích hợp phát video full ở đầu trang chi tiết bài học [LessonPage.tsx](file:///d:/KI8SE/EXE201/GITHUB/EDUCare/frontend/src/pages/LessonPage.tsx).

## Compatibility
- Các bài học cũ chưa có video sẽ nhận giá trị `NULL` cho các trường video và giao diện sẽ ẩn trình phát video đi, không gây lỗi tương thích.
- Thực hiện thêm cột thông qua `ALTER TABLE` trong `init.sql` và seed dữ liệu thử nghiệm cho bài học đầu tiên.

## Verification
- Lệnh build backend và frontend thành công:
  - `mvn -f backend/pom.xml compile`
  - `npm --prefix frontend run build`
