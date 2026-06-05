-- =========================================================================
-- SEED DATA FOR COURSE: Tự Tin Lớn Lên, Tự Chủ Khám Phá
-- Maps to schemas in init.sql: courses, lessons, micro_lessons,
-- micro_lesson_blocks, and lesson_sources.
-- =========================================================================

SET NAMES utf8mb4;
USE educare;

-- 1. Thêm Khóa học mới
INSERT INTO courses (title, description, thumbnail, color_theme, course_order)
VALUES (
    'Tự Tin Lớn Lên, Tự Chủ Khám Phá',
    'Khóa học về sự đồng thuận, ranh giới cá nhân và phát triển lành mạnh dành cho tuổi teen.',
    'consent-course.png',
    '#4361ee',
    10
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

-- =========================================================================
-- END OF SEED SCRIPT
-- =========================================================================
