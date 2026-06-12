-- =========================================================================
-- SEED DATA FOR COURSE: Tự Tin Lớn Lên, Tự Chủ Khám Phá
-- Maps to schemas in init.sql: courses, lessons, micro_lessons,
-- micro_lesson_blocks, and lesson_sources.
-- =========================================================================

SET NAMES utf8mb4;
USE educare;

-- 1. Thêm Khóa học mới
INSERT INTO courses (title, description, thumbnail, color_theme, course_order, category_id)
VALUES (
    'Tự Tin Lớn Lên, Tự Chủ Khám Phá',
    'Khóa học về sự đồng thuận, ranh giới cá nhân và phát triển lành mạnh dành cho tuổi teen.',
    'consent-course.png',
    '#4361ee',
    10,
    2
);
SET @course_id = LAST_INSERT_ID();

-- =========================================================================
-- BÀI HỌC 1: Luật đi đường - Đồng thuận là gì? (lesson_order = 9)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'luat-di-duong-dong-thuan-la-gi',
    'Luật đi đường - Đồng thuận là gì?',
    'Tìm hiểu khái niệm đèn xanh, đèn vàng, đèn đỏ trong giao tiếp tình cảm và quy tắc đồng thuận F.R.I.E.S.',
    'Bài học giúp bạn nắm bắt khái niệm về sự đồng thuận trong tình cảm, quy tắc F.R.I.E.S và kỹ năng check-in.',
    9,
    true,
    100,
    10
);
SET @lesson1_id = LAST_INSERT_ID();

-- Nguồn tham khảo cho Bài học 1
INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson1_id, 'Scarleteen - Quickies: Sexual Consent Basics', 'https://www.scarleteen.com/read/sex-sexuality/quickies-sexual-consent-basics', 'website'),
(@lesson1_id, 'Scarleteen - Driver''s Ed for the Sexual Superhighway: Navigating Consent', 'https://www.scarleteen.com/read/sex-sexuality/drivers-ed-sexual-superhighway-navigating-consent', 'website'),
(@lesson1_id, 'Scarleteen - Our Philosophy', 'https://www.scarleteen.com/about/our-philosophy', 'website');

-- --- Micro Lesson 1.1: Luật đi đường tình cảm ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Luật đi đường tình cảm', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ lái xe băng qua giao lộ mà không thèm nhìn đèn tín hiệu?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Khi đi trên đường, tụi mình cần đèn xanh đèn đỏ để không đâm vào nhau.", "Trong tình cảm cũng vậy. Cơ thể và cảm xúc của mỗi người đều có những tín hiệu riêng.", "Muốn chạm vào ai đó hay tiến xa hơn, bạn bắt buộc phải quan sát và hỏi ý kiến đối phương."]}', 2),
(@ml_id, 'scenario', '{"title": "Nhìn tín hiệu cơ thể", "body": "Quân định bá vai Vy khi hai đứa đang ngồi học nhóm. Vy hơi rụt vai lại và mắt dán vào trang sách. Quân phân vân: Vy đang ngại hay Vy không thích mình chạm vào nhỉ?"}', 3),
(@ml_id, 'interaction', '{"question": "Bạn khuyên Quân nên làm gì?", "choices": [{"text": "Cứ bá vai tiếp, bạn bè thân thiết ngại gì.", "correct": false, "emoji": "🛑"}, {"text": "Dừng lại, hỏi nhẹ nhàng: Tớ để tay lên vai cậu được không?", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy thoải mái khi người khác đột ngột đụng chạm mà không hỏi trước?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Lái xe an toàn cần nhìn biển báo. Muốn chạm vào người khác cần hỏi trước."]}', 6);

-- --- Micro Lesson 1.2: Nhận diện một lời "Đồng ý" xịn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Nhận diện một lời "Đồng ý" xịn', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Một lời đồng ý gượng ép có thực sự mang lại niềm vui?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đèn xanh chỉ bật khi có sự đồng thuận rõ ràng, tự nguyện từ hai phía.", "Quy tắc F.R.I.E.S bao gồm: Tự nguyện (Freely given), Linh hoạt (Reversible), Đầy đủ thông tin (Informed), Hào hứng (Enthusiastic) và Cụ thể (Specific)."]}', 2),
(@ml_id, 'scenario', '{"title": "Đồng ý vì nể", "body": "Nam rủ Linh vào góc tối công viên nói chuyện. Linh ngập ngừng nói: Cũng được... nếu cậu muốn. Nhưng tay Linh bấu chặt vào vạt áo, mắt nhìn xuống đất."}', 3),
(@ml_id, 'interaction', '{"question": "Lời đồng ý của Linh có phải là đồng thuận xịn không?", "choices": [{"text": "Có chứ, bạn ấy đã gật đầu rồi mà.", "correct": false, "emoji": "🚩"}, {"text": "Không. Linh đồng ý vì nể Nam và đang lo lắng, không hề hào hứng.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng đồng ý làm điều gì đó chỉ vì đối phương nài nỉ quá nhiều chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chỉ có tiếng Có hào hứng và tự nguyện mới là đèn xanh để đi tiếp."]}', 6);

-- --- Micro Lesson 1.3: Vì sao im lặng không phải là đồng ý? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Vì sao im lặng không phải là đồng ý?', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao đôi khi tụi mình muốn nói Không nhưng họng lại nghẹn đắng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nỗi sợ bị ghét, sợ làm hỏng bầu không khí khiến tụi mình chọn im lặng hoặc cười trừ.", "Không phản đối không có nghĩa là đồng ý.", "Khi thấy đối phương im lặng hoặc cứng đờ người (Đèn Vàng), bạn phải dừng lại và hỏi han."]}', 2),
(@ml_id, 'scenario', '{"title": "Áp lực từ bạn bè", "body": "Trong một buổi tiệc sinh nhật, nhóm bạn ép Minh uống thêm một ly nước ngọt pha cồn. Minh không thích nhưng chỉ im lặng cúi đầu và cười gượng."}', 3),
(@ml_id, 'interaction', '{"question": "Nếu bạn là bạn thân ngồi cạnh Minh, bạn sẽ làm gì?", "choices": [{"text": "Hùa theo nhóm bạn: Cơ hội vui mà Minh, uống đi sợ gì!", "correct": false, "emoji": "🚩"}, {"text": "Giúp Minh từ chối: Thôi Minh không uống được đâu, tụi mình uống nước ngọt đi.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng im lặng chấp nhận một điều mình ghét vì sợ người khác đánh giá chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Im lặng không phải là đồng ý. Đó có thể là lúc đối phương đang cần bạn dừng lại."]}', 6);

-- --- Micro Lesson 1.4: Từ "Ok" đến "Không Ok" trong chớp mắt ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Từ "Ok" đến "Không Ok" trong chớp mắt', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đồng ý lúc trước thì lúc sau có được đổi ý không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đồng thuận có tính linh hoạt (Reversible). Bạn có quyền đổi ý bất cứ lúc nào.", "Giây trước thấy thích, giây sau thấy không thoải mái là chuyện hết sức bình thường.", "Đối phương có nghĩa vụ phải tôn trọng khi bạn nói Dừng lại."]}', 2),
(@ml_id, 'scenario', '{"title": "Quyền đổi ý giữa chừng", "body": "Trang đồng ý để Quân ôm mình. Nhưng khi Quân ôm hơi chặt và định thơm má, Trang thấy ngột ngạt và đẩy nhẹ Quân ra: Khoan đã Quân, tớ thấy hơi nhanh."}', 3),
(@ml_id, 'interaction', '{"question": "Phản ứng nào của Quân là Green Flag xịn?", "choices": [{"text": "Giận dỗi: Ơ hay, nãy đồng ý rồi mà giờ lại thế?", "correct": false, "emoji": "🙁"}, {"text": "Dừng lại ngay, nới lỏng tay: Tớ xin lỗi, tớ làm cậu khó chịu hả?", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có dám đổi ý khi đang làm một việc gì đó với bạn bè không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn luôn có quyền quay xe. Cơ thể và ranh giới của bạn là của riêng bạn."]}', 6);

-- --- Micro Lesson 1.5: Cách check-in siêu tự nhiên ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Cách check-in siêu tự nhiên', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để xin phép người ta mà không khiến bầu không khí bị sượng trân?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hỏi ý kiến không làm giảm đi sự lãng mạn.", "Hỏi han tinh tế thể hiện bạn quan tâm chân thành đến cảm giác của người ta.", "Hãy dùng những câu hỏi ngắn gọn, tự nhiên và ngọt ngào."]}', 2),
(@ml_id, 'scenario', '{"title": "Ý định nắm tay", "body": "Duy muốn nắm tay Linh khi hai đứa đang đi dạo công viên. Thay vì tự ý chụp lấy, Duy nhìn Linh và mỉm cười nhẹ."}', 3),
(@ml_id, 'interaction', '{"question": "Giúp Duy chọn câu hỏi mượt nhất nhé:", "choices": [{"text": "Đưa tay đây tớ nắm xem nào.", "correct": false, "emoji": "😐"}, {"text": "Tớ nắm tay cậu được không?", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thích được hỏi ý kiến trước hay thích đối phương tự ý hành động hơn?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hỏi trước khi chạm thể hiện sự tôn trọng, đó là nền tảng của sự lãng mạn."]}', 6);

-- --- Micro Lesson 1.6: Tình dục không ép buộc mới vui! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Tình dục không ép buộc mới vui!', 6);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tình yêu có thực sự hạnh phúc nếu thiếu đi sự tự nguyện?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mối quan hệ lành mạnh mang lại niềm vui, tự do và sự tin cậy.", "Mọi hành vi ép buộc, nài nỉ hay thao túng tâm lý đều làm tổn thương tình cảm.", "Tình yêu lành mạnh không bao giờ đi kèm sự lo sợ hay cảm giác có lỗi."]}', 2),
(@ml_id, 'scenario', '{"title": "Áp lực gửi ảnh riêng tư", "body": "Cường nhắn tin năn nỉ An gửi ảnh cá nhân riêng tư cho mình, nói rằng yêu nhau thì phải tin tưởng nhau tuyệt đối. An lo sợ nếu không gửi Cường sẽ giận."}', 3),
(@ml_id, 'interaction', '{"question": "Bạn khuyên An nên nhắn gì cho Cường?", "choices": [{"text": "Thôi được rồi, gửi một tấm thôi nha, cậu đừng cho ai xem.", "correct": false, "emoji": "🛑"}, {"text": "Tớ không thoải mái với việc này. Mong cậu tôn trọng ranh giới của tớ.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang cố làm hài lòng người khác bằng cách bỏ qua cảm xúc của chính mình?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Yêu thương đi liền với sự tôn trọng, không phải sự ép buộc."]}', 6);

-- --- Micro Lesson 1.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Luật đi đường - Đồng thuận là gì?''! Bạn có 3 mạng để vượt qua 5 thử thách cam go. Hãy sẵn sàng nhé."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Hỏi xin sự đồng thuận",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn đang xem phim tại rạp cùng bạn gái mới quen. Phim đến đoạn cao trào, bạn muốn đan tay vào tay bạn ấy. Bạn ấy đang tập trung cao độ vào màn hình, hai tay ôm hộp bắp rang bơ đặt trên đùi.",
      "choices": [
        { "text": "Cứ luồn tay vào hộp bắp để chạm tay bạn ấy rồi nắm lấy, vừa tự nhiên vừa lãng mạn.", "nextNode": "fail_surprise" },
        { "text": "Nói khẽ bên tai: ''Tớ nắm tay cậu được không?''", "nextNode": "step2" },
        { "text": "Chờ phim hết rồi đột ngột nắm tay khi đang đi ra.", "nextNode": "fail_passive" }
      ]
    },
    "step2": {
      "text": "Bạn ấy đỏ mặt, mỉm cười nhẹ rồi nói: ''Nắm tay thì được nè, nhưng đừng đan ngón tay chặt quá nha, tay tớ đang bị ra mồ hôi và hơi nóng''.",
      "choices": [
        { "text": "Nghe vậy thấy cụt hứng, buông tay ra và quay đi chỗ khác: ''Thôi thế thì thôi vậy''.", "nextNode": "fail_anger" },
        { "text": "Cười nhẹ: ''Ok cậu nè!'', nắm tay nhẹ nhàng, tôn trọng yêu cầu cụ thể của bạn ấy.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Một lát sau, bạn ấy thấy mỏi tay và khẽ rút tay ra để cầm ly nước ngọt.",
      "choices": [
        { "text": "Nắm giữ chặt lại: ''Ơ đang nắm tay vui mà, sao lại rút ra?''", "nextNode": "fail_reversible" },
        { "text": "Nới lỏng tay để bạn ấy rút ra thoải mái: ''Cậu uống nước đi nè!''.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn toàn chính xác! Bạn đã áp dụng quy tắc F.R.I.E.S cực tốt: tôn trọng sự linh hoạt (Reversible) và tính cụ thể (Specific) của sự đồng thuận.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_surprise": {
      "text": "❌ Chưa đúng rồi! Việc đụng chạm bất ngờ mà không hỏi trước có thể làm đối phương giật mình hoặc khó chịu, vi phạm ranh giới cá nhân.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_passive": {
      "text": "❌ Chưa đúng. Trong mối quan hệ lành mạnh, tụi mình nên chủ động hỏi ý kiến trước khi đụng chạm cơ thể thay vì im lặng làm càn.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_anger": {
      "text": "❌ Sai rồi! Giận dỗi khi đối phương thiết lập ranh giới cụ thể là hành vi thao túng cảm xúc, thiếu tôn trọng quyền tự quyết của họ.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_reversible": {
      "text": "❌ Chưa chính xác. Sự đồng thuận có tính linh hoạt (Reversible) - bất cứ ai cũng có quyền rút lại lời đồng ý bất kỳ lúc nào và bạn phải tôn trọng điều đó.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các hành vi sau:",
  "leftBox": { "title": "Lành mạnh (Green Flag)" },
  "rightBox": { "title": "Độc hại (Red Flag)" },
  "items": [
    { "text": "Đồng ý vì nể sợ người yêu giận dỗi", "correctBox": "right" },
    { "text": "Tự nguyện đồng ý nắm tay nhưng từ chối ôm má", "correctBox": "left" },
    { "text": "Gật đầu làm theo lời dụ dỗ ngọt ngào khi đang say sưa", "correctBox": "right" },
    { "text": "Hào hứng đồng ý đi chơi xa và chuẩn bị kỹ lưỡng", "correctBox": "left" },
    { "text": "Im lặng cúi đầu chịu đựng khi đối phương bá vai", "correctBox": "right" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa ranh giới và định nghĩa quy tắc F.R.I.E.S sau:",
  "pairs": [
    { "left": "Tự nguyện (Freely given)", "right": "Đồng ý không có sự ép buộc, nài nỉ hay lo sợ bị giận dỗi." },
    { "left": "Linh hoạt (Reversible)", "right": "Có quyền đổi ý và rút lại quyết định bất cứ lúc nào." },
    { "left": "Đầy đủ thông tin (Informed)", "right": "Biết rõ bản chất hành động, không bị lừa dối hay giấu giếm." },
    { "left": "Cụ thể (Specific)", "right": "Đồng ý cho việc này không đồng nghĩa với việc khác." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa ranh giới:",
  "sentence": "Một lời [blank1] thực sự phải dựa trên sự [blank2] của bản thân, không bị áp lực [blank3] hay dụ dỗ, và có thể thay đổi bất cứ [blank4] nào.",
  "blanks": {
    "blank1": { "correct": "đồng ý", "placeholder": "..." },
    "blank2": { "correct": "tự nguyện", "placeholder": "..." },
    "blank3": { "correct": "ép buộc", "placeholder": "..." },
    "blank4": { "correct": "lúc", "placeholder": "..." }
  },
  "words": ["đồng ý", "tự nguyện", "ép buộc", "lúc", "im lặng", "nể nang", "ngượng ngùng", "đèn đỏ"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Khi đối phương đã đồng ý ôm bạn lúc trước, nhưng sau đó đẩy nhẹ bạn ra và nói ''Tớ thấy hơi nhanh'', phản ứng nào sau đây thể hiện sự tôn trọng ranh giới tốt nhất?",
  "enableLives": true,
  "choices": [
    { "text": "Hờn dỗi: ''Nãy cậu đồng ý rồi mà giờ lại thay đổi à?''", "correct": false, "emoji": "🙁" },
    { "text": "Nói đùa: ''Làm gì mà căng thế, ôm tí thôi mà!''", "correct": false, "emoji": "😐" },
    { "text": "Dừng lại ngay, nới lỏng tay và nhẹ nhàng hỏi han cảm nhận của đối phương.", "correct": true, "emoji": "💚" },
    { "text": "Cứ ôm chặt thêm vài giây rồi mới buông ra.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI HỌC 2: Lắc đầu không sao cả - Đối diện với từ chối (lesson_order = 10)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'lac-dau-khong-sao-ca',
    'Lắc đầu không sao cả - Đối diện với từ chối',
    'Học cách đối diện lành mạnh với lời từ chối, hiểu về ranh giới cá nhân và luật đồng thuận Việt Nam.',
    'Bài học trang bị kỹ năng vượt qua cảm giác hụt hẫng khi bị từ chối, cách từ chối lịch sự và kiến thức pháp luật.',
    10,
    true,
    100,
    10
);
SET @lesson2_id = LAST_INSERT_ID();

-- Nguồn tham khảo cho Bài học 2
INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson2_id, 'Scarleteen - I Know Consent is Awesome, But Rejection Is Not', 'https://www.scarleteen.com/read/sex-sexuality/i-know-consent-awesome-rejection-not', 'website'),
(@lesson2_id, 'Scarleteen - Age of Consent: What is it, exactly?', 'https://www.scarleteen.com/read/culture/age-consent-what-exactly', 'website');

-- --- Micro Lesson 2.1: Tại sao từ chối lại nhói lòng? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Tại sao từ chối lại nhói lòng?', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao khi người ấy từ chối, tụi mình lại thấy xấu hổ đến thế?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bị từ chối (rejection) kích hoạt cảm giác hụt hẫng, ngượng ngùng tạm thời.", "Đây là trải nghiệm siêu bình thường mà ai cũng phải trải qua khi trưởng thành.", "Lời từ chối chỉ có nghĩa mong muốn của hai bên chưa khớp nhau tại thời điểm đó."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời từ chối bận rộn", "body": "Kiên rủ Vy đi ăn kem sau giờ học. Vy trả lời: Xin lỗi cậu nha, hôm nay tớ phải về dọn nhà giúp mẹ rồi. Kiên đứng thẫn thờ, đỏ mặt và tự trách mình đã rủ rê."}', 3),
(@ml_id, 'interaction', '{"question": "Kiên nên nghĩ thế nào để bớt buồn?", "choices": [{"text": "Chắc mình nhạt nhẽo nên bạn ấy mới lấy cớ từ chối. Sẽ không bao giờ rủ ai nữa.", "correct": false, "emoji": "🙁"}, {"text": "Vy bận thật mà. Hôm khác mình rủ lại hoặc rủ đám bạn thân đi ăn kem.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng bị từ chối một lời mời chưa? Cảm xúc lúc đó thế nào?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bị từ chối không có nghĩa là bạn tệ. Chỉ là thời điểm chưa phù hợp thôi."]}', 6);

-- --- Micro Lesson 2.2: Lắc đầu không phải là phủ nhận bạn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Lắc đầu không phải là phủ nhận bạn', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Lý do từ chối thường nằm ở phía đối phương, không phải do bạn kém cỏi."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Có nhiều lý do khiến người khác lắc đầu: mệt mỏi, áp lực học tập, lo lắng chuyện gia đình.", "Đừng vội tự ti hay trách móc bản thân.", "Học cách phân loại lý do từ chối để giải tỏa tâm lý."]}', 2),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các lý do từ chối sau đây vào đúng hộp:", "leftBox": {"title": "Ranh giới & Hoàn cảnh của họ"}, "rightBox": {"title": "Suy diễn tự ti của mình"}, "items": [{"text": "Tớ đang lo lắng chuyện bài vở", "correctBox": "left"}, {"text": "Tại mình xấu xí nên bạn chê", "correctBox": "right"}, {"text": "Tớ chưa sẵn sàng thân mật", "correctBox": "left"}, {"text": "Do mình nhạt nên bị từ chối", "correctBox": "right"}]}', 3),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ từ chối đi chơi với bạn thân chỉ vì bạn đang mệt hay buồn ngủ chưa?"}', 4),
(@ml_id, 'takeaway', '{"items": ["Họ từ chối một đề nghị, chứ không phủ nhận con người bạn."]}', 5);

-- --- Micro Lesson 2.3: Kỹ năng "phanh xe" lịch sự ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Kỹ năng "phanh xe" lịch sự', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Ứng xử thế nào sau khi bị từ chối để giữ được sự cool ngầu và lịch sự?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tuyệt đối không giận dỗi, trách móc hay im lặng cắt đứt liên lạc.", "Hãy mỉm cười, tôn trọng ranh giới của họ và cư xử bình thường.", "Điều này thể hiện sự tự tin và giúp họ nể trọng bạn hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Bị từ chối xem phim", "body": "Sơn rủ Vy đi xem phim cuối tuần. Vy nhắn tin từ chối: Cuối tuần này tớ bận đi sinh nhật họ hàng mất rồi. Sơn thấy hụt hẫng và ngượng."}', 3),
(@ml_id, 'interaction', '{"question": "Giúp Sơn nhắn lại một câu thật lịch sự nhé:", "choices": [{"text": "Bận suốt thế. Thôi từ sau tớ chả rủ nữa.", "correct": false, "emoji": "🙁"}, {"text": "Ok cậu nè, đi sinh nhật vui vẻ nha! Hẹn cậu dịp khác.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Nếu bạn từ chối ai đó, bạn muốn nhận lại phản ứng vui vẻ hay giận dỗi từ họ?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tôn trọng lời từ chối là biểu hiện của một tình bạn đẹp và trưởng thành."]}', 6);

-- --- Micro Lesson 2.4: Cách tự đặt ranh giới và từ chối ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Cách tự đặt ranh giới và từ chối', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để nói Không một cách rõ ràng mà không sợ làm tổn thương người khác?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bạn không cần giải thích quá dông dài khi muốn bảo vệ ranh giới của mình.", "Từ chối thẳng thắn, lịch sự tốt hơn là nói dối hoặc chịu đựng.", "Một câu nói rõ ràng giúp cả hai giữ sự tôn trọng."]}', 2),
(@ml_id, 'scenario', '{"title": "Sự mệt mỏi sau giờ học", "body": "Lâm rủ Vy đi uống trà sữa. Vy thấy rất mệt và muốn về nhà ngủ, nhưng Vy sợ từ chối thẳng thừng sẽ khiến Lâm nghĩ mình kiêu kỳ."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên nhắn gì cho Lâm?", "choices": [{"text": "Tớ bận rồi.", "correct": false, "emoji": "😐"}, {"text": "Cảm ơn Lâm nha, nhưng hôm nay tớ hơi mệt nên muốn về nghỉ sớm. Hẹn cậu hôm khác nhé!", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy khó khăn khi phải nói lời từ chối với bạn bè không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Nói Không lịch sự là quyền của bạn. Người trân trọng bạn sẽ luôn thấu hiểu."]}', 6);

-- --- Micro Lesson 2.5: Vết xước nhỏ giúp ta đi xa hơn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Vết xước nhỏ giúp ta đi xa hơn', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Những lần bị từ chối có thể dạy tụi mình điều gì về bản thân?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sự bền bỉ (resilience) là khả năng chấp nhận thực tế và tự hồi phục sau thất vọng.", "Thất bại trong tình cảm là cơ hội để học hỏi và thấu hiểu ranh giới của người khác.", "Tập trung vào các hoạt động tích cực giúp bạn chữa lành nhanh hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Sức mạnh của sự kiên cường", "body": "Duy tỏ tình với bạn cùng lớp và bị từ chối nhẹ nhàng. Duy buồn vài ngày, nhưng sau đó nhận ra việc dám bày tỏ đã là sự dũng cảm của mình."}', 3),
(@ml_id, 'interaction', '{"question": "Duy đã làm gì để tự vượt qua?", "choices": [{"text": "Tự cô lập bản thân và ghét bỏ tình bạn cũ.", "correct": false, "emoji": "🙁"}, {"text": "Chấp nhận, tập trung vào bóng rổ và củng cố việc học tập.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có nghĩ rằng sau mỗi lần từ chối, chúng ta sẽ trở nên vững vàng hơn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Vết xước nhỏ trong tình cảm không làm bạn yếu đi, chúng giúp bạn trưởng thành hơn."]}', 6);

-- --- Micro Lesson 2.6: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Lắc đầu không sao cả''! Bạn có 3 mạng để vượt qua 5 thử thách thử lòng kiên cường. Sẵn sàng chưa?"}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Đối thoại ranh giới và ứng phó từ chối",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn rủ bạn cùng lớp đi hiệu sách mua tài liệu học tập cuối tuần này. Bạn ấy ngập ngừng từ chối: ''Xin lỗi cậu nha, cuối tuần này tớ bận học thêm và dọn dẹp nhà cửa mất rồi''. Cảm giác ngượng ngùng dâng lên trong lòng bạn.",
      "choices": [
        { "text": "Tự suy diễn: ''Chắc bạn ấy ghét mình nên mới lấy cớ từ chối''. Quyết định không bao giờ nói chuyện nữa.", "nextNode": "fail_low_self_esteem" },
        { "text": "Nài nỉ thêm: ''Học thêm tí thôi mà, đi hiệu sách nhanh lắm, đi với tớ đi!''", "nextNode": "fail_pester" },
        { "text": "Phản hồi lịch sự: ''Ok cậu nè, học tập và dọn dẹp vui vẻ nha! Hôm khác tụi mình đi cũng được''.", "nextNode": "step2" }
      ]
    },
    "step2": {
      "text": "Thứ Hai đi học, bạn thấy bạn ấy đang cười nói vui vẻ với một nhóm bạn khác. Cơn ghen tị và hụt hẫng nhen nhóm.",
      "choices": [
        { "text": "Đến chen vào và nói mỉa mai: ''Bận dọn nhà mà nay rảnh rỗi buôn chuyện thế nhờ?''", "nextNode": "fail_sarcasm" },
        { "text": "Cư xử bình thường, chủ động chào hỏi vui vẻ và tập trung vào việc học của mình.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Cuối tuần sau, bạn ấy chủ động nhắn tin rủ bạn đi thư viện tự học chung.",
      "choices": [
        { "text": "Từ chối thẳng thừng để trả đũa: ''Hôm trước bận thì hôm nay tớ cũng bận nhé!''", "nextNode": "fail_revenge" },
        { "text": "Vui vẻ nhận lời: ''Ý tưởng hay đó, hẹn cậu thứ Bảy ở thư viện nha!''", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn toàn chính xác! Bạn đã đặt ranh giới cá nhân một cách dứt khoát nhưng vẫn lịch sự, mềm mỏng và giữ vững lập trường của mình.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_low_self_esteem": {
      "text": "❌ Chưa đúng rồi! Tự suy diễn tiêu cực chỉ làm bản thân tổn thương và xa lánh mối quan hệ, trong khi lý do từ chối thường nằm ở hoàn cảnh của họ.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_pester": {
      "text": "❌ Sai rồi! Nài nỉ, ép buộc đối phương nhượng bộ khi họ đã từ chối là hành vi thiếu tôn trọng ranh giới của họ.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_sarcasm": {
      "text": "❌ Chưa đúng. Lời nói mỉa mai thể hiện sự thiếu chín chắn và làm rạn nứt tình cảm bạn bè một cách không đáng có.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_revenge": {
      "text": "❌ Sai rồi! Hành vi trả đũa trẻ con không giúp xây dựng tình bạn lành mạnh mà chỉ làm tăng thêm khoảng cách.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại suy nghĩ sau khi bị từ chối:",
  "leftBox": { "title": "Thực tế & Lành mạnh" },
  "rightBox": { "title": "Tự ti & Suy diễn" },
  "items": [
    { "text": "Bạn ấy từ chối vì không muốn đi chơi với mình hôm nay", "correctBox": "left" },
    { "text": "Chắc chắn mình là kẻ thất bại, xấu xí và không ai thích", "correctBox": "right" },
    { "text": "Có thể bạn ấy thực sự bận hoặc mệt mỏi vào lúc đó", "correctBox": "left" },
    { "text": "Mình không bao giờ nên mở lời mời bất kỳ ai nữa", "correctBox": "right" },
    { "text": "Ranh giới của người khác cần được tôn trọng tuyệt đối", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa ranh giới và cách ứng xử sau:",
  "pairs": [
    { "left": "Sự bền bỉ (Resilience)", "right": "Khả năng tự hồi phục sau hụt hẫng và thất vọng." },
    { "left": "Tự chủ cảm xúc", "right": "Không đổ lỗi cho bản thân hay giận dỗi đối phương." },
    { "left": "Ranh giới cá nhân", "right": "Giới hạn giúp bảo vệ không gian riêng tư của mỗi người." },
    { "left": "Từ chối lịch sự", "right": "Đưa ra lời từ chối rõ ràng kèm thái độ nhẹ nhàng, tôn trọng." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành triết lý kiên cường:",
  "sentence": "Khi bị từ chối, việc [blank1] ranh giới của người khác và giữ thái độ [blank2] giúp bạn bảo vệ [blank3] của bản thân cũng như duy trì [blank4] tốt đẹp.",
  "blanks": {
    "blank1": { "correct": "tôn trọng", "placeholder": "..." },
    "blank2": { "correct": "lịch sự", "placeholder": "..." },
    "blank3": { "correct": "giá trị", "placeholder": "..." },
    "blank4": { "correct": "mối quan hệ", "placeholder": "..." }
  },
  "words": ["tôn trọng", "lịch sự", "giá trị", "mối quan hệ", "tự ti", "giận dỗi", "nài nỉ", "trả đũa"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Nếu bạn cảm thấy mệt mỏi và không muốn đi chơi cùng bạn bè, cách từ chối nào sau đây là văn minh và rõ ràng nhất?",
  "enableLives": true,
  "choices": [
    { "text": "Lờ tin nhắn đi, giả vờ như không đọc được.", "correct": false, "emoji": "🥺" },
    { "text": "Nói dối là nhà có việc bận đột xuất để khỏi phải giải thích.", "correct": false, "emoji": "😐" },
    { "text": "Nói rõ rằng mình đang mệt cần nghỉ ngơi, cảm ơn lời rủ và hẹn dịp khác.", "correct": true, "emoji": "💚" },
    { "text": "Nhắn tin cộc lốc: ''Không đi đâu, mệt lắm!''", "correct": false, "emoji": "😠" }
  ]
}', 6);


-- =========================================================================
-- BÀI HỌC 3: Ranh giới số & Mạng xã hội (lesson_order = 11)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'ranh-gioi-so-mang-xa-hoi',
    'Ranh giới số & Mạng xã hội',
    'Quản lý tính riêng tư trên không gian mạng và cách thực hành đồng thuận số (digital consent).',
    'Nội dung hướng dẫn phân biệt ranh giới công khai/riêng tư, quy tắc chia sẻ hình ảnh, mật khẩu mạng xã hội và phòng tránh áp lực số.',
    11,
    true,
    100,
    10
);
SET @lesson3_id = LAST_INSERT_ID();

-- Nguồn tham khảo cho Bài học 3
INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson3_id, 'Scarleteen - What Is Healthy Sexual Development?', 'https://www.scarleteen.com/read/bodies/what-healthy-sexual-development', 'website');

-- --- Micro Lesson 3.1: Công cộng vs Riêng tư: Ranh giới ở đâu? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Công cộng vs Riêng tư: Ranh giới ở đâu?', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đâu là sự khác biệt giữa bảng tin công khai và không gian riêng tư của bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Không gian mạng xã hội cũng có công viên công cộng và có phòng ngủ riêng tư.", "Làm lộ thông tin hoặc đăng hình ảnh quá cá nhân có thể gây hại cho bản thân.", "Hiểu ranh giới giúp bạn tự bảo vệ hình ảnh cá nhân và tôn trọng người khác."]}', 2),
(@ml_id, 'scenario', '{"title": "Ảnh dìm bạn thân", "body": "Vy chụp được bức ảnh dìm của bạn thân lúc ngủ gật trong lớp. Vy thấy rất vui và định đăng lên story Facebook công khai cho cả trường xem."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên làm gì để tôn trọng ranh giới riêng tư?", "choices": [{"text": "Vui mà, bạn bè đùa tí có sao đâu cứ đăng đi.", "correct": false, "emoji": "🛑"}, {"text": "Gửi riêng cho bạn đó xem trước, nếu bạn đồng ý mới được đăng.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thấy khó chịu nếu hình ảnh lúc ngốc nghếch của mình bị đăng lên mạng mà chưa hỏi ý kiến?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mạng xã hội không bao giờ quên. Hãy bảo vệ sự riêng tư của chính mình và bạn bè."]}', 6);

-- --- Micro Lesson 3.2: Quy tắc chia sẻ ảnh: Đừng "share" tự ý! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Quy tắc chia sẻ ảnh: Đừng "share" tự ý!', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chụp ảnh chung với người khác thì có được tự ý đăng lên mạng không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đồng thuận số (digital consent) bắt đầu từ việc hỏi ý kiến trước khi đăng ảnh người khác.", "Có thể bạn thấy ảnh đẹp, nhưng người khác lại không thoải mái khi ảnh họ hiện diện trên mạng.", "Hãy gỡ ảnh hoặc xóa tag nếu bạn của bạn yêu cầu."]}', 2),
(@ml_id, 'scenario', '{"title": "Yêu cầu gỡ ảnh", "body": "Nam đăng ảnh chụp chung với Trang lên Instagram. Trang thấy ảnh đó mặt mình bị dìm nên nhắn tin bảo Nam gỡ xuống. Nam thấy Trang phiền phức."}', 3),
(@ml_id, 'interaction', '{"question": "Nam nên xử lý thế nào để thể hiện sự tôn trọng?", "choices": [{"text": "Kệ Trang: Hình đẹp thế này gỡ làm gì, cậu cứ vẽ chuyện.", "correct": false, "emoji": "😐"}, {"text": "Gỡ ảnh hoặc xóa tag ngay lập tức: Xin lỗi cậu nha, tớ gỡ liền nè.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng nhờ bạn bè gỡ hình chụp chung vì thấy mình không được đẹp chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chụp chung không có nghĩa là được tự ý share. Tôn trọng ranh giới là ưu tiên số 1."]}', 6);

-- --- Micro Lesson 3.3: Mật khẩu và sự kiểm soát trực tuyến ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Mật khẩu và sự kiểm soát trực tuyến', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Yêu nhau là phải đưa mật khẩu tài khoản mạng xã hội để chứng minh lòng tin?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Yêu cầu đưa mật khẩu để kiểm soát tin nhắn là hành vi xâm phạm ranh giới riêng tư.", "Tình yêu lành mạnh dựa trên sự tin tưởng lẫn nhau, không phải kiểm soát 24/7.", "Mỗi người đều cần có một không gian riêng tư được tôn trọng."]}', 2),
(@ml_id, 'scenario', '{"title": "Đòi mật khẩu TikTok", "body": "Lâm yêu cầu Vy đưa mật khẩu tài khoản TikTok để kiểm tra tin nhắn. Vy thấy ngột ngạt nhưng sợ Lâm giận nên định nhượng bộ."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên nói gì với Lâm để bảo vệ ranh giới?", "choices": [{"text": "Đây nè, cậu cứ vào xem đi để khỏi nghi ngờ tớ nữa.", "correct": false, "emoji": "🛑"}, {"text": "Tớ yêu cậu nhưng tớ muốn giữ không gian riêng tư. Tin tưởng nhau quan trọng hơn mật khẩu.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có nghĩ một người thực sự tin tưởng bạn sẽ không cần giám sát tin nhắn của bạn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mật khẩu là chìa khóa riêng tư tối thiểu. Hãy tôn trọng lòng tự trọng của nhau."]}', 6);

-- --- Micro Lesson 3.4: "Gửi ảnh nhạy cảm" - Áp lực trực tuyến ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, '"Gửi ảnh nhạy cảm" - Áp lực trực tuyến', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Phải làm sao khi người yêu nhắn tin đòi bạn gửi hình ảnh nhạy cảm?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Gửi ảnh nhạy cảm (sexting) tiềm ẩn rủi ro cực kỳ lớn đối với học sinh.", "Bạn hoàn toàn có quyền từ chối. Không ai được dùng tình cảm để ép buộc bạn làm điều này.", "Ảnh gửi đi sẽ không còn nằm trong kiểm soát của bạn và có thể bị phát tán."]}', 2),
(@ml_id, 'scenario', '{"title": "Chứng minh tình yêu bằng ảnh", "body": "Cường nhắn tin đòi Vy gửi ảnh chụp bờ vai trần của Vy để chứng minh tình yêu. Vy sợ nếu không gửi Cường sẽ đòi chia tay."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên làm thế nào?", "choices": [{"text": "Gửi đại một tấm mờ mờ để xoa dịu Cường.", "correct": false, "emoji": "🛑"}, {"text": "Từ chối dứt khoát: Tớ không làm việc này đâu. Mong cậu tôn trọng quyết định của tớ.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Nếu một người sẵn sàng giận dỗi vì bạn từ chối gửi ảnh nhạy cảm, họ có yêu bạn thật lòng?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hình ảnh đã gửi đi không thể lấy lại. Hãy bảo vệ ranh giới an toàn của mình."]}', 6);

-- --- Micro Lesson 3.5: Bộ lọc truyền thông - Phân biệt phim ảnh với thực tế ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Bộ lọc truyền thông - Phân biệt phim ảnh với thực tế', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Những gì bạn thấy trên mạng về tình yêu tuổi teen có giống 100% ngoài đời thực?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Phim ảnh và mạng xã hội thường cường điệu hóa và lãng mạn hóa sự đụng chạm ép buộc.", "Năng lực đánh giá truyền thông (media literacy) giúp bạn không bị ảo tưởng bởi kỳ vọng phi thực tế.", "Mối quan hệ thực tế cần sự thấu hiểu, vụng về và tôn trọng ranh giới."]}', 2),
(@ml_id, 'flashcard', '{"front": "Sự đụng chạm bá đạo trên phim ảnh có phải là hình mẫu ngoài đời?", "back": "Không. Trên phim thường lãng mạn hóa việc đụng chạm không xin phép. Ngoài đời, sự đồng thuận tự nguyện và tôn trọng ranh giới mới là ưu tiên số 1.", "notes": "Cần phân biệt kịch bản điện ảnh với các mối quan hệ an toàn thực tế."}', 3),
(@ml_id, 'reflection', '{"question": "Bạn có từng mong muốn người yêu mình phải hoàn hảo hay bá đạo giống nhân vật trong phim chưa?"}', 4),
(@ml_id, 'takeaway', '{"items": ["Đừng mang kịch bản phim ảnh áp vào đời thực. Sự an toàn và tôn trọng quan trọng hơn sự lãng mạn giả tạo."]}', 5);

-- --- Micro Lesson 3.6: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Ranh giới số & Mạng xã hội''! Bạn có 3 mạng để giải quyết các rắc rối trên không gian ảo. Tiến lên!"}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Ranh giới trên không gian mạng",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn chụp được ảnh dìm của bạn thân ngủ gật trong lớp với dáng vẻ rất ngộ nghĩnh. Nhóm chat của lớp đang bàn tán xôn xao, bạn định đăng tấm ảnh này lên Story Instagram cá nhân.",
      "choices": [
        { "text": "Đăng lên ngay lập tức kèm caption hài hước để mọi người cùng thả tim.", "nextNode": "fail_leak" },
        { "text": "Gửi riêng bức ảnh cho bạn ấy xem trước và hỏi ý kiến: ''Tớ đăng tấm này lên Story trêu tí được không?''", "nextNode": "step2" },
        { "text": "Chỉ chia sẻ trong nhóm chat kín 3 người bạn thân mà không cần hỏi bạn ấy.", "nextNode": "fail_leak_private" }
      ]
    },
    "step2": {
      "text": "Bạn ấy nhắn lại: ''Trông mặt tớ phệ quá, cậu đừng đăng lên mạng nha, tớ ngại lắm!''",
      "choices": [
        { "text": "Nài nỉ tiếp: ''Ui dào bạn bè cả mà, story 24h tự xóa thôi, có ai để ý đâu, cho tớ đăng đi!''", "nextNode": "fail_pester" },
        { "text": "Tôn trọng bạn: ''Ok cậu nè, tớ sẽ giữ làm kỷ niệm riêng thôi, không đăng đâu!''", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Tối hôm đó, một thành viên khác trong nhóm lớp lại tự ý đăng bức ảnh dìm đó lên nhóm Facebook chung của trường.",
      "choices": [
        { "text": "Hùa vào bình luận trêu chọc chung cho vui: ''Haha nhìn tấu hài thực sự!''", "nextNode": "fail_cyberbullying" },
        { "text": "Nhắn tin nhắc nhở bạn kia gỡ ảnh và động viên bạn thân của mình.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn hảo! Tôn trọng ranh giới số của bạn bè giúp giữ gìn tình bạn đẹp trực tuyến và thực tế.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_leak": {
      "text": "❌ Sai rồi! Tự ý đăng ảnh dìm của bạn bè lên mạng xã hội khi chưa được sự đồng ý là vi phạm ranh giới số của họ.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_leak_private": {
      "text": "❌ Chưa đúng. Dù là nhóm chat kín, chia sẻ ảnh dìm không có sự đồng thuận vẫn có nguy cơ rò rỉ và gây tổn thương cho bạn mình.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_pester": {
      "text": "❌ Sai rồi! Nài nỉ, ép buộc đối phương nhượng bộ trên mạng xã hội vẫn là hành vi thiếu tôn trọng ranh giới của họ.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_cyberbullying": {
      "text": "❌ Sai rồi! Hùa theo trêu chọc khi biết bạn không thoải mái là hành vi tiếp tay cho bắt nạt trực tuyến.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại hành vi trên mạng xã hội:",
  "leftBox": { "title": "Green Flag số" },
  "rightBox": { "title": "Red Flag số" },
  "items": [
    { "text": "Hỏi ý kiến bạn bè trước khi đăng ảnh chung lên mạng", "correctBox": "left" },
    { "text": "Đòi người yêu cung cấp mật khẩu tài khoản để kiểm soát", "correctBox": "right" },
    { "text": "Tôn trọng yêu cầu gỡ tag hoặc xóa ảnh từ người khác", "correctBox": "left" },
    { "text": "Gửi ảnh nhạy cảm cá nhân dưới áp lực đe dọa chia tay", "correctBox": "right" },
    { "text": "Cài đặt chế độ riêng tư để bảo vệ thông tin cá nhân", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa ranh giới và định nghĩa an toàn số sau:",
  "pairs": [
    { "left": "Đồng thuận số (Digital consent)", "right": "Hỏi ý kiến trước khi chia sẻ hình ảnh hoặc thông tin người khác lên mạng." },
    { "left": "Ranh giới mật khẩu", "right": "Quyền giữ bảo mật tài khoản cá nhân, không chia sẻ để chứng minh lòng tin." },
    { "left": "Bộ lọc truyền thông", "right": "Khả năng phân biệt ảo tưởng trên phim ảnh với các mối quan hệ đời thực." },
    { "left": "Bắt nạt trực tuyến", "right": "Hành vi sử dụng mạng xã hội để trêu chọc, cô lập hoặc làm nhục người khác." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa an toàn mạng:",
  "sentence": "Mạng xã hội không bao giờ [blank1] hoàn toàn thông tin, vì vậy hãy luôn tôn trọng [blank2] số của bạn bè và tuyệt đối nói không với áp lực gửi ảnh [blank3] dù đối phương có [blank4] thế nào.",
  "blanks": {
    "blank1": { "correct": "xóa", "placeholder": "..." },
    "blank2": { "correct": "ranh giới", "placeholder": "..." },
    "blank3": { "correct": "nhạy cảm", "placeholder": "..." },
    "blank4": { "correct": "nài nỉ", "placeholder": "..." }
  },
  "words": ["xóa", "ranh giới", "nhạy cảm", "nài nỉ", "công khai", "chia sẻ", "lừa dối", "tin tưởng"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Khi một người bạn online liên tục nhắn tin yêu cầu bạn gửi ảnh chụp riêng tư nhạy cảm của bạn, phản ứng nào sau đây bảo vệ bạn tốt nhất?",
  "enableLives": true,
  "choices": [
    { "text": "Gửi một bức ảnh chụp từ xa, che mặt để tự bảo vệ.", "correct": false, "emoji": "🥺" },
    { "text": "Từ chối dứt khoát, chặn tài khoản đó và báo ngay với người lớn đáng tin cậy.", "correct": true, "emoji": "💚" },
    { "text": "Thương lượng: ''Cậu gửi ảnh của cậu trước đi rồi tớ gửi sau''.", "correct": false, "emoji": "😐" },
    { "text": "Im lặng gửi ảnh vì sợ bị tung thông tin cá nhân lên mạng.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI HỌC 4: Làm chủ cơ thể & Sức khỏe (lesson_order = 12)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'lam-chu-co-the-va-suc-khoe',
    'Làm chủ cơ thể & Sức khỏe',
    'Học cách tự chủ cơ thể, hiểu đúng kiến thức sinh học, an toàn sức khỏe và luật pháp.',
    'Bài học trang bị kiến thức về quyền tự quyết cơ thể, gọi đúng tên các bộ phận sinh dục, an toàn y khoa và luật độ tuổi đồng thuận Việt Nam.',
    12,
    false,
    100,
    10
);
SET @lesson4_id = LAST_INSERT_ID();

-- Nguồn tham khảo cho Bài học 4
INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson4_id, 'Scarleteen - What Is Healthy Sexual Development?', 'https://www.scarleteen.com/read/bodies/what-healthy-sexual-development', 'website'),
(@lesson4_id, 'Scarleteen - Age of Consent: What is it, exactly?', 'https://www.scarleteen.com/read/culture/age-consent-what-exactly', 'website');

-- --- Micro Lesson 4.1: Quyền tự quyết (Agency) cơ thể ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Quyền tự quyết (Agency) cơ thể', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Ai là người đưa ra quyết định cuối cùng đối với cơ thể của bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Quyền tự quyết (Agency) nghĩa là bạn có toàn quyền sở hữu cơ thể của mình.", "Không ai được chạm vào cơ thể bạn nếu chưa được bạn đồng ý.", "Bạn có quyền từ chối mọi đụng chạm mà bạn thấy không thoải mái."]}', 2),
(@ml_id, 'scenario', '{"title": "Thử thách của đám đông", "body": "Vy bị nhóm bạn thách ôm một bạn nam trong lớp mà Vy không quen thân. Nhóm bạn hò reo ép Vy làm, dù Vy thấy rất ngượng ngập và không muốn."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên ứng xử thế nào để giữ quyền tự quyết?", "choices": [{"text": "Nhắm mắt làm theo để không bị chê là nhát và phá cuộc vui.", "correct": false, "emoji": "🙁"}, {"text": "Từ chối dứt khoát: Tớ không thoải mái với thử thách này, tớ xin chịu phạt kiểu khác nhé.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng ép bản thân đụng chạm với ai đó chỉ vì áp lực xung quanh chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể là lãnh thổ riêng của bạn. Chỉ có bạn mới quyết định ai được phép bước vào."]}', 6);

-- --- Micro Lesson 4.2: Gọi đúng tên các bộ phận cơ thể ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Gọi đúng tên các bộ phận cơ thể', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao tụi mình thường dùng từ lóng để nói về bộ phận nhạy cảm?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Giáo dục giới tính khoa học cần gọi đúng tên các bộ phận sinh học (âm hộ, dương vật, tinh hoàn).", "Gọi đúng tên giúp bạn bớt ngại ngùng và tự tin chăm sóc vệ sinh.", "Đây là ngôn ngữ y tế chính xác để bạn giao tiếp khi gặp vấn đề sức khỏe."]}', 2),
(@ml_id, 'flashcard', '{"front": "Tại sao phải phân biệt Vulva (Âm hộ) và Vagina (Âm đạo)?", "back": "Vulva là toàn bộ cơ quan sinh dục ngoài (có thể nhìn thấy bên ngoài), còn Vagina là ống âm đạo nằm bên trong. Việc gọi tên chính xác giúp nhận diện cấu tạo sinh học và chăm sóc sức khỏe đúng cách.", "notes": "Khoa học không có sự xấu hổ."}', 3),
(@ml_id, 'reflection', '{"question": "Bạn có thấy việc dùng tên khoa học giúp các cuộc thảo luận trở nên nghiêm túc hơn không?"}', 4),
(@ml_id, 'takeaway', '{"items": ["Không có gì xấu hổ khi nói về sinh học cơ thể. Gọi đúng tên là tự trọng và khoa học."]}', 5);

-- --- Micro Lesson 4.3: "An toàn" nghĩa là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, '"An toàn" nghĩa là gì?', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bảo vệ an toàn cho cơ thể có phải là chuyện của riêng ai?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["An toàn (safety) bao gồm an toàn thể chất, ngừa thai và phòng tránh bệnh STIs.", "Các bạn teen cần hiểu rõ biện pháp phòng ngừa để chịu trách nhiệm bảo vệ bản thân.", "Hãy dựa vào kiến thức y học, đừng tin vào những lời truyền miệng thiếu căn cứ."]}', 2),
(@ml_id, 'scenario', '{"title": "Xuất tinh ngoài có an toàn?", "body": "Huy nghe các bạn kháo nhau rằng chỉ cần rút ra kịp lúc là an toàn, không cần dùng bao cao su vướng víu."}', 3),
(@ml_id, 'interaction', '{"question": "Ý kiến của các bạn Huy đúng hay sai?", "choices": [{"text": "Đúng, phương pháp này rất phổ biến và tiết kiệm.", "correct": false, "emoji": "🛑"}, {"text": "Sai hoàn toàn. Phương pháp này rủi ro cao và không ngừa được bệnh STIs. Chỉ bao cao su mới an toàn.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có tự tin mình biết cách phòng ngừa các rủi ro sức khỏe sinh sản chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["An toàn thể chất cần kiến thức y học chính xác. Đừng đánh cược sức khỏe của mình."]}', 6);

-- --- Micro Lesson 4.4: Luật đồng thuận tại Việt Nam: Cột mốc 16 tuổi ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Luật đồng thuận tại Việt Nam: Cột mốc 16 tuổi', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có biết pháp luật Việt Nam bảo vệ ranh giới tuổi teen nghiêm ngặt như thế nào?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Độ tuổi đồng thuận tình dục tối thiểu ở Việt Nam là từ đủ 16 tuổi trở lên.", "Quan hệ tình dục với người dưới 16 tuổi là vi phạm pháp luật hình sự, kể cả tự nguyện.", "Luật pháp đặt ranh giới này để bảo vệ vị thành niên khỏi các tổn thương tâm lý và thể chất sớm."]}', 2),
(@ml_id, 'scenario', '{"title": "Tự nguyện dưới 16 tuổi", "body": "Tuấn (17 tuổi) và Lan (15 tuổi) yêu nhau. Tuấn muốn hai đứa tiến xa hơn vì cho rằng tự nguyện thì không sao. Lan băn khoăn về pháp luật."}', 3),
(@ml_id, 'interaction', '{"question": "Ý kiến của Tuấn có đúng luật pháp Việt Nam không?", "choices": [{"text": "Đúng, tự nguyện yêu nhau thì không ai can thiệp.", "correct": false, "emoji": "🛑"}, {"text": "Sai. Lan 15 tuổi (dưới 16), việc quan hệ tình dục là phạm pháp đối với Tuấn, kể cả tự nguyện.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Tại sao luật pháp lại cần bảo vệ các bạn dưới 16 tuổi một cách tuyệt đối như vậy?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Biết luật để tự bảo vệ mình và người mình yêu thương. Ranh giới pháp lý là tấm khiên vững chắc."]}', 6);

-- --- Micro Lesson 4.5: Chấp nhận bản thân (Self-acceptance) ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Chấp nhận bản thân (Self-acceptance)', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có bao giờ bạn đứng trước gương và tự ti về cơ thể dậy thì đang thay đổi?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mỗi người lớn lên với tốc độ khác nhau. Mụn, giọng nói hay cân nặng thay đổi đều là bình thường.", "Không có một vóc dáng chuẩn nào cả. Yêu cơ thể mình là nền tảng của tự tin.", "Hãy kiên nhẫn với bản thân trong giai đoạn dậy thì này."]}', 2),
(@ml_id, 'scenario', '{"title": "So sánh chiều cao", "body": "Linh tự ti vì các bạn nữ trong lớp đã phổng phao và cao lớn, còn mình vẫn thấp bé như học sinh tiểu học. Linh sợ mình bị chậm phát triển."}', 3),
(@ml_id, 'interaction', '{"question": "Chọn lời khuyên giúp Linh tự tin hơn:", "choices": [{"text": "Tìm mua các loại thuốc tăng chiều cao hoặc ăn kiêng cấp tốc.", "correct": false, "emoji": "🛑"}, {"text": "Cơ thể cậu đang phát triển đúng nhịp của nó. Hãy kiên nhẫn và yêu bản thân nhé.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thích nhất điểm nào trên cơ thể mình hiện tại? Hãy dành một lời khen cho nó nhé."}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể bạn đang lớn lên theo cách riêng của nó. Đừng so sánh bản thân với bất kỳ ai."]}', 6);

-- --- Micro Lesson 4.6: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Làm chủ cơ thể & Sức khỏe''! Bạn có 3 mạng để thử thách kiến thức y học và pháp lý. Bắt đầu!"}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Quyền tự quyết cơ thể và pháp luật",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn đang quen một người yêu 15 tuổi. Người yêu nói rất yêu bạn và muốn hai đứa tiến xa hơn (quan hệ tình dục) để chứng minh tình cảm sâu sắc. Bạn biết rõ quy định pháp luật Việt Nam nhưng người yêu cứ khóc lóc.",
      "choices": [
        { "text": "Đồng ý vì nghĩ cả hai tự nguyện thì pháp luật không can thiệp.", "nextNode": "fail_legal_issue" },
        { "text": "Kiên quyết từ chối lịch sự, giải thích rõ ranh giới pháp lý cột mốc 16 tuổi để bảo vệ cả hai.", "nextNode": "step2" },
        { "text": "Nổi giận đùng đùng, mắng mỏ người yêu là thiếu hiểu biết rồi đòi chia tay ngay.", "nextNode": "fail_anger_legal" }
      ]
    },
    "step2": {
      "text": "Người yêu giận dỗi nói: ''Cậu lấy lý do pháp luật để thoái thác đúng không? Yêu nhau mà sợ sệt đủ thứ!''",
      "choices": [
        { "text": "Nhượng bộ vì không muốn bị nghi ngờ tình cảm chân thành.", "nextNode": "fail_legal_concede" },
        { "text": "Vỗ về người yêu, khẳng định tình cảm chân thành nhưng kiên định ranh giới: ''Tớ muốn bảo vệ tương lai của cả hai đứa''.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Sau đó, người yêu nghe theo lời khuyên của bạn và muốn cùng bạn tìm hiểu về các biện pháp tránh thai khoa học để chuẩn bị kiến thức cho tương lai.",
      "choices": [
        { "text": "Khuyên người yêu dùng phương pháp xuất tinh ngoài vì nghe bạn bè bảo rất an toàn và tự nhiên.", "nextNode": "fail_medical_myth" },
        { "text": "Đề xuất cùng tìm hiểu về bao cao su và các biện pháp tránh thai an toàn, khoa học.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn toàn chính xác! Bạn đã vừa kiên định bảo vệ bản thân và đối phương, vừa tuân thủ pháp luật Việt Nam.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_legal_issue": {
      "text": "❌ Sai luật hình sự! Tại Việt Nam, mọi hành vi quan hệ tình dục với người dưới 16 tuổi là phạm pháp hình sự, kể cả có sự tự nguyện từ hai phía.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_anger_legal": {
      "text": "❌ Phản ứng quá đà! Lên giọng mắng mỏ không giúp đối phương hiểu rõ bản chất vấn đề pháp lý mà chỉ làm xung đột gia tăng.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_legal_concede": {
      "text": "❌ Sai rồi! Nhượng bộ áp lực tình cảm để vi phạm pháp luật hình sự là hành vi cực kỳ nguy hiểm cho cả hai.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_medical_myth": {
      "text": "❌ Sai kiến thức y khoa! Xuất tinh ngoài có tỷ lệ thất bại rất cao và hoàn toàn không phòng tránh được các bệnh lây qua đường tình dục (STIs).",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại kiến thức giới tính:",
  "leftBox": { "title": "Khoa học chính xác" },
  "rightBox": { "title": "Lời đồn nguy hại" },
  "items": [
    { "text": "Bao cao su giúp ngăn ngừa thai và hầu hết bệnh STIs", "correctBox": "left" },
    { "text": "Xuất tinh ngoài là biện pháp tránh thai tuyệt đối an toàn", "correctBox": "right" },
    { "text": "Gọi đúng tên dương vật, âm hộ để giao tiếp sức khỏe", "correctBox": "left" },
    { "text": "Quan hệ lần đầu tiên thì chắc chắn không thể mang thai", "correctBox": "right" },
    { "text": "Cơ thể dậy thì phát triển theo tốc độ riêng của mỗi người", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa cơ thể và định nghĩa sau:",
  "pairs": [
    { "left": "Quyền tự quyết (Agency)", "right": "Quyền sở hữu tối cao và đưa ra quyết định đối với cơ thể của chính bạn." },
    { "left": "Độ tuổi đồng thuận", "right": "Cột mốc đủ 16 tuổi trở lên theo quy định của Luật hình sự Việt Nam." },
    { "left": "Bệnh lây qua đường tình dục", "right": "Các bệnh STIs như HIV, lậu, giang mai cần phòng tránh bằng bao cao su." },
    { "left": "Âm hộ (Vulva)", "right": "Cấu tạo sinh học bên ngoài của cơ quan sinh dục nữ cần gọi tên khoa học." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa pháp luật:",
  "sentence": "Tại Việt Nam, mọi hành vi quan hệ tình dục với người dưới [blank1] tuổi đều vi phạm [blank2] hình sự, kể cả khi có sự [blank3] tự nguyện, nhằm bảo vệ sự phát triển [blank4] của vị thành niên.",
  "blanks": {
    "blank1": { "correct": "16", "placeholder": "..." },
    "blank2": { "correct": "pháp luật", "placeholder": "..." },
    "blank3": { "correct": "đồng thuận", "placeholder": "..." },
    "blank4": { "correct": "lành mạnh", "placeholder": "..." }
  },
  "words": ["16", "pháp luật", "đồng thuận", "lành mạnh", "18", "dân sự", "im lặng", "ép buộc"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Phương pháp nào sau đây là duy nhất vừa giúp tránh thai hiệu quả vừa bảo vệ bạn khỏi các bệnh lây truyền qua đường tình dục (STIs)?",
  "enableLives": true,
  "choices": [
    { "text": "Sử dụng thuốc tránh thai khẩn cấp.", "correct": false, "emoji": "🥺" },
    { "text": "Sử dụng bao cao su đúng cách trong suốt quá trình đụng chạm tình dục.", "correct": true, "emoji": "💚" },
    { "text": "Thực hiện xuất tinh ngoài âm đạo.", "correct": false, "emoji": "😐" },
    { "text": "Tính ngày rụng trứng theo chu kỳ kinh nguyệt.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI HỌC 5: Áp lực bạn bè & Điểm tựa hỗ trợ (lesson_order = 13)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'ap-luc-ban-be-va-diem-tua-ho-tro',
    'Áp lực bạn bè & Điểm tựa hỗ trợ',
    'Vượt qua áp lực từ bạn bè, định hình giá trị bản thân và kết nối với mạng lưới hỗ trợ.',
    'Bài học hướng dẫn nhận diện áp lực nhóm, kỹ năng nói Không khéo léo, đối thoại giá trị gia đình và tìm kiếm sự hỗ trợ khi gặp nguy hiểm.',
    13,
    false,
    100,
    10
);
SET @lesson5_id = LAST_INSERT_ID();

-- Nguồn tham khảo cho Bài học 5
INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson5_id, 'Scarleteen - What Is Healthy Sexual Development?', 'https://www.scarleteen.com/read/bodies/what-healthy-sexual-development', 'website'),
(@lesson5_id, 'Scarleteen - Our Philosophy', 'https://www.scarleteen.com/about/our-philosophy', 'website');

-- --- Micro Lesson 5.1: Khi bạn bè thúc ép ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Khi bạn bè thúc ép', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ làm một việc nguy hiểm chỉ vì sợ bị hội bạn thân chê nhát gan?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Áp lực đồng trang lứa (peer pressure) dễ khiến tụi mình làm những việc không thoải mái.", "Hội bạn có thể ép trốn học, thử vape hay đùa cợt thô bạo người khác.", "Nhận biết sự thúc ép giúp bạn bảo vệ ranh giới cá nhân kỹ càng."]}', 2),
(@ml_id, 'scenario', '{"title": "Thử thách uống bia", "body": "Trong buổi tiệc, các bạn thách Nam uống thử một hớp bia lớn để chứng minh mình đàn ông. Nam không thích nhưng sợ bị cả hội tẩy chay."}', 3),
(@ml_id, 'interaction', '{"question": "Nam nên làm thế nào?", "choices": [{"text": "Uống luôn cho xong để được cả nhóm khen ngầu.", "correct": false, "emoji": "🙁"}, {"text": "Từ chối vui vẻ: Thôi tớ xin kiếu, uống nước ngọt được rồi, tớ phải đạp xe về.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng làm việc gì đó mà mình ghét chỉ để được nhóm bạn chơi chung chấp nhận chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đám bạn thực sự tốt sẽ tôn trọng quyết định của bạn, chứ không ép bạn làm việc nguy hại."]}', 6);

-- --- Micro Lesson 5.2: Nói "Không" với đám đông: Vì sao lại khó? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Nói "Không" với đám đông: Vì sao lại khó?', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao việc đi ngược lại số đông lại cần nhiều dũng khí đến thế?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Teenager luôn có nỗi sợ bị cô lập, bị trêu chọc hay bị coi là lập dị trong nhóm.", "Hiểu được cảm xúc lo sợ này giúp bạn bớt tự trách mình khi thấy khó mở lời.", "Giữ vững lập trường của mình mới là biểu hiện của sự tự tin thực sự."]}', 2),
(@ml_id, 'scenario', '{"title": "Trò cô lập bạn mới", "body": "Vy thấy cả nhóm bạn thân đang hùa nhau nói xấu và cô lập một bạn nữ mới chuyển trường. Vy muốn đến bắt chuyện nhưng sợ cả nhóm quay sang tẩy chay mình."}', 3),
(@ml_id, 'interaction', '{"question": "Đâu là lựa chọn dũng khí của Vy?", "choices": [{"text": "Im lặng hùa theo nhóm để bảo vệ bản thân.", "correct": false, "emoji": "🛑"}, {"text": "Đứng về phía lẽ phải: chủ động bắt chuyện với bạn mới và khuyên ngăn nhóm bạn.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng đứng về phía lẽ phải ngay cả khi chỉ có một mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đi ngược lại đám đông cần dũng khí, nhưng đó là cách để giữ gìn sự tự trọng của bạn."]}', 6);

-- --- Micro Lesson 5.3: Kỹ năng từ chối áp lực nhóm cực khéo ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Kỹ năng từ chối áp lực nhóm cực khéo', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để từ chối lời rủ rê mà không gây rạn nứt tình bạn thân thiết?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Từ chối không cần phải gay gắt hay gây chiến.", "Bạn có thể đưa ra lý do cá nhân hợp lý hoặc dùng sự hài hước để giảm bớt căng thẳng.", "Quan trọng là giọng điệu kiên định nhưng thân thiện."]}', 2),
(@ml_id, 'scenario', '{"title": "Rủ trốn học cày rank", "body": "Nhóm bạn rủ Lâm trốn học buổi chiều để đi quán net chơi game. Lâm muốn ở lại học bài chuẩn bị thi nhưng sợ bị chê là mọt sách chán ngắt."}', 3),
(@ml_id, 'interaction', '{"question": "Giúp Lâm từ chối khéo nhất nhé:", "choices": [{"text": "Trốn học là xấu đấy, các cậu lười biếng quá.", "correct": false, "emoji": "😐"}, {"text": "Chiều nay tớ phải cày nốt đống đề Toán mai thi rồi. Các đại ca đi vui vẻ nhé, mai thi xong tớ bù sau!", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thường dùng cách nào để từ chối bạn bè khi họ rủ rê làm việc bạn không muốn?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Từ chối khéo léo giúp bạn giữ vững ranh giới mà vẫn duy trì tình bạn tốt đẹp."]}', 6);

-- --- Micro Lesson 5.4: Đối thoại giá trị: Bạn vs Gia đình & Xã hội ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Đối thoại giá trị: Bạn vs Gia đình & Xã hội', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Phải làm sao khi những giá trị bạn tin tưởng khác biệt với kỳ vọng của gia đình?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Trưởng thành là quá trình định hình thế giới quan và đạo đức cá nhân riêng.", "Khác biệt quan điểm không phải là nổi loạn, mà là bước lớn lên tự nhiên.", "Hãy đối thoại chân thành và tôn trọng để tìm sự đồng cảm từ bố mẹ."]}', 2),
(@ml_id, 'scenario', '{"title": "Lệnh cấm kết bạn", "body": "Bố mẹ Vy cấm Vy không được kết bạn hay nói chuyện với bất kỳ bạn nam nào trong lớp. Vy thấy quy định quá khắt khe nhưng sợ cãi lời sẽ bị mắng hỗn láo."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên làm thế nào để đối thoại hiệu quả?", "choices": [{"text": "Cài lại gay gắt hoặc âm thầm nói dối, giấu giếm mối quan hệ.", "correct": false, "emoji": "🛑"}, {"text": "Chọn lúc vui vẻ, chia sẻ về việc học nhóm chung và cam kết giữ ranh giới học tập để bố mẹ an tâm.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Có quan điểm nào về tình bạn hay tình yêu mà bạn muốn thảo luận cởi mở với bố mẹ của mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tôn trọng giá trị gia đình không có nghĩa là im lặng. Đối thoại chân thành kết nối các thế hệ."]}', 6);

-- --- Micro Lesson 5.5: Điểm tựa an toàn: Khi ranh giới bị vượt qua ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Điểm tựa an toàn: Khi ranh giới bị vượt qua', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn sẽ tìm đến ai khi cảm thấy ranh giới an toàn của mình đang bị đe dọa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bạn không bao giờ phải chịu đựng hay giải quyết các rắc rối một mình.", "Nếu bị đe dọa, xâm hại ranh giới hoặc đụng chạm trái phép, hãy báo ngay cho bố mẹ hoặc thầy cô.", "Tổng đài Quốc gia Bảo vệ Trẻ em 111 hoạt động miễn phí 24/7 để lắng nghe và bảo vệ bạn."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời đe dọa từ khóa trên", "body": "An bị một bạn khóa trên đe dọa sẽ đăng bức ảnh chụp trộm An lên nhóm chat của trường nếu không chịu đi chơi riêng. An vô cùng hoảng sợ."}', 3),
(@ml_id, 'interaction', '{"question": "An nên làm thế nào?", "choices": [{"text": "Im lặng làm theo vì quá sợ hãi lời đe dọa.", "correct": false, "emoji": "🛑"}, {"text": "Chụp màn hình bằng chứng, báo ngay cho bố mẹ/thầy cô và gọi tổng đài can thiệp 111.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có ghi nhớ số điện thoại 111 và số của người lớn đáng tin cậy nhất để gọi khi khẩn cấp không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tìm kiếm sự hỗ trợ không phải là yếu đuối. Đó là hành động dũng cảm để tự bảo vệ mình."]}', 6);

-- --- Micro Lesson 5.6: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Áp lực bạn bè & Điểm tựa hỗ trợ''! Bạn có 3 mạng để vượt qua 5 thử thách áp lực tâm lý nhóm. Khởi đầu!"}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Đối phó với áp lực đồng trang lứa",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Nhóm bạn thân đang tụ tập ở nhà một bạn học, lôi ra một thiết bị thuốc lá điện tử (vape) rực rỡ và rủ bạn hút thử một hơi lớn. Cả nhóm hùa vào khích tướng: ''Không hút là nhát gan, không nể mặt anh em chơi chung gì cả!''",
      "choices": [
        { "text": "Hút thử một hơi thật sâu để chứng tỏ bản thân cool ngầu và giữ hòa khí nhóm.", "nextNode": "fail_vape_try" },
        { "text": "Lớn tiếng giáo huấn cả nhóm về tác hại của vape đối với phổi.", "nextNode": "fail_lecture_group" },
        { "text": "Từ chối khéo léo nhưng dứt khoát: ''Tớ xin kiếu, phổi tớ nhạy cảm lắm, ngửi khói là ho sặc sụa rồi''.", "nextNode": "step2" }
      ]
    },
    "step2": {
      "text": "Một bạn trong nhóm bĩu môi cười cợt: ''Yếu đuối thế, thử một tí có chết ai đâu mà sợ!''",
      "choices": [
        { "text": "Cảm thấy tự ái, giật lấy vape để hút chứng minh mình không yếu.", "nextNode": "fail_pride" },
        { "text": "Kiên định cười vui: ''Tớ yếu thật mà, tớ chỉ mạnh môn bóng rổ thôi! Các cậu cứ chơi đi, tớ ra phòng khách xem tivi nha''.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Sau đó, một bạn trong nhóm đột ngột khóa cửa phòng lại và đe dọa không cho bạn ra ngoài nếu bạn không chịu uống cạn cốc nước ngọt đã pha cồn.",
      "choices": [
        { "text": "Sợ hãi nhắm mắt uống hết cốc nước để được thả ra.", "nextNode": "fail_alcohol" },
        { "text": "Chụp lại hình ảnh phòng khóa, kiên quyết yêu cầu mở cửa, đồng thời nhắn tin báo cho bố mẹ hoặc gọi tổng đài 111 hỗ trợ nếu tình hình căng thẳng.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Xuất sắc! Bạn đã từ chối áp lực nhóm thành công bằng thái độ kiên định, vui vẻ và bảo vệ sức khỏe của mình.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_vape_try": {
      "text": "❌ Sai rồi! Làm việc gây hại cho sức khỏe chỉ vì sợ đám đông tẩy chay là tự đánh mất ranh giới cá nhân.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_lecture_group": {
      "text": "❌ Chưa khéo. Lên giọng dạy đời bạn bè khi họ đang hưng phấn chỉ khiến họ phản kháng, cô lập bạn nhanh hơn thay vì có tính xây dựng.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_pride": {
      "text": "❌ Sai rồi! Nhượng bộ ranh giới sức khỏe chỉ vì lời thách thức hay khích tướng trẻ con là thiếu tự chủ.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_alcohol": {
      "text": "❌ Sai rồi! Uống đồ uống chứa chất kích thích/cồn dưới sự đe dọa cưỡng bức là vi phạm ranh giới an toàn của bạn. Hãy tìm kiếm sự hỗ trợ ngay lập tức.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại hành vi sau:",
  "leftBox": { "title": "Áp lực nhóm độc hại" },
  "rightBox": { "title": "Điểm tựa an toàn" },
  "items": [
    { "text": "Rủ rê thử vape hoặc chất kích thích để chứng tỏ bản thân", "correctBox": "left" },
    { "text": "Chia sẻ khó khăn với bố mẹ hoặc thầy cô giáo đáng tin", "correctBox": "right" },
    { "text": "Ép buộc bạn bè cô lập, nói xấu một học sinh mới", "correctBox": "left" },
    { "text": "Gọi điện đến Tổng đài Quốc gia 111 để tìm sự giúp đỡ", "correctBox": "right" },
    { "text": "Đe dọa phát tán thông tin riêng tư nếu không làm theo lời thách", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa ranh giới và định nghĩa an toàn sau:",
  "pairs": [
    { "left": "Áp lực đồng trang lứa", "right": "Sự thúc ép từ nhóm bạn khiến bạn làm điều nguy hiểm hoặc không muốn." },
    { "left": "Tổng đài 111", "right": "Đường dây nóng quốc gia hỗ trợ, tư vấn bảo vệ trẻ em miễn phí 24/7." },
    { "left": "Dũng khí đi ngược", "right": "Khả năng nói không và giữ vững lập trường trước đám đông thúc ép." },
    { "left": "Điểm tựa hỗ trợ", "right": "Những người lớn đáng tin cậy giúp bạn giải quyết các tình huống nguy hiểm." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa ranh giới điểm tựa:",
  "sentence": "Khi đối mặt với sự [blank1] từ bạn bè để làm điều sai trái, hãy kiên định [blank2], và nếu cảm thấy an toàn bị [blank3], hãy liên hệ ngay với người lớn đáng tin cậy hoặc gọi tổng đài [blank4].",
  "blanks": {
    "blank1": { "correct": "thúc ép", "placeholder": "..." },
    "blank2": { "correct": "từ chối", "placeholder": "..." },
    "blank3": { "correct": "đe dọa", "placeholder": "..." },
    "blank4": { "correct": "111", "placeholder": "..." }
  },
  "words": ["thúc ép", "từ chối", "đe dọa", "111", "đồng ý", "im lặng", "hùa theo", "bạn bè"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Khi ranh giới cơ thể của bạn bị xâm hại hoặc bạn bị đe dọa cưỡng ép trực tuyến, hành động nào sau đây là dũng cảm và chính xác nhất?",
  "enableLives": true,
  "choices": [
    { "text": "Im lặng chịu đựng, tự giải quyết một mình vì sợ bố mẹ mắng.", "correct": false, "emoji": "🥺" },
    { "text": "Nhượng bộ và làm theo yêu cầu của đối phương để họ không đe dọa nữa.", "correct": false, "emoji": "😐" },
    { "text": "Thu thập bằng chứng, chia sẻ ngay với người lớn đáng tin cậy và liên hệ tổng đài 111 để được hỗ trợ kịp thời.", "correct": true, "emoji": "💚" },
    { "text": "Đe dọa hoặc dùng bạo lực trả đũa lại đối phương.", "correct": false, "emoji": "🛑" }
  ]
}', 6);

-- =========================================================================
-- END OF SEED SCRIPT
-- =========================================================================
