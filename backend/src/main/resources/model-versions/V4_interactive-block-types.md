# V4 Interactive Block Types

## Purpose
- Introduce two new highly-interactive learning methods in the lesson flow: Drag & Drop Card Sorting (`sorting`) and Active Recall 3D Flashcards (`flashcard`).
- This enhances learner engagement, recall, and retention of crucial concept definitions.

## Data Contract
- `micro_lesson_blocks.block_type` now accepts the new string values: `"sorting"` and `"flashcard"`.
- `content_json` schemas for the new block types:

### 1. Drag & Drop Card Sorting (`sorting`)
```json
{
  "instruction": "Kéo thả các hành vi sau vào đúng hộp:",
  "leftBox": {
    "title": "Lành mạnh (Green Flag)"
  },
  "rightBox": {
    "title": "Độc hại (Red Flag)"
  },
  "items": [
    { "text": "Hỏi ý kiến trước khi ôm", "correctBox": "left" },
    { "text": "Đòi mật khẩu mạng xã hội", "correctBox": "right" }
  ]
}
```

### 2. Active Recall Flashcards (`flashcard`)
```json
{
  "front": "Định nghĩa Consent là gì?",
  "back": "Consent (Sự đồng thuận) là sự đồng ý tự nguyện, tỉnh táo, rõ ràng, có thể thay đổi và được đưa ra chủ động.",
  "notes": "Lưu ý nguyên tắc F.R.I.E.S."
}
```

## Backend Integration
- No backend code changes are needed since `MicroLessonBlockEntity` maps `blockType` as a generic `String` and `contentJson` as a generic `JSON` column. The new interactive formats are fully supported out-of-the-box.

## Database Integration
- Insert statements added to [KhoaV2.sql](file:///d:/KI8SE/EXE201/GITHUB/EDUCare/data/KhoaV2.sql) to add sample sorting and flashcard interactive blocks for manual local verification.

## Frontend Integration
- Types: Update `MicroLessonBlock` `blockType` in `frontend/src/types/api.ts` to include `"sorting" | "flashcard"`.
- Components: Implement `SortingBlock` and `FlashcardBlock` sub-components in `frontend/src/pages/LessonPage.tsx`.
- Styles: Add custom 3D transition helpers in `frontend/src/index.css`.

## Compatibility
- Backward compatible. Unmodified micro lessons remain functional.

## Verification
- Validated via typescript build checks.
