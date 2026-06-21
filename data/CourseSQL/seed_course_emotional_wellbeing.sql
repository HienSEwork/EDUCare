-- =========================================================================
-- SEED DATA FOR COURSE: Tâm Lý Tuổi Teen: "Gỡ Rối" Bão Cảm Xúc! (Emotional Wellbeing)
-- Maps to schemas in init.sql: courses, lessons, micro_lessons,
-- micro_lesson_blocks, and lesson_sources.
-- =========================================================================

SET NAMES utf8mb4;
USE educare;

-- 1. Thêm Khóa học mới
INSERT INTO courses (title, description, thumbnail, color_theme, course_order, category_id)
VALUES (
    'Tâm Lý Tuổi Teen: "Gỡ Rối" Bão Cảm Xúc!',
    'Học cách nhận diện và làm quen với những biến động cảm xúc tuổi dậy thì, xây dựng sự tự tin, ứng phó áp lực học tập và nuôi dưỡng các mối quan hệ lành mạnh.',
    'emotional-wellbeing-course.png',
    '#06d6a0',
    23,
    3
);
SET @course_id = LAST_INSERT_ID();

-- =========================================================================
-- BÀI HỌC 1: Ủa, Sao Dạo Này Tâm Trạng "Bão Bùng" Quá? (Understanding Emotions)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'thau-hieu-cam-xuc',
    'Ủa, Sao Dạo Này Tâm Trạng "Bão Bùng" Quá?',
    'Tìm hiểu về sự thay đổi tâm trạng do hormone dậy thì và học cách gọi tên cảm xúc.',
    'Bài học mở đầu giúp bạn gọi tên các loại cảm xúc, làm bạn với cảm xúc khó chịu và viết nhật ký giải tỏa suy nghĩ.',
    35,
    true,
    100,
    12
);
SET @lesson1_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson1_id, 'Scarleteen - What is Healthy Sexual Development', 'https://www.scarleteen.com/read/bodies/what-healthy-sexual-development', 'website');

-- --- Micro Lesson 1.1: Ủa, sao dạo này dễ "cọc" thế? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Ủa, sao dạo này dễ "cọc" thế?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ bỗng dưng thấy muốn ''gầm rú'' hoặc khóc ngon lành chỉ vì một chuyện nhỏ xíu không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Ở tuổi dậy thì, các hormone (như estrogen và testosterone) tăng vọt như biểu đồ chứng khoán.", "Chúng kích hoạt vùng hạch hạnh nhân trong não, nơi kiểm soát cảm xúc, làm bạn nhạy cảm hơn bình thường gấp nhiều lần.", "Đây là một phản ứng sinh học hoàn toàn tự nhiên, không phải do bạn ''khó ưa'' hay ''bất trị'' đâu nha!"]}', 2),
(@ml_id, 'scenario', '{"title": "Cơn giận vô cớ", "body": "Nam đang ngồi xem phim hoạt hình bình thường, bỗng dưng bố nhắc Nam đi đổ rác. Thế là Nam nổi đóa, quát lại bố rồi chạy vào phòng đóng sập cửa. Sau đó Nam lại thấy hối hận và tự trách mình vì phản ứng quá đà."}', 3),
(@ml_id, 'flashcard', '{"front": "Có phải cảm xúc thất thường là dấu hiệu của việc mình đang biến thành người xấu?", "back": "Tuyệt đối không! Đó chỉ là tín hiệu bộ não và hormone của bạn đang học cách trưởng thành cùng nhau.", "notes": "Hãy xem nó giống như một bản chạy thử phần mềm mới (Beta test), thỉnh thoảng có lỗi (lag/bug) là chuyện thường."}', 4),
(@ml_id, 'reflection', '{"question": "Gần đây bạn có phản ứng thái quá với ai đó chỉ vì một chuyện nhỏ không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cảm xúc thay đổi là chuyện bình thường của tuổi dậy thì. Hãy cho bản thân thời gian để thích nghi."]}', 6);

-- --- Micro Lesson 1.2: Lục tủ đồ cảm xúc: Hôm nay hệ gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Lục tủ đồ cảm xúc: Hôm nay hệ gì?', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để biết mình đang thực sự cảm thấy thế nào khi trong lòng là một đống hỗn độn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Có những ngày bạn cảm thấy vừa giận, vừa buồn, vừa lo lắng đan xen lẫn nhau.", "Việc gọi tên chính xác cảm xúc (ví dụ: thất vọng, ghen tị, bất an) giúp não bộ hạ nhiệt ngay lập tức.", "Hãy thử dừng lại 3 giây và tự hỏi: ''Mình đang thuộc ''hệ'' cảm xúc nào lúc này?''"]}', 2),
(@ml_id, 'scenario', '{"title": "Cảm giác lẫn lộn", "body": "Lan thấy bạn thân của mình đi chơi riêng với một bạn khác mà không rủ mình. Lan thấy ngực nghẹn lại, mặt nóng bừng và muốn viết một tin nhắn giận dữ. Lan không rõ mình đang giận hay đang buồn tủi."}', 3),
(@ml_id, 'interaction', '{"question": "Trong tình huống của Lan, cảm xúc thực chất đằng sau cơn giận là gì?", "choices": [{"text": "Lan đang cảm thấy bị bỏ rơi và lo sợ tình bạn của mình đang bị rạn nứt.", "correct": true, "emoji": "💚"}, {"text": "Lan chỉ đang ghét bạn kia và muốn gây sự cho vui thôi.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Khi tức giận, bạn thường cảm thấy cơ thể mình có những biểu hiện gì đầu tiên (nóng mặt, run tay, nghẹn ngực)?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Gọi tên được cảm xúc là bạn đã đi được một nửa chặng đường để làm chủ nó."]}', 6);

-- --- Micro Lesson 1.3: Gắn nhãn "toxic" cho nỗi buồn: Oan quá! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Gắn nhãn "toxic" cho nỗi buồn: Oan quá!', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có từng cảm thấy tội lỗi hoặc cố tỏ ra vui vẻ khi trong lòng đang buồn héo úa không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Xã hội thường bảo tụi mình phải luôn tích cực, nhưng thực tế, buồn bã, lo âu hay giận dữ cũng là những cảm xúc có ích.", "Nỗi buồn giúp ta biết điều gì là quan trọng; nỗi sợ giúp ta tránh nguy hiểm; cơn giận báo hiệu ranh giới của ta bị xâm phạm.", "Đè nén cảm xúc tiêu cực chỉ làm chúng phình to ra như quả bóng bay sắp nổ mà thôi."]}', 2),
(@ml_id, 'scenario', '{"title": "Tỏ vẻ ổn bên ngoài", "body": "Minh trượt đội tuyển bóng rổ của trường. Dù rất buồn và muốn khóc, nhưng khi gặp bạn bè, Minh vẫn cười nói hớn hở: ''Ối dào, tớ có thèm vào đâu!''. Tối về nhà, Minh cảm thấy cô đơn và trống rỗng tột cùng."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các phản ứng với cảm xúc tiêu cực:", "leftBox": {"title": "Đón nhận lành mạnh"}, "rightBox": {"title": "Chối bỏ, đè nén"}, "items": [{"text": "Cho phép bản thân khóc và buồn khi gặp thất bại", "correctBox": "left"}, {"text": "Cố tỏ ra vui cười để người khác không thấy mình yếu đuối", "correctBox": "right"}, {"text": "Tự nhủ: Buồn một chút cũng được, mai mình sẽ tính tiếp", "correctBox": "left"}, {"text": "Cáu gắt với người nhà để trút bỏ sự khó chịu trong lòng", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng giả vờ ổn trước mặt người khác để tránh bị coi là yếu đuối chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mọi cảm xúc đều có giá trị và quyền được tồn tại. Đừng bắt bản thân phải luôn hoàn hảo."]}', 6);

-- --- Micro Lesson 1.4: Khi vũ trụ gửi tín hiệu "ét ô ét" sầu đời ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Khi vũ trụ gửi tín hiệu "ét ô ét" sầu đời', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có những ngày ngủ dậy, bạn thấy cả thế giới bỗng nhiên xám xịt và chán ghét mọi thứ mà không hiểu vì sao?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đôi khi tâm trạng đi xuống không cần một lý do cụ thể nào cả. Nó có thể do thiếu ngủ, thay đổi thời tiết, hoặc đơn giản là cơ thể đang quá tải.", "Những lúc này, việc ép mình phải làm việc hoặc vui vẻ chỉ khiến bạn thêm kiệt sức.", "Hãy chấp nhận rằng hôm nay là một ngày ''low-energy'' (năng lượng thấp) và đối xử nhẹ nhàng với bản thân hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Chán chường ngày cuối tuần", "body": "Hòa thức dậy vào ngày chủ nhật với cảm giác uể oải, không muốn ăn, không muốn nhắn tin với bạn bè và chỉ muốn nằm dài trên giường. Hòa tự trách mình là lười biếng và vô dụng."}', 3),
(@ml_id, 'flashcard', '{"front": "Hòa nên làm gì để vượt qua ngày năng lượng thấp này một cách thoải mái nhất?", "back": "Cho phép bản thân nghỉ ngơi, làm những việc siêu nhỏ như uống một cốc nước ấm, nghe một bản nhạc nhẹ, và đừng tự phán xét mình.", "notes": "Điện thoại còn có lúc cần sạc pin, cơ thể và tâm trí bạn cũng vậy thôi!"}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thường làm gì để sạc lại năng lượng cho những ngày ''tụt mood'' không lý do?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Năng lượng thấp không phải là lười biếng. Đó là tiếng nói của cơ thể cần được nghỉ ngơi."]}', 6);

-- --- Micro Lesson 1.5: Bắt tay làm hòa với "vị khách khó chịu" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bắt tay làm hòa với "vị khách khó chịu"', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn sẽ làm gì khi cơn tức giận hoặc nỗi lo lắng ập đến như một vị khách không mời mà tới?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thay vì cố đẩy ''vị khách'' cảm xúc khó chịu đi, hãy học cách ngồi xuống quan sát nó.", "Nhận biết cảm giác đó trên cơ thể: tim đập nhanh, thở nông, hay tay bóp chặt.", "Sử dụng các kỹ thuật như hít thở sâu, đi bộ, hoặc viết ra để giúp cảm xúc đó trôi qua một cách tự nhiên."]}', 2),
(@ml_id, 'scenario', '{"title": "Trước thềm thuyết trình", "body": "Khi chuẩn bị lên thuyết trình trước lớp, Vy cảm thấy tim đập thình thịch, tay run rẩy và đầu óc trống rỗng vì quá lo sợ. Vy muốn chạy trốn khỏi lớp học."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động nào giúp Vy bình tĩnh lại nhanh nhất lúc này?", "choices": [{"text": "Hít vào thật sâu bằng mũi trong 4 giây, giữ hơi 7 giây, và thở ra từ từ bằng miệng trong 8 giây.", "correct": true, "emoji": "💚"}, {"text": "Cố gắng uống thật nhiều nước ngọt có ga và chạy nhảy xung quanh lớp.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Mẹo nhỏ nào bạn thường dùng để giữ bình tĩnh trước các sự kiện quan trọng?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không thể ngăn cơn sóng cảm xúc ập đến, nhưng bạn có thể học cách lướt sóng."]}', 6);

-- --- Micro Lesson 1.6: Viết nhật ký: Nơi trút bầu tâm sự cực "chill" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Viết nhật ký: Nơi trút bầu tâm sự cực "chill"', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để dọn dẹp đống suy nghĩ ngổn ngang trong đầu trước khi đi ngủ?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Viết ra giấy hoặc ghi chú trên điện thoại là cách tuyệt vời để ''xuất khẩu'' những lo âu ra ngoài bộ não.", "Bạn không cần phải viết một bài văn hay, chỉ cần viết tự do tất cả những gì đang có trong đầu.", "Việc này giúp bạn nhìn nhận lại mọi việc một cách khách quan và giải tỏa áp lực tinh thần cực kỳ hiệu quả."]}', 2),
(@ml_id, 'scenario', '{"title": "Ấm ức trong đêm", "body": "Tú cảm thấy ấm ức vì bị bạn bè hiểu lầm. Cả tối Tú nằm trằn trọc không ngủ được, đầu óc liên tục tua đi tua lại cuộc cãi vã và tự nghĩ ra những lời cãi cọ sắc bén hơn."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các thói quen giải tỏa suy nghĩ trước khi ngủ:", "leftBox": {"title": "Dọn dẹp trí óc"}, "rightBox": {"title": "Overthinking"}, "items": [{"text": "Viết hết nỗi bực bội ra giấy nháp rồi xé bỏ", "correctBox": "left"}, {"text": "Nằm tua đi tua lại cuộc cãi vã trong đầu", "correctBox": "right"}, {"text": "Liệt kê 3 điều bạn thấy biết ơn trong ngày hôm nay", "correctBox": "left"}, {"text": "Lướt mạng xã hội xem đối phương có đăng bài viết bóng gió gì không", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng thử viết ra những suy nghĩ của mình khi tức giận chưa? Cảm giác lúc đó thế nào?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đầu óc dùng để suy nghĩ chứ không phải để lưu trữ lo âu. Hãy trút bỏ chúng ra trang giấy."]}', 6);

-- --- Micro Lesson 1.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Ủa, Sao Dạo Này Tâm Trạng Bão Bùng Quá?''! Bạn có 3 mạng để đón nhận cảm xúc và làm hòa với ngày low-energy."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Đón nhận cảm xúc và làm hòa với ngày low-energy",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Vy đi học về trong trạng thái mệt mỏi, uể oải rã rời (low-energy day) sau một tuần thi cử căng thẳng. Vừa bước chân vào nhà, mẹ Vy đã cằn nhằn: ''Sao đi học về không dọn ngay phòng đi, bừa bộn như cái ổ gà!''. Vy thấy lồng ngực nghẹn lại, cơn giận dữ và bất bình bỗng dưng dâng lên cuồn cuộn.",
      "choices": [
        { "text": "Nổi đóa, hét lên với mẹ: ''Con mệt lắm rồi, mẹ suốt ngày chỉ biết cằn nhằn thôi!'' rồi chạy vào phòng đóng sập cửa.", "nextNode": "fail_explode" },
        { "text": "Dừng lại thở sâu 3 giây để hạ nhiệt hạch hạnh nhân, nói nhẹ nhàng: ''Mẹ ơi, hôm nay con đi học về mệt quá. Mẹ cho con nằm nghỉ 30 phút rồi con dậy dọn phòng sạch sẽ nha mẹ!''.", "nextNode": "step2" },
        { "text": "Cố kìm nén cơn giận, lẳng lặng đi dọn phòng ngay lập tức với thái độ ấm ức, vừa dọn vừa khóc vì tủi thân.", "nextNode": "fail_suppress" }
      ]
    },
    "step2": {
      "text": "Mẹ Vy lắng nghe giọng nói bình tĩnh của bạn, liền dịu giọng xuống và đồng ý: ''Ừ, thế vào nghỉ ngơi đi con''. Vy vào phòng nằm nghỉ, nhưng trong lòng vẫn còn những suy nghĩ ngổn ngang, bứt rứt vì bài kiểm tra tiếng Anh đạt điểm không như ý.",
      "choices": [
        { "text": "Mở điện thoại lướt mạng xã hội liên tục để trốn tránh cảm giác khó chịu và xem các bạn khác có đăng bài khoe điểm không.", "nextNode": "fail_avoid" },
        { "text": "Lấy một cuốn sổ nhỏ, viết tự do tất cả những lo lắng, ấm ức trong đầu ra trang giấy mà không cần câu cú hoàn chỉnh (journaling).", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Sau khi viết nhật ký, Vy thấy đầu óc nhẹ nhõm hẳn. Tuy nhiên, Vy tự hỏi liệu ngày hôm nay năng lượng thấp và buồn bã vô cớ như vậy có phải là mình đang trở nên yếu đuối và tệ hại đi không?",
      "choices": [
        { "text": "Tự nhủ: ''Một ngày low-energy là tín hiệu cơ thể cần sạc pin. Cảm xúc đi xuống cũng bình thường, mình không cần phải luôn hoàn hảo''.", "nextNode": "success_end" },
        { "text": "Tự trách: ''Chắc chắn do mình lười biếng và kém cỏi hơn các bạn nên mới tụt mood thế này, phải cố vui lên mới được!''.", "nextNode": "fail_self_blame" }
      ]
    },
    "success_end": {
      "text": "🎉 Tuyệt vời! Bạn đã gọi tên cảm xúc thành công, biết cách sạc lại năng lượng cho ngày low-energy và trút bỏ overthinking lành mạnh qua trang viết.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_explode": {
      "text": "❌ Chưa đúng! Cơn giận bộc phát khiến bạn mất kiểm soát, làm tổn thương mẹ và để lại cảm giác tội lỗi, dằn vặt sau đó.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_suppress": {
      "text": "❌ Chưa đúng! Đè nén cảm xúc khó chịu và ép bản thân làm việc khi kiệt sức chỉ khiến quả bóng cảm xúc tiêu cực phình to và dễ nổ tung sau đó.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_avoid": {
      "text": "❌ Sai rồi! Trốn tránh bằng mạng xã hội chỉ mang lại sự xao nhãng tạm thời, nhưng việc so sánh điểm số trên mạng lại dễ kích hoạt overthinking sâu sắc hơn.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_self_blame": {
      "text": "❌ Sai rồi! Gán nhãn toxic cho nỗi buồn và ép mình luôn tích cực chỉ làm gia tăng sự căng thẳng và từ chối nhu cầu tự nhiên của cơ thể.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các phản ứng với cảm xúc tiêu cực:",
  "leftBox": { "title": "Đón nhận cảm xúc lành mạnh" },
  "rightBox": { "title": "Chối bỏ, đè nén hoặc trút giận" },
  "items": [
    { "text": "Cho phép bản thân khóc và buồn khi gặp thất bại", "correctBox": "left" },
    { "text": "Cố tỏ ra vui cười, giả vờ ổn để người khác không thấy mình yếu đuối", "correctBox": "right" },
    { "text": "Tự viết nhật ký trút hết nỗi tức giận ra giấy rồi xé bỏ", "correctBox": "left" },
    { "text": "Cáu gắt và quát mắng em nhỏ để trút bỏ sự bực bội trong lòng", "correctBox": "right" },
    { "text": "Tự nhủ: Cảm xúc này là bình thường và nó sẽ trôi qua sau khi mình nghỉ ngơi", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp các khái niệm cảm xúc dậy thì và định nghĩa tương ứng:",
  "pairs": [
    { "left": "Hormone tuổi dậy thì", "right": "Chất hóa học tăng vọt kích hoạt cảm xúc thất thường như biểu đồ hình sin." },
    { "left": "Hạch hạnh nhân - Amygdala", "right": "Vùng não kiểm soát cảm xúc, hoạt động cực nhạy bén ở tuổi teen." },
    { "left": "Nhật ký tự do", "right": "Nơi trút bầu tâm sự, viết ra mọi suy nghĩ ngổn ngang để dọn dẹp bộ não." },
    { "left": "Low-energy days", "right": "Những ngày năng lượng thấp, cơ thể phát tín hiệu cần được nghỉ ngơi sạc pin." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về cách làm bạn với cảm xúc:",
  "sentence": "Ở tuổi dậy thì, các [blank1] tăng vọt kích hoạt vùng [blank2] làm bạn nhạy cảm hơn. Khi gặp ngày ít năng lượng, đừng gán nhãn [blank3] cho nỗi buồn, hãy viết [blank4] để giải tỏa overthinking.",
  "blanks": {
    "blank1": { "correct": "hormone", "placeholder": "..." },
    "blank2": { "correct": "hạch hạnh nhân", "placeholder": "..." },
    "blank3": { "correct": "toxic", "placeholder": "..." },
    "blank4": { "correct": "nhật ký", "placeholder": "..." }
  },
  "words": ["hormone", "hạch hạnh nhân", "toxic", "nhật ký", "lười biếng", "bất trị", "game", "tuyệt vọng"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Tại sao việc gọi tên chính xác cảm xúc (ví dụ: ''tớ đang bất an'', ''tớ đang thất vọng'') lại giúp bạn bình tĩnh hơn?",
  "enableLives": true,
  "choices": [
    { "text": "Vì gọi tên cảm xúc sẽ giúp bạn chứng tỏ mình là người am hiểu tâm lý học.", "correct": false, "emoji": "😐" },
    { "text": "Vì nó gửi tín hiệu giúp não bộ (vùng vỏ não trước trán) kích hoạt khả năng kiểm soát và xoa dịu hạch hạnh nhân ngay lập tức.", "correct": true, "emoji": "💚" },
    { "text": "Vì nó làm cho cảm xúc tiêu cực biến mất vĩnh viễn không bao giờ quay lại.", "correct": false, "emoji": "🙁" },
    { "text": "Vì khi nói ra, mọi người xung quanh sẽ lập tức làm theo ý bạn.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI HỌC 2: Chữa Lành "Tự Ti": Bạn Có Giá Trị Hơn Bạn Tưởng! (Self-Esteem)

-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'tu-tin-va-gia-tri-ban-than',
    'Chữa Lành "Tự Ti": Bạn Có Giá Trị Hơn Bạn Tưởng!',
    'Học cách phân biệt tự tin lành mạnh, hiểu nguồn gốc của tự ti và xây dựng lòng tự trắc ẩn.',
    'Bài học hướng dẫn bạn vượt qua áp lực so sánh, đối mặt với điểm kém và tập cách nói lời tự trắc ẩn với chính mình.',
    36,
    false,
    100,
    12
);
SET @lesson2_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson2_id, 'Scarleteen - Quickies: Healthy Relationships', 'https://www.scarleteen.com/read/relationships/quickies-healthy-relationships', 'website');

-- --- Micro Lesson 2.1: Tự tin "real" vs Tự tin "fake" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Tự tin "real" vs Tự tin "fake"', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có phải tự tin là lúc nào cũng phải nói to, nổi bật và không bao giờ biết sợ hãi?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tự tin thực sự (Self-esteem) là việc bạn chấp nhận bản thân với cả ưu điểm lẫn khuyết điểm, cảm thấy mình xứng đáng được tôn trọng.", "Tự tin ''fake'' là khi bạn cố gồng mình tỏ ra hoàn hảo, lấn lướt người khác để che giấu sự bất an bên trong.", "Người tự tin thực sự không cần phải so sánh mình với ai để cảm thấy mình có giá trị."]}', 2),
(@ml_id, 'scenario', '{"title": "Gồng mình làm trung tâm", "body": "Hoàng luôn cố gắng chen vào mọi cuộc trò chuyện, khoe khoang về những món đồ hiệu mình có và cười cợt các bạn học kém hơn để chứng tỏ mình ''đẳng cấp''. Nhưng khi ở một mình, Hoàng luôn sợ bị các bạn tẩy chay."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm sao để nhận diện một người có lòng tự tin thực sự và lành mạnh?", "back": "Họ biết lắng nghe, sẵn sàng thừa nhận khi mình sai, tôn trọng ranh giới của người khác và không cần dìm người khác xuống để nâng mình lên.", "notes": "Tự tin là một chiếc cúp nằm trong lòng, chứ không phải cái loa phát thanh ra bên ngoài."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ cố tỏ ra ''ngầu'' trước mặt người khác dù bên trong đang rất run không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tự tin thực sự bắt đầu từ việc chấp nhận con người thật của chính mình."]}', 6);

-- --- Micro Lesson 2.2: Tự hào về bản thân: Đừng nhầm với "flexing" quá đà! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Tự hào về bản thân: Đừng nhầm với "flexing" quá đà!', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để chia sẻ niềm vui chiến thắng của mình mà không bị bạn bè coi là kẻ kiêu ngạo, hợm hĩnh?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bạn hoàn toàn có quyền tự hào và ăn mừng những nỗ lực, thành quả của bản thân (Self-worth).", "Điểm khác biệt là: Tự hào đi kèm lòng biết ơn và sự tôn trọng người khác, còn ''flexing'' (khoe khoang) mục đích là để chứng tỏ mình giỏi hơn mọi người.", "Đừng ngại công nhận sự cố gắng của chính mình nhé!"]}', 2),
(@ml_id, 'scenario', '{"title": "Đăng ảnh nhận giải", "body": "Khánh vừa đạt giải nhất cuộc thi vẽ cấp trường. Khánh muốn đăng ảnh bức tranh lên mạng xã hội nhưng sợ các bạn bảo mình là kẻ hợm hĩnh, thích thể hiện."}', 3),
(@ml_id, 'interaction', '{"question": "Khánh nên viết caption như thế nào để vừa thể hiện sự tự hào vừa văn minh, khiêm tốn?", "choices": [{"text": "''Bức tranh này là kết quả của 3 tuần thức đêm vẽ liên tục của tớ. Cảm ơn thầy cô và các bạn đã cổ vũ tớ rất nhiều!''", "correct": true, "emoji": "💚"}, {"text": "''Cuối cùng giải nhất cũng thuộc về người xứng đáng nhất. Vẽ vời thế này thì các bạn khác chạy theo dài dài nhé!''", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Lần gần nhất bạn tự khen ngợi bản thân vì đã hoàn thành tốt một việc gì đó là khi nào?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Công nhận nỗ lực của bản thân không phải là kiêu ngạo. Đó là sự tử tế tối thiểu dành cho chính mình."]}', 6);

-- --- Micro Lesson 2.3: Hiệu ứng "con nhà người ta" và chiếc bẫy tự ti ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Hiệu ứng "con nhà người ta" và chiếc bẫy tự ti', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao việc so sánh bản thân với người khác lại là cách nhanh nhất để hủy hoại niềm vui của bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Não bộ chúng ta có xu hướng so sánh điểm yếu nhất của mình với điểm mạnh nhất của người khác.", "Mạng xã hội hay những lời so sánh của bố mẹ vô tình củng cố cảm giác ''mình không bao giờ đủ giỏi''.", "Mỗi người có một xuất phát điểm và một lộ trình phát triển hoàn toàn khác nhau."]}', 2),
(@ml_id, 'scenario', '{"title": "Cảm giác kém cỏi", "body": "Vy lướt mạng xã hội thấy bạn cùng lớp đăng ảnh nhận học bổng tiếng Anh, đi du lịch nước ngoài cực kỳ sang chảnh. Nhìn lại mình, Vy thấy mình thật kém cỏi, vô dụng và chỉ muốn xóa app."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các suy nghĩ khi đối mặt với thành công của người khác:", "leftBox": {"title": "Tập trung vào mình"}, "rightBox": {"title": "Bẫy so sánh"}, "items": [{"text": "Chúc mừng bạn và tự nhủ: Mình cũng đang nỗ lực trên con đường riêng", "correctBox": "left"}, {"text": "Tự trách bản thân tại sao lười biếng và không được giỏi như bạn", "correctBox": "right"}, {"text": "Hạn chế thời gian lướt mạng xã hội khi thấy tâm trạng không tốt", "correctBox": "left"}, {"text": "Nghi ngờ năng lực của mình và bỏ cuộc không muốn học nữa", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang tự so sánh mình với ai khác gần đây không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đừng so sánh chương 1 của mình với chương 10 của người khác."]}', 6);

-- --- Micro Lesson 2.4: Khi bị điểm kém: Điểm số có định nghĩa bạn? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Khi bị điểm kém: Điểm số có định nghĩa bạn?', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ cảm thấy mình là một kẻ thất bại thảm hại chỉ vì nhận được một điểm số không như ý muốn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Điểm số chỉ phản ánh mức độ hiểu bài của bạn ở một thời điểm cụ thể, chứ không đo lường được giá trị con người bạn.", "Thất bại hay điểm kém chỉ là thông tin phản hồi (feedback) để bạn biết mình cần cải thiện chỗ nào.", "Tách biệt hành vi (bị điểm kém) khỏi giá trị bản thân (mình là người kém cỏi) giúp bạn có động lực để học tập."]}', 2),
(@ml_id, 'scenario', '{"title": "Trải nghiệm điểm 4", "body": "Bình nhận bài kiểm tra Toán chỉ được 4 điểm. Cậu cảm thấy vô cùng xấu hổ, nghĩ rằng mình học dốt bẩm sinh và bố mẹ sẽ không còn yêu thương mình nữa."}', 3),
(@ml_id, 'flashcard', '{"front": "Bình nên nói gì với bản thân để lấy lại động lực học tập thay vì tự dằn vặt?", "back": "Bài kiểm tra này mình làm chưa tốt vì chưa ôn kỹ phần hình học. Mình sẽ nhờ bạn chỉ lại bài và cố gắng hơn ở lần sau.", "notes": "Điểm số là thước đo bài làm, không phải thước đo nhân cách hay tương lai của bạn."}', 4),
(@ml_id, 'reflection', '{"question": "Khi gặp thất bại trong học tập, bạn thường tự trách móc bản thân hay tìm cách khắc phục?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Điểm số thấp chỉ là tạm thời. Giá trị và khả năng học hỏi của bạn mới là vĩnh viễn."]}', 6);

-- --- Micro Lesson 2.5: Thần chú "yêu mình": Trò chuyện với bản thân ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Thần chú "yêu mình": Trò chuyện với bản thân', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Nếu bạn nói chuyện với bạn thân bằng giọng điệu mà bạn đang tự nói với chính mình, liệu hai người có còn chơi với nhau không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nhiều bạn trẻ có xu hướng tự chỉ trích bản thân rất khắc nghiệt (như: ''Mày ngốc quá'', ''Mày luôn làm hỏng mọi chuyện'').", "Hãy tập thói quen sử dụng lòng tự trắc ẩn (Self-compassion) - trò chuyện với bản thân như cách bạn khuyên bảo một người bạn thân.", "Sử dụng những câu nói nâng đỡ thay vì những lời phán xét cay độc."]}', 2),
(@ml_id, 'scenario', '{"title": "Sự cố bài tập nhóm", "body": "Mai vô tình làm đổ nước vào bài tập nhóm của cả tổ. Cô bạn bắt đầu hoảng loạn, liên tục tự chửi mình trong đầu: ''Đồ hậu đậu dốt nát, mày lúc nào cũng phá hoại mọi thứ!''."}', 3),
(@ml_id, 'interaction', '{"question": "Mai nên thay đổi câu độc thoại nội tâm thế nào để bình tĩnh giải quyết sự cố?", "choices": [{"text": "''Mình chỉ vô tình thôi, ai cũng có lúc bất cẩn mà. Giờ mình cùng các bạn chép lại hoặc xin lỗi tổ nhé.''", "correct": true, "emoji": "💚"}, {"text": "''Mình đúng là quả tạ của nhóm, tốt nhất lần sau không nên tham gia làm gì nữa.''", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Lời nói khắc nghiệt nhất bạn từng tự nói với bản thân là gì?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hãy dịu dàng với bản thân. Bạn đang làm tốt nhất những gì có thể rồi."]}', 6);

-- --- Micro Lesson 2.6: Hòa giải với "vết xước": Ai cũng có góc không hoàn hảo! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Hòa giải với "vết xước": Ai cũng có góc không hoàn hảo!', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao việc cố gắng trở nên hoàn hảo 100% trong mắt tất cả mọi người lại là một nhiệm vụ bất khả thi?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Không ai trên đời này hoàn hảo cả. Những khuyết điểm hay lỗi lầm nhỏ chính là thứ làm nên sự độc bản của bạn.", "Học cách chấp nhận những điều không hoàn hảo của mình (Self-acceptance) giúp bạn giải phóng một lượng lớn áp lực tinh thần.", "Cho phép bản thân được sai sót và lớn lên từ những sai sót đó."]}', 2),
(@ml_id, 'scenario', '{"title": "Áp lực hoàn mỹ", "body": "Hải luôn cảm thấy căng thẳng vì muốn mình phải học giỏi nhất lớp, chơi thể thao hay nhất, và luôn ăn mặc thời trang nhất. Chỉ cần một ngày bị điểm 8 hay mặc bộ quần áo hơi lỗi mốt, Hải sẽ thấy vô cùng tồi tệ."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các thái độ đối với khuyết điểm cá nhân:", "leftBox": {"title": "Chấp nhận bao dung"}, "rightBox": {"title": "Cầu toàn cực đoan"}, "items": [{"text": "Coi lỗi sai là cơ hội để học hỏi và rút kinh nghiệm", "correctBox": "left"}, {"text": "Mất ăn mất ngủ cả tuần chỉ vì nói vấp một câu trước đám đông", "correctBox": "right"}, {"text": "Yêu mến cả những vết sẹo hay nốt tàn nhang trên cơ thể mình", "correctBox": "left"}, {"text": "Liên tục dằn vặt bản thân vì không đạt vị trí dẫn đầu", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Khuyết điểm nào của bản thân mà bạn đang tập cách làm quen và chấp nhận gần đây?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hoàn hảo là một ảo ảnh. Không hoàn hảo mới là cuộc sống thực tế."]}', 6);

-- --- Micro Lesson 2.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Chữa Lành Tự Ti: Bạn Có Giá Trị Hơn Bạn Tưởng''! Bạn có 3 mạng để vượt qua bẫy so sánh và xây dựng sự tự tin."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Vượt qua bẫy tự ti",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn nhận kết quả kiểm tra Toán giữa kỳ được 3 điểm, trong khi bạn thân ngồi cạnh đạt điểm 9 tuyệt đối. Cảm giác xấu hổ, thất vọng và tự ti dâng tràn. Bạn bắt đầu nghi ngờ năng lực học tập của chính mình.",
      "choices": [
        { "text": "Tự dằn vặt mình: ''Mình là kẻ dốt nát bẩm sinh, học mấy cũng vô dụng thôi!'' rồi ném bài kiểm tra vào góc bàn.", "nextNode": "fail_self_blame" },
        { "text": "Nhìn nhận bài thi như một phản hồi (feedback), chúc mừng bạn thân và tự nhủ: ''Lần này mình làm chưa tốt phần hình học, mình sẽ nhờ bạn chỉ bài giúp''.", "nextNode": "step2" },
        { "text": "Tỏ vẻ không quan tâm, nói mỉa mai bạn: ''Học giỏi thế sau này đi làm tổng thống à?'' rồi cộc lốc im lặng.", "nextNode": "fail_sarcasm" }
      ]
    },
    "step2": {
      "text": "Tối về nhà, bố mẹ lướt xem nhóm Zalo lớp thấy danh sách điểm số và lập tức so sánh: ''Con nhà người ta học hành giỏi giang thế, sao con chỉ được 3 điểm?''. Cảm giác nghẹn ngực quay lại.",
      "choices": [
        { "text": "Cãi nhau tay đôi với bố mẹ: ''Thế bố mẹ đi mà nhận bạn đó làm con!'' rồi đóng cửa bỏ bữa tối.", "nextNode": "fail_clash" },
        { "text": "Lắng nghe với lòng tự trắc ẩn, giải thích lịch sự: ''Con xin lỗi bố mẹ. Bài này con ôn tập chưa kỹ, con đã nhận ra lỗi sai và đang nhờ bạn kèm thêm để thi cuối kỳ tốt hơn ạ''.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Vy lướt mạng xã hội Instagram và thấy một người bạn khác liên tục đăng ảnh nhận học bổng tiếng Anh và flexing cuộc sống du lịch sang chảnh. Sự so sánh xã hội trỗi dậy làm bạn thấy tự ti.",
      "choices": [
        { "text": "Tự ti về ngoại hình và hoàn cảnh của mình, quyết định nhịn ăn hoặc trốn tránh không muốn đi học.", "nextNode": "fail_avoidance" },
        { "text": "Nhận thức rằng mạng xã hội chỉ là cuốn phim nổi bật của họ, tắt ứng dụng điện thoại và tập trung vào các mục tiêu nhỏ của bản thân.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Xuất sắc! Bạn đã xây dựng được lòng tự trắc ẩn vững vàng, tách biệt điểm số khỏi giá trị bản thân và vượt qua bẫy so sánh xã hội thông minh.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_self_blame": {
      "text": "❌ Chưa đúng! Tự dằn vặt bản thân làm triệt tiêu động lực học tập, khiến bạn lún sâu vào chiếc bẫy tự ti độc hại.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_sarcasm": {
      "text": "❌ Chưa đúng! Mỉa mai thành công của bạn bè chỉ thể hiện sự ghen tị ngầm và làm tổn thương mối quan hệ tốt đẹp.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_clash": {
      "text": "❌ Sai rồi! Cãi cọ gay gắt với bố mẹ chỉ làm tăng khoảng cách gia đình và khiến tâm trạng của bạn tệ hơn rất nhiều.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_avoidance": {
      "text": "❌ Sai rồi! Nhịn ăn hoặc bỏ học trốn tránh không giải quyết được vấn đề thực tế, mà còn gây hại nghiêm trọng cho sức khỏe của bạn.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các thái độ với bản thân:",
  "leftBox": { "title": "Tự tin lành mạnh" },
  "rightBox": { "title": "Tự ti / Cầu toàn thái quá" },
  "items": [
    { "text": "Chấp nhận bản thân có cả điểm mạnh và điểm yếu", "correctBox": "left" },
    { "text": "Mất ngủ cả tuần chỉ vì nói vấp một câu trước lớp", "correctBox": "right" },
    { "text": "Coi lỗi sai là cơ hội để học hỏi và rút kinh nghiệm", "correctBox": "left" },
    { "text": "Nâng mình lên bằng cách dìm các bạn học kém hơn xuống", "correctBox": "right" },
    { "text": "Chào mừng thành công của bạn bè mà không ghen tị", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa giá trị bản thân và định nghĩa phù hợp:",
  "pairs": [
    { "left": "Tự tin thực sự", "right": "Chấp nhận bản thân, không cần lấn lướt hay so sánh với ai." },
    { "left": "Lòng tự trắc ẩn", "right": "Trò chuyện bao dung với chính mình khi gặp thất bại hay sai lầm." },
    { "left": "Bẫy so sánh", "right": "So sánh điểm yếu nhất của mình với điểm mạnh nhất của người khác." },
    { "left": "Sự cầu toàn cực đoan", "right": "Ép buộc bản thân phải hoàn mỹ 100% trong mọi lĩnh vực." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa lòng tự trọng:",
  "sentence": "Điểm số chỉ phản ánh năng lực ở một [blank1], không định nghĩa [blank2] con người bạn. Hãy dùng lời nói [blank3] để trò chuyện với bản thân và tránh chiếc bẫy [blank4] xã hội độc hại.",
  "blanks": {
    "blank1": { "correct": "thời điểm", "placeholder": "..." },
    "blank2": { "correct": "giá trị", "placeholder": "..." },
    "blank3": { "correct": "bao dung", "placeholder": "..." },
    "blank4": { "correct": "so sánh", "placeholder": "..." }
  },
  "words": ["thời điểm", "giá trị", "bao dung", "so sánh", "hoàn hảo", "điểm số", "tự ti", "flexing"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Mục đích thực chất đằng sau hành vi ''flexing'' (khoe khoang) quá đà trên mạng xã hội của một người thường là gì?",
  "enableLives": true,
  "choices": [
    { "text": "Họ thực sự quá hoàn hảo và không có bất kỳ nỗi lo lắng nào.", "correct": false, "emoji": "😐" },
    { "text": "Họ muốn nhận được sự công nhận từ bên ngoài để khỏa lấp sự bất an, tự ti bên trong.", "correct": true, "emoji": "💚" },
    { "text": "Họ đang muốn giúp đỡ bạn bè học tập tốt hơn.", "correct": false, "emoji": "🙁" },
    { "text": "Họ thích thể hiện phong cách sống giản dị, khiêm tốn.", "correct": false, "emoji": "🛑" }
  ]
}', 6);



-- =========================================================================
-- BÀI HỌC 3: Hòa Giải Với Chiếc Body: Bạn Đẹp Theo Cách Riêng! (Body Image)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'co-the-va-chap-nhan-ban-than',
    'Hòa Giải Với Chiếc Body: Bạn Đẹp Theo Cách Riêng!',
    'Nhận diện ảnh hưởng của truyền thông đến hình ảnh cơ thể, học cách yêu thương vóc dáng và ứng phó body shaming.',
    'Bài học trang bị kiến thức phân biệt filter ảo ma vs thực tế, tôn trọng sự đa dạng vóc dáng và rèn luyện kỹ năng ứng phó body shaming.',
    37,
    false,
    100,
    12
);
SET @lesson3_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson3_id, 'Scarleteen - Body Image', 'https://www.scarleteen.com/read/body-image', 'website');

-- --- Micro Lesson 3.1: Filter ảo ma vs Vẻ đẹp thực tế ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Filter ảo ma vs Vẻ đẹp thực tế', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có từng thấy buồn bã vì làn da của mình ngoài đời không được mịn màng, trắng sáng như những bức ảnh trên mạng xã hội?"}' , 1),
(@ml_id, 'explanation', '{"bullets": ["Hầu hết hình ảnh của người nổi tiếng hoặc các hot teen trên mạng xã hội đều đã qua chỉnh sửa, sử dụng filter và góc chụp chuyên nghiệp.", "Việc so sánh cơ thể thật của mình với một hình ảnh đã qua chỉnh sửa kỹ thuật số là hoàn toàn không công bằng.", "Làn da có lỗ chân lông, mụn, hay vết rạn đều là những đặc tính sinh học tự nhiên và bình thường."]}', 2),
(@ml_id, 'scenario', '{"title": "Chụp ảnh selfie", "body": "Linh dành cả tiếng đồng hồ để chụp ảnh tự sướng, thử hàng chục filter chỉnh mặt thon, da trắng mịn mới dám đăng bài. Khi nhìn vào gương thấy những nốt mụn và làn da hơi ngăm của mình, Linh cảm thấy rất ghét bỏ khuôn mặt thật."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm thế nào để bảo vệ sức khỏe tinh thần trước những hình ảnh ''hoàn hảo'' trên mạng xã hội?", "back": "Tự nhắc nhở bản thân: Mạng xã hội là sàn diễn, đời thực mới là cuộc sống. Nhấn nút hủy theo dõi những tài khoản khiến bạn thấy tự ti về ngoại hình.", "notes": "Đừng so sánh cuộc sống thô (raw) của bạn với sản phẩm đã qua biên tập (edit) của người khác."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có hay dùng app chỉnh sửa ảnh trước khi đăng lên mạng xã hội không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Làn da thật có kết cấu và khuyết điểm. Đó mới là biểu hiện của một cơ thể đang sống."]}', 6);

-- --- Micro Lesson 3.2: Mỗi chiếc body là độc bản, không có khuôn mẫu! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Mỗi chiếc body là độc bản, không có khuôn mẫu!', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao xã hội lại cứ phải đặt ra những tiêu chuẩn như ''con gái phải gầy, con trai phải cơ bắp'' trong khi gen của chúng ta lại hoàn toàn khác nhau?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Gen di truyền quyết định khung xương, chiều cao và phân bổ mỡ tự nhiên của mỗi người.", "Có những người sinh ra đã có vóc dáng đậm đà, có người lại cao gầy dù ăn uống thế nào đi nữa.", "Sức khỏe và sự dẻo dai quan trọng hơn rất nhiều so với việc ép cơ thể vào một size quần áo nhất định."]}', 2),
(@ml_id, 'scenario', '{"title": "Áp lực tăng cơ bắp", "body": "Đức cao 1m70 nhưng nặng chỉ 50kg, trông khá gầy. Cậu cố gắng ăn thật nhiều và tập tạ nặng quá sức để mong có cơ bắp như các idol trên mạng, dẫn đến chấn thương cơ vai."}', 3),
(@ml_id, 'interaction', '{"question": "Đức nên thay đổi mục tiêu luyện tập thế nào để bảo vệ sức khỏe và yêu thương cơ thể?", "choices": [{"text": "Tập trung vào các bài tập vừa sức để tăng sự dẻo dai, bền bỉ và ăn uống đủ chất theo nhịp độ tự nhiên của cơ thể.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục nhịn ăn hoặc uống các loại sữa tăng cơ thần tốc không rõ nguồn gốc để đạt mục tiêu nhanh nhất.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang yêu thích một đặc điểm khỏe mạnh nào trên cơ thể mình lúc này không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể bạn là phương tiện để bạn trải nghiệm cuộc sống, không phải là món đồ trang trí để người khác ngắm nhìn."]}', 6);

-- --- Micro Lesson 3.3: Bớt soi, thêm thương: Tại sao ta hay phán xét ngoại hình? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Bớt soi, thêm thương: Tại sao ta hay phán xét ngoại hình?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ vô tình buột miệng nhận xét ''Dạo này béo thế?'' hay ''Sao đen thế?'' với bạn bè như một lời chào hỏi thông thường chưa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Phán xét ngoại hình người khác đôi khi bắt nguồn từ việc chúng ta tự ti về chính mình hoặc do thói quen giao tiếp thiếu tinh tế.", "Những câu đùa cợt vô ý về ngoại hình có thể để lại tổn thương tâm lý rất sâu sắc cho người nghe.", "Tập thói quen khen ngợi năng lực, tính cách thay vì tập trung vào diện mạo bên ngoài của người khác."]}', 2),
(@ml_id, 'scenario', '{"title": "Câu trêu đùa vô duyên", "body": "Trong buổi họp lớp, nhóm bạn nam cười hố hố trêu chọc Tuấn vì dạo này Tuấn mọc ria mép và trông béo ra: ''Nhìn như ông chú trung niên ấy nhỉ!''. Tuấn chỉ biết cười trừ nhưng trong lòng thấy rất khó chịu."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các câu mở đầu cuộc trò chuyện văn minh và lịch sự:", "leftBox": {"title": "Nói lời tinh tế"}, "rightBox": {"title": "Phán xét ngoại hình"}, "items": [{"text": "Dạo này cậu có dự án hay sở thích gì mới không?", "correctBox": "left"}, {"text": "Kìa, sao dạo này mọc nhiều mụn thế kia?", "correctBox": "right"}, {"text": "Tớ rất thích màu áo này của cậu, trông rất năng động!", "correctBox": "left"}, {"text": "Sao dạo này gầy gò ốm yếu thế, không ăn uống gì à?", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn từng cảm thấy thế nào khi nhận được một lời nhận xét không mấy tích cực về ngoại hình của mình?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Lời nói có sức nặng. Hãy dùng ngôn từ để sưởi ấm thay vì làm tổn thương ngoại hình của nhau."]}', 6);

-- --- Micro Lesson 3.4: Khi chiếc mũi hay cân nặng "lệch chuẩn" một chút ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Khi chiếc mũi hay cân nặng "lệch chuẩn" một chút', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có bộ phận nào trên cơ thể khiến bạn cảm thấy không hài lòng mỗi khi nhìn vào gương không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Việc không thích một vài điểm trên cơ thể (như mũi tẹt, đùi to, mắt một mí) là tâm lý rất phổ biến ở tuổi teen.", "Tuy nhiên, những đặc điểm đó không làm giảm đi sự đáng yêu và giá trị tổng thể của bạn.", "Thay vì cố sửa đổi bằng mọi giá, hãy thử học cách sống hòa bình với những đặc điểm ''lệch chuẩn'' đó."]}', 2),
(@ml_id, 'scenario', '{"title": "Tìm cách che khuyết điểm", "body": "Trang rất tự ti vì có chiếc mũi hơi tẹt và cánh mũi to. Mỗi lần chụp ảnh nhóm, cô bạn đều cố né tránh ống kính hoặc lấy tay che mũi vì sợ các bạn chê xấu."}', 3),
(@ml_id, 'flashcard', '{"front": "Trang nên làm gì để bớt áp lực về chiếc mũi lệch chuẩn của mình?", "back": "Tập trung vào những nét đẹp khác như nụ cười rạng rỡ, đôi mắt sáng, và tự nhắc nhở: Chiếc mũi này thừa hưởng từ bố mẹ, nó là một phần nguồn gốc đáng tự hào của mình.", "notes": "Nụ cười tự tin chính là lớp trang điểm đẹp nhất làm mờ đi mọi khuyết điểm ngoại hình."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thể liệt kê 3 điều bạn yêu thích về cơ thể mình lúc này không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không cần có một cơ thể hoàn hảo để sống một cuộc đời tuyệt vời."]}', 6);

-- --- Micro Lesson 3.5: Nói gì khi bị "body shaming" vô duyên? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Nói gì khi bị "body shaming" vô duyên?', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn sẽ phản ứng thế nào khi bị ai đó nhận xét khiếm nhã về ngoại hình ngay trước đám đông?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Im lặng chịu đựng hoặc tức giận cãi vã đôi khi không phải là cách giải quyết tối ưu.", "Bạn có quyền thiết lập ranh giới rõ ràng và thể hiện sự không thoải mái của mình một cách kiên định, lịch sự.", "Phản hồi bình thản giúp bạn giữ được thế chủ động và làm đối phương phải tự xem lại cách cư xử của họ."]}', 2),
(@ml_id, 'scenario', '{"title": "Nhận xét vô ý tại bàn ăn", "body": "Tại bàn ăn gia đình, một người họ hàng xa nhận xét lớn tiếng: ''Chà, con gái con lứa mà đùi to như cột đình thế kia thì sau này ai thèm yêu!''. Cả nhà im lặng nhìn Mai."}', 3),
(@ml_id, 'interaction', '{"question": "Mai nên phản hồi thế nào để bảo vệ ranh giới của mình một cách văn minh, tự tin?", "choices": [{"text": "Nhìn thẳng vào họ và nói nhẹ nhàng: ''Cháu thấy đùi cháu khỏe khoắn để tập thể thao rất tốt ạ. Chúng ta nói chuyện khác vui hơn cô nhé!''", "correct": true, "emoji": "💚"}, {"text": "Bỏ đũa xuống khóc lóc chạy lên phòng hoặc hét to: ''Cô vô duyên vừa thôi chứ!''", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng thiết lập ranh giới thành công trước một lời chê bai ngoại hình chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Ý kiến của người khác về cơ thể bạn là việc của họ, không phải là sự thật về bạn."]}', 6);

-- --- Micro Lesson 3.6: Nói lời cảm ơn "chiếc vỏ bọc" đã làm việc chăm chỉ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Nói lời cảm ơn "chiếc vỏ bọc" đã làm việc chăm chỉ', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Đã bao giờ bạn dừng lại để cảm ơn cơ thể mình vì đã giúp bạn hít thở, chạy nhảy và học hỏi chưa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cơ thể bạn không phải là một món đồ để trưng bày, nó là một cỗ máy sinh học kỳ diệu đang làm việc 24/7 để giữ bạn sống sót.", "Chuyển sự chú ý từ diện mạo bên ngoài (nhìn trông thế nào) sang chức năng bên trong (làm được những gì) là chìa khóa của sự tự chấp nhận.", "Đối xử tử tế với cơ thể bằng cách cho nó ăn ngon, ngủ đủ và vận động nhẹ nhàng."]}', 2),
(@ml_id, 'scenario', '{"title": "Phút tĩnh lặng cuối ngày", "body": "Sau một ngày học tập mệt mỏi, An nằm dài ra giường, nghe nhịp đập của tim, cảm nhận đôi chân mỏi nhừ sau buổi tập thể dục và chợt nhận ra cơ thể mình đã vất vả thế nào suốt cả ngày."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành động thể hiện sự trân trọng cơ thể:", "leftBox": {"title": "Yêu thương cơ thể"}, "rightBox": {"title": "Ngược đãi cơ thể"}, "items": [{"text": "Uống đủ nước và ngủ trước 11h đêm để các cơ quan phục hồi", "correctBox": "left"}, {"text": "Nhịn ăn bỏ bữa để ép cân nặng giảm nhanh chóng", "correctBox": "right"}, {"text": "Tập các bài yoga nhẹ nhàng giúp giãn cơ sau giờ học căng thẳng", "correctBox": "left"}, {"text": "Tiếp tục chạy bộ quá sức dù chân đang bị đau khớp sưng đỏ", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Hôm nay, bạn muốn gửi lời cảm ơn đến bộ phận nào trên cơ thể mình nhất?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể là ngôi nhà duy nhất bạn có. Hãy yêu thương và chăm sóc nó chu đáo."]}', 6);

-- --- Micro Lesson 3.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Hòa Giải Với Chiếc Body: Bạn Đẹp Theo Cách Riêng!''! Bạn có 3 mạng để tự tin ứng phó body shaming và trân trọng ngoại hình độc bản."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Tự tin ứng phó body shaming và yêu thương vóc dáng",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Đức đăng một bức ảnh chụp lúc chơi bóng rổ cùng lớp lên Facebook. Phía dưới phần bình luận, một bạn lớp bên cạnh viết: ''Trông như bộ xương di động/nhái bén ấy nhỉ, học bóng rổ làm gì cho tốn thời gian!''. Đức thấy mặt nóng bừng, lồng ngực thắt lại vì xấu hổ và tức giận.",
      "choices": [
        { "text": "Bình luận chửi bới lại bạn đó một cách gay gắt để xả giận: ''Nhìn lại gương đi xem mình có ra gì không mà nói người khác!''.", "nextNode": "fail_fight" },
        { "text": "Chụp lại màn hình làm bằng chứng, sau đó ẩn hoặc xóa bình luận khiếm nhã kia đi để bảo vệ không gian cá nhân, tự nhủ: Mình chơi bóng rổ vì sức khỏe của mình chứ không phải để làm vừa mắt họ.", "nextNode": "step2" },
        { "text": "U uất xóa luôn bức ảnh bóng rổ, quyết định không đi tập bóng rổ nữa vì sợ bị mọi người chê cười ngoại hình.", "nextNode": "fail_withdraw" }
      ]
    },
    "step2": {
      "text": "Mọi việc dần trôi qua, nhưng tuần sau đó, khi cả lớp tập trung ở hành lang, bạn đó lại tiếp tục trêu chọc trực tiếp trước mặt đông người: ''Kìa, bộ xương di động kìa!''. Mọi người xung quanh đổ dồn ánh mắt vào Đức.",
      "choices": [
        { "text": "Im lặng, cúi gục đầu đi chỗ khác, cố nén nước mắt để không ai thấy mình đang khóc.", "nextNode": "fail_silent" },
        { "text": "Nhìn thẳng vào bạn đó, trả lời bình tĩnh và kiên định: ''Tớ tự hào vì cơ thể khỏe mạnh của tớ giúp tớ chạy nhanh và chơi bóng rổ tốt. Tớ mong cậu tôn trọng và không nhận xét ngoại hình của tớ nữa nhé!''.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Sau khi Đức thiết lập ranh giới rõ ràng, bạn kia ngượng ngùng im lặng bỏ đi. Cuối ngày, Đức đứng trước gương và nhìn ngắm cơ thể gầy gò của mình, suy nghĩ về việc thay đổi vóc dáng.",
      "choices": [
        { "text": "Quyết định nhịn ăn sáng và uống sữa tăng cơ thần tốc không rõ nguồn gốc để đạt mục tiêu tăng cân nhanh nhất.", "nextNode": "fail_unhealthy" },
        { "text": "Tập trung vào chế độ ăn uống đủ chất, tập luyện thể thao vừa sức theo nhịp độ tự nhiên của cơ thể để tăng sự dẻo dai.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Xuất sắc! Bạn đã bảo vệ bản thân thành công trước body shaming bằng ranh giới kiên định và trân trọng cơ thể theo cách lành mạnh nhất.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_fight": {
      "text": "❌ Chưa đúng! Cãi vã gay gắt trên mạng chỉ tạo ra một cuộc khẩu chiến toxic, hạ thấp hình ảnh của chính bạn và không giải quyết được vấn đề.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_withdraw": {
      "text": "❌ Chưa đúng! Bỏ cuộc vì lời chê bai của người khác là bạn đang nhượng bộ kẻ bắt nạt và từ bỏ sở thích lành mạnh giúp cơ thể khỏe mạnh.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_silent": {
      "text": "❌ Sai rồi! Im lặng cam chịu không giúp thiết lập ranh giới, kẻ trêu chọc sẽ nghĩ bạn dễ bắt nạt và có thể tiếp tục hành vi body shaming này.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_unhealthy": {
      "text": "❌ Sai rồi! Sử dụng các biện pháp tăng cơ/giảm cân cực đoan gây hại nghiêm trọng cho các cơ quan nội tạng và sự phát triển sinh học của tuổi dậy thì.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các thái độ đối với vóc dáng cơ thể:",
  "leftBox": { "title": "Yêu thương cơ thể" },
  "rightBox": { "title": "Ngược đãi hoặc phán xét" },
  "items": [
    { "text": "Uống đủ nước và vận động vừa sức giúp cơ thể dẻo dai", "correctBox": "left" },
    { "text": "Nhịn ăn bỏ bữa để nhanh chóng có vòng eo con kiến", "correctBox": "right" },
    { "text": "Tự nhủ: Chiếc mũi tẹt thừa hưởng từ bố mẹ là nét độc bản đáng yêu", "correctBox": "left" },
    { "text": "Soi gương liên tục và dằn vặt bản thân vì không có cơ bắp vạm vỡ", "correctBox": "right" },
    { "text": "Nhận xét khiếm nhã về cân nặng của bạn học dưới danh nghĩa đùa vui", "correctBox": "right" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa về ngoại hình và định nghĩa phù hợp:",
  "pairs": [
    { "left": "Filter ảo ma", "right": "Hình ảnh chỉnh sửa kỹ thuật số tạo nên tiêu chuẩn sắc đẹp phi thực tế." },
    { "left": "Body shaming", "right": "Hành vi chê bai, giễu cợt ngoại hình gây tổn thương tinh thần người khác." },
    { "left": "Đa dạng vóc dáng", "right": "Sự thật sinh học rằng gen quyết định mỗi cơ thể có cấu trúc khác nhau." },
    { "left": "Lòng biết ơn cơ thể", "right": "Trân trọng chức năng sinh học giữ cho ta sống khỏe mạnh 24/7." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa yêu thương cơ thể:",
  "sentence": "Mạng xã hội thường trưng bày những hình ảnh đã qua [blank1], hãy trân trọng cơ thể thực của mình. Khi bị [blank2] ngoại hình, hãy kiên định thiết lập [blank3] và tập trung nuôi dưỡng cơ thể [blank4] thay vì chạy theo khuôn mẫu.",
  "blanks": {
    "blank1": { "correct": "chỉnh sửa", "placeholder": "..." },
    "blank2": { "correct": "chê bai", "placeholder": "..." },
    "blank3": { "correct": "ranh giới", "placeholder": "..." },
    "blank4": { "correct": "khỏe mạnh", "placeholder": "..." }
  },
  "words": ["chỉnh sửa", "chê bai", "ranh giới", "khỏe mạnh", "filter", "nhịn ăn", "chất lượng", "cụt ngủn"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Tại sao việc so sánh ngoại hình của bạn với các hot teen trên mạng xã hội lại không công bằng?",
  "enableLives": true,
  "choices": [
    { "text": "Vì họ ở thành phố lớn còn bạn ở nông thôn hoặc tỉnh lẻ.", "correct": false, "emoji": "😐" },
    { "text": "Vì hình ảnh của họ đã được chọn lọc từ hàng trăm tấm, chỉnh sửa góc sáng, kéo chân và dùng filter ảo ma, khác xa thực tế.", "correct": true, "emoji": "💚" },
    { "text": "Vì họ được trả tiền để chụp ảnh đẹp còn bạn thì không.", "correct": false, "emoji": "🙁" },
    { "text": "Vì cơ thể của họ được cấu tạo từ các tế bào sinh học đặc biệt hơn bạn.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI HỌC 4: Khi Áp Lực Đè Nặng: "Giải Cứu" Bộ Não Quá Tải! (Managing Stress)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'vuot-qua-stress-va-cam-xuc-kho-khan',
    'Khi Áp Lực Đè Nặng: "Giải Cứu" Bộ Não Quá Tải!',
    'Nhận biết dấu hiệu stress trên cơ thể, phân biệt các loại stress và thực hành kỹ thuật xoa dịu tâm trí.',
    'Bài học hướng dẫn các phương pháp đối mặt chủ động với stress, phân bổ lịch học thi khoa học và rèn luyện kỹ thuật thở sâu.',
    38,
    false,
    100,
    12
);
SET @lesson4_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson4_id, 'Scarleteen - Quickies: Healthy Relationships', 'https://www.scarleteen.com/read/relationships/quickies-healthy-relationships', 'website');

-- --- Micro Lesson 4.1: SOS: Cơ thể đang kêu cứu vì stress đấy! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'SOS: Cơ thể đang kêu cứu vì stress đấy!', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có biết stress không chỉ nằm trong đầu mà nó còn biểu hiện rất rõ ràng trên cơ thể của bạn không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Khi bạn lo lắng hoặc gặp áp lực, não bộ sẽ giải phóng các hormone stress như cortisol và adrenaline.", "Các cơ của bạn sẽ căng lên, tim đập nhanh hơn, dạ dày co bóp mạnh gây đau bụng, và bạn có thể bị mất ngủ.", "Những triệu chứng thể chất này là tín hiệu ''SOS'' nhắc nhở bạn: Cơ thể đang quá tải rồi!"]}', 2),
(@ml_id, 'scenario', '{"title": "Áp lực thi cử", "body": "Chuẩn bị đến kỳ thi học kỳ, Khoa liên tục bị đau bụng âm ỉ, vai gáy mỏi nhừ, tối nằm trằn trọc mãi không ngủ được và sáng dậy với cảm giác mệt mỏi rã rời."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm thế nào để nhận biết cơ thể mình đang bị stress quá mức?", "back": "Các biểu hiện phổ biến: Đau đầu, đau dạ dày vô cớ, nổi mụn đột ngột, nghiến răng khi ngủ, dễ nổi cáu và khó tập trung.", "notes": "Đau bụng trước giờ kiểm tra không phải do bạn giả vờ, đó là phản ứng sinh học thực tế của stress."}', 4),
(@ml_id, 'reflection', '{"question": "Bộ phận nào trên cơ thể bạn thường ''lên tiếng'' đầu tiên mỗi khi bạn gặp áp lực lớn?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Lắng nghe tín hiệu từ cơ thể. Nó đang nói với bạn khi nào cần dừng lại để nghỉ ngơi."]}', 6);

-- --- Micro Lesson 4.2: Stress "tốt" vs Stress "độc hại": Bạn có phân biệt được? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Stress "tốt" vs Stress "độc hại": Bạn có phân biệt được?', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có phải tất cả mọi căng thẳng đều xấu và chúng ta nên triệt tiêu stress hoàn toàn khỏi cuộc sống?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Stress tích cực (Eustress) ở mức độ vừa phải giúp bạn tập trung hơn, nhạy bén hơn để hoàn thành mục tiêu ngắn hạn (như ôn thi, thuyết trình).", "Stress độc hại (Distress) kéo dài liên tục mà không có thời gian nghỉ ngơi sẽ làm suy yếu hệ miễn dịch và gây kiệt quệ tinh thần.", "Mục tiêu là kiểm soát và cân bằng stress chứ không phải trốn tránh nó hoàn toàn."]}', 2),
(@ml_id, 'scenario', '{"title": "Hai thái cực căng thẳng", "body": "Tâm cảm thấy hơi hồi hộp trước trận đấu bóng rổ, nhưng cảm giác này giúp cậu chạy nhanh và tập trung hơn. Ngược lại, Hải lo lắng về kỳ thi suốt 3 tháng trời, không đêm nào ngủ ngon và luôn thấy kiệt sức."}', 3),
(@ml_id, 'interaction', '{"question": "Cảm giác căng thẳng của bạn nào trong kịch bản trên là stress độc hại cần can thiệp?", "choices": [{"text": "Của bạn Hải, vì sự căng thẳng kéo dài liên tục gây ảnh hưởng nghiêm trọng đến giấc ngủ và thể chất.", "correct": true, "emoji": "💚"}, {"text": "Của bạn Tâm, vì hồi hộp trước trận đấu là biểu hiện của sự yếu đuối, nhút nhát.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng trải qua khoảnh khắc nào mà sự căng thẳng giúp bạn làm việc năng suất hơn chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Một chút áp lực giúp ta tiến lên, nhưng quá nhiều áp lực sẽ làm ta đổ gục. Hãy biết giới hạn của mình."]}', 6);

-- --- Micro Lesson 4.3: Chạy trốn stress: Tạm thời hay trọn đời? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Chạy trốn stress: Tạm thời hay trọn đời?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn thường làm gì khi gặp áp lực: Đối mặt giải quyết hay trốn vào game, mạng xã hội để quên đi thực tại?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Trốn tránh (Avoidance) bằng cách lướt điện thoại hay chơi game chỉ mang lại cảm giác dễ chịu tạm thời, nhưng vấn đề vẫn còn nguyên và stress sẽ quay lại lớn hơn.", "Đối mặt chủ động bằng cách chia nhỏ công việc, lên kế hoạch từng bước giúp bạn giải quyết gốc rễ của sự lo âu.", "Sử dụng chiến thuật ''tạm nghỉ'' để sạc pin chứ không phải để chạy trốn vĩnh viễn."]}', 2),
(@ml_id, 'scenario', '{"title": "Bẫy lảng tránh", "body": "Đức có bài tập lớn cần nộp vào ngày mai. Càng lo lắng, Đức càng không muốn làm, cậu mở điện thoại ra chơi game suốt 5 tiếng liên tục để trốn tránh cảm giác tội lỗi. Đến tối muộn, Đức càng hoảng loạn hơn."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các cách ứng phó khi gặp núi công việc áp lực:", "leftBox": {"title": "Đối mặt chủ động"}, "rightBox": {"title": "Trốn tránh thụ động"}, "items": [{"text": "Viết danh sách các việc cần làm và thực hiện việc nhỏ nhất trước", "correctBox": "left"}, {"text": "Nằm lướt TikTok liên tục để không phải nghĩ về đống bài tập", "correctBox": "right"}, {"text": "Nhờ bạn bè hoặc thầy cô chỉ dẫn những phần bài quá khó", "correctBox": "left"}, {"text": "Tự nhủ: Cứ để mai tính, giờ đi chơi game cho đỡ mệt đầu", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Món đồ hay ứng dụng nào bạn thường tìm đến nhiều nhất mỗi khi muốn trốn tránh áp lực?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chia nhỏ thử thách giúp biến nỗi sợ hãi khổng lồ thành những bước đi khả thi."]}', 6);

-- --- Micro Lesson 4.4: Bơi giữa mùa thi: Làm sao để không "chìm"? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Bơi giữa mùa thi: Làm sao để không "chìm"?', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để sinh tồn qua những tuần lễ thi cử dồn dập mà không bị rơi vào trạng thái hoảng loạn tinh thần?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mùa thi cử là thời điểm nhạy cảm dễ kích hoạt stress độc hại nhất ở học sinh.", "Quản lý thời gian học tập khoa học kết hợp nghỉ giải lao hợp lý (như phương pháp Pomodoro) giúp não bộ ghi nhớ tốt hơn.", "Đừng quên rằng bộ não của bạn cần oxy, nước và giấc ngủ để hoạt động, chứ không chỉ cần nhồi nhét kiến thức."]}', 2),
(@ml_id, 'scenario', '{"title": "Cố quá sức trước ngày thi", "body": "Vy ôn thi bằng cách thức trắng đêm đến 3h sáng, uống nước tăng lực liên tục và nhịn ăn sáng. Đến giờ thi, đầu óc Vy bỗng dưng trống rỗng, tay chân bủn rủn dù đã học rất nhiều."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm thế nào để ôn thi hiệu quả mà vẫn giữ được sức khỏe tinh thần ổn định?", "back": "Học 25 phút nghỉ giải lao 5 phút, uống đủ nước, ngủ ít nhất 7 tiếng trước ngày thi, và ăn sáng đầy đủ để cung cấp năng lượng cho não bộ.", "notes": "Một bộ não được nghỉ ngơi đầy đủ sẽ làm bài tốt hơn một bộ nhồi nhét mệt mỏi."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng bị ''đóng băng'' đầu óc trong phòng thi vì quá căng thẳng chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Kết quả thi cử rất quan trọng, nhưng sức khỏe và sự bình an của bạn còn quan trọng hơn."]}', 6);

-- --- Micro Lesson 4.5: Hít vào thở ra: Kỹ thuật 4-7-8 siêu xịn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Hít vào thở ra: Kỹ thuật 4-7-8 siêu xịn', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có muốn học một mẹo nhỏ có thể giúp bạn bình tĩnh lại ngay lập tức chỉ trong vòng 60 giây không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hít thở nông và nhanh khi lo lắng sẽ kích hoạt hệ thần kinh giao cảm duy trì trạng thái hoảng sợ.", "Kỹ thuật thở 4-7-8 giúp kích hoạt hệ thần kinh đối giao cảm, gửi tín hiệu ''an toàn'' đến não để làm chậm nhịp tim và thư giãn cơ bắp.", "Cách làm: Hít vào bằng mũi (4s), giữ hơi (7s), thở ra bằng miệng (8s). Lặp lại 4 lần."]}', 2),
(@ml_id, 'scenario', '{"title": "Căng thẳng thi nói", "body": "Trước khi bước vào phòng thi vấn đáp tiếng Anh, tim của Chi đập thình thịch như muốn nhảy ra ngoài, mồ hôi tay vã ra. Chi quyết định dừng lại, nhắm mắt và thực hiện 3 chu kỳ thở 4-7-8."}', 3),
(@ml_id, 'interaction', '{"question": "Tại sao Chi lại cảm thấy bình tĩnh hơn sau khi thực hiện bài tập thở sâu?", "choices": [{"text": "Thở sâu làm giảm nồng độ hormone stress và báo cho bộ não biết cơ thể đang ở trạng thái an toàn.", "correct": true, "emoji": "💚"}, {"text": "Thở sâu chỉ là một mẹo tâm lý tự lừa bản thân chứ không có tác dụng sinh học nào.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Hãy cùng thực hành ngay một chu kỳ thở 4-7-8 lúc này. Bạn cảm thấy cơ thể nhẹ nhõm hơn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hơi thở là chiếc mỏ neo giúp bạn định vị bản thân giữa cơn bão lo âu."]}', 6);

-- --- Micro Lesson 4.6: Tự chế chiếc "van xả stress" lành mạnh ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Tự chế chiếc "van xả stress" lành mạnh', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có chuẩn bị sẵn cho mình một danh sách những hoạt động ''cứu hộ'' mỗi khi áp lực cuộc sống tăng lên quá cao không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Giống như nồi áp suất, bộ não bạn cần một chiếc ''van xả'' để giải phóng bớt căng thẳng tích tụ.", "Van xả lành mạnh là những hoạt động giúp bạn ngắt kết nối với nguồn gây stress và nạp lại năng lượng (như vẽ tranh, chơi thể thao, nghe nhạc, trò chuyện).", "Tránh các van xả độc hại như ăn uống quá độ, thức khuya xem phim hay cáu gắt với người khác."]}', 2),
(@ml_id, 'scenario', '{"title": "Thói quen xả nhiệt", "body": "Mỗi khi cảm thấy quá tải vì bài vở, Nguyên thường đi tắm nước ấm, sau đó ra ban công ngồi nghe một bài hát yêu thích trong 10 phút trước khi quay lại bàn học."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hoạt động xả stress:", "leftBox": {"title": "Van xả lành mạnh"}, "rightBox": {"title": "Van xả độc hại"}, "items": [{"text": "Vận động nhẹ nhàng hoặc đi bộ xung quanh công viên", "correctBox": "left"}, {"text": "Ăn thật nhiều đồ ngọt và đồ ăn nhanh để giải tỏa tâm trạng", "correctBox": "right"}, {"text": "Tâm sự nỗi lòng với một người bạn thân đáng tin cậy", "correctBox": "left"}, {"text": "Trút giận bằng cách quát mắng em nhỏ hoặc đập phá đồ đạc", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Chiếc ''van xả stress'' yêu thích và lành mạnh nhất của bạn lúc này là gì?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chủ động xả áp suất trước khi bộ não của bạn bị ''chập mạch'' vì quá tải."]}', 6);

-- --- Micro Lesson 4.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Khi Áp Lực Đè Nặng: Giải Cứu Bộ Não Quá Tải''! Bạn có 3 mạng để vượt qua stress thi cử và quản lý lo âu hiệu quả."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Giải cứu bộ não quá tải",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Tuần tới bạn có 3 bài thi học kỳ dồn dập. Bạn bắt đầu thấy đau bụng âm ỉ, mỏi vai gáy và tối nằm trằn trọc mãi không ngủ được. Sự lo lắng khổng lồ đè nặng khiến bạn không muốn chạm tay vào sách vở.",
      "choices": [
        { "text": "Mở game cày rank hoặc lướt TikTok suốt 5 tiếng liên tục để tạm quên đi đống bài tập cần học.", "nextNode": "fail_avoid" },
        { "text": "Chấp nhận đây là stress thi cử, viết danh sách bài vở cần học, chia nhỏ nhiệm vụ và học theo phương pháp Pomodoro.", "nextNode": "step2" },
        { "text": "Thức xuyên đêm đến 4h sáng nhồi nhét hết kiến thức và uống liên tiếp 2 lon nước tăng lực.", "nextNode": "fail_overwork" }
      ]
    },
    "step2": {
      "text": "Sáng ngày thi, vừa bước vào phòng thi, bạn thấy tim đập thình thịch, tay run rẩy, mồ hôi vã ra và đầu óc bỗng dưng trống rỗng, đóng băng hoàn toàn trước đề bài.",
      "choices": [
        { "text": "Hoảng loạn gục mặt xuống bàn tự trách mình học nhiều mà vẫn vô dụng.", "nextNode": "fail_freeze" },
        { "text": "Nhắm mắt lại, đặt tay lên bụng, thực hiện 3 chu kỳ thở sâu 4-7-8 để làm chậm nhịp tim và sạc oxy cho não.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Sau khi thi xong, mặc dù bài thi làm khá tốt nhưng bạn vẫn thấy căng thẳng tích tụ. Bạn cần mở chiếc ''van xả stress'' để phục hồi năng lượng.",
      "choices": [
        { "text": "Ăn một lúc 3 gói mì cay và uống nước ngọt có ga cho bõ tức.", "nextNode": "fail_unhealthy_vent" },
        { "text": "Đi tắm nước ấm, vận động nhẹ nhàng ngoài công viên hoặc nghe một bản nhạc nhẹ yêu thích để xả bớt áp suất.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn toàn chính xác! Bạn đã đối mặt với stress chủ động, bình tĩnh vượt qua khoảnh khắc đóng băng bằng kỹ thuật thở 4-7-8 và xả stress lành mạnh.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_avoid": {
      "text": "❌ Chưa đúng! Lảng tránh thụ động bằng game chỉ mang lại cảm giác an tâm tạm thời, nhưng vấn đề vẫn còn nguyên và stress sẽ dội lại mạnh mẽ hơn.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_overwork": {
      "text": "❌ Chưa đúng! Thức trắng đêm nhồi nhét kết hợp lạm dụng nước tăng lực sẽ tàn phá thể chất, khiến bộ não dễ bị ''đóng băng'' khi thi.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_freeze": {
      "text": "❌ Sai rồi! Hoảng loạn tinh thần chỉ làm gián đoạn hệ tư duy của não bộ. Bạn cần bài tập thở sâu vật lý để lập tức hạ nhiệt.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_unhealthy_vent": {
      "text": "❌ Sai rồi! Xả stress bằng đồ ăn cay nóng, đồ ăn nhanh chỉ làm quá tải hệ tiêu hóa và không giải quyết được căng thẳng tinh thần.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các phản ứng ứng phó áp lực:",
  "leftBox": { "title": "Đối mặt chủ động" },
  "rightBox": { "title": "Trốn tránh thụ động" },
  "items": [
    { "text": "Viết danh sách các việc cần làm và thực hiện việc nhỏ trước", "correctBox": "left" },
    { "text": "Nằm lướt TikTok liên tục để không phải nghĩ về bài tập", "correctBox": "right" },
    { "text": "Nhờ bạn bè hoặc giáo viên chỉ dẫn phần bài tập quá khó", "correctBox": "left" },
    { "text": "Cố học tiếp dù đầu đang nhức búa bổ vì sợ điểm kém", "correctBox": "right" },
    { "text": "Dành 10 phút đi bộ thư giãn ngoài vườn sạc pin tâm hồn", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa stress và định nghĩa phù hợp:",
  "pairs": [
    { "left": "Adrenaline & Cortisol", "right": "Hormone được giải phóng khi cơ thể gặp trạng thái căng thẳng, lo âu." },
    { "left": "Stress tích cực (Eustress)", "right": "Áp lực vừa phải giúp tập trung hơn để hoàn thành mục tiêu ngắn hạn." },
    { "left": "Stress độc hại (Distress)", "right": "Sự căng thẳng kéo dài liên tục gây kiệt quệ tinh thần và thể chất." },
    { "left": "Kỹ thuật thở 4-7-8", "right": "Bài tập điều hòa nhịp thở kích hoạt hệ thần kinh đối giao cảm làm dịu não bộ." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa ứng phó stress:",
  "sentence": "Stress không chỉ ở trong đầu mà còn biểu hiện qua các tín hiệu [blank1] của cơ thể. Đừng lảng tránh bằng game, hãy [blank2] chia nhỏ công việc và sử dụng những chiếc [blank3] lành mạnh để [blank4] bớt áp lực.",
  "blanks": {
    "blank1": { "correct": "thể chất", "placeholder": "..." },
    "blank2": { "correct": "chủ động", "placeholder": "..." },
    "blank3": { "correct": "van xả", "placeholder": "..." },
    "blank4": { "correct": "giải phóng", "placeholder": "..." }
  },
  "words": ["thể chất", "chủ động", "van xả", "giải phóng", "lơ đi", "im lặng", "nước ngọt", "lười biếng"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Tại sao việc sử dụng nước tăng lực và thức xuyên đêm ôn thi là cờ đỏ nguy hiểm cho kết quả thi cử?",
  "enableLives": true,
  "choices": [
    { "text": "Vì nó làm cho bạn thông minh hơn đột xuất và gây ra kiêu ngạo.", "correct": false, "emoji": "😐" },
    { "text": "Vì nó gây thiếu ngủ nghiêm trọng và làm tăng nồng độ cortisol, khiến bộ não dễ bị trống rỗng khi vào phòng thi.", "correct": true, "emoji": "💚" },
    { "text": "Vì nó khiến bạn làm bài thi quá nhanh mà không kịp soát lỗi.", "correct": false, "emoji": "🙁" },
    { "text": "Vì giáo viên sẽ trừ điểm nếu phát hiện học sinh thức khuya.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI HỌC 5: Khi "Crush" Từ Chối: Vượt Qua "Bể Sầu" Cực Mượt! (Rejection & Resilience)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'rung-dong-tu-choi-va-phuc-hoi-cam-xuc',
    'Khi "Crush" Từ Chối: Vượt Qua "Bể Sầu" Cực Mượt!',
    'Hiểu về cảm xúc rung động tuổi teen, chấp nhận sự từ chối và xây dựng khả năng phục hồi sau thất bại tình cảm.',
    'Bài học trang bị kỹ năng vượt qua mối tình đơn phương hững hờ, học cách đối mặt với sự từ chối văn minh và phục hồi niềm tin vào bản thân.',
    39,
    false,
    100,
    12
);
SET @lesson5_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson5_id, 'Scarleteen - I Know Consent is Awesome, Rejection is Not', 'https://www.scarleteen.com/read/sex-sexuality/i-know-consent-awesome-rejection-not', 'website'),
(@lesson5_id, 'Scarleteen - Quickies: Crushes', 'https://www.scarleteen.com/read/relationships/quickies-crushes', 'website');

-- --- Micro Lesson 5.1: Uống nhầm một ánh mắt: Cơn say nắng ngọt ngào ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Uống nhầm một ánh mắt: Cơn say nắng ngọt ngào', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao hình bóng của một ai đó bỗng dưng lại chiếm sóng toàn bộ tâm trí bạn, khiến bạn vừa vui sướng vừa bồn chồn khó tả?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Rung động đầu đời (Crush) là trải nghiệm sinh lý và cảm xúc cực kỳ mạnh mẽ khi cơ thể sản xuất nhiều dopamine (hormone hạnh phúc).", "Bạn có thể mơ mộng về đối phương, đỏ mặt khi chạm mắt, và luôn muốn xuất hiện thật hoàn hảo trước họ.", "Đây là bước phát triển cảm xúc hoàn toàn tự nhiên để bạn học cách kết nối sâu sắc hơn với người khác."]}', 2),
(@ml_id, 'scenario', '{"title": "Theo dõi thầm lặng", "body": "Khánh phát hiện mình luôn lén nhìn Vy trong giờ học, tim đập thình thịch mỗi khi Vy đi qua hành lang và liên tục kiểm tra điện thoại xem Vy có đăng story mới không."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm thế nào để tận hưởng cơn ''say nắng'' một cách lành mạnh và không bị ảnh hưởng đến học tập?", "back": "Chấp nhận cảm xúc bâng khuâng đó, coi nó là động lực học tốt hơn, nhưng đừng để việc theo dõi họ làm bạn bỏ quên các mối quan hệ bạn bè và cuộc sống riêng.", "notes": "Say nắng giống như ăn một cây kem ngọt ngào, hãy thưởng thức nó chứ đừng để nó làm bạn bị tê buốt răng nhé."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang ''say nắng'' ai đó ở trường hoặc trên mạng lúc này không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Rung động đầu đời là một gia vị ngọt ngào của tuổi trẻ. Hãy trân trọng cảm xúc trong trẻo đó."]}', 6);

-- --- Micro Lesson 5.2: Khi tình cảm là đường một chiều: Nhận biết thế nào? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Khi tình cảm là đường một chiều: Nhận biết thế nào?', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để biết khi nào tình cảm của mình là đơn phương và đối phương chỉ coi mình là một người bạn xã giao?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tình cảm lành mạnh cần sự tương tác hai chiều và sự hào hứng từ cả hai phía.", "Dấu hiệu tình cảm một chiều: Bạn luôn là người chủ động nhắn tin trước, câu trả lời của họ rất ngắn gọn/hờ hững, hoặc họ né tránh các buổi hẹn riêng.", "Nhận ra điều này sớm giúp bạn bảo vệ lòng tự trọng và tránh đầu tư quá nhiều kỳ vọng."]}', 2),
(@ml_id, 'scenario', '{"title": "Đợi chờ tin nhắn", "body": "Lan liên tục nhắn tin hỏi han Lâm mỗi ngày. Lâm thường trả lời rất muộn bằng những câu cộc lốc như ''Ừ'', ''Ok'', hoặc thả emoji. Lan tự biện hộ là Lâm đang bận học."}', 3),
(@ml_id, 'interaction', '{"question": "Lan nên hiểu phản hồi của Lâm thế nào cho đúng thực tế?", "choices": [{"text": "Lâm không thực sự hào hứng và quan tâm đến cuộc trò chuyện với Lan. Lan nên dừng việc chủ động nhắn tin liên tục.", "correct": true, "emoji": "💚"}, {"text": "Lâm đang thử thách lòng kiên nhẫn của Lan, Lan cần nhắn tin nhiều hơn nữa để Lâm cảm động.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng ở trong một mối quan hệ mà bạn luôn là người phải chủ động cố gắng chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn xứng đáng với một tình cảm được đón nhận và trân trọng từ cả hai phía."]}', 6);

-- --- Micro Lesson 5.3: Tại sao bị từ chối lại đau buốt tim? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Tại sao bị từ chối lại đau buốt tim?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao cảm giác bị từ chối tình cảm lại mang đến nỗi đau thể xác thực tế ở lồng ngực như bị ai bóp nghẹt?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nghiên cứu não bộ cho thấy, sự từ chối kích hoạt cùng một vùng não xử lý nỗi đau thể xác (vùng vỏ não đai trước).", "Điều này giải thích tại sao bạn cảm thấy đau nhói ở ngực, hụt hẫng và trống rỗng sau khi bị từ chối.", "Nỗi đau này là có thật về mặt sinh học, vì vậy đừng tự trách mình là quá nhạy cảm hay yếu đuối."]}', 2),
(@ml_id, 'scenario', '{"title": "Cảm giác hụt hẫng lớn", "body": "Hoàng bị bạn gái cùng khóa từ chối lời tỏ tình. Cậu cảm thấy lồng ngực mình đau thắt lại, chán ăn, và thấy xấu hổ như thể mình là người tồi tệ nhất thế giới."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các nhận thức đúng đắn về sự từ chối:", "leftBox": {"title": "Nhìn nhận lành mạnh"}, "rightBox": {"title": "Suy nghĩ tiêu cực"}, "items": [{"text": "Bị từ chối nghĩa là hai người không phù hợp ở thời điểm này", "correctBox": "left"}, {"text": "Bị từ chối chứng tỏ mình là kẻ kém cỏi, xấu xí và không ai yêu", "correctBox": "right"}, {"text": "Đối phương có quyền tự do lựa chọn tình cảm của họ", "correctBox": "left"}, {"text": "Cố gắng bám đuôi hoặc ép buộc họ phải thay đổi ý định", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Nỗi lo sợ bị từ chối có từng ngăn cản bạn bày tỏ suy nghĩ thật của mình với ai đó không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đau lòng khi bị từ chối là phản ứng sinh học bình thường. Hãy ôm lấy nỗi đau đó và cho nó thời gian lành lại."]}', 6);

-- --- Micro Lesson 5.4: Lấy hết can đảm tỏ tình và cái kết... bị từ chối! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Lấy hết can đảm tỏ tình và cái kết... bị từ chối!', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để giữ vững phong độ và sự tự tin khi đối phương nói lời từ chối tình cảm của bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tỏ tình là một hành động dũng cảm thể hiện bạn dám sống thật với cảm xúc của mình.", "Từ chối là một phần của cuộc sống, không phải là một bản án định tội giá trị của bạn.", "Cách bạn ứng phó với sự từ chối thể hiện mức độ trưởng thành và sự tôn trọng đối phương."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời từ chối nhẹ nhàng", "body": "Tú hẹn Vy ra công viên để tặng quà và tỏ tình. Vy từ chối nhẹ nhàng: ''Tớ chỉ muốn tụi mình là bạn tốt thôi''. Tú cảm thấy mặt nóng bừng, tai lùng bùng."}', 3),
(@ml_id, 'flashcard', '{"front": "Tú nên ứng xử thế nào để giữ sự văn minh và tôn trọng ranh giới của Vy?", "back": "Tú có thể hít thở sâu, mỉm cười nhẹ và nói: ''Tớ hiểu rồi. Cảm ơn cậu đã chia sẻ thẳng thắn nhé. Tớ hơi buồn chút nhưng tớ tôn trọng quyết định của cậu''.", "notes": "Cách ứng xử đẹp sau khi bị từ chối chính là biểu hiện cao nhất của sự trưởng thành."}', 4),
(@ml_id, 'reflection', '{"question": "Nếu bạn là người phải từ chối tình cảm của ai đó, bạn muốn họ phản ứng như thế nào để cả hai bớt khó xử?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Từ chối không làm giảm đi giá trị của bạn. Nó chỉ mở ra hướng đi mới phù hợp hơn."]}', 6);

-- --- Micro Lesson 5.5: Mẹo "F5" tâm trạng sau khi bị "từ chối thẳng thừng" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Mẹo "F5" tâm trạng sau khi bị "từ chối thẳng thừng"', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn sẽ làm gì để kéo mình ra khỏi vũng lầy buồn bã và phục hồi lại năng lượng tinh thần sau một cú sốc tình cảm?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cho phép bản thân buồn và khóc trong vài ngày đầu để giải tỏa bớt áp lực cảm xúc.", "Sau đó, hãy chủ động ngắt kết nối: Hạn chế vào trang cá nhân của họ, cất đi những món quà kỷ niệm gây gợi nhớ.", "Tập trung vào các mục tiêu cá nhân và dành thời gian bên những người bạn mang lại cho bạn tiếng cười."]}', 2),
(@ml_id, 'scenario', '{"title": "Vòng lặp buồn bã", "body": "Mai sau khi bị crush từ chối liên tục nằm trong phòng khóc lóc, nghe những bài hát thất tình và liên tục check xem cậu ấy đang online hay đi chơi với ai."}', 3),
(@ml_id, 'interaction', '{"question": "Hành động nào giúp Mai ''F5'' lại tâm trạng hiệu quả nhất lúc này?", "choices": [{"text": "Cất những món quà liên quan đến crush, tắt thông báo từ tài khoản của họ và hẹn hội bạn thân đi ăn kem, xem phim.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục đăng những status buồn bã, trách móc lên mạng xã hội để mong đối phương đọc được và hối hận.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Hoạt động nào thường giúp bạn quên đi nỗi buồn nhanh nhất mỗi khi gặp chuyện thất vọng?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đóng lại một trang sách cũ là cách duy nhất để bạn bắt đầu viết nên những chương mới tươi sáng."]}', 6);

-- --- Micro Lesson 5.6: Sau cơn mưa trời lại sáng: Khơi dậy niềm tự hào ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Sau cơn mưa trời lại sáng: Khơi dậy niềm tự hào', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để nhận ra rằng trải nghiệm bị từ chối thực chất là một bài học đắt giá giúp bạn mạnh mẽ hơn trong tương lai?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Khả năng phục hồi cảm xúc (Resilience) được xây dựng sau mỗi lần bạn đối mặt với thất bại và tự đứng dậy.", "Việc bạn dám bày tỏ tình cảm đã là một chiến thắng của lòng dũng cảm.", "Bạn nhận ra rằng mình có thể vượt qua nỗi đau lòng và vẫn giữ nguyên giá trị bản thân."]}', 2),
(@ml_id, 'scenario', '{"title": "Thời gian chữa lành", "body": "Ba tháng sau khi bị từ chối, An nhìn lại bức tranh cũ, mỉm cười nhận ra mình không còn cảm thấy nhói lòng nữa. An thấy mình tự tin hơn, học tập tiến bộ và kết giao thêm nhiều bạn mới."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các bài học rút ra từ trải nghiệm rung động đầu đời:", "leftBox": {"title": "Bài học trưởng thành"}, "rightBox": {"title": "Tiêu cực tự ti"}, "items": [{"text": "Mình biết cách bày tỏ cảm xúc thật của mình một cách dũng cảm", "correctBox": "left"}, {"text": "Mình sẽ không bao giờ mở lòng yêu thương hay tin tưởng ai nữa", "correctBox": "right"}, {"text": "Mình hiểu rõ hơn về những tiêu chuẩn tình cảm mà mình mong đợi", "correctBox": "left"}, {"text": "Ngoại hình mình xấu xí nên chắc chắn cả đời này sẽ bị cô độc", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có tự hào về lòng dũng cảm của mình sau những lần đối mặt với thử thách cảm xúc đã qua không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Những vết xước cảm xúc hôm nay chính là chất liệu tạo nên sự kiên cường của bạn ngày mai."]}', 6);

-- --- Micro Lesson 5.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Khi Crush Từ Chối: Vượt Qua Bể Sầu Cực Mượt''! Bạn có 3 mạng để tôi luyện sức bật cảm xúc sau thất bại tình cảm."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Vượt qua bể sầu tỏ tình",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn lấy hết dũng khí tỏ tình với crush bằng một món quà nhỏ ở công viên. Đối phương ngập ngừng rồi nói lời từ chối: ''Cảm ơn cậu, nhưng tớ chỉ muốn tụi mình là bạn tốt thôi!''. Mặt bạn nóng bừng, tai lùng bùng và lồng ngực đau nhói thực tế.",
      "choices": [
        { "text": "Nài nỉ tiếp: ''Cho tớ cơ hội đi, tớ sẽ làm mọi thứ vì cậu mà!''", "nextNode": "fail_beg" },
        { "text": "Mỉm cười nhẹ, chấp nhận ranh giới: ''Tớ hiểu rồi, cảm ơn cậu đã chia sẻ thẳng thắn nhé. Tớ hơi buồn chút nhưng tớ tôn trọng quyết định của cậu''.", "nextNode": "step2" },
        { "text": "Nổi giận đùng đùng, ném món quà đi và mắng: ''Cậu sống lạnh lùng thế, sau này đừng chơi với nhau nữa!''", "nextNode": "fail_furious" }
      ]
    },
    "step2": {
      "text": "Tối về nhà, cảm giác thất tình làm bạn buồn bã tột cùng. Bạn thấy mình liên tục muốn mở trang cá nhân của họ lên xem họ có đăng bài viết mới nào không, lòng cồn cào bất an.",
      "choices": [
        { "text": "Tiếp tục ẩn danh theo dõi từng lượt like, thả tim của họ trên Instagram để tìm kiếm manh mối.", "nextNode": "fail_stalk" },
        { "text": "Ẩn tạm thời trang cá nhân của họ, cất các món quà gợi nhớ và rủ hội bạn thân đi ăn kem, xem phim để F5 tâm trạng.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Ba tháng sau, bạn nhìn thấy crush cũ đang đi chơi vui vẻ với một người bạn khác. Cảm xúc nhói nhẹ trỗi dậy, bạn tự hỏi trải nghiệm này có ý nghĩa gì với con người bạn.",
      "choices": [
        { "text": "Tự dằn vặt: ''Chắc chắn do mình xấu xí và kém cỏi nên mới bị bỏ rơi. Mình sẽ không bao giờ mở lòng nữa!''", "nextNode": "fail_cynical" },
        { "text": "Nhận ra đây là trải nghiệm dũng cảm giúp mình biết cách bày tỏ cảm xúc, tôn trọng ranh giới và vững vàng đứng lên.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn toàn chính xác! Bạn đã phục hồi cảm xúc cực kỳ kiên cường, ứng xử văn minh khi bị từ chối và khơi dậy lòng dũng cảm tự hào.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_beg": {
      "text": "❌ Chưa đúng! Nài nỉ bám đuôi khi đối phương đã từ chối là thiếu tôn trọng ranh giới của họ và hạ thấp lòng tự trọng của chính bạn.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_furious": {
      "text": "❌ Chưa đúng! Nổi giận chửi bới đối phương khi bị từ chối chỉ thể hiện sự ích kỷ và thiếu chín chắn trong kiểm soát cảm xúc.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_stalk": {
      "text": "❌ Sai rồi! Việc âm thầm theo dõi (stalk) trang cá nhân liên tục chỉ làm kéo dài nỗi đau thất tình và khiến bạn khó phục hồi.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_cynical": {
      "text": "❌ Sai rồi! Trải nghiệm từ chối chỉ chứng minh hai người chưa phù hợp, không làm giảm đi giá trị tổng thể của con người bạn.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các suy nghĩ phục hồi sau thất tình:",
  "leftBox": { "title": "Bài học trưởng thành" },
  "rightBox": { "title": "Tiêu cực tự ti" },
  "items": [
    { "text": "Bị từ chối nghĩa là hai người chưa phù hợp ở thời điểm này", "correctBox": "left" },
    { "text": "Bị từ chối chứng tỏ mình là kẻ kém cỏi và không ai yêu", "correctBox": "right" },
    { "text": "Đối phương có quyền tự do lựa chọn tình cảm của họ", "correctBox": "left" },
    { "text": "Mình sẽ không bao giờ mở lòng yêu thương hay tin tưởng ai nữa", "correctBox": "right" },
    { "text": "Mình biết cách bày tỏ cảm xúc thật của mình một cách dũng cảm", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa phục hồi cảm xúc và định nghĩa phù hợp:",
  "pairs": [
    { "left": "Resilience (Sức bật)", "right": "Khả năng đối mặt với thất bại cảm xúc và tự chữa lành đứng dậy." },
    { "left": "Dopamine", "right": "Hormone tạo cảm giác phấn khích, cồn cào khi say nắng crush." },
    { "left": "Tình cảm một chiều", "right": "Tình cảm chỉ xuất phát từ một phía, thiếu sự tương tác hai chiều." },
    { "left": "Từ chối văn minh", "right": "Chia sẻ thẳng thắn sự từ chối đi kèm sự tôn trọng cảm xúc đối phương." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa phục hồi sau từ chối:",
  "sentence": "Sự từ chối kích hoạt vùng não xử lý nỗi đau [blank1] thực tế. Hãy tập cách chấp nhận và [blank2] ranh giới của họ. Cất đi những món quà cũ giúp bạn [blank3] tâm trạng và rèn luyện sức bật [blank4] cảm xúc kiên cường.",
  "blanks": {
    "blank1": { "correct": "thể xác", "placeholder": "..." },
    "blank2": { "correct": "tôn trọng", "placeholder": "..." },
    "blank3": { "correct": "F5", "placeholder": "..." },
    "blank4": { "correct": "cảm xúc", "placeholder": "..." }
  },
  "words": ["thể xác", "tôn trọng", "F5", "cảm xúc", "nài nỉ", "stalk", "lo sợ", "tự ti"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Hành động nào sau đây giúp bạn phục hồi nhanh nhất sau khi bị crush từ chối lời tỏ tình?",
  "enableLives": true,
  "choices": [
    { "text": "Đăng những bài viết buồn bã, oán trách lấp lửng để crush thấy tội lỗi.", "correct": false, "emoji": "😐" },
    { "text": "Chấp nhận nỗi buồn trong vài ngày, ẩn thông báo từ crush, cất kỷ vật cũ và tập trung vào các thói quen tốt cùng bạn bè thân thiết.", "correct": true, "emoji": "💚" },
    { "text": "Lập tức tìm một người khác thế chỗ để chứng minh mình vẫn có giá trị.", "correct": false, "emoji": "🙁" },
    { "text": "Ngồi học liên tục 12 tiếng để không còn thời gian suy nghĩ.", "correct": false, "emoji": "🛑" }
  ]
}', 6);


-- =========================================================================
-- BÀI HỌC 6: Mối Quan Hệ "Chất Lượng Cao" Vs Độc Hại (Healthy Relationships)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'ket-noi-lanh-manh-va-diem-tua-cam-xuc',
    'Mối Quan Hệ "Chất Lượng Cao" Vs Độc Hại',
    'Phân biệt tình bạn lành mạnh (Green Flag) và độc hại (Red Flag), nhận diện các hành vi kiểm soát cảm xúc.',
    'Bài học hướng dẫn phân biệt mối quan hệ Green Flag và cờ đỏ thao túng cảm xúc, cách chia sẻ tổn thương tinh thần và xây dựng mạng lưới hỗ trợ.',
    40,
    false,
    100,
    12
);
SET @lesson6_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson6_id, 'Scarleteen - Quickies: Healthy Relationships', 'https://www.scarleteen.com/read/relationships/quickies-healthy-relationships', 'website'),
(@lesson6_id, 'Scarleteen - Hello Sailor: How to Build, Board and Navigate a Healthy Relationship', 'https://www.scarleteen.com/read/relationships/hello-sailor-how-build-board-navigate-healthy-relationship', 'website');

-- --- Micro Lesson 6.1: Thế nào là một chiếc bạn "Green Flag"? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Thế nào là một chiếc bạn "Green Flag"?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ tự hỏi điều gì làm nên một tình bạn giúp bạn luôn thấy an tâm, được là chính mình thay vì phải gồng mình diễn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tình bạn lành mạnh (Green Flag) được xây dựng trên sự tôn trọng, lòng tin và sự bình đẳng.", "Bạn bè ''Green Flag'' sẽ lắng nghe không phán xét, ủng hộ ước mơ của bạn, và tôn trọng những quyết định cá nhân (ranh giới) của bạn.", "Họ vui mừng khi thấy bạn thành công chứ không có sự ghen tị ngầm hay nói xấu sau lưng."]}', 2),
(@ml_id, 'scenario', '{"title": "Ủng hộ ước mơ", "body": "Khi Vy chia sẻ rằng mình muốn tham gia câu lạc bộ kịch, Hà hào hứng ủng hộ: ''Cậu đóng kịch hợp lắm đó, để tớ đi xem cậu diễn thử nhé!''. Vy cảm thấy rất ấm áp."}', 3),
(@ml_id, 'flashcard', '{"front": "Những dấu hiệu cơ bản của một người bạn ''Green Flag'' trong giao tiếp hàng ngày là gì?", "back": "Họ giữ bí mật của bạn, biết nói lời xin lỗi khi làm bạn buồn, không ép bạn làm điều bạn ghét, và luôn sẵn sàng hỗ trợ khi bạn gặp khó khăn.", "notes": "Một người bạn tốt giống như một làn gió mát nâng đỡ bạn bay cao hơn."}', 4),
(@ml_id, 'reflection', '{"question": "Người bạn thân nhất của bạn đã từng làm điều gì khiến bạn cảm thấy được tôn trọng và yêu quý nhất?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tình bạn đích thực là nơi bạn được cởi bỏ mọi chiếc mặt nạ để sống chân thật nhất."]}', 6);

-- --- Micro Lesson 6.2: Nhận diện kẻ thao túng cảm xúc cực tinh vi ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Nhận diện kẻ thao túng cảm xúc cực tinh vi', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có bao giờ bạn thấy mình luôn là người phải xin lỗi và cảm thấy tội lỗi trong các cuộc tranh cãi dù mình không làm gì sai?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thao túng cảm xúc (như Gaslighting) là hành vi làm bạn nghi ngờ chính suy nghĩ, cảm xúc và trí nhớ của bản thân.", "Kẻ thao túng thường đổ lỗi ngược lại cho bạn: ''Cậu nhạy cảm quá rồi đấy'', ''Vì cậu nên tớ mới phải làm thế'', hoặc dùng chiến tranh lạnh im lặng để trừng phạt bạn.", "Nhận diện sớm cờ đỏ này để bảo vệ sức khỏe tinh thần của bản thân."]}', 2),
(@ml_id, 'scenario', '{"title": "Viện cớ kiểm soát", "body": "Lâm tự ý đọc tin nhắn điện thoại của Lan. Khi Lan phản đối, Lâm nổi giận quát: ''Vì tớ yêu cậu nên tớ mới xem chứ! Cậu có gì giấu giếm tớ đúng không?''. Lan thấy bối rối và tự trách mình vì đã làm Lâm giận."}', 3),
(@ml_id, 'interaction', '{"question": "Lâm đang có hành vi gì đối với Lan trong tình huống trên?", "choices": [{"text": "Thao túng cảm xúc và vi phạm ranh giới riêng tư của Lan dưới danh nghĩa tình yêu.", "correct": true, "emoji": "💚"}, {"text": "Thể hiện tình yêu thương chân thành và sự quan tâm sâu sắc đến đối phương.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng nghe ai nói câu: ''Nếu thực sự coi tớ là bạn, cậu phải làm việc này...'' chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Yêu thương không bao giờ đi kèm với sự kiểm soát và làm bạn cảm thấy tội lỗi vì đã đặt ranh giới."]}', 6);

-- --- Micro Lesson 6.3: Tại sao chia sẻ nỗi buồn lại thấy ngượng ngùng? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Tại sao chia sẻ nỗi buồn lại thấy ngượng ngùng?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao việc mở lời tâm sự với ai đó về những lo âu, tổn thương của bản thân lại khó khăn hơn việc chia sẻ niềm vui rất nhiều?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chia sẻ tổn thương (Vulnerability) khiến ta cảm thấy như đang cởi bỏ áo giáp, lo sợ bị đánh giá, từ chối hoặc coi là yếu đuối.", "Tuy nhiên, sự tổn thương chính là chiếc cầu nối mạnh mẽ nhất để xây dựng lòng tin và sự thấu cảm sâu sắc giữa người với người.", "Chọn lựa đối tượng đáng tin cậy để mở lòng là bước đi dũng cảm và cần thiết."]}', 2),
(@ml_id, 'scenario', '{"title": "Ngại ngùng chia sẻ", "body": "Khải gặp chuyện buồn trong gia đình. Cậu rất muốn tâm sự với bạn thân nhưng lại ngập ngừng sợ bạn sẽ nghĩ mình phiền phức, yếu đuối, nên lại thôi và giả vờ như không có chuyện gì."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các phản ứng khi bạn bè chia sẻ câu chuyện buồn thầm kín:", "leftBox": {"title": "Thấu cảm lắng nghe"}, "rightBox": {"title": "Phán xét gạt đi"}, "items": [{"text": "Tớ luôn ở đây sẵn sàng nghe cậu kể khi cậu thấy thoải mái nhé", "correctBox": "left"}, {"text": "Ối dào, chuyện nhỏ nhặt thế có gì đâu mà phải buồn!", "correctBox": "right"}, {"text": "Im lặng ngồi bên cạnh và ôm nhẹ để bạn biết bạn không cô đơn", "correctBox": "left"}, {"text": "Chuyển chủ đề trò chuyện sang kể về những chuyện vui của mình", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Ai là người bạn cảm thấy an toàn nhất để khóc hoặc chia sẻ những bí mật thầm kín?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chia sẻ tổn thương không phải là yếu đuối. Đó là lòng dũng cảm để kết nối chân thật."]}', 6);

-- --- Micro Lesson 6.4: Khi tình bạn "nhạt dần" và xuất hiện cờ đỏ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Khi tình bạn "nhạt dần" và xuất hiện cờ đỏ', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn sẽ làm gì khi nhận ra người bạn thân lâu năm dạo gần đây bắt đầu nói xấu sau lưng và cô lập bạn khỏi tập thể?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Không phải mọi tình bạn đều kéo dài mãi mãi. Mọi người thay đổi và các mối quan hệ cũng có hạn sử dụng.", "Các cờ đỏ (Red Flag) trong tình bạn: Thường xuyên chê bai bạn, tiết lộ bí mật của bạn cho người khác, hoặc chỉ tìm đến bạn khi cần nhờ vả.", "Chấp nhận buông bỏ một tình bạn độc hại là cách bạn tự bảo vệ sự bình yên của bản thân."]}', 2),
(@ml_id, 'scenario', '{"title": "Nhóm chat nói xấu", "body": "Vy phát hiện nhóm chat riêng của hội bạn thân dạo này thường xuyên chụp ảnh dìm và nói xấu Vy một cách công khai. Khi Vy hỏi, họ bảo: ''Đùa tí cho vui thôi mà, làm gì căng thế!''."}', 3),
(@ml_id, 'flashcard', '{"front": "Vy nên làm gì để xử lý tình huống tình bạn độc hại này một cách dũng cảm nhất?", "back": "Thiết lập khoảng cách với nhóm bạn đó, ngừng chia sẻ thông tin cá nhân và tìm kiếm những người bạn mới tôn trọng mình hơn.", "notes": "Đùa chỉ vui khi tất cả mọi người cùng cười, nếu có một người đau lòng thì đó là bắt nạt cảm xúc."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng phải đưa ra quyết định dừng chơi với một người bạn chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn thà có một người bạn chân thành còn hơn có một nhóm bạn luôn khiến bạn thấy bất an."]}', 6);

-- --- Micro Lesson 6.5: Khi quá tải: Tìm kiếm đồng minh đáng tin cậy ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Khi quá tải: Tìm kiếm đồng minh đáng tin cậy', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có biết khi những rắc rối cảm xúc vượt quá khả năng tự giải quyết, ai sẽ là người sẵn sàng lắng nghe và nâng đỡ bạn không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Giữ mọi gánh nặng tinh thần một mình dễ dẫn đến kiệt sức và các vấn đề tâm lý nghiêm trọng.", "Tìm kiếm hỗ trợ (Seeking support) là biểu hiện của sự thông thái và tự bảo vệ bản thân.", "Đồng minh đáng tin cậy: Bố mẹ, thầy cô y tế học đường, chuyên gia tâm lý, hoặc các tổng đài hỗ trợ trẻ em quốc gia (như Tổng đài 111)."]}', 2),
(@ml_id, 'scenario', '{"title": "Bắt nạt qua mạng", "body": "Nguyên bị một nhóm bạn trên mạng liên tục gửi tin nhắn đe dọa, xúc phạm danh dự. Cậu vô cùng hoảng sợ, không thể tập trung học tập, bị sụt cân và có những suy nghĩ tự hại mình."}', 3),
(@ml_id, 'interaction', '{"question": "Nguyên nên thực hiện hành động khẩn cấp nào lúc này để tự bảo vệ mình?", "choices": [{"text": "Chụp lại bằng chứng tin nhắn, báo ngay cho bố mẹ hoặc thầy cô giáo tin cậy và liên hệ tổng đài 111 để được tư vấn bảo vệ.", "correct": true, "emoji": "💚"}, {"text": "Im lặng tự chịu đựng, cố gắng thương lượng thỏa hiệp với nhóm bắt nạt mạng đó.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã lưu số điện thoại khẩn cấp hoặc biết cách liên hệ với phòng tư vấn tâm lý trường mình chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tìm kiếm sự giúp đỡ không phải là đầu hàng. Đó là cách bạn chọn để chiến thắng khó khăn."]}', 6);

-- --- Micro Lesson 6.6: Xây dựng "biệt đội giải cứu cảm xúc" cho riêng bạn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Xây dựng "biệt đội giải cứu cảm xúc" cho riêng bạn', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để tạo ra một môi trường xung quanh toàn những mối quan hệ tích cực nâng đỡ tinh thần bạn mỗi ngày?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mạng lưới hỗ trợ (Support network) giống như một tấm đệm an toàn giúp bạn giảm chấn thương khi bị ngã trong cuộc sống.", "Chủ động nuôi dưỡng tình bạn tốt bằng cách lắng nghe và giúp đỡ họ trước.", "Đặt ra ranh giới rõ ràng với những mối quan hệ độc hại để dành không gian cho những người thực sự trân trọng bạn."]}', 2),
(@ml_id, 'scenario', '{"title": "Môi trường kết nối mới", "body": "Sau khi cắt đứt liên lạc với nhóm bạn xấu, Minh bắt đầu tham gia câu lạc bộ ghi-ta, quen được những người bạn vui vẻ, cùng tập đàn và động viên nhau học tập."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành động để xây dựng mạng lưới hỗ trợ an toàn:", "leftBox": {"title": "Nuôi dưỡng kết nối tốt"}, "rightBox": {"title": "Dung dưỡng độc hại"}, "items": [{"text": "Chủ động nhắn tin hỏi han khi thấy bạn mình có vẻ buồn bã", "correctBox": "left"}, {"text": "Chấp nhận những lời xúc phạm của bạn bè vì sợ bị cô đơn", "correctBox": "right"}, {"text": "Cùng bạn lập nhóm học tập tiến bộ, chia sẻ tài liệu hay", "correctBox": "left"}, {"text": "Bỏ qua các cảnh báo bất an trong lòng để cố hòa nhập nhóm xấu", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Ai là những cái tên đầu tiên bạn sẽ đưa vào danh sách ''Biệt đội giải cứu cảm xúc'' của mình?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Được bao quanh bởi những người tử tế là liều thuốc chữa lành tốt nhất cho tâm hồn."]}', 6);

-- --- Micro Lesson 6.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Mối Quan Hệ Chất Lượng Cao Vs Độc Hại''! Bạn có 3 mạng để nhận diện cờ đỏ thao túng và bảo vệ ranh giới tình bạn."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Nhận diện và thoát khỏi thao túng",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bạn mượn điện thoại của bạn thân để gọi nhờ. Khi bạn trả lại, bạn thân nổi giận đùng đùng, giật lấy máy và quát: ''Sao cậu lại mở Zalo đọc tin nhắn của tớ? Cậu tò mò quá đáng thế!''. Dù bạn hoàn toàn không đọc gì, đối phương liên tục dùng ''chiến tranh lạnh'' bắt bạn xin lỗi.",
      "choices": [
        { "text": "Chấp nhận nhận lỗi và liên tục xin lỗi để xoa dịu cơn giận của bạn: ''Tớ xin lỗi, tớ hứa lần sau sẽ không chạm vào máy cậu nữa''.", "nextNode": "fail_accept_guilt" },
        { "text": "Bình tĩnh khẳng định ranh giới: ''Tớ chỉ dùng máy gọi điện và không hề mở tin nhắn. Tớ tôn trọng sự riêng tư của cậu và mong cậu cũng tin tưởng tớ''.", "nextNode": "step2" },
        { "text": "Nổi khùng mắng lại bạn thân là kẻ đa nghi, ích kỷ rồi đi nói xấu họ với các bạn khác trong lớp.", "nextNode": "fail_aggressive" }
      ]
    },
    "step2": {
      "text": "Hôm sau, bạn thân đòi bạn phải chia sẻ mật khẩu tài khoản Instagram để chứng minh lòng trung thực và bắt bạn xóa bớt danh sách bạn bè khác giới đi vì ''yêu thương và lo lắng cho bạn''.",
      "choices": [
        { "text": "Nhượng bộ đưa mật khẩu và xóa bạn bè vì sợ bị cô lập khỏi nhóm bạn chơi chung.", "nextNode": "fail_concede" },
        { "text": "Nhận diện đây là cờ đỏ kiểm soát số, kiên quyết từ chối: ''Tớ muốn giữ mật khẩu và bạn bè làm không gian riêng tư. Tụi mình tin tưởng nhau bằng hành động nhé!''.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Sau đó, nhóm bạn thân bắt đầu lập nhóm chat riêng để cô lập, đăng ảnh chế giễu bạn và nhắn tin đe dọa tung các bí mật cá nhân của hai đứa trước đây lên diễn đàn trường. Bạn thấy quá tải cảm xúc và lo sợ tột cùng.",
      "choices": [
        { "text": "Im lặng chịu đựng, cắn răng làm theo các yêu cầu nhạy cảm của họ để giữ bí mật.", "nextNode": "fail_blackmail" },
        { "text": "Chụp màn hình bằng chứng, báo ngay cho bố mẹ hoặc thầy cô giáo y tế học đường, và gọi tổng đài 111 để nhận sự che chở pháp lý.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Xuất sắc! Bạn đã dũng cảm nhận diện cờ đỏ thao túng cảm xúc, kiên định bảo vệ ranh giới số và tìm kiếm sự hỗ trợ khẩn cấp từ người lớn kịp thời.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_accept_guilt": {
      "text": "❌ Chưa đúng! Nhận tội khống để xoa dịu kẻ thao túng (gaslighting) chỉ khiến họ tiếp tục kiểm soát tâm lý và lấn lướt ranh giới của bạn trong tương lai.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_aggressive": {
      "text": "❌ Chưa đúng! Công kích lại đối phương và đi nói xấu sau lưng không giải quyết được mâu thuẫn mà còn biến bạn thành kẻ bắt nạt cảm xúc.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_concede": {
      "text": "❌ Sai rồi! Bàn giao mật khẩu cá nhân và xóa bạn bè theo yêu cầu vô lý là tự nguyện chui vào bẫy kiểm soát độc hại.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_blackmail": {
      "text": "❌ Sai rồi! Thỏa hiệp với kẻ tống tiền bôi nhọ không mang lại sự an toàn. Hãy chụp bằng chứng và báo cáo ngay cho người lớn.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các cờ hiệu tình bạn:",
  "leftBox": { "title": "Cờ xanh Green Flag" },
  "rightBox": { "title": "Cờ đỏ Red Flag" },
  "items": [
    { "text": "Lắng nghe không phán xét, tôn trọng ranh giới cá nhân", "correctBox": "left" },
    { "text": "Dùng sự im lặng, chiến tranh lạnh để trừng phạt khi bạn làm trái ý", "correctBox": "right" },
    { "text": "Biết nói lời xin lỗi chân thành khi làm tổn thương bạn", "correctBox": "left" },
    { "text": "Thường xuyên chê bai ngoại hình và nói xấu sau lưng bạn", "correctBox": "right" },
    { "text": "Vui mừng và ủng hộ ước mơ, thành công của bạn", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa mối quan hệ và định nghĩa phù hợp:",
  "pairs": [
    { "left": "Gaslighting (Thao túng)", "right": "Hành vi làm đối phương nghi ngờ suy nghĩ, cảm xúc và trí nhớ của chính mình." },
    { "left": "Vulnerability (Tổn thương)", "right": "Dũng khí cởi bỏ áo giáp để chia sẻ thật lòng lo âu với người đáng tin." },
    { "left": "Mạng lưới hỗ trợ", "right": "Tấm đệm an toàn gồm gia đình, thầy cô, chuyên gia giúp giảm chấn thương cuộc sống." },
    { "left": "Tổng đài 111", "right": "Đường dây nóng quốc gia hỗ trợ, tư vấn và bảo vệ trẻ em Việt Nam 24/7." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa mối quan hệ lành mạnh:",
  "sentence": "Tình bạn lành mạnh tôn trọng ranh giới và không bắt bạn phải [blank1] gánh vác mọi lo âu. Khi gặp kẻ [blank2] cảm xúc, hãy dũng cảm thiết lập khoảng cách và tìm kiếm sự giúp đỡ từ những [blank3] đáng tin cậy hoặc gọi tổng đài [blank4].",
  "blanks": {
    "blank1": { "correct": "âm thầm", "placeholder": "..." },
    "blank2": { "correct": "thao túng", "placeholder": "..." },
    "blank3": { "correct": "đồng minh", "placeholder": "..." },
    "blank4": { "correct": "111", "placeholder": "..." }
  },
  "words": ["âm thầm", "thao túng", "đồng minh", "111", "xin lỗi", "im lặng", "nể sợ", "bạn thân"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Khi bạn thân của bạn liên tục dùng chiêu trò ''chiến tranh lạnh'' (im lặng không rep tin nhắn) để ép bạn phải đi chơi chung khi bạn đang mệt, phản ứng nào thể hiện sự tự chủ nhất?",
  "enableLives": true,
  "choices": [
    { "text": "Nhắn tin năn nỉ, xin lỗi dồn dập để họ hết giận.", "correct": false, "emoji": "🥺" },
    { "text": "Giữ vững ranh giới: ''Tớ mệt cần nghỉ ngơi. Khi nào cậu sẵn sàng nói chuyện bình thường thì tụi mình chat nhé'' và không nhắn tin ép họ.", "correct": true, "emoji": "💚" },
    { "text": "Lập tức chặn liên lạc và unfriend họ vĩnh viễn.", "correct": false, "emoji": "🛑" },
    { "text": "Nhờ các bạn khác vào group chat để nói móc mỉa họ.", "correct": false, "emoji": "😐" }
  ]
}', 6);



-- =========================================================================
-- BÀI HỌC 7: Yêu Bản Thân: Không Chỉ Là Câu Nói Bắt Trend! (Self-Care)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'tu-cham-soc-va-phat-trien-ban-than',
    'Yêu Bản Thân: Không Chỉ Là Câu Nói Bắt Trend!',
    'Hiểu đúng về tự chăm sóc bản thân, học cách thiết lập ranh giới từ từ chối và hướng tới sự phát triển cá nhân bền vững.',
    'Bài học cuối cùng hướng dẫn phương pháp self-care đích thực, rèn luyện kỹ năng từ chối bảo vệ năng lượng cá nhân và đặt mục tiêu thói quen nhỏ.',
    41,
    false,
    100,
    12
);
SET @lesson7_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson7_id, 'Scarleteen - Self-Care', 'https://www.scarleteen.com/read/bodies/do-it', 'website');

-- --- Micro Lesson 7.1: Tự chăm sóc (Self-care): Đâu chỉ là đi shopping! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Tự chăm sóc (Self-care): Đâu chỉ là đi shopping!', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có phải tự chăm sóc bản thân chỉ đơn giản là đi mua sắm những món đồ đắt tiền, ăn uống sang chảnh hay đắp mặt nạ dưỡng da?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tự chăm sóc (Self-care) thực chất là những thói quen nhỏ hàng ngày giúp bảo vệ sức khỏe thể chất và tinh thần của bạn.", "Nó bao gồm việc uống đủ nước, ngủ đủ giấc, ăn uống đủ chất, và cho phép bản thân nghỉ ngơi khi quá tải.", "Đôi khi, tự chăm sóc chỉ đơn giản là tắt điện thoại đi ngủ sớm sau một ngày mệt mỏi."]}', 2),
(@ml_id, 'scenario', '{"title": "Hiểu lầm về self-care", "body": "Lan nghĩ rằng self-care là phải đi spa và mua trà sữa uống mỗi ngày. Nhưng cô bạn vẫn thức khuya đến 2h sáng lướt điện thoại và luôn đi học muộn với gương mặt phờ phạc."}', 3),
(@ml_id, 'flashcard', '{"front": "Thế nào là một hành động tự chăm sóc bản thân thực sự lành mạnh và hiệu quả?", "back": "Những hành động giúp cơ thể và tâm trí bạn khỏe mạnh lâu dài: Ngủ đúng giờ, ăn sáng đầy đủ, tập thể thao vừa sức, và đặt ranh giới bảo vệ cảm xúc.", "notes": "Self-care không phải là trốn chạy thực tại, mà là chuẩn bị năng lượng tốt nhất để đối mặt với thực tại."}', 4),
(@ml_id, 'reflection', '{"question": "Hành động tự chăm sóc bản thân đơn giản nhất bạn có thể làm ngay tối hôm nay là gì?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Yêu bản thân bắt đầu từ những thói quen nhỏ nhất chăm sóc cơ thể sinh học của mình."]}', 6);

-- --- Micro Lesson 7.2: Lập chiếc "menu" sạc pin tâm hồn ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Lập chiếc "menu" sạc pin tâm hồn', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để tạo ra một danh sách những việc siêu đơn giản có thể giúp bạn lấy lại nụ cười chỉ trong vài phút?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chiếc ''menu sạc pin'' (Self-care menu) chứa các hoạt động nhỏ giúp kích hoạt các hormone tích cực (dopamine, serotonin).", "Hãy chuẩn bị sẵn các lựa chọn phù hợp với thời gian bạn có: 5 phút, 15 phút hay 1 tiếng.", "Đây sẽ là chiếc phao cứu sinh đắc lực mỗi khi bạn cảm thấy kiệt sức hoặc buồn chán."]}', 2),
(@ml_id, 'scenario', '{"title": "Tưới cây thư giãn", "body": "Khánh cảm thấy rất mệt mỏi sau tiết học căng thẳng. Cậu xem chiếc menu tự chế của mình và chọn hoạt động 5 phút: Ra ban công tưới cây và vươn vai hít thở sâu."}', 3),
(@ml_id, 'interaction', '{"question": "Hoạt động nào dưới đây phù hợp nhất để đưa vào danh mục ''sạc pin nhanh 5 phút''?", "choices": [{"text": "Vươn vai kéo giãn cơ thể, uống một cốc nước mát và hít thở sâu ngoài cửa sổ.", "correct": true, "emoji": "💚"}, {"text": "Xem trọn vẹn một bộ phim điện ảnh dài tập trên điện thoại.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Nếu tự làm một chiếc menu sạc pin cho mình, bạn sẽ viết những hoạt động nào vào đó?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chuẩn bị sẵn năng lượng tích cực để chủ động cứu hộ bản thân khi cần."]}', 6);

-- --- Micro Lesson 7.3: Yêu chiều bản thân: Không có gì phải thấy tội lỗi! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Yêu chiều bản thân: Không có gì phải thấy tội lỗi!', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ cảm thấy cắn rứt, tội lỗi khi dành cả một buổi chiều chủ nhật chỉ để nằm lười biếng mà không học tập hay làm việc gì không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Xã hội hiện đại luôn đề cao sự bận rộn (hustle culture), khiến chúng ta nghĩ rằng lúc nào cũng phải làm việc mới có giá trị.", "Nghỉ ngơi tích cực (Rest) không phải là lãng phí thời gian, nó là bước đệm cần thiết để các tế bào thần kinh tái tạo.", "Bạn không cần phải ''kiếm tìm'' hay ''xứng đáng'' mới được quyền nghỉ ngơi; đó là nhu cầu sinh học tối thiểu."]}', 2),
(@ml_id, 'scenario', '{"title": "Áy náy khi giải trí", "body": "Mai cảm thấy vô cùng áy náy và lo lắng khi dành ngày nghỉ để xem phim. Cô bạn liên tục nhìn đống sách vở, thấy có lỗi với bố mẹ và không thể tận hưởng trọn vẹn bộ phim."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các suy nghĩ về việc nghỉ ngơi giải lao:", "leftBox": {"title": "Nghỉ ngơi không tội lỗi"}, "rightBox": {"title": "Áy náy ép buộc"}, "items": [{"text": "Cho phép bản thân ngủ nướng một chút vào ngày cuối tuần để phục hồi", "correctBox": "left"}, {"text": "Vừa nằm nghỉ vừa tự trách mình lười biếng và thua kém bạn bè", "correctBox": "right"}, {"text": "Tự nhủ: Cơ thể mình đã vất vả cả tuần và xứng đáng được thư giãn", "correctBox": "left"}, {"text": "Cố học tiếp dù đầu đang đau nhức vì sợ bị điểm kém", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thường cảm thấy tội lỗi khi cho phép bản thân nghỉ ngơi không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Nghỉ ngơi là để tái tạo, không phải là sự lười biếng cần phải trừng phạt."]}', 6);

-- --- Micro Lesson 7.4: Khi bạn nói "Có" với người khác nhưng lại nói "Không" với chính mình ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Khi bạn nói "Có" với người khác nhưng lại nói "Không" với chính mình', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao việc từ chối lời nhờ vả của bạn bè lại khó khăn đến thế, ngay cả khi bạn đang vô cùng bận rộn và kiệt sức?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hội chứng ''người tốt làm hài lòng tất cả'' (People-pleaser) bắt nguồn từ nỗi sợ bị ghét bỏ hoặc tẩy chay.", "Khi bạn luôn nói ''Có'' với yêu cầu của người khác, bạn đang gián tiếp nói ''Không'' với sự bình yên và sức khỏe của chính mình.", "Thiết lập ranh giới lịch sự giúp bạn bảo vệ năng lượng cá nhân và giữ gìn các mối quan hệ bền vững hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Không dám từ chối", "body": "Hải đang ngập đầu trong đống bài tập cần nộp. Tuy nhiên, khi một bạn trong lớp nhờ Hải làm hộ slide thuyết trình nhóm của bạn ấy, Hải không dám từ chối vì sợ bạn sẽ giận."}', 3),
(@ml_id, 'flashcard', '{"front": "Hải nên từ chối lời nhờ vả của bạn thế nào để vừa lịch sự vừa giữ được ranh giới?", "back": "Hải có thể nói: ''Tớ rất muốn giúp nhưng tối nay tớ cũng có bài tập lớn cần hoàn thành gấp rồi. Để dịp khác nha cậu!''.", "notes": "Người thực sự trân trọng bạn sẽ hiểu và tôn trọng lời từ chối của bạn."}', 4),
(@ml_id, 'reflection', '{"question": "Gần đây nhất bạn đã nói ''Có'' với ai đó trong khi lòng bạn đang vô cùng muốn từ chối là khi nào?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không cần phải làm hài lòng tất cả mọi người bằng cách bỏ qua cảm xúc của chính mình."]}', 6);

-- --- Micro Lesson 7.5: Nghệ thuật nói "Không" để bảo vệ sức khỏe tinh thần ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Nghệ thuật nói "Không" để bảo vệ sức khỏe tinh thần', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để nói lời từ chối một cách kiên định mà không gây cảm giác cộc lốc, thô lộ với người đối diện?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Từ chối lịch sự (Polite refusal) cần sự rõ ràng, dứt khoát và đi kèm một lời giải thích ngắn gọn (không cần phải dông dài bao biến).", "Sử dụng cấu trúc: Lời cảm ơn/ghi nhận -> Lời từ chối rõ ràng -> Đề xuất thay thế (nếu muốn).", "Thực hành nói ''Không'' giúp bạn tăng sự tự tin và lòng tự trọng lên rất nhiều."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời rủ rê tối muộn", "body": "Hội bạn thân rủ Trang đi trà sữa vào tối muộn trước ngày thi. Trang cảm thấy mệt mỏi và muốn đi ngủ sớm để giữ sức nhưng chưa biết từ chối sao cho khéo."}', 3),
(@ml_id, 'interaction', '{"question": "Trang nên nhắn tin từ chối nhóm bạn thế nào cho tự nhiên, Gen Z?", "choices": [{"text": "''Thèm đi cùng các cậu quá nhưng tối nay tớ muốn đi ngủ sớm dưỡng sức thi mai. Chúc cả hội đi chơi vui vẻ, mai thi xong tụi mình bù nha!''", "correct": true, "emoji": "💚"}, {"text": "Im lặng không trả lời tin nhắn của nhóm, hôm sau đi thi giả vờ bị mất điện thoại.", "correct": false, "emoji": "☹️"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thấy việc nói lời từ chối với bố mẹ, bạn bè hay thầy cô là khó khăn nhất?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Nói ''Không'' với điều không phù hợp là cách bạn nói ''Có'' với sức khỏe tinh thần của chính mình."]}', 6);

-- --- Micro Lesson 7.6: Mỗi ngày tốt hơn 1%: Thiết lập thói quen nhỏ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Mỗi ngày tốt hơn 1%: Thiết lập thói quen nhỏ', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có tin rằng việc thay đổi những thói quen siêu nhỏ mỗi ngày có thể tạo nên bước ngoặt lớn cho sự phát triển của bạn sau một năm không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Phát triển bản thân (Personal growth) không phải là sự thay đổi chấn động qua một đêm, mà là sự kiên trì tích lũy.", "Thiết lập các mục tiêu siêu nhỏ dễ đạt được (như đọc 2 trang sách, uống thêm 1 cốc nước, ngủ sớm hơn 10 phút).", "Tự thưởng cho bản thân mỗi khi hoàn thành thói quen nhỏ để tạo động lực tiếp tục hành trình lớn lên đầy tự hào."]}', 2),
(@ml_id, 'scenario', '{"title": "Duy trì giấc ngủ ngon", "body": "Khải quyết định cải thiện sức khỏe bằng cách đi ngủ lúc 11h thay vì 12h đêm. Sau một tháng, cậu nhận thấy mình tỉnh táo hơn trong giờ học, da mặt bớt mụn và tinh thần luôn vui tươi."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các mục tiêu thói quen thiết lập hàng ngày:", "leftBox": {"title": "Mục tiêu nhỏ khả thi"}, "rightBox": {"title": "Mục tiêu quá tải"}, "items": [{"text": "Đọc 2 trang sách trước khi đi ngủ mỗi tối", "correctBox": "left"}, {"text": "Ép bản thân phải học liên tục 10 tiếng không nghỉ", "correctBox": "right"}, {"text": "Tập thể dục nhẹ nhàng 10 phút sau khi thức dậy", "correctBox": "left"}, {"text": "Thay đổi toàn bộ chế độ ăn kiêng hà khắc ngay lập tức", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Một thói quen nhỏ, tích cực nào bạn muốn bắt đầu thiết lập ngay từ ngày mai?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Những bước đi nhỏ mỗi ngày sẽ đưa bạn đi được một hành trình rất xa. Hãy kiên trì nhé!"]}', 6);

-- --- Micro Lesson 7.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Yêu Bản Thân: Không Chỉ Là Câu Nói Bắt Trend''! Bạn có 3 mạng để thực hành tự chăm sóc lành mạnh và thiết lập ranh giới nói không."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Thực hành self-care và nói Không",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Tối muộn trước ngày thi học kỳ quan trọng, bạn đã rất mệt và muốn đi ngủ sớm lúc 10h30 để giữ sức khỏe. Bỗng nhiên, nhóm bạn thân liên tục gọi điện, nhắn tin trong group chat lớp rủ bạn vào game cày rank cùng để lấy thành tích chung.",
      "choices": [
        { "text": "Nể bạn bè, cố online chơi cùng đến 1h sáng dù mắt nhắm mắt mở mệt mỏi.", "nextNode": "fail_pleaser" },
        { "text": "Nhắn tin từ chối lịch sự, kiên định: ''Tớ thèm chơi cùng quá nhưng tối nay tớ muốn ngủ sớm để mai làm bài tốt. Thi xong tụi mình cày bù nhé!'' rồi off điện thoại đi ngủ.", "nextNode": "step2" },
        { "text": "Tắt nguồn điện thoại đi ngủ mà không nói một lời nào với nhóm bạn.", "nextNode": "fail_silent_cut" }
      ]
    },
    "step2": {
      "text": "Sáng hôm sau đi thi, bạn làm bài rất tỉnh táo. Tuy nhiên, buổi trưa lúc ăn cơm, nhóm bạn giận dỗi trách móc: ''Có mỗi thế cũng từ chối, đúng là đồ phá đám mất hết cả hứng của nhóm!''. Bạn thấy trong lòng dâng lên cảm giác có lỗi và áy náy.",
      "choices": [
        { "text": "Vội vàng hứa hẹn bù đắp: ''Tối nay tớ hứa sẽ online chơi bù cùng các cậu suốt đêm nhé!'' để họ hết giận.", "nextNode": "fail_compromise" },
        { "text": "Chấp nhận cảm giác áy náy ngắn hạn, tự giải thích nhẹ nhàng: ''Tớ tôn trọng việc leo rank nhưng sức khỏe ngày thi quan trọng hơn với tớ mà. Mong các cậu thông cảm nha!''", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Cuối tuần đến, bạn muốn thực hành tự chăm sóc (self-care) tâm hồn. Bạn muốn lập một kế hoạch thói quen nhỏ khả thi lâu dài để nâng cấp cuộc sống.",
      "choices": [
        { "text": "Đặt mục tiêu mỗi tối đọc 2 trang sách và đi ngủ trước 11h đêm đều đặn mỗi ngày.", "nextNode": "success_end" },
        { "text": "Lập lịch trình học tập hà khắc liên tục 12 tiếng một ngày và nhịn ăn tối để giảm cân ngay lập tức.", "nextNode": "fail_unrealistic" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn toàn chính xác! Bạn đã thực hành nghệ thuật từ chối kiên định để bảo vệ năng lượng bản thân, vượt qua áp lực làm hài lòng đám đông và thiết lập thói quen nhỏ bền vững.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_pleaser": {
      "text": "❌ Chưa đúng! Nhượng bộ áp lực nhóm (people-pleasing) làm tổn hại nghiêm trọng đến giấc ngủ và kết quả thi cử của bạn ngày hôm sau.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_silent_cut": {
      "text": "❌ Chưa đúng! Im lặng cắt đứt liên lạc đột ngột dễ gây hiểu lầm là bạn khinh khỉnh hoặc vô trách nhiệm. Một lời từ chối thẳng thắn, rõ ràng luôn tốt hơn.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_compromise": {
      "text": "❌ Sai rồi! Nhượng bộ thức đêm cày bù chỉ làm kiệt quệ thể chất và chứng tỏ bạn không tôn trọng ranh giới sức khỏe của chính mình.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_unrealistic": {
      "text": "❌ Sai rồi! Lập kế hoạch quá tải, hà khắc đột ngột chỉ khiến bộ não phản kháng và bỏ cuộc nhanh chóng, không đem lại sự phát triển bền vững.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các hoạt động tự chăm sóc:",
  "leftBox": { "title": "Self-care đích thực" },
  "rightBox": { "title": "Shopping / Trốn chạy nhất thời" },
  "items": [
    { "text": "Ngủ đúng giờ và uống đủ nước mỗi ngày", "correctBox": "left" },
    { "text": "Nạp thật nhiều trà sữa và thức ăn nhanh để xoa dịu nỗi buồn", "correctBox": "right" },
    { "text": "Đọc 2 trang sách hoặc đi bộ 10 phút sạc pin tinh thần", "correctBox": "left" },
    { "text": "Đi mua sắm vô tội vạ những món đồ đắt tiền để giải tỏa áp lực", "correctBox": "right" },
    { "text": "Từ chối lời rủ rê đi chơi muộn khi cơ thể đang kiệt sức", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa tự chăm sóc và định nghĩa phù hợp:",
  "pairs": [
    { "left": "Self-care (Tự chăm sóc)", "right": "Những thói quen nhỏ giúp bảo vệ sức khỏe sinh học và tinh thần lâu dài." },
    { "left": "People-pleasing", "right": "Hội chứng luôn cố nói Có để làm hài lòng người khác vì sợ bị ghét." },
    { "left": "Nghỉ ngơi tích cực", "right": "Nhu cầu sinh học tối thiểu giúp các tế bào thần kinh phục hồi và tái tạo." },
    { "left": "Thói quen siêu nhỏ", "right": "Cải tiến 1% mỗi ngày giúp vượt qua sự phản kháng của não bộ." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa tự yêu thương:",
  "sentence": "Tự chăm sóc bản thân không phải là hành vi [blank1], nó là nhu cầu sinh học tối thiểu. Hãy học cách nói [blank2] với người khác để nói [blank3] với sức khỏe của mình, và kiên trì rèn luyện các thói quen [blank4] mỗi ngày.",
  "blanks": {
    "blank1": { "correct": "ích kỷ", "placeholder": "..." },
    "blank2": { "correct": "Không", "placeholder": "..." },
    "blank3": { "correct": "Có", "placeholder": "..." },
    "blank4": { "correct": "siêu nhỏ", "placeholder": "..." }
  },
  "words": ["ích kỷ", "Không", "Có", "siêu nhỏ", "lười biếng", "shopping", "ép buộc", "im lặng"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Tại sao các mục tiêu thói quen siêu nhỏ (như đọc 2 trang sách, tập thể dục 5 phút) lại đem lại sự phát triển bền vững hơn các kế hoạch thay đổi to lớn?",
  "enableLives": true,
  "choices": [
    { "text": "Vì mục tiêu nhỏ giúp bạn nhận được nhiều lời khen ngợi từ mọi người.", "correct": false, "emoji": "😐" },
    { "text": "Vì chúng dễ dàng thực hiện, không kích hoạt hệ thống phản kháng của bộ não và giúp xây dựng đường liên kết thần kinh bền vững.", "correct": true, "emoji": "💚" },
    { "text": "Vì các thói quen lớn tốn quá ít thời gian của bạn.", "correct": false, "emoji": "🙁" },
    { "text": "Vì thói quen nhỏ không đòi hỏi bạn phải đầu tư bất kỳ nỗ lực nào.", "correct": false, "emoji": "🛑" }
  ]
}', 6);

-- =========================================================================
-- CẬP NHẬT VIDEO ID (TEASER & FULL) CHO CÁC BÀI HỌC
-- =========================================================================
UPDATE lessons SET teaser_video_id = '9hnfYkApRP4', full_video_id = '7rh0hOEi2YY' WHERE id = @lesson1_id;
UPDATE lessons SET teaser_video_id = 'msLrLfoN-l0', full_video_id = 'fMpbsYCmeys' WHERE id = @lesson2_id;
UPDATE lessons SET teaser_video_id = '_EI49W8C8HM', full_video_id = 'mVTzIhkH3AU' WHERE id = @lesson3_id;
UPDATE lessons SET teaser_video_id = 'G-rf7-GmJDs', full_video_id = 'Vzhki_xDLj0' WHERE id = @lesson4_id;
UPDATE lessons SET teaser_video_id = 'biLXKK_qbAg', full_video_id = 'Owxn-Rnngnc' WHERE id = @lesson5_id;
UPDATE lessons SET teaser_video_id = 'szJ_snaHdY0', full_video_id = 'rU9PJWT7IrM' WHERE id = @lesson6_id;
UPDATE lessons SET teaser_video_id = 'RQdRs4fGKFE', full_video_id = 'Us3jEGzJ65Q' WHERE id = @lesson7_id;

