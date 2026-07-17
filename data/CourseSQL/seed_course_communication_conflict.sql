-- =========================================================================
-- SEED DATA FOR COURSE: Kỹ Năng Giao Tiếp & Giải Quyết Xung Đột
-- =========================================================================

SET NAMES utf8mb4;
USE educare;

-- 1. Thêm Khóa học mới
INSERT INTO courses (title, description, thumbnail, color_theme, course_order, category_id)
VALUES (
    'Kỹ Năng Giao Tiếp & Giải Quyết Xung Đột',
    'Học cách giao tiếp lành mạnh, lắng nghe chủ động, đặt ranh giới tôn trọng, xây dựng lòng tin và giải quyết xung đột ôn hòa trong mối quan hệ.',
    'communication-course.png',
    '#ef4444',
    90,
    5
);
SET @course_id = LAST_INSERT_ID();

-- =========================================================================
-- BÀI HỌC 1: Nền tảng Giao tiếp Lành mạnh
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'nen-tang-giao-tiep-lanh-manh',
    'Nền tảng Giao tiếp Lành mạnh',
    'Định nghĩa giao tiếp lành mạnh, bình đẳng, nhận diện cờ xanh và vượt qua nỗi sợ mở lòng.',
    'Bài học cung cấp kiến thức cốt lõi về giao tiếp lành mạnh, tầm quan trọng của lòng tin, cách xử lý hiểu lầm qua tin nhắn và kỹ năng mở lời đúng lúc.',
    1,
    true,
    100,
    8
);
SET @lesson1_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson1_id, 'Scarleteen - Quickies: Healthy Relationships', 'https://www.scarleteen.com/read/relationships/quickies-healthy-relationships', 'website');

-- --- Micro Lesson 1.1: Giao tiếp lành mạnh là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Giao tiếp lành mạnh là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Giao tiếp có phải chỉ là nói cho sướng mồm?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Giao tiếp không chỉ là phát ra âm thanh, mà là cách chúng ta kết nối tâm hồn.", "Nhiều lúc tụi mình cứ nghĩ nói nhiều là giỏi, nhưng thực chất lắng nghe mới là đỉnh chóp.", "Giao tiếp lành mạnh giúp xây dựng lòng tin và làm mối quan hệ bền vững hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống bất ổn", "body": "Vy đang cố kể cho Nam nghe về điểm số tệ hại của mình, nhưng Nam chỉ cắm mặt vào điện thoại và ừ hử cho qua chuyện."}', 3),
(@ml_id, 'interaction', '{"question": "Nếu là Vy, bạn sẽ làm gì để bày tỏ cảm xúc lúc này?", "choices": [{"text": "Bực bội bỏ đi và im lặng suốt cả tuần để Nam tự biết lỗi.", "correct": false, "emoji": "😐"}, {"text": "Nhẹ nhàng bảo Nam cất điện thoại đi và lắng nghe mình một chút.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng cảm thấy bị phớt lờ khi đang chia sẻ câu chuyện của mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Giao tiếp bắt đầu từ việc tôn trọng và hiện diện cùng nhau."]}', 6);

-- --- Micro Lesson 1.2: Nhận diện cờ xanh trong giao tiếp ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Nhận diện cờ xanh trong giao tiếp', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao biết cuộc trò chuyện của hai bạn là \"healthy\"?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["\"Cờ xanh\" là những dấu hiệu cho thấy cuộc giao tiếp mang lại sự an toàn và tôn trọng.", "Cả hai đều được nói, được lắng nghe và không ai áp đặt ai.", "Cảm thấy nhẹ lòng và thoải mái sau khi nói chuyện là tín hiệu cực tốt."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống tích cực", "body": "Khi Minh kể về sở thích anime có phần kỳ lạ của mình, Hoa không cười cợt mà tò mò hỏi thêm về nhân vật Minh thích."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động nào của Hoa thể hiện \"cờ xanh\" rõ nhất?", "choices": [{"text": "Hoa lập tức chuyển chủ đề sang sở thích của mình.", "correct": false, "emoji": "🛑"}, {"text": "Hoa lắng nghe với thái độ cởi mở và tôn trọng sự khác biệt.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Mối quan hệ nào hiện tại mang lại cho bạn cảm giác an toàn nhất khi trò chuyện?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Giao tiếp lành mạnh khiến bạn cảm thấy được tôn trọng vì là chính mình."]}', 6);

-- --- Micro Lesson 1.3: Tại sao tụi mình hay sợ nói thật? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Tại sao tụi mình hay sợ nói thật?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao việc nói ra suy nghĩ thật lòng lại khó đến vậy?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tụi mình thường sợ bị từ chối, sợ làm người khác buồn hoặc bị đánh giá.", "Nỗi sợ này khiến chúng ta chọn cách im lặng hoặc nói dối lòng mình.", "Nhưng giữ mọi thứ trong lòng chỉ làm tích tụ ấm ức và hiểu lầm."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống khó xử", "body": "Linh không thích đi xem phim kinh dị nhưng nhóm bạn thân lại rủ đi. Linh sợ từ chối sẽ bị coi là kẻ phá bĩnh."}', 3),
(@ml_id, 'interaction', '{"question": "Linh nên làm gì để vừa thật lòng vừa giữ hòa khí?", "choices": [{"text": "Cứ đi xem rồi chịu đựng nỗi sợ hãi suốt buổi chiếu.", "correct": false, "emoji": "🛑"}, {"text": "Thẳng thắn chia sẻ là mình không hợp phim kinh dị và hẹn các bạn ở quán nước sau đó.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng gật đầu đồng ý một việc chỉ vì sợ bị ghét chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Nói thật cần dũng khí, nhưng nó bảo vệ năng lượng và cảm xúc của bạn."]}', 6);

-- --- Micro Lesson 1.4: Tình huống: Tin nhắn lúc nửa đêm ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Tình huống: Tin nhắn lúc nửa đêm', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đọc vị một tin nhắn không icon thế nào cho đúng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Giao tiếp qua tin nhắn thường thiếu đi giọng điệu và nét mặt, rất dễ gây hiểu lầm.", "Một chữ \"Ừ\" cụt lủn có thể làm đối phương mất ngủ cả đêm để suy diễn.", "Đừng vội suy diễn tiêu cực khi chưa xác nhận lại thông tin rõ ràng."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống hiểu lầm", "body": "Vy nhắn tin kể chuyện vui cho Nam nhưng Nam chỉ trả lời: \"Ừ thế à\". Vy lập tức nghĩ Nam đang giận mình."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên phản ứng thế nào là khôn ngoan nhất?", "choices": [{"text": "Nhắn tin chất vấn dồn dập hỏi Nam vì sao thái độ lạnh nhạt.", "correct": false, "emoji": "🛑"}, {"text": "Chờ hôm sau gặp trực tiếp hoặc gọi điện hỏi han nhẹ nhàng xem Nam có mệt không.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng giận dỗi ai đó chỉ vì hiểu lầm nội dung tin nhắn chat chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tin nhắn chữ không nói lên toàn bộ cảm xúc, hãy hỏi lại trước khi suy diễn."]}', 6);

-- --- Micro Lesson 1.5: Kỹ năng: Bật công tắc "giao tiếp xanh" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Kỹ năng: Bật công tắc "giao tiếp xanh"', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để khởi động một cuộc trò chuyện chất lượng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hãy chọn thời điểm cả hai đều thoải mái, không bận rộn hay mệt mỏi.", "Bắt đầu bằng thái độ cầu thị, muốn lắng nghe thay vì muốn phân bua.", "Giao tiếp mắt và gật đầu nhẹ để thể hiện bạn đang hoàn toàn hiện diện."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống thực tế", "body": "Tuấn muốn nói chuyện với bố về việc chọn khối học, nhưng bố vừa đi làm về trông rất mệt mỏi và đang xem tivi."}', 3),
(@ml_id, 'interaction', '{"question": "Tuấn nên bắt đầu cuộc nói chuyện khi nào?", "choices": [{"text": "Lập tức vào đề ngay vì chuyện này rất quan trọng với Tuấn.", "correct": false, "emoji": "😐"}, {"text": "Đợi bố nghỉ ngơi ăn tối xong, hỏi xem bố có rảnh không rồi mới xin phép trò chuyện.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thường chọn cách nào để mở lời khi muốn nói chuyện nghiêm túc với ai đó?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Thời điểm giao tiếp cũng quan trọng như nội dung bạn muốn truyền tải."]}', 6);

-- --- Micro Lesson 1.6: Bạn có từng chọn im lặng? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bạn có từng chọn im lặng?', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Im lặng là vàng hay là ngòi nổ cho chiến tranh lạnh?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nhiều người dùng sự im lặng để trừng phạt đối phương hoặc né tránh xung đột.", "Chiến tranh lạnh không giúp giải quyết vấn đề mà chỉ làm rạn nứt lòng tin.", "Nếu chưa sẵn sàng nói, hãy xin phép tạm dừng thay vì đột ngột biến mất."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống căng thẳng", "body": "Sau khi tranh cãi về bài tập nhóm, Trang chặn liên lạc của Quân và im lặng suốt ba ngày liền."}', 3),
(@ml_id, 'interaction', '{"question": "Cách xử lý nào của Trang lành mạnh hơn?", "choices": [{"text": "Tiếp tục im lặng cho đến khi Quân tự tìm đến xin lỗi.", "correct": false, "emoji": "😐"}, {"text": "Nhắn tin bảo cần thời gian bình tĩnh và hẹn ngày mai cùng thảo luận lại.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Khi giận dỗi, bạn thường chọn im lặng hay nói ra ngay lập tức?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Im lặng chỉ là giải pháp tạm thời, đối thoại mới là chìa khóa tháo gỡ."]}', 6);

-- --- Micro Lesson 1.7: Đúc kết: Thấu hiểu quan trọng hơn chiến thắng ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Đúc kết: Thấu hiểu quan trọng hơn chiến thắng', 7);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Mục tiêu cuối cùng của giao tiếp là gì?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Giao tiếp không phải là một trận chiến có người thắng kẻ thua.", "Mục tiêu là thấu hiểu cảm xúc của nhau và cùng nhau xây dựng kết nối.", "Thắng một cuộc tranh cãi nhưng làm tổn thương đối phương là một thất bại."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống đúc kết", "body": "Đức chứng minh được mình đúng trong vụ tranh cãi, khiến Mai khóc và bỏ về. Đức cảm thấy đắc thắng nhưng mối quan hệ trở nên lạnh nhạt."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động nào thể hiện Đức hiểu ý nghĩa thực sự của giao tiếp?", "choices": [{"text": "Đức tiếp tục tự đắc vì mình đã thắng cuộc tranh luận.", "correct": false, "emoji": "🛑"}, {"text": "Đức chủ động nhắn tin xin lỗi vì thái độ gay gắt và hỏi han cảm xúc của Mai.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng nhường bước trong một cuộc tranh cãi để bảo vệ mối quan hệ không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Trong giao tiếp lành mạnh, sự thấu hiểu và kết nối luôn đứng trên cái tôi cá nhân."]}', 6);

-- --- Micro Lesson 1.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Nền tảng Giao tiếp Lành mạnh''! Hãy chứng tỏ khả năng thấu hiểu của bạn qua các game tương tác sau."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Họp nhóm sóng gió", "startNode": "step1", "nodes": {"step1": {"text": "Bạn tham gia bài tập nhóm. Một bạn trong nhóm nói: ''Slide này thiết kế xấu quá, làm lại đi''. Lòng bạn thấy nhói đau và tự ái.", "choices": [{"text": "Nói gay gắt lại: ''Cậu giỏi thì tự đi mà làm!''.", "nextNode": "fail_step1"}, {"text": "Bình tĩnh phản hồi: ''Cậu thấy chỗ nào chưa ổn thì chỉ rõ để tụi mình cùng sửa nhé?''.", "nextNode": "step2"}]}, "step2": {"text": "Bạn đó tiếp tục chê: ''Tất cả đều không ổn, đặc biệt là phần chữ''. Bạn cảm thấy rất tức giận.", "choices": [{"text": "Im lặng bỏ họp và quyết định rút khỏi nhóm.", "nextNode": "fail_step2"}, {"text": "Áp dụng mệnh đề Tôi: ''Mình cảm thấy hơi buồn khi bạn nhận xét chung chung như vậy. Bạn chỉ rõ bố cục hay màu sắc chưa hợp được không?''.", "nextNode": "step3"}]}, "step3": {"text": "Bạn đó ngớ người rồi chỉ ra màu sắc hơi tối. Cả nhóm đang căng thẳng.", "choices": [{"text": "Cố cãi bằng được là màu này rất đẹp để chiến thắng.", "nextNode": "fail_step3"}, {"text": "Lắng nghe và đề xuất cả nhóm bỏ phiếu chọn bảng màu mới.", "nextNode": "step4"}]}, "step4": {"text": "Nhóm đồng ý bỏ phiếu và chọn được màu mới. Nhưng bạn đó lại nói: ''Thôi làm nhanh lên mệt quá''.", "choices": [{"text": "Quát to bảo bạn đó câm miệng lại.", "nextNode": "fail_step4"}, {"text": "Giao tiếp mắt ôn hòa, bảo: ''Tụi mình sắp xong rồi, cùng cố gắng thêm chút nha''.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành xuất sắc! Bạn đã giải quyết xung đột nhóm cực kỳ khôn ngoan và thấu cảm!", "isEnd": true, "isSuccess": true}, "fail_step1": {"text": "❌ Thất bại! Thái độ gay gắt lập tức kích hoạt sự tự vệ của đối phương và làm hỏng buổi làm việc.", "isEnd": true, "isSuccess": false}, "fail_step2": {"text": "❌ Thất bại! Im lặng trốn chạy chỉ kéo dài sự bực bội và làm bài nhóm trễ hạn.", "isEnd": true, "isSuccess": false}, "fail_step3": {"text": "❌ Thất bại! Coi trọng thắng thua cá nhân hơn công việc chung làm sứt mẻ tình đồng đội.", "isEnd": true, "isSuccess": false}, "fail_step4": {"text": "❌ Thất bại! Lớn tiếng quát tháo làm cuộc xung đột bùng phát nghiêm trọng hơn.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Kéo các thẻ hành vi vào đúng hộp Giao tiếp Lành mạnh hoặc Độc hại.", "leftBox": {"title": "Green Flag (Lành mạnh)"}, "rightBox": {"title": "Red Flag (Độc hại)"}, "items": [{"text": "Lắng nghe không ngắt lời khi bạn đang nói.", "correctBox": "left"}, {"text": "Chỉ trích xúc phạm cá nhân khi không vừa ý.", "correctBox": "right"}, {"text": "Dùng mệnh đề Tôi để bày tỏ cảm xúc.", "correctBox": "left"}, {"text": "Im lặng chiến tranh lạnh để trừng phạt bạn.", "correctBox": "right"}, {"text": "Đặt câu hỏi mở để thấu hiểu câu chuyện.", "correctBox": "left"}, {"text": "Đọc lén tin nhắn riêng tư của đối phương.", "correctBox": "right"}, {"text": "Tôn trọng ranh giới từ chối của bạn bè.", "correctBox": "left"}, {"text": "Đổ lỗi dồn dập bắt đầu bằng mệnh đề Bạn.", "correctBox": "right"}, {"text": "Giao tiếp mắt thân thiện khi nói chuyện.", "correctBox": "left"}, {"text": "Thao túng tâm lý bắt đối phương nhận lỗi.", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp các thuật ngữ giao tiếp với định nghĩa chính xác.", "pairs": [{"left": "Lắng nghe chủ động", "right": "Tập trung hoàn toàn vào người nói và thấu cảm."}, {"left": "Mệnh đề Tôi", "right": "Cách diễn đạt cảm xúc không mang tính đổ lỗi."}, {"left": "Ranh giới cá nhân", "right": "Giới hạn đỏ về cảm xúc và không gian thoải mái."}, {"left": "Chiến tranh lạnh", "right": "Hành vi im lặng trừng phạt gây độc hại."}, {"left": "Đồng thuận", "right": "Sự đồng ý tự nguyện và có thể thay đổi."}, {"left": "Cờ xanh giao tiếp", "right": "Tín hiệu an toàn và tôn trọng lẫn nhau."}, {"left": "Hạch hạnh nhân", "right": "Phần não cảm xúc dễ kích hoạt khi nóng giận."}, {"left": "Đối thoại", "right": "Cách thảo luận ôn hòa để tìm giải pháp chung."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Giao tiếp lành mạnh đòi hỏi sự [blank1] và cởi mở từ cả hai phía. Khi đối thoại, việc lắng nghe [blank2] giúp chúng ta thấu hiểu cảm xúc của đối phương thay vì vội vàng phán xét. Sử dụng mệnh đề [blank3] là một kỹ năng tuyệt vời để bày tỏ suy nghĩ cá nhân mà không gây cảm giác đổ lỗi. Ngoài ra, việc duy trì sự hiện [blank4] trọn vẹn bằng ánh mắt và ngôn ngữ cơ thể sẽ tiếp thêm năng lượng tích cực cho cuộc trò chuyện. Hãy nhớ rằng mục tiêu của giao tiếp là thấu hiểu chứ không phải để giành chiến [blank5].", "blanks": {"blank1": {"correct": "tôn trọng", "placeholder": "..."}, "blank2": {"correct": "chủ động", "placeholder": "..."}, "blank3": {"correct": "Tôi", "placeholder": "..."}, "blank4": {"correct": "diện", "placeholder": "..."}, "blank5": {"correct": "thắng", "placeholder": "..."}}, "words": ["tôn trọng", "chủ động", "Tôi", "diện", "thắng", "Bạn", "thua", "thụ động", "phán xét", "im lặng"]}', 5),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Khi gặp bất đồng ý kiến, cơn nóng giận dễ khiến phần não cảm xúc hay còn gọi là hạch [blank1] kiểm soát hành vi của bạn. Trong trạng thái này, chúng ta rất dễ nói ra những lời gây tổn [blank2] sâu sắc đến người khác. Thay vì chọn phong cách đối đầu gay gắt hoặc im lặng chiến tranh [blank3] độc hại, tụi mình nên thực hiện khoảng nghỉ để hạ nhiệt. Việc ngồi lại cùng nhau đối thoại ôn hòa sẽ giúp tìm ra giải pháp cộng [blank4] mang lại lợi ích cho cả hai bên. Hãy nhớ đặt sự an toàn cảm [blank5] làm ưu tiên hàng đầu trong mọi mối quan hệ.", "blanks": {"blank1": {"correct": "hạnh nhân", "placeholder": "..."}, "blank2": {"correct": "thương", "placeholder": "..."}, "blank3": {"correct": "lạnh", "placeholder": "..."}, "blank4": {"correct": "tác", "placeholder": "..."}, "blank5": {"correct": "xúc", "placeholder": "..."}}, "words": ["hạnh nhân", "thương", "lạnh", "tác", "xúc", "phóng", "nóng", "nhân tạo", "hại", "thắng"]}', 6),
(@ml_id, 'interaction', '{"question": "Khi bạn thân chia sẻ chuyện buồn, câu trả lời nào thể hiện sự lắng nghe thấu cảm nhất?", "choices": [{"text": "Có thế mà cũng buồn, nín đi tớ chở đi ăn.", "correct": false, "emoji": "🛑"}, {"text": "Tớ hiểu cậu đang buồn, tớ sẽ luôn ở đây nghe cậu nói.", "correct": true, "emoji": "💚"}]}', 7),
(@ml_id, 'interaction', '{"question": "Cách tốt nhất để đối phó với một tin nhắn không có icon dễ gây hiểu lầm là gì?", "choices": [{"text": "Gọi điện hỏi trực tiếp hoặc gặp gỡ trực tiếp để làm rõ ngữ cảnh.", "correct": true, "emoji": "💚"}, {"text": "Nhắn tin chiến tranh lạnh lại để bạn tự biết lỗi.", "correct": false, "emoji": "🛑"}]}', 8),
(@ml_id, 'interaction', '{"question": "Mệnh đề Tôi hoạt động hiệu quả vì lý do gì?", "choices": [{"text": "Giúp bạn trút bỏ mọi tức giận lên đầu đối phương một cách công khai.", "correct": false, "emoji": "🛑"}, {"text": "Tập trung bày tỏ cảm xúc cá nhân giúp giảm thiểu sự tự vệ của đối phương.", "correct": true, "emoji": "💚"}]}', 9),
(@ml_id, 'interaction', '{"question": "Cờ xanh rõ ràng nhất trong một tình bạn lành mạnh là gì?", "choices": [{"text": "Bạn bè luôn tôn trọng ranh giới cá nhân và ủng hộ sở thích của bạn.", "correct": true, "emoji": "💚"}, {"text": "Bạn bè yêu cầu bạn chia sẻ 100% mật khẩu các tài khoản.", "correct": false, "emoji": "🛑"}]}', 10),
(@ml_id, 'interaction', '{"question": "Khi cuộc tranh cãi nhóm đi quá xa và bắt đầu lớn tiếng quát tháo, hành động nào là đúng?", "choices": [{"text": "Đề xuất tạm dừng cuộc họp 15 phút để hạ nhiệt cơn nóng giận.", "correct": true, "emoji": "💚"}, {"text": "Cố gắng quát to hơn để áp đặt ý kiến của mình thắng cuộc.", "correct": false, "emoji": "🛑"}]}', 11);

-- =========================================================================
-- BÀI HỌC 2: Lắng nghe Chủ động & Tự tin Bày tỏ
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'lang-nghe-chu-dong-tu-tin-bay-to',
    'Lắng nghe Chủ động & Tự tin Bày tỏ',
    'Học cách lắng nghe bằng cả trái tim, sử dụng mệnh đề Tôi để bày tỏ chân thành không đổ lỗi.',
    'Bài học giúp bạn rèn luyện kỹ năng lắng nghe chủ động, thấu cảm, cách vượt qua nỗi sợ bị từ chối và thực hành công thức nói mệnh đề Tôi tinh tế.',
    2,
    true,
    100,
    8
);
SET @lesson2_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson2_id, 'Scarleteen - Hello, Sailor! How to Build, Board and Navigate a Healthy Relationship', 'https://www.scarleteen.com/read/relationships/hello-sailor-how-build-board-navigate-healthy-relationship', 'website');

-- --- Micro Lesson 2.1: Lắng nghe chủ động - Lắng nghe bằng cả con tim ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Lắng nghe chủ động - Lắng nghe bằng cả con tim', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nghe và lắng nghe khác nhau thế nào?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nghe chỉ là phản xạ vật lý, còn lắng nghe chủ động là hướng sự chú ý hoàn toàn vào người nói.", "Không cắt lời, không nghĩ sẵn câu phản bác trong đầu khi người khác đang nói.", "Thể hiện sự thấu hiểu qua ánh mắt và những cái gật đầu đồng cảm."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống thực tế", "body": "Vy đang khóc kể chuyện chú cún cưng bị ốm, Nam ngồi nghe nhưng mắt vẫn liếc nhìn màn hình game trên máy tính."}', 3),
(@ml_id, 'interaction', '{"question": "Nam nên làm gì để thể hiện sự lắng nghe chủ động?", "choices": [{"text": "Bảo Vy nín đi và tiếp tục chơi game vì game sắp vào trận.", "correct": false, "emoji": "🛑"}, {"text": "Tắt máy tính, quay sang nhìn Vy và đưa khăn giấy cho bạn.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Đã bao giờ bạn cảm nhận được ai đó đang lắng nghe mình bằng cả sự chân thành chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Món quà tuyệt vời nhất bạn có thể trao cho người khác là sự hiện diện trọn vẹn của mình."]}', 6);

-- --- Micro Lesson 2.2: Làm sao để biết mình đã nghe đúng cách? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Làm sao để biết mình đã nghe đúng cách?', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để xác nhận mình không hiểu sai ý người khác?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hãy lặp lại hoặc tóm tắt lại ý của họ bằng ngôn ngữ của bạn (Paraphrasing).", "Hỏi những câu làm rõ như: \"Ý bạn là... đúng không?\" để tránh suy diễn lung tung.", "Điều này giúp người nói cảm thấy họ thực sự được lắng nghe và thấu hiểu."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống giao tiếp", "body": "Lan nhắn: \"Tớ mệt mỏi với bài tập nhóm này quá\". Mai lập tức nghĩ Lan đang trách mình làm việc kém hiệu quả."}', 3),
(@ml_id, 'interaction', '{"question": "Mai nên phản hồi thế nào để xác nhận lại thông tin?", "choices": [{"text": "Nhắn tin tự ái: \"Cậu bảo tớ làm tệ chứ gì?\".", "correct": false, "emoji": "🛑"}, {"text": "Hỏi lại nhẹ nhàng: \"Có phải bài tập nhiều quá làm cậu bị quá tải không?\".", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng hiểu lầm ý của bạn bè vì không hỏi lại rõ ràng chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hỏi lại để làm rõ là cách tốt nhất để triệt tiêu những hiểu lầm vô lý."]}', 6);

-- --- Micro Lesson 2.3: Nỗi sợ bị từ chối khi bày tỏ bản thân ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Nỗi sợ bị từ chối khi bày tỏ bản thân', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao mở lòng nói về điểm yếu của mình lại đáng sợ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tụi mình sợ người khác thấy khuyết điểm của mình sẽ không còn yêu quý mình nữa.", "Nhưng sự dễ tổn thương (vulnerability) thực chất lại là chất keo gắn kết.", "Chia sẻ thật lòng giúp đối phương hiểu và có cơ hội hỗ trợ bạn tốt hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống tâm lý", "body": "Sơn cảm thấy vô cùng áp lực với kỳ thi học sinh giỏi nhưng không dám nói với bố mẹ vì sợ bố mẹ thất vọng."}', 3),
(@ml_id, 'interaction', '{"question": "Sơn nên làm gì để giải tỏa cảm xúc này?", "choices": [{"text": "Tiếp tục cắn răng chịu đựng áp lực một mình cho đến khi kiệt sức.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Ai là người bạn cảm thấy an tâm nhất để chia sẻ những nỗi sợ thầm kín?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bày tỏ sự yếu đuối không phải là yếu đuối, đó là sự dũng cảm để kết nối."]}', 6);

-- --- Micro Lesson 2.4: Tình huống: Buổi nói chuyện gượng gạo ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Tình huống: Buổi nói chuyện gượng gạo', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm gì khi buổi trò chuyện rơi vào im lặng đáng sợ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Những khoảng lặng trong cuộc trò chuyện là hoàn toàn bình thường, đừng quá hoảng hốt.", "Thay vì cố nói những chuyện nhạt nhẽo, hãy đặt câu hỏi mở gợi sự chia sẻ.", "Hoặc đơn giản là cùng nhau tận hưởng sự im lặng thoải mái mà không thấy áp lực."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống gượng gạo", "body": "Trong lần đầu đi chơi riêng, Huy và Trang bỗng dưng hết chuyện để nói. Cả hai đều cắm mặt vào cốc nước và cảm thấy vô cùng ngột ngạt."}', 3),
(@ml_id, 'interaction', '{"question": "Huy nên làm gì để phá vỡ bầu không khí gượng gạo này?", "choices": [{"text": "Cố gắng tìm điện thoại ra lướt Facebook để đỡ ngượng.", "correct": false, "emoji": "🛑"}, {"text": "Đặt một câu hỏi mở vui vẻ như: \"Gần đây cậu có xem bộ phim hay nghe bài hát nào thú vị không?\".", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy thoải mái khi im lặng bên cạnh người bạn thân của mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Khoảng lặng không đáng sợ, cách tụi mình phản ứng với nó mới quyết định bầu không khí."]}', 6);

-- --- Micro Lesson 2.5: Kỹ năng: Sử dụng công thức mệnh đề "Tôi" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Kỹ năng: Sử dụng công thức mệnh đề "Tôi"', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để góp ý mà không khiến đối phương tự vệ xù lông?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thay vì chỉ trích bắt đầu bằng \"Bạn\" (\"Bạn luôn đi muộn!\"), hãy dùng mệnh đề \"Tôi\".", "Công thức: \"Tôi cảm thấy [cảm xúc] khi [hành động xảy ra] vì [lý do]\".", "Cách nói này tập trung bày tỏ cảm xúc cá nhân thay vì tấn công hay quy kết lỗi lầm."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống góp ý", "body": "Nam thường xuyên trễ hẹn khiến Vy phải chờ đợi dưới nắng nóng. Vy rất tức giận."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên dùng câu nào theo công thức mệnh đề \"Tôi\" để góp ý cho Nam?", "choices": [{"text": "\"Cậu lúc nào cũng đi muộn, chẳng tôn trọng thời gian của tớ gì cả!\".", "correct": false, "emoji": "🛑"}, {"text": "\"Mình cảm thấy hơi buồn và mệt khi phải đợi lâu dưới nắng, lần sau cậu cố gắng đi đúng giờ nhé.\".", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Lần gần nhất bạn góp ý với ai đó, bạn đã dùng cách nói chỉ trích hay bày tỏ cảm xúc của mình?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bày tỏ cảm xúc của bản thân hiệu quả hơn việc chỉ ra lỗi lầm của người khác."]}', 6);

-- --- Micro Lesson 2.6: Bạn có thường giấu kín tâm sự của mình? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Bạn có thường giấu kín tâm sự của mình?', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Giữ bí mật có thực sự an sau?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Việc chọn lọc thông tin chia sẻ để bảo vệ quyền riêng tư là hoàn toàn đúng đắn.", "Nhưng nếu bạn giấu kín những tổn thương, lo lắng hay ấm ức thì lại là chuyện khác.", "Tìm kiếm sự giúp đỡ từ người đáng tin cậy là bước quan trọng để bảo vệ bản thân."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống tâm sự", "body": "Vân bị một nhóm bạn lớp bên bắt nạt qua mạng. Vân rất sợ hãi nhưng chọn cách âm thầm chịu đựng một mình."}', 3),
(@ml_id, 'interaction', '{"question": "Vân nên làm gì để thoát khỏi tình cảnh này?", "choices": [{"text": "Tiếp tục khóa tài khoản và chịu đựng nỗi lo sợ âm thầm.", "correct": false, "emoji": "🛑"}, {"text": "Chia sẻ sự việc với bố mẹ hoặc giáo viên chủ nhiệm để nhận sự hỗ trợ pháp lý và tinh thần.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Khi gặp khó khăn lớn, ai là người đầu tiên bạn nghĩ đến để tìm kiếm sự giúp đỡ?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không cần phải chịu đựng mọi khó khăn một mình, chia sẻ là sức mạnh."]}', 6);

-- --- Micro Lesson 2.7: Đúc kết: Mở lòng là bước đầu của sự gắn kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Đúc kết: Mở lòng là bước đầu của sự gắn kết', 7);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để đưa mối quan hệ lên một nấc thang mới?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sự thân mật và gắn kết không tự nhiên sinh ra, nó cần sự vun đắp từ hai phía.", "Lắng nghe chủ động kết hợp với tự tin bày tỏ chân thành tạo nên sợi dây liên kết bền chặt.", "Hãy dũng cảm mở lòng để thấu hiểu và được thấu hiểu."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống đúc kết", "body": "Sau nhiều lần trò chuyện cởi mở và cùng vượt qua những hiểu lầm, Huy và Trang cảm thấy tin tưởng và gắn bó với nhau hơn trước rất nhiều."}', 3),
(@ml_id, 'interaction', '{"question": "Yếu tố nào đóng vai trò quan trọng nhất trong sự gắn kết của Huy và Trang?", "choices": [{"text": "Sự im lặng và né tránh những chủ đề nhạy cảm.", "correct": false, "emoji": "😐"}, {"text": "Sự chân thành trong việc lắng nghe và dũng cảm bày tỏ cảm xúc của mình.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã sẵn sàng để mở lòng hơn với những người xung quanh chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Kết nối đích thực chỉ được xây dựng trên nền tảng của sự chân thành và thấu hiểu."]}', 6);

-- --- Micro Lesson 2.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Lắng nghe Chủ động & Tự tin Bày tỏ''! Cùng thực hành kỹ năng lắng nghe và nói mệnh đề Tôi qua thử thách sau."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Khi hai ta cùng im lặng", "startNode": "step1", "nodes": {"step1": {"text": "Bạn thân kể: ''Tớ vừa cãi nhau với mẹ, mệt mỏi quá''. Bạn nên nói thế nào?", "choices": [{"text": "''Mẹ cậu khó tính thế, mẹ tớ thì dễ lắm''.", "nextNode": "fail_step1"}, {"text": "''Cậu có muốn nói thêm về chuyện đó không?''.", "nextNode": "step2"}]}, "step2": {"text": "Bạn thân nói: ''Mẹ cấm tớ đi dã ngoại vì điểm kém''.", "choices": [{"text": "''Thôi lo học đi chứ điểm kém đi làm gì!''.", "nextNode": "fail_step2"}, {"text": "''Cậu cảm thấy thế nào lúc mẹ nói câu đó?''.", "nextNode": "step3"}]}, "step3": {"text": "Bạn khóc: ''Tớ thấy áp lực kinh khủng, như bị bỏ rơi''.", "choices": [{"text": "''Nín đi, khóc lóc làm gì, yếu đuối thế!''.", "nextNode": "fail_step3"}, {"text": "Im lặng lắng nghe, đưa khăn giấy cho bạn.", "nextNode": "step4"}]}, "step4": {"text": "Bạn bình tĩnh lại và hỏi: ''Tớ có nên xin lỗi mẹ không?''.", "choices": [{"text": "''Cứ mặc kệ đi, chiến tranh lạnh vài ngày mẹ sẽ tự nguôi''.", "nextNode": "fail_step4"}, {"text": "''Mẹ cũng lo cho cậu thôi. Thử dùng mệnh đề Tôi giải thích áp lực của cậu xem?''.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành xuất sắc! Bạn đã thể hiện kỹ năng lắng nghe chủ động đỉnh cao!", "isEnd": true, "isSuccess": true}, "fail_step1": {"text": "❌ Thất bại! Cướp lời và so sánh trải nghiệm của mình làm đối phương khép lòng.", "isEnd": true, "isSuccess": false}, "fail_step2": {"text": "❌ Thất bại! Đưa ra lời khuyên phán xét làm gia tăng áp lực cho bạn.", "isEnd": true, "isSuccess": false}, "fail_step3": {"text": "❌ Thất bại! Phủ nhận và chê bai cảm xúc khiến bạn thấy tổn thương.", "isEnd": true, "isSuccess": false}, "fail_step4": {"text": "❌ Thất bại! Xui bạn chiến tranh lạnh chỉ làm mâu thuẫn gia đình trầm trọng hơn.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Kéo các thẻ hành vi lắng nghe vào đúng hộp Lắng nghe chủ động hoặc Lắng nghe hời hợt.", "leftBox": {"title": "Lắng nghe chủ động"}, "rightBox": {"title": "Lắng nghe hời hợt"}, "items": [{"text": "Tập trung mắt nhìn bạn khi nói chuyện.", "correctBox": "left"}, {"text": "Vừa nghe vừa lướt mạng xã hội.", "correctBox": "right"}, {"text": "Đặt câu hỏi mở để làm rõ câu chuyện.", "correctBox": "left"}, {"text": "Nghĩ sẵn câu phản bác trong đầu khi bạn chưa nói xong.", "correctBox": "right"}, {"text": "Gật đầu nhẹ tỏ ý đồng cảm.", "correctBox": "left"}, {"text": "Ngắt lời bạn để kể câu chuyện của mình.", "correctBox": "right"}, {"text": "Tóm tắt lại ý bạn vừa nói để xác nhận thông tin.", "correctBox": "left"}, {"text": "Xem tivi khi bạn đang khóc.", "correctBox": "right"}, {"text": "Giữ không gian yên tĩnh khi lắng nghe.", "correctBox": "left"}, {"text": "Nói ''Có thế mà cũng khóc'' để giễu cợt.", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp các khái niệm với định nghĩa chính xác.", "pairs": [{"left": "Tóm tắt lại", "right": "Diễn đạt lại ý của người khác để xác nhận."}, {"left": "Lắng nghe chủ động", "right": "Lắng nghe bằng cả sự hiện diện và trái tim."}, {"left": "Mệnh đề Tôi", "right": "Công thức nói bày tỏ cảm xúc không đổ lỗi."}, {"left": "Sự dễ tổn thương", "right": "Sự dễ tổn thương giúp xây dựng lòng tin sâu."}, {"left": "Câu hỏi mở", "right": "Câu hỏi giúp đối phương chia sẻ nhiều thông tin."}, {"left": "Câu hỏi đóng", "right": "Câu hỏi chỉ có đáp án Có hoặc Không."}, {"left": "Cướp lời", "right": "Hành vi ngắt lời người khác để giành phần nói."}, {"left": "Hiện diện", "right": "Tập trung hoàn toàn không bị xao nhãng bởi điện thoại."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Lắng nghe chủ động không chỉ là việc tiếp nhận [blank1] mà là việc thấu hiểu cảm xúc của đối phương. Để người nói cảm thấy an tâm, chúng ta nên tránh hành vi cướp [blank2] hoặc làm việc riêng khi trò chuyện. Việc đặt câu hỏi [blank3] như ''Cậu cảm thấy thế nào?'' giúp gợi mở câu chuyện một cách tự nhiên. Khi muốn góp ý kiến, việc áp dụng mệnh đề [blank4] là giải pháp tuyệt vời để tránh đối đầu. Cuối cùng, việc dũng cảm mở lòng chia sẻ điểm yếu thể hiện sự dễ tổn [blank5] lành mạnh để củng cố mối quan hệ.", "blanks": {"blank1": {"correct": "thông tin", "placeholder": "..."}, "blank2": {"correct": "lời", "placeholder": "..."}, "blank3": {"correct": "mở", "placeholder": "..."}, "blank4": {"correct": "Tôi", "placeholder": "..."}, "blank5": {"correct": "thương", "placeholder": "..."}}, "words": ["thông tin", "lời", "mở", "Tôi", "thương", "dữ liệu", "quyền", "đóng", "Bạn", "hại"]}', 5),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Để xác nhận bản thân không hiểu sai ý người khác, kỹ thuật [blank1] hay diễn đạt lại là vô cùng cần thiết. Nó giúp triệt tiêu những hiểu [blank2] không đáng có từ tin nhắn chữ. Khi đối phương gặp áp lực lớn, một lời khuyên vội vã thường không hiệu quả bằng việc lắng nghe thấu [blank3]. Sự chia sẻ chân thành sẽ tạo nên không gian an [blank4] giúp giải tỏa căng thẳng tinh thần. Hãy nhớ rằng sự hiện diện trọn vẹn chính là món quà lớn nhất bạn có thể trao tặng cho người [blank5] của mình.", "blanks": {"blank1": {"correct": "tóm tắt", "placeholder": "..."}, "blank2": {"correct": "lầm", "placeholder": "..."}, "blank3": {"correct": "cảm", "placeholder": "..."}, "blank4": {"correct": "toàn", "placeholder": "..."}, "blank5": {"correct": "bạn", "placeholder": "..."}}, "words": ["tóm tắt", "lầm", "cảm", "toàn", "bạn", "chi tiết", "đúng", "hại", "nguy", "yêu"]}', 6),
(@ml_id, 'interaction', '{"question": "Khi bạn đang khóc vì trượt bài kiểm tra, câu nào sau đây là thấu cảm nhất?", "choices": [{"text": "Có mỗi bài kiểm tra thôi mà, lần sau học bù.", "correct": false, "emoji": "🛑"}, {"text": "Tớ biết cậu đã cố gắng rất nhiều. Tớ sẽ ở đây cùng cậu nhé.", "correct": true, "emoji": "💚"}]}', 7),
(@ml_id, 'interaction', '{"question": "Tại sao câu hỏi mở lại được khuyên dùng khi muốn gợi mở tâm sự?", "choices": [{"text": "Vì nó giúp người nghe dễ dàng phán xét câu chuyện hơn.", "correct": false, "emoji": "🛑"}, {"text": "Vì nó không giới hạn câu trả lời, giúp đối phương tự do chia sẻ cảm xúc.", "correct": true, "emoji": "💚"}]}', 8),
(@ml_id, 'interaction', '{"question": "Lợi ích lớn nhất của mệnh đề Tôi trong giao tiếp là gì?", "choices": [{"text": "Giúp đối phương cảm thấy bớt bị tấn công và cởi mở đối thoại hơn.", "correct": true, "emoji": "💚"}, {"text": "Giúp bạn chứng minh mình hoàn toàn đúng và thắng cuộc cãi vã.", "correct": false, "emoji": "🛑"}]}', 9),
(@ml_id, 'interaction', '{"question": "Hành động nào của bạn thân cho thấy họ đang lắng nghe chủ động?", "choices": [{"text": "Nhìn thẳng vào mắt bạn, cất điện thoại và gật đầu đồng cảm.", "correct": true, "emoji": "💚"}, {"text": "Ngồi lướt Facebook và ừ hử mỗi khi bạn nói chuyện.", "correct": false, "emoji": "🛑"}]}', 10),
(@ml_id, 'interaction', '{"question": "Khi buổi trò chuyện rơi vào khoảng lặng ngượng ngùng, cách xử lý nào tinh tế?", "choices": [{"text": "Đặt một câu hỏi mở nhẹ nhàng về sở thích hoặc chủ đề thú vị mới.", "correct": true, "emoji": "💚"}, {"text": "Lập tức lấy điện thoại ra chơi để đỡ ngượng.", "correct": false, "emoji": "🛑"}]}', 11);

-- =========================================================================
-- BÀI HỌC 3: Xây dựng Mối quan hệ Lành mạnh
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'xay-dung-moi-quan-he-lanh-manh',
    'Xây dựng Mối quan hệ Lành mạnh',
    'Nhận diện sự bình đẳng, chia sẻ trách nhiệm và giữ cân bằng trong tình bạn lẫn tình yêu.',
    'Bài học giúp bạn nhận diện các đặc điểm của mối quan hệ lành mạnh, vượt qua sự mất cân bằng một chiều và học cách chia sẻ trách nhiệm.',
    3,
    true,
    100,
    8
);
SET @lesson3_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson3_id, 'Scarleteen - Friendship (Category)', 'https://www.scarleteen.com/read/friendship', 'website');

-- --- Micro Lesson 3.1: Các đặc điểm của một mối quan hệ lành mạnh ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Các đặc điểm của một mối quan hệ lành mạnh', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Thế nào là một mối quan hệ \"chất lượng cao\"?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Một mối quan hệ lành mạnh mang lại cho bạn cảm giác an toàn, vui vẻ và tự do là chính mình.", "Các đặc điểm cốt lõi gồm: Tôn trọng, Tin tưởng, Bình đẳng, và Giao tiếp cởi mở.", "Bạn cảm thấy được tiếp thêm năng lượng tích cực thay vì kiệt sức."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống thực tế", "body": "Hoa thích vẽ tranh cổ động, Đức luôn khích lệ bạn tham gia các cuộc thi và giúp Hoa dọn dẹp màu vẽ sau mỗi buổi học."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động của Đức thể hiện đặc điểm nào của mối quan hệ lành mạnh?", "choices": [{"text": "Sự kiểm soát và quản lý thời gian của Hoa.", "correct": false, "emoji": "🛑"}, {"text": "Sự tôn trọng sở thích cá nhân và khích lệ bạn phát triển bản thân.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Mối quan hệ hiện tại của bạn có mang lại cho bạn nhiều năng lượng tích cực không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mối quan hệ lành mạnh nâng đỡ bạn lên chứ không kéo bạn xuống."]}', 6);

-- --- Micro Lesson 3.2: Nhận diện sự bình đẳng và tôn trọng lẫn nhau ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Nhận diện sự bình đẳng và tôn trọng lẫn nhau', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bình đẳng trong tình bạn/tình yêu là như thế nào?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bình đẳng nghĩa là tiếng nói của hai bên có giá trị ngang nhau trong các quyết định chung.", "Không có ai là \"sếp\" chỉ tay năm ngón, cũng không có ai luôn phải nhún nhường.", "Quyết định đi đâu, làm gì đều dựa trên sự đồng thuận vui vẻ của cả hai."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống quyết định", "body": "Nam muốn đi ăn pizza, Hoa lại thích ăn đồ Hàn Quốc. Cả hai cùng thảo luận và quyết định hôm nay ăn pizza, tuần sau sẽ ăn đồ Hàn Quốc."}', 3),
(@ml_id, 'interaction', '{"question": "Cách giải quyết của Nam và Hoa thể hiện điều gì?", "choices": [{"text": "Sự thỏa hiệp gượng ép từ một phía.", "correct": false, "emoji": "🛑"}, {"text": "Sự bình đẳng và tôn trọng ý kiến của nhau trong các quyết định chung.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Trong nhóm bạn của bạn, các quyết định đi chơi có được đưa ra một cách bình đẳng không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bình đẳng là khi cả hai đều cảm thấy tiếng nói của mình có trọng lượng như nhau."]}', 6);

-- --- Micro Lesson 3.3: Sự bối rối khi mối quan hệ mất cân bằng ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Sự bối rối khi mối quan hệ mất cân bằng', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao biết mối quan hệ của bạn đang bị \"lệch\"?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mất cân bằng xảy ra khi một người luôn cho đi (quan tâm, nhường nhịn) còn người kia chỉ biết nhận.", "Cảm thấy mệt mỏi, ấm ức hoặc có cảm giác mình đang bị lợi dụng là tín hiệu cảnh báo.", "Mối quan hệ bền vững cần sự vun đắp và nỗ lực tương xứng từ cả hai phía."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống bất ổn", "body": "Vy luôn là người chủ động nhắn tin, hỏi han và làm bài tập hộ Nam, trong khi Nam hiếm khi chủ động nhắn tin trước hay giúp đỡ Vy chuyện gì."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên làm gì để cân bằng lại mối quan hệ này?", "choices": [{"text": "Tiếp tục chiều chuộng Nam nhiều hơn nữa để hy vọng Nam sẽ thay đổi.", "correct": false, "emoji": "🛑"}, {"text": "Gặp gỡ và chia sẻ thẳng thắn với Nam về cảm xúc của mình và mong muốn sự chủ động từ Nam.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy mình đang là người duy nhất cố gắng níu giữ một tình bạn nào đó không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mối quan hệ một chiều giống như đi xe đạp một bánh, rất mệt mỏi và dễ ngã."]}', 6);

-- --- Micro Lesson 3.4: Tình huống: Khi một người luôn phải nhượng bộ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Tình huống: Khi một người luôn phải nhượng bộ', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nhượng bộ quá nhiều có phải là cách giữ hòa khí thông minh?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nhiều bạn chọn cách nhường nhịn vô điều kiện để tránh cãi vã.", "Nhưng nhượng bộ liên tục sẽ khiến bạn đánh mất ranh giới cá nhân và tích tụ ấm ức.", "Giao tiếp lành mạnh cho phép sự bất đồng quan điểm được thảo luận một cách tôn trọng."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống nhượng bộ", "body": "Sơn thích chơi bóng rổ, nhưng bạn thân là Lâm luôn bắt Sơn đi chơi game net cùng. Sơn luôn đồng ý vì sợ Lâm giận dỗi."}', 3),
(@ml_id, 'interaction', '{"question": "Sơn nên thay đổi cách ứng xử thế nào để bảo vệ sở thích cá nhân?", "choices": [{"text": "Tiếp tục đi chơi game cùng Lâm và âm thầm ghét bỏ sở thích của Lâm.", "correct": false, "emoji": "🛑"}, {"text": "Đề xuất thẳng thắn: \"Hôm nay tụi mình chơi bóng rổ nhé, mai tớ sẽ đi chơi game cùng cậu.\".", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng từ bỏ sở thích của mình chỉ để làm vui lòng một người bạn chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không cần phải đánh mất chính mình để giữ chân một người bạn."]}', 6);

-- --- Micro Lesson 3.5: Kỹ năng: Phân chia trách nhiệm và chia sẻ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Kỹ năng: Phân chia trách nhiệm và chia sẻ', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để cùng nhau gánh vác trách nhiệm trong mối quan hệ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Trách nhiệm chia sẻ (Shared responsibility) giúp giảm tải áp lực cho cả hai.", "Từ việc lên kế hoạch bài tập nhóm đến chuẩn bị quà sinh nhật cho bạn bè.", "Hãy cùng thảo luận rõ ràng ai làm việc gì để tránh tị nạnh hay quá tải."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống làm nhóm", "body": "Trong bài tập thuyết trình, Hoa làm toàn bộ từ nội dung đến thiết kế slide, còn Tuấn chỉ nhận phần lên thuyết trình vài câu cuối."}', 3),
(@ml_id, 'interaction', '{"question": "Hoa nên làm gì để phân chia lại công việc công bằng hơn?", "choices": [{"text": "Im lặng làm hết rồi sau đó lên lớp ấm ức nói xấu Tuấn với các bạn khác.", "correct": false, "emoji": "😐"}, {"text": "Họp nhóm lại và phân chia rõ ràng: Hoa phụ trách nội dung, Tuấn thiết kế slide và cả hai cùng thuyết trình.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thường nhận hết phần việc nặng về mình vì sợ người khác làm không đúng ý không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chia sẻ trách nhiệm là biểu hiện của sự tôn trọng năng lực và thời gian của nhau."]}', 6);

-- --- Micro Lesson 3.6: Mối quan hệ của bạn có đang bình đẳng? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Mối quan hệ của bạn có đang bình đẳng?', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tự kiểm tra độ \"bình đẳng\" trong mối quan hệ của bạn!"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hãy tự hỏi bản thân những câu hỏi đơn giản để đánh giá mối quan hệ.", "Bạn có dám nói \"Không\" mà không sợ bị giận dỗi dai dẳng không?", "Tiếng nói của bạn có thực sự được lắng nghe khi cả hai bất đồng quan điểm?", "Sự thật lòng là thước đo chính xác nhất cho độ bình đẳng."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống tự kiểm tra", "body": "Mỗi lần Vy bận học không đi chơi được, Nam đều nhắn tin trách móc và chiến tranh lạnh suốt nhiều ngày khiến Vy vô cùng căng thẳng."}', 3),
(@ml_id, 'interaction', '{"question": "Mối quan hệ của Vy và Nam có đang bình đẳng không?", "choices": [{"text": "Có, vì Nam thể hiện sự nhớ nhung và muốn gặp Vy thường xuyên.", "correct": false, "emoji": "🛑"}, {"text": "Không, vì Nam đang dùng sự giận dỗi để áp đặt mong muốn của mình lên Vy.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Có ranh giới nào của bạn đang bị đối phương thường xuyên bỏ qua không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bình đẳng nghĩa là tôn trọng tự do cá nhân và ranh giới của đối phương."]}', 6);

-- --- Micro Lesson 3.7: Đúc kết: Tình yêu hay tình bạn đều cần sự cân bằng ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Đúc kết: Tình yêu hay tình bạn đều cần sự cân bằng', 7);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bí quyết để duy trì mối quan hệ lâu dài là gì?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Một mối quan hệ bền vững giống như một điệu nhảy đôi nhịp nhàng.", "Cần sự tiến lui, cho đi và nhận lại cân bằng từ cả hai phía.", "Hãy luôn trân trọng, lắng nghe và cùng nhau điều chỉnh khi có dấu hiệu lệch nhịp."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống đúc kết", "body": "Sau khi thống nhất lại cách phân chia thời gian và tôn trọng không gian riêng tư của nhau, tình bạn của Linh và Vy trở nên khăng khít và thoải mái hơn rất nhiều."}', 3),
(@ml_id, 'interaction', '{"question": "Yếu tố nào giúp mối quan hệ của Linh và Vy bền vững hơn?", "choices": [{"text": "Sự im lặng chịu đựng để giữ hòa khí bề nổi.", "correct": false, "emoji": "😐"}, {"text": "Sự đối thoại chân thành để tìm điểm cân bằng giữa nhu cầu của cả hai.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn sẽ làm gì hôm nay để thể hiện sự trân trọng đối với một mối quan hệ lành mạnh của mình?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Sự cân bằng và tôn trọng lẫn nhau là nền móng của mọi mối quan hệ bền vững."]}', 6);

-- --- Micro Lesson 3.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Xây dựng Mối quan hệ Lành mạnh''! Hãy chứng tỏ khả năng nhận diện bình đẳng trong mối quan hệ."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Khi tình bạn rạn nứt", "startNode": "step1", "nodes": {"step1": {"text": "Bạn thân rủ bạn trốn học đi xem phim, bảo: ''Thân nhau thì phải đi chứ!''. Bạn làm thế nào?", "choices": [{"text": "Đồng ý đi cùng vì sợ bạn giận dỗi.", "nextNode": "fail_step1"}, {"text": "Từ từ từ chối lịch sự và hẹn bạn cuối tuần đi cùng.", "nextNode": "step2"}]}, "step2": {"text": "Bạn thân tức giận bảo: ''Cậu coi trọng học hành hơn tớ rồi!''.", "choices": [{"text": "Tức giận cãi lại và tuyên bố nghỉ chơi.", "nextNode": "fail_step2"}, {"text": "Bày tỏ mệnh đề Tôi: ''Tớ buồn khi cậu nói thế. Tớ muốn học tốt nhưng vẫn trân trọng tình bạn này''.", "nextNode": "step3"}]}, "step3": {"text": "Bạn thân im lặng một lúc rồi bảo: ''Vậy cuối tuần đi ăn kem nữa nhé?''.", "choices": [{"text": "''Không, tớ bận rồi'' để trả đũa.", "nextNode": "fail_step3"}, {"text": "''Đồng ý luôn! Tớ sẽ bao chầu kem này''.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành xuất sắc! Bạn đã giữ được tình bạn mà vẫn bảo vệ được rèn luyện học tập!", "isEnd": true, "isSuccess": true}, "fail_step1": {"text": "❌ Thất bại! Nhượng bộ ranh giới học tập làm hại chính kết quả của bạn.", "isEnd": true, "isSuccess": false}, "fail_step2": {"text": "❌ Thất bại! Nóng giận đối đầu lập tức làm rạn nứt tình bạn.", "isEnd": true, "isSuccess": false}, "fail_step3": {"text": "❌ Thất bại! Trả đũa vụn vặt làm mất đi cơ hội làm hòa.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Kéo các hành vi vào đúng hộp Mối quan hệ lành mạnh hoặc độc hại.", "leftBox": {"title": "Mối quan hệ lành mạnh"}, "rightBox": {"title": "Mối quan hệ độc hại"}, "items": [{"text": "Khích lệ bạn tham gia câu lạc bộ yêu thích.", "correctBox": "left"}, {"text": "Cấm đoán bạn chơi với các bạn khác giới.", "correctBox": "right"}, {"text": "Lắng nghe và tôn trọng ý kiến khác biệt.", "correctBox": "left"}, {"text": "Thường xuyên dằn vặt lỗi lầm cũ của bạn.", "correctBox": "right"}, {"text": "Cùng nhau chia sẻ trách nhiệm bài tập nhóm.", "correctBox": "left"}, {"text": "Chỉ trích ngoại hình và chê bai bạn.", "correctBox": "right"}, {"text": "Tôn trọng thời gian riêng tư của nhau.", "correctBox": "left"}, {"text": "Đe dọa chia tay/nghỉ chơi để ép bạn nghe lời.", "correctBox": "right"}, {"text": "Sẵn sàng xin lỗi khi nhận ra mình sai.", "correctBox": "left"}, {"text": "Bắt bạn chịu tiền cho mọi buổi đi chơi.", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp các từ khóa với định nghĩa chính xác.", "pairs": [{"left": "Tôn trọng", "right": "Chấp nhận sự khác biệt và không áp đặt nhau."}, {"left": "Tin tưởng", "right": "An tâm về lòng trung thực của đối phương."}, {"left": "Bình đẳng", "right": "Tiếng nói của hai bên có giá trị ngang nhau."}, {"left": "Kiểm soát", "right": "Hành vi gò bó, bắt đối phương theo ý mình."}, {"left": "Thỏa hiệp", "right": "Tìm giải pháp trung hòa đáp ứng cả hai bên."}, {"left": "Cho và nhận", "right": "Sự vun đắp tương xứng từ hai phía."}, {"left": "Độc lập", "right": "Giữ không gian và sở thích riêng ngoài mối quan hệ."}, {"left": "Giao tiếp cởi mở", "right": "Chia sẻ chân thành mọi vướng mắc tinh thần."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Một mối quan hệ lành mạnh luôn được xây dựng trên nền tảng của sự [blank1] lẫn nhau. Trong tình bạn hay tình yêu, sự [blank2] đóng vai trò quan trọng khi tiếng nói của cả hai đều có giá trị ngang nhau trong mọi quyết định. Hãy cảnh giác với những hành vi [blank3] độc hại núp bóng sự lo lắng quá mức. Việc chia sẻ [blank4] trong công việc chung sẽ giúp mối quan hệ phát triển bền vững. Đừng vì sợ mất lòng mà luôn chọn cách [blank5] ranh giới cá nhân của mình.", "blanks": {"blank1": {"correct": "tôn trọng", "placeholder": "..."}, "blank2": {"correct": "bình đẳng", "placeholder": "..."}, "blank3": {"correct": "kiểm soát", "placeholder": "..."}, "blank4": {"correct": "trách nhiệm", "placeholder": "..."}, "blank5": {"correct": "nhượng bộ", "placeholder": "..."}}, "words": ["tôn trọng", "bình đẳng", "kiểm soát", "trách nhiệm", "nhượng bộ", "xúc phạm", "lợi ích", "trốn chạy", "chơi bời", "bỏ cuộc"]}', 5),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Khi mối quan hệ rơi vào trạng thái mất [blank1], một người sẽ cảm thấy kiệt sức vì luôn phải vun đắp một mình. Để hàn gắn, cả hai cần ngồi lại thực hiện đối thoại [blank2] thay vì chọn cách im lặng trừng phạt. Việc khích lệ đối phương giữ vững sự [blank3] cá nhân là cờ xanh cực kỳ chất lượng. Sự tin [blank4] sâu sắc chỉ xuất hiện khi ranh giới của mỗi người được tôn trọng. Hãy luôn nuôi dưỡng tình cảm bằng năng lượng tích [blank5] mỗi ngày.", "blanks": {"blank1": {"correct": "cân bằng", "placeholder": "..."}, "blank2": {"correct": "chân thành", "placeholder": "..."}, "blank3": {"correct": "độc lập", "placeholder": "..."}, "blank4": {"correct": "cậy", "placeholder": "..."}, "blank5": {"correct": "cực", "placeholder": "..."}}, "words": ["cân bằng", "chân thành", "độc lập", "cậy", "cực", "độc hại", "giả tạo", "phụ thuộc", "nghi ngờ", "sợ"]}', 6),
(@ml_id, 'interaction', '{"question": "Dấu hiệu nào rõ nhất của một mối quan hệ mất cân bằng?", "choices": [{"text": "Một người luôn phải nhún nhường và làm bài hộ đối phương để giữ hòa khí.", "correct": true, "emoji": "💚"}, {"text": "Cả hai cùng chia sẻ công việc làm slide thuyết trình nhóm.", "correct": false, "emoji": "🛑"}]}', 7),
(@ml_id, 'interaction', '{"question": "Bạn nên phản ứng thế nào khi thấy tình bạn đang trở thành một chiều?", "choices": [{"text": "Chia sẻ thẳng thắn với bạn về cảm giác của mình và mong muốn sự cố gắng từ hai phía.", "correct": true, "emoji": "💚"}, {"text": "Tự trách bản thân mình chưa làm đủ tốt và tiếp tục chiều chuộng bạn.", "correct": false, "emoji": "🛑"}]}', 8),
(@ml_id, 'interaction', '{"question": "''Cờ xanh'' chất lượng nhất trong tình yêu tuổi học trò là gì?", "choices": [{"text": "Khích lệ nhau cùng tiến bộ trong học tập và tôn trọng các bạn bè khác.", "correct": true, "emoji": "💚"}, {"text": "Yêu cầu người yêu ngắt kết nối với tất cả bạn bè cũ.", "correct": false, "emoji": "🛑"}]}', 9),
(@ml_id, 'interaction', '{"question": "Tại sao nhượng bộ ranh giới liên tục lại nguy hiểm?", "choices": [{"text": "Vì nó làm bạn tích tụ ấm ức và đánh mất đi giá trị riêng của mình.", "correct": true, "emoji": "💚"}, {"text": "Vì nó giúp mối quan hệ luôn êm ấm không bao giờ cãi vã.", "correct": false, "emoji": "🛑"}]}', 10),
(@ml_id, 'interaction', '{"question": "Đích đến của sự bình đẳng trong mối quan hệ là gì?", "choices": [{"text": "Cả hai đều thấy mình được tôn trọng và an tâm là chính mình.", "correct": true, "emoji": "💚"}, {"text": "Một người được quyền quyết định đi chơi ở đâu mọi lúc.", "correct": false, "emoji": "🛑"}]}', 11);

-- =========================================================================
-- BÀI HỌC 4: Ranh giới, Tôn trọng & Niềm tin
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'ranh-gioi-ton-trong-niem-tin',
    'Ranh giới, Tôn trọng & Niềm tin',
    'Thiết lập ranh giới riêng tư, tôn trọng giới hạn của bạn bè và bảo vệ bản thân khi nói Không.',
    'Bài học trang bị kỹ năng thiết lập ranh giới thể chất, thông tin cá nhân và thời gian riêng tư mà không thấy tội lỗi áy náy vô lý.',
    4,
    true,
    100,
    8
);
SET @lesson4_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson4_id, 'Scarleteen - Intimacy: The Whys, Hows, How-Nots, and So-Nots', 'https://www.scarleteen.com/read/intimacy-whys-hows-how-nots-and-so-nots', 'website');

-- --- Micro Lesson 4.1: Ranh giới cá nhân là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Ranh giới cá nhân là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Ranh giới cá nhân có phải là bức tường ngăn cách mọi người?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Ranh giới cá nhân không phải là bức tường xây lên để cô lập bản thân.", "Đó là đường biên giới vô hình chỉ ra điều gì khiến bạn thấy thoải mái và điều gì thì không.", "Ranh giới có thể ở nhiều khía cạnh: Thể chất, Thời gian, Cảm xúc, hay Thông tin riêng tư."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống thực tế", "body": "Vy không thích người khác tự ý dùng đồ trang điểm của mình. Khi bạn cùng phòng tự tiện lấy son của Vy dùng, Vy cảm thấy rất khó chịu."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động tự ý dùng son của bạn cùng phòng đã chạm vào ranh giới nào của Vy?", "choices": [{"text": "Ranh giới về mặt thời gian và công việc của Vy.", "correct": false, "emoji": "🛑"}, {"text": "Ranh giới về mặt sở hữu tài sản cá nhân và không gian riêng tư của Vy.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Ranh giới cá nhân nào là quan trọng nhất đối với bạn ở thời điểm hiện tại?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Ranh giới cá nhân giúp người khác hiểu cách đối xử tôn trọng đối với bạn."]}', 6);

-- --- Micro Lesson 4.2: Làm sao nhận diện ranh giới của người khác? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Làm sao nhận diện ranh giới của người khác?', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để không vô tình trở thành kẻ xâm phạm ranh giới?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đừng tự suy diễn rằng đối phương thoải mái với những gì bạn làm.", "Hãy quan sát ngôn ngữ cơ thể (né tránh ánh mắt, lùi lại, cười gượng) hoặc hỏi trực tiếp.", "Câu hỏi thần chú: \"Tớ làm thế này cậu có thấy thoải mái không?\"."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống giao tiếp", "body": "Nam muốn khoác vai Mai khi hai bạn đang đi dạo, nhưng thấy Mai hơi co vai lại và bước lùi sang một bên."}', 3),
(@ml_id, 'interaction', '{"question": "Nam nên phản ứng thế nào trước tín hiệu từ cơ thể của Mai?", "choices": [{"text": "Tiếp tục khoác vai mạnh hơn vì nghĩ Mai chỉ đang ngượng ngùng.", "correct": false, "emoji": "🛑"}, {"text": "Thu tay lại lịch sự và hỏi nhẹ nhàng xem Mai có thấy thoải mái không.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng vô tình làm ai đó khó chịu vì đùa nghịch quá trớn chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tôn trọng ranh giới của người khác bắt đầu từ việc lắng nghe và quan sát tinh tế."]}', 6);

-- --- Micro Lesson 4.3: Tại sao thiết lập ranh giới lại gây cảm giác tội lỗi? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Tại sao thiết lập ranh giới lại gây cảm giác tội lỗi?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao nói \"Không\" lại khiến tụi mình thấy cắn rứt lương tâm?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chúng ta thường được dạy phải luôn chia sẻ, giúp đỡ và làm người khác vui lòng.", "Tâm lý sợ bị coi là ích kỷ hay làm rạn nứt tình cảm khiến việc từ chối trở nên khó khăn.", "Hãy nhớ: Đặt ranh giới là bạn đang bảo vệ năng lượng của mình để có thể yêu thương lành mạnh."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống lý thú", "body": "Hoa rất mệt sau buổi học và muốn về nhà nghỉ ngơi, nhưng bạn thân lại năn nỉ đi mua sắm cùng. Hoa thấy rất áy náy nếu từ chối."}', 3),
(@ml_id, 'interaction', '{"question": "Hoa nên nghĩ thế nào để vượt qua cảm giác tội lỗi vô lý này?", "choices": [{"text": "Tự trách mình là một người bạn tồi tệ vì không đi chơi cùng bạn thân.", "correct": false, "emoji": "🛑"}, {"text": "Hiểu rằng nghỉ ngơi khi cơ thể mệt mỏi là quyền cơ bản và cần thiết để tái tạo năng lượng.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thường cảm thấy áy náy khi phải từ chối lời nhờ vả của bạn bè không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không có trách nhiệm phải làm hài lòng tất cả mọi người bằng cách bỏ qua cảm xúc của chính mình."]}', 6);

-- --- Micro Lesson 4.4: Tình huống: Khi bạn thân đòi xem tin nhắn riêng tư ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Tình huống: Khi bạn thân đòi xem tin nhắn riêng tư', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn thân có quyền biết tất cả bí mật của bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tình bạn thân thiết không đồng nghĩa với việc chia sẻ 100% không gian riêng tư.", "Tin nhắn chat, nhật ký, tài khoản mạng xã hội là ranh giới thông tin cá nhân.", "Bạn hoàn toàn có quyền giữ lại những khoảng không gian riêng tư cho riêng mình."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống ranh giới", "body": "Lâm giật điện thoại của Sơn đòi đọc tin nhắn chat của Sơn với một bạn nữ cùng lớp, bảo rằng: \"Thân nhau thế mà lại giấu à?\"."}', 3),
(@ml_id, 'interaction', '{"question": "Sơn nên bảo vệ ranh giới của mình thế nào?", "choices": [{"text": "Để Lâm đọc hết vì sợ Lâm giận dỗi và bảo mình không tin tưởng bạn.", "correct": true, "emoji": "💚"}, {"text": "Lấy lại điện thoại ôn hòa nhưng dứt khoát: \"Tụi mình thân nhau nhưng chuyện tin nhắn này là riêng tư của tớ, mong cậu tôn trọng nhé.\".", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Có giới hạn riêng tư nào bạn tuyệt đối không muốn bạn bè chạm vào không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tin tưởng nhau không nghĩa là phải phơi bày toàn bộ cuộc sống riêng tư của mình."]}', 6);

-- --- Micro Lesson 4.5: Kỹ năng: Thiết lập giới hạn mềm mỏng nhưng cứng rắn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Kỹ năng: Thiết lập giới hạn mềm mỏng nhưng cứng rắn', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để đặt ranh giới mà không gây gổ cãi vã?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Dùng công thức 3 bước: Thừa nhận mối quan hệ + Bày tỏ ranh giới rõ ràng + Đề xuất giải pháp thay thế.", "Giọng điệu bình tĩnh, ôn hòa nhưng biểu cảm dứt khoát, không ngập ngừng áy náy.", "Thực hành nhiều lần sẽ giúp bạn nói \"Không\" một cách tự tin hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống thực hành", "body": "Bạn rủ bạn trốn tiết đi chơi game, nhưng bạn muốn ở lại ôn thi học kỳ."}', 3),
(@ml_id, 'interaction', '{"question": "Câu nói nào áp dụng đúng kỹ năng thiết lập giới hạn lành mạnh nhất?", "choices": [{"text": "\"Thôi đi làm gì, học đi chứ lười thế!\".", "correct": false, "emoji": "🛑"}, {"text": "\"Tớ rất muốn đi chơi với cậu, nhưng tuần này tớ cần tập trung ôn thi học kỳ. Thi xong tụi mình cùng đi nhé!\".", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Lần gần nhất bạn từ chối thành công một việc mà vẫn giữ được tình cảm là khi nào?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đặt ranh giới rõ ràng là biểu hiện của việc bạn coi trọng mối quan hệ lâu dài."]}', 6);

-- --- Micro Lesson 4.6: Bạn từng thấy khó khăn khi nói "Không"? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Bạn từng thấy khó khăn khi nói "Không"?', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nói \"Không\" có làm bạn trở thành người ích kỷ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hãy từ bỏ suy nghĩ nói \"Không\" là ích kỷ hay từ chối tình cảm của đối phương.", "Thực chất, nói \"Không\" với những điều bạn không muốn giúp bạn nói \"Có\" đầy nhiệt huyết với những điều bạn thực sự trân trọng.", "Ranh giới rõ ràng tạo nên sự tôn trọng lành mạnh giữa hai bên."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống suy ngẫm", "body": "Vy đồng ý làm bài tập hộ Nam dù cô đang rất bận ôn thi, chỉ vì sợ Nam sẽ nghĩ mình ích kỷ. Sau đó Vy thi trượt vì thiếu thời gian ôn bài."}', 3),
(@ml_id, 'interaction', '{"question": "Hậu quả của việc Vy không dám nói \"Không\" là gì?", "choices": [{"text": "Vy được Nam yêu quý hơn và mối quan hệ trở nên vô cùng tốt đẹp.", "correct": true, "emoji": "💚"}, {"text": "Vy tự gây tổn hại đến kết quả học tập và năng lượng của chính mình.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy mệt mỏi khi luôn phải gật đầu đồng ý với mọi yêu cầu của bạn bè không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Nói \"Không\" khi cần thiết là cách bạn tự bảo vệ và trân trọng giá trị của bản thân."]}', 6);

-- --- Micro Lesson 4.7: Đúc kết: Ranh giới giúp tình bạn bền vững hơn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Đúc kết: Ranh giới giúp tình bạn bền vững hơn', 7);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Lợi ích lớn nhất của ranh giới cá nhân là gì?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Ranh giới cá nhân rõ ràng giúp loại bỏ những hiểu lầm, ấm ức và tị nạnh ngầm.", "Khi cả hai đều biết giới hạn của nhau, tụi mình sẽ hành xử tôn trọng và an tâm hơn.", "Niềm tin sâu sắc chỉ được xây dựng khi ranh giới của mỗi người được tôn trọng tuyệt đối."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống đúc kết", "body": "Sau khi thống nhất rõ ràng về thời gian riêng tư và ranh giới đồ đạc cá nhân, tình bạn giữa Hoa và Vy trở nên bền vững và thoải mái hơn bao giờ hết."}', 3),
(@ml_id, 'interaction', '{"question": "Chìa khóa giúp tình bạn của Hoa và Vy thăng hoa là gì?", "choices": [{"text": "Sự nhường nhịn mù quáng và không bao giờ nói ra những khó chịu của mình.", "correct": false, "emoji": "😐"}, {"text": "Sự thiết lập và tôn trọng ranh giới cá nhân rõ ràng từ cả hai phía.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn sẽ thảo luận ranh giới cá nhân nào với người bạn thân của mình trong tuần này?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Ranh giới rõ ràng tạo nên sự tôn trọng bền vững và nuôi dưỡng tình bạn đích thực."]}', 6);

-- --- Micro Lesson 4.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Ranh giới, Tôn trọng & Niềm tin''! Hãy cùng bảo vệ ranh giới cá nhân nhé."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Đường biên giới vô hình", "startNode": "step1", "nodes": {"step1": {"text": "Bạn thân đột ngột lấy trộm nhật ký của bạn đọc trộm rồi cười: ''Thân nhau có gì phải giấu!''. Bạn làm sao?", "choices": [{"text": "Cười trừ cho qua chuyện vì ngại làm bạn buồn.", "nextNode": "fail_step1"}, {"text": "Dứt khoát lấy lại nhật ký và bảo vệ ranh giới riêng tư.", "nextNode": "step2"}]}, "step2": {"text": "Bạn thân giận dỗi bảo: ''Cậu ích kỷ thế, có tí nhật ký cũng giấu''.", "choices": [{"text": "Cãi nhau lớn tiếng bảo bạn là kẻ vô giáo dục.", "nextNode": "fail_step2"}, {"text": "Giải thích ôn hòa: ''Tớ rất quý cậu, nhưng nhật ký là không gian riêng tư của tớ. Tớ cần cậu tôn trọng điều đó''.", "nextNode": "step3"}]}, "step3": {"text": "Bạn thân vẫn lầm bầm tức giận và không nói chuyện suốt cả buổi học.", "choices": [{"text": "Sợ quá nên đưa nhật ký cho bạn đọc để xin lỗi.", "nextNode": "fail_step3"}, {"text": "Cho bạn thời gian suy nghĩ, kiên định giữ vững ranh giới.", "nextNode": "step4"}]}, "step4": {"text": "Hôm sau bạn thân nguôi giận và chủ động xin lỗi vì đã lục lọi đồ riêng của bạn.", "choices": [{"text": "Tiếp tục giận dỗi để trả đũa bạn.", "nextNode": "fail_step4"}, {"text": "Mở lòng tha thứ và khẳng định lại tình bạn bền vững.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành xuất sắc! Bạn đã bảo vệ thành công ranh giới riêng tư mà vẫn giữ được sự tôn trọng!", "isEnd": true, "isSuccess": true}, "fail_step1": {"text": "❌ Thất bại! Để bạn lục lọi đồ riêng tư làm mất ranh giới cá nhân.", "isEnd": true, "isSuccess": false}, "fail_step2": {"text": "❌ Thất bại! Xúc phạm cá nhân chỉ làm mâu thuẫn bùng phát dữ dội.", "isEnd": true, "isSuccess": false}, "fail_step3": {"text": "❌ Thất bại! Nhượng bộ phút chót làm mất đi giá trị ranh giới bạn vừa đặt ra.", "isEnd": true, "isSuccess": false}, "fail_step4": {"text": "❌ Thất bại! Trả đũa làm hỏng cơ hội làm hòa quý giá.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành vi vào đúng hộp Tôn trọng ranh giới hoặc Xâm phạm ranh giới.", "leftBox": {"title": "Tôn trọng ranh giới"}, "rightBox": {"title": "Xâm phạm ranh giới"}, "items": [{"text": "Hỏi ý kiến trước khi chạm vào tóc hay vai bạn.", "correctBox": "left"}, {"text": "Tự tiện lục lọi cặp sách của bạn để lấy bút.", "correctBox": "right"}, {"text": "Nhấp nhận lời từ chối đi chơi của bạn một cách vui vẻ.", "correctBox": "left"}, {"text": "Giật điện thoại của bạn đòi xem tin nhắn riêng tư.", "correctBox": "right"}, {"text": "Gõ cửa trước khi vào phòng riêng của bạn.", "correctBox": "left"}, {"text": "Ép buộc bạn phải chia sẻ mật khẩu tài khoản mạng xã hội.", "correctBox": "right"}, {"text": "Tôn trọng sở thích ăn uống khác biệt của bạn.", "correctBox": "left"}, {"text": "Ôm chầm lấy bạn khi thấy bạn đang co vai né tránh.", "correctBox": "right"}, {"text": "Giữ khoảng cách giao tiếp lịch sự nơi công cộng.", "correctBox": "left"}, {"text": "Nói xấu bạn sau lưng khi bị bạn từ chối.", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp ranh giới và định nghĩa phù hợp.", "pairs": [{"left": "Ranh giới thể chất", "right": "Giới hạn về đụng chạm cơ thể và khoảng cách an toàn."}, {"left": "Ranh giới thông tin", "right": "Quyền bảo mật tin nhắn, nhật ký và tài khoản."}, {"left": "Ranh giới thời gian", "right": "Giới hạn về lịch trình học tập và nghỉ ngơi riêng."}, {"left": "Nói Không", "right": "Quyền từ chối những điều khiến bản thân uncomfy."}, {"left": "Linh cảm", "right": "Chiếc ra-đa báo động cơ thể khi ranh giới bị đe dọa."}, {"left": "Đồng thuận F.R.I.E.S", "right": "Nguyên tắc đồng ý tự nguyện và có thể thay đổi."}, {"left": "Sự tôn trọng", "right": "Việc thừa nhận quyền tự do cá nhân của đối phương."}, {"left": "Lòng tin", "right": "Sự an tâm được xây dựng từ việc tôn trọng giới hạn."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Ranh giới cá nhân là giới hạn đỏ giúp bạn bảo vệ sự an [blank1] của chính mình. Thiết lập ranh giới không phải là hành vi ích kỷ, mà là cách giúp người khác hiểu cách [blank2] bạn. Khi ai đó tự ý đụng chạm cơ thể hoặc lục lọi đồ riêng tư, cơ thể bạn sẽ phát đi tín hiệu báo [blank3] qua linh cảm. Hãy kiên định nói lời từ [blank4] dứt khoát trước những hành vi gây uncomfy. Tôn trọng ranh giới của đối phương là bước đầu tiên để xây dựng lòng [blank5] sâu sắc.", "blanks": {"blank1": {"correct": "toàn", "placeholder": "..."}, "blank2": {"correct": "tôn trọng", "placeholder": "..."}, "blank3": {"correct": "động", "placeholder": "..."}, "blank4": {"correct": "chối", "placeholder": "..."}, "blank5": {"correct": "tin", "placeholder": "..."}}, "words": ["toàn", "tôn trọng", "động", "chối", "tin", "hại", "thường", "nghi ngờ", "nhượng bộ", "chấp nhận"]}', 5),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Trong tình bạn thân thiết, việc giữ lại khoảng không gian riêng [blank1] là quyền chính đáng của mỗi người. Việc đòi hỏi xem tin nhắn hay chia sẻ [blank2] tài khoản thể hiện sự thiếu tin tưởng độc hại. Bạn hoàn toàn có quyền nói không mà không cần cảm thấy [blank3] lỗi vô lý. Sự đồng ý hay đồng [blank4] phải luôn dựa trên tinh thần tự nguyện và có thể thay đổi bất cứ lúc nào. Một tình bạn bền vững chỉ tồn tại khi ranh giới của nhau được giữ [blank5].", "blanks": {"blank1": {"correct": "tư", "placeholder": "..."}, "blank2": {"correct": "mật khẩu", "placeholder": "..."}, "blank3": {"correct": "tội", "placeholder": "..."}, "blank4": {"correct": "thuận", "placeholder": "..."}, "blank5": {"correct": "vững", "placeholder": "..."}}, "words": ["tư", "mật khẩu", "tội", "thuận", "vững", "chung", "hình ảnh", "án", "phá", "lỏng"]}', 6),
(@ml_id, 'interaction', '{"question": "Khi bạn thân muốn xem nhật ký cá nhân của bạn, cách xử lý nào đúng đắn?", "choices": [{"text": "Nhẹ nhàng từ chối và giải thích nhật ký là không gian riêng tư của bạn.", "correct": true, "emoji": "💚"}, {"text": "Đưa cho bạn đọc vì sợ bạn nghĩ mình giấu giếm chuyện xấu.", "correct": false, "emoji": "🛑"}]}', 7),
(@ml_id, 'interaction', '{"question": "Tại sao đặt ranh giới cá nhân lại giúp tình bạn bền vững hơn?", "choices": [{"text": "Vì nó giúp hai bạn hiểu rõ giới hạn của nhau để tránh gây tổn thương.", "correct": true, "emoji": "💚"}, {"text": "Vì nó tạo ra khoảng cách lớn khiến hai bạn ít cãi nhau hơn.", "correct": false, "emoji": "🛑"}]}', 8),
(@ml_id, 'interaction', '{"question": "Biểu hiện nào là cờ xanh tôn trọng ranh giới thể chất?", "choices": [{"text": "Luôn hỏi ý kiến trước khi ôm hoặc khoác vai bạn bè.", "correct": true, "emoji": "💚"}, {"text": "Ôm chặt bạn khi bạn đang cố đẩy ra để trêu đùa.", "correct": false, "emoji": "🛑"}]}', 9),
(@ml_id, 'interaction', '{"question": "Bạn nên làm gì nếu cảm thấy áy náy khi nói ''Không'' với lời nhờ vả quá sức?", "choices": [{"text": "Hiểu rằng từ chối khi quá tải là tự bảo vệ sức khỏe và năng lượng cá nhân.", "correct": true, "emoji": "💚"}, {"text": "Cố gắng làm hộ bạn rồi ấm ức đổ bệnh.", "correct": false, "emoji": "🛑"}]}', 10),
(@ml_id, 'interaction', '{"question": "Nguyên tắc F.R.I.E.S của đồng thuận nhấn mạnh điều gì?", "choices": [{"text": "Sự đồng ý phải tự nguyện, tỉnh táo, rõ ràng và có thể rút lại bất cứ lúc nào.", "correct": true, "emoji": "💚"}, {"text": "Sự đồng ý một lần sẽ có giá trị mãi mãi trong mọi trường hợp sau này.", "correct": false, "emoji": "🛑"}]}', 11);

-- =========================================================================
-- BÀI HỌC 5: Kỹ năng Giải quyết Xung đột
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'ky-nang-giai-quyet-xung-dot',
    'Kỹ năng Giải quyết Xung đột',
    'Hạ nhiệt cơn giận để đối thoại, tránh chiến tranh lạnh độc hại và cộng tác tháo gỡ mâu thuẫn.',
    'Bài học hướng dẫn quy tắc dừng lại kiểm soát cơn giận, tác hại của im lặng trừng phạt và cách đứng về một phía để giải quyết vấn đề chung.',
    5,
    true,
    100,
    8
);
SET @lesson5_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson5_id, 'Scarleteen - Should I Stay or Should I Go?', 'https://www.scarleteen.com/read/relationships/should-i-stay-or-should-i-go', 'website');

-- --- Micro Lesson 5.1: Xung đột là một phần tất yếu của mối quan hệ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Xung đột là một phần tất yếu của mối quan hệ', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Cãi nhau có phải là dấu hiệu của việc sắp chia tay/nghỉ chơi?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bất đồng quan điểm là hoàn toàn tự nhiên khi hai người có cá tính khác nhau ở cạnh nhau.", "Không phải cứ cãi nhau là mối quan hệ tồi tệ.", "Quan trọng là cách tụi mình đối mặt và giải quyết bất đồng đó như thế nào."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống thực tế", "body": "Vy và Hoa cãi nhau nảy lửa chỉ vì bất đồng ý kiến về địa điểm đi dã ngoại cuối tuần của lớp. Cả hai đều rất tức giận."}', 3),
(@ml_id, 'interaction', '{"question": "Bất đồng này nên được nhìn nhận thế nào cho lành mạnh?", "choices": [{"text": "Là dấu hiệu cho thấy tình bạn của hai người đã đến hồi kết thúc.", "correct": false, "emoji": "🛑"}, {"text": "Là cơ hội để cả hai cùng lắng nghe quan điểm khác biệt và tìm điểm chung.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Lần gần nhất bạn cãi nhau với bạn thân là về chuyện gì và hai bạn đã làm hòa thế nào?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Xung đột là bình thường, cách tụi mình ứng xử trước xung đột mới quyết định mối quan hệ."]}', 6);

-- --- Micro Lesson 5.2: Nhận diện phong cách giải quyết xung đột của bạn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Nhận diện phong cách giải quyết xung đột của bạn', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn là \"chiến thần đối đầu\" hay \"kẻ trốn chạy\" khi có cự cãi?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Có người lập tức xù lông tranh cãi để giành phần thắng (Phong cách Đối đầu).", "Có người chọn cách im lặng, né tránh hoặc chặn liên lạc (Phong cách Né tránh).", "Giao tiếp lành mạnh hướng tới phong cách Cộng tác: Cùng ngồi lại tìm giải pháp chung."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống ứng xử", "body": "Khi Quân góp ý về việc Huy làm bài tập nhóm muộn, Huy lập tức lớn tiếng quát tháo và bỏ về giữa chừng."}', 3),
(@ml_id, 'interaction', '{"question": "Huy đang thể hiện phong cách giải quyết xung đột nào?", "choices": [{"text": "Phong cách Cộng tác và tìm kiếm giải pháp thắng - thắng.", "correct": false, "emoji": "🛑"}, {"text": "Phong cách Đối đầu tiêu cực và né tránh giải quyết vấn đề trực diện.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Khi có mâu thuẫn, phản xạ tự nhiên đầu tiên của bạn là gì?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Nhận diện phản xạ của bản thân là bước đầu tiên để rèn luyện kỹ năng kiểm soát cơn giận."]}', 6);

-- --- Micro Lesson 5.3: Cơn giận dữ cản trở lý trí thế nào? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Cơn giận dữ cản trở lý trí thế nào?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao tụi mình thường nói những câu gây tổn thương sâu sắc khi giận dữ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Khi tức giận, phần não cảm xúc (hạch hạnh nhân) sẽ tạm thời kiểm soát não bộ, khóa chặt lý trí.", "Mọi lời nói phát ra lúc này thường mang tính tấn công và hủy hoại mối quan hệ.", "Đừng bao giờ giải quyết xung đột hay đưa ra quyết định khi cơn giận đang ở đỉnh điểm."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống căng thẳng", "body": "Vy phát hiện Nam quên hẹn đi chơi phim. Trong cơn giận dữ tột độ, Vy nhắn tin sỉ nhục Nam là kẻ vô tích sự và tồi tệ."}', 3),
(@ml_id, 'interaction', '{"question": "Hậu quả của việc Vy nhắn tin trong cơn giận dữ là gì?", "choices": [{"text": "Giúp Nam nhận ra lỗi lầm và lập tức sửa đổi một cách vui vẻ.", "correct": false, "emoji": "🛑"}, {"text": "Gây tổn thương nghiêm trọng đến lòng tự trọng của Nam và làm rạn nứt mối quan hệ.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng nói lời hối hận nào trong một cơn giận dữ chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơn giận chỉ kéo dài vài phút, nhưng lời nói lúc giận có thể gây tổn thương cả đời."]}', 6);

-- --- Micro Lesson 5.4: Tình huống: Cuộc tranh cãi nảy lửa vì một chuyện nhỏ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Tình huống: Cuộc tranh cãi nảy lửa vì một chuyện nhỏ', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để dập tắt ngọn lửa tranh cãi khi câu chuyện bắt đầu đi quá xa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Khi thấy cuộc nói chuyện bắt đầu xuất hiện tiếng quát tháo hay chỉ trích cá nhân.", "Hãy chủ động đề xuất tạm dừng: \"Tụi mình đều đang nóng giận, hãy nghỉ 15 phút rồi nói tiếp nhé\".", "Khoảng nghỉ giúp phần não lý trí hoạt động trở lại để tìm giải pháp ôn hòa."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống mâu thuẫn", "body": "Trong buổi thảo luận nhóm, Linh và Tuấn liên tục cướp lời và lớn tiếng chỉ trích ý kiến của nhau trước mặt cả nhóm."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động nào của nhóm trưởng là sáng suốt nhất lúc này?", "choices": [{"text": "Để hai bạn tiếp tục cãi nhau xem ai là người lý lẽ hơn.", "correct": false, "emoji": "🛑"}, {"text": "Yêu cầu cả hai tạm dừng thảo luận, nghỉ giải lao 10 phút để uống nước và bình tĩnh lại.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có dám là người đầu tiên nói câu \"Hãy tạm dừng một chút\" khi thấy cuộc cãi vã căng thẳng không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tạm dừng cuộc cãi vã khi nóng giận là biểu hiện của sự thông minh và trưởng thành."]}', 6);

-- --- Micro Lesson 5.5: Kỹ năng: 3 bước hạ nhiệt cơn giận để đối thoại ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Kỹ năng: 3 bước hạ nhiệt cơn giận để đối thoại', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để kiểm soát con quái vật giận dữ bên trong bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bước 1: **Dừng lại** - Không nói, không nhắn tin, hít thở sâu 3 nhịp.", "Bước 2: **Gọi tên cảm xúc** - Tự nhủ: \"Mình đang rất giận dữ vì việc này\".", "Bước 3: **Chuyển hướng** - Đi rửa mặt bằng nước lạnh hoặc đi dạo vài phút trước khi nói chuyện.", "Thực hiện đúng 3 bước này giúp bạn giành lại quyền kiểm soát hành vi từ cơn giận."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống thực tế", "body": "Sơn phát hiện bạn thân tự ý mượn xe đạp của mình mà không hỏi trước. Sơn cảm thấy máu nóng bốc lên mặt và muốn đấm bạn."}', 3),
(@ml_id, 'interaction', '{"question": "Sơn nên thực hiện kỹ năng nào để xử lý cơn giận lành mạnh?", "choices": [{"text": "Lao vào quát mắng và đẩy ngã bạn để đòi lại xe ngay lập tức.", "correct": false, "emoji": "🛑"}, {"text": "Dừng lại, hít thở sâu, tự nhủ mình đang giận, đi rửa mặt rồi mới ra hỏi chuyện bạn một cách bình tĩnh.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Kỹ thuật nào giúp bạn bình tĩnh lại nhanh nhất khi cảm thấy tức giận?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Kiểm soát cơn giận là cách bạn làm chủ bản thân, không để cảm xúc nhất thời dẫn dắt hành vi."]}', 6);

-- --- Micro Lesson 5.6: Cách bạn thường làm khi giận dỗi là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Cách bạn thường làm khi giận dỗi là gì?', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Hành vi giận dỗi của bạn có đang vô tình gây độc hại?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hãy trung thực đánh giá cách bạn ứng xử khi giận dỗi bạn bè hay người thân.", "Có phải bạn thường chặn Facebook, hủy kết bạn, hoặc im lặng phớt lờ họ không?", "Những hành vi này là biểu hiện của sự thiếu chín chắn và làm tổn thương lòng tin.", "Hãy học cách nói thẳng cảm xúc của mình thay vì dùng chiêu trò trừng phạt cảm xúc."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống suy ngẫm", "body": "Hoa giận Lâm nên đã lập tức hủy kết bạn, chặn số điện thoại và đăng status ẩn ý nói xấu Lâm trên trang cá nhân."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động của Hoa có giúp giải quyết mâu thuẫn không?", "choices": [{"text": "Có, vì nó bắt Lâm phải nhận ra lỗi lầm và đi tìm Hoa xin lỗi.", "correct": true, "emoji": "💚"}, {"text": "Không, nó chỉ đẩy mâu thuẫn đi xa hơn và chặn đứng cơ hội đối thoại ôn hòa.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng dùng sự im lặng hay mạng xã hội để trừng phạt cảm xúc của ai đó chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Giao tiếp trực diện, chân thành là cách duy nhất để tháo gỡ mâu thuẫn tận gốc."]}', 6);

-- --- Micro Lesson 5.7: Đúc kết: Đối thoại thay vì đối đầu ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Đúc kết: Đối thoại thay vì đối đầu', 7);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để cùng nhau vượt qua giông bão mâu thuẫn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hãy nhớ công thức: **Bạn + Đối phương vs. Vấn đề**, không phải **Bạn vs. Đối phương**.", "Xung đột được giải quyết triệt để khi cả hai cùng đứng về một phía để giải quyết vấn đề chung.", "Tôn trọng, lắng nghe và cùng thỏa hiệp là chìa khóa tháo gỡ mọi nút thắt."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống đúc kết", "body": "Sau khi cùng ngồi lại, lắng nghe khó khăn của nhau và thống nhất phương án làm bài tập nhóm mới, tình bạn của Đức và Mai đã khôi phục và bền chặt hơn trước."}', 3),
(@ml_id, 'interaction', '{"question": "Tư duy đúng đắn giúp Đức và Mai giải quyết mâu thuẫn thành công là gì?", "choices": [{"text": "Đức cố gắng chứng minh lỗi hoàn toàn thuộc về Mai.", "correct": false, "emoji": "🛑"}, {"text": "Cả hai cùng đứng về một phía, coi mâu thuẫn là vấn đề chung cần cùng nhau giải quyết.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn sẽ áp dụng tư duy \"cùng giải quyết vấn đề\" này vào mâu thuẫn nào của mình trong tuần này?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đối thoại tôn trọng và tư duy cộng tác biến xung đột thành cơ hội để thấu hiểu nhau hơn."]}', 6);

-- --- Micro Lesson 5.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Kỹ năng Giải quyết Xung đột''! Cùng tháo gỡ mâu thuẫn bằng tư duy cộng tác nhé."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Hạ nhiệt cơn giận", "startNode": "step1", "nodes": {"step1": {"text": "Bạn phát hiện bạn cùng nhóm quên làm phần thuyết trình khiến nhóm bị điểm kém. Bạn rất muốn mắng bạn. Bạn làm sao?", "choices": [{"text": "Lập tức gọi điện quát mắng bạn là kẻ lười biếng, vô trách nhiệm.", "nextNode": "fail_step1"}, {"text": "Áp dụng quy tắc dừng lại, hít thở sâu 3 nhịp để bình tĩnh.", "nextNode": "step2"}]}, "step2": {"text": "Sau khi bình tĩnh, bạn gọi điện hỏi lý do một cách ôn hòa. Bạn đó bảo: ''Tớ bị ốm nằm viện suốt 3 ngày''.", "choices": [{"text": "Tiếp tục trách móc: ''Ốm thì cũng phải nhắn tin một câu chứ!''.", "nextNode": "fail_step2"}, {"text": "Thấu cảm: ''Ôi vậy hả, cậu đỡ hơn chưa? Sức khỏe quan trọng hơn, bài nhóm để tụi mình tính sau''.", "nextNode": "step3"}]}, "step3": {"text": "Bạn đó cảm động và đề xuất xin thầy giáo cho nộp bù vào ngày mai và bạn ấy sẽ tự làm slide chỉnh sửa.", "choices": [{"text": "Từ chối nộp bù và bắt bạn ấy chịu điểm kém một mình.", "nextNode": "fail_step3"}, {"text": "Đồng ý cùng nộp bù và phân công lại công việc hợp lý.", "nextNode": "step4"}]}, "step4": {"text": "Thầy giáo đồng ý cho nộp bù. Nhưng bạn đó lại lo lắng slide thiết kế chưa đẹp.", "choices": [{"text": "Bảo: ''Đã ốm rồi thì làm slide làm gì cho xấu ra''.", "nextNode": "fail_step4"}, {"text": "''Cậu cứ làm nội dung đi, tớ hỗ trợ chỉnh sửa slide cho đẹp''.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành xuất sắc! Bạn đã giải quyết xung đột bằng sự thấu cảm và cộng tác tuyệt vời!", "isEnd": true, "isSuccess": true}, "fail_step1": {"text": "❌ Thất bại! Quát mắng trong cơn giận làm tổn thương người bạn đang ốm nặng.", "isEnd": true, "isSuccess": false}, "fail_step2": {"text": "❌ Thất bại! Thiếu thấu cảm trước bệnh tật của bạn làm rạn nứt tình bạn nghiêm trọng.", "isEnd": true, "isSuccess": false}, "fail_step3": {"text": "❌ Thất bại! Trừng phạt điểm số làm mất đi cơ hội sửa sai và giải quyết bài nhóm.", "isEnd": true, "isSuccess": false}, "fail_step4": {"text": "❌ Thất bại! Chê bai năng lực của bạn lúc khó khăn làm mất đi tinh thần đồng đội.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Kéo các hành vi giải quyết xung đột vào đúng hộp Lành mạnh hoặc Độc hại.", "leftBox": {"title": "Lành mạnh (Green Flag)"}, "rightBox": {"title": "Độc hại (Red Flag)"}, "items": [{"text": "Đề xuất tạm dừng cuộc họp để hạ nhiệt cơn giận.", "correctBox": "left"}, {"text": "Quát to tiếng át tiếng nói của đối phương.", "correctBox": "right"}, {"text": "Lắng nghe toàn bộ lý lẽ của bạn trước khi phản hồi.", "correctBox": "left"}, {"text": "Hủy kết bạn và chặn liên lạc mạng xã hội.", "correctBox": "right"}, {"text": "Tập trung giải quyết vấn đề chung của nhóm.", "correctBox": "left"}, {"text": "Chỉ trích lỗi lầm cũ không liên quan.", "correctBox": "right"}, {"text": "Sử dụng mệnh đề Tôi để bày tỏ bức xúc.", "correctBox": "left"}, {"text": "Xúc phạm danh dự cá nhân của đối phương.", "correctBox": "right"}, {"text": "Sẵn sàng thỏa hiệp để tìm giải pháp chung.", "correctBox": "left"}, {"text": "Đăng status ẩn ý nói xấu bạn trên trang cá nhân.", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp các cơ chế giải quyết mâu thuẫn.", "pairs": [{"left": "Hạch hạnh nhân", "right": "Phần não cảm xúc dễ kích động khi tức giận."}, {"left": "Khoảng nghỉ", "right": "Việc tạm dừng cuộc trò chuyện để hạ nhiệt cơn nóng."}, {"left": "Phong cách cộng tác", "right": "Tư duy cùng nhau đứng về một phía để xử lý vấn đề."}, {"left": "Phong cách đối đầu", "right": "Cố gắng quát tháo để giành phần thắng về mình."}, {"left": "Phong cách né tránh", "right": "Im lặng phớt lờ mâu thuẫn thay vì nói chuyện."}, {"left": "Hít thở sâu", "right": "Phản xạ sinh học giúp đưa lý trí quay trở lại."}, {"left": "Lời xin lỗi", "right": "Hành động xoa dịu tổn thương thể hiện sự tôn trọng."}, {"left": "Giải pháp win-win", "right": "Kết quả thỏa hiệp mang lại sự hài lòng cho cả hai."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Xung đột trong các mối quan hệ là điều hoàn toàn [blank1]. Khi có bất đồng, cơn giận dễ kích hoạt hạch [blank2] trong não bộ, khiến chúng ta hành xử nóng nảy thiếu lý trí. Để tránh nói ra những lời gây tổn thương, kỹ năng đề xuất tạm [blank3] là cực kỳ quan trọng. Hãy hít thở sâu để đưa lý trí quay trở lại kiểm soát hành vi. Khi cả hai đã bình tĩnh, đối thoại ôn hòa sẽ mở đường cho phong cách cộng [blank4] hiệu quả. Mục tiêu cuối cùng là tìm ra giải pháp chung mang lại sự hài [blank5] cho cả hai.", "blanks": {"blank1": {"correct": "tự nhiên", "placeholder": "..."}, "blank2": {"correct": "hạnh nhân", "placeholder": "..."}, "blank3": {"correct": "dừng", "placeholder": "..."}, "blank4": {"correct": "tác", "placeholder": "..."}, "blank5": {"correct": "lòng", "placeholder": "..."}}, "words": ["tự nhiên", "hạnh nhân", "dừng", "tác", "lòng", "nhân tạo", "tránh", "hại", "thắng", "lo"]}', 5),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Hành vi im lặng chiến tranh [blank1] là cách giải quyết xung đột vô cùng độc hại. Nó không giúp tháo gỡ vấn đề mà chỉ làm xói mòn lòng [blank2] giữa bạn bè. Thay vì chỉ trích bắt đầu bằng từ ''Bạn'', hãy rèn luyện công thức mệnh đề [blank3] để bày tỏ bức xúc cá nhân. Lời xin [blank4] chân thành thể hiện bạn coi trọng mối quan hệ hơn cái tôi của mình. Hãy nhớ công thức vàng: Bạn và đối phương cùng đứng về một phía để giải quyết [blank5] chung.", "blanks": {"blank1": {"correct": "lạnh", "placeholder": "..."}, "blank2": {"correct": "tin", "placeholder": "..."}, "blank3": {"correct": "Tôi", "placeholder": "..."}, "blank4": {"correct": "lỗi", "placeholder": "..."}, "blank5": {"correct": "vấn đề", "placeholder": "..."}}, "words": ["lạnh", "tin", "Tôi", "lỗi", "vấn đề", "nóng", "nghi ngờ", "Bạn", "hại", "xung đột"]}', 6),
(@ml_id, 'interaction', '{"question": "Khi bạn thân làm mất cuốn truyện tranh yêu thích của bạn, phản ứng nào lành mạnh?", "choices": [{"text": "Nói: ''Tớ rất buồn vì mất cuốn truyện đó. Cậu cùng tớ tìm hoặc mua lại cuốn khác nhé.''.", "correct": true, "emoji": "💚"}, {"text": "Quát: ''Cậu là đồ vô trách nhiệm, không bao giờ tớ cho mượn cái gì nữa!''.", "correct": false, "emoji": "🛑"}]}', 7),
(@ml_id, 'interaction', '{"question": "Tại sao chúng ta cần tạm dừng cuộc cãi vã khi thấy tim đập nhanh và nóng mặt?", "choices": [{"text": "Để tránh nói ra những lời cay độc do phần não cảm xúc đang kiểm soát.", "correct": true, "emoji": "💚"}, {"text": "Để đối phương nghĩ rằng mình khinh bỉ không thèm nói chuyện.", "correct": false, "emoji": "🛑"}]}', 8),
(@ml_id, 'interaction', '{"question": "Tư duy đúng đắn nhất khi giải quyết xung đột nhóm là gì?", "choices": [{"text": "Coi xung đột là vấn đề chung của nhóm cần hợp tác giải quyết.", "correct": true, "emoji": "💚"}, {"text": "Tìm xem ai là người làm sai để đổ toàn bộ lỗi lầm lên đầu họ.", "correct": false, "emoji": "🛑"}]}', 9),
(@ml_id, 'interaction', '{"question": "Biểu hiện nào là phong cách giải quyết xung đột né tránh độc hại?", "choices": [{"text": "Chặn Facebook, im lặng không nói chuyện và phớt lờ bạn suốt cả tuần.", "correct": true, "emoji": "💚"}, {"text": "Cùng ngồi lại thảo luận để tìm ra điểm chung thỏa hiệp.", "correct": false, "emoji": "🛑"}]}', 10),
(@ml_id, 'interaction', '{"question": "Lời xin lỗi chân thành có ý nghĩa gì lớn nhất?", "choices": [{"text": "Thể hiện sự tôn trọng mối quan hệ và mong muốn khôi phục lòng tin của đối phương.", "correct": true, "emoji": "💚"}, {"text": "Thể hiện bạn thừa nhận mình hoàn toàn ngu dại và thua cuộc.", "correct": false, "emoji": "🛑"}]}', 11);

-- =========================================================================
-- BÀI HỌC 6: Vượt qua Thử thách trong Mối quan hệ
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'vuot-qua-thu-thach-trong-moi-quan-he',
    'Vượt qua Thử thách trong Mối quan hệ',
    'Nhận diện cờ đỏ kiểm soát độc hại, ra quyết định dừng lại và chữa lành sau chia tay văn minh.',
    'Bài học giúp bạn lột trần hành vi ghen tuông kiểm soát mật khẩu định vị, cách nói lời chia tay trực tiếp lịch sự và bảo vệ an toàn cảm xúc của mình.',
    6,
    true,
    100,
    8
);
SET @lesson6_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson6_id, 'Scarleteen - Potholes & Dead Ends: Relationship Roadblocks to Look Out For', 'https://www.scarleteen.com/read/relationships/potholes-dead-ends-relationship-roadblocks-look-out', 'website');

-- --- Micro Lesson 6.1: Nhận diện cờ đỏ thao túng và kiểm soát độc hại ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Nhận diện cờ đỏ thao túng và kiểm soát độc hại', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Khi sự quan tâm biến thành chiếc lồng giam cầm cảm xúc?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nhiều hành vi kiểm soát độc hại thường được ngụy trang dưới vỏ bọc \"vì yêu thương, vì lo lắng\".", "Các cờ đỏ bao gồm: Yêu cầu báo cáo định vị liên tục, đọc tin nhắn riêng tư, cô lập bạn khỏi bạn bè hoặc bắt lỗi dằn vặt liên tục.", "Nếu mối quan hệ khiến bạn cảm thấy ngột ngạt, sợ hãi hoặc tội lỗi vô cớ, đó là dấu hiệu bất ổn."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống cờ đỏ", "body": "Nam yêu cầu Vy phải gửi ảnh chụp khuôn mặt và vị trí hiện tại mỗi khi đi chơi cùng bạn bè để \"đảm bảo Vy được an toàn\". Nam sẽ giận dữ nếu Vy phản hồi chậm."}', 3),
(@ml_id, 'interaction', '{"question": "Hành vi của Nam là biểu hiện của điều gì?", "choices": [{"text": "Sự lo lắng và chăm sóc chu đáo dành cho người yêu.", "correct": false, "emoji": "🛑"}, {"text": "Sự kiểm soát độc hại dưới danh nghĩa quan tâm lo lắng.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng cảm thấy ngột ngạt trong một mối quan hệ vì sự kiểm soát quá mức chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Yêu thương chân thành mang lại tự do và tin tưởng, không phải sự kiểm soát và giam cầm cảm xúc."]}', 6);

-- --- Micro Lesson 6.2: Dấu hiệu mối quan hệ đang rơi vào bế tắc ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Dấu hiệu mối quan hệ đang rơi vào bế tắc', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao biết tình bạn/tình yêu của hai bạn đã chạm vạch giới hạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Một mối quan hệ rơi vào bế tắc khi mọi nỗ lực đối thoại đều thất bại, cãi vã lặp đi lặp lại.", "Cảm thấy kiệt sức, lo âu hoặc trầm cảm mỗi khi nghĩ đến việc gặp gỡ đối phương.", "Sự im lặng lạnh nhạt kéo dài và cả hai đều không còn muốn cố gắng hàn gắn."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống bế tắc", "body": "Mỗi lần gặp nhau, Lâm và Hoa đều cãi vã vì những lý do vụn vặt. Sau đó là chuỗi ngày im lặng lạnh lùng. Cả hai đều thấy vô cùng mệt mỏi và chán nản."}', 3),
(@ml_id, 'interaction', '{"question": "Hoa và Lâm nên đối mặt với tình cảnh này thế nào?", "choices": [{"text": "Tiếp tục chịu đựng và hy vọng mọi chuyện sẽ tự động tốt lên mà không cần làm gì.", "correct": false, "emoji": "😐"}, {"text": "Cùng ngồi lại đối thoại nghiêm túc để đánh giá xem mối quan hệ này có nên tiếp tục hay dừng lại.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Có mối quan hệ nào đang khiến bạn cảm thấy kiệt sức hơn là vui vẻ không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chắp nhận sự bế tắc là bước đầu tiên để đưa ra những quyết định dũng cảm bảo vệ bản thân."]}', 6);

-- --- Micro Lesson 6.3: Tại sao rời bỏ một mối quan hệ độc hại lại khó? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Tại sao rời bỏ một mối quan hệ độc hại lại khó?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao tụi mình thường chọn ở lại trong một chiếc lồng giam độc hại?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sự quen thuộc và nỗi sợ cô đơn, sợ không tìm được ai khác tốt hơn khiến chúng ta chần chừ.", "Nhiều bạn bị thao túng tâm lý (gaslighting) dẫn đến việc tự nghi ngờ cảm xúc của chính mình.", "Hãy hiểu rằng: Rời đi là hành động dũng cảm để tự cứu lấy sự an toàn cảm xúc của bản thân."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống tâm lý", "body": "Vy bị Nam sỉ nhục nhiều lần, nhưng mỗi lần Vy muốn chia tay Nam đều khóc lóc cầu xin và Vy lại mủi lòng tha thứ vì sợ cô đơn."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên làm gì để thoát khỏi vòng lặp độc hại này?", "choices": [{"text": "Tiếp tục tin lời hứa và tha thứ thêm nhiều lần nữa.", "correct": false, "emoji": "🛑"}, {"text": "Kiên định cắt đứt mối quan hệ độc hại và tìm kiếm sự hỗ trợ tinh thần từ bạn bè, gia đình.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng chần chừ không dám chấm dứt một tình bạn tồi tệ vì sợ cô đơn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn xứng đáng được đối xử bằng sự tôn trọng và yêu thương chân thành, không phải bằng sự thao túng."]}', 6);

-- --- Micro Lesson 6.4: Tình huống: Khi người yêu yêu cầu mật khẩu mạng xã hội ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Tình huống: Khi người yêu yêu cầu mật khẩu mạng xã hội', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Trao mật khẩu có phải là minh chứng cho tình yêu đích thực?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mật khẩu tài khoản cá nhân là ranh giới riêng tư tuyệt đối của mỗi người.", "Đòi hỏi mật khẩu thể hiện sự thiếu tin tưởng và muốn kiểm soát đối phương.", "Một mối quan hệ lành mạnh được xây dựng trên sự tin cậy, không phải trên sự giám sát."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống đòi mật khẩu", "body": "Nam yêu cầu Vy đưa mật khẩu Facebook của cô để \"chứng minh Vy không nhắn tin mờ ám với bạn nam khác\". Nam bảo yêu nhau thì không nên có bí mật."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên ứng xử thế nào trước yêu cầu của Nam?", "choices": [{"text": "Đưa mật khẩu ngay để Nam vui lòng và chứng minh sự trong sạch của mình.", "correct": false, "emoji": "🛑"}, {"text": "Từ chối thẳng thắn: \"Tớ yêu cậu nhưng tài khoản cá nhân là không gian riêng tư của tớ, tụi mình cần tin tưởng nhau thay vì kiểm tra mật khẩu.\".", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có nghĩ việc giữ không gian riêng tư là cần thiết trong tình yêu không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tình yêu lành mạnh cần sự tin tưởng tự nguyện, không phải sự giám sát và kiểm soát tài khoản của nhau."]}', 6);

-- --- Micro Lesson 6.5: Kỹ năng: Ra quyết định tiếp tục hay dừng lại văn minh ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Kỹ năng: Ra quyết định tiếp tục hay dừng lại văn minh', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để nói lời chia tay/nghỉ chơi mà không gây tổn thương hay thù hận?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hãy chọn một địa điểm yên tĩnh, trực tiếp trò chuyện (tránh nhắn tin chia tay qua SMS).", "Bày tỏ rõ ràng quyết định của bạn tập trung vào cảm xúc cá nhân bằng mệnh đề \"Tôi\".", "Tôn trọng quá khứ, không nói lời sỉ nhục hay đổ lỗi dồn dập cho đối phương.", "Ranh giới sau chia tay rõ ràng để cả hai cùng có thời gian tự chữa lành."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống chia tay", "body": "Hoa cảm thấy tình bạn với Lâm không còn lành mạnh nữa và muốn dừng lại. Cô băn khoăn không biết nên làm thế nào."}', 3),
(@ml_id, 'interaction', '{"question": "Hoa nên thực hiện hành động nào văn minh nhất?", "choices": [{"text": "Nhắn tin chặn số đột ngột và đi rêu rao nói xấu Lâm với cả lớp.", "correct": false, "emoji": "🛑"}, {"text": "Gặp mặt trực tiếp, chia sẻ thẳng thắn rằng cảm thấy cả hai không còn hợp nhau nữa và xin phép tạm dừng mối quan hệ.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Lần gần nhất bạn kết thúc một mối quan hệ (tình bạn hoặc tình yêu), bạn có hài lòng với cách mình rời đi không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Rời đi văn minh là cách bạn tôn trọng những kỷ niệm đẹp đã qua và tự mở ra cơ hội mới cho chính mình."]}', 6);

-- --- Micro Lesson 6.6: Bạn từng trải qua cảm giác bị kiểm soát chưa? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Bạn từng trải qua cảm giác bị kiểm soát chưa?', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nhận diện cảm xúc của bản thân khi bị kiểm soát!"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cảm xúc của bạn là chiếc la bàn chính xác nhất.", "Bạn có thấy lo sợ mỗi khi chuông điện thoại reo vì tin nhắn của người đó?", "Bạn có phải liên tục giải thích, xin lỗi vì những chuyện nhỏ nhặt không đáng có?", "Hãy lắng nghe tiếng nói bên trong cơ thể bạn để nhận diện sự bất ổn kịp thời."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống suy ngẫm", "body": "Vy nhận ra mình luôn cảm thấy hồi hộp, tim đập nhanh và lo sợ mỗi khi Nam gọi điện thoại vì lo sợ sẽ bị Nam quát mắng hay bắt lỗi chuyện gì đó."}', 3),
(@ml_id, 'interaction', '{"question": "Cơ thể của Vy đang gửi đi tín hiệu gì?", "choices": [{"text": "Tín hiệu của sự nhớ nhung da diết và tình yêu nồng cháy.", "correct": false, "emoji": "🛑"}, {"text": "Tín hiệu báo động của sự căng thẳng và bất an trong mối quan hệ.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Có mối quan hệ nào khiến bạn cảm thấy bất an hay lo sợ mỗi khi liên lạc không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mối quan hệ lành mạnh mang lại sự bình yên, không phải sự lo âu và căng thẳng triền miên."]}', 6);

-- --- Micro Lesson 6.7: Đúc kết: An toàn cảm xúc là ưu tiên hàng đầu ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Đúc kết: An toàn cảm xúc là ưu tiên hàng đầu', 7);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Điều gì quan trọng hơn việc giữ chân một người bên cạnh bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Không có mối quan hệ nào đáng giá để bạn phải đánh đổi sự an toàn cảm xúc của bản thân.", "Dũng cảm từ bỏ mối quan hệ độc hại là cách bạn tự trân trọng giá trị của mình.", "Hãy luôn đặt sức khỏe tinh thần và sự an tâm của bạn lên vị trí ưu tiên hàng đầu."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống đúc kết", "body": "Sau khi kiên quyết chia tay Nam và tập trung vào học tập, Vy cảm thấy cuộc sống trở lại trạng thái nhẹ nhàng, vui vẻ và tự tin hơn trước rất nhiều."}', 3),
(@ml_id, 'interaction', '{"question": "Quyết định chia tay của Vy mang lại kết quả gì lớn nhất cho cô?", "choices": [{"text": "Khiến Vy cô đơn suốt đời và không có bạn bè xung quanh.", "correct": true, "emoji": "💚"}, {"text": "Giải phóng Vy khỏi sự căng thẳng và khôi phục năng lượng tích cực cho bản thân.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn sẽ làm gì hôm nay để bảo vệ sự an toàn cảm xúc của bản thân tốt hơn?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bảo vệ sự bình yên trong tâm hồn là trách nhiệm cao nhất của bạn đối với chính mình."]}', 6);

-- --- Micro Lesson 6.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Vượt qua Thử thách trong Mối quan hệ''! Hãy cùng vượt qua các bẫy kiểm soát độc hại nhé."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Thoát khỏi lồng giam", "startNode": "step1", "nodes": {"step1": {"text": "Người yêu yêu cầu bạn chặn kết bạn với tất cả các bạn khác giới trong lớp vì ''yêu thì chỉ được nghĩ đến tớ''. Bạn chọn gì?", "choices": [{"text": "Đồng ý chặn vì sợ người yêu giận dỗi ghen tuông.", "nextNode": "fail_step1"}, {"text": "Từ chối ôn hòa và bảo vệ quyền tự do kết bạn lành mạnh.", "nextNode": "step2"}]}, "step2": {"text": "Người yêu khóc lóc buộc tội: ''Cậu không còn yêu tớ nữa, cậu đang phản bội tớ!''.", "choices": [{"text": "Sợ hãi tự trách bản thân và nhượng bộ giao mật khẩu tài khoản cho người yêu kiểm tra.", "nextNode": "fail_step2"}, {"text": "Khẳng định tình cảm nhưng giữ vững ranh giới: ''Tớ yêu cậu nhưng tớ cần giữ các mối quan hệ bạn bè bình thường''.", "nextNode": "step3"}]}, "step3": {"text": "Người yêu đe dọa: ''Nếu cậu không chặn họ thì tụi mình chia tay đi!''.", "choices": [{"text": "Sợ cô đơn nên lập tức đồng ý chặn mọi người.", "nextNode": "fail_step3"}, {"text": "Nhận diện đây là cờ đỏ thao túng cảm xúc nghiêm trọng, đồng ý chia tay ôn hòa.", "nextNode": "step4"}]}, "step4": {"text": "Sau chia tay, người yêu liên tục gọi điện quấy rối và dọa tự tử nếu bạn không quay lại.", "choices": [{"text": "Quay lại mối quan hệ vì lo sợ người yêu sẽ làm thật.", "nextNode": "fail_step4"}, {"text": "Cảnh giác, báo cáo sự việc với bố mẹ và chặn số điện thoại quấy rối.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành xuất sắc! Bạn đã dũng cảm thoát khỏi mối quan hệ kiểm soát độc hại và bảo vệ bản thân an toàn!", "isEnd": true, "isSuccess": true}, "fail_step1": {"text": "❌ Thất bại! Nhượng bộ ghen tuông vô lý chỉ kích hoạt thêm sự kiểm soát độc hại sau này.", "isEnd": true, "isSuccess": false}, "fail_step2": {"text": "❌ Thất bại! Giao mật khẩu tài khoản làm mất hoàn toàn ranh giới riêng tư.", "isEnd": true, "isSuccess": false}, "fail_step3": {"text": "❌ Thất bại! Nhượng bộ vì sợ cô đơn làm bạn tiếp tục bị giam cầm trong lồng giam cảm xúc.", "isEnd": true, "isSuccess": false}, "fail_step4": {"text": "❌ Thất bại! Quay lại vì bị đe dọa làm bạn tiếp tục bị thao túng tinh thần nặng nề.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Kéo các thẻ hành vi vào đúng hộp Green Flag hoặc Red Flag.", "leftBox": {"title": "Green Flag (Lành mạnh)"}, "rightBox": {"title": "Red Flag (Độc hại)"}, "items": [{"text": "Tôn trọng không gian riêng tư và bạn bè cũ của bạn.", "correctBox": "left"}, {"text": "Yêu cầu bạn giao mật khẩu Facebook để kiểm tra.", "correctBox": "right"}, {"text": "Khích lệ bạn theo đuổi ước mơ vẽ tranh.", "correctBox": "left"}, {"text": "Bắt bạn gửi ảnh định vị khuôn mặt liên tục để giám sát.", "correctBox": "right"}, {"text": "Lắng nghe và xin lỗi khi nhận ra mình sai.", "correctBox": "left"}, {"text": "Thường xuyên đe dọa chia tay để ép bạn nghe lời.", "correctBox": "right"}, {"text": "Chấp nhận việc bạn bận ôn thi không đi chơi được.", "correctBox": "left"}, {"text": "Cô lập bạn khỏi gia đình và bạn bè thân thiết.", "correctBox": "right"}, {"text": "Giao tiếp mắt dịu dàng tôn trọng khi đối thoại.", "correctBox": "left"}, {"text": "Thao túng bắt bạn luôn cảm thấy có lỗi vô cớ.", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp cờ đỏ và định nghĩa phù hợp.", "pairs": [{"left": "Gaslighting", "right": "Hành vi thao túng tâm lý khiến bạn nghi ngờ trí nhớ cá nhân."}, {"left": "Cô lập", "right": "Hành vi ngăn cấm bạn tiếp xúc với gia đình, bạn bè."}, {"left": "Kiểm soát", "right": "Đòi hỏi mật khẩu và bắt báo cáo vị trí liên tục."}, {"left": "Bạo lực tinh thần", "right": "Chỉ trích, nhục mạ ngoại hình và lòng tự trọng của bạn."}, {"left": "Đe dọa", "right": "Dùng cái chết hoặc sự tự hủy hoại để ép bạn nhượng bộ."}, {"left": "An toàn cảm xúc", "right": "Ưu tiên hàng đầu cần bảo vệ trong mối quan hệ."}, {"left": "Rời đi văn minh", "right": "Lời chia tay trực tiếp, tôn trọng và dứt khoát."}, {"left": "Cờ đỏ", "right": "Dấu hiệu cảnh báo mối quan hệ độc hại cần cảnh giác."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Một mối quan hệ độc hại thường bắt đầu bằng những hành vi [blank1] núp bóng sự quan tâm chăm sóc. Kẻ kiểm soát sẽ yêu cầu mật khẩu tài khoản hoặc định vị liên tục, nhằm [blank2] bạn khỏi mạng lưới bạn bè thân thiết. Khi bạn bày tỏ sự khó chịu, họ sẽ sử dụng chiêu bài thao túng cảm xúc để bắt bạn cảm thấy có [blank3] vô cớ. Rời bỏ một mối quan hệ độc hại đòi hỏi rất nhiều dũng [blank4] để vượt qua nỗi sợ cô đơn. Hãy nhớ rằng sự an toàn cảm [blank5] luôn là ưu tiên hàng đầu của bản thân.", "blanks": {"blank1": {"correct": "kiểm soát", "placeholder": "..."}, "blank2": {"correct": "cô lập", "placeholder": "..."}, "blank3": {"correct": "lỗi", "placeholder": "..."}, "blank4": {"correct": "khí", "placeholder": "..."}, "blank5": {"correct": "xúc", "placeholder": "..."}}, "words": ["kiểm soát", "cô lập", "lỗi", "khí", "xúc", "yêu", "hòa", "giúp", "sợ", "nguy"]}', 5),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Việc chấm dứt một tình bạn độc hại cần được thực hiện một cách dứt khoát và [blank1]. Tránh việc nhắn tin chia tay qua SMS mà nên gặp gỡ đối thoại [blank2] ôn hòa. Sau khi chia tay, việc thiết lập ranh giới bảo vệ bằng cách chặn liên [blank3] quấy rối là vô cùng cần thiết. Đừng để những lời đe dọa tự hủy hoại của đối phương tiếp tục [blank4] cảm xúc của bạn. Hãy tìm kiếm sự hỗ trợ từ người lớn đáng tin [blank5] để được bảo vệ an toàn.", "blanks": {"blank1": {"correct": "văn minh", "placeholder": "..."}, "blank2": {"correct": "trực tiếp", "placeholder": "..."}, "blank3": {"correct": "lạc", "placeholder": "..."}, "blank4": {"correct": "thao túng", "placeholder": "..."}, "blank5": {"correct": "cậy", "placeholder": "..."}}, "words": ["văn minh", "trực tiếp", "lạc", "thao túng", "cậy", "nhanh", "gián tiếp", "thù hận", "yêu", "bỏ"]}', 6),
(@ml_id, 'interaction', '{"question": "Người yêu nhắn tin: ''Nếu cậu không đưa mật khẩu Instagram, tụi mình chia tay''. Bạn nên làm gì?", "choices": [{"text": "Từ chối dứt khoát và bảo vệ ranh giới tài khoản cá nhân.", "correct": true, "emoji": "💚"}, {"text": "Đưa mật khẩu ngay lập tức vì sợ mất đi mối tình này.", "correct": false, "emoji": "🛑"}]}', 7),
(@ml_id, 'interaction', '{"question": "Tại sao rời bỏ mối quan hệ độc hại lại đòi hỏi sự kiên định?", "choices": [{"text": "Vì kẻ thao túng thường dùng những lời hứa thay đổi giả tạo hoặc khóc lóc để níu giữ bạn.", "correct": true, "emoji": "💚"}, {"text": "Vì mối quan hệ độc hại thực chất mang lại rất nhiều niềm vui.", "correct": false, "emoji": "🛑"}]}', 8),
(@ml_id, 'interaction', '{"question": "Biểu hiện nào của bạn bè cho thấy họ đang cô lập bạn độc hại?", "choices": [{"text": "Tức giận nói xấu khi bạn đi chơi với các bạn nhóm khác trong lớp.", "correct": true, "emoji": "💚"}, {"text": "Vui vẻ rủ bạn cùng tham gia câu lạc bộ học tập mới.", "correct": false, "emoji": "🛑"}]}', 9),
(@ml_id, 'interaction', '{"question": "Bạn nên xử lý thế nào nếu sau chia tay người yêu cũ liên tục nhắn tin đe dọa làm hại bản thân?", "choices": [{"text": "Chặn số liên lạc, giữ khoảng cách và báo cáo ngay lập tức cho bố mẹ hoặc giáo viên đáng tin cậy.", "correct": true, "emoji": "💚"}, {"text": "Lập tức chạy đến xin lỗi và đồng ý quay lại vì lo sợ.", "correct": false, "emoji": "🛑"}]}', 10),
(@ml_id, 'interaction', '{"question": "Sứ mệnh lớn nhất của việc thiết lập ranh giới sau chia tay là gì?", "choices": [{"text": "Cung cấp thời gian và không gian an toàn để cả hai cùng tự chữa lành chấn thương cảm xúc.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục theo dõi xem đối phương có đau khổ vì mất mình không.", "correct": false, "emoji": "🛑"}]}', 11);

-- =========================================================================
-- BÀI HỌC 7: Gắn kết Bền chặt qua Giao tiếp
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'gan-ket-ben-chat-qua-giao-tiep',
    'Gắn kết Bền chặt qua Giao tiếp',
    'Dũng cảm bày tỏ sự dễ tổn thương, lắng nghe thấu cảm và làm người đồng minh tinh thần tốt.',
    'Bài học củng cố kết nối sâu sắc qua chia sẻ nỗi sợ hãi chân thành, đặt câu hỏi mở khơi gợi tâm sự và giữ bí mật bảo mật niềm tin.',
    7,
    true,
    100,
    8
);
SET @lesson7_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson7_id, 'Scarleteen - Intimacy: The Whys, Hows, How-Nots, and So-Nots', 'https://www.scarleteen.com/read/intimacy-whys-hows-how-nots-and-so-nots', 'website');

-- --- Micro Lesson 7.1: Sự dễ tổn thương - Chìa khóa của sự gần gũi ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Sự dễ tổn thương - Chìa khóa của sự gần gũi', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao bày tỏ điểm yếu lại là biểu hiện của sức mạnh kết nối?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sự dễ tổn thương (vulnerability) là việc dũng cảm mở lòng nói về những khuyết điểm, nỗi sợ hay mong muốn sâu kín của bản thân.", "Khi bạn dám yếu đuối trước mặt ai đó, bạn đang trao cho họ chiếc chìa khóa của niềm tin.", "Đây là nền tảng để đưa tình bạn/tình yêu lên mức độ sâu sắc đích thực."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống thực tế", "body": "Sơn lấy hết dũng khí kể với Lâm về việc mình từng bị bắt nạt hồi tiểu học và cảm thấy rất tự ti về ngoại hình của mình."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động chia sẻ của Sơn thể hiện điều gì?", "choices": [{"text": "Sự yếu đuối, hèn nhát và muốn tìm kiếm sự thương hại vô lý.", "correct": false, "emoji": "🛑"}, {"text": "Sự dũng cảm thể hiện khía cạnh dễ tổn thương để xây dựng niềm tin sâu sắc.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Đã bao giờ bạn dám khóc hoặc kể về nỗi sợ lớn nhất của mình với một người bạn thân chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Kết nối đích thực chỉ bắt đầu khi tụi mình dám gỡ bỏ lớp mặt nạ hoàn hảo để đến với nhau bằng sự chân thành."]}', 6);

-- --- Micro Lesson 7.2: Nhận diện mức độ thấu cảm trong giao tiếp ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Nhận diện mức độ thấu cảm trong giao tiếp', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao biết bạn đang thực sự thấu cảm hay chỉ đang nghe xã giao?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thấu cảm (Empathy) là việc đặt mình vào hoàn cảnh của người khác để cảm nhận nỗi đau hay niềm vui của họ.", "Không vội vàng phán xét: \"Có thế mà cũng buồn\" hay đưa ra lời khuyên sáo rỗng.", "Chỉ cần ôm nhẹ hoặc nói câu: \"Tớ hiểu cảm giác của cậu lúc này, tớ luôn ở đây cùng cậu\"."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống giao tiếp", "body": "Hoa khóc vì trượt bài thi học sinh giỏi cấp trường. Đức nghe tin liền chạy đến bên Hoa."}', 3),
(@ml_id, 'interaction', '{"question": "Đức nên phản hồi thế nào để thể hiện sự thấu cảm tinh tế nhất?", "choices": [{"text": "\"Cậu học chưa đủ chăm thôi, lần sau cố gắng học nhiều hơn là được.\".", "correct": false, "emoji": "🛑"}, {"text": "\"Tớ biết cậu đã nỗ lực rất nhiều cho kỳ thi này. Tớ hiểu cậu đang rất buồn, tớ sẽ ngồi đây cùng cậu nhé.\".", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thường chọn cách khuyên bảo hay lắng nghe thấu cảm khi bạn thân tìm đến khóc lóc tâm sự?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Thấu cảm quan trọng hơn lời khuyên, đôi khi sự hiện diện im lặng cùng nhau là tất cả những gì họ cần."]}', 6);

-- --- Micro Lesson 7.3: Tại sao chia sẻ nỗi sợ lại cần nhiều dũng khí? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Tại sao chia sẻ nỗi sợ lại cần nhiều dũng khí?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao việc nói câu \"Tớ đang rất sợ\" lại khó đến thế?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bản năng tự vệ khiến tụi mình luôn muốn thể hiện hình ảnh mạnh mẽ, hoàn hảo trước mắt mọi người.", "Nhưng chia sẻ nỗi sợ hãi thực chất là cách bạn mở ra cơ hội để đối phương được che chở, hỗ trợ bạn.", "Một mối quan hệ bền vững không sợ hãi bão giông, chỉ sợ sự im lặng chịu đựng của mỗi người."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống thực tế", "body": "Vy cảm thấy lo sợ tình bạn giữa mình và Hoa sẽ rạn nứt sau khi cả hai chọn học hai trường cấp ba khác nhau, nhưng cô giấu kín nỗi lo này."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên ứng xử thế nào để củng cố tình bạn?", "choices": [{"text": "Tiếp tục giấu kín nỗi lo và âm thầm tạo khoảng cách trước vì sợ bị bỏ rơi.", "correct": false, "emoji": "😐"}, {"text": "Gặp Hoa tâm sự: \"Tớ hơi lo hai đứa học khác trường sẽ ít gặp nhau, tụi mình lên kế hoạch hẹn hò cuối tuần nhé.\".", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Có nỗi sợ hãi nào về mối quan hệ hiện tại mà bạn đang giấu kín trong lòng không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chia sẻ nỗi sợ hãi giúp loại bỏ sự hoài nghi và thắt chặt thêm sợi dây gắn kết."]}', 6);

-- --- Micro Lesson 7.4: Tình huống: Buổi tối chia sẻ bí mật thầm kín ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Tình huống: Buổi tối chia sẻ bí mật thầm kín', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để tạo ra một không gian chia sẻ an toàn tuyệt đối?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hãy chọn một không gian yên tĩnh, tắt các thiết bị gây xao nhãng.", "Cam kết bảo mật tuyệt đối: \"Những gì nói ra ở đây sẽ chỉ ở lại giữa hai chúng ta\".", "Lắng nghe không phán xét, tôn trọng sự riêng tư và cảm xúc của đối phương."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống chia sẻ", "body": "Lâm muốn kể cho Sơn nghe về việc mình đang thầm thương trộm nhớ một bạn cùng lớp, nhưng lo lắng sẽ bị Sơn mang ra làm trò đùa trước cả lớp."}', 3),
(@ml_id, 'interaction', '{"question": "Sơn nên làm gì để Lâm cảm thấy an tâm chia sẻ bí mật của mình?", "choices": [{"text": "Hứa giữ bí mật nhưng hôm sau vẫn kể đùa vui với vài bạn thân khác.", "correct": false, "emoji": "🛑"}, {"text": "Lắng nghe nghiêm túc, cam kết giữ bí mật tuyệt đối và đưa ra lời khuyên chân thành nếu Lâm cần.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có người bạn nào tin cậy đến mức sẵn sàng chia sẻ mọi bí mật thầm kín nhất không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Niềm tin sâu sắc được xây dựng trên nền tảng của sự bảo mật và tôn trọng bí mật của nhau."]}', 6);

-- --- Micro Lesson 7.5: Kỹ năng: Đặt câu hỏi mở để gợi mở tâm sự ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Kỹ năng: Đặt câu hỏi mở để gợi mở tâm sự', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để bạn bè tự động mở lòng tâm sự mà không cảm thấy bị thẩm vấn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tránh đặt những câu hỏi Có/Không đóng khung cuộc thoại (\"Cậu có buồn không?\").", "Hãy đặt câu hỏi mở bắt đầu bằng \"Thế nào\", \"Tại sao\" hoặc \"Cảm giác của cậu ra sao\".", "Ví dụ: \"Chuyện đó xảy ra thế nào?\" hoặc \"Cậu cảm thấy thế nào về quyết định đó?\"."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống thực tế", "body": "Vy biết Hoa vừa gặp chuyện buồn ở lớp vẽ, Vy muốn hỏi thăm nhưng sợ làm Hoa khó chịu."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên dùng câu hỏi nào để gợi mở tâm sự tinh tế nhất?", "choices": [{"text": "\"Cậu lại cãi nhau với thầy giáo à?\".", "correct": false, "emoji": "🛑"}, {"text": "\"Hôm nay ở lớp vẽ có chuyện gì thế cậu? Cậu cảm thấy thế nào rồi?\".", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thường dùng câu hỏi đóng hay câu hỏi mở khi trò chuyện với bạn bè của mình?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đặt câu hỏi mở tinh tế giúp mở ra cánh cửa thấu cảm và sẻ chia sâu sắc."]}', 6);

-- --- Micro Lesson 7.6: Bạn có người bạn nào sẵn sàng nghe mọi bí mật của mình? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Bạn có người bạn nào sẵn sàng nghe mọi bí mật của mình?', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Giá trị của một người lắng nghe chân thành lớn lao thế nào?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Có một người bạn đáng tin cậy lắng nghe không phán xét là một tài sản vô giá.", "Người đó giúp bạn cảm thấy được thấu cảm, bớt cô đơn và tìm thấy sự bình yên.", "Hãy trân trọng mối quan hệ đó bằng cách cũng trở thành một người lắng nghe tốt cho họ."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống suy ngẫm", "body": "Lâm cảm thấy vô cùng may mắn khi luôn có Sơn bên cạnh lắng nghe mọi buồn vui, áp lực học tập và gia đình mà không hề phán xét hay cười cợt."}', 3),
(@ml_id, 'interaction', '{"question": "Mối quan hệ giữa Lâm và Sơn mang lại giá trị gì lớn nhất cho cả hai?", "choices": [{"text": "Giúp cả hai cùng tiến bộ trong học tập nhờ làm bài tập hộ nhau.", "correct": false, "emoji": "🛑"}, {"text": "Nuôi dưỡng sự an tâm tinh thần và xây dựng một tình bạn vững chắc đích thực.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã gửi lời cảm ơn chân thành đến người bạn luôn lắng nghe mình chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Một người lắng nghe chân thành là tấm khiên bảo vệ tinh thần vững chắc cho bạn trước mọi áp lực."]}', 6);

-- --- Micro Lesson 7.7: Đúc kết: Kết nối sâu sắc bắt nguồn từ sự chân thành ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Đúc kết: Kết nối sâu sắc bắt nguồn từ sự chân thành', 7);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đâu là đích đến cuối cùng của mọi cuộc giao tiếp lành mạnh?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Giao tiếp không chỉ để truyền đạt thông tin, nó là con đường ngắn nhất dẫn đến sự thấu cảm.", "Sự chân thành trong việc lắng nghe chủ động và dũng cảm bày tỏ tạo nên kết nối sâu sắc.", "Hãy luôn nuôi dưỡng các mối quan hệ bằng tình yêu thương, sự tôn trọng và chân thành nhất."]}', 2),
(@ml_id, 'scenario', '{"title": "Tình huống đúc kết", "body": "Sau chặng đường dài cùng học cách giao tiếp, lắng nghe và tôn trọng ranh giới của nhau, nhóm bạn của Vy, Hoa, Nam và Sơn trở nên khăng khít và bền chặt hơn bao giờ hết."}', 3),
(@ml_id, 'interaction', '{"question": "Chìa khóa vàng tạo nên sự gắn kết tuyệt vời của nhóm bạn là gì?", "choices": [{"text": "Sự ngụy trang cảm xúc để luôn tỏ ra hoàn hảo trước mắt nhau.", "correct": false, "emoji": "🛑"}, {"text": "Sự chân thành, thấu cảm và tôn trọng ranh giới của nhau qua giao tiếp.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn sẽ áp dụng bài học giao tiếp lành mạnh nào đầu tiên vào cuộc sống của mình từ ngày hôm nay?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Giao tiếp chân thành và thấu cảm biến những mối quan hệ bình thường thành kết nối sâu sắc trọn đời."]}', 6);

-- --- Micro Lesson 7.99: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Gắn kết Bền chặt qua Giao tiếp''! Hãy chia sẻ và kết nối chân thành nhé."}', 1),
(@ml_id, 'scenario-choice', '{"title": "Kết nối chân thành", "startNode": "step1", "nodes": {"step1": {"text": "Bạn thân rủ bạn ra bờ hồ tâm sự lúc tối muộn. Bạn thấy bạn có vẻ rất buồn. Bạn chọn gì?", "choices": [{"text": "Nói đùa cợt nhả để trêu chọc bạn cho vui vẻ lại.", "nextNode": "fail_step1"}, {"text": "Lắng nghe chăm chú, gật đầu nhẹ động viên bạn.", "nextNode": "step2"}]}, "step2": {"text": "Bạn kể: ''Tớ cảm thấy áp lực học tập quá, thi cử điểm kém làm bố mẹ mắng suốt''.", "choices": [{"text": "''Điểm thế bị mắng là đúng rồi, chăm học lên!''.", "nextNode": "fail_step2"}, {"text": "Thấu cảm: ''Tớ biết cậu đã nỗ lực rất nhiều. Bị mắng như vậy chắc cậu buồn lắm đúng không?''.", "nextNode": "step3"}]}, "step3": {"text": "Bạn khóc nấc lên và ôm lấy bạn. Bạn cảm thấy hơi ngượng ngùng trước cảm xúc mạnh mẽ này.", "choices": [{"text": "Đẩy bạn ra bảo: ''Con trai/con gái ai lại khóc lóc yếu đuối thế!''.", "nextNode": "fail_step3"}, {"text": "Ôm nhẹ vỗ vai bạn, ngồi im lặng cùng bạn vượt qua cơn khóc.", "nextNode": "step4"}]}, "step4": {"text": "Bạn bình tĩnh lại và lau nước mắt, bảo: ''Cảm ơn cậu đã nghe tớ nói. Tớ thấy nhẹ lòng nhiều lắm''.", "choices": [{"text": "''Chuyện nhỏ ấy mà, nhớ bao tớ chầu nước nhé'' để lảng tránh.", "nextNode": "fail_step4"}, {"text": "''Tụi mình là bạn thân mà, tớ luôn ở đây lắng nghe cậu. Hãy cùng cố gắng ôn thi đợt tới nhé!''.", "nextNode": "success_end"}]}, "success_end": {"text": "🎉 Hoàn thành xuất sắc! Bạn đã xây dựng kết nối sâu sắc tuyệt vời qua sự thấu cảm và chân thành!", "isEnd": true, "isSuccess": true}, "fail_step1": {"text": "❌ Thất bại! Đùa cợt không đúng lúc làm bạn cảm thấy bị tổn thương và khép lòng.", "isEnd": true, "isSuccess": false}, "fail_step2": {"text": "❌ Thất bại! Lời phán xét điểm số xát muối thêm vào nỗi đau áp lực của bạn.", "isEnd": true, "isSuccess": false}, "fail_step3": {"text": "❌ Thất bại! Chê bai sự khóc lóc làm phá vỡ sự dễ tổn thương an toàn bạn vừa tạo ra.", "isEnd": true, "isSuccess": false}, "fail_step4": {"text": "❌ Thất bại! Lảng tránh cảm xúc làm giảm giá trị của buổi tâm sự chân thành.", "isEnd": true, "isSuccess": false}}}', 2),
(@ml_id, 'sorting', '{"instruction": "Kéo các thẻ phản hồi vào đúng hộp Thấu cảm hoặc Phán xét.", "leftBox": {"title": "Phản hồi Thấu cảm"}, "rightBox": {"title": "Phản hồi Phán xét"}, "items": [{"text": "''Tớ hiểu cậu đang buồn, tớ ở đây cùng cậu.''", "correctBox": "left"}, {"text": "''Có thế mà cũng khóc, yếu đuối quá đi!''", "correctBox": "right"}, {"text": "''Chắc cậu đã phải chịu đựng áp lực lớn lắm.''", "correctBox": "left"}, {"text": "''Tại cậu không chịu nghe lời khuyên của tớ thôi.''", "correctBox": "right"}, {"text": "''Cậu có muốn nói thêm về cảm giác đó không?''", "correctBox": "left"}, {"text": "''Tớ thấy chuyện đó bình thường, chẳng có gì to tát.''", "correctBox": "right"}, {"text": "''Tớ cảm ơn vì cậu đã tin tưởng kể cho tớ nghe.''", "correctBox": "left"}, {"text": "''Đừng nghĩ lung tung nữa, đi ngủ đi là hết.''", "correctBox": "right"}, {"text": "''Tớ sẽ luôn giữ bí mật câu chuyện này của hai đứa.''", "correctBox": "left"}, {"text": "''Bố mẹ mắng cậu là đúng rồi, trách ai nữa.''", "correctBox": "right"}]}', 3),
(@ml_id, 'matching', '{"instruction": "Ghép cặp từ khóa thấu hiểu với định nghĩa tương ứng.", "pairs": [{"left": "Thấu cảm", "right": "Việc cảm nhận nỗi đau của người khác từ góc nhìn của họ."}, {"left": "Sự chân thành", "right": "Giao tiếp cởi mở, không che giấu khuyết điểm bản thân."}, {"left": "Sự dễ tổn thương", "right": "Dũng cảm mở lòng nói về nỗi sợ sâu kín nhất."}, {"left": "Câu hỏi mở", "right": "Công cụ kích hoạt cuộc tâm sự chia sẻ cảm xúc."}, {"left": "Cam kết bảo mật", "right": "Giữ kín bí mật riêng tư của bạn bè tuyệt đối."}, {"left": "Hiện diện", "right": "Sự tập trung hoàn toàn vào đối phương không bị xao nhãng."}, {"left": "Không phán xét", "right": "Lắng nghe với thái độ chấp nhận sự khác biệt."}, {"left": "Đồng minh tinh thần", "right": "Người luôn sát cánh lắng nghe và ủng hộ bạn."}]}', 4),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Kết nối sâu sắc bắt nguồn từ sự [blank1] trong giao tiếp. Khi đối phương dám chia sẻ những nỗi sợ hãi thầm kín, họ đang bày tỏ khía cạnh dễ tổn [blank2] để xây dựng niềm tin. Phản hồi tốt nhất lúc này là sự lắng nghe thấu [blank3] thay vì đưa ra những lời phán xét hay chê bai. Hãy cam kết giữ [blank4] câu chuyện để bảo vệ sự an tâm tuyệt đối của bạn. Một người đồng minh tinh thần tốt sẽ luôn [blank5] bên cạnh bạn vượt qua mọi giông bão.", "blanks": {"blank1": {"correct": "chân thành", "placeholder": "..."}, "blank2": {"correct": "thương", "placeholder": "..."}, "blank3": {"correct": "cảm", "placeholder": "..."}, "blank4": {"correct": "kín", "placeholder": "..."}, "blank5": {"correct": "hiện diện", "placeholder": "..."}}, "words": ["chân thành", "thương", "cảm", "kín", "hiện diện", "giả tạo", "phá", "phụ thuộc", "độc", "tránh"]}', 5),
(@ml_id, 'fill-blank', '{"instruction": "Điền từ thích hợp vào chỗ trống trong đoạn văn sau.", "sentence": "Đặt câu hỏi [blank1] là kỹ năng tuyệt vời để khơi gợi đối phương chia sẻ nỗi lòng mà không cảm thấy bị ép buộc. Hãy tránh những lời khuyên [blank2] khi chưa hiểu rõ toàn bộ bối cảnh câu chuyện. Sự hiện diện trọn vẹn bằng ánh mắt và cái gật đầu nhẹ sẽ tiếp thêm [blank3] tích cực cho cuộc trò chuyện. Hãy trân trọng mối quan hệ lành mạnh bằng sự biết [blank4] chân thành nhất mỗi ngày. Giao tiếp hiệu quả biến những kết nối bình thường thành tình bạn [blank5] trọn đời.", "blanks": {"blank1": {"correct": "mở", "placeholder": "..."}, "blank2": {"correct": "sáo rỗng", "placeholder": "..."}, "blank3": {"correct": "năng lượng", "placeholder": "..."}, "blank4": {"correct": "ơn", "placeholder": "..."}, "blank5": {"correct": "bền vững", "placeholder": "..."}}, "words": ["mở", "sáo rỗng", "năng lượng", "ơn", "bền vững", "đóng", "ích kỷ", "nhanh", "giận", "mất"]}', 6),
(@ml_id, 'interaction', '{"question": "Khi bạn thân kể: ''Tớ lo sợ tụi mình học khác trường cấp ba sẽ xa cách'', phản hồi nào đúng đắn?", "choices": [{"text": "Tớ cũng lo chuyện đó, tụi mình cùng lập kế hoạch đi chơi cuối tuần nhé!.", "correct": true, "emoji": "💚"}, {"text": "Cậu lo hão huyền quá, có gì đâu mà sợ.", "correct": false, "emoji": "🛑"}]}', 7),
(@ml_id, 'interaction', '{"question": "Tại sao dũng cảm thừa nhận điểm yếu lại giúp mối quan hệ thân thiết hơn?", "choices": [{"text": "Vì nó chứng minh bạn tin tưởng đối phương đủ nhiều để cởi bỏ lớp phòng ngự.", "correct": true, "emoji": "💚"}, {"text": "Vì nó khiến đối phương thương hại và luôn nhường nhịn bạn.", "correct": false, "emoji": "🛑"}]}', 8),
(@ml_id, 'interaction', '{"question": "Kỹ năng đặt câu hỏi mở giúp ích gì cho buổi tâm sự?", "choices": [{"text": "Gợi mở câu chuyện tự nhiên giúp đối phương giải tỏa áp lực tinh thần.", "correct": true, "emoji": "💚"}, {"text": "Bắt đối phương phải trả lời Có hoặc Không nhanh chóng.", "correct": false, "emoji": "🛑"}]}', 9),
(@ml_id, 'interaction', '{"question": "Biểu hiện nào vi phạm nghiêm trọng cam kết bảo mật tình bạn?", "choices": [{"text": "Kể bí mật thầm kín của bạn thân cho người khác nghe để làm trò đùa.", "correct": true, "emoji": "💚"}, {"text": "Giữ kín câu chuyện trong lòng và luôn âm thầm ủng hộ bạn.", "correct": false, "emoji": "🛑"}]}', 10),
(@ml_id, 'interaction', '{"question": "Mục đích tối thượng của sự thấu cảm trong giao tiếp là gì?", "choices": [{"text": "Chia sẻ nỗi đau và kết nối tâm hồn sâu sắc với đối phương.", "correct": true, "emoji": "💚"}, {"text": "Chứng minh bạn là người thông minh và nhân hậu hơn đối phương.", "correct": false, "emoji": "🛑"}]}', 11);
