-- =========================================================================
-- SEED DATA FOR COURSE: Lướt Mạng Tỉnh Táo, Kết Nối Cực Chất (Internet Safety & Digital Relationships)
-- Maps to schemas in init.sql: courses, lessons, micro_lessons,
-- micro_lesson_blocks, and lesson_sources.
-- =========================================================================

SET NAMES utf8mb4;
USE educare;

-- 1. Thêm Khóa học mới
INSERT INTO courses (title, description, thumbnail, color_theme, course_order)
VALUES (
    'Lướt Mạng Tỉnh Táo, Kết Nối Cực Chất',
    'Tìm hiểu cách bảo vệ quyền riêng tư, thiết lập ranh giới số, hiểu về sự đồng thuận trực tuyến, chia sẻ ảnh an toàn và ứng phó với cờ đỏ thao túng.',
    'digital-safety-course.png',
    '#7209b7',
    21
);
SET @course_id = LAST_INSERT_ID();

-- =========================================================================
-- BÀI HỌC 1: Dấu Chân Số: Đừng Để Lộ "Sơ Hở"! (Privacy & Info)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'quyen-rieng-tu-va-thong-tin-ca-nhan',
    'Dấu Chân Số: Đừng Để Lộ "Sơ Hở"!',
    'Hiểu về dấu chân số, cách phân loại thông tin nhạy cảm và bảo vệ tài khoản cá nhân.',
    'Bài học này giúp bạn nhận biết những gì an toàn để chia sẻ trực tuyến, cách quản lý dấu chân số của mình và thiết lập bảo mật cơ bản.',
    21,
    true,
    100,
    12
);
SET @lesson1_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson1_id, 'Scarleteen - Relationships', 'https://www.scarleteen.com/read/relationships', 'website');

-- --- Micro Lesson 1.1: Dấu chân số là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Dấu chân số là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có biết mỗi lần lướt mạng, bạn đều đang để lại một dấu chân không bao giờ biến mất?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Dấu chân số (Digital Footprint) là lịch sử hoạt động của bạn trên Internet: bài đăng, lượt like, comment, và tìm kiếm.", "Ngay cả khi bạn bấm nút Xóa, thông tin đó vẫn có thể đã được người khác chụp màn hình hoặc lưu lại.", "Hãy suy nghĩ kỹ trước khi nhấn nút Đăng."]}', 2),
(@ml_id, 'scenario', '{"title": "Bức ảnh dìm biến mất?", "body": "Nam đăng một bức ảnh dìm hài hước của đứa em họ lên mạng. Dù Nam đã xóa sau 5 phút, bức ảnh đã bị một người bạn tải về và gửi vào nhóm chat của lớp."}', 3),
(@ml_id, 'flashcard', '{"front": "Liệu có thể xóa hoàn toàn một thứ gì đó trên Internet không?", "back": "Rất tiếc là KHÔNG. Khi thông tin đã lên mạng, nó có thể được lưu trữ, chụp màn hình hoặc chia sẻ lại bất kỳ lúc nào.", "notes": "Hãy luôn tự hỏi: Mình có ổn không nếu bức ảnh/dòng trạng thái này tồn tại mãi mãi?"}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng đăng thứ gì lên mạng rồi sau đó cuống cuồng xóa đi vì thấy không nên chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Internet có trí nhớ siêu tốt. Hãy để lại những dấu chân số mà bạn tự hào nhé!"]}', 6);

-- --- Micro Lesson 1.2: Thông tin cá nhân nhạy cảm ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Thông tin cá nhân nhạy cảm', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao việc chia sẻ địa chỉ nhà hay thời khóa biểu lên mạng lại là một ý tưởng tồi?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Những thông tin như số điện thoại, mật khẩu, địa chỉ nhà, tên trường học và lộ trình đi lại là thông tin cá nhân nhạy cảm.", "Kẻ xấu có thể dùng chúng để định vị, theo dõi hoặc giả mạo danh tính của bạn.", "Giữ bí mật những thông tin này chính là chiếc khiên bảo vệ bạn khỏi các nguy cơ ngoài đời thực."]}', 2),
(@ml_id, 'scenario', '{"title": "Thẻ học sinh mới", "body": "Vy rất vui khi nhận được thẻ học sinh mới nên đã chụp ảnh khoe lên Story, lộ rõ họ tên, mã số học sinh và tên trường THCS đang học."}', 3),
(@ml_id, 'interaction', '{"question": "Vy đăng ảnh như vậy có an toàn không?", "choices": [{"text": "Không an toàn. Kẻ xấu có thể biết Vy học trường nào để tiếp cận hoặc quấy rối.", "correct": true, "emoji": "💚"}, {"text": "An toàn mà, chỉ có bạn bè trên mạng mới xem được thôi.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Hãy kiểm tra lại trang cá nhân của bạn, có thông tin nào tiết lộ nơi bạn đang sinh sống hoặc học tập không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bảo mật thông tin cá nhân chính là bảo vệ sự an toàn của chính mình ngoài đời thực."]}', 6);

-- --- Micro Lesson 1.3: Áp lực chia sẻ mọi thứ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Áp lực chia sẻ mọi thứ', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao tụi mình luôn có cảm giác thèm thuồng được đăng tất tần tật mọi thứ lên mạng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Lượt like, thả tim kích thích não bộ tiết ra dopamine, khiến tụi mình cảm thấy được quan tâm và công nhận.", "Áp lực từ bạn bè (ai cũng đăng thì mình cũng đăng) khiến bạn dễ chia sẻ quá đà (oversharing).", "Lắng nghe cảm xúc của mình trước khi đăng bài: Bạn đang thực sự muốn kết nối hay chỉ cần sự chú ý tức thời?"]}', 2),
(@ml_id, 'scenario', '{"title": "Status lúc buồn", "body": "Linh cảm thấy cô đơn vì bố mẹ bận việc. Linh định đăng một status buồn bã kể chi tiết chuyện gia đình cãi nhau để nhận được sự an ủi từ bạn bè."}', 3),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các hành vi đăng bài sau đây vào hộp phù hợp:", "leftBox": {"title": "Chia sẻ lành mạnh"}, "rightBox": {"title": "Chia sẻ quá đà"}, "items": [{"text": "Đăng ảnh chú mèo đáng yêu mới nuôi", "correctBox": "left"}, {"text": "Đăng ảnh chụp màn hình tin nhắn cãi nhau riêng tư với bạn thân", "correctBox": "right"}, {"text": "Đăng cảm nghĩ sau khi xem một bộ phim hay", "correctBox": "left"}, {"text": "Đăng số điện thoại của người khác để nhờ mọi người spam hộ", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ hối hận vì đã lỡ đăng một dòng trạng thái quá riêng tư lúc tâm trạng bất ổn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Không phải mọi cảm xúc đều cần được phơi bày trên mạng xã hội. Hãy giữ lại những khoảng riêng cho mình."]}', 6);

-- --- Micro Lesson 1.4: Tình huống: Bức ảnh dìm ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Tình huống: Bức ảnh dìm', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có thấy ổn khi bạn bè tự ý đăng ảnh dìm, ảnh xấu của bạn lên mạng mà không hỏi trước?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nhiều người nghĩ đăng ảnh dìm là đùa vui, nhưng đùa chỉ vui khi tất cả mọi người cùng cười.", "Tự ý đăng ảnh của người khác lên mạng là vi phạm quyền riêng tư của họ.", "Tôn trọng người khác bắt đầu từ việc hỏi ý kiến trước khi đăng ảnh có mặt họ."]}', 2),
(@ml_id, 'scenario', '{"title": "Khoảnh khắc ngáp ngủ", "body": "Trong buổi dã ngoại, Minh chụp được ảnh Khoa đang ngáp ngủ há to miệng. Minh thấy buồn cười và đăng lên mạng kèm caption trêu chọc. Khoa thấy rất xấu hổ."}', 3),
(@ml_id, 'flashcard', '{"front": "Bạn nên làm gì nếu bạn bè đăng ảnh dìm của bạn mà bạn không thích?", "back": "Hãy nói chuyện trực tiếp hoặc nhắn tin riêng một cách nhẹ nhàng nhưng rõ ràng: Cậu xóa bức ảnh đó giúp tớ nhé, tớ không thoải mái khi ảnh đó bị đăng lên mạng đâu.", "notes": "Bạn bè thực sự sẽ tôn trọng cảm xúc của bạn và xóa ảnh ngay lập tức."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng tự ý đăng ảnh dìm của bạn bè chỉ vì nghĩ nó vui chưa? Họ có thực sự vui không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đùa vui chỉ thực sự vui khi người trong cuộc cảm thấy thoải mái và đồng ý."]}', 6);

-- --- Micro Lesson 1.5: Dọn dẹp tài khoản số ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Dọn dẹp tài khoản số', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đã bao lâu rồi bạn chưa dọn dẹp danh sách bạn bè và cài đặt bảo mật của mình?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Để tài khoản ở chế độ công khai (Public) nghĩa là bất kỳ ai, kể cả người lạ, cũng có thể xem và tải ảnh của bạn về.", "Hãy lọc lại danh sách bạn bè: chỉ kết bạn với những người bạn thực sự quen biết ngoài đời.", "Sử dụng mật khẩu mạnh và bật xác thực 2 lớp (2FA) để bảo vệ tài khoản khỏi bị hack."]}', 2),
(@ml_id, 'scenario', '{"title": "Bị lấy ảnh đi lừa đảo", "body": "Tài khoản của Mai để chế độ công khai. Một ngày nọ, Mai phát hiện có một tài khoản lạ lấy toàn bộ ảnh của mình để đi lừa đảo nạp thẻ cào."}', 3),
(@ml_id, 'interaction', '{"question": "Mai nên làm gì để tránh tình trạng này lặp lại?", "choices": [{"text": "Chuyển tài khoản sang chế độ riêng tư (Private) và chỉ kết bạn với người quen biết.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục để công khai nhưng viết bài cảnh báo trên trang cá nhân.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Danh sách bạn bè trên mạng của bạn có bao nhiêu người là người lạ mà bạn chưa từng nói chuyện ngoài đời?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Khóa bớt cửa (bảo mật riêng tư) giúp ngôi nhà ảo của bạn an toàn hơn nhiều."]}', 6);

-- --- Micro Lesson 1.6: Kiểm soát những gì thuộc về mình ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Kiểm soát những gì thuộc về mình', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Ai mới là người có quyền tối cao quyết định những gì xuất hiện trên mạng xã hội của bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bạn chính là người biên tập và quản lý cuộc sống số của mình.", "Bạn có quyền từ chối yêu cầu kết bạn, hủy kết bạn (unfriend) hoặc chặn (block) bất kỳ ai khiến bạn thấy không thoải mái.", "Bảo vệ không gian mạng của bạn không phải là ích kỷ, đó là quyền tự chăm sóc bản thân."]}', 2),
(@ml_id, 'scenario', '{"title": "Những tin nhắn thô lỗ", "body": "Một tài khoản lạ liên tục gửi tin nhắn bình phẩm thô lỗ về ngoại hình của Lan dưới các bài đăng của cô ấy."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành động quản lý không gian số sau:", "leftBox": {"title": "Bảo vệ lành mạnh"}, "rightBox": {"title": "Cố chịu đựng"}, "items": [{"text": "Chặn một người liên tục nhắn tin trêu chọc thô lỗ", "correctBox": "left"}, {"text": "Vẫn rep tin nhắn của người lạ dù thấy sợ hãi vì sợ bị nói là kiêu", "correctBox": "right"}, {"text": "Hủy kết bạn với những tài khoản không còn tương tác hoặc không quen", "correctBox": "left"}, {"text": "Để người khác tự ý tag mình vào các bài viết quảng cáo độc hại", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy áy náy khi phải block hoặc unfriend một ai đó mang lại năng lượng độc hại không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn là chủ nhân tài khoản của mình. Bạn có quyền quyết định ai được phép bước vào thế giới số của bạn."]}', 6);


-- =========================================================================
-- BÀI HỌC 2: Chat Sao Cho "Mượt", Bớt "Bất Ổn"! (Healthy Communication)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'giao-tiep-mang-lanh-manh',
    'Chat Sao Cho "Mượt", Bớt "Bất Ổn"!',
    'Học cách giao tiếp tránh hiểu lầm, viết tin nhắn tôn trọng và giữ năng lượng tích cực.',
    'Bài học này trang bị cho bạn cách ứng xử tinh tế khi nhắn tin, kỹ năng hạ nhiệt khi group chat bốc hỏa và lọc năng lượng tích cực.',
    22,
    false,
    100,
    12
);
SET @lesson2_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson2_id, 'Scarleteen - Hello Sailor: How to Build, Board, and Navigate a Healthy Relationship', 'https://www.scarleteen.com/read/relationships/hello-sailor-how-build-board-navigate-healthy-relationship', 'website');

-- --- Micro Lesson 2.1: Giao tiếp qua màn hình ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Giao tiếp qua màn hình', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao nói chuyện trên mạng lại dễ gây hiểu lầm hơn là gặp mặt trực tiếp?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Khi nhắn tin, tụi mình thiếu đi biểu cảm gương mặt, ngôn ngữ cơ thể và tông giọng của đối phương.", "Một câu đùa tinh nghịch khi viết thành chữ có thể nghe như một lời mỉa mai lạnh lùng.", "Đọc kỹ tin nhắn và cố gắng không suy diễn tiêu cực khi chưa rõ ý người viết."]}', 2),
(@ml_id, 'scenario', '{"title": "Tin nhắn ngắn gọn", "body": "An nhắn tin rủ Bình đi chơi đá bóng. Bình đang bận làm bài tập nên nhắn lại ngắn gọn: Không đi. An nghĩ Bình đang giận dỗi mình nên cũng im lặng luôn."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm sao để giảm thiểu hiểu lầm khi giao tiếp qua tin nhắn chữ?", "back": "Sử dụng thêm emoji để thể hiện cảm xúc, tránh nhắn tin cộc lốc, và nếu thấy bất an, hãy gọi điện hoặc hỏi trực tiếp để làm rõ.", "notes": "Một emoji đúng chỗ có thể cứu vãn cả một tình bạn đấy!"}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng giận dỗi ai đó chỉ vì đọc tin nhắn cộc lốc của họ chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chữ viết không có tông giọng. Hãy thêm một chút ấm áp bằng biểu cảm hoặc hỏi lại cho rõ nhé."]}', 6);

-- --- Micro Lesson 2.2: Đọc vị giọng điệu tin nhắn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Đọc vị giọng điệu tin nhắn', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chữ Ừ hay Ok trong tin nhắn của bạn bè có thực sự đáng sợ như bạn nghĩ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mỗi người có phong cách nhắn tin khác nhau: có người thích viết dài kèm emoji, có người thích viết ngắn gọn.", "Đừng vội kết luận đối phương đang ghét mình chỉ qua một tin nhắn ngắn.", "Thay vì lo lắng suy diễn, hãy chủ động hỏi thăm nhẹ nhàng."]}', 2),
(@ml_id, 'scenario', '{"title": "Vy gửi bài hát", "body": "Vy gửi một bài hát yêu thích cho bạn thân. Bạn thân chỉ rep lại: Ok. Vy cảm thấy hụt hẫng và nghĩ bạn mình không còn quan tâm đến mình."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên phản ứng thế nào để giữ mối quan hệ lành mạnh?", "choices": [{"text": "Tự nhắc mình có thể bạn đang bận, và lúc khác sẽ hỏi cảm nhận của bạn sau.", "correct": true, "emoji": "💚"}, {"text": "Nhắn tin trách móc bạn hờ hững hoặc im lặng không nhắn tin nữa.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thuộc tuýp người nhắn tin cộc lốc hay thích dùng nhiều emoji/icon?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mỗi người nhắn tin một kiểu. Đừng để những ký tự ngắn ngủi làm rạn nứt tình cảm."]}', 6);

-- --- Micro Lesson 2.3: Áp lực trả lời ngay lập tức ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Áp lực trả lời ngay lập tức', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có cảm thấy nghẹt thở khi nhìn thấy chữ Đã xem (Seen) mà đối phương không trả lời ngay?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Điện thoại thông minh khiến tụi mình có cảm giác đối phương phải luôn túc trực 24/7 để rep tin nhắn.", "Thực tế, ai cũng có cuộc sống riêng: học tập, làm việc nhà hoặc đơn giản là cần thời gian rời xa màn hình.", "Tôn trọng thời gian riêng của người khác và không ép bản thân phải trả lời tin nhắn ngay lập tức nếu đang bận."]}', 2),
(@ml_id, 'scenario', '{"title": "Seen không rep", "body": "Duy gửi tin nhắn hỏi bài tập cho Tuấn. Thấy tin nhắn hiện trạng thái Đã xem nhưng 20 phút rồi chưa thấy Tuấn trả lời, Duy thấy rất bực mình."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các phản ứng khi đối phương chưa trả lời tin nhắn:", "leftBox": {"title": "Suy nghĩ thấu cảm"}, "rightBox": {"title": "Suy diễn tiêu cực"}, "items": [{"text": "Chắc cậu ấy đang bận học hoặc không cầm điện thoại, lát sẽ rep thôi", "correctBox": "left"}, {"text": "Cố tình bơ mình đây mà, để xem ai lì hơn ai", "correctBox": "right"}, {"text": "Để điện thoại xuống và đi làm việc khác của mình", "correctBox": "left"}, {"text": "Spam liên tục hàng chục tin nhắn hỏi chấm để bắt rep bằng được", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thấy bồn chồn hay tội lỗi khi nhìn thấy tin nhắn chưa đọc mà chưa có thời gian rep không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Ai cũng có quyền ngoại tuyến. Đừng để chế độ đã xem kiểm soát cảm xúc của bạn."]}', 6);

-- --- Micro Lesson 2.4: Khi group chat bốc hỏa ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Khi group chat bốc hỏa', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm gì khi cuộc thảo luận nhóm trong group chat lớp bắt đầu biến thành một trận chiến nảy lửa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tranh cãi bằng bàn phím rất dễ leo thang vì ai cũng muốn gõ thật nhanh để tự vệ.", "Những từ ngữ xúc phạm viết ra rất khó thu hồi và để lại tổn thương lớn.", "Khi thấy group chat bắt đầu nóng lên, hãy là người chủ động kêu gọi mọi người tạm dừng để gặp nhau nói chuyện trực tiếp."]}', 2),
(@ml_id, 'scenario', '{"title": "Tranh luận bài nhóm", "body": "Trong nhóm làm bài tập văn, Linh và Nam bất đồng ý kiến về việc chọn chủ đề. Cả hai bắt đầu dùng những câu từ nặng nề công kích cá nhân nhau trước mặt các thành viên khác."}', 3),
(@ml_id, 'flashcard', '{"front": "Bạn nên làm gì nếu là thành viên chứng kiến group chat bốc hỏa?", "back": "Nhắn tin xoa dịu: Tụi mình dừng gõ một chút nha. Mai lên lớp gặp nhau nói chuyện trực tiếp 5 phút là xong ngay ấy mà.", "notes": "Gặp mặt trực tiếp giúp chúng ta nhìn thấy biểu cảm của nhau và dễ thông cảm hơn nhiều."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng tham gia hoặc chứng kiến một trận phím chiến nào trong group chat chưa? Cảm xúc lúc đó thế nào?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Một lời kêu gọi tạm dừng đúng lúc trong group chat có thể ngăn chặn những rạn nứt không đáng có."]}', 6);

-- --- Micro Lesson 2.5: Viết tin nhắn Green Flag ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Viết tin nhắn Green Flag', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để bày tỏ sự không đồng ý mà vẫn khiến đối phương cảm thấy được tôn trọng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thay vì dùng câu khẳng định quy kết: Ý kiến của cậu tệ quá, hãy tập trung vào cảm nhận của bản thân.", "Sử dụng cấu trúc: Tớ thấy... khi... kết hợp với từ ngữ nhẹ nhàng.", "Lắng nghe ý kiến của họ trước khi đưa ra phản hồi của mình."]}', 2),
(@ml_id, 'scenario', '{"title": "Góp ý thiết kế slide", "body": "Minh không thích ý tưởng thiết kế slide thuyết trình của Trang vì nó quá lòe loẹt."}', 3),
(@ml_id, 'interaction', '{"question": "Minh nên nhắn tin cho Trang thế nào cho đúng tinh thần Green Flag?", "choices": [{"text": "Tớ thấy slide hơi nhiều màu sắc một chút, liệu tụi mình có thể thử tông màu đơn giản hơn xem sao được không Trang?", "correct": true, "emoji": "💚"}, {"text": "Slide này trông trẻ con và lòe loẹt quá, cậu làm lại cái khác đơn giản hơn đi.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thấy dễ chịu hơn khi nhận được lời góp ý nhẹ nhàng thay vì một lời chê bai thẳng thừng không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Góp ý nhẹ nhàng và tôn trọng giúp công việc trôi chảy và tình bạn khăng khít hơn."]}', 6);

-- --- Micro Lesson 2.6: Giữ năng lượng tích cực ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Giữ năng lượng tích cực', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để lướt mạng xã hội mỗi ngày mà không cảm thấy kiệt sức hay tự ti?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Những gì người khác đăng lên mạng thường chỉ là những khoảnh khắc đẹp đẽ nhất, đã qua chỉnh sửa của họ.", "Đừng so sánh cuộc sống thường nhật của bạn với cuốn phim nổi bật của người khác.", "Hãy chủ động theo dõi (follow) những tài khoản truyền cảm hứng lành mạnh và nhấn hủy theo dõi các nguồn tin độc hại."]}', 2),
(@ml_id, 'scenario', '{"title": "So sánh bản thân", "body": "Hân lướt Tiktok thấy các bạn khoe đồ hiệu, đi du lịch sang chảnh rồi tự nhìn lại bản thân và thấy cuộc sống của mình thật tẻ nhạt, tầm thường."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các thói quen sử dụng mạng xã hội sau:", "leftBox": {"title": "Nạp năng lượng tích cực"}, "rightBox": {"title": "Hút cạn năng lượng"}, "items": [{"text": "Theo dõi các trang chia sẻ mẹo học tập, vẽ tranh hoặc lối sống xanh", "correctBox": "left"}, {"text": "Liên tục lướt xem ảnh của các hot teen rồi tự ti về ngoại hình của mình", "correctBox": "right"}, {"text": "Giới hạn thời gian dùng mạng xã hội dưới 1 tiếng mỗi ngày", "correctBox": "left"}, {"text": "Đọc các bài viết drama, bóc phốt và tham gia bình luận chửi bới", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy mệt mỏi sau khi lướt mạng xã hội quá lâu không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn là người lựa chọn nguồn năng lượng nạp vào tâm trí mình mỗi ngày qua màn hình điện thoại."]}', 6);


-- =========================================================================
-- BÀI HỌC 3: Ranh Giới Số: Vẽ Vạch Rõ, Đỡ Phiền Toái! (Digital Boundaries)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'ranh-gioi-thoi-cong-nghe',
    'Ranh Giới Số: Vẽ Vạch Rõ, Đỡ Phiền Toái!',
    'Đặt giới hạn thời gian, sự riêng tư cá nhân trực tuyến và cách nói lời từ chối không áy náy.',
    'Bài học hướng dẫn bạn thiết lập các ranh giới lành mạnh về thời gian online, bảo vệ mật khẩu cá nhân và nói không với sự kiểm soát số.',
    23,
    false,
    100,
    12
);
SET @lesson3_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson3_id, 'Scarleteen - Quickies: Healthy Relationships', 'https://www.scarleteen.com/read/relationships/quickies-healthy-relationships', 'website'),
(@lesson3_id, 'Scarleteen - Hello Sailor: How to Build, Board, and Navigate a Healthy Relationship', 'https://www.scarleteen.com/read/relationships/hello-sailor-how-build-board-navigate-healthy-relationship', 'website');

-- --- Micro Lesson 3.1: Ranh giới số là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Ranh giới số là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ cảm thấy ngột ngạt vì một người bạn cứ liên tục nhắn tin hỏi bạn đang làm gì, ở đâu mọi lúc mọi nơi?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Ranh giới số (Digital Boundary) là những giới hạn bạn đặt ra về thời gian, không gian và mức độ riêng tư khi sử dụng công nghệ.", "Nó bao gồm việc quyết định khi nào bạn online, ai được phép gọi cho bạn, và bạn muốn chia sẻ những gì.", "Đặt ranh giới rõ ràng giúp bạn duy trì những mối quan hệ khỏe mạnh mà không cảm thấy bị kiểm soát."]}', 2),
(@ml_id, 'scenario', '{"title": "Spam cuộc gọi", "body": "Nam thích chơi game vào buổi tối để thư giãn. Tuy nhiên, Khánh liên tục gọi video cho Nam để buôn chuyện, dù Nam đã nói là đang bận chơi game. Khánh giận dỗi bảo Nam không coi trọng bạn."}', 3),
(@ml_id, 'flashcard', '{"front": "Đặt ranh giới số có phải là ích kỷ hay làm tổn thương tình bạn không?", "back": "KHÔNG. Đặt ranh giới giúp cả hai hiểu rõ giới hạn thoải mái của nhau, từ đó tôn trọng nhau hơn và tránh những xung đột không đáng có.", "notes": "Tình bạn lành mạnh luôn đi kèm sự tôn trọng ranh giới của nhau."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng cảm thấy mệt mỏi vì một người bạn liên tục đòi hỏi sự chú ý của bạn trên mạng chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Ranh giới số không phải là bức tường ngăn cách, nó là cánh cửa giúp tình bạn thở dễ dàng hơn."]}', 6);

-- --- Micro Lesson 3.2: Khi ranh giới bị vượt qua ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Khi ranh giới bị vượt qua', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao nhận ra khi ai đó đang ngấm ngầm xâm phạm ranh giới số của bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Dấu hiệu bao gồm: kiểm soát danh sách bạn bè, bắt bạn chụp màn hình cuộc trò chuyện với người khác để kiểm chứng, tự ý vào đọc trộm tin nhắn.", "Những hành vi này thường được ngụy trang dưới danh nghĩa vì quan tâm hoặc vì yêu thương.", "Nhận biết sớm giúp bạn bảo vệ bản thân trước những mối quan hệ độc hại."]}', 2),
(@ml_id, 'scenario', '{"title": "Đọc trộm tin nhắn", "body": "Huy mượn điện thoại của bạn gái là Linh để tra cứu bản đồ, nhưng sau đó tự ý mở lịch sử chat Zalo của Linh với các bạn nam khác để kiểm tra xem có nhắn tin mờ ám không."}', 3),
(@ml_id, 'interaction', '{"question": "Hành vi của Huy là gì?", "choices": [{"text": "Xâm phạm ranh giới cá nhân và thể hiện sự thiếu tin tưởng nghiêm trọng.", "correct": true, "emoji": "💚"}, {"text": "Sự quan tâm đáng yêu, vì yêu nên mới ghen và muốn kiểm tra.", "correct": false, "emoji": "🚩"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy thoải mái khi cho người khác (kể cả bạn thân hoặc người yêu) tự ý đọc tin nhắn riêng tư của mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Yêu thương hay tình bạn không đi kèm quyền được kiểm soát và xâm phạm không gian riêng tư của nhau."]}', 6);

-- --- Micro Lesson 3.3: Cảm giác tội lỗi khi từ chối ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Cảm giác tội lỗi khi từ chối', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao tụi mình thường thấy rất tội lỗi khi nhấn nút từ chối một cuộc gọi hoặc không rep tin nhắn ngay?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tụi mình sợ làm người khác buồn, sợ bị đánh giá là không nhiệt tình hoặc bị tẩy chay khỏi nhóm bạn.", "Nhưng hãy nhớ: năng lượng của bạn là có hạn. Bạn cần nạp lại năng lượng trước khi có thể chia sẻ nó.", "Từ chối một yêu cầu không có nghĩa là bạn từ chối con người họ, đó chỉ là bạn đang bảo vệ sức khỏe tinh thần của mình."]}', 2),
(@ml_id, 'scenario', '{"title": "Ép bản thân online", "body": "Dù rất mệt sau buổi tập thể thao, Vy vẫn cố thức đến 11h đêm nhắn tin buôn chuyện với nhóm bạn vì sợ nếu off sớm sẽ bị nói là thiếu hòa nhập."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các suy nghĩ sau khi bạn cần từ chối giao tiếp để nghỉ ngơi:", "leftBox": {"title": "Tự chăm sóc lành mạnh"}, "rightBox": {"title": "Tự trách độc hại"}, "items": [{"text": "Tớ cần sạc lại năng lượng cho bản thân trước, tớ sẽ nhắn lại cho bạn vào ngày mai", "correctBox": "left"}, {"text": "Mình là một đứa bạn tồi tệ vì đã không trả lời tin nhắn của cậu ấy ngay lập tức", "correctBox": "right"}, {"text": "Mình có quyền dành một buổi tối không điện thoại để đọc sách hoặc ngủ sớm", "correctBox": "left"}, {"text": "Mình phải luôn online để chứng minh mình luôn sẵn sàng vì bạn bè", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thường ép bản thân trò chuyện trên mạng ngay cả khi cơ thể và tâm trí đã mệt nhoài không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không cần phải làm người khác vui lòng bằng cách bào mòn năng lượng và sự thoải mái của chính mình."]}', 6);

-- --- Micro Lesson 3.4: Tình huống: Mượn mật khẩu ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Tình huống: Mượn mật khẩu', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nếu là bạn thân/người yêu thực sự thì phải tin tưởng chia sẻ mật khẩu tài khoản mạng xã hội cho nhau chứ? Bạn nghĩ sao?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mật khẩu tài khoản là ranh giới riêng tư tối cao của mỗi cá nhân trên không gian số.", "Chia sẻ mật khẩu không chứng minh lòng tin, ngược lại nó tạo ra cơ hội cho sự giám sát và nghi ngờ lẫn nhau.", "Tình bạn chân chính tôn trọng sự riêng tư của nhau mà không cần những bằng chứng mang tính kiểm soát."]}', 2),
(@ml_id, 'scenario', '{"title": "Instagram của ai?", "body": "Quân muốn chứng minh tình cảm với Mai nên đã hỏi xin mật khẩu tài khoản Instagram của Mai. Mai cảm thấy không thoải mái nhưng sợ Quân nghĩ mình đang giấu giếm."}', 3),
(@ml_id, 'flashcard', '{"front": "Mai nên trả lời Quân thế nào để vừa giữ được ranh giới vừa không gây rạn nứt?", "back": "Mai có thể nói: Tớ rất trân trọng tình cảm của tụi mình, nhưng tớ muốn giữ mật khẩu tài khoản làm không gian riêng tư cá nhân. Tụi mình tin tưởng nhau bằng hành động ngoài đời nhé.", "notes": "Giữ bí mật mật khẩu là nguyên tắc an toàn số cơ bản nhất, không ngoại lệ cho bất kỳ ai."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng chia sẻ mật khẩu tài khoản của mình cho ai chưa? Cảm xúc của bạn sau đó thế nào?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tin tưởng nhau nằm ở sự tôn trọng tự nguyện, không nằm ở việc bàn giao chìa khóa cuộc sống số của mình cho người khác."]}', 6);

-- --- Micro Lesson 3.5: Cách nói Không cứng rắn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Cách nói Không cứng rắn', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để từ chối một lời đề nghị trên mạng một cách lịch sự, rõ ràng mà không phải nói dối quanh co?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nói lời từ chối trực tiếp giúp bạn đỡ mệt mỏi và tránh những hiểu lầm dây dưa về sau.", "Công thức từ chối: Cảm ơn/Ghi nhận + Lời từ chối rõ ràng + Đề xuất thay thế (nếu muốn).", "Tránh viện cớ nói dối vì khi lời nói dối bị phát hiện, mối quan hệ sẽ càng rạn nứt nghiêm trọng hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Group chat ẩn danh", "body": "Nam rủ Vy tham gia một group chat ẩn danh chuyên bàn tán chuyện đời tư của các bạn khác. Vy không muốn tham gia vì thấy điều đó không tốt."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên từ chối thế nào cho đúng tinh thần văn minh và cứng rắn?", "choices": [{"text": "Cảm ơn đã rủ nhé, nhưng tớ không thoải mái với việc bàn tán chuyện riêng tư của người khác nên tớ không vào nhóm đâu.", "correct": true, "emoji": "💚"}, {"text": "Tớ đang bận ôn thi lắm, để khi khác nha (rồi im lặng né tránh).", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thấy mình thường chọn cách từ chối thẳng thắn hay chọn cách nói dối để né tránh đối đầu?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Một lời từ chối thẳng thắn và lịch sự tốt hơn vạn lần những lời hứa hẹn quanh co làm mất thời gian của nhau."]}', 6);

-- --- Micro Lesson 3.6: Ranh giới bảo vệ tình bạn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Ranh giới bảo vệ tình bạn', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đặt ranh giới rõ ràng thực chất là đang giúp tình bạn kéo dài lâu hơn, bạn tin không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Khi không có ranh giới, tụi mình dễ tích tụ những bức bối, ức chế ngầm bên trong (resentment).", "Đến một ngày, những bức bối đó sẽ bùng phát thành một trận cãi vã lớn hủy hoại mối quan hệ.", "Nói rõ giới hạn của mình từ đầu giúp cả hai hiểu nhau và cư xử tinh tế với nhau hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Bất bình tích tụ", "body": "Hải liên tục mượn nick game của Tùng và đổi cài đặt trang phục mà không hỏi trước. Tùng thấy khó chịu nhưng không nói gì, dần dần Tùng bắt đầu lảng tránh và ghét chơi game chung với Hải."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành vi thiết lập ranh giới sau:", "leftBox": {"title": "Giúp tình bạn bền vững"}, "rightBox": {"title": "Gây ức chế ngầm"}, "items": [{"text": "Thẳng thắn chia sẻ: Tớ không thích bị trêu về cân nặng đâu nhé", "correctBox": "left"}, {"text": "Im lặng chịu đựng khi bạn lấy đồ dùng cá nhân của mình mà không hỏi", "correctBox": "right"}, {"text": "Góp ý riêng tư khi thấy bạn có hành động khiến mình không thoải mái", "correctBox": "left"}, {"text": "Giả vờ vui vẻ bên ngoài nhưng ấm ức nói xấu sau lưng bạn với người khác", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có mối quan hệ nào đang khiến bạn thấy ấm ức nhưng chưa dám nói thẳng giới hạn của mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Ranh giới lành mạnh giúp chúng ta yêu quý nhau mà không làm cạn kiệt năng lượng của nhau."]}', 6);


-- =========================================================================
-- BÀI HỌC 4: Đồng Thuận Số: Đừng Tự Ý "Mặc Định"! (Digital Consent)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'dong-thuan-so',
    'Đồng Thuận Số: Đừng Tự Ý "Mặc Định"!',
    'Khái niệm về đồng thuận trên mạng, nhận diện sự ép buộc và tôn trọng quyền tự quyết của người khác.',
    'Bài học giúp bạn hiểu thế nào là sự đồng thuận trực tuyến thực sự, cách nhận diện áp lực từ bạn bè và thói quen hỏi ý kiến trước khi đăng bài liên quan đến người khác.',
    24,
    false,
    100,
    12
);
SET @lesson4_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson4_id, 'Scarleteen - Quickies: Sexual Consent Basics', 'https://www.scarleteen.com/read/sex-sexuality/quickies-sexual-consent-basics', 'website'),
(@lesson4_id, 'Scarleteen - Hello Sailor: How to Build, Board, and Navigate a Healthy Relationship', 'https://www.scarleteen.com/read/relationships/hello-sailor-how-build-board-navigate-healthy-relationship', 'website');

-- --- Micro Lesson 4.1: Đồng thuận số là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Đồng thuận số là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Im lặng trên mạng có phải là đồng ý không? Làm sao biết đối phương thực sự muốn tham gia trò chuyện?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đồng thuận số (Digital Consent) là sự đồng ý hoàn toàn tự nguyện, hào hứng, tỉnh táo và có thể thay đổi bất kỳ lúc nào đối với các hoạt động trực tuyến.", "Im lặng, trả lời chậm, hoặc trả lời gượng ép (sao cũng được, ừ chắc thế) KHÔNG PHẢI là đồng thuận.", "Chỉ khi đối phương nói Có một cách vui vẻ và thoải mái, đó mới là đồng thuận thực sự."]}', 2),
(@ml_id, 'scenario', '{"title": "Cuộc gọi muộn", "body": "Nam nhắn tin rủ Vy gọi video nói chuyện. Vy chỉ nhắn lại: Tớ đang chuẩn bị đi ngủ... Nam nghĩ Vy nói thế tức là vẫn gọi được nên lập tức bấm nút gọi video luôn."}', 3),
(@ml_id, 'flashcard', '{"front": "Khi nào thì một lời nói hay hành động trên mạng được coi là có sự đồng thuận thực sự?", "back": "Khi đối phương bày tỏ sự đồng ý rõ ràng, hào hứng, tự nguyện, không bị ép buộc, và họ có quyền rút lại sự đồng ý đó bất kỳ lúc nào họ muốn.", "notes": "Đồng thuận phải là F.R.E.S.H (Freely given, Reversible, Informed, Enthusiastic, Specific)."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã bao giờ ép bản thân đồng ý làm điều gì đó trên mạng chỉ vì ngại từ chối chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đồng ý gượng ép hay im lặng không bao giờ bằng một lời đồng thuận tự nguyện, vui vẻ."]}', 6);

-- --- Micro Lesson 4.2: Nhận diện sự ép buộc ngầm ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Nhận diện sự ép buộc ngầm', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để nhận biết khi một lời đề nghị trên mạng thực chất là một sự ép buộc tinh vi?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sự ép buộc ngầm thường đi kèm các câu nói thao túng tâm lý: Nếu cậu thực sự coi tớ là bạn thì..., Có thế mà cũng ngại à?, hoặc liên tục spam tin nhắn đòi hỏi.", "Đồng thuận có được từ sự nể sợ, mệt mỏi hay áp lực không bao giờ có giá trị.", "Lắng nghe trực giác: Nếu bạn cảm thấy nghẹn ở cổ họng hay bồn chồn ở bụng, đó là dấu hiệu bạn đang bị ép buộc."]}', 2),
(@ml_id, 'scenario', '{"title": "Đi spam acc clone", "body": "Nhóm bạn của Duy rủ nhau lập acc clone đi spam chửi bới một bạn học lớp bên cạnh. Duy từ chối, nhóm bạn liền cười cợt: Đúng là đồ nhát gan, không chơi thì từ sau đừng đi chung nhóm nữa."}', 3),
(@ml_id, 'interaction', '{"question": "Hành vi của nhóm bạn Duy thể hiện điều gì?", "choices": [{"text": "Sự ép buộc ngầm bằng cách đe dọa cô lập để bắt Duy đồng thuận tham gia.", "correct": true, "emoji": "💚"}, {"text": "Một lời đùa giỡn kích lệ tinh thần đồng đội bình thường của bạn bè.", "correct": false, "emoji": "🚩"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng đồng ý làm một việc mình thấy sai trái trên mạng chỉ vì sợ bị bạn bè tẩy chay không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn có quyền nói không với bất kỳ hoạt động nào khiến bạn cảm thấy không thoải mái, bất kể áp lực từ ai."]}', 6);

-- --- Micro Lesson 4.3: Áp lực từ người mình thích ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Áp lực từ người mình thích', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao việc đặt ranh giới từ chối lại trở nên cực kỳ khó khăn khi đối phương chính là crush của bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chúng ta luôn muốn làm hài lòng người mình thích vì sợ họ sẽ chán mình, giận dỗi hoặc đi tìm người khác.", "Tuy nhiên, một người thực sự thích bạn sẽ trân trọng cảm xúc và ranh giới của bạn hơn là việc ép bạn làm điều bạn không muốn.", "Tình cảm chân chính được xây dựng trên sự tôn trọng lẫn nhau, không dựa trên sự thỏa hiệp mù quáng."]}', 2),
(@ml_id, 'scenario', '{"title": "Yêu cầu bật camera", "body": "Crush của Vy liên tục giận dỗi và không rep tin nhắn vì Vy không chịu bật camera phòng riêng của mình vào buổi tối khi đang mặc đồ ngủ."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các phản ứng của crush khi bạn từ chối một yêu cầu trên mạng:", "leftBox": {"title": "Crush lành mạnh"}, "rightBox": {"title": "Crush thao túng"}, "items": [{"text": "Tớ hiểu rồi, cậu cứ nghỉ ngơi đi nhé, khi nào rảnh tụi mình nói chuyện sau", "correctBox": "left"}, {"text": "Cậu lúc nào cũng bận, chắc là cậu không thích tớ nên mới né tránh chứ gì", "correctBox": "right"}, {"text": "Tôn trọng quyết định không bật camera khi gọi video của bạn", "correctBox": "left"}, {"text": "Giận dỗi cả ngày, không rep tin nhắn vì bạn không chịu gửi ảnh selfie chụp cận mặt", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ lo sợ crush sẽ ghét mình nếu bạn từ chối một cuộc gọi của họ không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Người thực sự trân trọng bạn sẽ lắng nghe lời từ chối của bạn với sự thấu hiểu và tôn trọng."]}', 6);

-- --- Micro Lesson 4.4: Tình huống: Tag tên tự ý ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Tình huống: Tag tên tự ý', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tag tên bạn bè vào một bài đăng dìm hàng hoặc bài viết nhạy cảm mà không hỏi trước có thực sự vô hại?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Gắn thẻ (Tag) tên ai đó đồng nghĩa với việc đưa thông tin của họ xuất hiện công khai trên dòng thời gian của họ và bạn bè họ.", "Điều này có thể khiến họ rơi vào những tình huống dở khóc dở cười hoặc bị người khác hiểu lầm, trêu chọc.", "Tôn trọng quyền tự chủ danh tính của bạn bè bằng cách hỏi ý kiến trước khi gắn thẻ họ."]}', 2),
(@ml_id, 'scenario', '{"title": "Tag tên bài viết nhạy cảm", "body": "Khanh đăng một bài viết thảo luận về học sinh hay ngủ gật trong lớp và gắn thẻ tên Hải vào bài đăng đó mà không hỏi trước, khiến Hải bị bạn bè chọc ghẹo."}', 3),
(@ml_id, 'flashcard', '{"front": "Bạn nên cư xử thế nào trước khi gắn thẻ (tag) bạn bè vào một bài viết công khai?", "back": "Hãy gửi tin nhắn riêng hỏi trước: Tớ đăng bài này có tag tên cậu được không?, hoặc sử dụng tính năng xem lại thẻ trước khi cho xuất hiện trên trang cá nhân.", "notes": "Tôn trọng danh tính trực tuyến của bạn bè là một phần của sự đồng thuận số."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ cảm thấy bực mình vì bị tag vào những bài viết quảng cáo hoặc bài đăng dìm hàng nhạy cảm chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Danh tiếng trực tuyến của mỗi người là tài sản riêng của họ. Hãy xin phép trước khi gắn thẻ tag nhé."]}', 6);

-- --- Micro Lesson 4.5: Hãy hỏi ý kiến trước! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Hãy hỏi ý kiến trước!', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để tạo thói quen xin phép trước khi chia sẻ hình ảnh hoặc thông tin liên quan đến người khác?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thói quen xin phép thể hiện sự tinh tế và tôn trọng sâu sắc đối với người bạn của mình.", "Chỉ mất vài giây nhắn tin hỏi thăm, nhưng nó giữ gìn sự tin tưởng lâu dài giữa hai bên.", "Quy tắc vàng: Nếu nghi ngờ, đừng đăng. Nếu muốn đăng, hãy hỏi!"]}', 2),
(@ml_id, 'scenario', '{"title": "Bức ảnh dìm nhẹ", "body": "Bình chụp được bức ảnh chụp chung rất đẹp với Vân, nhưng biểu cảm của Vân trông hơi ngơ ngác một chút."}', 3),
(@ml_id, 'interaction', '{"question": "Bình nên làm gì trước khi đăng bức ảnh này lên trang cá nhân của mình?", "choices": [{"text": "Gửi ảnh cho Vân xem trước và hỏi: Tớ đăng ảnh này lên Instagram nhé Vân, cậu thấy tấm này ổn không?", "correct": true, "emoji": "💚"}, {"text": "Cứ đăng luôn rồi tag tên Vân vào, nếu Vân không thích thì tự xóa tag sau.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy tin tưởng và yêu quý hơn những người bạn luôn hỏi ý kiến bạn trước khi đăng ảnh chung không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tôn trọng quyền riêng tư của bạn bè giúp mối quan hệ bền chặt và tránh được những hiểu lầm."]}', 6);

-- --- Micro Lesson 4.6: Đồng thuận là liên tục ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Đồng thuận là liên tục', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nếu hôm qua bạn đồng ý gọi điện muộn, liệu điều đó có nghĩa là hôm nay bạn cũng phải đồng ý không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đồng thuận không phải là một chiếc vé trọn đời. Việc bạn nói Có hôm nay không đồng nghĩa với việc bạn tự động nói Có vào ngày mai.", "Đối phương có quyền thay đổi quyết định của mình bất kỳ lúc nào họ cảm thấy mệt mỏi hoặc không thoải mái.", "Hãy luôn kiểm tra sự thoải mái của đối phương mỗi lần tương tác, không lấy sự đồng thuận trong quá khứ làm mặc định."]}', 2),
(@ml_id, 'scenario', '{"title": "Mượn tài khoản game", "body": "Khoa đã từng cho Hùng mượn tài khoản game tuần trước. Tuần này, Hùng tự ý đăng nhập chơi tiếp mà không nhắn tin hỏi lại Khoa."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các tình huống đồng thuận sau:", "leftBox": {"title": "Tôn trọng ranh giới"}, "rightBox": {"title": "Tự ý mặc định"}, "items": [{"text": "Hôm qua tụi mình call nói chuyện vui quá, tối nay cậu có sẵn sàng call tiếp không?", "correctBox": "left"}, {"text": "Lần trước cậu cho mượn acc game rồi nên lần này tớ tự ý đăng nhập chơi tiếp luôn", "correctBox": "right"}, {"text": "Dừng gửi ảnh meme khi bạn nói hôm nay bạn mệt và muốn yên tĩnh", "correctBox": "left"}, {"text": "Bắt bạn phải đi chơi chung trên mạng vì lần trước bạn đã từng hứa đi", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ thấy khó xử khi muốn rút lại một lời đồng ý trước đó với bạn bè không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn luôn có quyền thay đổi quyết định. Sự đồng thuận thực sự cần được hỏi lại mỗi lần."]}', 6);


-- =========================================================================
-- BÀI HỌC 5: Sexting & Gửi Ảnh: Giữ Mình An Toàn Trên Sóng! (Sexting & Images)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'sexting-va-chia-se-anh-an-toan',
    'Sexting & Gửi Ảnh: Giữ Mình An Toàn Trên Sóng!',
    'Tìm hiểu về sexting, rủi ro pháp lý, đối phó áp lực gửi ảnh nhạy cảm và cách xử lý sự cố.',
    'Bài học cung cấp kiến thức thực tế về những rủi ro của việc gửi ảnh nhạy cảm trực tuyến, cách kiên quyết từ chối áp lực và các bước hỗ trợ khẩn cấp nếu ảnh bị phát tán trái phép.',
    25,
    false,
    100,
    12
);
SET @lesson5_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson5_id, 'Scarleteen - Sex & Sexuality', 'https://www.scarleteen.com/read/sex-sexuality', 'website');

-- --- Micro Lesson 5.1: Sexting là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Sexting là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn đã bao giờ nghe nói về việc gửi tin nhắn nhạy cảm hoặc ảnh riêng tư (sexting) chưa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sexting là việc gửi hoặc nhận những tin nhắn, hình ảnh hoặc video có nội dung nhạy cảm, gợi dục hoặc khỏa thân qua mạng.", "Đối với lứa tuổi học sinh (dưới 18 tuổi), việc tạo ra, lưu trữ hoặc chia sẻ ảnh nhạy cảm của bản thân hoặc người khác là vi phạm pháp luật nghiêm trọng.", "Một khi bức ảnh nhạy cảm đã rời khỏi điện thoại của bạn, bạn hoàn toàn mất quyền kiểm soát nó."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời hứa xem xong xóa", "body": "Một người bạn cùng khóa gửi cho Vy một tin nhắn rủ rê chụp ảnh phần cơ thể nhạy cảm gửi qua Zalo và hứa sẽ xóa đi ngay sau khi xem xong."}', 3),
(@ml_id, 'flashcard', '{"front": "Lời hứa xem xong sẽ xóa ngay trên ứng dụng chat có thực sự đáng tin cậy không?", "back": "Tuyệt đối KHÔNG. Đối phương hoàn toàn có thể dùng một điện thoại khác để chụp lại màn hình, hoặc ảnh được lưu tự động vào bộ nhớ đám mây.", "notes": "Đừng bao giờ mạo hiểm chụp và gửi những bức ảnh nhạy cảm của bản thân lên mạng."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có biết rằng ở lứa tuổi học sinh, việc gửi ảnh nhạy cảm có thể dẫn đến những rắc rối pháp lý rất lớn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Một khi ảnh nhạy cảm đã gửi đi, bạn không thể thu hồi nó khỏi thế giới Internet được nữa."]}', 6);

-- --- Micro Lesson 5.2: Áp lực gửi ảnh mát mẻ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Áp lực gửi ảnh mát mẻ', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để nhận diện và từ chối khi bị người yêu hoặc crush ép gửi ảnh nhạy cảm để chứng minh tình yêu?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Kẻ ép buộc thường dùng các chiêu bài tình cảm: Nếu yêu tớ thì cậu phải gửi chứ, Tớ gửi cho cậu rồi, cậu phải gửi lại cho công bằng.", "Tình yêu thực sự không cần những bức ảnh khỏa thân để chứng minh lòng thủy chung.", "Từ chối gửi ảnh nhạy cảm chính là biểu hiện của việc biết bảo vệ bản thân và tôn trọng ranh giới cơ thể."]}', 2),
(@ml_id, 'scenario', '{"title": "Đòi ảnh để làm hòa", "body": "Bạn trai của Lan liên tục giận dỗi và dọa chia tay nếu Lan không chịu chụp ảnh mặc đồ bơi gợi cảm gửi qua tin nhắn Messenger cho anh ta xem."}', 3),
(@ml_id, 'interaction', '{"question": "Lan nên phản ứng thế nào để bảo vệ bản thân?", "choices": [{"text": "Kiên quyết từ chối: Tớ không thoải mái với việc chụp ảnh này đâu. Nếu cậu thực sự yêu tớ thì cậu sẽ không bắt tớ làm điều tớ thấy sợ.", "correct": true, "emoji": "💚"}, {"text": "Chấp nhận chụp gửi một tấm mờ mờ để bạn trai không giận nữa.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng nghe về trường hợp ai đó bị người yêu cũ phát tán ảnh riêng tư lên mạng sau khi chia tay chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Người thực sự yêu bạn sẽ bảo vệ sự an toàn của bạn, chứ không bao giờ đặt bạn vào rủi ro lộ ảnh nhạy cảm."]}', 6);

-- --- Micro Lesson 5.3: Cảm xúc sau khi gửi ảnh ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Cảm xúc sau khi gửi ảnh', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao nhiều bạn trẻ lại cảm thấy hối hận, lo âu tột độ ngay sau khi nhấn nút gửi đi một bức ảnh nhạy cảm?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cảm giác phấn khích nhất thời nhanh chóng bị thay thế bởi sự lo sợ lộ ảnh, sợ bị đánh giá, tống tiền hoặc bị phát tán lên các hội nhóm.", "Sự lo lắng nơm nớp này có thể gây căng thẳng kéo dài, ảnh hưởng nghiêm trọng đến việc học tập và tâm lý.", "Bảo vệ ranh giới cơ thể trực tuyến giúp bạn giữ được sự bình yên trong tâm trí."]}', 2),
(@ml_id, 'scenario', '{"title": "Nỗi lo vô hình", "body": "Huy lỡ gửi ảnh cởi trần nhạy cảm cho bạn gái mới quen qua mạng. Sau đó, Huy không thể tập trung học bài vì lúc nào cũng sợ bạn gái mang đi khoe với người khác."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành vi tự bảo vệ bản thân trước nguy cơ lộ ảnh riêng tư:", "leftBox": {"title": "Bảo vệ an toàn"}, "rightBox": {"title": "Đặt mình vào rủi ro"}, "items": [{"text": "Tuyệt đối không chụp ảnh nhạy cảm lộ rõ khuôn mặt hoặc hình xăm đặc trưng", "correctBox": "left"}, {"text": "Lưu trữ ảnh nhạy cảm trong album điện thoại không cài mật khẩu khóa riêng", "correctBox": "right"}, {"text": "Kiên quyết từ chối mọi lời gạ gẫm gửi ảnh nhạy cảm từ người lạ trên mạng", "correctBox": "left"}, {"text": "Gửi ảnh nhạy cảm qua ứng dụng chat và nghĩ rằng tính năng tự xóa là an toàn", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy sự bình yên trong tâm trí quan trọng hơn việc làm vừa lòng một ai đó trên mạng xã hội không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Sự an toàn và bình yên tinh thần của bạn là vô giá. Đừng đánh đổi nó lấy sự hài lòng nhất thời của người khác."]}', 6);

-- --- Micro Lesson 5.4: Tình huống: Thử thách lòng tin ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Tình huống: Thử thách lòng tin', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Liệu gửi ảnh nhạy cảm có phải là cách để thể hiện sự gắn kết và tin tưởng tuyệt đối vào người yêu của mình?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Lòng tin được xây dựng qua sự quan tâm, chia sẻ và tôn trọng ranh giới ngoài đời thực, không phụ thuộc vào những bức ảnh nhạy cảm.", "Người yêu của bạn dù tốt đến đâu cũng không thể kiểm soát được việc điện thoại của họ bị hack, bị mất, hoặc bị người khác tò mò đọc trộm.", "Giữ lại sự riêng tư cho bản thân không phải là thiếu tin tưởng đối phương, đó là hành vi tự chịu trách nhiệm thông minh."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời thề thốt", "body": "Quân hứa với Mai: Tớ thề là chỉ giữ ảnh này cho riêng tớ xem thôi, tớ mà chia sẻ cho ai thì tớ làm con cún. Mai rất yêu Quân nhưng vẫn cảm thấy lo sợ."}', 3),
(@ml_id, 'flashcard', '{"front": "Mai nên làm gì trước lời thề thốt chân thành của Quân?", "back": "Mai nên giữ vững lập trường từ chối: Tớ tin cậu, nhưng tớ không tin chiếc điện thoại hay các hacker trên mạng đâu. Tụi mình yêu nhau đâu cần phải qua những bức ảnh này.", "notes": "Đừng bao giờ gửi ảnh nhạy cảm chỉ vì bị thuyết phục bởi những lời thề thốt."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đồng ý rằng việc giữ an toàn cho bản thân chính là cách tốt nhất để bảo vệ tương lai của chính mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hãy tin tưởng nhau bằng hành động tử tế, đừng tin tưởng bằng cách trao đi những thông tin nhạy cảm có thể hủy hoại bạn."]}', 6);

-- --- Micro Lesson 5.5: Làm gì khi ảnh bị phát tán? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Làm gì khi ảnh bị phát tán?', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nếu không may hình ảnh riêng tư của bạn bị phát tán trái phép lên mạng, bạn cần làm gì ngay lập tức?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đầu tiên: Không tự trách bản thân. Bạn là nạn nhân của hành vi phát tán trái phép, lỗi hoàn toàn thuộc về kẻ phát tán.", "Thứ hai: Chụp màn hình bằng chứng và báo cáo (report) bài đăng lên nền tảng mạng xã hội để yêu cầu gỡ bỏ.", "Thứ ba: Chia sẻ câu chuyện với người lớn đáng tin cậy (bố mẹ, thầy cô) hoặc liên hệ Tổng đài bảo vệ trẻ em 111 để nhận trợ giúp."]}', 2),
(@ml_id, 'scenario', '{"title": "Ảnh chế trong nhóm kín", "body": "Linh phát hiện bức ảnh mặc đồ bó sát nhạy cảm mình từng gửi cho người yêu cũ bị đăng lên một hội nhóm bêu rếu trên Facebook của trường. Linh vô cùng hoảng loạn."}', 3),
(@ml_id, 'interaction', '{"question": "Linh nên làm gì đầu tiên trong tình huống này?", "choices": [{"text": "Chụp lại màn hình bài viết để làm bằng chứng, báo cáo bài đăng và tâm sự ngay với mẹ hoặc giáo viên chủ nhiệm.", "correct": true, "emoji": "💚"}, {"text": "Nhắn tin cầu xin người yêu cũ gỡ bài và khóa tài khoản mạng xã hội để trốn tránh.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có biết số điện thoại của Tổng đài bảo vệ trẻ em 111 tại Việt Nam không? Nó hoàn toàn miễn phí và bảo mật thông tin."}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không hề cô độc khi gặp sự cố trên mạng. Luôn có những người lớn đáng tin cậy sẵn sàng che chở và bảo vệ bạn."]}', 6);

-- --- Micro Lesson 5.6: Quyền kiểm soát cơ thể ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Quyền kiểm soát cơ thể', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Ai mới là người có tiếng nói duy nhất và tối cao đối với hình ảnh và cơ thể của bạn trên không gian số?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bạn có toàn quyền quyết định về hình ảnh cơ thể mình trên mạng.", "Không ai được phép chụp ảnh bạn khi chưa được sự đồng ý, và không ai được phép ép bạn phơi bày cơ thể qua camera.", "Tôn trọng cơ thể của chính mình và tôn trọng cơ thể của người khác chính là nền tảng của một công dân số văn minh."]}', 2),
(@ml_id, 'scenario', '{"title": "Bị ép mở camera", "body": "Dũng gọi video cho bạn gái và liên tục ép cô ấy phải kéo áo xuống cho Dũng xem vai trần, mặc dù cô ấy đã từ chối và nói rằng thấy rất ngại."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành vi ứng xử tôn trọng quyền cơ thể sau:", "leftBox": {"title": "Tôn trọng quyền cơ thể"}, "rightBox": {"title": "Xâm phạm quyền cơ thể"}, "items": [{"text": "Từ chối chụp ảnh cơ thể mình dù bị người khác năn nỉ, chèo kéo", "correctBox": "left"}, {"text": "Lén lút chụp ảnh bạn bè đang thay đồ thể dục để trêu đùa trong nhóm", "correctBox": "right"}, {"text": "Báo cáo tài khoản đăng ảnh chế giễu ngoại hình của một bạn học sinh khác", "correctBox": "left"}, {"text": "Bắt người yêu phải bật camera khi đang tắm để chứng tỏ không giấu giếm", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có luôn cảm thấy tự tin bảo vệ ranh giới cơ thể mình trước những lời đề nghị thô lỗ trên mạng không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể bạn là của bạn. Quyền quyết định chia sẻ hình ảnh hay không hoàn toàn thuộc về bạn, không ngoại lệ cho bất kỳ ai."]}', 6);


-- =========================================================================
-- BÀI HỌC 6: Né "Cờ Đỏ" & Kẻ Thao Túng Trên Mạng! (Red Flags & Manipulation)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'co-do-va-thao-tung-truc-tuyen',
    'Né "Cờ Đỏ" & Kẻ Thao Túng Trên Mạng!',
    'Nhận diện các dấu hiệu kiểm soát độc hại, cảnh giác trước kẻ lừa đảo giả mạo và cách tìm hỗ trợ.',
    'Bài học hướng dẫn học sinh nhận diện cờ đỏ trong các mối quan hệ qua mạng, phòng tránh bẫy tâm lý giả mạo danh tính (catfishing), bẫy cô lập số và cách thoát ra an toàn.',
    26,
    false,
    100,
    12
);
SET @lesson6_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson6_id, 'Scarleteen - Quickies: Healthy Relationships', 'https://www.scarleteen.com/read/relationships/quickies-healthy-relationships', 'website'),
(@lesson6_id, 'Scarleteen - Hello Sailor: How to Build, Board, and Navigate a Healthy Relationship', 'https://www.scarleteen.com/read/relationships/hello-sailor-how-build-board-navigate-healthy-relationship', 'website');

-- --- Micro Lesson 6.1: Cờ đỏ trên mạng là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Cờ đỏ trên mạng là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao nhận ra một mối quan hệ qua mạng đang chuyển từ ngọt ngào đáng yêu sang kiểm soát độc hại?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cờ đỏ (Red Flag) trên mạng là những dấu hiệu cảnh báo mối quan hệ thiếu lành mạnh: ghen tuông vô cớ, đòi kiểm tra vị trí liên tục, bắt xóa bạn bè khác giới.", "Những hành vi này ban đầu thường được ngụy trang dưới danh nghĩa yêu quá nên mới thế.", "Nhận biết cờ đỏ giúp bạn tránh xa những mối quan hệ thao túng trước khi quá muộn."]}', 2),
(@ml_id, 'scenario', '{"title": "Yêu cầu xóa bạn game", "body": "Vy quen một bạn nam qua game online. Bạn này rất chiều Vy, thường tặng quà ingame, nhưng bắt Vy phải chụp ảnh màn hình danh sách bạn bè trong game và xóa hết các bạn nam khác đi."}', 3),
(@ml_id, 'flashcard', '{"front": "Yêu cầu kiểm tra vị trí hoặc bắt xóa bạn bè khác giới trên mạng có phải là biểu hiện của tình yêu chân thành không?", "back": "Tuyệt đối KHÔNG. Đó là hành vi kiểm soát và thiếu tôn trọng không gian riêng tư của đối phương, một cờ đỏ cảnh báo mối quan hệ độc hại.", "notes": "Tình yêu lành mạnh mang lại sự tự do và lòng tin, chứ không phải sự giam cầm số."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng gặp ai trên mạng có những yêu cầu kiểm soát vô lý khiến bạn thấy ngột ngạt chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đừng nhầm lẫn giữa sự kiểm soát độc hại và tình yêu thương chân thành trên không gian mạng."]}', 6);

-- --- Micro Lesson 6.2: Cảnh giác kẻ giả mạo ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Cảnh giác kẻ giả mạo', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Người bạn 15 tuổi, siêu đẹp trai, đang học trường quốc tế nói chuyện cực hợp với bạn trên mạng liệu có thực sự tồn tại ngoài đời?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Catfishing (Giả mạo danh tính) là việc một người tạo tài khoản ảo với hình ảnh và thông tin của người khác để tiếp cận, làm quen và lừa gạt bạn.", "Mục đích của họ có thể là lừa tiền, lừa tình cảm, hoặc dụ dỗ bạn làm những việc nhạy cảm để tống tiền.", "Hãy luôn cảnh giác với những tài khoản không bao giờ chịu gọi video call trực tiếp hoặc luôn từ chối gặp mặt ngoài đời."]}', 2),
(@ml_id, 'scenario', '{"title": "Camera hỏng liên tục", "body": "Lan quen anh Duy qua Instagram, ảnh cá nhân của anh trông rất lãng tử và giàu có. Mỗi lần Lan rủ gọi video để nhìn mặt, anh Duy đều bảo camera bị hỏng."}', 3),
(@ml_id, 'interaction', '{"question": "Lan nên làm gì để kiểm chứng thông tin của Duy?", "choices": [{"text": "Đề nghị dừng nói chuyện yêu đương cho đến khi có thể gọi video call nhìn rõ mặt và xác nhận danh tính thật ngoài đời.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục tin tưởng và gửi thẻ cào điện thoại giúp anh Duy vì anh bảo đang gặp khó khăn tạm thời.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thói quen kiểm tra kỹ trang cá nhân (ngày lập, lượng tương tác thật) của một người lạ trước khi kết bạn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đừng trao trọn lòng tin cho một bức ảnh đại diện long lanh trên mạng xã hội khi chưa được kiểm chứng thực tế."]}', 6);

-- --- Micro Lesson 6.3: Cạm bẫy cô lập ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Cạm bẫy cô lập', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao kẻ thao túng trên mạng luôn tìm cách bắt bạn giữ bí mật mối quan hệ và không được kể cho bố mẹ hay bạn bè nghe?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cô lập bạn là bước đầu tiên để kẻ thao túng dễ dàng kiểm soát tâm lý và hành vi của bạn.", "Khi bạn không chia sẻ với ai khác, bạn sẽ mất đi những góc nhìn khách quan và lời khuyên tỉnh táo từ những người xung quanh.", "Một mối quan hệ lành mạnh không bao giờ bắt bạn phải sống trong bóng tối và che giấu tất cả mọi người."]}', 2),
(@ml_id, 'scenario', '{"title": "Yêu cầu bí mật", "body": "Một người đàn ông trung niên giả danh làm tuyển trạch viên người mẫu trẻ tuổi kết bạn với Vy và dặn cô phải tuyệt đối giữ bí mật về các buổi chụp ảnh thử."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành vi ứng xử trước yêu cầu giữ bí mật mối quan hệ:", "leftBox": {"title": "Hành vi tỉnh táo"}, "rightBox": {"title": "Bị cô lập thao túng"}, "items": [{"text": "Tâm sự với bạn thân về người bạn mới quen trên mạng để nghe nhận xét", "correctBox": "left"}, {"text": "Giấu kín mọi cuộc trò chuyện với người lạ vì họ dọa nếu nói ra sẽ bị trừng phạt", "correctBox": "right"}, {"text": "Dẫn theo bạn bè đi cùng khi lần đầu tiên hẹn gặp người quen trên mạng ngoài đời", "correctBox": "left"}, {"text": "Nói dối bố mẹ đi học thêm để đến nhà riêng của một người quen qua mạng", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy một mối quan hệ luôn bắt bạn phải nói dối người thân có thực sự mang lại hạnh phúc lâu dài không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Ánh sáng là kẻ thù của sự thao túng. Hãy chia sẻ câu chuyện của bạn với những người yêu thương bạn ngoài đời thực."]}', 6);

-- --- Micro Lesson 6.4: Tình huống: Món quà từ người lạ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Tình huống: Món quà từ người lạ', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Một game thủ VIP trên mạng tặng bạn rất nhiều trang phục đẹp và đề nghị bạn gọi video call riêng tư để nói chuyện, bạn sẽ làm gì?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Không có bữa ăn nào là miễn phí, đặc biệt là từ những người lạ trên không gian mạng.", "Những món quà đắt tiền thường là mồi nhử để tạo ra cảm giác mắc nợ, khiến bạn thấy khó từ chối các yêu cầu nhạy cảm tiếp theo của họ.", "Hãy kiên quyết từ chối những món quà vô cớ từ người lạ để giữ cho mình thế chủ động và an toàn."]}', 2),
(@ml_id, 'scenario', '{"title": "Trang phục game đắt giá", "body": "Một người lạ kết bạn với Minh trong game Liên Quân và tặng Minh trang phục tướng trị giá 500k. Sau đó, người này nhắn tin yêu cầu Minh bật camera phòng riêng và cởi áo ra cho xem để cảm ơn."}', 3),
(@ml_id, 'flashcard', '{"front": "Minh nên xử lý thế nào trước yêu cầu của người lạ sau khi đã nhận quà game?", "back": "Minh nên chặn tài khoản của người đó ngay lập tức, tuyệt đối không bật camera và kể ngay sự việc cho bố mẹ nghe.", "notes": "Đừng vì tiếc một món quà ảo mà đánh đổi sự an toàn và danh dự thực tế của bản thân."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ cảm thấy áy náy hoặc mắc nợ khi nhận được quà từ một người bạn mới quen trên mạng chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Sự an toàn của bạn quan trọng hơn bất kỳ món quà ảo hay trang phục game đắt tiền nào trên thế giới."]}', 6);

-- --- Micro Lesson 6.5: Thoát khỏi mối quan hệ thao túng ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Thoát khỏi mối quan hệ thao túng', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để chấm dứt một mối quan hệ trực tuyến độc hại khi đối phương liên tục đe dọa sẽ hủy hoại bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Kẻ thao túng thường dùng những lời đe dọa để giữ chân bạn: dọa tự tử, dọa tung ảnh riêng tư, hoặc dọa mách bố mẹ.", "Hãy nhớ: bạn không phải chịu trách nhiệm về hành vi tự hủy hoại của đối phương. Những lời đe dọa đó thường chỉ là chiêu trò tâm lý.", "Lập tức chụp bằng chứng, chặn mọi kênh liên lạc, không đôi co thêm và tìm kiếm sự hỗ trợ từ người lớn đáng tin cậy."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời đe dọa tung tin nhắn", "body": "Người yêu qua mạng của Vy dọa sẽ gửi những tin nhắn tâm sự riêng tư nhạy cảm của hai người cho bố mẹ Vy xem nếu Vy đòi chia tay. Vy rất sợ hãi và cắn răng chịu đựng."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên làm gì để thoát khỏi tình cảnh bế tắc này?", "choices": [{"text": "Chặn toàn bộ liên lạc với người đó, chủ động kể thật câu chuyện với bố mẹ trước để nhận sự bảo vệ và hỗ trợ.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục chịu đựng và làm theo mọi yêu cầu của người đó để giữ bình yên tạm thời.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có tin rằng việc chủ động nói thật với bố mẹ luôn tốt hơn việc để kẻ xấu dùng điều đó để khống chế bạn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đừng để sự sợ hãi giam giữ bạn trong ngục tối số. Hãy dũng cảm cắt đứt và tìm kiếm sự che chở từ những người yêu thương bạn thực sự."]}', 6);

-- --- Micro Lesson 6.6: Tin vào trực giác của bạn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Tin vào trực giác của bạn', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Khi trò chuyện với ai đó trên mạng mà bạn luôn cảm thấy có điều gì đó sai sai, bạn nên làm gì?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Trực giác (Gut feeling) là hệ thống cảnh báo sớm của cơ thể dựa trên những chi tiết nhỏ nhặt mà lý trí chưa kịp phân tích.", "Nếu bạn thấy lo sợ, bất an hoặc nghi ngờ lòng tốt của đối phương, đừng cố lờ đi cảm xúc đó để tỏ ra lịch sự.", "Bạn luôn có quyền dừng cuộc trò chuyện và lùi lại một bước để bảo vệ sự an toàn của mình."]}', 2),
(@ml_id, 'scenario', '{"title": "Cảm giác bất an", "body": "Hùng nói chuyện với một người tự xưng là anh họ của bạn thân trên mạng. Người này liên tục hỏi Hùng bố mẹ đi làm về lúc mấy giờ, nhà có lắp camera không. Hùng thấy gai người và thấy có gì đó bất ổn."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành dung ứng xử theo trực giác mách bảo sau:", "leftBox": {"title": "Lắng nghe trực giác"}, "rightBox": {"title": "Phớt lờ cảnh báo"}, "items": [{"text": "Ngừng chat khi thấy đối phương liên tục hỏi về địa chỉ phòng ngủ của mình", "correctBox": "left"}, {"text": "Cố gắng tiếp tục trò chuyện dù thấy nổi da gà trước những câu hỏi riêng tư của họ", "correctBox": "right"}, {"text": "Hỏi ý kiến chị gái khi thấy bạn quen trên mạng đòi gọi video call lúc nửa đêm", "correctBox": "left"}, {"text": "Bỏ qua cảm giác bồn chồn lo lắng để đồng ý gặp mặt riêng tư người lạ ở công viên vắng", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Đã bao giờ trực giác mách bảo bạn tránh xa một người trên mạng và sau đó bạn phát hiện ra họ thực sự có vấn đề chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Trực giác của bạn là người bạn đồng hành trung thực nhất. Hãy tin tưởng và lắng nghe khi nó lên tiếng cảnh báo nhé."]}', 6);


-- =========================================================================
-- BÀI HỌC 7: Công Dân Số Văn Minh: Lan Tỏa Vibes Lành! (Positive Digital Citizenship)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'cong-dan-so-van-minh',
    'Công Dân Số Văn Minh: Lan Tỏa Vibes Lành!',
    'Tìm hiểu về bạo lực mạng, cách trở thành người bảo vệ Upstander và lan tỏa văn hóa mạng tử tế.',
    'Bài học cuối giúp bạn phân biệt đùa vui và bắt nạt trên mạng, trang bị kỹ năng ứng phó khi chứng kiến bạo lực mạng với vai trò người can thiệp dũng cảm, và hướng tới văn hóa số tích cực.',
    27,
    false,
    100,
    12
);
SET @lesson7_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson7_id, 'Scarleteen - Our Philosophy', 'https://www.scarleteen.com/about/our-philosophy', 'website');

-- --- Micro Lesson 7.1: Bạo lực mạng là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Bạo lực mạng là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có nghĩ một dòng comment chê bai, chế giễu ngoại hình của người khác trên mạng chỉ là một trò đùa vô hại?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bạo lực mạng (Cyberbullying) là hành vi cố ý, lặp đi lặp lại nhằm đe dọa, hạ nhục, cô lập hoặc gây tổn thương cho người khác qua internet.", "Nó bao gồm việc đăng ảnh chế giễu, bình luận thóa mạ, lập group anti, hoặc chia sẻ tin đồn thất thiệt.", "Bạo lực mạng có thể gây ra những tổn thương tâm lý sâu sắc ngoài đời thực cho nạn nhân."]}', 2),
(@ml_id, 'scenario', '{"title": "Group chat anti", "body": "Cả lớp lập một nhóm chat riêng không có mặt Vy, chuyên đăng những bức ảnh chụp lén Vy lúc đang ăn hoặc ngủ gật để chế ảnh meme cười cợt và bình luận xúc phạm."}', 3),
(@ml_id, 'flashcard', '{"front": "Bạo lực mạng khác gì so với những tranh cãi thông thường giữa bạn bè?", "back": "Bạo lực mạng là hành vi cố ý hướng vào một cá nhân, lặp đi lặp lại nhiều lần, có tính chất hạ nhục, bắt nạt và tạo ra sự cô lập hoàn toàn.", "notes": "Đừng tham gia hoặc cổ xúy cho bất kỳ hành vi bắt nạt trực tuyến nào."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã bao giờ chứng kiến một bạn học của mình trở thành mục tiêu chế giễu của tập thể trên mạng chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chữ viết trên màn hình có thể tạo ra những vết sẹo thật trong tim. Hãy suy nghĩ trước khi gõ phím."]}', 6);

-- --- Micro Lesson 7.2: Đùa vui hay bắt nạt? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Đùa vui hay bắt nạt?', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để phân biệt giữa một lời trêu đùa thân thiện giữa những người bạn và hành vi bắt nạt trực tuyến độc hại?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Trêu đùa lành mạnh là khi cả hai bên đều thấy vui vẻ, thoải mái và có thể dừng lại ngay khi một bên cảm thấy khó chịu.", "Bắt nạt là khi một bên liên tục cảm thấy xấu hổ, sợ hãi nhưng bên kia vẫn tiếp tục tấn công bất chấp sự phản đối.", "Quy tắc đơn giản: Nếu người bị trêu không cười, đó không phải là trò đùa!"]}', 2),
(@ml_id, 'scenario', '{"title": "Đùa quá trớn", "body": "Nam vẽ một bức ảnh hoạt hình hài hước trêu gu thời trang của Bình. Lần sau, Nam đăng ảnh chế Bình bị ngã xe kèm những lời lẽ chế giễu, Bình nhắn tin xin gỡ nhưng Nam bảo: Đùa tí làm gì căng thế?"}', 3),
(@ml_id, 'interaction', '{"question": "Hành vi lần thứ hai của Nam là gì?", "choices": [{"text": "Bắt đầu chuyển thành hành vi bắt nạt trực tuyến vì phớt lờ lời yêu cầu dừng lại của bạn và gây tổn thương cho bạn.", "correct": true, "emoji": "💚"}, {"text": "Vẫn là trêu đùa vui vẻ bình thường, Bình quá nhạy cảm và thiếu khiếu hài hước thôi.", "correct": false, "emoji": "🚩"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ cảm thấy bị tổn thương bởi một trò đùa của bạn bè trên mạng nhưng vẫn phải giả vờ cười để không bị coi là kẻ phá đám chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Sự thoải mái của người nghe mới là thước đo quyết định đó có phải là trò đùa vui vẻ hay không."]}', 6);

-- --- Micro Lesson 7.3: Cảm xúc của nạn nhân ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Cảm xúc của nạn nhân', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ tự hỏi cảm giác của một người khi mở điện thoại ra và thấy hàng trăm bình luận chửi bới hướng vào mình sẽ như thế nào?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nạn nhân của bạo lực mạng thường trải qua cảm giác cô đơn tột cùng, bất an, sợ hãi không dám đến trường và tự trách bản thân.", "Sự công kích dồn dập khiến họ có cảm giác cả thế giới đang quay lưng lại với mình.", "Thấu hiểu và đồng cảm giúp chúng ta có trách nhiệm hơn với từng lượt tương tác của mình trên mạng."]}', 2),
(@ml_id, 'scenario', '{"title": "Áp lực dồn dập", "body": "Trang mở Facebook lên và thấy hàng chục bình luận chế giễu ngoại hình cô ấy dưới bài đăng của một trang confession trường. Trang khóc nức nở và khóa phòng kín mít."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các cách ứng xử thể hiện sự đồng cảm với nạn nhân bạo lực mạng:", "leftBox": {"title": "Đồng cảm ấm áp"}, "rightBox": {"title": "Thờ ơ độc hại"}, "items": [{"text": "Nhắn tin riêng hỏi thăm và động viên: Tớ luôn bên cậu, cậu không cô đơn đâu", "correctBox": "left"}, {"text": "Hùa vào bình luận thả icon cười cợt dưới bài viết dìm hàng để tỏ ra hợp thời", "correctBox": "right"}, {"text": "Báo cáo bài viết xúc phạm và đề nghị mọi người không chia sẻ thêm", "correctBox": "left"}, {"text": "Nghĩ bụng: Chắc bạn đó phải làm gì sai thì mới bị mọi người ghét như vậy chứ", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Nếu một ngày bạn bị cả nhóm bạn quay lưng nói xấu trên mạng, bạn mong muốn nhận được sự hỗ trợ như thế nào từ những người xung quanh?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Một lời hỏi thăm riêng tư, ấm áp của bạn có thể cứu rỗi cả một tâm hồn đang tuyệt vọng vì bạo lực mạng."]}', 6);

-- --- Micro Lesson 7.4: Tình huống: Kẻ đứng xem (Bystander) ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Tình huống: Kẻ đứng xem (Bystander)', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Khi chứng kiến một người khác bị bắt nạt trên mạng, việc bạn im lặng đứng nhìn có thực sự giúp bạn vô can?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Kẻ đứng xem (Bystander) là người nhìn thấy hành vi bắt nạt nhưng lựa chọn im lặng, phớt lờ hoặc chia sẻ bài viết để xem trò vui.", "Sự im lặng của đám đông vô tình tạo ra sự cổ vũ ngầm, khiến kẻ bắt nạt càng đắc ý và nạn nhân càng cô độc.", "Bạn không cần phải nhảy vào tranh cãi tay đôi, nhưng bạn có thể hành động thông minh để bảo vệ nạn nhân."]}', 2),
(@ml_id, 'scenario', '{"title": "Đám đông im lặng", "body": "Trong nhóm chat lớp, một bạn nam đăng ảnh chế giễu cân nặng của bạn Vy. Cả nhóm im lặng không ai nói gì, một vài bạn thả icon cười cợt. Vy nhìn thấy và thấy vô cùng xấu hổ."}', 3),
(@ml_id, 'flashcard', '{"front": "Bạn nên làm gì để không trở thành một kẻ đứng xem vô cảm trong tình huống trên?", "back": "Bạn có thể nhắn tin riêng động viên Vy, đồng thời báo cáo tin nhắn xấu đó cho lớp trưởng hoặc giáo viên chủ nhiệm biết để can thiệp kịp thời.", "notes": "Đừng làm khán giả cho những hành vi bắt nạt trực tuyến."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng im lặng đứng nhìn một hành vi bất công trên mạng vì sợ bị liên lụy chưa? Bạn cảm thấy thế nào sau đó?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Im lặng trước cái xấu chính là tiếp tay cho nó lan tỏa. Hãy dũng cảm hành động vì sự công bằng."]}', 6);

-- --- Micro Lesson 7.5: Trở thành người bảo vệ (Upstander) ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Trở thành người bảo vệ (Upstander)', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để nâng cấp bản thân từ một kẻ đứng xem vô cảm thành một người bảo vệ dũng cảm (Upstander) trên mạng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Người bảo vệ (Upstander) là người chủ động hành động để ngăn chặn hành vi bắt nạt và hỗ trợ nạn nhân.", "Các bước hành động: Báo cáo (Report) bài viết vi phạm, Bày tỏ sự ủng hộ (Support) trực tiếp với nạn nhân, và Báo cáo cho người lớn (Refer) đáng tin cậy.", "Một hành động nhỏ của người bảo vệ có thể xoay chuyển hoàn toàn tình thế và mang lại hy vọng."]}', 2),
(@ml_id, 'scenario', '{"title": "Lên tiếng đúng lúc", "body": "Thấy Vy bị chế giễu cân nặng trong nhóm chat, Duy quyết định không im lặng nữa mà nhắn tin yêu cầu mọi người dừng lại."}', 3),
(@ml_id, 'interaction', '{"question": "Duy nên viết tin nhắn như thế nào trong nhóm chat lớp để thể hiện vai trò Upstander một cách văn minh?", "choices": [{"text": "Tớ thấy trò đùa chế ảnh này không vui chút nào đâu các bạn ơi. Tụi mình dừng lại và xóa ảnh đi nhé.", "correct": true, "emoji": "💚"}, {"text": "Mấy đứa vô duyên kia im miệng lại hết đi, có giỏi thì ra ngoài đời thật nói chuyện xem nào!", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng lên tiếng bảo vệ một bạn học bị bắt nạt trên mạng nếu bạn có sự đồng hành của những người bạn khác không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Người bảo vệ dũng cảm không dùng bạo lực để giải quyết bạo lực, họ dùng sự kiên định và tử tế để đẩy lùi bóng tối."]}', 6);

-- --- Micro Lesson 7.6: Lan tỏa văn hóa số tích cực ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Lan tỏa văn hóa số tích cực', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để mỗi ngày mở mạng xã hội ra, bạn đều nhận lại những nụ cười ấm áp thay vì những cuộc cãi vã mệt mỏi?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Văn hóa mạng được tạo nên từ hành vi của từng cá nhân sử dụng nó.", "Hãy lan tỏa năng lượng tích cực bằng cách: viết những lời khen ngợi chân thành, chia sẻ những câu chuyện tử tế, và hỗ trợ bạn bè.", "Gieo hạt mầm tử tế trên thế giới số hôm nay, bạn sẽ gặt hái được một không gian sống chung an toàn và hạnh phúc ngày mai."]}', 2),
(@ml_id, 'scenario', '{"title": "Hạt mầm tử tế", "body": "Hồng thấy bạn cùng bàn đăng ảnh khoe bức vẽ tự tay làm quà sinh nhật cho mẹ bị một vài người chê là vẽ xấu. Hồng liền vào bình luận thả tim khen ngợi nỗ lực và ý nghĩa bức vẽ."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành dung góp phần xây dựng văn hóa số văn minh sau:", "leftBox": {"title": "Gieo hạt mầm tử tế"}, "rightBox": {"title": "Gieo mầm độc hại"}, "items": [{"text": "Thả tim và chúc mừng bài viết khoe thành tích học tập của bạn cùng lớp", "correctBox": "left"}, {"text": "Bình luận móc mỉa ngoại hình của một ca sĩ nổi tiếng dưới bài báo", "correctBox": "right"}, {"text": "Chia sẻ bài viết kêu gọi quyên góp giúp đỡ hoàn cảnh khó khăn thật sự", "correctBox": "left"}, {"text": "Spam các meme tục tĩu, phản cảm vào phần bình luận của người khác", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Ngày hôm nay, bạn đã làm được việc tốt hay gửi đi thông điệp tử tế nào trên không gian mạng chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Một thế giới mạng văn minh, tử tế bắt đầu từ chính hành động nhỏ bé của bạn ngày hôm nay."]}', 6);
