CREATE TABLE lesson_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    lesson_id BIGINT NOT NULL,

    source_name VARCHAR(255) NOT NULL,

    source_url TEXT NOT NULL,

    source_type VARCHAR(50),

    FOREIGN KEY (lesson_id)
        REFERENCES lessons(id)
        ON DELETE CASCADE
);

-- Thêm dữ liệu nguồn tham khảo (sources) cho các bài học
INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(10, 'Scarleteen - Quickies: Sexual Consent Basics', 'https://www.scarleteen.com/read/sex-sexuality/quickies-sexual-consent-basics', 'website'),
(10, 'Scarleteen - Age of Consent: What is it, exactly?', 'https://www.scarleteen.com/read/culture/age-consent-what-exactly', 'website'),
(11, 'Scarleteen - I Know Consent is Awesome, but Rejection is Not', 'https://www.scarleteen.com/read/sex-sexuality/i-know-consent-awesome-rejection-not', 'website');

-- Thêm dữ liệu block tương tác (sorting & flashcard) mẫu vào micro_lessons của Lesson 10
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index)
SELECT id, 'sorting', '{
  "instruction": "Hãy phân loại các hành vi sau đây vào hộp phù hợp:",
  "leftBox": {
    "title": "Lành mạnh (Green Flag)"
  },
  "rightBox": {
    "title": "Độc hại (Red Flag)"
  },
  "items": [
    { "text": "Hỏi ý kiến đối phương trước khi ôm hoặc đụng chạm", "correctBox": "left" },
    { "text": "Yêu cầu chia sẻ mật khẩu mạng xã hội để kiểm soát", "correctBox": "right" },
    { "text": "Tôn trọng khi đối phương nói không muốn tiếp tục", "correctBox": "left" },
    { "text": "Tự ý xem tin nhắn điện thoại khi chưa được sự đồng ý", "correctBox": "right" }
  ]
}', 100
FROM micro_lessons 
WHERE lesson_id = 10 
LIMIT 1;

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index)
SELECT id, 'flashcard', '{
  "front": "Quy tắc F.R.I.E.S trong Consent viết tắt của những từ nào?",
  "back": "F - Freely given (Tự nguyện), R - Reversible (Có thể thay đổi), I - Informed (Đầy đủ thông tin), E - Enthusiastic (Hứng thú), S - Specific (Cụ thể).",
  "notes": "Đây là 5 tiêu chí bắt buộc để một sự đồng thuận được coi là hợp lệ."
}', 101
FROM micro_lessons 
WHERE lesson_id = 10 
LIMIT 1;