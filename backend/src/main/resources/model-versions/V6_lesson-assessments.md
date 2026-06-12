# V6 Lesson Assessments

## Purpose
- Introduce 3 new interactive block types (`scenario-choice`, `matching`, and `fill-blank`) for end-of-lesson assessment games.
- Enable rich gamified learning interactions within the lesson detail page, promoting active recall and spaced repetition.

## Data Contract
- `micro_lesson_blocks.block_type` accepts:
  - `"scenario-choice"`: Choose-Your-Own-Adventure game.
  - `"matching"`: Association/Matching card game.
  - `"fill-blank"`: Sentence completion game.
- `content_json` structures:

### 1. Choose-Your-Own-Adventure (`scenario-choice`)
```json
{
  "title": "Thử thách ứng phó tin nhắn lạ",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn nhận được tin nhắn từ tài khoản lạ...",
      "choices": [
        { "text": "Cung cấp số điện thoại ngay", "nextNode": "fail_phone" },
        { "text": "Hỏi chị gái trước để xác minh", "nextNode": "step2" }
      ]
    },
    "step2": {
      "text": "Chị gái bảo không quen ai...",
      "choices": [
        { "text": "Chặn tài khoản lạ", "nextNode": "success_block" }
      ]
    },
    "success_block": {
      "text": "🎉 Chính xác! Bạn đã xử lý an toàn.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_phone": {
      "text": "❌ Bạn đã lộ thông tin cá nhân. Hãy thử lại!",
      "isEnd": true,
      "isSuccess": false
    }
  }
}
```

### 2. Matching Card Game (`matching`)
```json
{
  "instruction": "Ghép các khái niệm sau với định nghĩa đúng:",
  "pairs": [
    { "left": "Ranh giới vật lý", "right": "Quyết định ai được chạm vào cơ thể bạn." },
    { "left": "Ranh giới số", "right": "Quy tắc chia sẻ mật khẩu." }
  ]
}
```

### 3. Fill-in-the-blank (`fill-blank`)
```json
{
  "instruction": "Chọn từ thích hợp để điền vào chỗ trống:",
  "sentence": "Sự đồng thuận phải được đưa ra một cách [blank1] và [blank2].",
  "blanks": {
    "blank1": { "correct": "tự nguyện", "placeholder": "..." },
    "blank2": { "correct": "chủ động", "placeholder": "..." }
  },
  "words": ["tự nguyện", "chủ động", "ép buộc", "im lặng"]
}
```

## Backend Integration
- No database table schema changes required. The `micro_lesson_blocks` table maps `block_type` as a string and `content_json` as a generic JSON column, which inherently supports the new types out-of-the-box.
- Content controllers and services serve this content dynamically.

## Database Integration
- Create sample records in database seeds to verify interaction flow.

## Frontend Integration
- Type updates in `frontend/src/types/api.ts`.
- Implementation of `<ScenarioChoiceBlock />`, `<MatchingBlock />`, and `<FillBlankBlock />` in `frontend/src/pages/LessonPage.tsx`.
- Introduction of a 3-Heart (Lives) state indicator for interactive test blocks.

## Compatibility
- Fully backward compatible. Existing lesson data and blocks are unaffected.

## Verification
- Checked frontend Typescript compilation and backend unit tests.
