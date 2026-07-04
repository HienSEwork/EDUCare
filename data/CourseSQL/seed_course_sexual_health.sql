-- =========================================================================
-- SEED DATA FOR COURSE: Yêu An Toàn, Tránh Thai Chủ Động
-- Maps to schemas in init.sql: courses, lessons, micro_lessons,
-- micro_lesson_blocks, and lesson_sources.
-- =========================================================================

SET NAMES utf8mb4;
USE educare;

-- 1. Thêm Khóa học mới
INSERT INTO courses (title, description, thumbnail, color_theme, course_order, category_id)
VALUES (
    'Yêu An Toàn, Tránh Thai Chủ Động',
    'Trang bị kiến thức khoa học và thực tế về các biện pháp tránh thai chủ động, phòng ngừa bệnh lây qua đường tình dục (STI) và rèn luyện kỹ năng đưa ra quyết định an toàn.',
    'sexual-health-course.png',
    '#ff5d8f',
    40,
    1
);
SET @course_id = LAST_INSERT_ID();

-- =========================================================================
-- BÀI HỌC 1: Sức Khỏe Tình Dục Là Gì Thế?
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes, teaser_video_id, full_video_id)
VALUES (
    @course_id,
    'suc-khoe-tinh-duc-la-gi-the',
    'Sức Khỏe Tình Dục Là Gì Thế?',
    'Tìm hiểu định nghĩa toàn diện về sức khỏe tình dục, ranh giới cơ thể và cách vượt qua sự ngại ngùng.',
    'Bài học giúp bạn khám phá thế nào là sức khỏe tình dục toàn diện, cách xây dựng ranh giới cơ thể vững vàng và kỹ năng vượt qua những e ngại ban đầu.',
    1,
    true,
    100,
    8,
    NULL,
    NULL
);
SET @lesson1_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson1_id, 'Scarleteen - Sexual Health Basics', 'https://www.scarleteen.com/read/sexual-health', 'website');

-- --- Micro Lesson 1.1: Sức khỏe tình dục đâu chỉ là 'không bị bệnh'? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Sức khỏe tình dục đâu chỉ là ''không bị bệnh''?', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn nghĩ sức khỏe tình dục chỉ là chuyện đi khám bệnh hay phòng tránh thai?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sức khỏe tình dục là sự khỏe mạnh về thể chất, cảm xúc và tinh thần liên quan đến tình dục.", "Nó đi kèm sự tự tôn, tôn trọng đối phương và khả năng giao tiếp cởi mở.", "Tìm hiểu về cơ thể mình là bước đầu tiên để bảo vệ bản thân và đưa ra quyết định đúng đắn."]}', 2),
(@ml_id, 'scenario', '{"title": "Nỗi lo thầm kín", "body": "Nam cảm thấy lo lắng khi cơ thể có nhiều thay đổi và có những thắc mắc thầm kín nhưng không dám hỏi ai vì sợ bị bạn bè hay bố mẹ coi là ''hư hỏng''."}', 3),
(@ml_id, 'interaction', '{"question": "Bạn khuyên Nam nên làm gì?", "choices": [{"text": "Hỏi người lớn đáng tin hoặc dùng app EDUCare để tìm hiểu khoa học.", "correct": true, "emoji": "💚"}, {"text": "Tự mò mẫm xem các video trên web đen để bắt chước theo.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng cảm thấy ngượng ngùng khi có thắc mắc về cơ thể mình chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Sức khỏe tình dục bắt đầu từ việc hiểu, trân trọng và yêu thương cơ thể của chính mình."]}', 6);

-- --- Micro Lesson 1.2: Ranh giới cơ thể: Ai được quyền chạm vào bạn? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Ranh giới cơ thể: Ai được quyền chạm vào bạn?', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có biết mình hoàn toàn có quyền quyết định ai được chạm vào người mình và chạm ở mức nào không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Ranh giới cơ thể là giới hạn mà bạn đặt ra để bản thân cảm thấy an toàn và thoải mái.", "Không một ai, kể cả người yêu hay bạn thân, được phép chạm vào bạn nếu chưa được bạn đồng ý.", "Nói ''Không'' với những đụng chạm không mong muốn là quyền cơ bản của mỗi người."]}', 2),
(@ml_id, 'scenario', '{"title": "Bá vai khó chịu", "body": "Trong buổi liên hoan lớp, một bạn nam cứ liên tục bá vai ôm cổ làm Vy cảm thấy rất khó chịu. Vy muốn đẩy tay bạn ra nhưng sợ làm không khí lớp bị mất vui."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên làm gì để bảo vệ ranh giới của mình?", "choices": [{"text": "Nói rõ ràng và lịch sự: ''Tớ thấy hơi nóng, cậu bỏ tay ra nhé''.", "correct": true, "emoji": "💚"}, {"text": "Cố gắng cười trừ chịu đựng để giữ không khí vui vẻ cho cả lớp.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng cảm thấy khó chịu vì một đụng chạm của ai đó chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể của bạn là tài sản riêng của bạn. Hãy kiên quyết bảo vệ ranh giới của mình!"]}', 6);

-- --- Micro Lesson 1.3: Ngại ngùng khi nói về 'chuyện ấy' - Chuyện bình thường thôi! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Ngại ngùng khi nói về ''chuyện ấy'' - Chuyện bình thường thôi!', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao người lớn thường né tránh và tụi mình cũng thấy đỏ mặt khi nhắc đến hai chữ ''tình dục''?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cảm giác ngại ngùng là phản ứng tâm lý tự nhiên do giáo dục và văn hóa phương Đông.", "Tuy nhiên, né tránh không giúp tụi mình an toàn hơn, trái lại còn dễ dẫn đến hành vi thiếu chuẩn bị.", "Tìm hiểu về giới tính và tình dục một cách khoa học là biểu hiện của sự chín chắn và trưởng thành."]}', 2),
(@ml_id, 'scenario', '{"title": "Không khí sượng trân", "body": "Khi lớp học đến tiết sinh học về hệ sinh sản, cả lớp bắt đầu cười ồ lên và xì xào bàn tán làm giáo viên phải dừng lại. Không khí trong lớp trở nên rất sượng trân."}', 3),
(@ml_id, 'interaction', '{"question": "Thái độ nào thể hiện sự chín chắn khi học về giới tính?", "choices": [{"text": "Tập trung lắng nghe, đặt câu hỏi khoa học và nghiêm túc tìm hiểu.", "correct": true, "emoji": "💚"}, {"text": "Hùa theo cười đùa, bàn tán bằng những từ ngữ thô tục với bạn bè.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy thoải mái khi nói chuyện giới tính với bố mẹ hay thầy cô không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tìm hiểu về giới tính một cách khoa học là quyền lợi và là sự tự trọng của mỗi bạn trẻ."]}', 6);

-- --- Micro Lesson 1.4: Tình huống thực tế: Khi bị ép chạm vào người khác ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Tình huống thực tế: Khi bị ép chạm vào người khác', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có quyền từ chối chạm vào người khác ngay cả khi đó là người bạn cực kỳ quý mến không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đồng thuận đụng chạm phải luôn luôn đến từ hai phía một cách tự nguyện và hào hứng.", "Bị ép buộc chạm hoặc đồng ý chỉ vì nể, vì sợ bị ghét đều không phải là đồng thuận xịn.", "Bạn luôn có quyền từ chối hoặc đổi ý bất kỳ lúc nào."]}', 2),
(@ml_id, 'scenario', '{"title": "Mặc cả tình cảm", "body": "Người yêu nài nỉ An: ''Yêu nhau thì phải cho chạm vào người chứ, em không tin tưởng anh à?''. An chưa sẵn sàng nhưng sợ nếu từ chối sẽ bị người yêu giận dỗi đòi chia tay."}', 3),
(@ml_id, 'interaction', '{"question": "An nên ứng xử thế nào để thể hiện ranh giới cá nhân?", "choices": [{"text": "Kiên quyết giữ ranh giới: ''Em yêu anh nhưng em chưa sẵn sàng đụng chạm. Mong anh tôn trọng cảm xúc của em''.", "correct": true, "emoji": "💚"}, {"text": "Thỏa hiệp đồng ý đụng chạm để làm người yêu vui lòng và giữ gìn mối quan hệ.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng thỏa hiệp đồng ý làm điều gì đó chỉ vì sợ người yêu giận dỗi chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tình yêu lành mạnh không bao giờ đi kèm sự ép buộc hay cảm giác tội lỗi khi đặt ranh giới Extralarge."]}', 6);

-- --- Micro Lesson 1.5: Bắt sóng ranh giới: Cách check-in mượt mà ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bắt sóng ranh giới: Cách check-in mượt mà', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để hỏi ý kiến đối phương trước khi đụng chạm mà không làm bầu không khí bị sượng trân?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hỏi trước khi chạm không làm mất đi vẻ lãng mạn mà thể hiện sự tôn trọng chân thành.", "Dùng những câu hỏi ngắn gọn và ngọt ngào như: ''Tớ nắm tay cậu nhé?'', ''Cậu có thoải mái không?''.", "Luôn chú ý quan sát tín hiệu cơ thể: im lặng hay lảng tránh mắt là dấu hiệu họ chưa thoải mái."]}', 2),
(@ml_id, 'scenario', '{"title": "Lắng nghe tín hiệu cơ thể", "body": "Duy muốn nắm tay Linh khi hai đứa đi dạo. Duy băn khoăn không biết Linh có thích không vì Linh đang ôm balo trước ngực và mắt nhìn đi chỗ khác."}', 3),
(@ml_id, 'interaction', '{"question": "Duy nên xử lý tình huống này thế nào?", "choices": [{"text": "Dừng lại, đi bên cạnh Linh nói chuyện vui vẻ và chờ dịp thuận tiện khác hỏi ý kiến Linh.", "correct": true, "emoji": "💚"}, {"text": "Cứ tự ý luồn tay vào nắm chặt tay Linh để tạo bất ngờ lãng mạn.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thích đối phương hỏi ý kiến trước khi chạm vào mình hay thích họ tự ý hành động hơn?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hỏi ý kiến trước khi đụng chạm là Green Flag xịn nhất thể hiện sự tinh tế và tôn trọng đối phương."]}', 6);

-- --- Micro Lesson 1.6: Bạn đã thực sự sẵn sàng? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bạn đã thực sự sẵn sàng?', 6);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao biết mình đã đủ lớn và sẵn sàng cho một mối quan hệ gần gũi hay tiến xa hơn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sẵn sàng nghĩa là bạn hiểu rõ ranh giới, biết cách tự bảo vệ mình và hoàn toàn tự nguyện.", "Không có một độ tuổi chuẩn xác nào cho tất cả mọi người, mỗi người có nhịp độ phát triển riêng.", "Đừng tiến xa chỉ vì bạn bè xung quanh đã làm thế hoặc để chứng tỏ bản thân."]}', 2),
(@ml_id, 'scenario', '{"title": "Áp lực từ xung quanh", "body": "Đám bạn trong nhóm của Minh đều khoe đã có người yêu và bắt đầu đụng chạm thân mật. Minh cảm thấy rất sốt ruột và lạc loài dù thực lòng Minh chưa muốn yêu vào lúc này."}', 3),
(@ml_id, 'interaction', '{"question": "Bạn khuyên Minh nên làm gì?", "choices": [{"text": "Tôn trọng cảm xúc của bản thân, tập trung vào học tập và các sở thích cá nhân.", "correct": true, "emoji": "💚"}, {"text": "Cố tìm đại một bạn để yêu và tỏ ra sành điệu giống đám bạn thân.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang cảm thấy áp lực phải tiến nhanh giống như bạn bè xung quanh mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mỗi người có một nhịp độ phát triển riêng. Hãy tôn trọng và bảo vệ chính tốc độ của bản thân mình."]}', 6);

-- --- Micro Lesson 1.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Sức Khỏe Tình Dục Là Gì Thế''! Hãy cùng check-in ranh giới nhé."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Cuộc phiêu lưu: Bảo vệ ranh giới cá nhân", "startNode": "step1", "nodes": {"step1": {"text": "Bạn đang đi chơi riêng cùng người yêu mới. Người yêu xích lại gần định khoác vai bạn, nhưng bạn đang cảm thấy ngượng ngùng và chưa thoải mái.", "choices": [{"text": "Cố gắng chịu đựng để người yêu vui lòng.", "nextNode": "fail_submit"}, {"text": "Khẽ né vai ra một chút và nói nhẹ nhàng: ''Tớ thấy hơi nóng, tụi mình đi dạo tiếp nhé''.", "nextNode": "step2"}]}, "step2": {"text": "Người yêu bạn tỏ vẻ hơi buồn và hỏi: ''Cậu không thích tớ à? Sao cứ giữ khoảng cách hoài vậy?''. Bạn cảm thấy áy náy.", "choices": [{"text": "Đồng ý cho khoác vai để chuộc lỗi.", "nextNode": "fail_guilt"}, {"text": "Giải thích thẳng thắn: ''Tớ rất quý cậu nhưng tớ thích tụi mình tiến từ từ để tớ thấy thoải mái hơn''.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành thử thách! Bạn đã kiên định bảo vệ ranh giới cơ thể của mình và biết cách giao tiếp lịch sự tôn trọng mối quan hệ.", "isEnd": true, "isSuccess": true}, "fail_submit": {"text": "❌ Thất bại! Thỏa hiệp đụng chạm thể xác khi chưa thực sự thoải mái làm mờ ranh giới cá nhân của bạn.", "isEnd": true, "isSuccess": false}, "fail_guilt": {"text": "❌ Thất bại! Nhượng bộ chỉ vì cảm thấy áy nay hay tội lỗi sẽ khiến bạn mất quyền làm chủ cơ thể mình.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các hành vi đụng chạm sau vào đúng hộp cảm xúc:", "leftBox": {"title": "Đồng thuận xịn (Green Flag)"}, "rightBox": {"title": "Vi phạm ranh giới (Red Flag)"}, "items": [{"text": "Hỏi trước khi chạm: ''Tớ nắm tay cậu được không?''", "correctBox": "left"}, {"text": "Liên tục nài nỉ đụng chạm khi đối phương im lặng", "correctBox": "right"}, {"text": "Tự ý ôm từ phía sau khi đối phương đang tập trung làm việc", "correctBox": "right"}, {"text": "Tôn trọng khi đối phương nói ''Khoan đã, tớ thấy hơi nhanh''", "correctBox": "left"}, {"text": "Nói dỗi ''Yêu nhau thì phải cho chạm'' để ép đối phương", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp các khái niệm về ranh giới cá nhân sau:", "pairs": [{"left": "Ranh giới cơ thể", "right": "Giới hạn giúp bạn thấy an toàn và được tôn trọng đụng chạm."}, {"left": "Đồng thuận xịn", "right": "Sự đồng ý tự nguyện, đầy đủ thông tin và hào hứng từ cả hai."}, {"left": "Tín hiệu phòng thủ", "right": "Các biểu hiện co người, ôm balo, tránh né ánh mắt."}, {"left": "Check-in ranh giới", "right": "Hành động tinh tế hỏi ý kiến đối phương trước khi chạm."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp để hoàn thành đoạn văn về ranh giới cơ thể:", "sentence": "Cơ thể của bạn là của riêng [blank1]. Không ai được quyền [blank2] vào bạn nếu không được bạn đồng ý. Khi cảm thấy chưa sẵn sàng, bạn hoàn toàn có quyền nói [blank3]. Tình yêu lành mạnh phải dựa trên sự [blank4] ranh giới của nhau.", "blanks": {"blank1": {"correct": "bạn", "placeholder": "..."}, "blank2": {"correct": "chạm", "placeholder": "..."}, "blank3": {"correct": "không", "placeholder": "..."}, "blank4": {"correct": "tôn trọng", "placeholder": "..."}}, "words": ["bạn", "chạm", "không", "tôn trọng", "bố mẹ", "ép buộc", "có", "nghi ngờ"]}', 5),
(@ml_id, 'interaction', '{"question": "Nếu đối phương có tín hiệu co người lại hoặc tránh né ánh mắt khi bạn tiến lại gần, phản ứng tinh tế nhất của bạn là gì?", "enableLives": true, "choices": [{"text": "Dừng lại, giữ khoảng cách và nói chuyện thoải mái tự nhiên.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục tiến tới nắm tay để giúp họ bớt e ngại.", "correct": false, "emoji": "😐"}, {"text": "Tỏ thái độ giận dỗi vì nghĩ họ ghét mình.", "correct": false, "emoji": "🛑"}]}', 6);

-- =========================================================================
-- BÀI HỌC 2: Bản Đồ Tránh Thai - Bắt Đầu Từ Đâu?
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes, teaser_video_id, full_video_id)
VALUES (
    @course_id,
    'ban-do-tranh-thai-bat-dau-tu-dau',
    'Bản Đồ Tránh Thai - Bắt Đầu Từ Đâu?',
    'Khám phá cơ chế dính bầu cơ bản và phân loại các loại vũ khí tránh thai chính.',
    'Bài học giúp bạn tìm hiểu cơ chế sinh học đằng sau việc mang thai ngoài ý muốn và giới thiệu bức tranh toàn cảnh về các nhóm biện pháp tránh thai.',
    2,
    true,
    100,
    8,
    NULL,
    NULL
);
SET @lesson2_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson2_id, 'Scarleteen - Birth Control Bingo', 'https://www.scarleteen.com/read/sexual-health/birth-control-bingo', 'website');

-- --- Micro Lesson 2.1: Em bé đến từ đâu? (Cơ chế thụ thai cơ bản) ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Em bé đến từ đâu? (Cơ chế thụ thai cơ bản)', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào mà việc gần gũi thân mật lại có thể dẫn đến sự hình thành của một em bé?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mang thai diễn ra khi tinh trùng của bạn nam gặp và thụ tinh với trứng của bạn nữ.", "Sau đó, trứng đã thụ tinh di chuyển vào làm tổ tại tử cung để phát triển thành thai nhi.", "Để tránh thai, tụi mình cần chặn trứng rụng, chặn tinh trùng bơi vào gặp trứng, hoặc chặn làm tổ."]}', 2),
(@ml_id, 'scenario', '{"title": "Lầm tưởng ngây thơ", "body": "Hòa tin vào lời đồn trên mạng rằng quan hệ lần đầu tiên thì không thể dính bầu, hoặc nhảy lên nhảy xuống sau quan hệ sẽ làm trôi tinh trùng ra ngoài."}', 3),
(@ml_id, 'interaction', '{"question": "Quan niệm quan hệ lần đầu không dính bầu là đúng hay sai?", "choices": [{"text": "Sai hoàn toàn. Cơ thể luôn sẵn sàng thụ thai nếu có sự gặp gỡ của trứng và tinh trùng.", "correct": true, "emoji": "💚"}, {"text": "Đúng thế, lần đầu tử cung chưa mở nên an toàn.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng nghe hoặc tin vào lời đồn tránh thai kỳ lạ nào chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Khoa học sinh sản không phân biệt lần đầu hay lần sau. Gần gũi không bảo vệ đều có nguy cơ dính bầu!"]}', 6);

-- --- Micro Lesson 2.2: Phân biệt các loại tránh thai: Rào chắn vs Nội tiết vs LARC ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Phân biệt các loại tránh thai: Rào chắn vs Nội tiết vs LARC', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Thế giới tránh thai vô cùng đa dạng, làm sao để phân biệt được các loại vũ khí bảo vệ này?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nhóm rào chắn: Chặn tiếp xúc trực tiếp (ví dụ: Bao cao su, bao nữ).", "Nhóm nội tiết: Dùng hormone ngăn buồng trứng rụng trứng (ví dụ: Thuốc hàng ngày, miếng dán, vòng âm đạo).", "Nhóm lâu dài LARC: Set-and-forget, kéo dài 3-10 năm (que cấy, vòng tránh thai IUD)."]}', 2),
(@ml_id, 'scenario', '{"title": "Hoa mắt trước lựa chọn", "body": "Mai lướt web tìm kiếm biện pháp tránh thai và thấy hàng chục loại khác nhau: que cấy, vòng, bao, miếng dán... Mai không biết phân nhóm chúng như thế nào để dễ tìm hiểu."}', 3),
(@ml_id, 'interaction', '{"question": "Biện pháp tránh thai nào vừa ngừa thai vừa ngăn được bệnh lây qua đường tình dục (STI)?", "choices": [{"text": "Bao cao su (Nhóm rào chắn).", "correct": true, "emoji": "💚"}, {"text": "Que cấy tránh thai dưới da hoặc vòng tránh thai (Nhóm LARC).", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thấy nhóm tránh thai nào có vẻ phù hợp nhất với thói quen sinh hoạt của mình?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bao cao su là biện pháp duy nhất thuộc nhóm rào chắn bảo vệ bạn 2-trong-1 khỏi cả thai ngoài ý muốn và STI."]}', 6);

-- --- Micro Lesson 2.3: Nỗi sợ 'hai vạch' và gánh nặng tránh thai ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Nỗi sợ ''hai vạch'' và gánh nặng tránh thai', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao gánh nặng tránh thai thường mặc định đè nặng lên vai bạn nữ, điều này có công bằng không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nỗi sợ dính bầu ngoài ý muốn thường khiến bạn nữ lo lắng hơn vì trực tiếp mang thai.", "Tuy nhiên, an toàn tình dục là trách nhiệm chung của cả hai phía.", "Bạn nam chủ động chia sẻ gánh nặng bằng việc chuẩn bị bao cao su hoặc đồng hành tìm hiểu biện pháp."]}', 2),
(@ml_id, 'scenario', '{"title": "Nỗi lo cô độc", "body": "Vy liên tục mất ăn mất ngủ lo sợ dính bầu sau khi quan hệ không an toàn. Trong khi đó, người yêu Vy thản nhiên nói: ''Dính thì cùng lắm là cưới thôi có gì mà phải lo lắng dữ vậy''."}', 3),
(@ml_id, 'interaction', '{"question": "Hành vi của người yêu Vy thể hiện điều gì?", "choices": [{"text": "Red flag! Vô trách nhiệm và thiếu thấu hiểu gánh nặng tâm lý và thể chất của bạn nữ.", "correct": true, "emoji": "🚩"}, {"text": "Sự lạc quan, mạnh mẽ giúp giải tỏa tâm lý lo sợ cho Vy.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn nghĩ bạn nam nên đồng hành cùng bạn nữ thế nào trong việc tránh thai?"}', 5),
(@ml_id, 'takeaway', '{"items": ["An toàn tình dục là câu chuyện của hai người. Hãy cùng nhau gánh vác trách nhiệm bảo vệ!"]}', 6);

-- --- Micro Lesson 2.4: Nhận diện hiệu quả thực tế vs Lý thuyết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Nhận diện hiệu quả thực tế vs Lý thuyết', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao có những biện pháp được quảng cáo hiệu quả 99% nhưng thực tế vẫn có nhiều người dính bầu?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hiệu quả lý thuyết (Perfect Use): Đạt được khi sử dụng hoàn hảo tuyệt đối không sai sót.", "Hiệu quả thực tế (Typical Use): Thấp hơn do lỗi từ người dùng (quên thuốc, bao rách, rút không kịp).", "Để tăng độ an toàn, hãy chọn biện pháp ít phụ thuộc vào trí nhớ hoặc kết hợp bảo vệ kép."]}', 2),
(@ml_id, 'scenario', '{"title": "Con số và thực tế", "body": "Nam đọc thấy bao cao su hiệu quả 98% nên tự tin dùng bừa bãi (xé bằng răng, đeo muộn, dùng dầu dừa làm chất bôi trơn). Kết quả là bạn gái Nam trễ kinh."}', 3),
(@ml_id, 'interaction', '{"question": "Lý do hiệu quả thực tế của bao cao su bị giảm sút là gì?", "choices": [{"text": "Do người dùng sử dụng sai kỹ thuật, làm rách hoặc tuột bao.", "correct": true, "emoji": "💚"}, {"text": "Do nhà sản xuất luôn khai khống số liệu quảng cáo.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng học kỹ thuật sử dụng đúng cách để đạt hiệu quả ngừa thai tối đa không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Vũ khí tốt đến mấy cũng vô dụng nếu dùng sai cách. Hãy nắm chắc kỹ năng sử dụng!"]}', 6);

-- --- Micro Lesson 2.5: Cùng partner trò chuyện về tránh thai ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Cùng partner trò chuyện về tránh thai', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để khơi gợi cuộc trò chuyện về tránh thai với người yêu mà không gây mất hứng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Trò chuyện về tránh thai trước khi quan hệ là biểu hiện của sự tôn trọng và nghiêm túc.", "Hãy bắt đầu lúc cả hai đang tỉnh táo, thư giãn (không phải lúc chuẩn bị lâm trận).", "Dùng câu mở đầu đơn giản: ''Tớ muốn tụi mình nói chuyện về cách bảo vệ để cả hai cùng an tâm''."]}', 2),
(@ml_id, 'scenario', '{"title": "Cuộc nói chuyện ngập ngừng", "body": "Trang muốn bàn với người yêu về việc dùng bao cao su cho lần đi chơi xa sắp tới. Nhưng Trang e ngại người yêu sẽ nghĩ mình là người thích kiểm soát và quá tính toán."}', 3),
(@ml_id, 'interaction', '{"question": "Trang nên bắt đầu cuộc nói chuyện thế nào?", "choices": [{"text": "Bày tỏ rõ ràng: ''Tớ muốn tụi mình an tâm tận hưởng chuyến đi, nên tớ muốn bàn trước về chuyện bảo vệ nhé''.", "correct": true, "emoji": "💚"}, {"text": "Im lặng chờ đến lúc đi chơi rồi mới lôi bao cao su ra ép người yêu dùng.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy tự tin khi bàn bạc thẳng thắn về tránh thai với partner của mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Trò chuyện thẳng thắn về bảo vệ là chất xúc tác giúp mối quan hệ bền vững và an toàn hơn."]}', 6);

-- --- Micro Lesson 2.6: Tự chọn 'vũ khí' bảo vệ bản thân ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Tự chọn ''vũ khí'' bảo vệ bản thân', 6);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Không có biện pháp tránh thai nào là tốt nhất, chỉ có biện pháp hợp nhất với bạn. Bạn dựa vào đâu để chọn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Dựa vào thói quen sinh hoạt (bạn có nhớ uống thuốc mỗi ngày đúng giờ không?).", "Dựa vào tình trạng sức khỏe (bạn có bị dị ứng cao su hay chống chỉ định hormone không?).", "Dựa vào mức độ riêng tư và tài chính của bản thân để đưa ra lựa chọn lâu dài."]}', 2),
(@ml_id, 'scenario', '{"title": "Lựa chọn cho riêng mình", "body": "Linh băn khoăn giữa uống thuốc tránh thai hàng ngày và dùng bao cao su. Linh là người hay quên lịch và cũng rất e ngại nếu bị gia đình nhìn thấy vỉ thuốc."}', 3),
(@ml_id, 'interaction', '{"question": "Phương án nào an toàn và tiện lợi nhất cho Linh lúc này?", "choices": [{"text": "Dùng bao cao su mỗi lần quan hệ, kết hợp mang theo ví riêng tư.", "correct": true, "emoji": "💚"}, {"text": "Uống thuốc hàng ngày và đặt chuông báo thức, chấp nhận rủi ro bị phát hiện.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn nghĩ yếu tố nào quan trọng nhất với bạn khi chọn phương pháp tránh thai?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hãy thấu hiểu bản thân và lối sống của mình để đưa ra lựa chọn bảo vệ thông thái nhất."]}', 6);

-- --- Micro Lesson 2.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Bản Đồ Tránh Thai''! Hãy cùng tìm kiếm vũ khí phù hợp nhé."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Cuộc phiêu lưu: Bản đồ tránh thai", "startNode": "step1", "nodes": {"step1": {"text": "Bạn muốn lựa chọn một biện pháp tránh thai chủ động cho mối quan hệ của mình. Bạn bắt đầu từ việc thu thập thông tin.", "choices": [{"text": "Tin vào lời đồn quan hệ lần đầu thì không thể mang thai để khỏi phải chuẩn bị gì.", "nextNode": "fail_myth"}, {"text": "Tìm hiểu khoa học để phân loại các nhóm biện pháp: Rào chắn, Nội tiết, LARC.", "nextNode": "step2"}]}, "step2": {"text": "Bạn nhận ra mình là người rất hay quên và có thói quen sinh hoạt không cố định giờ giấc.", "choices": [{"text": "Chọn uống thuốc tránh thai hàng ngày vì nghe nói hiệu quả 99% lý thuyết.", "nextNode": "fail_forget"}, {"text": "Chọn dùng bao cao su mỗi khi quan hệ hoặc cân nhắc que cấy tránh thai rảnh tay.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Chúc mừng! Bạn đã phân loại đúng các nhóm tránh thai và chọn được phương pháp phù hợp nhất với thói quen của bản thân.", "isEnd": true, "isSuccess": true}, "fail_myth": {"text": "❌ Thất bại! Cơ thể sinh học luôn sẵn sàng thụ thai nếu có sự gặp gỡ giữa trứng và tinh trùng, không phân biệt số lần quan hệ.", "isEnd": true, "isSuccess": false}, "fail_forget": {"text": "❌ Thất bại! Người hay quên lịch uống thuốc hàng ngày rất dễ gặp sự cố vỡ kế hoạch do nồng độ hormone không được duy trì đều đặn.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các biện pháp tránh thai sau vào đúng nhóm kỹ thuật:", "leftBox": {"title": "Nhóm Nội tiết & Lâu dài"}, "rightBox": {"title": "Nhóm Rào chắn & Tự nhiên"}, "items": [{"text": "Thuốc tránh thai hàng ngày vỉ 28 viên", "correctBox": "left"}, {"text": "Bao cao su nam làm bằng latex", "correctBox": "right"}, {"text": "Que cấy tránh thai dưới da cánh tay", "correctBox": "left"}, {"text": "Xuất tinh ngoài trước khi xuất tinh", "correctBox": "right"}, {"text": "Vòng tránh thai nội tiết IUD", "correctBox": "left"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp các phương pháp tránh thai với hiệu quả của chúng:", "pairs": [{"left": "Perfect Use", "right": "Hiệu quả tránh thai đạt được khi sử dụng hoàn hảo không lỗi."}, {"left": "Typical Use", "right": "Hiệu quả thực tế bị giảm do quên thuốc hoặc dùng sai cách."}, {"left": "Bao cao su", "right": "Biện pháp rào chắn duy nhất bảo vệ kép ngừa cả thai và STI."}, {"left": "LARC", "right": "Các biện pháp tránh thai lâu dài rảnh tay kéo dài 3-10 năm."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp để hoàn thành đoạn văn về hiệu quả tránh thai:", "sentence": "Có sự khác biệt lớn giữa hiệu quả [blank1] và hiệu quả thực tế của biện pháp tránh thai. Sự chênh lệch này là do lỗi [blank2] của người dùng. Để bảo vệ an toàn kép, bạn nên dùng [blank3] để ngăn ngừa cả [blank4].", "blanks": {"blank1": {"correct": "lý thuyết", "placeholder": "..."}, "blank2": {"correct": "sử dụng", "placeholder": "..."}, "blank3": {"correct": "bao cao su", "placeholder": "..."}, "blank4": {"correct": "bệnh STI", "placeholder": "..."}}, "words": ["lý thuyết", "sử dụng", "bao cao su", "bệnh STI", "thực tế", "nhà sản xuất", "thuốc khẩn cấp", "chu kỳ"]}', 5),
(@ml_id, 'interaction', '{"question": "Ai là người chịu trách nhiệm chuẩn bị và thực hành các biện pháp tránh thai chủ động?", "enableLives": true, "choices": [{"text": "Cả hai bạn cùng thảo luận và chia sẻ trách nhiệm bảo vệ lẫn nhau.", "correct": true, "emoji": "💚"}, {"text": "Mặc định thuộc về bạn nữ vì bạn nữ là người có nguy cơ mang thai.", "correct": false, "emoji": "😐"}, {"text": "Chỉ thuộc về bạn nam vì bạn nam là người chủ động đụng chạm.", "correct": false, "emoji": "🛑"}]}', 6);

-- =========================================================================
-- BÀI HỌC 3: "Hiệp Sĩ" Bao Cao Su
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes, teaser_video_id, full_video_id)
VALUES (
    @course_id,
    'hiep-si-bao-cao-su',
    '"Hiệp Sĩ" Bao Cao Su',
    'Làm chủ kỹ năng sử dụng bao cao su chuẩn chỉnh và kỹ năng thương lượng an toàn.',
    'Bài học cung cấp hướng dẫn từng bước để sử dụng bao cao su nam đúng cách, đồng thời trang bị kỹ năng thương lượng sử dụng bao cao su khi gặp sự phản đối.',
    3,
    true,
    100,
    10,
    NULL,
    NULL
);
SET @lesson3_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson3_id, 'Scarleteen - Condom Basics: User''s Manual', 'https://www.scarleteen.com/read/sexual-health/condom-basics-users-manual', 'website');

-- --- Micro Lesson 3.1: Người bảo vệ 2-trong-1 ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Người bảo vệ 2-trong-1', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có biết loại ''áo giáp'' nào vừa ngăn mang thai ngoài ý muốn, vừa chặn đứng các bệnh lây qua đường tình dục (STI) không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bao cao su (BCS) chính là ''hiệp sĩ'' đa năng nhất trong thế giới tránh thai.", "Hoạt động như một bức tường ngăn không cho tinh dịch tiếp xúc với cơ thể đối phương.", "Nhờ đó, tinh trùng không gặp được trứng, và vi khuẩn/virus cũng không có đường lây lan."]}', 2),
(@ml_id, 'scenario', '{"title": "Ý định bất ngờ", "body": "Huy và Mai đang ôm nhau xem phim. Không khí bắt đầu nóng lên. Huy thầm nghĩ: ''Mình chưa chuẩn bị gì cả, nhưng chắc không sao đâu nhỉ?''. Mai thì lo lắng vì cả hai chưa ai dùng biện pháp bảo vệ nào."}', 3),
(@ml_id, 'interaction', '{"question": "Bạn khuyên Mai nên nhắn hoặc trả lời thế nào?", "choices": [{"text": "Dạ... tùy cậu á.", "correct": false, "emoji": "🛑"}, {"text": "Phải có bao cao su mới đi tiếp được nha cậu ơi! An toàn là trên hết.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng ngại ngùng khi nghĩ đến việc yêu cầu đối phương dùng bao cao su chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bao cao su là cách duy nhất bảo vệ bạn khỏi cả hai mối lo: mang thai ngoài ý muốn và các bệnh STI."]}', 6);

-- --- Micro Lesson 3.2: 5 bước mặc "áo giáp" chuẩn chỉnh ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, '5 bước mặc "áo giáp" chuẩn chỉnh', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Dùng bao cao su thì dễ, nhưng dùng đúng cách để không bị rách hay tuột thì bạn đã chắc chắn chưa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bước 1: Check hạn sử dụng & vỏ bao phải còn phồng hơi.", "Bước 2: Xé vỏ bằng tay theo đường răng cưa, tránh dùng răng hay kéo.", "Bước 3: Xác định đúng chiều vành bao hướng ra ngoài.", "Bước 4: Bóp nhẹ đầu bao để đuổi hết không khí thừa trước khi vuốt.", "Bước 5: Vuốt bao phủ kín cậu bé từ đầu đến gốc khi đang cương cứng."]}', 2),
(@ml_id, 'scenario', '{"title": "Xé bao vội vã", "body": "Trong bóng tối, Nam cuống cuồng xé vỏ bao cao su bằng răng vì không tìm thấy kéo. Kết quả là bao bị xước nhẹ một vết nhỏ mà Nam không hề hay biết."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động xé bao bằng răng của Nam là đúng hay sai?", "choices": [{"text": "Đúng chứ, nhanh gọn lẹ là tốt mà.", "correct": false, "emoji": "🛑"}, {"text": "Sai hoàn toàn. Chỉ dùng tay xé nhẹ theo đường răng cưa trên vỏ bao thôi.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có tự tin mình có thể hướng dẫn lại cho người khác cách dùng bao cao su đúng chuẩn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Một lỗi nhỏ khi dùng bao cũng có thể làm mất đi tác dụng bảo vệ. Hãy cẩn thận từng bước nhé!"]}', 6);

-- --- Micro Lesson 3.3: Vượt ải ngại ngùng khi đi mua bao ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Vượt ải ngại ngùng khi đi mua bao', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn đã bao giờ đứng trước cửa hàng tiện lợi 15 phút, giả vờ mua chai nước chỉ vì không dám với tay lấy hộp bao cao su?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cảm giác ngượng ngùng sợ bị đánh giá là hoàn toàn bình thường ở tuổi teen.", "Thực tế, nhân viên bán hàng coi đây là một mặt hàng sức khỏe bình thường như khẩu trang hay băng cá nhân.", "Mua bao cao su chứng tỏ bạn là người trưởng thành, văn minh và biết tự chịu trách nhiệm."]}', 2),
(@ml_id, 'scenario', '{"title": "Đỏ mặt trước quầy", "body": "Linh muốn mua bao cao su để sẵn trong ví cho an toàn. Nhưng khi đứng trước quầy thu ngân có vài người lớn đang xếp hàng, Linh đỏ mặt và tim đập thình thịch, định bỏ chạy ra ngoài."}', 3),
(@ml_id, 'interaction', '{"question": "Mẹo nào giúp Linh vượt qua nỗi ngại này hiệu quả nhất?", "choices": [{"text": "Mua online qua các app giao hàng hoặc tự nhủ mình đang làm việc cực kỳ trách nhiệm.", "correct": true, "emoji": "💚"}, {"text": "Nhờ một đứa bạn thân đi mua hộ rồi đứng ngoài chờ.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn nghĩ sao về việc một bạn nữ chủ động đi mua và chuẩn bị bao cao su?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mua bao cao su không có gì là xấu hổ. Đó là biểu hiện của một người có trách nhiệm và biết tự chủ."]}', 6);

-- --- Micro Lesson 3.4: Khi đối phương từ chối dùng bao ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Khi đối phương từ chối dùng bao', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn sẽ làm gì nếu đối phương thầm thì: ''Dùng bao mất cảm giác lắm, lần này không dùng nha, tớ hứa sẽ cẩn thận''?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Ép buộc hoặc nài nỉ từ bỏ bao cao su là hành vi vi phạm ranh giới an toàn của bạn.", "Không có lời hứa ''cẩn thận'' hay ''rút kịp'' nào đảm bảo an toàn 100%.", "Cảm xúc thăng hoa nhất chỉ có được khi cả hai hoàn toàn yên tâm và tin tưởng lẫn nhau."]}', 2),
(@ml_id, 'scenario', '{"title": "Lựa chọn khó xử", "body": "Hoàng nói với Vy: ''Anh yêu em mà, em không tin tưởng anh sao mà bắt dùng bao? Anh hứa sẽ rút ra đúng lúc''. Vy thấy khó xử, sợ Hoàng giận nhưng trong lòng đầy lo lắng và bất an."}', 3),
(@ml_id, 'interaction', '{"question": "Giúp Vy gửi tin nhắn từ chối kiên quyết nhưng vẫn mượt mà:", "choices": [{"text": "Nếu anh thực sự yêu và tôn trọng em, anh sẽ cùng em dùng bao cao su để cả hai cùng an tâm.", "correct": true, "emoji": "💚"}, {"text": "Thôi được rồi, chỉ lần này thôi đó nha...", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng đồng ý làm một việc mình không thoải mái chỉ vì sợ người yêu giận chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Không có bao cao su = Không đi tiếp. Người thực sự yêu bạn sẽ luôn đặt sự an toàn của bạn lên trên hết."]}', 6);

-- --- Micro Lesson 3.5: Cấp cứu khi bao cao su gặp sự cố ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Cấp cứu khi bao cao su gặp sự cố', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chuyện gì sẽ xảy ra nếu đang giữa cuộc vui mà chiếc bao đột ngột bị rách hoặc tuột ra ngoài?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đừng hoảng loạn! Dừng cuộc chơi ngay lập tức.", "Nhẹ nhàng rút bao ra ngoài nếu bị kẹt.", "Tuyệt đối không thụt rửa sâu âm đạo vì hành động này đẩy tinh dịch vào trong nhanh hơn.", "Mua và uống thuốc tránh thai khẩn cấp càng sớm càng tốt trong vòng 72 giờ."]}', 2),
(@ml_id, 'scenario', '{"title": "Sự cố bất ngờ", "body": "Sau khi quan hệ, Minh phát hiện bao cao su đã bị tuột và nằm lại bên trong cơ thể An. Cả hai mặt cắt không còn một giọt máu, An định chạy đi tắm và thụt rửa thật mạnh."}', 3),
(@ml_id, 'interaction', '{"question": "Bạn khuyên An nên làm gì lúc này?", "choices": [{"text": "Bình tĩnh lấy bao ra ngoài và đi mua ngay thuốc tránh thai khẩn cấp để uống.", "correct": true, "emoji": "💚"}, {"text": "Tắm rửa ngay lập tức và dùng vòi xịt thụt rửa thật sâu để trôi tinh dịch.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có biết hiệu thuốc gần nhà mình nhất nằm ở đâu để phòng trường hợp khẩn cấp không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Sự cố xảy ra cần hành động nhanh và đúng cách. Uống thuốc tránh thai khẩn cấp là cứu cánh tốt nhất lúc này."]}', 6);

-- --- Micro Lesson 3.6: Bạn nghĩ sao về việc chủ động chuẩn bị? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Bạn nghĩ sao về việc chủ động chuẩn bị?', 6);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Việc chuẩn bị sẵn bao cao su trong ví hay túi xách có làm bạn trông giống như ''đang tìm kiếm chuyện ấy''?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nhiều người nghĩ chuẩn bị sẵn bao cao su nghĩa là lăng nhăng hoặc luôn muốn làm chuyện đó.", "Thực tế, đó là biểu hiện của sự chín chắn, có trách nhiệm và tôn trọng cơ thể mình.", "Yêu an toàn đòi hỏi sự chuẩn bị, và người có sự chuẩn bị là người làm chủ cuộc chơi."]}', 2),
(@ml_id, 'scenario', '{"title": "Ngăn nhỏ ví trang điểm", "body": "Chi muốn để một chiếc bao cao su vào ngăn nhỏ của ví trang điểm. Nhưng Chi sợ nếu mẹ hoặc bạn bè vô tình nhìn thấy, họ sẽ nghĩ Chi là cô gái ''không ngoan''."}', 3),
(@ml_id, 'interaction', '{"question": "Quan niệm nào sau đây là văn minh và chín chắn nhất?", "choices": [{"text": "Chủ động chuẩn bị bao cao su là tự bảo vệ sức khỏe và tương lai của chính mình.", "correct": true, "emoji": "💚"}, {"text": "Chỉ có bạn nam mới cần chuẩn bị bao cao su, bạn nữ chuẩn bị trông rất kỳ cục.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy tôn trọng một người bạn tình luôn chủ động chuẩn bị biện pháp an toàn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chuẩn bị trước bao cao su không phải là hư hỏng, đó là cách bạn tự làm chủ sự an toàn của cuộc đời mình."]}', 6);

-- --- Micro Lesson 3.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Hiệp Sĩ Bao Cao Su''! Bạn có 3 mạng để chứng minh mình là Bậc thầy Bảo vệ."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Cuộc phiêu lưu: Đồng hành cùng bao cao su", "startNode": "step1", "nodes": {"step1": {"text": "Bạn và partner đang chuẩn bị thân mật. Bạn muốn sử dụng bao cao su để bảo vệ cả hai. Bạn lục tìm trong túi đồ và thấy hai lựa chọn.", "choices": [{"text": "Dùng chiếc bao cao su đã để dưới đáy ví da của bạn gần một năm nay.", "nextNode": "fail_wallet"}, {"text": "Lấy một chiếc bao cao su mới từ hộp cất trong tủ, kiểm tra hạn sử dụng và thấy vỏ bao còn phồng khí.", "nextNode": "step2"}]}, "step2": {"text": "Bạn chuẩn bị mở vỏ bao ra. Do không tìm thấy kéo, partner đề xuất dùng răng xé cho nhanh.", "choices": [{"text": "Đồng ý dùng răng xé để không làm gián đoạn cuộc vui.", "nextNode": "fail_teeth"}, {"text": "Từ chối và dùng đầu ngón tay xé nhẹ theo mép đường răng cưa của vỏ bao.", "nextNode": "step3"}]}, "step3": {"text": "Trong quá trình quan hệ, bạn bỗng phát hiện bao cao su bị rách. Đối phương hốt hoảng định chạy đi thụt rửa âm đạo bằng xà phòng.", "choices": [{"text": "Ủng hộ đi thụt rửa ngay lập tức để trôi hết tinh dịch ra ngoài.", "nextNode": "fail_panic"}, {"text": "Dừng lại ngay, tháo bao ra và đi mua thuốc tránh thai khẩn cấp để uống càng sớm càng tốt.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Tuyệt vời! Bạn đã vượt qua thử thách một cách bình tĩnh và nắm chắc các bước sử dụng bao cao su an toàn.", "isEnd": true, "isSuccess": true}, "fail_wallet": {"text": "❌ Thất bại! Bao cao su để trong ví lâu ngày chịu nhiệt độ cao và ma sát dễ bị giòn, rách và mất tác dụng bảo vệ.", "isEnd": true, "isSuccess": false}, "fail_teeth": {"text": "❌ Thất bại! Dùng răng xé bao cao su rất dễ tạo ra các vết rách cực nhỏ trên cao su mà mắt thường không nhìn thấy được.", "isEnd": true, "isSuccess": false}, "fail_panic": {"text": "❌ Thất bại! Thụt rửa âm đạo không những không ngừa được thai mà còn đẩy tinh trùng vào sâu hơn và gây viêm nhiễm phụ khoa.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các hành động sử dụng bao cao su sau đây vào đúng hộp:", "leftBox": {"title": "Sử dụng đúng"}, "rightBox": {"title": "Sai lầm nguy hiểm"}, "items": [{"text": "Bóp nhẹ đầu bao để đuổi không khí ra ngoài trước khi đeo", "correctBox": "left"}, {"text": "Dùng chung hai bao cao su cùng lúc để tăng gấp đôi độ an toàn", "correctBox": "right"}, {"text": "Tái sử dụng bao cao su sau khi đã rửa sạch bằng nước ấm", "correctBox": "right"}, {"text": "Xé vỏ bao nhẹ nhàng bằng tay theo đường răng cưa", "correctBox": "left"}, {"text": "Dùng chất bôi trơn dạng dầu (như vaseline) chung với bao cao su latex", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp các quy tắc kỹ thuật khi dùng bao cao su sau:", "pairs": [{"left": "Xé vỏ bằng tay", "right": "Tránh làm trầy xước hoặc rách bao cao su bên trong."}, {"left": "Bóp nhẹ đầu bao", "right": "Loại bỏ không khí thừa để tránh bao bị nổ khi sử dụng."}, {"left": "Bao cao su hết hạn", "right": "Lớp cao su bị khô và dễ rách, mất tính đàn hồi."}, {"left": "Chất bôi trơn gốc nước", "right": "An toàn và không làm hỏng cấu trúc bao cao su latex."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về bao cao su:", "sentence": "Bao cao su là biện pháp duy nhất vừa giúp ngừa [blank1] vừa ngăn chặn các bệnh [blank2]. Khi gặp sự cố rách bao, bạn cần [blank3] cuộc vui ngay lập tức và sử dụng thuốc tránh thai [blank4] trong vòng 72 giờ.", "blanks": {"blank1": {"correct": "mang thai", "placeholder": "..."}, "blank2": {"correct": "lây qua đường tình dục", "placeholder": "..."}, "blank3": {"correct": "dừng", "placeholder": "..."}, "blank4": {"correct": "khẩn cấp", "placeholder": "..."}}, "words": ["mang thai", "lây qua đường tình dục", "dừng", "khẩn cấp", "tiếp tục", "hàng ngày", "rửa sạch", "nài nỉ"]}', 5),
(@ml_id, 'interaction', '{"question": "Nếu đối phương từ chối dùng bao cao su vì cho rằng ''mất cảm giác'', phản ứng nào thể hiện ranh giới thông thái của bạn?", "enableLives": true, "choices": [{"text": "Tặc lưỡi đồng ý vì không muốn làm cụt hứng.", "correct": false, "emoji": "😐"}, {"text": "Kiên quyết từ chối: Không dùng bao thì dừng lại. An toàn của cả hai là trên hết.", "correct": true, "emoji": "💚"}, {"text": "Giận dỗi bỏ về và chặn liên lạc ngay lập tức.", "correct": false, "emoji": "🛑"}]}', 6);

-- =========================================================================
-- BÀI HỌC 4: Viên Thuốc Nhỏ Bé & Nội Tiết Tránh Thai
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes, teaser_video_id, full_video_id)
VALUES (
    @course_id,
    'vien-thuoc-nho-be-va-noi-tiet-tranh-thai',
    'Viên Thuốc Nhỏ Bé & Nội Tiết Tránh Thai',
    'Hiểu sâu về cơ chế hoạt động của thuốc hàng ngày, miếng dán và vòng âm đạo.',
    'Bài học cung cấp đầy đủ thông tin về các biện pháp tránh thai nội tiết chứa estrogen/progestin, hướng dẫn uống thuốc đúng cách và cách xử trí khi quên thuốc.',
    4,
    false,
    100,
    10,
    NULL,
    NULL
);
SET @lesson4_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson4_id, 'Scarleteen - Birth Control Bingo: Hormonal Methods', 'https://www.scarleteen.com/read/sexual-health/birth-control-bingo-hormonal-or-non-hormonal', 'website');

-- --- Micro Lesson 4.1: Hormone tránh thai hoạt động thế nào? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Hormone tránh thai hoạt động thế nào?', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao một viên thuốc nhỏ xíu lại có thể ngăn cản quá trình mang thai một cách kỳ diệu như vậy?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thuốc tránh thai chứa các hormone (estrogen và progestin) tương tự hormone tự nhiên trong cơ thể bạn.", "Chúng hoạt động bằng cách ngăn cản quá trình rụng trứng hàng tháng của buồng trứng.", "Đồng thời làm dày chất nhầy cổ tử cung để ngăn không cho tinh trùng bơi vào gặp trứng."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời đồn đáng sợ", "body": "Vy nghe các chị trên mạng xã hội nói rằng uống thuốc tránh thai hàng ngày sẽ gây vô sinh vĩnh viễn, làm buồng trứng bị teo đi. Vy hoang mang cực độ."}', 3),
(@ml_id, 'interaction', '{"question": "Lời đồn thuốc tránh thai gây vô sinh vĩnh viễn là đúng hay sai?", "choices": [{"text": "Đúng vậy, rất nguy hiểm.", "correct": false, "emoji": "🛑"}, {"text": "Sai bét. Khả năng mang thai sẽ hồi phục bình thường sau khi ngừng thuốc.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng nghe những lời đồn thổi đáng sợ nào về thuốc tránh thai chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Thuốc tránh thai nội tiết chỉ tạm thời cho buồng trứng ''nghỉ ngơi'' và hoàn toàn không gây vô sinh vĩnh viễn."]}', 6);

-- --- Micro Lesson 4.2: Thuốc tránh thai hàng ngày: Uống sao cho đúng? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Thuốc tránh thai hàng ngày: Uống sao cho đúng?', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Thuốc tránh thai hàng ngày có hiệu quả ngừa thai lên tới 99%, nhưng tại sao thực tế tỷ lệ thất bại vẫn xảy ra?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chìa khóa nằm ở tính kỷ luật: Bạn phải uống đều đặn mỗi ngày 1 viên vào cùng một khung giờ.", "Vỉ 21 viên: Uống hết nghỉ 7 ngày rồi uống vỉ mới.", "Vỉ 28 viên: Uống liên tục không nghỉ (7 viên cuối là giả dược chứa sắt/vitamin giúp duy trì thói quen)."]}', 2),
(@ml_id, 'scenario', '{"title": "Tiệc vui quên thuốc", "body": "Trang đặt lịch uống thuốc vào lúc 9h tối. Tuy nhiên hôm nay đi sinh nhật bạn thân, Trang mải vui chơi đến tận 2h sáng mới về nhà và quên béng uống thuốc."}', 3),
(@ml_id, 'interaction', '{"question": "Trang phát hiện quên thuốc trễ khoảng 5 tiếng, Trang nên làm gì?", "choices": [{"text": "Uống ngay viên thuốc đã quên khi nhớ ra, viên tiếp theo uống đúng giờ cũ.", "correct": true, "emoji": "💚"}, {"text": "Bỏ qua viên đó, đợi tối hôm sau uống 2 viên một lúc.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có phải là người có tính kỷ luật tự giác cao trong sinh hoạt hàng ngày không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chìa khóa vàng của thuốc tránh thai hàng ngày là: Đúng giờ - Đều đặn - Không ngắt quãng."]}', 6);

-- --- Micro Lesson 4.3: Miếng dán & Vòng âm đạo: Kín đáo và tiện lợi ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Miếng dán & Vòng âm đạo: Kín đáo và tiện lợi', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nếu bạn là một người ''não cá vàng'' ghét việc phải uống thuốc mỗi ngày, liệu có phương án nội tiết nào rảnh tay hơn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Miếng dán tránh thai (Patch): Nhỏ gọn dán lên da (tay, lưng). Thay miếng mới mỗi tuần một lần.", "Vòng âm đạo (Vaginal Ring): Vòng silicon dẻo tự đặt vào âm đạo, để nguyên 3 tuần, tháo ra 1 tuần nghỉ.", "Hormone được giải phóng trực tiếp qua da/niêm mạc đi thẳng vào máu, không cần qua dạ dày."]}', 2),
(@ml_id, 'scenario', '{"title": "Lo ngại quyền riêng tư", "body": "An không muốn để vỉ thuốc tránh thai trong phòng vì sợ bố mẹ vô tình nhìn thấy và hiểu lầm. An muốn tìm kiếm một biện pháp tránh thai nội tiết kín đáo hơn."}', 3),
(@ml_id, 'interaction', '{"question": "Phương pháp nào đáp ứng tốt nhất yêu cầu kín đáo và không cần nhớ uống mỗi ngày cho An?", "choices": [{"text": "Vòng âm đạo: Đặt ẩn bên trong cơ thể, chỉ cần nhớ thay 1 tháng 1 lần.", "correct": true, "emoji": "💚"}, {"text": "Thuốc tránh thai hàng ngày: Uống xong giấu kỹ dưới đáy hòm đồ cá nhân.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn ưu tiên sự kín đáo, riêng tư hay sự quen thuộc, dễ dùng khi chọn biện pháp bảo vệ?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Miếng dán và Vòng âm đạo là sự thay thế hoàn hảo cho những ai bận rộn hoặc lo ngại tính riêng tư."]}', 6);

-- --- Micro Lesson 4.4: Deal với tác dụng phụ của nội tiết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Deal với tác dụng phụ của nội tiết', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Thuốc tránh thai có làm bạn bị nổi mụn, tăng cân hay bỗng dưng buồn bã muốn khóc nhè không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cơ thể cần từ 2-3 tháng thích nghi khi bạn mới nạp một lượng hormone tránh thai từ ngoài vào.", "Bạn có thể bị đau đầu nhẹ, căng ngực hoặc thay đổi tâm trạng sương sương.", "Những triệu chứng này thường tự biến mất khi cơ thể đã cân bằng nội tiết."]}', 2),
(@ml_id, 'scenario', '{"title": "Bỏ cuộc giữa chừng", "body": "Mai bắt đầu uống thuốc tránh thai được 1 tuần thì thấy hơi nhức đầu nhẹ và buồn nôn nhẹ vào sáng sớm. Mai lập tức vứt vỉ thuốc đi vì sợ thuốc gây hại."}', 3),
(@ml_id, 'interaction', '{"question": "Bạn khuyên Mai nên làm gì để đối phó với tác dụng phụ ban đầu?", "choices": [{"text": "Kiên trì thêm, chuyển thời gian uống thuốc sang ngay trước khi đi ngủ để giảm buồn nôn.", "correct": true, "emoji": "💚"}, {"text": "Ngừng uống ngay lập tức và chuyển sang phương pháp dân gian khác.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng chịu đựng một chút bất tiện nhỏ ban đầu để có được sự an tâm lâu dài?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tác dụng phụ ban đầu thường nhẹ và tạm thời. Hãy lắng nghe và cho cơ thể thời gian thích nghi."]}', 6);

-- --- Micro Lesson 4.5: Làm gì khi lỡ quên uống thuốc? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Làm gì khi lỡ quên uống thuốc?', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Sáng thức dậy bỗng phát hiện tối qua quên uống thuốc tránh thai. Bạn có nên hoảng loạn uống bù ngay?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nếu quên 1 viên (dưới 24h): Uống ngay viên đó khi nhớ ra, viên tiếp theo uống đúng giờ cũ. Hiệu quả ngừa thai được bảo toàn.", "Nếu quên từ 2 viên (trên 48h): Uống bù viên gần nhất, tiếp tục uống đúng giờ. Nhưng bắt buộc phải dùng bao cao su trong 7 ngày tiếp theo."]}', 2),
(@ml_id, 'scenario', '{"title": "Quên thuốc ngày đi phượt", "body": "Lan đi phượt 3 ngày và quên mang theo vỉ thuốc tránh thai hàng ngày. Trong chuyến đi, Lan có quan hệ với người yêu và nghĩ về nhà uống bù dồn 3 viên là xong."}', 3),
(@ml_id, 'interaction', '{"question": "Giải pháp an toàn nhất cho Lan lúc này là gì?", "choices": [{"text": "Uống ngay thuốc khẩn cấp vì đã quên thuốc quá 48 tiếng và quan hệ không dùng bao.", "correct": true, "emoji": "💚"}, {"text": "Đợi về nhà uống dồn 3 viên một lúc để bù lại những ngày đã quên.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã lập chuông báo thức hay cài app nhắc nhở uống thuốc tránh thai hàng ngày chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Quên 1 viên uống bù ngay. Quên từ 2 viên trở lên bắt buộc dùng thêm bao cao su hỗ trợ bảo vệ."]}', 6);

-- --- Micro Lesson 4.6: Bạn có hợp với phương pháp nội tiết? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Bạn có hợp với phương pháp nội tiết?', 6);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để biết cơ thể mình có thực sự phù hợp với các phương pháp tránh thai chứa hormone?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Không có biện pháp tránh thai nào tốt nhất cho tất cả mọi người, chỉ có biện pháp hợp nhất với cơ thể bạn.", "Một số bệnh lý nền như huyết áp cao, đau nửa đầu nghiêm trọng không nên dùng hormone estrogen.", "Cách an toàn nhất là thăm khám và nhận tư vấn trực tiếp từ bác sĩ sản phụ khoa."]}', 2),
(@ml_id, 'scenario', '{"title": "Nghe lời khuyên bạn thân", "body": "Hoa có tiền sử bệnh đau nửa đầu nghiêm trọng nhưng muốn uống thuốc hàng ngày. Bạn thân Hoa bảo cứ mua về uống đại đi vì ''tớ uống suốt có sao đâu''."}', 3),
(@ml_id, 'interaction', '{"question": "Hoa có nên tự ý mua thuốc về uống không?", "choices": [{"text": "Không nên. Tự ý uống khi có bệnh lý chống chỉ định có thể gây biến chứng sức khỏe nguy hiểm.", "correct": true, "emoji": "💚"}, {"text": "Có chứ, thuốc tránh thai bán tự do ở mọi nhà thuốc Tây mà.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng đi khám sức khỏe sinh sản lần nào chưa, hay chỉ nghe tư vấn từ bạn bè?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hãy tôn trọng cơ thể mình bằng cách đi khám bác sĩ trước khi đưa bất kỳ loại hormone nào vào người."]}', 6);

-- --- Micro Lesson 4.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Viên Thuốc Nhỏ Bé & Nội Tiết Tránh Thai''! Hãy chứng minh bạn đã nắm vững cách kiểm soát hormone."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Cuộc phiêu lưu: Đồng hành cùng thuốc nội tiết", "startNode": "step1", "nodes": {"step1": {"text": "Bạn quyết định chọn thuốc tránh thai hàng ngày làm biện pháp bảo vệ chính của mình.", "choices": [{"text": "Uống bất kỳ lúc nào rảnh trong ngày, nhớ lúc nào uống lúc đó.", "nextNode": "fail_inconsistent"}, {"text": "Đặt một khung giờ cố định lúc 9h tối và cài chuông báo nhắc nhở mỗi ngày.", "nextNode": "step2"}]}, "step2": {"text": "Hôm nay bạn đi chơi về muộn và quên uống thuốc đúng giờ, trễ khoảng 8 tiếng.", "choices": [{"text": "Uống bù viên đã quên ngay khi nhớ ra, và uống viên tiếp theo đúng giờ cũ.", "nextNode": "step3"}, {"text": "Bỏ qua viên đó và tối hôm sau uống 2 viên một lúc.", "nextNode": "fail_double"}]}, "step3": {"text": "Bạn đi du lịch xa 3 ngày nhưng quên mang vỉ thuốc theo. Trong thời gian này bạn có quan hệ tình dục không bảo vệ.", "choices": [{"text": "Mua thuốc tránh thai khẩn cấp uống ngay vì đã quên thuốc quá 48 tiếng.", "nextNode": "success_end"}, {"text": "Đợi về nhà rồi uống bù 3 viên cùng lúc để cơ thể hấp thụ lại.", "nextNode": "fail_catchup"}]}, "success_end": {"text": "🎉 Chính xác! Bạn đã xử lý quên thuốc vô cùng khoa học, bình tĩnh và an toàn.", "isEnd": true, "isSuccess": true}, "fail_inconsistent": {"text": "❌ Thất bại! Thuốc tránh thai hàng ngày đòi hỏi nồng độ hormone ổn định. Uống lệch giờ quá nhiều làm giảm đáng kể hiệu quả bảo vệ.", "isEnd": true, "isSuccess": false}, "fail_double": {"text": "❌ Thất bại! Uống dồn dập 2 viên một lúc khi trễ ít giờ có thể gây nôn ói và rối loạn nội tiết nhẹ không đáng có.", "isEnd": true, "isSuccess": false}, "fail_catchup": {"text": "❌ Thất bại! Thuốc hàng ngày quên quá 48h mất hẳn tác dụng. Uống bù dồn dập sau nhiều ngày không có tác dụng ngừa thai ngược lại quá khứ.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các quan điểm về tránh thai nội tiết sau đây:", "leftBox": {"title": "Khoa học & Đúng chuẩn"}, "rightBox": {"title": "Sai lầm & Tin đồn"}, "items": [{"text": "Uống thuốc hàng ngày đều đặn vào một khung giờ cố định mỗi ngày", "correctBox": "left"}, {"text": "Thuốc tránh thai hàng ngày gây vô sinh vĩnh viễn cho bạn nữ", "correctBox": "right"}, {"text": "Uống bù ngay 1 viên khi phát hiện quên trễ dưới 12 tiếng", "correctBox": "left"}, {"text": "Thuốc tránh thai hàng ngày bảo vệ bạn khỏi các bệnh STI", "correctBox": "right"}, {"text": "Thay miếng dán tránh thai mới mỗi tuần một lần đúng lịch", "correctBox": "left"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp đúng các phương pháp nội tiết với đặc tính của chúng:", "pairs": [{"left": "Vỉ thuốc 28 viên", "right": "Có 7 viên giả dược chứa vitamin/sắt để duy trì thói quen uống liên tục."}, {"left": "Miếng dán tránh thai", "right": "Dán lên da (tay, vai) và giải phóng hormone qua da mỗi tuần."}, {"left": "Vòng âm đạo", "right": "Đặt sâu vào âm đạo, để nguyên 3 tuần để giải phóng hormone tại chỗ."}, {"left": "Estrogen & Progestin", "right": "Hai loại hormone chính ngăn cản buồng trứng rụng trứng hàng tháng."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về tránh thai nội tiết:", "sentence": "Thuốc tránh thai hàng ngày hoạt động bằng cách ngăn cản sự [blank1] của trứng. Nếu lỡ quên uống thuốc dưới [blank2] tiếng, bạn cần uống bù ngay lập tức. Hãy nhớ rằng các biện pháp nội tiết [blank3] ngăn ngừa được các bệnh [blank4].", "blanks": {"blank1": {"correct": "rụng", "placeholder": "..."}, "blank2": {"correct": "12", "placeholder": "..."}, "blank3": {"correct": "không thể", "placeholder": "..."}, "blank4": {"correct": "lây qua đường tình dục", "placeholder": "..."}}, "words": ["rụng", "12", "không thể", "lây qua đường tình dục", "thụ tinh", "24", "có thể", "ngoài ý muốn"]}', 5),
(@ml_id, 'interaction', '{"question": "Khi gặp tác dụng phụ nhẹ như buồn nôn hoặc căng ngực trong 1-2 tuần đầu dùng thuốc tránh thai nội tiết, bạn nên làm gì?", "enableLives": true, "choices": [{"text": "Ngừng thuốc ngay lập tức để bảo vệ cơ thể.", "correct": false, "emoji": "🛑"}, {"text": "Kiên trì dùng tiếp từ 2-3 tháng vì cơ thể đang tự thích nghi. Có thể đổi giờ uống sang trước khi đi ngủ để đỡ buồn nôn.", "correct": true, "emoji": "💚"}, {"text": "Tự ý tăng gấp đôi liều lượng uống mỗi ngày để cơ thể nhanh thích nghi.", "correct": false, "emoji": "😐"}]}', 6);

-- =========================================================================
-- BÀI HỌC 5: Biện Pháp Tránh Thai Lâu Dài & "Rảnh Tay"
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes, teaser_video_id, full_video_id)
VALUES (
    @course_id,
    'bien-phap-tranh-thai-lau-dai-va-ranh-tay',
    'Biện Pháp Tránh Thai Lâu Dài & "Rảnh Tay"',
    'Tìm hiểu về que cấy dưới da, vòng tránh thai IUD và các mũi tiêm định kỳ.',
    'Bài học giúp bạn tìm hiểu các biện pháp tránh thai lâu dài có thể phục hồi (LARC) gồm que cấy, vòng tránh thai IUD và tiêm tránh thai. Đây là những biện pháp cực kỳ rảnh tay với độ hiệu quả cao nhất.',
    5,
    false,
    100,
    8,
    NULL,
    NULL
);
SET @lesson5_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson5_id, 'Scarleteen - Birth Control Bingo: Long-Acting Reversible Contraception', 'https://www.scarleteen.com/read/sexual-health/birth-control-bingo', 'website');

-- --- Micro Lesson 5.1: Thế nào là tránh thai 'rảnh tay' (LARC)? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Thế nào là tránh thai ''rảnh tay'' (LARC)?', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "LARC là gì và tại sao chúng được gọi là biện pháp tránh thai ''nhàn hạ'' nhất?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["LARC viết tắt của Long-Acting Reversible Contraception (Tránh thai lâu dài có thể phục hồi).", "Các biện pháp này được thực hiện bởi nhân viên y tế một lần duy nhất và bảo vệ bạn từ 3 đến 10 năm.", "Ưu điểm lớn nhất là bạn không cần nhớ lịch hàng ngày, hàng tuần, loại bỏ hoàn toàn lỗi quên từ người dùng."]}', 2),
(@ml_id, 'scenario', '{"title": "Lười và an toàn", "body": "Thảo luôn sợ dính bầu nhưng cũng cực kỳ ghét việc phải mang bao cao su hay uống thuốc mỗi ngày. Thảo ước gì có giải pháp cắm một lần xài được vài năm."}', 3),
(@ml_id, 'interaction', '{"question": "LARC phù hợp với ai nhất?", "choices": [{"text": "Người bận rộn, hay quên và mong muốn ngừa thai lâu dài, an toàn tuyệt đối.", "correct": true, "emoji": "💚"}, {"text": "Người có quan hệ tần suất rất ít, chỉ vài tháng 1 lần.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thích một phương pháp tránh thai cấy/đặt một lần dùng được nhiều năm không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["LARC là nhóm tránh thai rảnh tay và hiệu quả thực tế cao nhất nhờ loại trừ hoàn toàn yếu tố quên lịch."]}', 6);

-- --- Micro Lesson 5.2: Que cấy tránh thai dưới da cánh tay ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Que cấy tránh thai dưới da cánh tay', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Một chiếc que nhựa nhỏ xíu cấy vào cánh tay có thể ngăn chặn mang thai suốt 3 năm ra sao?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Que cấy (Implant) là một thanh nhựa dẻo nhỏ bằng que diêm được cấy dưới da bắp tay của bạn nữ.", "Giải phóng liên tục lượng progestin cực nhỏ để ngăn buồng trứng rụng trứng.", "Hiệu lực bảo vệ kéo dài 3 năm với hiệu quả ngừa thai vượt trội lên tới 99.9%."]}', 2),
(@ml_id, 'scenario', '{"title": "Chiếc que vô hình", "body": "An đi cấy que tránh thai về. An sợ bạn bè phát hiện ra và cười nhạo, nhưng khi chạm vào bắp tay, que nằm ẩn sâu dưới da hoàn toàn không thể nhìn thấy bằng mắt thường."}', 3),
(@ml_id, 'interaction', '{"question": "Que cấy tránh thai được thực hiện ở đâu?", "choices": [{"text": "Bắt buộc phải thực hiện bởi bác sĩ/nhân viên y tế tại bệnh viện phụ sản hoặc phòng khám uy tín.", "correct": true, "emoji": "💚"}, {"text": "Tự mua que về nhà cấy vào tay theo hướng dẫn trên Youtube.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thấy que cấy dưới da là một biện pháp công nghệ cao thú vị không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Que cấy tránh thai là vũ khí rảnh tay tuyệt vời, kín đáo và hiệu quả hàng đầu hiện nay."]}', 6);

-- --- Micro Lesson 5.3: Vòng tránh thai (IUD): Đồng vs Nội tiết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Vòng tránh thai (IUD): Đồng vs Nội tiết', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào một chiếc dụng cụ nhỏ hình chữ T đặt trong tử cung lại bảo vệ bạn lên tới 10 năm?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Vòng tránh thai IUD là thiết bị hình chữ T nhỏ bằng nhựa được bác sĩ đặt vào lòng tử cung.", "IUD Đồng: Không hormone, đồng làm thay đổi môi trường tử cung ngăn tinh trùng thụ tinh, hạn dùng 5-10 năm.", "IUD Nội tiết: Tiết progestin làm dày dịch cổ tử cung, giảm đau bụng kinh và rong kinh, hạn dùng 3-5 năm."]}', 2),
(@ml_id, 'scenario', '{"title": "Nỗi sợ vòng đồng", "body": "Lan nghe nói vòng tránh thai chữ T bằng đồng sẽ gây rong kinh và đau bụng kinh nhiều hơn nên rất lo lắng. Bác sĩ tư vấn Lan nên chuyển sang dùng loại vòng nội tiết Mirena."}', 3),
(@ml_id, 'interaction', '{"question": "Đặc điểm nổi bật của vòng tránh thai nội tiết là gì?", "choices": [{"text": "Vừa ngừa thai hiệu quả vừa giúp giảm lượng máu kinh và đau bụng kinh.", "correct": true, "emoji": "💚"}, {"text": "Hoàn toàn không có hormone nên không ảnh hưởng chu kỳ kinh.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Nếu phải chọn IUD, bạn sẽ ưu tiên loại không hormone (đồng) hay loại giảm đau bụng (nội tiết)?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Vòng tránh thai IUD là biện pháp ngừa thai lâu đời, hiệu quả cao và cực kỳ bền bỉ."]}', 6);

-- --- Micro Lesson 5.4: Sợ đau và sợ có dị vật trong cơ thể ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Sợ đau và sợ có dị vật trong cơ thể', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Ý nghĩ đặt một vật lạ vào trong cơ thể có làm bạn cảm thấy rùng mình và lo sợ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cảm giác e ngại dị vật hay sợ đau khi đặt vòng/que cấy là phản ứng tự nhiên rất phổ biến.", "Thực tế, quá trình đặt que cấy diễn ra trong 2-3 phút, bác sĩ sẽ gây tê tại chỗ nên bạn hoàn toàn không đau.", "Vật liệu làm que cấy và vòng IUD hoàn toàn tương thích sinh học, không gây đào thải hay khó chịu."]}', 2),
(@ml_id, 'scenario', '{"title": "Vượt qua nỗi sợ", "body": "Vy muốn đặt vòng tránh thai IUD nhưng cứ tưởng tượng bác sĩ luồn thiết bị vào người là Vy toát mồ hôi hột. Vy quyết định đi khám tư vấn và được bác sĩ giải thích quy trình rất nhẹ nhàng."}', 3),
(@ml_id, 'interaction', '{"question": "Làm sao để giảm bớt lo lắng trước khi thực hiện LARC?", "choices": [{"text": "Đến gặp bác sĩ phụ khoa uy tín để được giải thích quy trình và tư vấn giảm đau phù hợp.", "correct": true, "emoji": "💚"}, {"text": "Uống thuốc ngủ trước khi đi khám để không cảm thấy gì.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có nghĩ việc chuẩn bị tâm lý và thông tin trước giúp giảm 80% cảm giác đau khi đi khám không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Nỗi sợ thường lớn hơn thực tế. Hãy chọn bác sĩ chuyên nghiệp để quy trình diễn ra nhẹ nhàng nhất."]}', 6);

-- --- Micro Lesson 5.5: Các bước chuẩn bị trước khi đến phòng khám phụ khoa ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Các bước chuẩn bị trước khi đến phòng khám phụ khoa', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Lần đầu đi khám phụ khoa cần chuẩn bị những gì để không bị bối rối và sượng sùng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chọn thời điểm sạch kinh (sau khi hết kinh 2-3 ngày) là tốt nhất để thăm khám.", "Vệ sinh vùng kín nhẹ nhàng bằng nước sạch, tuyệt đối không thụt rửa sâu.", "Chuẩn bị sẵn thông tin về chu kỳ kinh nguyệt gần nhất và các thắc mắc để hỏi bác sĩ."]}', 2),
(@ml_id, 'scenario', '{"title": "Cuộc hẹn đầu tiên", "body": "Hạnh lần đầu tiên đi khám phụ khoa để cấy que tránh thai. Hạnh mặc váy dài thoải mái để tiện cho quá trình khám và chuẩn bị sẵn một danh sách các câu hỏi ghi trong điện thoại."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động chuẩn bị của Hạnh là đúng hay sai?", "choices": [{"text": "Rất đúng chuẩn! Mặc váy rộng rãi và ghi sẵn câu hỏi giúp cuộc khám diễn ra mượt mà.", "correct": true, "emoji": "💚"}, {"text": "Sai rồi, nên mặc quần jeans bó sát để lịch sự hơn.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng ghi chú lại các câu hỏi thầm kín của mình trước khi đi gặp bác sĩ không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Khám phụ khoa là việc chăm sóc sức khỏe bình thường. Hãy chuẩn bị chu đáo để an tâm nhất."]}', 6);

-- --- Micro Lesson 5.6: Có phải phương pháp đắt tiền nhất mới là tốt nhất? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Có phải phương pháp đắt tiền nhất mới là tốt nhất?', 6);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Một ca cấy que hay đặt vòng Mirena có giá tiền triệu, liệu có xứng đáng để đầu tư?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chi phí ban đầu của LARC khá cao so với mua bao cao su hay vỉ thuốc tránh thai hàng tháng.", "Tuy nhiên, nếu chia nhỏ chi phí cho 3-10 năm bảo vệ, đây lại là khoản đầu tư vô cùng tiết kiệm.", "Quan trọng nhất, sự an tâm tuyệt đối và việc giải phóng trí não khỏi nỗi sợ quên thuốc là vô giá."]}', 2),
(@ml_id, 'scenario', '{"title": "Bài toán kinh tế", "body": "Hồng phân vân vì que cấy tránh thai có giá khá cao so với túi tiền học sinh. Khi làm phép tính chia nhỏ chi phí cho 36 tháng sử dụng, Hồng nhận ra mỗi ngày chỉ mất vài nghìn đồng."}', 3),
(@ml_id, 'interaction', '{"question": "Đánh giá về chi phí của biện pháp LARC:", "choices": [{"text": "Chi phí ban đầu cao nhưng tính dài hạn lại vô cùng tiết kiệm và hiệu quả ngừa thai cực cao.", "correct": true, "emoji": "💚"}, {"text": "Quá đắt đỏ và lãng phí, chỉ nên dùng bao cao su rẻ tiền.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đồng ý rằng sự an tâm không lo lắng dính bầu ngoài ý muốn đáng giá hơn chi phí bỏ ra?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hãy nhìn nhận việc tránh thai lâu dài như một khoản đầu tư bền vững cho tương lai của bạn."]}', 6);

-- --- Micro Lesson 5.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Biện Pháp Lâu Dài & Rảnh Tay''! Hãy kiểm tra kiến thức nhé."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Cuộc phiêu lưu: Lựa chọn LARC", "startNode": "step1", "nodes": {"step1": {"text": "Bạn muốn chọn một phương án tránh thai rảnh tay hiệu quả cao và không phụ thuộc vào trí nhớ hàng ngày.", "choices": [{"text": "Chọn uống thuốc tránh thai khẩn cấp sau mỗi lần quan hệ cho tiện.", "nextNode": "fail_emergency"}, {"text": "Đến phòng khám phụ khoa để tìm hiểu về các biện pháp lâu dài LARC.", "nextNode": "step2"}]}, "step2": {"text": "Bác sĩ giới thiệu hai giải pháp: Que cấy dưới da cánh tay (3 năm) và Vòng tránh thai IUD (5-10 năm). Bạn lo sợ đặt dị vật sẽ rất đau.", "choices": [{"text": "Sợ đau nên bỏ về không khám nữa.", "nextNode": "fail_fear"}, {"text": "Lắng nghe bác sĩ giải thích quy trình gây tê tại chỗ nhanh gọn, đồng ý tiến hành cấy que.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành thử thách! Bạn đã hiểu đúng về LARC, vượt qua nỗi sợ tâm lý để có giải pháp bảo vệ lâu dài cực kỳ an toàn.", "isEnd": true, "isSuccess": true}, "fail_emergency": {"text": "❌ Thất bại! Thuốc khẩn cấp không phải là biện pháp lâu dài, lạm dụng gây hại lớn cho nội tiết và hiệu quả ngừa thai thấp.", "isEnd": true, "isSuccess": false}, "fail_fear": {"text": "❌ Thất bại! Trốn tránh vì nỗi sợ tưởng tượng khiến bạn mất đi cơ hội tiếp cận phương pháp bảo vệ tốt nhất.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các đặc điểm sau vào đúng biện pháp tránh thai lâu dài:", "leftBox": {"title": "Que cấy tránh thai (Implant)"}, "rightBox": {"title": "Vòng tránh thai (IUD)"}, "items": [{"text": "Một thanh nhựa dẻo nhỏ cấy dưới da bắp tay của bạn nữ", "correctBox": "left"}, {"text": "Thiết bị hình chữ T đặt vào bên trong lòng tử cung", "correctBox": "right"}, {"text": "Có hiệu lực bảo vệ ngừa thai kéo dài 3 năm liên tục", "correctBox": "left"}, {"text": "Loại bằng đồng không chứa hormone có hạn dùng lên tới 10 năm", "correctBox": "right"}, {"text": "Loại nội tiết giúp giảm đau bụng kinh và giảm lượng máu kinh", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp đúng các khái niệm y tế liên quan đến LARC:", "pairs": [{"left": "LARC", "right": "Nhóm tránh thai lâu dài có thể đảo ngược hiệu quả cực cao."}, {"left": "Gây tê tại chỗ", "right": "Thủ thuật y tế giúp quá trình cấy que tránh thai hoàn toàn không đau."}, {"left": "Dị vật tương thích", "right": "Vật liệu an toàn không gây phản ứng đào thải của cơ thể."}, {"left": "Bác sĩ phụ khoa", "right": "Người duy nhất được quyền thực hiện đặt vòng hoặc cấy que tránh thai."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp để hoàn thành đoạn văn về tránh thai lâu dài:", "sentence": "Các biện pháp tránh thai lâu dài LARC có độ hiệu quả ngừa thai thực tế lên tới [blank1] do loại bỏ hoàn toàn yếu tố [blank2] của người dùng. Quá trình cấy que diễn ra rất [blank3] nhờ thủ thuật gây tê. Hãy luôn thực hiện tại [blank4] uy tín để đảm bảo an toàn.", "blanks": {"blank1": {"correct": "99%", "placeholder": "..."}, "blank2": {"correct": "hay quên", "placeholder": "..."}, "blank3": {"correct": "nhẹ nhàng", "placeholder": "..."}, "blank4": {"correct": "bệnh viện", "placeholder": "..."}}, "words": ["99%", "hay quên", "nhẹ nhàng", "bệnh viện", "50%", "tự làm", "đau đớn", "hiệu thuốc"]}', 5),
(@ml_id, 'interaction', '{"question": "Mặc dù que cấy và vòng tránh thai ngừa thai cực tốt, chúng có ngăn ngừa được bệnh lây qua đường tình dục (STI) không?", "enableLives": true, "choices": [{"text": "Hoàn toàn không. Bạn vẫn cần sử dụng bao cao su để phòng tránh STI khi quan hệ.", "correct": true, "emoji": "💚"}, {"text": "Có chứ, cơ chế hormone diệt sạch mọi vi khuẩn đường tình dục.", "correct": false, "emoji": "🛑"}, {"text": "Có, màng tử cung dày lên sẽ chặn đứng mọi virus.", "correct": false, "emoji": "😐"}]}', 6);

-- =========================================================================
-- BÀI HỌC 6: Nút "Undo" Phút Chót - Tránh Thai Khẩn Cấp
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes, teaser_video_id, full_video_id)
VALUES (
    @course_id,
    'nut-undo-phut-chot-tranh-thai-khan-cap',
    'Nút "Undo" Phút Chót - Tránh Thai Khẩn Cấp',
    'Cách xử lý sự cố khẩn cấp bằng thuốc 72h/120h đúng quy trình y tế.',
    'Bài học trang bị kiến thức y khoa thực tế về thuốc tránh thai khẩn cấp, thời gian vàng sử dụng thuốc, cách đối phó tác dụng phụ và quy tắc chia sẻ trách nhiệm.',
    6,
    false,
    100,
    10,
    NULL,
    NULL
);
SET @lesson6_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson6_id, 'Scarleteen - Emergency Contraception', 'https://www.scarleteen.com/read/sexual-health/emergency-contraception', 'website');

-- --- Micro Lesson 6.1: Khi nào cần đến nút "Undo"? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Khi nào cần đến nút "Undo"?', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn sẽ làm gì nếu bao cao su bị rách giữa chừng hoặc bạn lỡ ''vượt ranh giới'' mà hoàn toàn không bảo vệ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đừng hoảng sợ hay tự trách móc bản thân, sự cố là điều không ai mong muốn.", "Thuốc tránh thai khẩn cấp (thuốc ngày hôm sau) hoạt động như một nút Undo tạm thời.", "Thuốc trì hoãn việc rụng trứng để ngăn tinh trùng gặp trứng, ngăn cản thụ thai."]}', 2),
(@ml_id, 'scenario', '{"title": "Khủng hoảng rách bao", "body": "Lần đầu tiên làm chuyện ấy, Hùng và Linh gặp sự cố rách bao cao su. Linh khóc nức nở vì lo sợ có thai, Hùng hoang mang tột độ không biết làm sao."}', 3),
(@ml_id, 'interaction', '{"question": "Bạn khuyên Hùng nhắn tin an ủi Linh và giải quyết tình huống thế nào?", "choices": [{"text": "Đừng khóc nữa cậu ơi, giờ tụi mình đi mua thuốc tránh thai khẩn cấp uống ngay nhé, vẫn còn kịp mà.", "correct": true, "emoji": "💚"}, {"text": "Tớ cũng sợ quá, hay cậu đi tắm rồi nhảy lên nhảy xuống thật mạnh xem sao...", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng rơi vào trạng thái hoảng loạn vì lo sợ mang thai ngoài ý muốn chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Sự cố xảy ra là điều không ai muốn, nhưng bạn luôn có nút Undo khẩn cấp trong vòng 72-120 giờ."]}', 6);

-- --- Micro Lesson 6.2: 72 giờ vàng & Các loại thuốc khẩn cấp ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, '72 giờ vàng & Các loại thuốc khẩn cấp', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Thuốc tránh thai khẩn cấp có phải cứ uống lúc nào cũng được, hay có một ''thời hạn vàng'' bắt buộc?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Loại chứa Levonorgestrel (Postinor, Mifestad...): Hiệu quả cao nhất trong vòng 72 giờ (3 ngày) sau quan hệ.", "Loại chứa Ulipristal acetate (Ella...): Hiệu lực kéo dài lên đến 120 giờ (5 ngày).", "Hãy nhớ: Thuốc khẩn cấp không có tác dụng phá thai nếu trứng đã làm tổ thành công."]}', 2),
(@ml_id, 'scenario', '{"title": "Sự cố cuối tuần", "body": "Vy gặp sự cố vào tối thứ Sáu. Vì ngại đi mua vào cuối tuần, Vy đợi đến chiều thứ Hai (sau khoảng 68 tiếng) mới ra hiệu thuốc mua thuốc loại 72h uống."}', 3),
(@ml_id, 'interaction', '{"question": "Đánh giá hiệu quả thuốc uống lúc này của Vy:", "choices": [{"text": "Hiệu quả đã giảm đi rất nhiều. Vy nên uống càng sớm càng tốt sau sự cố.", "correct": true, "emoji": "💚"}, {"text": "Uống lúc nào trong vòng 72 giờ hiệu quả cũng y hệt nhau nên không sao.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "If gặp sự cố, bạn có sẵn sàng đi mua thuốc uống ngay lập tức không hay sẽ chần chừ?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Uống càng sớm, hiệu quả càng cao. Tốt nhất là trong vòng 24 giờ đầu tiên sau khi gặp sự cố."]}', 6);

-- --- Micro Lesson 6.3: Hoảng loạn và tự trách sau sự cố ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Hoảng loạn và tự trách sau sự cố', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao sau khi uống thuốc tránh thai khẩn cấp, nhiều bạn trẻ vẫn cảm thấy vô cùng tội lỗi và lo sợ tột cùng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thay đổi hormone đột ngột cùng áp lực lo sợ làm phát sinh nhiều cảm xúc tiêu cực.", "Bình tĩnh lại: Bạn đã hành động đúng đắn và kịp thời để bảo vệ bản thân.", "Hãy nhẹ nhàng vỗ về cảm xúc của mình thay vì dằn vặt tự trách."]}', 2),
(@ml_id, 'scenario', '{"title": "Dằn vặt suốt đêm", "body": "Sau khi uống thuốc khẩn cấp, Hoa liên tục tự dằn vặt: ''Sao mình lại dại dột thế nhỉ? Bố mẹ mà biết chắc mình chết mất''. Hoa khóc suốt đêm và không dám nói chuyện với bạn trai."}', 3),
(@ml_id, 'interaction', '{"question": "Hãy chọn một thông điệp vỗ về bản thân mà Hoa cần nghe lúc này?", "choices": [{"text": "Mình đã xử lý sự cố một cách thông minh và kịp thời. Mình có quyền tự bảo vệ mình.", "correct": true, "emoji": "💚"}, {"text": "Mình thật tệ hại và đáng xấu hổ vì để chuyện này xảy ra.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thường làm gì để tự trấn an bản thân khi gặp chuyện cực kỳ căng thẳng?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Uống thuốc khẩn cấp là hành động tự chịu trách nhiệm, không phải điều đáng hổ thẹn. Hãy dịu dàng với bản thân!"]}', 6);

-- --- Micro Lesson 6.4: Chia sẻ trách nhiệm - Đừng để bạn nữ cô độc ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Chia sẻ trách nhiệm - Đừng để bạn nữ cô độc', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Việc uống thuốc tránh thai khẩn cấp chỉ là việc của bạn nữ, bạn nam hoàn toàn đứng ngoài cuộc sao?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Quan hệ tình dục là sự đồng thuận từ hai phía, trách nhiệm xử lý sự cố cũng phải thuộc về cả hai.", "Thuốc khẩn cấp có lượng hormone cực cao, có thể gây buồn nôn, trễ kinh và đau bụng cho bạn nữ.", "Bạn nam cần chủ động đi mua thuốc, hỗ trợ tài chính và chăm sóc cảm xúc cho bạn nữ."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời thoái thác", "body": "Sau khi bao cao su bị rách, Quân nói với Mai: ''Mai tự ra tiệm thuốc mua uống nha, anh con trai đi mua mấy cái này ngại lắm''. Mai tủi thân lủi thủi đi mua một mình dưới mưa."}', 3),
(@ml_id, 'interaction', '{"question": "Hành vi của Quân thể hiện điều gì?", "choices": [{"text": "Red flag! Trốn tránh trách nhiệm và thiếu sự quan tâm tối thiểu đối với partner.", "correct": true, "emoji": "🚩"}, {"text": "Bình thường, con trai ngại mua đồ nhạy cảm là dễ hiểu.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Nếu là bạn nam, bạn có sẵn sàng chủ động đi mua thuốc tránh thai khẩn cấp cho người yêu mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cùng nhau tận hưởng thì hãy cùng nhau gánh vác trách nhiệm. Sự quan tâm lúc hoạn nạn là Green Flag xịn nhất."]}', 6);

-- --- Micro Lesson 6.5: Hành động nhanh: Mua thuốc và uống đúng cách ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Hành động nhanh: Mua thuốc và uống đúng cách', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn đã biết cách mua và uống thuốc tránh thai khẩn cấp đúng chuẩn để đạt hiệu quả cao nhất chưa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Không cần đơn thuốc của bác sĩ, hãy ra nhà thuốc Tây hỏi thẳng: ''Bán cho em thuốc tránh thai khẩn cấp''.", "Nếu bị nôn trong vòng 2 giờ đầu sau khi uống thuốc, bạn bắt buộc phải uống bù viên khác.", "Theo dõi kinh nguyệt. Nếu trễ kinh quá 1 tuần, hãy mua ngay que thử thai để kiểm tra."]}', 2),
(@ml_id, 'scenario', '{"title": "Cơ thể nhạy cảm", "body": "Linh uống thuốc khẩn cấp được 45 phút thì bị nôn sạch do dạ dày nhạy cảm. Linh nghĩ thuốc đã trôi xuống ruột rồi nên không cần uống lại nữa."}', 3),
(@ml_id, 'interaction', '{"question": "Linh nên làm gì tiếp theo?", "choices": [{"text": "Mua uống bù ngay một viên khác vì thuốc chưa kịp hấp thụ đã bị nôn ra ngoài.", "correct": true, "emoji": "💚"}, {"text": "Cứ kệ vậy đi, thuốc ngấm nhanh lắm lo gì.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy e ngại khi phải nói chuyện trực tiếp với dược sĩ ở tiệm thuốc không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Uống thuốc sớm, uống nhiều nước và nhớ uống bù nếu bị nôn trong vòng 2 tiếng nhé!"]}', 6);

-- --- Micro Lesson 6.6: Thuốc khẩn cấp không phải là kẹo! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Thuốc khẩn cấp không phải là kẹo!', 6);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao các bác sĩ luôn khuyến cáo không nên uống thuốc tránh thai khẩn cấp quá 2 lần trong một tháng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thuốc khẩn cấp chứa lượng hormone cực kỳ cao (gấp nhiều lần thuốc hàng ngày) để ép cơ thể dừng rụng trứng.", "Lạm dụng thuốc sẽ làm rối loạn nội tiết nặng nề, gây rong kinh, kinh nguyệt không đều và giảm hẳn hiệu quả của thuốc ở những lần sau.", "Nhớ kỹ: Thuốc khẩn cấp chỉ là phương án B dự phòng, không phải phương án A hàng ngày."]}', 2),
(@ml_id, 'scenario', '{"title": "Chủ quan vì có thuốc", "body": "Cường và Vy không dùng bao cao su vì Vy nghĩ: ''Cứ quan hệ xong uống viên khẩn cấp là an tâm, tháng này mình mới uống có 3 lần thôi mà''. Vy thấy chu kỳ kinh nguyệt của mình biến mất luôn."}', 3),
(@ml_id, 'interaction', '{"question": "Số lần tối đa nên dùng thuốc khẩn cấp trong 1 tháng là bao nhiêu?", "choices": [{"text": "Tối đa 1-2 lần, chỉ dùng khi thực sự gặp sự cố khẩn cấp.", "correct": true, "emoji": "💚"}, {"text": "Uống thoải mái mỗi khi quan hệ không dùng bao cao su.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang lạm dụng thuốc khẩn cấp thay vì sử dụng các biện pháp tránh thai chủ động khác không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Thuốc khẩn cấp là chiếc phao cứu sinh, không phải là chiếc thuyền để bạn đi hàng ngày."]}', 6);

-- --- Micro Lesson 6.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Nút Undo Phút Chót''! Bạn có 3 mạng để xử lý khủng hoảng một cách an toàn nhất."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Cuộc phiêu lưu: Xử lý sự cố rách bao", "startNode": "step1", "nodes": {"step1": {"text": "Bạn gặp sự cố rách bao cao su khi đang quan hệ. Cả hai đều rất lo lắng.", "choices": [{"text": "Chạy đi thụt rửa âm đạo ngay lập tức để đẩy sạch tinh trùng ra ngoài.", "nextNode": "fail_douch"}, {"text": "Giữ bình tĩnh, từ bỏ ý định thụt rửa và đi đến hiệu thuốc mua thuốc khẩn cấp.", "nextNode": "step2"}]}, "step2": {"text": "Đã trôi qua 36 tiếng kể từ khi gặp sự cố, bạn chuẩn bị chọn thuốc khẩn cấp.", "choices": [{"text": "Uống loại Levonorgestrel 72h ngay lập tức, hiểu rằng hiệu lực có giảm nhẹ nhưng vẫn hiệu quả.", "nextNode": "step3"}, {"text": "Chờ thêm một ngày nữa để đi khám bác sĩ cho chắc chắn rồi mới uống.", "nextNode": "fail_wait"}]}, "step3": {"text": "Uống thuốc được 1 tiếng, dạ dày của bạn nhạy cảm và bạn nôn ra hết.", "choices": [{"text": "Bỏ qua vì nghĩ thuốc đã kịp ngấm vào máu rồi.", "nextNode": "fail_vomit"}, {"text": "Ra hiệu thuốc mua và uống bù ngay một viên khác.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành xuất sắc! Bạn đã bảo vệ bản thân thành công nhờ hành động nhanh và cực kỳ đúng khoa học.", "isEnd": true, "isSuccess": true}, "fail_douch": {"text": "❌ Thất bại! Thụt rửa âm đạo không có tác dụng ngừa thai, trái lại đẩy tinh dịch vào trong sâu hơn và làm tổn thương niêm mạc.", "isEnd": true, "isSuccess": false}, "fail_wait": {"text": "❌ Thất bại! Đối với thuốc tránh thai khẩn cấp, thời gian là vàng. Chờ đợi quá lâu làm mất đi thời gian hiệu lực tốt nhất của thuốc.", "isEnd": true, "isSuccess": false}, "fail_vomit": {"text": "❌ Thất bại! Nôn dưới 2 tiếng nghĩa là cơ thể chưa kịp hấp thụ thuốc. Bạn bắt buộc phải uống bù viên khác.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các hành động xử lý khẩn cấp sau:", "leftBox": {"title": "Nên làm"}, "rightBox": {"title": "Tránh xa"}, "items": [{"text": "Uống thuốc khẩn cấp càng sớm càng tốt trong vòng 24 giờ đầu sau sự cố", "correctBox": "left"}, {"text": "Sử dụng thuốc tránh thai khẩn cấp mỗi tuần thay thế bao cao su", "correctBox": "right"}, {"text": "Uống bù viên khác nếu bị nôn trong vòng 2 giờ sau khi uống", "correctBox": "left"}, {"text": "Thụt rửa âm đạo bằng nước rửa phụ khoa thật sâu để làm sạch tinh dịch", "correctBox": "right"}, {"text": "Mua que thử thai kiểm tra nếu trễ kinh nguyệt quá 1 tuần", "correctBox": "left"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp các khái niệm về tránh thai khẩn cấp dưới đây:", "pairs": [{"left": "Levonorgestrel", "right": "Thuốc khẩn cấp loại 72 giờ, hiệu quả tốt nhất trong 24 giờ đầu."}, {"left": "Ulipristal acetate (Ella)", "right": "Thuốc khẩn cấp loại 120 giờ, hiệu lực tốt hơn khi uống muộn."}, {"left": "Nôn dưới 2 tiếng", "right": "Trường hợp bắt buộc phải uống bù viên khác để đảm bảo hiệu quả."}, {"left": "Lạm dụng thuốc khẩn cấp", "right": "Gây rối loạn nội tiết nặng nề, rong kinh và làm giảm hiệu lực thuốc."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền các từ thích hợp để hoàn thành đoạn văn sau về tránh thai khẩn cấp:", "sentence": "Thuốc tránh thai khẩn cấp hoạt động bằng cách [blank1] sự rụng trứng tạm thời. Đây chỉ là phương án [blank2], không được lạm dụng như kẹo. Nếu bị trễ kinh quá [blank3] tuần, bạn cần sử dụng [blank4] để kiểm tra.", "blanks": {"blank1": {"correct": "trì hoãn", "placeholder": "..."}, "blank2": {"correct": "dự phòng", "placeholder": "..."}, "blank3": {"correct": "1", "placeholder": "..."}, "blank4": {"correct": "que thử thai", "placeholder": "..."}}, "words": ["trì hoãn", "dự phòng", "1", "que thử thai", "kích thích", "thường xuyên", "3", "bao cao su"]}', 5),
(@ml_id, 'interaction', '{"question": "Bạn trai nói: ''Đã uống thuốc khẩn cấp rồi thì không cần lo lắng hay đi mua bao cao su cho những lần sau nữa''. Bạn phản ứng thế nào?", "enableLives": true, "choices": [{"text": "Đồng ý vì thuốc khẩn cấp bảo vệ được cả tháng.", "correct": false, "emoji": "😐"}, {"text": "Không đồng ý. Thuốc khẩn cấp chỉ bảo vệ cho lần quan hệ sự cố trước đó, không ngừa được mang thai tương lai và không ngừa được STI.", "correct": true, "emoji": "💚"}, {"text": "Lờ đi và làm theo ý bạn trai.", "correct": false, "emoji": "🛑"}]}', 6);

-- =========================================================================
-- BÀI HỌC 7: Xuất Tinh Ngoài & Tính Chu Kỳ - Có Thực Sự An Toàn?
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes, teaser_video_id, full_video_id)
VALUES (
    @course_id,
    'xuat-tinh-ngoai-va-tinh-chu-ky',
    'Xuất Tinh Ngoài & Tính Chu Kỳ - Có Thực Sự An Toàn?',
    'Lật tẩy những lầm tưởng tai hại về xuất tinh ngoài, app tính chu kỳ và màng phim.',
    'Bài học làm rõ cơ chế rủi ro cao của xuất tinh ngoài do pre-cum, sự không chính xác của app rụng trứng và tỷ lệ rò rỉ của màng phim tránh thai.',
    7,
    false,
    100,
    10,
    NULL,
    NULL
);
SET @lesson7_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson7_id, 'Scarleteen - Birth Control Bingo: Withdrawal & Fertility Awareness', 'https://www.scarleteen.com/read/sexual-health/birth-control-bingo-fertility-awareness', 'website');

-- --- Micro Lesson 7.1: Xuất tinh ngoài - Trò chơi may rủi ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Xuất tinh ngoài - Trò chơi may rủi', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "''Tớ sẽ rút ra kịp thời mà, đừng lo!'' - Lời hứa này liệu có đáng tin cậy 100% như bạn nghĩ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Trước khi thực sự xuất tinh, cơ thể bạn nam đã tiết ra dịch nhờn (pre-cum) để bôi trơn.", "Dịch nhờn pre-cum hoàn toàn có thể chứa hàng triệu tinh trùng khỏe mạnh.", "Chỉ cần một giọt nhỏ chạm vào rìa ngoài âm đạo, khả năng dính bầu vẫn xảy ra."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời hứa tự tin", "body": "Lâm quả quyết với bạn gái: ''Tớ kiểm tra được mà, yên tâm không sao đâu''. Bạn gái Lâm lo lắng nhưng đành gật đầu vì tin vào ''kỹ năng rút kịp'' của Lâm."}', 3),
(@ml_id, 'interaction', '{"question": "Dịch nhờn pre-cum tiết ra trước khi xuất tinh có chứa tinh trùng không?", "choices": [{"text": "Hoàn toàn không có, chỉ bôi trơn thôi.", "correct": false, "emoji": "🛑"}, {"text": "Có thể chứa tinh trùng khỏe mạnh và gây mang thai ngoài ý muốn.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng tin rằng xuất tinh ngoài là một biện pháp tránh thai an toàn chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Xuất tinh ngoài giống như chơi xổ số với tương lai của bạn. Đừng giao sự an toàn cho dịch nhờn pre-cum!"]}', 6);

-- --- Micro Lesson 7.2: Khi app dự báo chu kỳ sai lệch ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Khi app dự báo chu kỳ sai lệch', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có tự tin giao phó sự an toàn của mình cho một chiếc app tính ngày rụng trứng trên điện thoại?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cơ thể con người không phải là một cỗ máy lập trình sẵn.", "Stress, thức khuya, thi cử căng thẳng hay thay đổi sinh hoạt đều có thể làm trứng rụng sớm hoặc muộn bất thường.", "App chỉ tính toán dựa trên thuật toán trung bình của quá khứ, không phản ánh chính xác 100% thời gian rụng trứng."]}', 2),
(@ml_id, 'scenario', '{"title": "Màu xanh lá trên màn hình", "body": "Mai mở app theo dõi kinh nguyệt thấy hiển thị hôm nay là ''Ngày an toàn (Màu xanh)''. Mai đồng ý quan hệ không dùng bao vì nghĩ app thông minh thế thì không bao giờ sai."}', 3),
(@ml_id, 'interaction', '{"question": "Đánh giá quyết định tin tưởng vào app của Mai:", "choices": [{"text": "Red flag! Chu kỳ tuổi dậy thì biến động rất lớn, tin app để quan hệ không an toàn rất dễ dính bầu.", "correct": true, "emoji": "🚩"}, {"text": "Green flag, thời đại số tin tưởng app là đúng đắn.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có nhận thấy chu kỳ kinh nguyệt của mình thỉnh thoảng bị trễ hay đến sớm do thi cử căng thẳng không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể bạn không hoạt động theo thuật toán của app. Đừng dùng ''ngày an toàn'' để đánh cược!"]}', 6);

-- --- Micro Lesson 7.3: Màng phim & Chất diệt tinh trùng: Đừng đi một mình ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Màng phim & Chất diệt tinh trùng: Đừng đi một mình', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Màng phim tránh thai VCF hay chất diệt tinh trùng nghe thật hiện đại, nhưng liệu chúng có đủ sức bảo vệ bạn một mình?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chất diệt tinh trùng (Spermicides) làm bất động tinh trùng nhưng có tỷ lệ thất bại thực tế lên tới 28% nếu dùng đơn độc.", "Lớp màng có thể tan không đều hoặc đặt sai vị trí dẫn đến tinh trùng lọt qua.", "Chất này chỉ hoạt động tốt nhất khi dùng làm đồng đội hỗ trợ cho bao cao su."]}', 2),
(@ml_id, 'scenario', '{"title": "Tự tin quảng cáo", "body": "Vy mua màng phim tránh thai VCF về dùng vì nghe quảng cáo ''tự nhiên như không dùng gì''. Vy hoàn toàn không dùng bao cao su đi kèm vì nghĩ màng phim đã diệt sạch tinh trùng."}', 3),
(@ml_id, 'interaction', '{"question": "Đánh giá mức độ rủi ro mang thai của Vy lúc này:", "choices": [{"text": "Rất cao. Màng phim VCF dùng một mình có tỷ lệ ngừa thai thực tế khá thấp.", "correct": true, "emoji": "💚"}, {"text": "Rất thấp, màng phim diệt tinh trùng cực đỉnh rồi.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có xu hướng dễ dàng tin vào các lời quảng cáo thần kỳ trên mạng xã hội về các sản phẩm tránh thai không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chất diệt tinh trùng chỉ là đồng đội hỗ trợ, tuyệt đối không được giao nhiệm vụ bảo vệ chính một mình."]}', 6);

-- --- Micro Lesson 7.4: Áp lực từ chối khi đối phương đòi "chân thật" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Áp lực từ chối khi đối phương đòi "chân thật"', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để nói ''Không'' khi đối phương dỗi: ''Không dùng bao mới chứng tỏ cậu tin tưởng tớ chứ''?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đây là một dạng thao túng tâm lý (guilt-tripping) đánh vào tình cảm của bạn.", "Tin tưởng không đồng nghĩa với việc mạo hiểm sức khỏe, ranh giới cơ thể và tương lai của bản thân.", "Một mối quan hệ lành mạnh phải tôn trọng sự an toàn và cảm giác thoải mái của nhau."]}', 2),
(@ml_id, 'scenario', '{"title": "Mặc cả niềm tin", "body": "Duy nài nỉ Vy: ''Dùng bao ngột ngạt lắm, tớ hứa sẽ xuất ngoài. Cậu không tin tớ à?''. Vy sợ Duy nghĩ mình không yêu Duy nên phân vân có nên đồng ý."}', 3),
(@ml_id, 'interaction', '{"question": "Giúp Vy gửi tin nhắn từ chối kiên quyết nhưng vẫn mượt mà:", "choices": [{"text": "Tớ yêu cậu, nhưng tớ yêu bản thân mình trước. Tớ chỉ quan hệ khi có bao cao su để cả hai cùng an tâm.", "correct": true, "emoji": "💚"}, {"text": "Ừm... vậy cậu nhớ cẩn thận nha, tớ lo lắm á.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sợ bị người yêu giận hay chia tay nếu bạn kiên quyết bảo vệ ranh giới của mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tình yêu đích thực không bao giờ đòi hỏi bạn phải đánh đổi sự an toàn của bản thân để chứng minh lòng tin."]}', 6);

-- --- Micro Lesson 7.5: Kỹ năng từ chối các phương pháp rủi ro cao ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Kỹ năng từ chối các phương pháp rủi ro cao', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để từ chối các đề xuất nguy hiểm như xuất tinh ngoài một cách nhanh gọn, dứt khoát mà không làm sứt mẻ tình cảm?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chuẩn bị sẵn kịch bản từ chối trong đầu để tránh bị bất ngờ, bối rối.", "Sử dụng cấu trúc ''Tớ cảm thấy... nên tớ muốn...'' để tập trung vào cảm xúc cá nhân.", "Đưa ra giải pháp thay thế an toàn ngay lập tức để chuyển hướng cuộc hội thoại sang hướng tích cực."]}', 2),
(@ml_id, 'scenario', '{"title": "Kịch bản từ chối", "body": "Trong lúc ôm nhau, Nam định không dùng bao cao su và bảo: ''Tớ rút kịp mà''. Vy khựng lại, Vy muốn dừng lại để nói chuyện nghiêm túc."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên chọn kịch bản từ chối nào lịch sự và kiên quyết nhất?", "choices": [{"text": "Tớ thấy lo lắng nếu tụi mình xuất tinh ngoài vì tỷ lệ mang thai vẫn rất cao. Tớ muốn tụi mình dùng bao cao su để cả hai đều thoải mái.", "correct": true, "emoji": "💚"}, {"text": "Cậu bị điên à, xuất tinh ngoài thế để dính bầu chết à? Nghỉ đi!", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã bao giờ luyện tập trước một câu từ chối để tự bảo vệ mình chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Từ chối rõ ràng và đưa ra giải pháp an toàn là cách bảo vệ cả bạn và mối quan hệ của hai người."]}', 6);

-- --- Micro Lesson 7.6: Tự kiểm tra mức độ chịu đựng rủi ro ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Tự kiểm tra mức độ chịu đựng rủi ro', 6);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có sẵn sàng chịu đựng những tháng ngày mất ăn mất ngủ vì trễ kinh chỉ để đổi lấy vài phút chủ quan?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hãy tự hỏi: Nếu chuyện tồi tệ nhất xảy ra, mình và đối phương có đủ khả năng tự chịu trách nhiệm chưa?", "Ở tuổi 12-15, việc đi học và tương lai phát triển bản thân là ưu tiên cao nhất.", "Lựa chọn biện pháp an toàn tuyệt đối là cách thông minh nhất để bạn bảo vệ ước mơ của mình."]}', 2),
(@ml_id, 'scenario', '{"title": "Tháng ngày lo sợ", "body": "An trễ kinh 5 ngày sau khi quan hệ xuất tinh ngoài với người yêu. Mỗi ngày trôi qua với An đều là địa ngục, An không thể tập trung học bài, khóc lóc trong nhà tắm vì sợ hãi."}', 3),
(@ml_id, 'interaction', '{"question": "Điều gì đáng sợ nhất đối với học sinh tuổi teen khi mang thai ngoài ý muốn?", "choices": [{"text": "Phải đối mặt với việc dang dở học hành, sự thất vọng của gia đình và áp lực tương lai quá lớn.", "correct": true, "emoji": "💚"}, {"text": "Chỉ là trễ kinh thôi, không có gì đáng lo sợ cả.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn cảm thấy thế nào khi nhìn thấy những người bạn cùng trang lứa phải đối mặt với hậu quả của việc mang thai ngoài ý muốn?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Yên tâm học tập và tận hưởng tuổi trẻ có giá trị hơn rất nhiều so với những rủi ro do sự thiếu chuẩn bị mang lại."]}', 6);

-- --- Micro Lesson 7.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Xuất tinh ngoài & Tính chu kỳ''! Hãy chứng minh bạn biết cách né tránh những trò chơi may rủi."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Cuộc phiêu lưu: Đối mặt với các đề xuất rủi ro", "startNode": "step1", "nodes": {"step1": {"text": "Bạn trai đề nghị quan hệ không dùng bao cao su và hứa hẹn: ''Yên tâm tớ sẽ xuất tinh ngoài kịp thời''.", "choices": [{"text": "Tin tưởng lời hứa và đồng ý quan hệ xuất tinh ngoài.", "nextNode": "fail_precum"}, {"text": "Từ chối thẳng thắn: ''Pre-cum vẫn chứa tinh trùng, tụi mình bắt buộc phải dùng bao cao su''.", "nextNode": "step2"}]}, "step2": {"text": "Bạn trai tiếp tục thuyết phục: ''Hôm nay là ngày an toàn hiển thị màu xanh trên app của cậu mà, không cần dùng bao đâu!''", "choices": [{"text": "Tin vào thuật toán của app và đồng ý không dùng bao cao su.", "nextNode": "fail_app"}, {"text": "Giải thích: ''Stress hay sinh hoạt thay đổi có thể làm trứng rụng bất thường. App chỉ để tham khảo thôi''.", "nextNode": "step3"}]}, "step3": {"text": "Bạn trai đưa ra một miếng dán phim VCF và bảo đặt cái này là đủ tự nhiên rồi, không cần bao cao su ngột ngạt.", "choices": [{"text": "Đồng ý dùng màng phim VCF đơn độc vì nghe quảng cáo rất khoa học.", "nextNode": "fail_vcf"}, {"text": "Kiên quyết: ''Màng phim VCF dùng một mình có tỷ lệ thất bại thực tế 28%, tụi mình phải dùng bao cao su''.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành xuất sắc thử thách! Bạn đã kiên định bảo vệ bản thân trước mọi phương pháp tránh thai rủi ro cao.", "isEnd": true, "isSuccess": true}, "fail_precum": {"text": "❌ Thất bại! Dịch nhờn pre-cum tiết ra trước khi xuất tinh vẫn có chứa tinh trùng và gây dính bầu như thường.", "isEnd": true, "isSuccess": false}, "fail_app": {"text": "❌ Thất bại! Chu kỳ tuổi dậy thì thường xuyên thay đổi do biến động sinh lý. Tính ngày an toàn theo app rất dễ dính bầu.", "isEnd": true, "isSuccess": false}, "fail_vcf": {"text": "❌ Thất bại! Chất diệt tinh trùng/màng phim VCF dùng một mình có tỷ lệ rò rỉ rất lớn, không đủ làm lá chắn độc lập.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các phương pháp tránh thai sau đây vào đúng hộp hiệu quả:", "leftBox": {"title": "Khoa học & An toàn cao"}, "rightBox": {"title": "May rủi & Rủi ro lớn"}, "items": [{"text": "Sử dụng bao cao su đúng cách từ đầu đến cuối", "correctBox": "left"}, {"text": "Xuất tinh ngoài (Pulling out) trước khi xuất tinh", "correctBox": "right"}, {"text": "Uống thuốc tránh thai hàng ngày đúng giờ cố định", "correctBox": "left"}, {"text": "Tính ngày an toàn dựa theo app điện thoại", "correctBox": "right"}, {"text": "Dùng màng phim tránh thai VCF đơn độc", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp đúng các khái niệm rủi ro tránh thai sau:", "pairs": [{"left": "Dịch nhờn Pre-cum", "right": "Chất bôi trơn tự nhiên chứa tinh trùng gây mang thai ngoài ý muốn."}, {"left": "App tính chu kỳ", "right": "Chỉ dùng theo dõi sức khỏe, không dùng làm biện pháp ngừa thai chính."}, {"left": "Màng phim VCF", "right": "Chất diệt tinh trùng, có tỷ lệ thất bại thực tế 28% nếu đi một mình."}, {"left": "Rút ra kịp thời", "right": "Lời hứa không an toàn vì khó kiểm soát phản xạ xuất tinh khi thăng hoa."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền các từ thích hợp để hoàn thành đoạn văn sau về các rủi ro tránh thai:", "sentence": "Xuất tinh ngoài là phương pháp ngừa thai có độ [blank1] vô cùng cao. Dịch nhờn tiết ra trước khi xuất tinh vẫn có chứa [blank2]. Việc tính ngày an toàn bằng app rất dễ sai lệch do chu kỳ của teen thường biến động vì [blank3]. Biện pháp bảo vệ tốt nhất vẫn là sử dụng [blank4] chuẩn chỉnh.", "blanks": {"blank1": {"correct": "rủi ro", "placeholder": "..."}, "blank2": {"correct": "tinh trùng", "placeholder": "..."}, "blank3": {"correct": "stress", "placeholder": "..."}, "blank4": {"correct": "bao cao su", "placeholder": "..."}}, "words": ["rủi ro", "tinh trùng", "stress", "bao cao su", "an toàn", "nước tiểu", "thời tiết", "thuốc khẩn cấp"]}', 5),
(@ml_id, 'interaction', '{"question": "Đối phương nói: ''Nếu cậu bắt dùng bao cao su thì chứng tỏ cậu không tin tưởng tớ và không thực sự yêu tớ''. Câu trả lời thể hiện sự tự tôn của bạn?", "enableLives": true, "choices": [{"text": "Xin lỗi cậu nha, vậy lần này tụi mình cứ... tự nhiên nhé.", "correct": false, "emoji": "😐"}, {"text": "Yêu thương và tin tưởng nhau là phải cùng nhau bảo vệ sức khỏe và tương lai của nhau. Không có bao cao su thì tớ từ chối.", "correct": true, "emoji": "💚"}, {"text": "Tức giận quát mắng và chặn liên lạc của đối phương.", "correct": false, "emoji": "🛑"}]}', 6);

-- =========================================================================
-- BÀI HỌC 8: Bảo Vệ Bản Thân Khỏi STI & Xét Nghiệm
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes, teaser_video_id, full_video_id)
VALUES (
    @course_id,
    'bao-ve-ban-than-khoi-sti-va-xet-nghiem',
    'Bảo Vệ Bản Thân Khỏi STI & Xét Nghiệm',
    'Nhận diện các bệnh lây truyền qua đường tình dục và bình thường hóa việc đi xét nghiệm.',
    'Bài học hướng dẫn nhận biết các bệnh lây truyền qua đường tình dục (STI), lật đổ nỗi sợ và sự kỳ thị, hướng dẫn rủ partner đi xét nghiệm và quy trình khám an toàn.',
    8,
    false,
    100,
    8,
    NULL,
    NULL
);
SET @lesson8_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson8_id, 'Scarleteen - Safe, Sound & Sexy: STI Prevention', 'https://www.scarleteen.com/read/sexual-health/safe-sound-sexy-safer-sex-how', 'website');

-- --- Micro Lesson 8.1: STI là gì và chúng lây qua con đường nào? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson8_id, 'STI là gì và chúng lây qua con đường nào?', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bệnh lây truyền qua đường tình dục (STI) có phải là thứ gì đó xa xôi, chỉ người lớn mới bị?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["STI viết tắt của Sexually Transmitted Infections. Rất phổ biến ở mọi lứa tuổi có quan hệ.", "Lây nhiễm thông qua trao đổi dịch sinh dục hoặc tiếp xúc trực tiếp da kề da khu vực nhạy cảm.", "Bất kỳ ai bắt đầu đụng chạm vùng kín đều có khả năng tiếp xúc với tác nhân gây bệnh."]}', 2),
(@ml_id, 'scenario', '{"title": "Suy nghĩ ngây thơ", "body": "Huy nghĩ chỉ có những người có lối sống ''buông thả'' mới bị bệnh, còn bạn bè học sinh chăm ngoan như tụi mình thì không bao giờ có thể bị lây STI."}', 3),
(@ml_id, 'interaction', '{"question": "Nhận định của Huy có đúng không?", "choices": [{"text": "Sai rồi. Vi khuẩn và virus không phân biệt lối sống, chỉ cần tiếp xúc không an toàn là lây.", "correct": true, "emoji": "💚"}, {"text": "Đúng thế, học sinh ngoan có sức đề kháng tốt nên khó bị lây.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng có định kiến xấu về những người mắc bệnh lây truyền qua đường tình dục chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["STI là vấn đề sức khỏe bình thường, bất kỳ ai cũng có thể bị lây nhiễm nếu không bảo vệ."]}', 6);

-- --- Micro Lesson 8.2: Nhận biết những dấu hiệu thầm lặng của STI ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson8_id, 'Nhận biết những dấu hiệu thầm lặng của STI', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao biết cơ thể đang nhiễm STI khi nhìn bên ngoài hoàn toàn khỏe mạnh, không triệu chứng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Rất nhiều bệnh STI (như chlamydia, lậu) diễn ra hoàn toàn thầm lặng không có biểu hiện rõ ràng.", "Bạn không thể biết đối phương có bệnh hay không chỉ bằng cách quan sát ngoại hình.", "Triệu chứng có thể là: dịch tiết bất thường, ngứa ngáy, tiểu buốt hoặc các vết loét nhỏ."]}', 2),
(@ml_id, 'scenario', '{"title": "Bề ngoài khỏe mạnh", "body": "Vy quan sát người yêu thấy rất sạch sẽ, điển trai và tự tin. Vy nghĩ anh ấy chắc chắn 100% là người sạch bệnh nên không cần dùng biện pháp bảo vệ."}', 3),
(@ml_id, 'interaction', '{"question": "Có thể nhận biết bệnh STI bằng mắt thường không?", "choices": [{"text": "Không thể. Nhiều bệnh STI hoàn toàn không có triệu chứng ban đầu.", "correct": true, "emoji": "💚"}, {"text": "Có thể, người nhiễm STI thường da dẻ nhợt nhạt và có vết loét lộ rõ.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có hiểu tại sao xét nghiệm định kỳ là cách duy nhất để khẳng định có bệnh hay không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bề ngoài sạch sẽ không đảm bảo bên trong không có mầm bệnh. Hãy luôn dùng bao cao su bảo vệ!"]}', 6);

-- --- Micro Lesson 8.3: Vượt qua nỗi sợ bị kỳ thị và xấu hổ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson8_id, 'Vượt qua nỗi sợ bị kỳ thị và xấu hổ', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao việc thừa nhận mắc bệnh STI lại đáng sợ hơn chính căn bệnh đó đối với nhiều người?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sự phán xét xã hội biến các bệnh lây nhiễm thành sự xấu hổ về nhân cách.", "Mắc STI đơn thuần là một tai nạn sức khỏe, giống như bạn bị cảm cúm hay đau mắt hột.", "Phát hiện sớm và chữa trị kịp thời là cách tự bảo vệ mình và có trách nhiệm xã hội."]}', 2),
(@ml_id, 'scenario', '{"title": "Nỗi lo phán xét", "body": "Minh phát hiện vùng kín nổi vài nốt mụn lạ ngứa ngáy. Minh vô cùng sợ hãi, khóc suốt và không dám đi khám vì sợ bác sĩ và người lớn nghĩ mình là đứa hư hỏng."}', 3),
(@ml_id, 'interaction', '{"question": "Khuyên Minh hành động thế nào là đúng đắn nhất?", "choices": [{"text": "Bình tĩnh, đặt lịch khám tại trung tâm da liễu hoặc sức khỏe sinh sản uy tín để bác sĩ điều trị sớm.", "correct": true, "emoji": "💚"}, {"text": "Im lặng tự mua thuốc bôi trên mạng để giấu kín sự việc.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng cảm thông và hỗ trợ bạn bè đi khám nếu họ chia sẻ thắc mắc thầm kín với bạn?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bệnh tật không định nghĩa nhân cách của bạn. Đi khám và chữa trị sớm là sự dũng cảm và trách nhiệm."]}', 6);

-- --- Micro Lesson 8.4: Rủ người yêu đi xét nghiệm STI lành mạnh ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson8_id, 'Rủ người yêu đi xét nghiệm STI lành mạnh', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao rủ người yêu đi xét nghiệm STI chung mà không khiến họ nghĩ mình đang nghi ngờ họ lăng nhăng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đặt câu hỏi dưới góc độ chăm sóc lẫn nhau chứ không phải buộc tội.", "Sử dụng ngôn ngữ tích cực: ''Tớ muốn tụi mình cùng đi xét nghiệm để chắc chắn cả hai đều an toàn và khỏe mạnh''.", "Biến buổi đi khám thành một hoạt động chăm sóc đôi lứa bình thường."]}', 2),
(@ml_id, 'scenario', '{"title": "Rủ rê tinh tế", "body": "Trang muốn cùng người yêu đi xét nghiệm STI trước khi quyết định dừng dùng bao cao su. Trang sợ người yêu tự ái nghĩ Trang coi thường mình."}', 3),
(@ml_id, 'interaction', '{"question": "Trang nên nói thế nào cho khéo léo?", "choices": [{"text": "''Để cả hai cùng yên tâm và có trách nhiệm với nhau, tụi mình cùng đi kiểm tra sức khỏe sinh sản định kỳ nhé''.", "correct": true, "emoji": "💚"}, {"text": "''Anh đi xét nghiệm đi, em thấy anh dạo này hay đi chơi riêng nghi ngờ lắm''.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thấy một partner chủ động rủ đi xét nghiệm STI là người vô cùng đáng tin cậy không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Xét nghiệm STI không phải nghi ngờ, đó là cam kết bảo vệ sức khỏe cho nhau."]}', 6);

-- --- Micro Lesson 8.5: Quy trình đi xét nghiệm STI diễn ra như thế nào? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson8_id, 'Quy trình đi xét nghiệm STI diễn ra như thế nào?', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có tò mò quy trình đi xét nghiệm bệnh tình dục diễn ra thế nào tại các cơ sở y tế?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bác sĩ sẽ hỏi sơ lược về lịch sử sức khỏe của bạn trong không gian riêng tư bảo mật.", "Thực hiện lấy mẫu dịch nhầy nhạy cảm bằng tăm bông chuyên dụng, hoặc lấy mẫu máu/nước tiểu.", "Quá trình lấy mẫu diễn ra nhanh chóng, không gây đau đớn, kết quả thường có sau vài giờ đến vài ngày."]}', 2),
(@ml_id, 'scenario', '{"title": "Tại phòng khám", "body": "Hòa đến trung tâm y tế xét nghiệm. Hòa lo lắng phòng khám sẽ công khai thông tin cho trường học hoặc bố mẹ biết. Bác sĩ cam đoan mọi kết quả đều được bảo mật tuyệt đối theo luật y tế."}', 3),
(@ml_id, 'interaction', '{"question": "Quyền riêng tư của bạn khi đi xét nghiệm được bảo vệ ra sao?", "choices": [{"text": "Thông tin cá nhân và kết quả xét nghiệm được bảo mật tuyệt đối giữa bạn và bác sĩ.", "correct": true, "emoji": "💚"}, {"text": "Bệnh viện có quyền gửi báo cáo kết quả về nhà trường để giáo dục.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Hiểu rõ quy trình bảo mật y tế có giúp bạn tự tin đi khám hơn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bảo mật thông tin là luật y tế bắt buộc. Hãy yên tâm đi khám tại các trung tâm chính quy!"]}', 6);

-- --- Micro Lesson 8.6: Bạn nghĩ xét nghiệm STI có đáng sợ không? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson8_id, 'Bạn nghĩ xét nghiệm STI có đáng sợ không?', 6);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nỗi sợ lớn nhất của bạn khi nghĩ về việc đi xét nghiệm STI là gì?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nỗi sợ kim tiêm, sợ đau hay sợ đối mặt với kết quả dương tính là điều dễ hiểu.", "Tuy nhiên, hầu hết các bệnh STI (như lậu, sùi mào gà, giang mai) đều chữa khỏi hoàn toàn nếu phát hiện sớm.", "Ngay cả HIV cũng có thuốc kiểm soát hiệu quả giúp người bệnh sống khỏe mạnh bình thường."]}', 2),
(@ml_id, 'scenario', '{"title": "Đối mặt kết quả", "body": "Hạnh nhận kết quả xét nghiệm dương tính với Chlamydia. Hạnh lo sợ mình sắp chết. Bác sĩ mỉm cười nhẹ giải thích bệnh này chỉ cần uống thuốc kháng sinh 1 tuần là khỏi hoàn toàn."}', 3),
(@ml_id, 'interaction', '{"question": "Hầu hết các bệnh STI chữa trị thế nào nếu phát hiện sớm?", "choices": [{"text": "Có thể chữa khỏi hoàn toàn bằng thuốc kháng sinh hoặc các phác đồ y tế đơn giản.", "correct": true, "emoji": "💚"}, {"text": "Là bệnh nan y không thể cứu chữa, người bệnh sẽ chịu biến chứng suốt đời.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đồng ý rằng phát hiện sớm để chữa trị tốt hơn là trốn tránh để bệnh tiến triển nặng?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Xét nghiệm giúp bạn nắm quyền chủ động kiểm soát sức khỏe. Đừng để nỗi sợ làm chậm trễ!"]}', 6);

-- --- Micro Lesson 8.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson8_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Bảo vệ Khỏi STI''! Hãy cùng dẹp tan những virus đáng ghét."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Cuộc phiêu lưu: Đối phó với STI", "startNode": "step1", "nodes": {"step1": {"text": "Bạn phát hiện vùng kín của mình dạo gần đây có biểu hiện ngứa rát lạ và tiết dịch bất thường.", "choices": [{"text": "Lên các hội nhóm ẩn danh hỏi mua thuốc nam gia truyền về tự bôi.", "nextNode": "fail_selfmed"}, {"text": "Đặt lịch khám tại khoa da liễu bệnh viện uy tín để xét nghiệm kiểm tra.", "nextNode": "step2"}]}, "step2": {"text": "Bác sĩ xác nhận bạn nhiễm một loại STI thông thường và cho đơn thuốc. Bạn lo lắng không biết nói với partner thế nào để họ cùng đi khám.", "choices": [{"text": "Im lặng tự uống thuốc một mình, tiếp tục quan hệ không bảo vệ.", "nextNode": "fail_silent"}, {"text": "Trò chuyện thẳng thắn với partner để họ cùng đi kiểm tra điều trị dứt điểm cho cả hai.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Tuyệt vời! Bạn đã vượt qua nỗi sợ để đi khám kịp thời và có giải pháp ứng xử trách nhiệm bảo vệ cả hai.", "isEnd": true, "isSuccess": true}, "fail_selfmed": {"text": "❌ Thất bại! Tự ý dùng thuốc không rõ nguồn gốc làm bệnh biến chứng nặng nề và khó điều trị hơn.", "isEnd": true, "isSuccess": false}, "fail_silent": {"text": "❌ Thất bại! Không điều trị cho partner dẫn đến việc lây nhiễm chéo liên tục (hiệu ứng ping-pong) khiến bệnh tái phát.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các đường lây truyền và ngăn ngừa STI sau:", "leftBox": {"title": "Đường lây nhiễm STI"}, "rightBox": {"title": "Cách ngừa & Phòng chống"}, "items": [{"text": "Tiếp xúc da kề da khu vực vùng kín bị loét", "correctBox": "left"}, {"text": "Sử dụng bao cao su đều đặn từ đầu đến cuối", "correctBox": "right"}, {"text": "Dùng chung đồ chơi tình dục chưa được khử trùng", "correctBox": "left"}, {"text": "Đi xét nghiệm STI định kỳ cùng partner", "correctBox": "right"}, {"text": "Quan hệ tình dục xâm nhập không có lá chắn bảo vệ", "correctBox": "left"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp đúng các loại bệnh STI với cơ chế của chúng:", "pairs": [{"left": "Chlamydia", "right": "Bệnh nhiễm khuẩn thầm lặng thường không có triệu chứng ban đầu."}, {"left": "Bảo mật y tế", "right": "Quy tắc giữ kín tuyệt đối thông tin bệnh án của người khám bệnh."}, {"left": "Hiệu ứng Ping-pong", "right": "Hiện tượng lây nhiễm qua lại liên tục do chỉ điều trị 1 bên."}, {"left": "Bao cao su latex", "right": "Rào chắn hiệu quả chặn vi khuẩn/virus tiếp xúc niêm mạc."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp để hoàn thành đoạn văn về STI:", "sentence": "Bệnh lây truyền qua đường tình dục STI có thể diễn ra vô cùng [blank1]. Cách duy nhất để phát hiện là đi [blank2] y khoa. Hầu hết các bệnh này đều có thể [blank3] hoàn toàn nếu phát hiện sớm. Tuyệt đối đừng tự ý [blank4] thuốc tại nhà.", "blanks": {"blank1": {"correct": "thầm lặng", "placeholder": "..."}, "blank2": {"correct": "xét nghiệm", "placeholder": "..."}, "blank3": {"correct": "chữa khỏi", "placeholder": "..."}, "blank4": {"correct": "mua", "placeholder": "..."}}, "words": ["thầm lặng", "xét nghiệm", "chữa khỏi", "mua", "rầm rộ", "bỏ qua", "lây nhiễm", "giấu"]}', 5),
(@ml_id, 'interaction', '{"question": "Bạn nghĩ việc ôm hôn xã giao thông thường có lây truyền phần lớn các bệnh STI nghiêm trọng (như HIV, chlamydia) không?", "enableLives": true, "choices": [{"text": "Hoàn toàn không. Những tiếp xúc thông thường như ôm, nắm tay, dùng chung nhà vệ sinh không lây nhiễm bệnh.", "correct": true, "emoji": "💚"}, {"text": "Có chứ, các bệnh đó lây cực mạnh qua không khí.", "correct": false, "emoji": "🛑"}, {"text": "Có lây nếu đứng quá gần người bệnh.", "correct": false, "emoji": "😐"}]}', 6);

-- =========================================================================
-- BÀI HỌC 9: Đưa Ra Quyết Định Sáng Suốt
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes, teaser_video_id, full_video_id)
VALUES (
    @course_id,
    'dua-ra-quyet-dinh-sang-suot',
    'Đưa Ra Quyết Định Sáng Suốt',
    'Lắng nghe bản thân, xây dựng kế hoạch an toàn và tự tin làm chủ lựa chọn cá nhân.',
    'Bài học giúp bạn rèn luyện tư duy tự chủ, kỹ năng check-in cảm xúc cá nhân, deal với áp lực yêu đương và lập kế hoạch bảo vệ an toàn cho tương lai.',
    9,
    false,
    100,
    8,
    NULL,
    NULL
);
SET @lesson9_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson9_id, 'Scarleteen - Making Healthy Sexual Decisions', 'https://www.scarleteen.com/read/sexual-health', 'website');

-- --- Micro Lesson 9.1: Quyết định này là của riêng bạn, không của ai khác ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson9_id, 'Quyết định này là của riêng bạn, không của ai khác', 1);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để biết bạn đưa ra quyết định vì thực sự muốn thế hay chỉ vì muốn làm hài lòng người khác?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tự chủ (Autonomy) nghĩa là bạn có quyền lực tối cao với cơ thể và cuộc đời mình.", "Mọi quyết định gần gũi thân mật phải xuất phát từ mong muốn tự nguyện sâu bên trong bạn.", "Nếu bạn cảm thấy bồn chồn lo lắng, đó là tín hiệu cơ thể cảnh báo bạn chưa sẵn sàng."]}', 2),
(@ml_id, 'scenario', '{"title": "Mất phương hướng", "body": "Dũng đồng ý đi xa qua đêm cùng bạn gái vì bạn gái bảo: ''Bạn bè xung quanh ai cũng đi chung như thế cả rồi''. Dũng trong lòng lo sợ và không thoải mái."}', 3),
(@ml_id, 'interaction', '{"question": "Quyết định của Dũng có thực sự tự chủ không?", "choices": [{"text": "Không, Dũng đồng ý vì áp lực muốn giống bạn bè xung quanh.", "correct": true, "emoji": "💚"}, {"text": "Có, Dũng tự chọn đi theo đám đông mà.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ làm điều gì đó chỉ vì sợ bị coi là ''lạc loài'' so với nhóm bạn chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể và tương lai của bạn là của bạn. Hãy đưa ra quyết định vì chính bạn đầu tiên!"]}', 6);

-- --- Micro Lesson 9.2: 3 câu hỏi tự check-in trước khi nói 'Đồng ý' ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson9_id, '3 câu hỏi tự check-in trước khi nói ''Đồng ý''', 2);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Trước khi gật đầu đồng ý tiến xa hơn với ai đó, hãy tự hỏi bản thân 3 câu hỏi này nhé!"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Câu hỏi 1: ''Mình có thực sự THÍCH và muốn làm việc này lúc này không?''", "Câu hỏi 2: ''Mình có sẵn sàng chịu trách nhiệm và biết cách BẢO VỆ an toàn chưa?''", "Câu hỏi 3: ''Mối quan hệ này có TÔN TRỌNG ranh giới của mình không?''"]}', 2),
(@ml_id, 'scenario', '{"title": "3 câu hỏi vàng", "body": "Hạnh chuẩn bị đồng ý đi chơi riêng tại nhà bạn trai. Hạnh mở điện thoại tự check-in 3 câu hỏi trên. Hạnh nhận ra mình chưa chuẩn bị bao cao su ngừa thai."}', 3),
(@ml_id, 'interaction', '{"question": "Hạnh nên làm gì tiếp theo?", "choices": [{"text": "Dừng lại, yêu cầu chuẩn bị biện pháp bảo vệ trước khi đồng ý đi.", "correct": true, "emoji": "💚"}, {"text": "Cứ đi đi, đến nơi rồi tính sau lo gì.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn nghĩ câu hỏi check-in nào trong 3 câu hỏi trên là khó trả lời nhất đối với bạn?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Luôn check-in bản thân trước khi trả lời đối phương. Sự cẩn thận giúp bạn làm chủ mọi tình huống!"]}', 6);

-- --- Micro Lesson 9.3: Sự giằng xé giữa làm hài lòng người yêu và ranh giới cá nhân ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson9_id, 'Sự giằng xé giữa làm hài lòng người yêu và ranh giới cá nhân', 3);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có sẵn sàng đánh đổi sự an toàn của mình chỉ để đổi lấy nụ cười và sự vui lòng của đối phương?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nhiều bạn trẻ chọn nhượng bộ ranh giới vì sợ người yêu giận dỗi, lạnh nhạt hoặc đòi chia tay.", "Tuy nhiên, sự hy sinh một chiều chỉ tạo ra mối quan hệ bất bình đẳng và độc hại.", "Người thực sự yêu thương bạn sẽ trân trọng ranh giới của bạn và kiên nhẫn chờ đợi."]}', 2),
(@ml_id, 'scenario', '{"title": "Hy sinh thầm lặng", "body": "Bình lo sợ nếu mình từ chối đụng chạm, người yêu sẽ đi tìm bạn gái khác sành điệu hơn. Bình nhắm mắt đồng ý dù trong lòng đầy bất an."}', 3),
(@ml_id, 'interaction', '{"question": "Mối quan hệ của Bình có lành mạnh không?", "choices": [{"text": "Không lành mạnh. Bình đang bị áp lực thao túng tâm lý và bỏ qua ranh giới của mình.", "correct": true, "emoji": "🚩"}, {"text": "Có lành mạnh, yêu là phải biết hy sinh vì nhau.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có nghĩ một người yêu sẵn sàng chia tay vì bạn giữ ranh giới có đáng để tiếp tục yêu không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không cần phải làm hài lòng người khác bằng cách bỏ qua cảm xúc của chính mình."]}', 6);

-- --- Micro Lesson 9.4: Cuộc đối thoại nghiêm túc trước khi tiến xa ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson9_id, 'Cuộc đối thoại nghiêm túc trước khi tiến xa', 4);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao đối thoại thẳng thắn với partner về những giới hạn của bản thân mà không làm sứt mẻ tình cảm?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chọn thời điểm thích hợp và dùng ngôn ngữ ''Tớ thấy... nên tớ muốn...''.", "Nói rõ những điều bạn sẵn sàng làm và những giới hạn tuyệt đối bạn chưa muốn vượt qua.", "Lắng nghe phản hồi từ đối phương để xem họ có thực sự thấu hiểu và tôn trọng bạn không."]}', 2),
(@ml_id, 'scenario', '{"title": "Bày tỏ giới hạn", "body": "Trước buổi tối đi xem phim riêng, Vy nói với người yêu: ''Tớ thích được ôm và nắm tay cậu, nhưng tớ chưa sẵn sàng cho đụng chạm xa hơn. Cậu tôn trọng tớ nhé''."}', 3),
(@ml_id, 'interaction', '{"question": "Phản ứng nào của người yêu Vy là Green Flag?", "choices": [{"text": "Mỉm cười: ''Tớ hiểu rồi, cậu thoải mái là được. Tụi mình cứ từ từ nhé''.", "correct": true, "emoji": "💚"}, {"text": "Dỗi: ''Cậu kỹ tính quá vậy, làm gì mà nghiêm trọng hóa vấn đề thế''.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có tự tin mình có thể bày tỏ rõ ràng giới hạn của mình với partner không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đối thoại thẳng thắn giúp loại bỏ mọi hiểu lầm và thắt chặt kết nối tin cậy giữa hai người."]}', 6);

-- --- Micro Lesson 9.5: Lên kế hoạch bảo vệ bản thân khi đi chơi xa ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson9_id, 'Lên kế hoạch bảo vệ bản thân khi đi chơi xa', 5);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để các chuyến đi phượt hay đi chơi xa với người yêu luôn vui vẻ và hoàn toàn an toàn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Luôn chủ động mang theo bao cao su hoặc chuẩn bị sẵn sàng biện pháp tránh thai nội tiết.", "Tìm hiểu trước địa chỉ các nhà thuốc hoặc cơ sở y tế gần nơi đến phòng trường hợp khẩn cấp.", "Luôn giữ liên lạc với một người bạn thân đáng tin cậy để phòng sự cố ngoài kiểm soát."]}', 2),
(@ml_id, 'scenario', '{"title": "Kế hoạch đi phượt", "body": "Huy và An cùng lên kế hoạch đi du lịch. An chủ động mang theo vỉ thuốc tránh thai hàng ngày, Huy chuẩn bị một hộp bao cao su mới và cả hai cùng thống nhất ranh giới."}', 3),
(@ml_id, 'interaction', '{"question": "Kế hoạch của Huy và An thể hiện điều gì?", "choices": [{"text": "Sự chín chắn, có sự chuẩn bị chu đáo thể hiện tình yêu văn minh và trách nhiệm.", "correct": true, "emoji": "💚"}, {"text": "Sự lo xa thái quá làm mất đi tính lãng mạn bất ngờ của chuyến đi.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng chuẩn bị kế hoạch an toàn trước mọi chuyến đi xa không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Sự chuẩn bị kỹ lưỡng là lá chắn vững chắc giúp bạn tận hưởng trọn vẹn niềm vui tuổi trẻ."]}', 6);

-- --- Micro Lesson 9.6: Trái tim và lý trí của bạn đang nói gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson9_id, 'Trái tim và lý trí của bạn đang nói gì?', 6);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để cân bằng giữa cảm xúc yêu đương mãnh liệt và lý trí bảo vệ bản thân?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Yêu thương là cảm xúc tuyệt vời, nhưng lý trí giúp bạn đi đường dài một cách an toàn.", "Đừng để sự thăng hoa nhất thời che mờ các nguyên tắc an toàn sức khỏe và ranh giới cá nhân.", "Nếu trái tim nói ''Muốn'' nhưng lý trí nói ''Nguy hiểm'', hãy luôn phanh gấp lại để suy nghĩ."]}', 2),
(@ml_id, 'scenario', '{"title": "Phanh gấp đúng lúc", "body": "Trong không gian lãng mạn, Duy định tiến xa hơn với Vy. Vy thấy rất thích Duy nhưng sực nhớ ra cả hai chưa có biện pháp bảo vệ nào. Vy quyết định dừng lại."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động của Vy thể hiện điều gì?", "choices": [{"text": "Vy là người có lý trí mạnh mẽ, biết làm chủ bản thân để bảo vệ tương lai.", "correct": true, "emoji": "💚"}, {"text": "Vy là người lạnh lùng, thiếu cảm xúc yêu thương nồng cháy.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn nghĩ mình có đủ bản lĩnh để phanh gấp khi cảm xúc đang thăng hoa không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Lý trí không làm mất đi tình yêu, nó giữ cho tình yêu của bạn luôn đẹp đẽ và an toàn."]}', 6);

-- --- Micro Lesson 9.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson9_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Quyết Định Sáng Suốt''! Hãy khẳng định bản lĩnh của bạn."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Cuộc phiêu lưu: Làm chủ lựa chọn", "startNode": "step1", "nodes": {"step1": {"text": "Bạn và người yêu đang đi du lịch chung. Tối đến trong phòng riêng, người yêu ôm chặt và muốn tiến xa hơn.", "choices": [{"text": "Đồng ý ngay lập tức vì không muốn người yêu giận dỗi làm hỏng chuyến đi.", "nextNode": "fail_peer"}, {"text": "Tự hỏi bản thân 3 câu hỏi check-in xem mình thực sự sẵn sàng và có biện pháp bảo vệ chưa.", "nextNode": "step2"}]}, "step2": {"text": "Bạn nhận ra mình chưa chuẩn bị bao cao su. Người yêu bảo: ''Một lần thôi có sao đâu, anh rút kịp mà''.", "choices": [{"text": "Tặc lưỡi đồng ý vì tin vào lời hứa của đối phương.", "nextNode": "fail_withdrawal"}, {"text": "Kiên quyết từ chối: ''Tớ rất quý cậu nhưng không có bảo vệ thì không đi tiếp. Tụi mình nói chuyện tiếp nhé''.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Chúc mừng! Bạn đã đưa ra quyết định cực kỳ sáng suốt, tôn trọng bản thân và làm chủ ranh giới an toàn.", "isEnd": true, "isSuccess": true}, "fail_peer": {"text": "❌ Thất bại! Bạn đồng ý vì áp lực muốn chiều lòng người khác chứ không phải mong muốn tự nguyện thực sự của bản thân.", "isEnd": true, "isSuccess": false}, "fail_withdrawal": {"text": "❌ Thất bại! Bạn đã thỏa hiệp với biện pháp rủi ro cao, đặt bản thân vào nguy cơ mang thai ngoài ý muốn.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các hành vi đưa ra quyết định sau:", "leftBox": {"title": "Quyết định Tự chủ (Green)"}, "rightBox": {"title": "Thỏa hiệp, Nhượng bộ (Red)"}, "items": [{"text": "Tự check-in 3 câu hỏi trước khi gật đầu đồng ý tiến xa", "correctBox": "left"}, {"text": "Đồng ý đụng chạm vì sợ đối phương giận đòi chia tay", "correctBox": "right"}, {"text": "Thẳng thắn bày tỏ giới hạn ranh giới trước khi đi chơi xa", "correctBox": "left"}, {"text": "Làm chuyện ấy chỉ vì bạn bè xung quanh ai cũng làm rồi", "correctBox": "right"}, {"text": "Dừng lại ngay lập tức khi phát hiện không có bao cao su bảo vệ", "correctBox": "left"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp đúng các nguyên tắc đưa ra quyết định an toàn sau:", "pairs": [{"left": "Tự chủ", "right": "Quyền lực tối cao tự định đoạt cơ thể và cuộc đời của riêng bạn."}, {"left": "3 câu hỏi vàng", "right": "Bộ công cụ tự vấn bản thân về sự thích, sự sẵn sàng và sự bảo vệ."}, {"left": "Thao túng tâm lý", "right": "Hành vi dùng lời dỗi hờn, mặc cả lòng tin để ép đụng chạm."}, {"left": "Lập kế hoạch an toàn", "right": "Chủ động chuẩn bị biện pháp bảo vệ và tìm hiểu hiệu thuốc trước khi đi xa."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp để hoàn thành đoạn văn về quyết định sáng suốt:", "sentence": "Quyết định gần gũi thân mật phải là sự [blank1] tự nguyện của riêng bạn. Tuyệt đối không thỏa hiệp vì [blank2] đồng trang lứa. Hãy chuẩn bị [blank3] trước khi tiến xa. Sự sáng suốt của [blank4] sẽ bảo vệ ước mơ của bạn.", "blanks": {"blank1": {"correct": "lựa chọn", "placeholder": "..."}, "blank2": {"correct": "áp lực", "placeholder": "..."}, "blank3": {"correct": "kế hoạch an toàn", "placeholder": "..."}, "blank4": {"correct": "lý trí", "placeholder": "..."}}, "words": ["lựa chọn", "áp lực", "kế hoạch an toàn", "lý trí", "bắt buộc", "gia đình", "tự phát", "con tim"]}', 5),
(@ml_id, 'interaction', '{"question": "Khi partner dỗi: ''Cậu lo xa tính toán thế này làm mất hết cả hứng của tớ rồi'', phản ứng nào là tự tin và bản lĩnh nhất?", "enableLives": true, "choices": [{"text": "''An tâm thì mới vui vẻ trọn vẹn được chứ cậu. Tụi mình cùng có trách nhiệm với nhau nha''.", "correct": true, "emoji": "💚"}, {"text": "''Xin lỗi cậu nhé, tớ sẽ không nói chuyện này nữa đâu''.", "correct": false, "emoji": "😐"}, {"text": "''Cậu ích kỷ quá, chỉ biết nghĩ cho bản thân cậu thôi à''.", "correct": false, "emoji": "🛑"}]}', 6);
