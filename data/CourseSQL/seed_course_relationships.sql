-- =========================================================================
-- SEED DATA FOR COURSE: Mối Quan Hệ Lành Mạnh (Healthy Relationships)
-- Maps to schemas in init.sql: courses, lessons, micro_lessons,
-- micro_lesson_blocks, and lesson_sources.
-- =========================================================================

SET NAMES utf8mb4;
USE educare;

-- 1. Thêm Khóa học mới
INSERT INTO courses (title, description, thumbnail, color_theme, course_order)
VALUES (
    'Mối Quan Hệ Lành Mạnh',
    'Tìm hiểu về cách xây dựng tình bạn, tình yêu tôn trọng, đặt ranh giới cá nhân và ứng xử văn minh trước cờ đỏ.',
    'relationship-course.png',
    '#ff5d8f',
    20
);
SET @course_id = LAST_INSERT_ID();

-- =========================================================================
-- BÀI HỌC 1: Thế nào là mối quan hệ lành mạnh? (Foundations)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'nen-tang-moi-quan-he-lanh-manh',
    'Thế nào là mối quan hệ lành mạnh?',
    'Tìm hiểu về các viên gạch nền tảng: sự tôn trọng, lòng tin, sự bình đẳng và cách giữ cá tính riêng.',
    'Bài học này giới thiệu về các tiêu chí cốt lõi tạo nên một tình bạn hay tình yêu lành mạnh, giúp bạn cảm thấy được là chính mình.',
    14,
    true,
    100,
    10
);
SET @lesson1_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson1_id, 'Scarleteen - Quickies: Healthy Relationships', 'https://www.scarleteen.com/read/relationships/quickies-healthy-relationships', 'website'),
(@lesson1_id, 'Scarleteen - Hello Sailor: How to Build, Board, and Navigate a Healthy Relationship', 'https://www.scarleteen.com/read/relationships/hello-sailor-how-build-board-navigate-healthy-relationship', 'website');

-- --- Micro Lesson 1.1: Ba viên gạch nền tảng ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Ba viên gạch nền tảng', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Mối quan hệ lành mạnh không phải là một phép thuật có sẵn, mà là một ngôi nhà cần tự xây."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nền tảng đầu tiên là Tôn Trọng: coi trọng cảm xúc và ý kiến của nhau.", "Nền tảng thứ hai là Lòng Tin: tin tưởng đối phương mà không cần kiểm soát.", "Nền tảng thứ ba là Bình Đẳng: cả hai có quyền quyết định và đóng góp ngang nhau."]}', 2),
(@ml_id, 'scenario', '{"title": "Đi ăn đồ nướng", "body": "Vân muốn đi ăn lẩu, nhưng Huy lại muốn ăn đồ nướng. Huy cười bảo: Thôi hôm nay ăn lẩu theo ý Vân đi, tuần sau tụi mình ăn đồ nướng nha. Cả hai đều vui vẻ."}', 3),
(@ml_id, 'interaction', '{"question": "Hành vi của Huy thể hiện điều gì?", "choices": [{"text": "Bình đẳng và biết nhường nhịn tôn trọng ý kiến bạn bè.", "correct": true, "emoji": "💚"}, {"text": "Huy quá yếu đuối, không dám giữ chính kiến của mình.", "correct": false, "emoji": "🚩"}]}', 4),
(@ml_id, 'reflection', '{"question": "Trong mối quan hệ bạn bè của bạn, bạn cảm thấy tiếng nói của mình có được lắng nghe bình đẳng không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tôn trọng, lòng tin và bình đẳng là ba viên gạch xây nên mối quan hệ bền vững."]}', 6);

-- --- Micro Lesson 1.2: Cảm xúc của bạn nói lên điều gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Cảm xúc của bạn nói lên điều gì?', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao biết một mối quan hệ có tốt cho bạn hay không? Hãy hỏi cơ thể bạn."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mối quan hệ lành mạnh mang lại cảm giác an tâm, vui vẻ và ấm áp.", "Nếu bạn luôn cảm thấy hồi hộp lo lắng, sợ hãi, hoặc bồn chồn (đau bụng, căng cơ), đó là tín hiệu cảnh báo.", "Đừng bỏ qua cảm giác bất an bên trong cơ thể bạn."]}', 2),
(@ml_id, 'scenario', '{"title": "Mỗi lần nhận tin nhắn", "body": "Mỗi khi nhận cuộc gọi từ Lâm, tim Lan lại đập thình thịch vì sợ Lâm sẽ mắng hoặc giận dỗi vì Lan không rep tin nhắn ngay lập tức."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm sao để nhận biết cơ thể đang báo động một mối quan hệ bất ổn?", "back": "Nhận biết qua cảm xúc lo âu, bồn chồn, tim đập thình thịch sợ hãi, cơ thể căng cứng, hoặc cảm giác nơm nớp sợ đối phương mắng giận.", "notes": "Cơ thể luôn gửi tín hiệu trước khi lý trí nhận ra. Đừng bỏ qua cảm giác bất an bên trong bạn."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng cảm thấy sợ hãi hoặc căng thẳng trước phản ứng của một người bạn thân chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mối quan hệ tốt giúp bạn thấy nhẹ lòng, chứ không phải nơm nớp lo sợ."]}', 6);

-- --- Micro Lesson 1.3: Bạn có cần thay đổi vì người khác? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bạn có cần thay đổi vì người khác?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Liệu chúng ta có phải từ bỏ cá tính của mình để đổi lấy một tình bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Lành mạnh nghĩa là bạn được là chính mình, với cả ưu điểm và khuyết điểm.", "Bạn có thể thay đổi để tốt lên, nhưng không phải vì bị ép buộc hay nịnh bợ.", "Một người thực sự quý bạn sẽ yêu thích con người thật của bạn chứ không phải một phiên bản giả tạo."]}', 2),
(@ml_id, 'scenario', '{"title": "Mái tóc mới", "body": "Bách thích cắt tóc ngắn năng động, nhưng bạn bè trong nhóm nói tóc ngắn trông kì cục và bắt Bách phải nuôi tóc dài lại để hợp với nhóm."}', 3),
(@ml_id, 'interaction', '{"question": "Bách nên làm gì?", "choices": [{"text": "Nghe theo nhóm để không bị cô lập.", "correct": false, "emoji": "🙁"}, {"text": "Giữ kiểu tóc mình thích và nhẹ nhàng bảo: Tớ thấy thoải mái với kiểu này nhất.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã bao giờ giả vờ thích một thứ chỉ để giống với nhóm bạn chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Người trân trọng bạn sẽ yêu quý con người thật, chứ không bắt bạn thành bản sao của họ."]}', 6);

-- --- Micro Lesson 1.4: Tình huống: Chiếc áo gượng ép ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Tình huống: Chiếc áo gượng ép', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Học cách từ chối áp lực từ nhóm bạn mà vẫn giữ được sự kết nối."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Áp lực đồng trang lứa là có thật, đặc biệt là mong muốn hòa nhập nhóm.", "Tuy nhiên, đồng thuận và tự nguyện vẫn luôn là yếu tố quyết định.", "Đặt ranh giới từ chối một hoạt động không có nghĩa là bạn ghét họ."]}', 2),
(@ml_id, 'scenario', '{"title": "Chiếc áo đắt đỏ", "body": "Nhóm bạn rủ nhau mua áo nhóm có giá khá đắt. Chi không đủ tiền tiêu vặt, nhưng sợ nếu nói không mua sẽ bị xem là ''nghèo'' và bị đẩy ra rìa."}', 3),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các hành vi ứng phó áp lực đồng trang lứa sau:", "leftBox": {"title": "Ứng phó lành mạnh"}, "rightBox": {"title": "Áp lực bắt chước"}, "items": [{"text": "Nói thật về điều kiện kinh tế của mình và đề xuất giải pháp", "correctBox": "left"}, {"text": "Cố gắng vay nợ để mua bằng được món đồ đắt đỏ giống bạn", "correctBox": "right"}, {"text": "Tự tin mặc trang phục theo sở thích cá nhân", "correctBox": "left"}, {"text": "Ép bản thân làm điều mình không thích để được nhóm chấp nhận", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã bao giờ gặp khó khăn khi phải nói thật về hoàn cảnh hay cảm xúc của mình với bạn bè chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn bè chân chính tôn trọng khả năng và ranh giới của bạn, chứ không ép bạn đua đòi."]}', 6);

-- --- Micro Lesson 1.5: Cách giữ cá tính riêng ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Cách giữ cá tính riêng', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để vừa là một phần của nhóm, vừa là chính mình?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đầu tiên, xác định sở thích cá nhân của bạn.", "Thứ hai, cởi mở chia sẻ sự khác biệt một cách tự tin và vui vẻ.", "Thứ ba, tôn trọng sở thích của người khác và mong đợi sự tôn trọng ngược lại."]}', 2),
(@ml_id, 'scenario', '{"title": "Nhạc gì cũng được?", "body": "Nhóm bạn thích nghe nhạc K-pop sôi động, riêng Hoàng lại thích nghe nhạc Indie nhẹ nhàng. Khi được hỏi ý kiến, Hoàng tự tin giới thiệu bài nhạc Indie yêu thích của mình."}', 3),
(@ml_id, 'interaction', '{"question": "Sự tự tin của Hoàng đem lại kết quả gì?", "choices": [{"text": "Giúp nhóm có thêm lựa chọn âm nhạc thú vị và tôn trọng cá tính riêng của Hoàng.", "correct": true, "emoji": "💚"}, {"text": "Hoàng sẽ bị nhóm tẩy chay vì gu âm nhạc khác biệt.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng chia sẻ sở thích độc lạ của mình với bạn bè xung quanh không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cá tính riêng làm nên sự thú vị của bạn. Hãy tự tin tỏa sáng theo cách của mình!"]}', 6);

-- =========================================================================
-- BÀI HỌC 2: Cách Giao tiếp & Giải quyết Xung đột (Communication & Conflict)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'giao-tiep-va-giai-quyet-xung-dot',
    'Giao tiếp & Giải quyết Xung đột',
    'Học cách lắng nghe chủ động, dùng câu bắt đầu bằng "Tớ" để bày tỏ cảm xúc và giải quyết mâu thuẫn lành mạnh.',
    'Bài học trang bị cho bạn kỹ năng giao tiếp hiệu quả, tránh hiểu lầm khi nhắn tin và các bước hòa giải xung đột êm thấm.',
    15,
    false,
    100,
    10
);
SET @lesson2_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson2_id, 'Scarleteen - Hello Sailor: How to Build, Board, and Navigate a Healthy Relationship', 'https://www.scarleteen.com/read/relationships/hello-sailor-how-build-board-navigate-healthy-relationship', 'website');

-- --- Micro Lesson 2.1: Nghe để hiểu hay nghe để cãi? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Nghe để hiểu hay nghe để cãi?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ đợi người ta nói xong chỉ để nhảy vào cãi lại?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Lắng nghe chủ động là tập trung hiểu cảm xúc và ý kiến của đối phương.", "Tránh cắt ngang lời khi họ đang chia sẻ suy nghĩ.", "Đặt câu hỏi để làm rõ nếu bạn chưa chắc chắn: Có phải ý cậu là...?"]}', 2),
(@ml_id, 'scenario', '{"title": "Tâm sự điểm kém", "body": "Vân khóc kể với Nam về việc bị điểm kém môn Toán. Nam lập tức bảo: Ôi giời, có thế cũng khóc, lần sau học chăm lên là được chứ gì."}', 3),
(@ml_id, 'flashcard', '{"front": "Lắng nghe chủ động (Active Listening) khi bạn bè tâm sự là gì?", "back": "Là tập trung hoàn toàn để hiểu cảm xúc đối phương, không cắt ngang hay phán xét, và đặt câu hỏi làm rõ nếu cần thiết.", "notes": "Lắng nghe là món quà tuyệt vời nhất bạn có thể trao tặng."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng bị người khác gạt phắt đi cảm xúc khi đang cố tâm sự chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Lắng nghe là món quà tuyệt vời nhất bạn có thể tặng cho người đang chia sẻ."]}', 6);

-- --- Micro Lesson 2.2: Sức mạnh của từ "Tớ" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Sức mạnh của từ "Tớ"', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Dùng từ ngữ khéo léo để biến một lời trách móc thành một cuộc trò chuyện cởi mở."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Câu bắt đầu bằng ''Cậu'' dễ mang lại cảm giác đổ lỗi: Cậu lúc nào cũng..., Cậu làm hỏng... ", "Dùng cấu trúc bắt đầu bằng ''Tớ'' để nói về cảm xúc của bạn: Tớ thấy buồn khi..., Tớ lo lắng vì...", "Điều này giúp đối phương bớt phòng thủ và dễ thấu hiểu hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Lỗi trễ hẹn", "body": "Duy hẹn Linh đi uống nước nhưng lại đến trễ 30 phút mà không báo trước. Linh rất giận."}', 3),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại câu nói của bạn Linh sau đây vào đúng hộp cảm xúc:", "leftBox": {"title": "Bày tỏ bằng câu bắt đầu bằng Tớ"}, "rightBox": {"title": "Đổ lỗi bằng câu bắt đầu bằng Cậu"}, "items": [{"text": "Tớ thấy hơi hụt hẫng khi phải chờ lâu mà không nghe báo trước", "correctBox": "left"}, {"text": "Cậu lúc nào cũng cao su, thiếu tôn trọng giờ giấc của người khác", "correctBox": "right"}, {"text": "Tớ lo lắng khi thấy cậu đến muộn mà không gọi được điện thoại", "correctBox": "left"}, {"text": "Cậu cố tình bắt tớ leo cây để làm tớ bực mình đúng không", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thấy bản thân có hay vô tình dùng những câu trách móc ''Cậu thế này, cậu thế nọ'' khi tức giận không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chia sẻ cảm xúc của mình (dùng Tớ) thay vì đổ lỗi cho người khác (dùng Cậu)."]}', 6);

-- --- Micro Lesson 2.3: Khi đầu óc bốc hỏa ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Khi đầu óc bốc hỏa', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Khi cơn tức giận lên đỉnh điểm, im lặng tạm thời chính là một siêu năng lực."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Lúc nóng giận, não bộ dễ đưa ra những lời nói sát thương gây hối hận sau này.", "Học cách nhận biết cơn giận: tim đập nhanh, mặt nóng lên.", "Chủ động xin tạm dừng: Tụi mình đang nóng, để chiều nói tiếp nha."]}', 2),
(@ml_id, 'scenario', '{"title": "Tranh cãi nhóm", "body": "Quân và Trang tranh cãi gay gắt về phân chia công việc trong nhóm. Cả hai bắt đầu to tiếng và dùng những từ ngữ xúc phạm nhau."}', 3),
(@ml_id, 'interaction', '{"question": "Ai nên là người xin tạm dừng?", "choices": [{"text": "Cả hai đều có thể dừng lại và hẹn thảo luận sau khi bình tĩnh.", "correct": true, "emoji": "💚"}, {"text": "Trang nên chịu đựng và nghe Quân xả hết giận rồi tính tiếp.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có hay nói ra những lời hối hận khi đang nóng giận với người thân thiết không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hạ nhiệt cơn giận trước khi tìm cách giải quyết mâu thuẫn."]}', 6);

-- --- Micro Lesson 2.4: Tình huống: Tin nhắn hiểu lầm ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Tình huống: Tin nhắn hiểu lầm', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nhắn tin chữ không có cảm xúc, rất dễ khiến tình cảm sứt mẻ vì hiểu lầm."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tin nhắn thiếu tông giọng, nét mặt dễ bị suy diễn theo hướng tiêu cực.", "Hạn chế tranh cãi những chuyện nghiêm trọng qua tin nhắn chữ.", "Gặp mặt trực tiếp hoặc gọi điện video là cách tốt nhất để hòa giải."]}', 2),
(@ml_id, 'scenario', '{"title": "Từ ''Ừ'' lạnh lùng", "body": "Linh nhắn tin rủ Vy đi chơi, Vy chỉ rep vỏn vẹn chữ ''Ừ''. Linh nghĩ Vy đang ghét mình nên đâm ra giận dỗi, trong khi Vy chỉ đang bận học bài."}', 3),
(@ml_id, 'interaction', '{"question": "Linh nên xử lý thế nào cho đúng tinh thần Green Flag?", "choices": [{"text": "Im lặng và hủy kết bạn luôn với Vy cho bõ ghét.", "correct": false, "emoji": "🛑"}, {"text": "Gọi điện hỏi thăm: Cậu đang bận hả? Lúc nãy thấy rep ngắn tớ cứ sợ cậu có chuyện gì.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng giận dỗi ai đó chỉ vì suy diễn nội dung tin nhắn chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đừng suy diễn tin nhắn. Hãy hỏi trực tiếp bằng giọng nói ấm áp."]}', 6);

-- --- Micro Lesson 2.5: Quy tắc hòa giải 3 bước ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Quy tắc hòa giải 3 bước', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Mối quan hệ bền vững không phải không có mâu thuẫn, mà là biết cách làm hòa."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bước 1: Chấp nhận lỗi sai và xin lỗi chân thành, không bao biện.", "Bước 2: Lắng nghe cảm nhận của đối phương về lỗi sai đó.", "Bước 3: Cùng đưa ra giải pháp cụ thể để không lặp lại lỗi cũ."]}', 2),
(@ml_id, 'scenario', '{"title": "Lỡ miệng kể bí mật", "body": "An vô tình kể chuyện thầm kín của Bình cho nhóm bạn biết. Bình rất giận và thất vọng về An."}', 3),
(@ml_id, 'flashcard', '{"front": "Quy tắc hòa giải mâu thuẫn gồm những bước nào?", "back": "Bước 1: Chấp nhận lỗi sai và xin lỗi chân thành; Bước 2: Lắng nghe cảm nhận đối phương; Bước 3: Cùng đưa ra giải pháp khắc phục.", "notes": "Lời xin lỗi chân thành đi kèm hành động cụ thể mới có thể chữa lành vết thương."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thấy khó khăn khi phải nói lời xin lỗi trước với bạn bè không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Lời xin lỗi chân thành đi kèm hành động khắc phục mới có thể chữa lành vết thương."]}', 6);

-- =========================================================================
-- BÀI HỌC 3: Ranh giới, Lòng tin & Sự Tôn trọng (Boundaries, Trust & Respect)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'ranh-gioi-long-tin-va-su-ton-trong',
    'Ranh giới, Lòng tin & Sự Tôn trọng',
    'Tìm hiểu về ranh giới cá nhân, cách từng bước xây dựng lòng tin và tôn trọng không gian riêng tư của nhau.',
    'Bài học hướng dẫn bạn cách xác định ranh giới cơ thể và cảm xúc của bản thân, xử lý tình huống bị đòi mật khẩu mạng xã hội và rèn luyện kỹ năng từ chối tự tin.',
    16,
    false,
    100,
    10
);
SET @lesson3_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson3_id, 'Scarleteen - Quickies: Healthy Relationships', 'https://www.scarleteen.com/read/relationships/quickies-healthy-relationships', 'website');

-- --- Micro Lesson 3.1: Vòng tròn ranh giới cá nhân ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Vòng tròn ranh giới cá nhân', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Ranh giới cá nhân không phải là bức tường ngăn cách, mà là cánh cửa để mọi người biết cách bước vào."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Ranh giới vật lý: quyền quyết định ai được đụng chạm vào cơ thể bạn.", "Ranh giới cảm xúc: quyền giữ những suy nghĩ riêng, nói không khi thấy quá tải.", "Mỗi người có một vòng tròn ranh giới rộng hẹp khác nhau, cần được tôn trọng."]}', 2),
(@ml_id, 'scenario', '{"title": "Những cái ôm bất ngờ", "body": "Vy thích khoác vai bạn bè, nhưng Linh lại thấy khó chịu khi bị đụng chạm đột ngột. Linh phân vân không biết có nên nói thẳng với Vy không."}', 3),
(@ml_id, 'flashcard', '{"front": "Ranh giới cá nhân (Personal Boundaries) là gì và gồm những loại nào?", "back": "Là những giới hạn bạn đặt ra để tự bảo vệ sự thoải mái của mình. Gồm: Ranh giới cơ thể (ai được đụng chạm) và Ranh giới cảm xúc (giữ suy nghĩ riêng, biết từ chối khi thấy quá tải).", "notes": "Thiết lập ranh giới giúp mọi người biết cách tôn trọng bạn."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có ranh giới nào về mặt cơ thể hoặc không gian riêng tư mà bạn không muốn ai vượt qua không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Ranh giới của bạn là do bạn quyết định. Người thực sự quý bạn sẽ tôn trọng nó."]}', 6);

-- --- Micro Lesson 3.2: Lòng tin không tự nhiên có ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Lòng tin không tự nhiên có', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Lòng tin giống như một cây non, cần thời gian tưới tắm mới lớn khôn."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Lòng tin được xây dựng từ những hành động nhỏ nhất: giữ đúng lời hứa, đi học đúng giờ.", "Lòng tin dễ vỡ và rất khó để lấy lại sau khi bị phản bội.", "Tin tưởng không có nghĩa là mù quáng bỏ qua mọi nghi ngờ."]}', 2),
(@ml_id, 'scenario', '{"title": "Giữ bí mật", "body": "Minh kể với Hoàng về việc mình đang thầm thích một bạn lớp bên, nhờ Hoàng giữ bí mật. Hôm sau, cả lớp đều xì xầm bàn tán về chuyện này."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động của Hoàng ảnh hưởng thế nào đến lòng tin?", "choices": [{"text": "Phá vỡ lòng tin của Minh và làm rạn nứt tình bạn giữa hai người.", "correct": true, "emoji": "💚"}, {"text": "Không sao cả, chuyện nhỏ nhặt này kể cho vui tai thôi mà.", "correct": false, "emoji": "😐"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã bao giờ hối hận vì trao lòng tin nhầm người chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Lòng tin cần được xây dựng qua hành động nhất quán, chứ không qua lời hứa suông."]}', 6);

-- --- Micro Lesson 3.3: Sự tôn trọng đến từ điều nhỏ nhặt ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Sự tôn trọng đến từ điều nhỏ nhặt', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tôn trọng người khác bắt đầu từ việc tôn trọng sự riêng tư của họ."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Không tự ý đọc tin nhắn, xem nhật ký hay lục lọi đồ đạc của bạn bè.", "Chấp nhận sự khác biệt về quan điểm, tôn giáo hay sở thích.", "Luôn hỏi ý kiến trước khi chia sẻ ảnh của bạn bè lên mạng xã hội."]}', 2),
(@ml_id, 'scenario', '{"title": "Bức ảnh dìm hàng", "body": "Quân tự ý đăng bức ảnh chụp lúc Vy đang ngáp ngủ lên trang cá nhân làm trò đùa. Vy thấy vô cùng xấu hổ và yêu cầu Quân gỡ xuống."}', 3),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại hành vi sau vào hộp Tôn trọng hay Xâm phạm quyền riêng tư:", "leftBox": {"title": "Tôn trọng riêng tư"}, "rightBox": {"title": "Xâm phạm riêng tư"}, "items": [{"text": "Luôn hỏi ý kiến bạn trước khi chia sẻ ảnh của bạn lên mạng", "correctBox": "left"}, {"text": "Tự ý đọc trộm nhật ký hoặc tin nhắn điện thoại của bạn", "correctBox": "right"}, {"text": "Gõ cửa trước khi vào phòng riêng của người khác", "correctBox": "left"}, {"text": "Lục lọi cặp sách, ví tiền của bạn để xem có gì", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã bao giờ bị bạn bè chia sẻ hình ảnh hoặc bí mật cá nhân lên mạng mà chưa hỏi ý kiến chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tôn trọng quyền riêng tư là thể hiện sự trưởng thành và văn minh trong mối quan hệ."]}', 6);

-- --- Micro Lesson 3.4: Tình huống: Mật khẩu mạng xã hội ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Tình huống: Mật khẩu mạng xã hội', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chia sẻ mật khẩu tài khoản mạng xã hội có phải là bằng chứng của tình yêu chân chính?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mật khẩu cá nhân là ranh giới riêng tư tuyệt đối, bảo vệ danh tính của bạn.", "Đòi mật khẩu để kiểm soát tin nhắn là dấu hiệu của sự thiếu lòng tin.", "Yêu thương lành mạnh tôn trọng không gian cá nhân của nhau."]}', 2),
(@ml_id, 'scenario', '{"title": "Đòi mật khẩu", "body": "Nam yêu cầu Trang đưa mật khẩu Facebook để chứng minh Trang không nhắn tin với bạn nam khác. Trang thấy không thoải mái."}', 3),
(@ml_id, 'interaction', '{"question": "Trang nên phản hồi thế nào để bảo vệ ranh giới cá nhân?", "choices": [{"text": "Đành đưa mật khẩu cho Nam để tránh cãi vã.", "correct": false, "emoji": "🙁"}, {"text": "Từ chối: Tớ yêu cậu nhưng tớ muốn giữ quyền riêng tư cá nhân. Tụi mình nên tin tưởng nhau thay vì kiểm soát mật khẩu.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng chia sẻ mật khẩu cá nhân của mình cho bạn bè hoặc người yêu không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Yêu thương không đồng nghĩa với việc từ bỏ quyền riêng tư cơ bản của bản thân."]}', 6);

-- --- Micro Lesson 3.5: Cách đặt ranh giới cứng rắn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Cách đặt ranh giới cứng rắn', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Học cách nói ''Không'' dứt khoát nhưng không làm tổn thương mối quan hệ."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sử dụng ngôn ngữ cơ thể: nhìn thẳng mắt đối phương, đứng thẳng.", "Dùng lời nói ngắn gọn, rõ ràng: Tớ không thoải mái với điều này.", "Không cần phải giải thích dông dài hay xin lỗi vì đã đặt ranh giới."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời rủ rê trốn học", "body": "Nhóm bạn rủ Duy trốn tiết học thêm để đi chơi game. Duy muốn ở lại ôn thi nhưng sợ bị nhóm gọi là nhát gan."}', 3),
(@ml_id, 'interaction', '{"question": "Duy nên từ chối thế nào cho hiệu quả?", "choices": [{"text": "Tớ bận tí việc gia đình... chắc không đi được... xin lỗi nhé.", "correct": false, "emoji": "🙁"}, {"text": "Tớ cần ôn thi cho bài kiểm tra ngày mai rồi. Các cậu đi chơi vui vẻ nhé!", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thấy bản thân có dễ dàng nói lời từ chối trước lời rủ rê của bạn thân không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đặt ranh giới là bảo vệ chính mình, không phải là ích kỷ hay xa cách bạn bè."]}', 6);

-- =========================================================================
-- BÀI HỌC 4: Sự Gắn kết & Gần gũi Cảm xúc (Intimacy & Emotional Closeness)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'su-gan-ket-va-gan-gui-cam-xuc',
    'Sự Gắn kết & Gần gũi Cảm xúc',
    'Tìm hiểu về sự thân mật cảm xúc, phân biệt tình bạn với tình yêu tuổi học trò và xây dựng gắn kết lành mạnh.',
    'Bài học chia sẻ về cách thấu hiểu sự gắn kết tinh thần, xử lý áp lực khi đối phương muốn tiến xa hơn và các hình thức gần gũi phi thể xác.',
    17,
    false,
    100,
    10
);
SET @lesson4_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson4_id, 'Scarleteen - Quickies: Intimacy', 'https://www.scarleteen.com/read/quickies-intimacy', 'website');

-- --- Micro Lesson 4.1: Sự thân mật cảm xúc là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Sự thân mật cảm xúc là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Gần gũi không chỉ là đụng chạm cơ thể. Đó còn là sự kết nối giữa hai tâm hồn."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thân mật cảm xúc là cảm giác an toàn khi chia sẻ bí mật, ước mơ hay nỗi sợ.", "Được lắng nghe và thấu cảm mà không sợ bị phán xét.", "Xây dựng tình bạn bền chặt cũng cần sự thân mật cảm xúc này."]}', 2),
(@ml_id, 'scenario', '{"title": "Chia sẻ áp lực học tập", "body": "Vy tâm sự với Nam về nỗi sợ thi trượt cấp 3 và áp lực từ kỳ vọng của bố mẹ. Nam yên lặng lắng nghe, nắm tay động viên Vy."}', 3),
(@ml_id, 'flashcard', '{"front": "Sự thân mật cảm xúc (Emotional Intimacy) là gì?", "back": "Là cảm giác an toàn và tin cậy tuyệt đối để mở lòng chia sẻ những bí mật, ước mơ hay nỗi sợ với người khác mà không lo sợ bị phán xét hay chế giễu.", "notes": "Thân mật cảm xúc là nền tảng bền chặt nhất cho mọi mối quan hệ."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có một người bạn thân nào sẵn sàng lắng nghe mọi tâm tư thầm kín của bạn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Kết nối cảm xúc là chìa khóa mở cánh cửa cho một tình bạn hay tình yêu lâu dài."]}', 6);

-- --- Micro Lesson 4.2: Tình bạn thân thiết vs Tình yêu tuổi học trò ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Tình bạn thân thiết vs Tình yêu tuổi học trò', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao phân biệt giữa việc cực kỳ thích chơi cùng bạn thân và việc đã cảm nắng họ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tình bạn thân: muốn chia sẻ niềm vui, cùng đi học, đi chơi chung cả nhóm.", "Tình cảm lãng mạn (Crush/Yêu): cảm xúc rạo rực, muốn ở riêng bên nhau, có sự thu hút giới tính.", "Sự nhầm lẫn cảm xúc ở tuổi teen là rất bình thường, hãy cho bản thân thời gian suy ngẫm."]}', 2),
(@ml_id, 'scenario', '{"title": "Cảm giác lạ", "body": "An nhận ra dạo gần đây mình hay đỏ mặt khi đứng gần Linh và luôn để ý xem Linh nhắn tin với ai. Trước đó hai đứa là đôi bạn thân từ nhỏ."}', 3),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại cảm xúc của bạn An sau đây vào đúng hộp:", "leftBox": {"title": "Tình bạn thân thiết"}, "rightBox": {"title": "Tình cảm cảm nắng (Crush)"}, "items": [{"text": "Muốn học nhóm chung, đi chơi cùng nhóm bạn đông vui", "correctBox": "left"}, {"text": "Tim đập nhanh, đỏ mặt lúng túng khi đứng gần đối phương", "correctBox": "right"}, {"text": "Chia sẻ chuyện trường lớp thoải mái và tự nhiên", "correctBox": "left"}, {"text": "Hay tò mò nhìn trộm đối phương và để ý xem họ đang nhắn tin với ai", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng bị nhầm lẫn cảm xúc giữa một tình bạn rất thân và một tình yêu học trò chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Nhận diện đúng cảm xúc giúp bạn ứng xử phù hợp và bảo vệ tình bạn quý giá."]}', 6);

-- --- Micro Lesson 4.3: Áp lực tiến xa hơn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Áp lực tiến xa hơn', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đừng để nhịp độ của người khác ép buộc bước đi của chính bạn."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mỗi người có tốc độ phát triển tâm sinh lý và mức độ sẵn sàng khác nhau.", "Bạn có quyền từ chối các đụng chạm thân mật (ôm, hôn) nếu thấy chưa sẵn sàng.", "Yêu thương lành mạnh không ép buộc hay dùng tình cảm để mặc cả."]}', 2),
(@ml_id, 'scenario', '{"title": "Đòi nụ hôn đầu", "body": "Quân thúc ép Trang cho Quân hôn má để chứng minh Trang yêu Quân thực lòng. Trang thấy lo lắng và chưa muốn làm việc đó."}', 3),
(@ml_id, 'interaction', '{"question": "Trang nên phản ứng thế nào?", "choices": [{"text": "Nhắm mắt cho Quân hôn một cái để Quân không giận nữa.", "correct": false, "emoji": "🙁"}, {"text": "Nói rõ: Tớ quý cậu nhưng tớ chưa sẵn sàng cho việc này. Tụi mình cứ từ từ nhé.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy áp lực khi thấy bạn bè xung quanh đã hẹn hò hoặc có người yêu hết rồi không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mức độ sẵn sàng của bạn là ranh giới cao nhất. Không ai có quyền thúc ép bạn."]}', 6);

-- --- Micro Lesson 4.4: Tình huống: Nắm tay bất ngờ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Tình huống: Nắm tay bất ngờ', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đột ngột đụng chạm cơ thể có thể làm hỏng khoảnh khắc lãng mạn."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tự ý nắm tay hay bá vai khi đối phương chưa sẵn sàng dễ gây cảm giác khó chịu.", "Quan sát phản ứng cơ thể của họ: có rụt tay lại, có tránh né ánh mắt?", "Cách an toàn nhất là hỏi han nhẹ nhàng trước khi thực hiện hành động."]}', 2),
(@ml_id, 'scenario', '{"title": "Nắm tay dạo phố", "body": "Duy và Vy đang đi dạo. Duy định đưa tay nắm lấy tay Vy nhưng nhận thấy Vy đang ôm khư khư chiếc balo trước ngực."}', 3),
(@ml_id, 'interaction', '{"question": "Vy đang phát đi tín hiệu gì và Duy nên làm thế nào?", "choices": [{"text": "Vy đang muốn Duy giật lấy balo hộ. Duy nên chủ động giật balo ra rồi nắm tay.", "correct": false, "emoji": "🛑"}, {"text": "Vy đang giữ ranh giới phòng thủ. Duy nên đi bên cạnh trò chuyện tiếp và hỏi han thoải mái.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng lúng túng khi đối phương đột ngột nắm tay hoặc ôm lấy mình ở chỗ đông người chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hành vi đụng chạm cần có tín hiệu đèn xanh từ cả hai phía để thực sự lãng mạn."]}', 6);

-- --- Micro Lesson 4.5: Gắn kết phi thể xác ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Gắn kết phi thể xác', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có rất nhiều cách để xích lại gần nhau mà không cần chạm vào cơ thể."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cùng nhau làm bài tập, học nhóm hoặc tham gia hoạt động ngoại khóa.", "Viết thư tay chia sẻ cảm xúc, tặng những món quà handmade nhỏ xinh.", "Chia sẻ danh sách bài hát yêu thích, cùng xem một bộ phim hay trò chuyện sâu sắc."]}', 2),
(@ml_id, 'scenario', '{"title": "Playlist nhạc tặng bạn", "body": "Hoàng tự tay làm một playlist nhạc chứa các bài hát mang thông điệp vui tươi để tặng Vân khi biết Vân đang buồn chuyện gia đình."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm thế nào để gắn kết tình cảm phi thể xác lành mạnh?", "back": "Thông qua các hành động tinh tế như viết thư tay chia sẻ cảm xúc, tự làm playlist bài hát tặng nhau, cùng đi nhà sách học bài hoặc trao đổi những món quà handmade nhỏ.", "notes": "Có rất nhiều cách để xích lại gần nhau mà không cần đụng chạm cơ thể."}', 4),
(@ml_id, 'reflection', '{"question": "Cách bày tỏ sự quan tâm yêu thích của bạn đối với người thân thiết thường là gì?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Sự thấu hiểu và sẻ chia tinh thần là chất keo bền chặt nhất gắn kết hai người."]}', 6);

-- =========================================================================
-- BÀI HỌC 5: Đồng thuận trong Mối quan hệ (Consent)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'dong-thuan-trong-moi-quan-he',
    'Đồng thuận trong Mối quan hệ',
    'Hiểu sâu về khái niệm sự đồng thuận, quy tắc F.R.I.E.S cho tuổi teen và cách check-in tinh tế.',
    'Bài học trang bị cho bạn kiến thức cơ bản về sự đồng thuận tự nguyện, cách nhận biết tín hiệu đèn vàng, đèn đỏ trong tình cảm và cách tôn trọng quyền đổi ý.',
    18,
    false,
    100,
    10
);
SET @lesson5_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson5_id, 'Scarleteen - Quickies: Sexual Consent Basics', 'https://www.scarleteen.com/read/sex-sexuality/quickies-sexual-consent-basics', 'website');

-- --- Micro Lesson 5.1: Đồng thuận là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Đồng thuận là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đồng thuận không chỉ áp dụng cho người lớn. Đó là quy tắc tôn trọng cơ bản ở mọi lứa tuổi."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đồng thuận là sự đồng ý tự nguyện, hào hứng và rõ ràng từ cả hai phía.", "Đồng ý khi bị ép buộc, đe dọa hay nài nỉ không được coi là đồng thuận.", "Quy tắc F.R.I.E.S: Tự nguyện, Linh hoạt, Đầy đủ thông tin, Hào hứng, Cụ thể."]}', 2),
(@ml_id, 'scenario', '{"title": "Đồng ý vì nể bạn", "body": "Nam rủ Linh vào góc tối công viên nói chuyện. Linh ngập ngừng nói: Cũng được... nếu cậu muốn. Nhưng tay Linh bấu chặt vào vạt áo, mắt nhìn xuống đất."}', 3),
(@ml_id, 'flashcard', '{"front": "Quy tắc F.R.I.E.S biểu diễn 5 tiêu chí nào của sự đồng thuận?", "back": "F - Freely given (Tự nguyện), R - Reversible (Linh hoạt, dễ đổi ý), I - Informed (Đầy đủ thông tin), E - Enthusiastic (Hào hứng), S - Specific (Cụ thể cho từng hành vi).", "notes": "Thiếu bất kỳ yếu tố nào trong 5 từ trên đều không được coi là sự đồng thuận lành mạnh."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng đồng ý làm điều gì đó chỉ vì đối phương nài nỉ quá nhiều chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chỉ có tiếng Có hào hứng và tự nguyện mới là đèn xanh để đi tiếp."]}', 6);

-- --- Micro Lesson 5.2: Nhận diện đèn vàng ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Nhận diện đèn vàng', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đôi khi sự im lặng hoặc tránh né chứa đựng câu trả lời ''Không'' khó nói."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tín hiệu Đèn Vàng: ngập ngừng, cười trừ, im lặng, tránh ánh mắt, người cứng đờ.", "Khi thấy đèn vàng, bạn có nghĩa vụ phải dừng lại và check-in cảm xúc đối phương.", "Tiếp tục thực hiện hành động khi đối phương có đèn vàng là vi phạm ranh giới."]}', 2),
(@ml_id, 'scenario', '{"title": "Cúi đầu tránh né", "body": "Hoàng định nắm tay Chi khi đi xem phim. Chi không gạt tay ra nhưng cúi đầu, rụt tay sát người và im lặng."}', 3),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại tín hiệu cảm xúc của đối phương vào đúng hộp:", "leftBox": {"title": "Đèn Xanh (Đồng thuận xịn)"}, "rightBox": {"title": "Đèn Vàng (Cần dừng check-in)"}, "items": [{"text": "Mỉm cười rạng rỡ và chủ động tiến lại gần bạn", "correctBox": "left"}, {"text": "Im lặng tránh ánh mắt, người cứng đờ", "correctBox": "right"}, {"text": "Nói câu ''Tớ cũng muốn'' một cách hào hứng", "correctBox": "left"}, {"text": "Nói câu ''Cũng được...'' nhưng nét mặt lo âu bứt rứt", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ dùng sự im lặng hoặc tránh né để biểu đạt sự từ chối của mình chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Im lặng không phải là đồng ý. Đó có thể là lúc đối phương đang cần bạn dừng lại."]}', 6);

-- --- Micro Lesson 5.3: Quyền quay xe ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Quyền quay xe', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đồng thuận không phải là một giao kèo vĩnh viễn. Bạn được quyền đổi ý bất cứ lúc nào."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đồng thuận có tính linh hoạt (Reversible). Giây trước nói có, giây sau nói không là hoàn toàn bình thường.", "Đối phương phải lập tức dừng lại khi bạn nói dừng.", "Bạn không bao giờ phải cảm thấy tội lỗi khi đổi ý để bảo vệ sự thoải mái của mình."]}', 2),
(@ml_id, 'scenario', '{"title": "Dừng lại giữa chừng", "body": "Trang đồng ý để Quân ôm mình. Nhưng khi Quân ôm hơi chặt, Trang thấy ngạt thở và đẩy nhẹ Quân ra: Khoan đã Quân, tớ thấy hơi nhanh."}', 3),
(@ml_id, 'interaction', '{"question": "Phản ứng nào của Quân là Green Flag xịn?", "choices": [{"text": "Giận dỗi: Ơ hay, nãy đồng ý rồi mà giờ lại thế?", "correct": false, "emoji": "🙁"}, {"text": "Dừng lại ngay, nới lỏng tay: Tớ xin lỗi, tớ làm cậu khó chịu hả?", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thấy sợ hãi khi muốn thay đổi quyết định của mình trong một nhóm bạn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn luôn có quyền quay xe. Cơ thể và ranh giới của bạn là của riêng bạn."]}', 6);

-- --- Micro Lesson 5.4: Tình huống: Nụ hôn đầu bất ngờ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Tình huống: Nụ hôn đầu bất ngờ', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Cưỡng hôn bất ngờ có thực sự lãng mạn như trên phim ảnh?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Phim ảnh thường lãng mạn hóa các hành động tự ý đụng chạm thân mật.", "Ngoài đời thực, tự ý hôn khi chưa được cho phép dễ gây cảm giác sợ hãi và bị xúc phạm.", "Hỏi ý kiến trước khi hôn là tôn trọng tối thiểu đối phương."]}', 2),
(@ml_id, 'scenario', '{"title": "Nụ hôn bất chợt", "body": "Quân định cưỡng hôn Vy khi hai đứa đang ngồi nói chuyện riêng. Vy giật mình, đẩy mạnh Quân ra và tỏ vẻ giận dữ."}', 3),
(@ml_id, 'interaction', '{"question": "Hành vi của Quân là gì?", "choices": [{"text": "Là thể hiện tình cảm mãnh liệt lãng mạn.", "correct": false, "emoji": "🙁"}, {"text": "Là xâm hại ranh giới cá nhân khi chưa có sự đồng thuận.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có nghĩ rằng việc hỏi xin phép trước khi hôn làm mất đi sự bất ngờ lãng mạn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Lãng mạn chỉ có giá trị khi đi kèm sự an toàn và đồng thuận tự nguyện từ hai phía."]}', 6);

-- --- Micro Lesson 5.5: Cách check-in mượt mà ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Cách check-in mượt mà', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để hỏi ý kiến người ta mà không khiến bầu không khí bị sượng trân?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hỏi ý kiến không làm giảm đi sự ngọt ngào của khoảnh khắc.", "Hỏi han tinh tế thể hiện bạn quan tâm chân thành đến cảm giác của người ta.", "Hãy dùng những câu hỏi ngắn gọn, tự nhiên: Tớ nắm tay cậu được không?, Cậu thấy thoải mái chứ?"]}', 2),
(@ml_id, 'scenario', '{"title": "Ý định nắm tay", "body": "Duy muốn nắm tay Linh khi hai đứa đang đi dạo. Thay vì tự ý chụp lấy, Duy nhìn Linh và mỉm cười nhẹ."}', 3),
(@ml_id, 'interaction', '{"question": "Giúp Duy chọn câu hỏi check-in mượt nhất nhé:", "choices": [{"text": "Đưa tay đây tớ nắm xem nào.", "correct": false, "emoji": "😐"}, {"text": "Tớ nắm tay cậu được không?", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy tự tin hơn khi biết đối phương cũng hoàn toàn hào hứng muốn nắm tay mình?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Check-in tinh tế thể hiện sự tôn trọng và tạo ra sự tin tưởng tuyệt đối giữa hai bạn."]}', 6);

-- =========================================================================
-- BÀI HỌC 6: Crush, Hẹn hò & Cách Đối diện Lời Từ chối (Crushes & Rejection)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'crush-hen-ho-va-tu-choi',
    'Crush, Hẹn hò & Từ chối',
    'Khám phá cảm xúc cảm nắng, cách hẹn hò an toàn và ứng xử văn minh khi đối diện lời từ chối.',
    'Bài học cung cấp cho bạn cái nhìn thực tế về những cảm xúc ngượng ngùng tuổi teen, các bước chuẩn bị cho buổi hẹn hò an toàn và cách phục hồi cảm xúc sau khi bị từ chối.',
    19,
    false,
    100,
    10
);
SET @lesson6_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson6_id, 'Scarleteen - Crushes, Dating & Rejection', 'https://www.scarleteen.com/read/sex-sexuality/i-know-consent-awesome-rejection-not', 'website');

-- --- Micro Lesson 6.1: Khi con tim rung động ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Khi con tim rung động', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Cảm giác crush một người có gì kỳ lạ mà khiến đầu óc bạn cứ lơ lửng trên mây?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Crush là cảm xúc say nắng, ngưỡng mộ hoặc bị thu hút mạnh mẽ bởi ai đó.", "Bạn có thể đỏ mặt, ngượng ngùng hoặc hồi hộp mỗi khi nhìn thấy họ.", "Đây là một trải nghiệm lớn lên tự nhiên, đẹp đẽ và hết sức bình thường của tuổi teen."]}', 2),
(@ml_id, 'scenario', '{"title": "Bức thư tình giấu kín", "body": "Chi luôn lén nhìn Hoàng trong giờ ra chơi và dành hàng giờ để vẽ những hình trái tim nhỏ trong sổ tay, phân vân có nên thổ lộ không."}', 3),
(@ml_id, 'flashcard', '{"front": "Cảm giác say nắng (Crush) một người có bình thường không?", "back": "Hoàn toàn bình thường! Đó là một trải nghiệm lớn lên tự nhiên, đẹp đẽ và hết sức tự nhiên của tuổi dậy thì.", "notes": "Bạn không cần phải cảm thấy xấu hổ hay áp lực vì cảm xúc này."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đang crush một ai đó trong trường hoặc lớp học của mình chứ?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Crush là cảm xúc ngọt ngào giúp bạn nhận ra trái tim mình đã biết rung động."]}', 6);

-- --- Micro Lesson 6.2: Hẹn hò an toàn thế nào? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Hẹn hò an toàn thế nào?', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Buổi hẹn đầu tiên nên chuẩn bị những gì để vừa vui vẻ vừa an toàn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chọn địa điểm công cộng quen thuộc: quán trà sữa, công viên đông người.", "Tự chuẩn bị chi phí đi lại của mình để giữ tính chủ động.", "Báo trước cho một người bạn thân hoặc gia đình biết địa điểm bạn đến."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời rủ rê lúc nửa đêm", "body": "Bách rủ Vy đi chơi riêng lúc 10 giờ đêm tại một bãi đất trống vắng vẻ ngoại ô thành phố."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên làm thế nào?", "choices": [{"text": "Đồng ý đi luôn vì muốn chứng minh mình dũng cảm.", "correct": false, "emoji": "🛑"}, {"text": "Từ chối và gợi ý: Giờ đó muộn rồi, chiều mai tụi mình đi uống trà sữa ở quán gần trường nha.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thường thích chọn địa điểm nào nhất cho một buổi hẹn đi chơi với bạn bè?"}', 5),
(@ml_id, 'takeaway', '{"items": ["An toàn là điều kiện tiên quyết cho mọi cuộc hẹn hò vui vẻ."]}', 6);

-- --- Micro Lesson 6.3: Bị từ chối không phải là dấu chấm hết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Bị từ chối không phải là dấu chấm hết', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Từ chối (Rejection) là một phần tất yếu của cuộc sống. Nó đau, nhưng nó dạy tụi mình trưởng thành."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bị từ chối không có nghĩa là bạn kém cỏi hay xấu xí.", "Mọi người đều có quyền từ chối tình cảm của người khác, giống như bạn vậy.", "Cho phép bản thân buồn, khóc, nhưng đừng dằn vặt hay hạ thấp giá trị bản thân."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời từ chối lịch sự", "body": "Minh tỏ tình với Chi, Chi nhẹ nhàng từ chối: Tớ trân trọng tình cảm của cậu, nhưng hiện tại tớ chỉ muốn tập trung học tập thôi."}', 3),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại cách đối xử sau khi bị từ chối vào đúng hộp:", "leftBox": {"title": "Green Flag (Văn minh)"}, "rightBox": {"title": "Red Flag (Độc hại)"}, "items": [{"text": "Chấp nhận, tôn trọng quyết định của họ và giữ khoảng cách lịch sự", "correctBox": "left"}, {"text": "Khóc lóc ăn vạ, liên tục nài nỉ làm phiền bắt họ đổi ý", "correctBox": "right"}, {"text": "Tâm sự nỗi buồn với bạn bè thân thiết hoặc viết nhật ký", "correctBox": "left"}, {"text": "Đi nói xấu hoặc tung tin đồn thất thiệt để trả đũa đối phương", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã bao giờ trải qua cảm giác bị từ chối trong học tập hoặc tình cảm chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Lời từ chối của người khác là ranh giới của họ. Tôn trọng ranh giới là tôn trọng chính mình."]}', 6);

-- --- Micro Lesson 6.4: Tình huống: Cách ứng xử sau tỏ tình ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Tình huống: Cách ứng xử sau tỏ tình', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để giữ mối quan hệ bạn bè bình thường sau một lần tỏ tình thất bại?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đừng cố gắng tỏ ra không có chuyện gì xảy ra một cách gượng ép.", "Cho cả hai không gian riêng để cảm xúc bình lặng lại.", "Khi gặp lại, hãy cư xử lịch sự, tự nhiên, tránh trêu chọc hay làm sượng không khí."]}', 2),
(@ml_id, 'scenario', '{"title": "Cuộc chạm mặt ở hành lang", "body": "Sau khi bị Vân từ chối, Hoàng cảm thấy vô cùng sượng ngùng mỗi khi chạm mặt Vân ở hành lang lớp học."}', 3),
(@ml_id, 'interaction', '{"question": "Hoàng nên làm thế nào khi chạm mặt Vân?", "choices": [{"text": "Cúi mặt đi thẳng, giả vờ như không thấy Vân.", "correct": false, "emoji": "🙁"}, {"text": "Gật đầu mỉm cười nhẹ nhàng chào Vân rồi bước tiếp.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn lòng làm bạn lại với một người đã từng từ chối tình cảm của mình không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Ứng xử văn minh sau khi tỏ tình thất bại thể hiện sự tôn trọng và bản lĩnh của bạn."]}', 6);

-- --- Micro Lesson 6.5: Cách từ chối khéo léo ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Cách từ chối khéo léo', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Từ chối tình cảm của người khác mà không làm họ tổn thương sâu sắc."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nói lời cảm ơn vì họ đã trân trọng mình.", "Bày tỏ rõ ràng, dứt khoát quyết định của bản thân, tránh mập mờ thả thính.", "Dùng từ ngữ lịch sự, nhẹ nhàng nhưng không tạo ra hy vọng giả."]}', 2),
(@ml_id, 'scenario', '{"title": "Hộp quà sô-cô-la", "body": "Bình tặng sô-cô-la tỏ tình với Vy. Vy không thích Bình nhưng không muốn Bình phải xấu hổ trước lớp."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm thế nào để từ chối tình cảm của người khác một cách khéo léo?", "back": "Bước 1: Cảm ơn họ đã trân trọng mình. Bước 2: Bày tỏ rõ ràng, dứt khoát quyết định của bản thân để không tạo hy vọng giả. Bước 3: Giữ thái độ lịch sự nhẹ nhàng.", "notes": "Từ chối rõ ràng là sự tử tế cao nhất để tránh làm mất thời gian của nhau."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng phải từ chối tình cảm của ai bao giờ chưa? Bạn thấy điều đó có khó khăn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Từ chối rõ ràng là sự tử tế cao nhất để đối phương không phí thời gian hy vọng."]}', 6);

-- =========================================================================
-- BÀI HỌC 7: Nhận diện Cờ Đỏ & Mối Quan hệ Độc hại (Red Flags)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'co-do-va-moi-quan-he-doc-hai',
    'Nhận diện Cờ Đỏ & Mối Quan hệ Độc hại',
    'Nhận diện các dấu hiệu cảnh báo (Red Flags) như kiểm soát, cô lập và học cách bước ra an toàn.',
    'Bài học hướng dẫn bạn cách phân biệt sự quan tâm lành mạnh với sự kiểm soát độc hại, nhận biết vòng lặp bạo lực cảm xúc và cách tìm kiếm sự trợ giúp khi cần thiết.',
    20,
    false,
    100,
    10
);
SET @lesson7_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson7_id, 'Scarleteen - Red Flags & Unhealthy Relationships', 'https://www.scarleteen.com/read/relationships/quickies-healthy-relationships', 'website');

-- --- Micro Lesson 7.1: Thế nào là "Cờ Đỏ"? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Thế nào là "Cờ Đỏ"?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Cờ đỏ (Red Flag) là những tín hiệu cảnh báo bạn nên dừng lại và xem xét mối quan hệ."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Kiểm soát quá mức: đòi biết mọi tin nhắn, bắt báo cáo lịch trình.", "Ghen tuông bệnh lý: cấm cản nói chuyện với mọi người khác giới.", "Hạ thấp đối phương: chê bai ngoại hình, năng lực trước đám đông."]}', 2),
(@ml_id, 'scenario', '{"title": "Bắt báo cáo lịch trình", "body": "Nam bắt Trang phải chụp ảnh gửi qua Zalo mỗi khi Trang đi chơi với bất kỳ ai để kiểm tra xem Trang có nói dối không."}', 3),
(@ml_id, 'sorting', '{"instruction": "Hãy phân loại các hành vi ứng xử vào đúng hộp:", "leftBox": {"title": "Lành mạnh (Green Flag)"}, "rightBox": {"title": "Cờ Đỏ (Red Flag)"}, "items": [{"text": "Khuyên bạn đi học đúng giờ và chúc bạn làm bài tốt", "correctBox": "left"}, {"text": "Bắt bạn phải chụp hình gửi qua Zalo báo cáo vị trí liên tục", "correctBox": "right"}, {"text": "Khuyến khích bạn duy trì mối quan hệ tốt với bạn bè", "correctBox": "left"}, {"text": "Cấm đoán bạn nói chuyện hay gặp mặt tất cả những người khác giới", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng thấy bạn bè xung quanh bị người yêu cấm đoán đi chơi chung với nhóm bạn chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Yêu thương tôn trọng sự tự do cá nhân của nhau, chứ không giam lỏng bằng ghen tuông."]}', 6);

-- --- Micro Lesson 7.2: Vòng lặp độc hại ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Vòng lặp độc hại', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao nhiều người lại chấp nhận ở lại trong một mối quan hệ làm họ đau lòng hết lần này đến lần khác?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Vòng lặp bạo lực cảm xúc: Giận dỗi/Gây hấn -> Xin lỗi/Tặng quà mật ngọt -> Bình yên giả tạo -> Tiếp tục gây hấn.", "Lời ngọt ngào sau cơn giận dễ khiến nạn nhân quên đi tổn thương cũ.", "Nhận diện vòng lặp này để tìm cách cắt đứt."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời hứa ngọt ngào", "body": "Lâm vừa quát mắng Lan thậm tệ vì Lan đi học nhóm muộn. Hôm sau Lâm mua trà sữa mang đến tận lớp, khóc lóc hứa hẹn sẽ thay đổi."}', 3),
(@ml_id, 'flashcard', '{"front": "Vòng lặp bạo lực cảm xúc (Abuse Cycle) gồm những giai đoạn nào?", "back": "Giai đoạn 1: Giận dỗi/Gây hấn ➡️ Giai đoạn 2: Xin lỗi khóc lóc/Tặng quà mật ngọt ➡️ Giai đoạn 3: Bình yên giả tạo ➡️ Tiếp tục gây hấn.", "notes": "Lời hứa ngọt ngào sau cơn giận không xóa nhòa được bạo lực cảm xúc."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thấy quen thuộc với những người bạn cứ cãi nhau to rồi lại làm hòa ngọt ngào liên tục không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Quà cáp ngọt ngào không thể xóa nhòa sự thiếu tôn trọng và bạo lực cảm xúc."]}', 6);

-- --- Micro Lesson 7.3: Mệt mỏi hơn vui vẻ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Mệt mỏi hơn vui vẻ', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Mối quan hệ nên là nơi nương tựa, chứ không phải một cuộc chiến mệt mỏi mỗi ngày."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cảm thấy kiệt sức, mất tự tin sau mỗi lần nói chuyện với họ.", "Luôn phải nhún nhường, bỏ qua mong muốn của bản thân để họ vui vẻ.", "Mối quan hệ mang lại nhiều nước mắt hơn tiếng cười là lúc cần dừng lại."]}', 2),
(@ml_id, 'scenario', '{"title": "Mất đi nụ cười", "body": "Lan nhận ra dạo gần đây mình hay cáu gắt với mọi người xung quanh và học lực sa sút kể từ khi nhận lời yêu Lâm."}', 3),
(@ml_id, 'interaction', '{"question": "Lan nên làm gì?", "choices": [{"text": "Tiếp tục chịu đựng và cố gắng làm hài lòng Lâm nhiều hơn.", "correct": false, "emoji": "🙁"}, {"text": "Chia sẻ với bố mẹ/bạn bè và xem xét việc kết thúc mối quan hệ mệt mỏi này.", "correct": true, "emoji": "💚"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy năng lượng tích cực của mình bị hút cạn bởi một người bạn độc hại nào không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bảo vệ sức khỏe tinh thần của bạn quan trọng hơn việc giữ một mối quan hệ độc hại."]}', 6);

-- --- Micro Lesson 7.4: Tình huống: Bị cô lập ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Tình huống: Bị cô lập', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Khi người yêu muốn bạn là thế giới duy nhất của họ, hãy cẩn thận."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hành vi cấm cản chơi với bạn thân, cô lập bạn khỏi gia đình là dấu hiệu kiểm soát độc hại.", "Họ muốn bạn hoàn toàn phụ thuộc vào họ về mặt tình cảm.", "Mối quan hệ lành mạnh khuyến khích bạn duy trì các mối quan hệ xã hội tốt đẹp khác."]}', 2),
(@ml_id, 'scenario', '{"title": "Cấm chơi với bạn thân", "body": "Hoàng yêu cầu Vy không được đi uống nước với nhóm bạn thân cấp 2 vì Hoàng cảm thấy ghen và không thích nhóm đó."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên làm gì?", "choices": [{"text": "Nghe theo Hoàng để Hoàng được an lòng, tránh cãi nhau.", "correct": false, "emoji": "🙁"}, {"text": "Từ chối: Tớ trân trọng tình cảm của cậu, nhưng bạn bè cũng rất quan trọng với tớ. Tớ vẫn sẽ đi chơi với họ.", "correct": true, "emoji": "💚"}]}', 4),
-- (còn tiếp)
(@ml_id, 'reflection', '{"question": "Bạn từng thấy ai đó bỏ bê hoàn toàn bạn bè xung quanh sau khi có người yêu chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Một người yêu thương bạn thật lòng sẽ tôn trọng các mối quan hệ xã hội lành mạnh của bạn."]}', 6);

-- --- Micro Lesson 7.5: Cách bước ra an toàn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Cách bước ra an toàn', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Chia tay một mối quan hệ độc hại cần sự dứt khoát và an toàn."}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nói lời chia tay rõ ràng, dứt khoát ở nơi công cộng hoặc qua tin nhắn nếu sợ bị phản ứng bạo lực.", "Cắt đứt liên lạc, chặn tài khoản mạng xã hội để tránh bị làm phiền.", "Tìm kiếm sự giúp đỡ của bố mẹ, thầy cô hoặc gọi 111 nếu bị đe dọa bám đuôi."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời đe dọa chia tay", "body": "Khi Lan đòi chia tay, Lâm đe dọa sẽ đăng những ảnh riêng tư của Lan lên mạng xã hội hoặc tự làm đau bản thân."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm sao để bước ra an toàn khỏi mối quan hệ độc hại bị đe dọa?", "back": "Nói chia tay ở nơi công cộng hoặc qua tin nhắn nếu sợ bạo lực, cắt liên lạc (chặn tài khoản), và báo ngay cho bố mẹ/thầy cô hoặc gọi Tổng đài 111.", "notes": "Bạn không bao giờ cô đơn, luôn có sự hỗ trợ xung quanh!"}', 4),
(@ml_id, 'reflection', '{"question": "Nếu một người bạn thân của bạn đang gặp nguy hiểm trong mối quan hệ, bạn sẵn sàng giúp họ tìm kiếm sự hỗ trợ chứ?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không bao giờ phải đối mặt với nguy hiểm một mình. Hãy mạnh dạn tìm kiếm sự trợ giúp xung quanh!"]}', 6);


-- =========================================================================
-- BÀI KIỆM TRA BÀI HỌC 1: Thế nào là mối quan hệ lành mạnh?
-- =========================================================================
DELETE FROM micro_lesson_blocks 
WHERE micro_lesson_id IN (
    SELECT id FROM micro_lessons WHERE lesson_id = @lesson1_id AND title = 'Bài kiểm tra: Thử thách tổng kết'
);
DELETE FROM micro_lessons 
WHERE lesson_id = @lesson1_id AND title = 'Bài kiểm tra: Thử thách tổng kết';

INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id1 = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id1, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Thế nào là mối quan hệ lành mạnh?''! Bạn có 3 mạng để tự tin bảo vệ ranh giới bản thân."}', 1),
(@assessment_ml_id1, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Đặt ranh giới và giữ vững bình đẳng trong nhóm bạn",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn cùng bàn (Huy) thường tự ý quyết định mọi thứ trong nhóm học tập. Hôm nay, Huy tự ý đổi lịch họp nhóm sang ngày chủ nhật mà không hỏi ý kiến ai. Lịch này trùng với ca học thêm tiếng Anh rất quan trọng của bạn.",
      "choices": [
        { "text": "Im lặng và chấp nhận lịch họp để giữ hòa khí, chấp nhận trốn học tiếng Anh.", "nextNode": "fail_compromise" },
        { "text": "Nhẹ nhàng nhưng thẳng thắn nhắn tin: ''Chủ nhật tớ bận học tiếng Anh rồi. Tụi mình bình đẳng đóng góp ý kiến nên tớ đề xuất chuyển lịch sang chiều thứ bảy hoặc tối thứ sáu nhé.''", "nextNode": "step2" },
        { "text": "Tức giận rời khỏi nhóm chat học tập chung và nhắn tin mắng Huy là kẻ ích kỷ.", "nextNode": "fail_rage" }
      ]
    },
    "step2": {
      "text": "Huy bất ngờ và cằn nhằn trong nhóm: ''Mọi lần tớ quyết có sao đâu, cậu khó tính thế, làm cả nhóm mất công đổi lịch!''. Cả nhóm đang im lặng chờ phản ứng của bạn.",
      "choices": [
        { "text": "Thấy áy náy nên vội vàng nhắn xin lỗi cả nhóm và chấp nhận đi học nhóm ngày chủ nhật.", "nextNode": "fail_guilt" },
        { "text": "Kiên định lập trường, nhắn rõ ràng: ''Mối quan hệ lành mạnh cần có sự bình đẳng và tôn trọng ý kiến cả hai phía. Tớ muốn tụi mình cùng thảo luận lịch rảnh chung để mọi người đều thấy thoải mái.''", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Huy nhận ra mình hơi quá đà nên đồng ý đổi lịch sang chiều thứ bảy. Buổi họp nhóm diễn ra vui vẻ. Tối đó, một bạn trong nhóm rủ bạn mua áo nhóm siêu đắt để thể hiện ''sự gắn kết''. Bạn không đủ tiền tiêu vặt.",
      "choices": [
        { "text": "Nói thật về điều kiện kinh tế của mình và đề xuất chọn mẫu áo khác có giá cả phù hợp hơn cho tất cả mọi người.", "nextNode": "success_end" },
        { "text": "Vay mượn nợ nần hoặc nói dối bố mẹ xin tiền học thêm để mua bằng được để tránh bị coi là ''kém cỏi'' so với các bạn.", "nextNode": "fail_starve" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn toàn chính xác! Bạn đã đặt ranh giới cá nhân rõ ràng, bảo vệ quyền bình đẳng của mình trong nhóm và biết cách ứng phó lành mạnh trước áp lực bạn bè.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_compromise": {
      "text": "❌ Sai rồi! Hy sinh việc học tập quan trọng chỉ để nịnh bợ hay chiều lòng người khác là tự xóa bỏ ranh giới và tính bình đẳng trong mối quan hệ.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_rage": {
      "text": "❌ Chưa đúng! Phản ứng nóng nảy và mắng mỏ chỉ làm mâu thuẫn leo thang và phá vỡ sự kết nối lành mạnh. Hãy chọn cách giao tiếp thẳng thắn trước.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_guilt": {
      "text": "❌ Sai rồi! Cảm giác tội lỗi không có cơ sở và nhượng bộ trước sự ích kỷ của người khác không phải là biểu hiện của một mối quan hệ lành mạnh.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_starve": {
      "text": "❌ Chưa đúng! Chạy theo những món đồ đắt đỏ vượt quá khả năng chỉ vì áp lực đồng trang lứa là đánh mất sự tự chủ của bản thân.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id1, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các hành vi trong mối quan hệ:",
  "leftBox": { "title": "Lành mạnh (Green Flag)" },
  "rightBox": { "title": "Bất ổn (Red/Amber Flag)" },
  "items": [
    { "text": "Tôn trọng sở thích cá nhân và gu thời trang khác biệt của bạn bè", "correctBox": "left" },
    { "text": "Ép bạn bè phải thay đổi kiểu tóc, trang phục theo ý thích của mình", "correctBox": "right" },
    { "text": "Cảm thấy an tâm, vui vẻ và được tự do bày tỏ ý kiến cá nhân", "correctBox": "left" },
    { "text": "Luôn cảm thấy nơm nớp lo sợ đối phương giận dỗi khi mình không rep tin nhắn ngay", "correctBox": "right" },
    { "text": "Thẳng thắn trao đổi, chia sẻ chi phí khi cùng đi uống nước ăn uống", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id1, 'matching', '{
  "instruction": "Ghép cặp các viên gạch nền tảng của mối quan hệ lành mạnh với định nghĩa phù hợp:",
  "pairs": [
    { "left": "Tôn trọng (Respect)", "right": "Coi trọng cảm xúc, ý kiến và ranh giới cá nhân của nhau." },
    { "left": "Lòng tin (Trust)", "right": "Tin tưởng đối phương mà không cần kiểm soát hay theo dõi." },
    { "left": "Bình đẳng (Equality)", "right": "Cả hai có quyền đóng góp và quyết định ngang nhau trong mối quan hệ." },
    { "left": "Sự tự chủ (Autonomy)", "right": "Giữ vững cá tính riêng và sở thích độc lập của bản thân." }
  ]
}', 4),
(@assessment_ml_id1, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành triết lý về mối quan hệ lành mạnh:",
  "sentence": "Mối quan hệ lành mạnh bắt nguồn từ sự [blank1] và tôn trọng lẫn nhau. Hãy biết lắng nghe [blank2] khi cảm thấy bất an hay lo âu. Giữ vững [blank3] riêng và tự tin từ chối áp lực [blank4] từ nhóm bạn.",
  "blanks": {
    "blank1": { "correct": "bình đẳng", "placeholder": "..." },
    "blank2": { "correct": "cơ thể", "placeholder": "..." },
    "blank3": { "correct": "cá tính", "placeholder": "..." },
    "blank4": { "correct": "bắt chước", "placeholder": "..." }
  },
  "words": ["bình đẳng", "cơ thể", "cá tính", "bắt chước", "kiểm soát", "im lặng", "giả vờ", "áp đặt"]
}', 5),
(@assessment_ml_id1, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Khi bạn liên tục cảm thấy tim đập nhanh, cơ thể co cứng, và lo sợ mỗi khi nhận cuộc gọi hay tin nhắn từ một người bạn bè, điều này có ý nghĩa gì?",
  "enableLives": true,
  "choices": [
    { "text": "Đó là tín hiệu cảnh báo của cơ thể cho thấy mối quan hệ này đang có vấn đề bất ổn và thiếu an toàn.", "correct": true, "emoji": "💚" },
    { "text": "Bạn đang quá nhạy cảm và yếu đuối, cần tập cách chịu đựng và bỏ qua cảm giác đó.", "correct": false, "emoji": "😐" },
    { "text": "Người bạn đó rất yêu quý bạn và đang muốn thu hút sự chú ý đặc biệt từ bạn.", "correct": false, "emoji": "🙁" },
    { "text": "Cơ thể bạn đang bị kiệt sức do học tập quá tải, không liên quan gì đến bạn bè.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI KIỆM TRA BÀI HỌC 2: Giao tiếp & Giải quyết Xung đột
-- =========================================================================
DELETE FROM micro_lesson_blocks 
WHERE micro_lesson_id IN (
    SELECT id FROM micro_lessons WHERE lesson_id = @lesson2_id AND title = 'Bài kiểm tra: Thử thách tổng kết'
);
DELETE FROM micro_lessons 
WHERE lesson_id = @lesson2_id AND title = 'Bài kiểm tra: Thử thách tổng kết';

INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id2 = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id2, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Giao tiếp & Giải quyết Xung đột''! Hãy dùng kỹ năng giao tiếp mượt mà để hạ hỏa các mâu thuẫn."}', 1),
(@assessment_ml_id2, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Giao tiếp thông thái và hòa giải xung đột",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn và bạn cùng nhóm (Duy) đang tranh cãi gay gắt về phân chia công việc trong nhóm. Duy làm sai và chậm tiến độ khiến bạn rất bực mình. Bạn cảm thấy mặt nóng bừng lên và chuẩn bị to tiếng.",
      "choices": [
        { "text": "Nhận biết cơn giận, hít sâu 3 nhịp và chủ động đề xuất: ''Tụi mình đang hơi nóng, để chiều bình tĩnh rồi nói tiếp nha.'' để tránh to tiếng.", "nextNode": "step2" },
        { "text": "Quát lớn vào mặt Duy: ''Lúc nào cậu cũng vô trách nhiệm như vậy, làm hỏng hết bài của cả nhóm!'' rồi đập bàn bỏ đi.", "nextNode": "fail_anger" },
        { "text": "Im lặng tỏ vẻ khinh bỉ, tự lấy bài về làm một mình và không nói chuyện với Duy nữa.", "nextNode": "fail_silent" }
      ]
    },
    "step2": {
      "text": "Chiều đến, khi cả hai đã bình tĩnh hơn, Duy cố gắng giải thích lý do làm chậm nhưng giọng điệu có vẻ vẫn tự ái. Bạn muốn bày tỏ sự khó chịu của mình một cách lành mạnh.",
      "choices": [
        { "text": "Cắt ngang lời Duy: ''Cậu đừng bao biện nữa. Cậu lúc nào cũng cẩu thả và bắt người khác gánh việc!''", "nextNode": "fail_blame" },
        { "text": "Dùng câu bắt đầu bằng ''Tớ'': ''Tớ cảm thấy hơi hụt hẫng và lo lắng khi phần bài của cậu bị trễ vì nó ảnh hưởng trực tiếp đến điểm số của cả nhóm.'' và lắng nghe Duy chia sẻ.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Duy nghe xong thấy bớt phòng thủ và chủ động xin lỗi. Tuy nhiên, tối đó Duy nhắn tin giải thích thêm nhưng chỉ rep lại vỏn vẹn chữ ''Ừ'' khiến bạn hoang mang lo sợ Duy vẫn ghét mình.",
      "choices": [
        { "text": "Không suy diễn tiêu cực, gọi điện trực tiếp hỏi thăm: ''Duy ơi, lúc nãy thấy nhắn ngắn tớ sợ cậu còn bận hay có chuyện gì. Tụi mình thống nhất cách sửa bài nhé!''", "nextNode": "success_end" },
        { "text": "Lập tức hủy kết bạn và viết status bóng gió chửi Duy là kẻ hai mặt trên trang cá nhân.", "nextNode": "fail_toxic_status" }
      ]
    },
    "success_end": {
      "text": "🎉 Tuyệt vời! Bạn đã nhận diện cơn giận tốt, biết cách dùng câu bắt đầu bằng ''Tớ'' để nói về cảm xúc và không rơi vào cạm bẫy suy diễn tin nhắn chữ.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_anger": {
      "text": "❌ Chưa đúng! Trút giận bằng cách to tiếng, xúc phạm người khác chỉ làm tổn thương mối quan hệ và không giải quyết được vấn đề công việc.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_silent": {
      "text": "❌ Sai rồi! ''Chiến tranh lạnh'' và tự gánh việc làm một mình chỉ tích tụ sự ức chế bên trong và phá hỏng tinh thần làm việc nhóm.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_blame": {
      "text": "❌ Sai rồi! Sử dụng những câu bắt đầu bằng ''Cậu'' kèm theo các từ cực đoan (luôn luôn, lúc nào cũng) sẽ kích hoạt chế độ phòng thủ của đối phương.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_toxic_status": {
      "text": "❌ Chưa đúng! Suy diễn nội dung tin nhắn rep ngắn và mang mâu thuẫn lên mạng xã hội để trả đũa là hành vi vô cùng độc hại.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id2, 'sorting', '{
  "instruction": "Hãy phân loại câu nói/hành vi giao tiếp sau đây:",
  "leftBox": { "title": "Bày tỏ cảm xúc lành mạnh" },
  "rightBox": { "title": "Đổ lỗi/Trách móc độc hại" },
  "items": [
    { "text": "Tớ thấy hơi buồn khi cậu quên cuộc hẹn của tụi mình hôm qua", "correctBox": "left" },
    { "text": "Cậu lúc nào cũng cao su, không bao giờ tôn trọng giờ giấc của ai cả", "correctBox": "right" },
    { "text": "Tớ lo lắng khi thấy cậu tắt máy ngang xương mà không báo trước", "correctBox": "left" },
    { "text": "Cậu cố tình phớt lờ tin nhắn của tớ để chọc tức tớ đúng không", "correctBox": "right" },
    { "text": "Tớ cảm thấy quá tải khi phải gánh toàn bộ phần thuyết trình của nhóm", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id2, 'matching', '{
  "instruction": "Ghép cặp các quy tắc giao tiếp và giải quyết xung đột sau:",
  "pairs": [
    { "left": "Lắng nghe chủ động", "right": "Tập trung thấu hiểu cảm xúc đối phương, không ngắt lời hay phán xét." },
    { "left": "Hòa giải bước 1", "right": "Chấp nhận lỗi sai và xin lỗi chân thành, không tìm lý do bao biện." },
    { "left": "Hòa giải bước 2", "right": "Lắng nghe cảm nhận của đối phương về tổn thương mà mình đã gây ra." },
    { "left": "Hòa giải bước 3", "right": "Cùng nhau thảo luận đưa ra giải pháp cụ thể để không lặp lại lỗi cũ." }
  ]
}', 4),
(@assessment_ml_id2, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về giải quyết xung đột:",
  "sentence": "Giao tiếp lành mạnh đòi hỏi sự lắng nghe [blank1] thay vì nghe để cãi. Khi bày tỏ sự bất mãn, hãy dùng cấu trúc bắt đầu bằng từ [blank2] để tránh đổ lỗi. Nếu cơn giận bùng phát, hãy chủ động xin [blank3] để hạ nhiệt. Hãy giải quyết xung đột bằng các hành động [blank4] cụ thể.",
  "blanks": {
    "blank1": { "correct": "chủ động", "placeholder": "..." },
    "blank2": { "correct": "Tớ", "placeholder": "..." },
    "blank3": { "correct": "tạm dừng", "placeholder": "..." },
    "blank4": { "correct": "khắc phục", "placeholder": "..." }
  },
  "words": ["chủ động", "Tớ", "tạm dừng", "khắc phục", "Cậu", "im lặng", "tranh cãi", "đối phó"]
}', 5),
(@assessment_ml_id2, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Tại sao chúng ta nên hạn chế tối đa việc giải quyết các mâu thuẫn lớn hoặc nhạy cảm thông qua tin nhắn chữ?",
  "enableLives": true,
  "choices": [
    { "text": "Vì tin nhắn chữ thiếu tông giọng, nét mặt, rất dễ khiến người đọc suy diễn tiêu cực và hiểu lầm nghiêm trọng.", "correct": true, "emoji": "💚" },
    { "text": "Vì nhắn tin chữ tốn nhiều tiền cước mạng điện thoại và làm tốn thời gian gõ bàn phím.", "correct": false, "emoji": "😐" },
    { "text": "Vì tin nhắn chữ không thể hiện hết được sự giận dữ mãnh liệt của bạn để dằn mặt đối phương.", "correct": false, "emoji": "🙁" },
    { "text": "Vì đối phương có thể chụp màn hình tin nhắn của bạn để gửi cho giáo viên hoặc phụ huynh.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI KIỂM TRA BÀI HỌC 3: Ranh giới, Lòng tin & Sự Tôn trọng
-- =========================================================================
DELETE FROM micro_lesson_blocks 
WHERE micro_lesson_id IN (
    SELECT id FROM micro_lessons WHERE lesson_id = @lesson3_id AND title = 'Bài kiểm tra: Thử thách tổng kết'
);
DELETE FROM micro_lessons 
WHERE lesson_id = @lesson3_id AND title = 'Bài kiểm tra: Thử thách tổng kết';

INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id3 = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id3, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Ranh giới, Lòng tin & Sự Tôn trọng''! Bạn có 3 mạng để bảo vệ vương quốc riêng tư của mình."}', 1),
(@assessment_ml_id3, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Tự tin thiết lập ranh giới cá nhân trước sự kiểm soát",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn phát hiện bạn thân hoặc người yêu của mình tự ý cầm điện thoại đọc tin nhắn Zalo lúc bạn đi rửa tay. Khi bị hỏi, đối phương thản nhiên nói: ''Yêu nhau/Chơi thân thì phải cởi mở, không giấu giếm gì nhau mới là tin tưởng, sao phải giữ mật khẩu làm gì?''.",
      "choices": [
        { "text": "Đưa mật khẩu và cho phép đối phương đọc thoải mái để chứng minh mình trong sạch.", "nextNode": "fail_submit" },
        { "text": "Lấy lại điện thoại, đặt mật khẩu mới và nói: ''Tớ yêu quý cậu nhưng tin nhắn là không gian cá nhân của tớ. Tụi mình cần lòng tin thực sự chứ không phải sự kiểm soát điện thoại.''", "nextNode": "step2" },
        { "text": "Giật phắt điện thoại, mắng mỏ đối phương thậm tệ rồi đập vỡ điện thoại ngay tại chỗ.", "nextNode": "fail_violence" }
      ]
    },
    "step2": {
      "text": "Đối phương tỏ vẻ giận dỗi, im lặng suốt cả buổi và nhắn tin bảo rằng bạn đã thay đổi, không còn coi họ là quan trọng nữa.",
      "choices": [
        { "text": "Mủi lòng và cảm thấy tội lỗi, quyết định gửi mật khẩu điện thoại qua tin nhắn để làm hòa.", "nextNode": "fail_guilt" },
        { "text": "Kiên định ranh giới, cho đối phương thời gian bình tĩnh và nhắn: ''Tôn trọng quyền riêng tư là nguyên tắc cơ bản giúp mối quan hệ bền vững. Khi nào cậu bình tĩnh, tụi mình nói chuyện tiếp nhé.''", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Đối phương nhận ra lỗi sai và xin lỗi bạn. Ngày hôm sau, nhóm bạn thân rủ bạn trốn học thêm để đi net chơi game, dọa rằng: ''Không đi thì từ sau đừng chơi chung với nhóm nữa!''.",
      "choices": [
        { "text": "Từ chối dứt khoát: ''Tớ cần ôn bài cho bài kiểm tra ngày mai rồi. Các cậu đi chơi vui nhé!'' mà không giải thích vòng vo.", "nextNode": "success_end" },
        { "text": "Lo sợ bị cô lập nên chấp nhận trốn học đi theo nhóm bạn để giữ tình bạn.", "nextNode": "fail_peer_pressure" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn toàn chính xác! Bạn đã bảo vệ xuất sắc ranh giới riêng tư, không nhượng bộ trước sự thao túng cảm xúc và tự tin từ chối áp lực từ nhóm bạn.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_submit": {
      "text": "❌ Sai rồi! Đồng ý chia sẻ mật khẩu cá nhân chỉ để chiều lòng sự kiểm soát của đối phương là bạn đang tự hủy hoại ranh giới riêng tư cần thiết của mình.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_violence": {
      "text": "❌ Chưa đúng! Hành vi bạo lực hoặc tức giận thái quá không giải quyết được mâu thuẫn ranh giới mà còn biến bạn thành người sai trước.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_guilt": {
      "text": "❌ Sai rồi! Nhượng bộ chỉ vì cảm thấy áy náy trước sự giận dỗi vô lý sẽ tạo tiền lệ xấu cho sự lấn lướt ranh giới sau này.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_peer_pressure": {
      "text": "❌ Chưa đúng! Trốn học chỉ vì sợ nhóm bạn tẩy chay chứng tỏ bạn chưa biết cách đặt ranh giới cứng rắn để bảo vệ tương lai của chính mình.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id3, 'sorting', '{
  "instruction": "Hãy phân loại các hành vi ứng xử sau đây:",
  "leftBox": { "title": "Tôn trọng ranh giới" },
  "rightBox": { "title": "Xâm phạm ranh giới" },
  "items": [
    { "text": "Gõ cửa trước khi vào phòng riêng của người khác", "correctBox": "left" },
    { "text": "Đòi mật khẩu mạng xã hội để kiểm tra tin nhắn của người yêu", "correctBox": "right" },
    { "text": "Luôn hỏi ý kiến bạn bè trước khi đăng ảnh dìm hàng họ lên mạng", "correctBox": "left" },
    { "text": "Tự ý lục cặp sách hoặc ví tiền của bạn học khi họ ra chơi", "correctBox": "right" },
    { "text": "Chấp nhận lời từ chối và không nài nỉ khi bạn nói không muốn đi chơi", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id3, 'matching', '{
  "instruction": "Ghép cặp các khái niệm ranh giới và định nghĩa phù hợp:",
  "pairs": [
    { "left": "Ranh giới vật lý", "right": "Quyền quyết định ai được phép đụng chạm vào cơ thể của bạn." },
    { "left": "Ranh giới cảm xúc", "right": "Quyền giữ suy nghĩ riêng tư, nói không khi cảm thấy quá tải." },
    { "left": "Lòng tin (Trust)", "right": "Sự tin cậy được xây dựng từ những hành động nhỏ, nhất quán." },
    { "left": "Tôn trọng riêng tư", "right": "Không tò mò lục lọi đồ đạc, tin nhắn cá nhân khi chưa được cho phép." }
  ]
}', 4),
(@assessment_ml_id3, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về ranh giới cá nhân:",
  "sentence": "Ranh giới cá nhân giúp bảo vệ sự [blank1] của bạn. Lòng tin không tự nhiên có mà cần được xây dựng qua [blank2] nhất quán. Tôn trọng ranh giới nghĩa là không xâm phạm quyền [blank3] của nhau. Hãy dứt khoát nói [blank4] trước những lời rủ rê vi phạm nguyên tắc sống của bạn.",
  "blanks": {
    "blank1": { "correct": "thoải mái", "placeholder": "..." },
    "blank2": { "correct": "hành động", "placeholder": "..." },
    "blank3": { "correct": "riêng tư", "placeholder": "..." },
    "blank4": { "correct": "không", "placeholder": "..." }
  },
  "words": ["thoải mái", "hành động", "riêng tư", "không", "kiểm soát", "mật khẩu", "giữ bí mật", "thỏa hiệp"]
}', 5),
(@assessment_ml_id3, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Khi đối phương đòi hỏi mật khẩu các tài khoản mạng xã hội của bạn để ''chứng minh tình cảm chân thành'', hành động này phản ánh điều gì?",
  "enableLives": true,
  "choices": [
    { "text": "Đó là dấu hiệu của sự kiểm soát độc hại và thiếu lòng tin, vi phạm nghiêm trọng ranh giới cá nhân.", "correct": true, "emoji": "💚" },
    { "text": "Đó là biểu hiện của một tình yêu sâu sắc, sẵn sàng chia sẻ mọi bí mật riêng tư với nhau.", "correct": false, "emoji": "😐" },
    { "text": "Đó là hành vi bình thường giúp cả hai bảo mật tài khoản tốt hơn trước các hacker.", "correct": false, "emoji": "🙁" },
    { "text": "Đó là dấu hiệu cho thấy đối phương đang muốn giúp bạn quản lý hộp thư để tránh tin nhắn rác.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI KIỂM TRA BÀI HỌC 4: Sự Gắn kết & Gần gũi Cảm xúc
-- =========================================================================
DELETE FROM micro_lesson_blocks 
WHERE micro_lesson_id IN (
    SELECT id FROM micro_lessons WHERE lesson_id = @lesson4_id AND title = 'Bài kiểm tra: Thử thách tổng kết'
);
DELETE FROM micro_lessons 
WHERE lesson_id = @lesson4_id AND title = 'Bài kiểm tra: Thử thách tổng kết';

INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id4 = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id4, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Sự Gắn kết & Gần gũi Cảm xúc''! Bạn có 3 mạng để hiểu đúng về tình cảm tuổi học trò."}', 1),
(@assessment_ml_id4, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Kết nối cảm xúc và tôn trọng tốc độ của đối phương",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn (An) nhận ra dạo gần đây mình hay đỏ mặt khi đi bên cạnh Vy - người bạn thân từ thuở nhỏ. Bạn luôn để ý xem Vy nói chuyện với ai và thấy hơi ghen tuông. Bạn nhận ra mình đã cảm nắng Vy.",
      "choices": [
        { "text": "Tránh mặt Vy hoàn toàn để không phải đối mặt với cảm xúc ngượng ngùng này.", "nextNode": "fail_avoidance" },
        { "text": "Chấp nhận cảm xúc tự nhiên, cho bản thân thời gian suy ngẫm để phân biệt giữa tình bạn thân thiết và cảm lãng mạn thực sự.", "nextNode": "step2" },
        { "text": "Tỏ tình dồn dập ngay hôm sau, bắt Vy phải trả lời đồng ý làm người yêu ngay lập tức.", "nextNode": "fail_pressure" }
      ]
    },
    "step2": {
      "text": "Sau một thời gian, hai bạn chính thức hẹn hò. Trong một buổi đi chơi riêng, Vy định nắm tay bạn, nhưng nhận thấy bạn đang khoác chặt hai tay vào chiếc balo trước ngực.",
      "choices": [
        { "text": "Vy tinh tế nhận ra tín hiệu phòng thủ, tiếp tục đi bên cạnh trò chuyện tự nhiên và tôn trọng tốc độ sẵn sàng của bạn.", "nextNode": "step3" },
        { "text": "Vy cố tình giật balo ra và chủ động nắm tay bạn bằng được vì nghĩ yêu nhau là phải nắm tay mới lãng mạn.", "nextNode": "fail_touch" }
      ]
    },
    "step3": {
      "text": "Bạn vô cùng cảm kích sự tinh tế của Vy. Tuy nhiên, Vy lại nghe đám bạn xung quanh thúc giục: ''Yêu nhau là phải ôm hôn tiến xa hơn, chứ cứ nắm tay thôi thì nhạt nhẽo lắm!''. Vy cảm thấy áp lực lớn.",
      "choices": [
        { "text": "Ép bản thân thực hiện các đụng chạm thân mật dù chưa thấy sẵn sàng để chiều lòng nhóm bạn.", "nextNode": "fail_peer" },
        { "text": "Vy giữ vững ranh giới và cùng bạn tập trung xây dựng sự gắn kết phi thể xác (viết thư tay, cùng đi nhà sách học bài, làm playlist nhạc tặng nhau).", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Tuyệt vời! Bạn đã phân biệt đúng cảm xúc bản thân, tôn trọng ranh giới đụng chạm và biết cách xây dựng sự gắn kết cảm xúc phi thể xác lành mạnh.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_avoidance": {
      "text": "❌ Chưa phù hợp! Đột ngột tránh mặt bạn thân mà không giải thích chỉ làm rạn nứt mối quan hệ tốt đẹp sẵn có một cách vô lý.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_pressure": {
      "text": "❌ Sai rồi! Tỏ tình dồn dập và ép buộc câu trả lời sẽ khiến đối phương sợ hãi và làm căng thẳng tình bạn.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_touch": {
      "text": "❌ Sai rồi! Phớt lờ tín hiệu cơ thể phòng thủ của đối phương và ép buộc đụng chạm là hành vi thiếu tôn trọng ranh giới cá nhân.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_peer": {
      "text": "❌ Chưa đúng! Thực hiện các hành vi thân mật thể xác chỉ vì áp lực đồng trang lứa là vi phạm ranh giới cơ thể và thiếu tự chủ.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id4, 'sorting', '{
  "instruction": "Hãy phân loại các cảm xúc/hành vi sau đây vào đúng hộp:",
  "leftBox": { "title": "Tình bạn thân thiết" },
  "rightBox": { "title": "Tình cảm say nắng (Crush)" },
  "items": [
    { "text": "Muốn đi chơi chung cả nhóm bạn đông vui và thoải mái tếu táo", "correctBox": "left" },
    { "text": "Tim đập nhanh, đỏ mặt lúng túng khi đứng gần đối phương", "correctBox": "right" },
    { "text": "Thoải mái chia sẻ chuyện học hành, trường lớp tự nhiên không ngần ngại", "correctBox": "left" },
    { "text": "Hay nhìn trộm đối phương và để ý xem họ đang nói chuyện với bạn khác giới nào", "correctBox": "right" },
    { "text": "Mong muốn có những buổi đi chơi riêng chỉ có hai người bên nhau", "correctBox": "right" }
  ]
}', 3),
(@assessment_ml_id4, 'matching', '{
  "instruction": "Ghép cặp các khái niệm về sự gắn kết lãng mạn dậy thì sau:",
  "pairs": [
    { "left": "Thân mật cảm xúc", "right": "Cảm giác an toàn tuyệt đối khi chia sẻ ước mơ, nỗi sợ mà không bị phán xét." },
    { "left": "Tín hiệu đèn xanh", "right": "Thái độ cởi mở (như mỉm cười, hướng người về phía bạn, sẵn lòng tương tác)." },
    { "left": "Tín hiệu phòng thủ", "right": "Hành vi tránh né đụng chạm (như ôm balo trước ngực, rụt tay lại, lảng tránh ánh mắt)." },
    { "left": "Gắn kết phi thể xác", "right": "Kết nối cảm xúc qua việc tự làm playlist nhạc tặng nhau, viết thư tay chia sẻ." }
  ]
}', 4),
(@assessment_ml_id4, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn sau về sự gắn kết:",
  "sentence": "Sự thân mật cảm xúc mang lại cảm giác [blank1] để mở lòng. Cần phân biệt rõ tình bạn thân thiết với cảm xúc [blank2] lãng mạn. Hãy tôn trọng [blank3] sẵn sàng đụng chạm của đối phương. Gắn kết tình cảm bằng sự thấu hiểu [blank4] là chất keo bền chặt nhất.",
  "blanks": {
    "blank1": { "correct": "an toàn", "placeholder": "..." },
    "blank2": { "correct": "say nắng", "placeholder": "..." },
    "blank3": { "correct": "mức độ", "placeholder": "..." },
    "blank4": { "correct": "tinh thần", "placeholder": "..." }
  },
  "words": ["an toàn", "say nắng", "mức độ", "tinh thần", "áp lực", "thể xác", "nghi ngờ", "vật lý"]
}', 5),
(@assessment_ml_id4, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Khi đối phương có phản ứng co người lại, tránh né ánh mắt hoặc ôm chặt balo trước ngực khi bạn tiến lại gần, bạn nên ứng phó như thế nào?",
  "enableLives": true,
  "choices": [
    { "text": "Hãy dừng lại và tôn trọng không gian cá nhân của họ, đó là tín hiệu phòng thủ cảnh báo họ chưa sẵn sàng cho đụng chạm thể xác.", "correct": true, "emoji": "💚" },
    { "text": "Tiếp tục tiến tới nắm tay hoặc bá vai để giúp họ giải tỏa sự ngượng ngùng nhanh hơn.", "correct": false, "emoji": "😐" },
    { "text": "Tỏ thái độ giận dỗi và trách móc họ ích kỷ, không thực sự yêu quý hay trân trọng bạn.", "correct": false, "emoji": "🙁" },
    { "text": "Cắt đứt liên lạc ngay lập tức vì cho rằng họ ghét bỏ hoặc coi thường mình.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI KIỂM TRA BÀI HỌC 5: Đồng thuận trong Mối quan hệ
-- =========================================================================
DELETE FROM micro_lesson_blocks 
WHERE micro_lesson_id IN (
    SELECT id FROM micro_lessons WHERE lesson_id = @lesson5_id AND title = 'Bài kiểm tra: Thử thách tổng kết'
);
DELETE FROM micro_lessons 
WHERE lesson_id = @lesson5_id AND title = 'Bài kiểm tra: Thử thách tổng kết';

INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id5 = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id5, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Đồng thuận trong Mối quan hệ''! Bạn có 3 mạng để thực hành sự đồng thuận thông thái."}', 1),
(@assessment_ml_id5, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Làm chủ sự đồng thuận tự nguyện và check-in cảm xúc",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn (Trang) đang ngồi nói chuyện riêng với Nam trong công viên. Nam ghé sát lại định hôn bạn, nhưng bạn cảm thấy ngột ngạt và đẩy nhẹ Nam ra: ''Khoan đã Nam, tớ thấy hơi nhanh''. Nam đứng khựng lại vẻ mặt hụt hẫng.",
      "choices": [
        { "text": "Nhắm mắt chịu đựng cho Nam hôn một cái để Nam không bị quê và giận dỗi.", "nextNode": "fail_guilt" },
        { "text": "Dứt khoát giữ khoảng cách và bày tỏ rõ ràng: ''Tớ quý cậu nhưng tớ chưa sẵn sàng cho việc này. Tụi mình nói chuyện tiếp nhé!''", "nextNode": "step2" },
        { "text": "Hét lớn tố cáo Nam biến thái rồi tát mạnh vào mặt Nam trước đám đông.", "nextNode": "fail_violence" }
      ]
    },
    "step2": {
      "text": "Nam im lặng một lúc rồi cằn nhằn: ''Lần trước cậu đồng ý nắm tay rồi, sao giờ ôm hôn lại từ chối? Cậu làm tớ tụt cả cảm hứng!''. Bạn cảm thấy áy náy vô cùng.",
      "choices": [
        { "text": "Cảm thấy tội lỗi vì làm người yêu buồn, đành gật đầu chấp nhận quay xe đồng ý hôn Nam.", "nextNode": "fail_revert" },
        { "text": "Kiên định giải thích quy tắc ranh giới: ''Đồng ý việc này không có nghĩa là đồng ý việc kia, và tớ được quyền đổi ý bất cứ lúc nào tớ thấy không thoải mái. Cậu nên tôn trọng cảm giác của tớ chứ!''", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Nam nhận ra mình sai và xin lỗi Trang. Hôm sau, Duy muốn nắm tay Linh lúc đi dạo phố. Thay vì đột ngột chụp lấy tay Linh, Duy nhìn Linh mỉm cười nhẹ và muốn check-in đồng thuận.",
      "choices": [
        { "text": "Duy hỏi nhẹ nhàng: ''Tớ nắm tay cậu được không?'' và chờ đợi phản hồi hào hứng từ Linh.", "nextNode": "success_end" },
        { "text": "Duy đột ngột giật lấy tay Linh bỏ vào túi áo của mình để chứng tỏ sự chủ động lãng mạn.", "nextNode": "fail_grab" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn toàn chính xác! Bạn đã hiểu sâu sắc quyền đổi ý (Reversible), bảo vệ ranh giới cơ thể và biết cách thực hành check-in đồng thuận mượt mà lịch sự.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_guilt": {
      "text": "❌ Sai rồi! Chấp nhận đụng chạm thể xác chỉ vì nể nang hoặc sợ đối phương giận dỗi là vi phạm ranh giới cơ thể và không có sự đồng thuận tự nguyện.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_violence": {
      "text": "❌ Chưa phù hợp! Phản ứng bạo lực khi chưa có hành vi đe dọa nguy hiểm là không cần thiết và làm phức tạp hóa vấn đề giao tiếp ranh giới.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_revert": {
      "text": "❌ Sai rồi! Nhượng bộ trước sự giận dỗi ép buộc của đối phương sẽ khiến bạn mất quyền kiểm soát ranh giới cơ thể của chính mình.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_grab": {
      "text": "❌ Chưa đúng! Tự ý chụp lấy tay đối phương khi chưa hỏi ý kiến dễ gây cảm giác khó chịu và vi phạm ranh giới cá nhân đột ngột.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id5, 'sorting', '{
  "instruction": "Hãy phân loại các tín hiệu cảm xúc của đối phương:",
  "leftBox": { "title": "Đèn Xanh (Đồng thuận xịn)" },
  "rightBox": { "title": "Đèn Vàng (Cần dừng check-in)" },
  "items": [
    { "text": "Nói câu ''Tớ cũng muốn'' kèm nụ cười rạng rỡ và chủ động tiến lại gần", "correctBox": "left" },
    { "text": "Im lặng tránh né ánh mắt, người hơi co cứng lại", "correctBox": "right" },
    { "text": "Vui vẻ chủ động đưa tay ra nắm lấy tay bạn trước", "correctBox": "left" },
    { "text": "Nói câu ''Cũng được...'' nhưng nét mặt lo âu, bứt rứt bấu vạt áo", "correctBox": "right" },
    { "text": "Trả lời ngập ngừng ''Để tớ nghĩ đã...'' rồi cười trừ tránh né", "correctBox": "right" }
  ]
}', 3),
(@assessment_ml_id5, 'matching', '{
  "instruction": "Ghép cặp các tiêu chí trong quy tắc đồng thuận F.R.I.E.S sau:",
  "pairs": [
    { "left": "Freely given (Tự nguyện)", "right": "Đồng ý không do bị nài nỉ, ép buộc, đe dọa hay nịnh bợ." },
    { "left": "Reversible (Linh hoạt)", "right": "Quyền được thay đổi quyết định, quay xe bất cứ lúc nào." },
    { "left": "Informed (Đầy đủ thông tin)", "right": "Biết rõ mình đang đồng ý thực hiện hành vi gì và với ai." },
    { "left": "Enthusiastic (Hào hứng)", "right": "Chỉ làm những việc mà cả hai thực sự muốn và vui vẻ." }
  ]
}', 4),
(@assessment_ml_id5, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về sự đồng thuận:",
  "sentence": "Đồng thuận là sự đồng ý [blank1], hào hứng từ cả hai phía. Bạn luôn có quyền [blank2] đổi ý bất cứ lúc nào mà không cần cảm thấy tội lỗi. Sự im lặng hay cười trừ là tín hiệu [blank3] đòi hỏi bạn phải dừng lại. Hãy thực hành [blank4] mượt mà để thể hiện sự tôn trọng đối phương.",
  "blanks": {
    "blank1": { "correct": "tự nguyện", "placeholder": "..." },
    "blank2": { "correct": "quay xe", "placeholder": "..." },
    "blank3": { "correct": "đèn vàng", "placeholder": "..." },
    "blank4": { "correct": "check-in", "placeholder": "..." }
  },
  "words": ["tự nguyện", "quay xe", "đèn vàng", "check-in", "bắt buộc", "im lặng", "áp đặt", "nài nỉ"]
}', 5),
(@assessment_ml_id5, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Ý nghĩa thực sự của chữ R - Reversible (Linh hoạt/Dễ đổi ý) trong quy tắc đồng thuận F.R.I.E.S là gì?",
  "enableLives": true,
  "choices": [
    { "text": "Bạn có quyền rút lại sự đồng ý và dừng hành động lại bất cứ lúc nào, kể cả khi trước đó bạn đã nói Có.", "correct": true, "emoji": "💚" },
    { "text": "Bạn chỉ được phép đổi ý trước khi buổi hẹn hò bắt đầu, sau đó thì bắt buộc phải thực hiện.", "correct": false, "emoji": "😐" },
    { "text": "Đối phương có quyền bắt bạn thực hiện nếu bạn đã lỡ đồng ý một lần trước đó.", "correct": false, "emoji": "🙁" },
    { "text": "Sự đồng ý có giá trị vĩnh viễn và không thể thay đổi trong suốt mối quan hệ.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI KIỂM TRA BÀI HỌC 6: Crush, Hẹn hò & Cách Đối diện Lời Từ chối
-- =========================================================================
DELETE FROM micro_lesson_blocks 
WHERE micro_lesson_id IN (
    SELECT id FROM micro_lessons WHERE lesson_id = @lesson6_id AND title = 'Bài kiểm tra: Thử thách tổng kết'
);
DELETE FROM micro_lessons 
WHERE lesson_id = @lesson6_id AND title = 'Bài kiểm tra: Thử thách tổng kết';

INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id6 = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id6, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Crush, Hẹn hò & Từ chối''! Bạn có 3 mạng để thể hiện ứng xử văn minh và bảo vệ sự an toàn."}', 1),
(@assessment_ml_id6, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Đối diện với từ chối và hẹn hò an toàn",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn (Minh) lấy hết dũng khí viết thư tỏ tình với bạn cùng lớp (Chi). Chi nhẹ nhàng từ chối vì muốn tập trung học tập. Bạn cảm thấy vô cùng buồn bã, thất vọng và tự ái dồn dập.",
      "choices": [
        { "text": "Liên tục nhắn tin nài nỉ làm phiền, đòi Chi giải thích lý do cụ thể và khóc lóc ăn vạ.", "nextNode": "fail_pester" },
        { "text": "Chấp nhận nỗi buồn, tôn trọng quyết định của Chi và tâm sự với bạn thân hoặc viết nhật ký để giải tỏa cảm xúc.", "nextNode": "step2" },
        { "text": "Tức giận đi nói xấu Chi kiêu căng, chảnh chọe trên nhóm chat khác để trả đũa.", "nextNode": "fail_revenge" }
      ]
    },
    "step2": {
      "text": "Sau một tuần, khi đi trên hành lang lớp học, bạn vô tình chạm mặt Chi đi ngược chiều. Cả hai đều có vẻ ngượng ngùng.",
      "choices": [
        { "text": "Cúi gằm mặt xuống đất, giả vờ như không nhìn thấy Chi và đi thẳng thật nhanh qua chỗ khác.", "nextNode": "fail_avoid" },
        { "text": "Chủ động gật đầu mỉm cười nhẹ nhàng chào Chi rồi bước tiếp để giữ sự tự nhiên lịch sự.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Chi mỉm cười chào lại, giúp không khí bớt sượng trân. Tối đó, một bạn nam khác rủ bạn đi chơi lúc 10 giờ đêm tại một bãi đất trống vắng vẻ ngoại ô thành phố.",
      "choices": [
        { "text": "Từ chối lịch sự và gợi ý địa điểm an toàn hơn: ''Giờ đó muộn rồi, chiều mai tụi mình đi uống trà sữa ở quán gần trường nha!''", "nextNode": "success_end" },
        { "text": "Đồng ý đi luôn vì muốn chứng tỏ mình dũng cảm, sành điệu và tin tưởng đối phương tuyệt đối.", "nextNode": "fail_danger" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn hảo! Bạn đã vượt qua nỗi buồn bị từ chối một cách văn minh, ứng xử tự nhiên lịch sự và biết cách bảo vệ sự an toàn cho bản thân khi hẹn hò.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_pester": {
      "text": "❌ Sai rồi! Liên tục nài nỉ và làm phiền chỉ làm đối phương khó chịu và vi phạm ranh giới từ chối của họ.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_revenge": {
      "text": "❌ Sai rồi! Nói xấu trả đũa sau khi bị từ chối là hành vi cờ đỏ độc hại và thiếu tôn trọng đối phương.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_avoid": {
      "text": "❌ Chưa phù hợp! Trốn né gượng ép chỉ làm tăng thêm sự sượng sùng lâu dài trong mối quan hệ bạn học bè sau này.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_danger": {
      "text": "❌ Chưa đúng! Hẹn hò lúc khuya muộn tại nơi vắng vẻ là hành vi thiếu an toàn, đẩy bản thân vào nguy cơ gặp nguy hiểm thể xác.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id6, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các hành vi ứng xử sau:",
  "leftBox": { "title": "Green Flag (Văn minh)" },
  "rightBox": { "title": "Red Flag (Độc hại)" },
  "items": [
    { "text": "Chấp nhận, tôn trọng quyết định từ chối và giữ khoảng cách lịch sự", "correctBox": "left" },
    { "text": "Khóc lóc ăn vạ, liên tục nài nỉ làm phiền bắt họ đổi ý", "correctBox": "right" },
    { "text": "Tâm sự nỗi buồn với bạn thân hoặc viết nhật ký giải tỏa", "correctBox": "left" },
    { "text": "Đi nói xấu hoặc tung tin đồn thất thiệt để trả đũa đối phương", "correctBox": "right" },
    { "text": "Từ chối tình cảm rõ ràng, dứt khoát và khéo léo không mập mờ thả thính", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id6, 'matching', '{
  "instruction": "Ghép cặp các khái niệm hẹn hò và từ chối với định nghĩa tương ứng:",
  "pairs": [
    { "left": "Crush (Say nắng)", "right": "Cảm xúc rung động, ngưỡng mộ tự nhiên tuổi dậy thì." },
    { "left": "Hẹn hò an toàn", "right": "Chọn địa điểm công cộng, tự chủ đi lại và báo cho người thân." },
    { "left": "Từ chối rõ ràng", "right": "Sự tử tế cao nhất để tránh làm mất thời gian hy vọng giả của nhau." },
    { "left": "Bền bỉ cảm xúc", "right": "Khả năng chấp nhận thực tế và tự phục hồi sau khi bị từ chối." }
  ]
}', 4),
(@assessment_ml_id6, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành triết lý hẹn hò văn minh:",
  "sentence": "Cảm giác say nắng một người là trải nghiệm [blank1] tuổi mới lớn. Khi hẹn hò, hãy luôn đặt sự [blank2] lên hàng đầu. Đối diện với lời từ chối bằng thái độ [blank3] và tôn trọng ranh giới của họ. Từ chối tình cảm của người khác một cách dứt khoát và [blank4] để không tạo hy vọng giả.",
  "blanks": {
    "blank1": { "correct": "tự nhiên", "placeholder": "..." },
    "blank2": { "correct": "an toàn", "placeholder": "..." },
    "blank3": { "correct": "văn minh", "placeholder": "..." },
    "blank4": { "correct": "khéo léo", "placeholder": "..." }
  },
  "words": ["tự nhiên", "an toàn", "văn minh", "khéo léo", "xấu hổ", "bí mật", "độc hại", "mập mờ"]
}', 5),
(@assessment_ml_id6, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Khi bạn muốn từ chối tình cảm của một người bạn một cách khéo léo, cách ứng xử nào dưới đây là tử tế nhất?",
  "enableLives": true,
  "choices": [
    { "text": "Cảm ơn tình cảm của họ, bày tỏ dứt khoát và rõ ràng quyết định của mình để không tạo ra hy vọng giả.", "correct": true, "emoji": "💚" },
    { "text": "Im lặng hoàn toàn, chặn liên lạc và giả vờ như không biết để họ tự hiểu và chán nản bỏ cuộc.", "correct": false, "emoji": "😐" },
    { "text": "Nhận lời yêu thử một thời gian xem thế nào để tránh làm tổn thương tình cảm của họ ngay lập tức.", "correct": false, "emoji": "🙁" },
    { "text": "Tỏ thái độ khinh miệt và trêu chọc họ trước mặt đông bạn bè khác trong lớp để họ bỏ cuộc.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI KIỂM TRA BÀI HỌC 7: Nhận diện Cờ Đỏ & Mối Quan hệ Độc hại
-- =========================================================================
DELETE FROM micro_lesson_blocks 
WHERE micro_lesson_id IN (
    SELECT id FROM micro_lessons WHERE lesson_id = @lesson7_id AND title = 'Bài kiểm tra: Thử thách tổng kết'
);
DELETE FROM micro_lessons 
WHERE lesson_id = @lesson7_id AND title = 'Bài kiểm tra: Thử thách tổng kết';

INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id7 = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id7, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Nhận diện Cờ Đỏ & Mối Quan hệ Độc hại''! Hãy dũng cảm bảo vệ sức khỏe tinh thần và sự an toàn của mình."}', 1),
(@assessment_ml_id7, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Nhận diện vòng lặp độc hại và bước ra an toàn",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn (Vy) nhận thấy dạo gần đây người yêu (Lâm) hay quát mắng bạn thậm tệ mỗi khi bạn đi học nhóm muộn. Nhưng ngay hôm sau, Lâm lại mua trà sữa mang đến lớp, khóc lóc hứa hẹn sẽ thay đổi. Bạn cảm thấy kiệt sức và sa sút học tập.",
      "choices": [
        { "text": "Tiếp tục tha thứ và cố gắng làm hài lòng Lâm nhiều hơn để tránh cãi vã.", "nextNode": "fail_cycle" },
        { "text": "Nhận diện vòng lặp bạo lực cảm xúc, chia sẻ câu chuyện với bố mẹ hoặc bạn thân để xin lời khuyên và xem xét chia tay.", "nextNode": "step2" },
        { "text": "Tự làm đau bản thân để Lâm cảm thấy hối hận và đối xử tốt với mình hơn.", "nextNode": "fail_self_harm" }
      ]
    },
    "step2": {
      "text": "Được mọi người động viên, bạn nhắn tin chia tay Lâm. Lâm lập tức đe dọa sẽ đăng những hình ảnh chụp chung riêng tư của bạn lên mạng xã hội nếu bạn dám bỏ rơi Lâm.",
      "choices": [
        { "text": "Sợ hãi nên đành quay lại và chấp nhận mọi yêu cầu kiểm soát của Lâm để giữ bí mật.", "nextNode": "fail_submit_threat" },
        { "text": "Chụp màn hình đe dọa làm bằng chứng, cắt đứt liên lạc (chặn tài khoản) và báo ngay cho bố mẹ, thầy cô hoặc gọi Tổng đài 111 để được bảo vệ kịp thời.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Nhờ sự can thiệp của gia đình và nhà trường, Lâm đã bị xử lý và dừng hành vi đe dọa. Bạn lấy lại sự tự tin. Ngày hôm sau, bạn thấy cô bạn thân đang bị người yêu cấm chơi với nhóm bạn của mình.",
      "choices": [
        { "text": "Khuyên bạn thân mạnh dạn đặt ranh giới và chỉ ra rằng sự cấm đoán, cô lập là một Cờ Đỏ nghiêm trọng.", "nextNode": "success_end" },
        { "text": "Khuyên bạn nên nghe lời người yêu để giữ gìn hòa khí và hạnh phúc lứa đôi.", "nextNode": "fail_support_isolation" }
      ]
    },
    "success_end": {
      "text": "🎉 Tuyệt vời! Bạn đã nhận diện cờ đỏ chính xác, dũng cảm bước ra khỏi vòng lặp độc hại an toàn, biết cách xử lý khi bị đe dọa và hỗ trợ bạn bè đúng cách.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_cycle": {
      "text": "❌ Sai rồi! Liên tục chấp nhận và tha thứ chỉ khiến bạn lún sâu vào vòng lặp bạo lực cảm xúc (gây hấn -> xin lỗi mật ngọt -> gây hấn).",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_self_harm": {
      "text": "❌ Sai rồi! Tự làm hại bản thân là hành vi cực đoan gây hại nghiêm trọng cho sức khỏe tinh thần và thể chất, không giải quyết được gốc rễ vấn đề.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_submit_threat": {
      "text": "❌ Chưa đúng! Nhượng bộ trước đe dọa sẽ khiến đối phương lấn lướt ranh giới hơn và tiếp tục kiểm soát bạn bằng các chiêu trò bạo lực tinh thần khác.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_support_isolation": {
      "text": "❌ Chưa đúng! Ủng hộ việc cô lập bạn bè khỏi các mối quan hệ xã hội là dung túng cho hành vi kiểm soát độc hại của đối phương.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id7, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các hành vi sau đây:",
  "leftBox": { "title": "Lành mạnh (Green Flag)" },
  "rightBox": { "title": "Cờ Đỏ (Red Flag)" },
  "items": [
    { "text": "Khuyến khích bạn duy trì các mối quan hệ xã hội lành mạnh với bạn bè, gia đình", "correctBox": "left" },
    { "text": "Bắt bạn phải chụp hình gửi Zalo báo cáo vị trí liên tục để kiểm tra xem có nói dối không", "correctBox": "right" },
    { "text": "Chúc bạn làm bài đạt điểm cao và khuyên bạn nên đi học đúng giờ", "correctBox": "left" },
    { "text": "Cấm đoán bạn nói chuyện hay gặp mặt tất cả những người khác giới", "correctBox": "right" },
    { "text": "Đe dọa sẽ tự tử hoặc tung ảnh riêng tư của bạn lên mạng nếu bạn đòi chia tay", "correctBox": "right" }
  ]
}', 3),
(@assessment_ml_id7, 'matching', '{
  "instruction": "Ghép cặp các khái niệm về mối quan hệ độc hại dậy thì sau:",
  "pairs": [
    { "left": "Vòng lặp độc hại", "right": "Chu kỳ: Gây hấn ➡️ Tặng quà mật ngọt ➡️ Bình yên giả tạo ➡️ Gây hấn." },
    { "left": "Sự cô lập", "right": "Hành vi cấm đoán đối phương chơi với bạn bè hoặc gặp gỡ gia đình." },
    { "left": "Kiểm soát quá mức", "right": "Đòi kiểm tra mọi tin nhắn, bắt báo cáo lịch trình sinh hoạt hàng ngày." },
    { "left": "Bước ra an toàn", "right": "Chia tay ở nơi công cộng/tin nhắn, chặn liên lạc và tìm sự trợ giúp." }
  ]
}', 4),
(@assessment_ml_id7, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về nhận diện cờ đỏ:",
  "sentence": "Cờ đỏ là những dấu hiệu cảnh báo mối quan hệ [blank1]. Vòng lặp bạo lực cảm xúc bắt đầu từ việc gây hấn đến những lời hứa [blank2] giả tạo. Một mối quan hệ mang lại nhiều mệt mỏi hơn [blank3] là lúc cần dừng lại. Hãy mạnh dạn tìm kiếm sự [blank4] từ người lớn đáng tin cậy hoặc Tổng đài 111.",
  "blanks": {
    "blank1": { "correct": "độc hại", "placeholder": "..." },
    "blank2": { "correct": "ngọt ngào", "placeholder": "..." },
    "blank3": { "correct": "vui vẻ", "placeholder": "..." },
    "blank4": { "correct": "trợ giúp", "placeholder": "..." }
  },
  "words": ["độc hại", "ngọt ngào", "vui vẻ", "trợ giúp", "bền vững", "cay đắng", "khó khăn", "lắng nghe"]
}', 5),
(@assessment_ml_id7, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Khi bị đối phương đe dọa phát tán hình ảnh riêng tư hoặc tự làm đau bản thân nếu bạn chia tay, cách xử lý nào dưới đây là an toàn nhất?",
  "enableLives": true,
  "choices": [
    { "text": "Lưu giữ bằng chứng đe dọa, cắt đứt liên lạc (chặn tài khoản) và báo ngay cho bố mẹ, thầy cô hoặc gọi Tổng đài 111 để được bảo vệ kịp thời.", "correct": true, "emoji": "💚" },
    { "text": "Im lặng chịu đựng và chấp nhận tiếp tục mối quan hệ để bảo vệ hình ảnh cá nhân và tính mạng của đối phương.", "correct": false, "emoji": "😐" },
    { "text": "Thách thức đối phương đăng ảnh lên mạng xã hội để chứng minh mình không sợ bị đe dọa.", "correct": false, "emoji": "🙁" },
    { "text": "Liên hệ với nhóm bạn thân khác để lập kế hoạch đến gặp đánh dằn mặt đối phương.", "correct": false, "emoji": "🛑" }
  ]
}', 6);
