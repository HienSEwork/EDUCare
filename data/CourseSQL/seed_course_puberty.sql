-- =========================================================================
-- SEED DATA FOR COURSE: Dậy Thì Thành Công: Cẩm Nang "Upgrade" Bản Thân! (Puberty Basics)
-- Maps to schemas in init.sql: courses, lessons, micro_lessons,
-- micro_lesson_blocks, and lesson_sources.
-- =========================================================================

SET NAMES utf8mb4;
USE educare;

-- 1. Thêm Khóa học mới
INSERT INTO courses (title, description, thumbnail, color_theme, course_order)
VALUES (
    'Dậy Thì Thành Công: Cẩm Nang "Upgrade" Bản Thân!',
    'Tìm hiểu về thay đổi thể chất, hệ sinh sản, kinh nguyệt, mộng tinh, bão cảm xúc và cách tự chăm sóc cơ thể tuổi dậy thì.',
    'puberty-course.png',
    '#f77f00',
    22
);
SET @course_id = LAST_INSERT_ID();

-- =========================================================================
-- BÀI HỌC 1: Dậy Thì Là Gì? Khi Cơ Thể Rục Rịch Thay Đổi! (Understanding Puberty)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'day-thi-la-gi',
    'Dậy Thì Là Gì? Khi Cơ Thể Rục Rịch Thay Đổi!',
    'Khám phá khái niệm về dậy thì, nhịp độ phát triển của mỗi cơ thể và cách vượt qua những ngại ngùng đầu đời.',
    'Bài học này giúp bạn hiểu rõ thế nào là dậy thì, giải đáp vì sao mọi người dậy thì ở thời điểm khác nhau và tìm kiếm đồng minh đáng tin cậy.',
    28,
    true,
    100,
    12
);
SET @lesson1_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson1_id, 'Scarleteen - Puberty Basics', 'https://www.scarleteen.com/read/bodies/not-everything-you-wanted-know-about-puberty-pretty-darn-close', 'website');

-- --- Micro Lesson 1.1: Ủa, "Dậy thì" thực chất là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Ủa, "Dậy thì" thực chất là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có bao giờ bạn thức dậy và cảm thấy cơ thể hay cảm xúc của mình có chút ''lạ lẫm'' hơn hôm qua không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Dậy thì (Puberty) là giai đoạn chuyển tiếp tự nhiên từ một đứa trẻ thành một người trưởng thành về mặt sinh học.", "Não bộ sẽ phát tín hiệu giải phóng các hormone (kẻ kích hoạt âm thầm) để khởi động hàng loạt thay đổi về thể chất lẫn cảm xúc.", "Đây là hành trình bắt buộc và hoàn toàn tự nhiên mà ai trong chúng ta cũng phải đi qua."]}', 2),
(@ml_id, 'scenario', '{"title": "Giọng nói lạ lẫm", "body": "Nam dạo này thấy mình cao vọt lên, giọng nói bỗng dưng ồm ồm như người lớn khiến cậu rất ngại ngùng mỗi khi phát biểu bài trước lớp."}', 3),
(@ml_id, 'flashcard', '{"front": "Dậy thì có phải là một ''căn bệnh'' hay điều gì bất thường không?", "back": "Tuyệt đối KHÔNG. Đó là một quá trình sinh học kỳ diệu để chuẩn bị cho cơ thể bạn trưởng thành.", "notes": "Hãy xem nó như một bản cập nhật phần mềm (software update) cực kỳ quan trọng của cơ thể."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn bắt đầu nhận thấy sự thay đổi nào đầu tiên trên cơ thể mình gần đây chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Dậy thì chỉ là cách cơ thể thông báo: ''Bạn đang lớn lên đấy thôi!''."]}', 6);

-- --- Micro Lesson 1.2: Khi nào thì "công tắc" bật lên? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Khi nào thì "công tắc" bật lên?', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có phải tất cả mọi người đều dậy thì vào cùng một độ tuổi không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Độ tuổi dậy thì phổ biến là từ 8 đến 14 tuổi, nhưng mỗi người có một chiếc đồng hồ sinh học riêng.", "Có bạn dậy thì rất sớm, có bạn lại dậy thì muộn hơn. Cả hai điều này đều hoàn toàn bình thường!", "Đừng lo lắng nếu bạn thấy mình ''lớn'' nhanh hơn hoặc chậm hơn các bạn cùng lớp."]}', 2),
(@ml_id, 'scenario', '{"title": "So sánh vóc dáng", "body": "Vy thấy các bạn nữ trong lớp đều đã bắt đầu cao lên và thay đổi vóc dáng, riêng mình vẫn nhỏ bé như học sinh tiểu học khiến Vy cảm thấy rất sốt ruột."}', 3),
(@ml_id, 'interaction', '{"question": "Vy có nên quá lo lắng vì mình chưa dậy thì giống các bạn không?", "choices": [{"text": "Không nên lo lắng. Chiếc đồng hồ dậy thì của mỗi người là khác nhau và Vy rồi cũng sẽ dậy thì theo nhịp độ của riêng mình.", "correct": true, "emoji": "💚"}, {"text": "Có chứ, nên đi mua các loại thuốc tăng trưởng uống ngay để bắt kịp các bạn.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng cảm thấy tự ti khi so sánh tốc độ lớn của mình với một người bạn thân chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mỗi cơ thể có một lịch trình riêng. Hãy kiên nhẫn và yêu thương nhịp điệu của chính mình."]}', 6);

-- --- Micro Lesson 1.3: Cảm giác "bất ổn" đầu đời ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Cảm giác "bất ổn" đầu đời', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao dậy thì lại đi kèm với những lo lắng và bỡ ngỡ khó tả thành lời?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cơ thể thay đổi quá nhanh khiến não bộ chưa kịp thích nghi, dẫn đến cảm giác bất an hoặc lạ lẫm với chính mình.", "Bạn có thể thấy ngại ngùng với những bộ quần áo cũ không còn vừa, hoặc lo sợ người khác soi xét ngoại hình của mình.", "Chấp nhận rằng cảm giác ''bất ổn'' này là bình thường giúp bạn nhẹ lòng hơn rất nhiều."]}', 2),
(@ml_id, 'scenario', '{"title": "Quần áo chật chội", "body": "Mai cảm thấy bực bội khi chiếc quần jeans yêu thích bỗng chật ních ở hông, và cô bạn bắt đầu ghét việc phải mặc đồ ôm sát người."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các phản ứng trước những thay đổi đầu đời:", "leftBox": {"title": "Đón nhận tích cực"}, "rightBox": {"title": "Lo âu quá mức"}, "items": [{"text": "Tự nhủ: Cơ thể mình đang lớn lên và việc thay đổi này là hoàn toàn tự nhiên", "correctBox": "left"}, {"text": "Trốn tránh không dám đi chơi với bạn bè vì sợ họ nhận ra mình cao lên", "correctBox": "right"}, {"text": "Mua quần áo mới thoải mái hơn để phù hợp với vóc dáng hiện tại", "correctBox": "left"}, {"text": "Liên tục soi gương và tự trách móc bản thân vì cơ thể không giống ngày xưa", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Cảm xúc nào khiến bạn thấy khó khăn nhất khi nghĩ về sự trưởng thành của bản thân?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bỡ ngỡ là một phần của sự trưởng thành. Bạn đang làm rất tốt hành trình này!"]}', 6);

-- --- Micro Lesson 1.4: Tình huống: Lời trêu chọc vô duyên ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Tình huống: Lời trêu chọc vô duyên', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn sẽ làm gì khi bạn bè xung quanh bắt đầu đem những thay đổi cơ thể của bạn ra làm trò đùa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Ở tuổi dậy thì, bạn bè thường tò mò và đôi khi có những lời trêu chọc thiếu tinh tế về giọng nói, chiều cao hay ngực.", "Những lời đùa đó có thể làm bạn tổn thương, nhưng hãy nhớ: lỗi không nằm ở cơ thể bạn.", "Học cách thiết lập ranh giới và phản hồi kiên định trước những lời trêu chọc vô duyên."]}', 2),
(@ml_id, 'scenario', '{"title": "Giờ ra chơi ồn ào", "body": "Trong giờ ra chơi, một nhóm bạn nam cười phá lên trêu giọng nói đang vỡ bị ồm và rè của Tuấn, khiến Tuấn đỏ mặt cúi gục xuống bàn."}', 3),
(@ml_id, 'flashcard', '{"front": "Tuấn nên ứng phó thế nào để bảo vệ lòng tự trọng của mình một cách văn minh?", "back": "Tuấn có thể nhìn thẳng vào họ và nói bình thản: Giọng tớ đang thay đổi vì tớ đang dậy thì thôi, có gì lạ đâu cậu?.", "notes": "Sự tự tin và bình thản của bạn chính là câu trả lời mạnh mẽ nhất làm tắt đài những lời trêu chọc."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng chứng kiến hay trải qua việc bị trêu chọc về ngoại hình ở trường chưa? Cảm xúc lúc đó thế nào?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể bạn đang làm việc chăm chỉ để lớn lên. Không ai có quyền chế giễu nỗ lực đó của bạn."]}', 6);

-- --- Micro Lesson 1.5: Tìm kiếm đồng minh đáng tin ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Tìm kiếm đồng minh đáng tin', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có thấy khó khăn khi muốn mở lời tâm sự những chuyện thầm kín tuổi dậy thì với bố mẹ không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Nhiều bạn trẻ thấy xấu hổ khi nói về mụn, mùi cơ thể, hay kinh nguyệt với người lớn.", "Tuy nhiên, bố mẹ hay thầy cô đều đã từng đi qua giai đoạn này và họ có rất nhiều kinh nghiệm thực tế.", "Chọn một thời điểm thoải mái và một người lớn bạn tin tưởng nhất để bắt đầu cuộc trò chuyện."]}', 2),
(@ml_id, 'scenario', '{"title": "Yêu cầu khó mở lời", "body": "Linh bắt đầu nhận thấy ngực mình hơi đau và nhú lên, Linh muốn xin mẹ mua cho chiếc áo lót đầu tiên nhưng ngại ngùng không biết nói sao."}', 3),
(@ml_id, 'interaction', '{"question": "Linh nên mở lời với mẹ thế nào cho tự nhiên và đỡ ngại?", "choices": [{"text": "Nhắn tin riêng cho mẹ hoặc nói nhỏ: Mẹ ơi, cơ thể con dạo này đang thay đổi chút ít, cuối tuần mẹ đi mua đồ lót mới với con nha mẹ?", "correct": true, "emoji": "💚"}, {"text": "Im lặng tự chịu đựng đau đớn và tự lấy tiền tiết kiệm mua đại đồ lót không vừa cỡ trên mạng.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Ai là người lớn mà bạn cảm thấy thoải mái và tin tưởng nhất để hỏi về những thay đổi cơ thể?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn không cần phải tự mình gánh vác mọi thắc mắc. Hãy chia sẻ để nhận được sự nâng đỡ."]}', 6);

-- --- Micro Lesson 1.6: Chúc mừng bản cập nhật mới! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Chúc mừng bản cập nhật mới!', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có sẵn sàng đón nhận phiên bản mới của chính mình với đầy niềm vui và sự tự tin không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Dậy thì là dấu mốc đánh dấu bạn đang bước vào một chương mới thú vị của cuộc đời.", "Phiên bản mới này đi kèm với nhiều quyền tự chủ hơn, nhiều khả năng mới và chiều sâu cảm xúc hơn.", "Hãy chào đón những thay đổi này với sự tò mò lành mạnh thay vì sợ hãi."]}', 2),
(@ml_id, 'scenario', '{"title": "Độc lập hơn", "body": "Khánh dạo này tự dọn phòng, biết tự chọn trang phục phù hợp đi chơi và bắt đầu biết quan tâm chăm sóc sức khỏe cá nhân kỹ hơn."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các suy nghĩ về hành trình dậy thì của bạn:", "leftBox": {"title": "Chào đón phiên bản mới"}, "rightBox": {"title": "Khước từ lớn lên"}, "items": [{"text": "Tò mò tìm hiểu kiến thức y khoa để chăm sóc bản thân tốt hơn", "correctBox": "left"}, {"text": "Luôn ước mình mãi là đứa trẻ tiểu học để không phải thay đổi", "correctBox": "right"}, {"text": "Tự hào vì mình đang cao lớn và trưởng thành hơn mỗi ngày", "correctBox": "left"}, {"text": "Ghét bỏ cơ thể vì nó bắt đầu có mùi hoặc mọc mụn", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn mong chờ điều gì nhất ở phiên bản trưởng thành của mình trong tương lai?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chào mừng bạn đến với hành trình lớn lên. Hãy tự hào về phiên bản nâng cấp của chính mình!"]}', 6);

-- --- Micro Lesson 1.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson1_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Dậy Thì Là Gì? Khi Cơ Thể Rục Rịch Thay Đổi!''! Bạn có 3 mạng để tự tin khám phá những thay đổi cơ thể đầu đời."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Tự tin bước qua những bỡ ngỡ dậy thì",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Linh bắt đầu nhận thấy vùng ngực của mình hơi nhức và nhú nhọn lên dưới lớp áo phông đồng phục. Đi học, Linh cảm giác như một vài bạn nam đang nhìn chằm chằm và thì thầm trêu chọc mình, khiến cô bé vô cùng ngại ngùng, bối rối và chỉ muốn khóc.",
      "choices": [
        { "text": "Nhượng bộ sự xấu hổ, im lặng chịu đựng cơn đau và mặc các áo rộng thùng thình để che giấu cơ thể.", "nextNode": "fail_suppress" },
        { "text": "Nhắn tin nhỏ cho mẹ hoặc nói chuyện riêng: ''Mẹ ơi, ngực con dạo này hơi đau và nhú lên rồi. Mẹ mua giúp con chiếc áo lót đầu tiên nha mẹ!''", "nextNode": "step2" },
        { "text": "Tự ý lấy tiền tiết kiệm mua đại áo ngực chật ních trên mạng không vừa kích cỡ về mặc mà không hỏi ý kiến ai.", "nextNode": "fail_uninformed" }
      ]
    },
    "step2": {
      "text": "Mẹ Linh mỉm cười xoa đầu dắt Linh đi mua chiếc áo lót phù hợp. Tuần sau đó, trong giờ ra chơi ở lớp, một nhóm bạn nam trêu chọc giọng nói ồm ồm đang vỡ của Tuấn, khiến cậu đỏ bừng mặt và cúi gục xuống bàn.",
      "choices": [
        { "text": "Hùa theo nhóm bạn nam trêu Tuấn để chứng tỏ mình hòa đồng và sành sỏi.", "nextNode": "fail_peer" },
        { "text": "Thể hiện vai trò đồng minh đáng tin cậy, nói với nhóm bạn nam: ''Giọng Tuấn đang vỡ vì dậy thì thôi mà, tụi mình ai rồi cũng thế, trêu thế không vui đâu!''.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Linh nhận thấy cơ thể mình cao lớn và đầy đặn hơn trước khá nhiều, nhưng so với cô bạn thân dậy thì sớm, Linh thấy mình vẫn thấp bé và chậm chạp hơn hẳn. Sự sốt ruột và lo âu trỗi dậy trong lòng.",
      "choices": [
        { "text": "Tự nhủ: ''Đồng hồ sinh học của mỗi người là độc bản. Mình cứ kiên nhẫn ăn uống đủ chất, tập luyện và yêu thương cơ thể theo nhịp độ riêng của mình''.", "nextNode": "success_end" },
        { "text": "Lo lắng thái quá, đòi mẹ mua thuốc kích thích tăng trưởng chiều cao cấp tốc trên mạng về uống.", "nextNode": "fail_growth" }
      ]
    },
    "success_end": {
      "text": "🎉 Tuyệt vời! Bạn đã vượt qua những bỡ ngỡ đầu dậy thì, biết cách tìm kiếm đồng minh và thấu hiểu lịch trình phát triển độc bản của cơ thể mình.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_suppress": {
      "text": "❌ Chưa đúng! Việc chịu đựng và cố gắng trốn tránh bằng quần áo rộng không giải quyết được cảm giác khó chịu và sự phát triển sinh học tự nhiên.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_uninformed": {
      "text": "❌ Chưa đúng! Sử dụng áo lót không đúng kích cỡ ở tuổi phát triển dễ gây cản trở lưu thông máu và ảnh hưởng không tốt đến sự phát triển của bầu ngực.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_peer": {
      "text": "❌ Sai rồi! Hùa theo trêu chọc bạn bè chỉ làm gia tăng vấn đề bắt nạt học đường và gây tổn thương tinh thần cho bạn học.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_growth": {
      "text": "❌ Sai rồi! Tự ý dùng các sản phẩm tăng chiều cao cấp tốc không rõ nguồn gốc rất nguy hiểm cho hormone tự nhiên và sức khỏe lâu dài.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các thái độ đối với cơ thể dậy thì:",
  "leftBox": { "title": "Đón nhận tích cực" },
  "rightBox": { "title": "Lo âu quá mức / Né tránh" },
  "items": [
    { "text": "Tự nhủ: Việc thay đổi giọng nói, vóc dáng là sinh lý hoàn toàn tự nhiên", "correctBox": "left" },
    { "text": "Trốn tránh không dám đi chơi với bạn bè vì thấy mình cao vọt lên nhanh quá", "correctBox": "right" },
    { "text": "Lựa chọn trang phục thoải mái, vừa vặn để thích nghi với vóc dáng mới", "correctBox": "left" },
    { "text": "Liên tục soi gương dằn vặt và tự trách bản thân vì cơ thể không giống ngày xưa", "correctBox": "right" },
    { "text": "Mở lòng trò chuyện với bố mẹ để xin hỗ trợ mua đồ dùng cá nhân phù hợp", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp các khái niệm dậy thì cơ bản và định nghĩa tương ứng:",
  "pairs": [
    { "left": "Dậy thì - Puberty", "right": "Giai đoạn chuyển tiếp tự nhiên từ một đứa trẻ thành người trưởng thành về sinh học." },
    { "left": "Hormone dậy thì", "right": "Những kẻ kích hoạt âm thầm phát tín hiệu khởi động thay đổi thể chất." },
    { "left": "Lịch trình riêng", "right": "Sự thật là mỗi người dậy thì ở thời điểm khác nhau từ 8 đến 14 tuổi." },
    { "left": "Đồng minh đáng tin", "right": "Người lớn như bố mẹ, thầy cô giúp bạn giải đáp khúc mắc thầm kín." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về khái niệm dậy thì:",
  "sentence": "Dậy thì là giai đoạn chuyển tiếp tự nhiên do các [blank1] kích hoạt. Mỗi người có một chiếc đồng hồ [blank2] riêng, vì thế đừng sốt ruột. Khi gặp khó khăn, hãy tìm kiếm sự giúp đỡ từ những người lớn [blank3] để nhận [blank4] kịp thời.",
  "blanks": {
    "blank1": { "correct": "hormone", "placeholder": "..." },
    "blank2": { "correct": "sinh học", "placeholder": "..." },
    "blank3": { "correct": "tin cậy", "placeholder": "..." },
    "blank4": { "correct": "nâng đỡ", "placeholder": "..." }
  },
  "words": ["hormone", "sinh học", "tin cậy", "nâng đỡ", "bệnh lý", "sành sỏi", "thuốc tăng", "trốn tránh"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Tại sao việc so sánh vóc dáng và tốc độ lớn của mình với các bạn cùng lớp lại không cần thiết?",
  "enableLives": true,
  "choices": [
    { "text": "Vì mỗi cơ thể đều được lập trình một đồng hồ sinh học dậy thì độc lập, ai rồi cũng sẽ lớn lên theo lịch trình riêng phù hợp nhất.", "correct": true, "emoji": "💚" },
    { "text": "Vì các bạn trong lớp chắc chắn dậy thì nhanh hơn do uống nhiều sữa hơn bạn.", "correct": false, "emoji": "😐" },
    { "text": "Vì dậy thì trễ là biểu hiện của cơ thể khỏe mạnh hơn nhiều so với dậy thì sớm.", "correct": false, "emoji": "🙁" },
    { "text": "Vì lớn chậm giúp bạn giữ được sự dễ thương lâu dài hơn.", "correct": false, "emoji": "🛑" }
  ]
}', 6);



-- =========================================================================
-- BÀI HỌC 2: "F5" Diện Mạo: Những Thay Đổi Rõ Mồn Một! (Physical Changes)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'f5-dien-mao-thay-doi-the-chat',
    '"F5" Diện Mạo: Những Thay Đổi Rõ Mồn Một!',
    'Tìm hiểu sự phát triển thể chất về da, tóc, lông cơ thể, mùi cơ thể và thói quen tắm rửa vệ sinh cá nhân đúng cách.',
    'Bài học cung cấp kiến thức thực tế về các thay đổi bên ngoài như mụn, mùi cơ thể và lông, từ đó hướng dẫn chăm sóc cơ thể sạch sẽ.',
    29,
    false,
    100,
    12
);
SET @lesson2_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson2_id, 'Scarleteen - Puberty Basics', 'https://www.scarleteen.com/read/bodies/not-everything-you-wanted-know-about-puberty-pretty-darn-close', 'website');

-- --- Micro Lesson 2.1: Mùi hương "mới tinh" của cơ thể ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Mùi hương "mới tinh" của cơ thể', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao dạo này sau mỗi tiết thể dục, bạn lại ngửi thấy mùi cơ thể mình đậm hơn trước rất nhiều?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Dưới tác động của hormone, các tuyến mồ hôi đặc biệt ở nách và vùng kín bắt đầu hoạt động mạnh mẽ.", "Bản thân mồ hôi không có mùi, nhưng vi khuẩn trên da phân hủy mồ hôi sẽ tạo nên mùi cơ thể đặc trưng.", "Đây là hiện tượng sinh lý hoàn toàn bình thường, chỉ cần bạn học cách vệ sinh sạch sẽ mỗi ngày."]}', 2),
(@ml_id, 'scenario', '{"title": "Ướt đẫm nách áo", "body": "Huy nhận thấy nách áo của mình dạo này hay bị ướt và có mùi hôi sau khi đá bóng, khiến Huy rất tự ti không dám ngồi gần các bạn trong lớp."}', 3),
(@ml_id, 'flashcard', '{"front": "Làm sao để kiểm soát mùi cơ thể tuổi dậy thì hiệu quả?", "back": "Tắm rửa xà phòng hàng ngày, thay quần áo sạch (đặc biệt là đồ lót bằng vải cotton), và có thể sử dụng thêm lăn/xịt khử mùi sau khi lau khô da.", "notes": "Đừng dùng nước hoa xịt đè lên mùi mồ hôi, nó sẽ tạo ra một hỗn hợp mùi cực kỳ đáng sợ đấy!"}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã trang bị cho mình một chai lăn khử mùi hoặc nước hoa nhẹ nhàng cho những ngày nắng nóng chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mùi cơ thể chỉ là tín hiệu nhắc nhở bạn: Đã đến lúc nâng cấp thói quen vệ sinh cá nhân rồi!"]}', 6);

-- --- Micro Lesson 2.2: Những vị khách không mời: Mụn! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Những vị khách không mời: Mụn!', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao những nốt mụn đáng ghét lại chọn đúng thời điểm này để thi nhau biểu tình trên khuôn mặt bạn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hormone dậy thì kích thích tuyến bã nhờn sản xuất quá nhiều dầu thừa trên da mặt.", "Dầu thừa kết hợp với tế bào chết gây tắc nghẽn lỗ chân lông, tạo môi trường cho vi khuẩn gây mụn phát triển.", "Mụn là một phần trải nghiệm của hầu hết mọi thanh thiếu niên, không phải do bạn ở bẩn đâu nhé."]}', 2),
(@ml_id, 'scenario', '{"title": "Nốt mụn chụp ảnh kỷ yếu", "body": "Vy thức dậy và phát hiện một chiếc mụn bọc to tướng, đỏ chót ngay trên chóp mũi trước ngày chụp ảnh kỷ yếu của lớp. Vy muốn nặn nó ra ngay."}', 3),
(@ml_id, 'interaction', '{"question": "Vy có nên tự ý dùng tay nặn chiếc mụn bọc đó ngay lập tức không?", "choices": [{"text": "Không nên. Tự nặn mụn bằng tay bẩn dễ gây nhiễm trùng sâu hơn, làm mụn sưng to và để lại sẹo thâm khó lành.", "correct": true, "emoji": "💚"}, {"text": "Nên nặn ngay để xẹp mụn nhanh chóng, dùng lực thật mạnh là được.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã xây dựng cho mình một chu trình rửa mặt đơn giản với sữa rửa mặt dịu nhẹ mỗi sáng và tối chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Mụn chỉ là tạm thời, vết thâm do nặn mụn bừa bãi mới là vĩnh viễn. Hãy kiên nhẫn chăm sóc làn da."]}', 6);

-- --- Micro Lesson 2.3: Chuyện của những sợi lông ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Chuyện của những sợi lông', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn cảm thấy thế nào khi bỗng dưng nhìn thấy lông nách, lông mu hoặc ria mép xuất hiện rậm rạp trên cơ thể mình?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Lông cơ thể phát triển ở vùng nách, vùng kín, chân, tay và mặt là dấu hiệu trưởng thành sinh dục bình thường.", "Lông có vai trò bảo vệ các vùng da nhạy cảm khỏi ma sát và vi khuẩn.", "Việc giữ lại hay cạo/tẩy lông hoàn toàn là sở thích cá nhân, không có đúng hay sai về mặt đạo đức."]}', 2),
(@ml_id, 'scenario', '{"title": "Ria mép mọc rậm", "body": "Thành bắt đầu mọc ria mép sẫm màu. Bạn bè trêu Thành trông giống ông cụ, khiến Thành cảm thấy rất tự ti."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các quan điểm về lông cơ thể tuổi dậy thì:", "leftBox": {"title": "Tôn trọng sở thích"}, "rightBox": {"title": "Áp đặt định kiến"}, "items": [{"text": "Cơ thể mình, mình có quyền quyết định cạo hay giữ lông nách", "correctBox": "left"}, {"text": "Con gái là tuyệt đối không được có lông chân, trông rất thô và xấu", "correctBox": "right"}, {"text": "Dùng các biện pháp tẩy lông an toàn, vệ sinh sạch sẽ nếu muốn cạo", "correctBox": "left"}, {"text": "Chế giễu bạn nam cùng lớp vì chưa mọc ria mép giống mọi người", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy áp lực từ bạn bè hay mạng xã hội bắt buộc bạn phải cạo sạch lông cơ thể không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Lông cơ thể là tấm khiên tự nhiên. Hãy quyết định số phận của chúng dựa trên sự thoải mái của chính bạn."]}', 6);

-- --- Micro Lesson 2.4: Tình huống: Chiếc mụn "đáng ghét" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Tình huống: Chiếc mụn "đáng ghét"', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để tự tin đến trường học tập và vui chơi khi khuôn mặt đang trong giai đoạn bùng phát mụn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mụn dễ làm tụi mình cảm thấy tự ti, nghĩ rằng ai cũng đang nhìn chăm chăm vào khuyết điểm của mình.", "Thực tế, bạn bè xung quanh cũng đang bận rộn lo lắng về khuyết điểm của chính họ.", "Vẻ đẹp của bạn nằm ở thần thái, nụ cười và sự tự tin, không nằm ở một làn da không tì vết."]}', 2),
(@ml_id, 'scenario', '{"title": "Tự ti che mặt", "body": "Lan có nhiều mụn thâm trên má. Khi đi học, Lan luôn cúi gầm mặt, lấy tóc xõa che kín hai bên má và từ chối phát biểu trước lớp."}', 3),
(@ml_id, 'flashcard', '{"front": "Lan nên làm gì để lấy lại sự tự tin trước đám đông dù da đang có mụn?", "back": "Tập trung vào thế mạnh học tập, mỉm cười thân thiện, ngẩng cao đầu và tự nhắc nhở: Mọi người yêu quý mình vì tính cách và tài năng, chứ không phải vì vài nốt mụn.", "notes": "Tình bạn đích thực không đo bằng mức độ mịn màng của làn da."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng đánh giá hay bớt yêu quý một người bạn chỉ vì da mặt của bạn ấy có nhiều mụn không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tự tin là lớp trang điểm đẹp nhất. Đừng để những nốt mụn nhỏ che lấp đi ánh sáng rực rỡ của bạn."]}', 6);

-- --- Micro Lesson 2.5: Cẩm nang tắm rửa "Green Flag" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Cẩm nang tắm rửa "Green Flag"', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn đã biết cách làm sạch cơ thể đúng điệu để luôn thơm tho và khỏe mạnh suốt cả ngày chưa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tắm rửa hàng ngày bằng sữa tắm dịu nhẹ, chú ý làm sạch các vùng da gấp nếp như nách, bẹn và vùng kín.", "Vùng kín cần được rửa nhẹ nhàng bằng nước sạch hoặc dung dịch vệ sinh phù hợp, tuyệt đối không thụt rửa sâu bên trong.", "Lau khô người bằng khăn sạch trước khi mặc quần áo để tránh nấm ngứa phát triển."]}', 2),
(@ml_id, 'scenario', '{"title": "Tắm lướt vội vàng", "body": "Bách thường tắm rất nhanh, chỉ dội nước qua loa và không dùng xà phòng, dẫn đến vùng lưng bắt đầu nổi nhiều mụn ngứa."}', 3),
(@ml_id, 'interaction', '{"question": "Bách nên thay đổi thói quen tắm rửa thế nào cho đúng cách khoa học?", "choices": [{"text": "Tắm kỹ hơn, dùng sữa tắm dịu nhẹ chà sạch vùng lưng và lau khô cơ thể bằng khăn sạch sau khi tắm.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục tắm nhanh nhưng xịt thật nhiều nước hoa lên người sau khi tắm để lấn át mùi.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thói quen thay đồ lót sạch mỗi ngày sau khi tắm không? Đây là bước cực kỳ quan trọng để bảo vệ vùng kín đấy."}', 5),
(@ml_id, 'takeaway', '{"items": ["Chăm sóc cơ thể sạch sẽ là cách bạn thể hiện lòng trân trọng đối với ngôi nhà sinh học của mình."]}', 6);

-- --- Micro Lesson 2.6: Yêu lấy từng centimet cơ thể ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Yêu lấy từng centimet cơ thể', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để hòa giải với những thay đổi thể chất đôi khi trông hơi kỳ cục của tuổi mới lớn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Dậy thì có thể khiến tay chân bạn dài ra nhanh chóng trước khi thân người phát triển kịp, tạo cảm giác hơi lóng ngóng.", "Ngực của bạn gái có thể bên to bên nhỏ không đều, bạn trai có thể thấy hơi sưng đau ở núm vú.", "Trân trọng sự độc đáo của cơ thể mình thay vì ép nó phải giống một khuôn mẫu hoàn hảo nào đó."]}', 2),
(@ml_id, 'scenario', '{"title": "Cơ thể lóng ngóng", "body": "Hoàng dạo này lớn nhanh quá nên đi lại hay bị vấp ngã, ngực thì hơi sưng đau nhè nhẹ khiến cậu sợ hãi nghĩ mình bị ung thư."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các cách phản ứng với cơ thể đang thay đổi:", "leftBox": {"title": "Yêu thương chấp nhận"}, "rightBox": {"title": "Phủ nhận ghét bỏ"}, "items": [{"text": "Tự nhắc nhở: Sự bất cân đối cơ thể lúc dậy thì là tạm thời và bình thường", "correctBox": "left"}, {"text": "Dùng các đai nịt ngực quá chặt vì xấu hổ khi thấy ngực phát triển", "correctBox": "right"}, {"text": "Tập các bài tập giãn cơ nhẹ nhàng để thích nghi với chiều cao mới", "correctBox": "left"}, {"text": "Nhịn ăn giảm cân cực đoan vì thấy vóc dáng tròn trịa hơn trước", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Có bộ phận nào trên cơ thể đang thay đổi khiến bạn thấy lo lắng không? Bạn có muốn tìm hiểu thêm về nó một cách khoa học?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể bạn là duy nhất và đang nỗ lực hết mình để lớn lên. Hãy kiên nhẫn đồng hành cùng nó nhé."]}', 6);

-- --- Micro Lesson 2.8: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson2_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''F5 Diện Mạo: Những Thay Đổi Rõ Mồn Một''! Bạn có 3 mạng để tự tin thiết lập thói quen vệ sinh và ứng phó với thay đổi diện mạo."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Tự tin làm chủ diện mạo mới",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Huy nhận thấy nách áo dạo này hay bị ướt sũng mồ hôi và tỏa mùi khá nồng sau mỗi tiết thể dục ngoài trời, khiến Huy vô cùng tự ti, không dám ngồi gần hay giơ tay phát biểu bài trước lớp.",
      "choices": [
        { "text": "Xịt thật nhiều nước hoa đậm đặc đè trực tiếp lên lớp mồ hôi cũ rồi đi học tiếp.", "nextNode": "fail_perfume" },
        { "text": "Tắm rửa xà phòng sạch sẽ hàng ngày, chú ý làm khô nách và sử dụng lăn hoặc xịt khử mùi dịu nhẹ.", "nextNode": "step2" },
        { "text": "Nhất quyết nhịn và trốn tránh không tham gia các hoạt động thể thao đá bóng yêu thích nữa.", "nextNode": "fail_avoid" }
      ]
    },
    "step2": {
      "text": "Huy cảm thấy thơm tho, tự tin trở lại. Một buổi sáng thức dậy, Huy phát hiện trên trán xuất hiện vài nốt mụn bọc sưng đỏ. Cậu thấy rất khó chịu và muốn dùng tay nặn phăng chúng đi trước khi đi học.",
      "choices": [
        { "text": "Dùng tay bẩn nặn thật mạnh để nhân mụn trào ra nhanh chóng.", "nextNode": "fail_pop" },
        { "text": "Không nặn mụn bọc, giữ da sạch bằng sữa rửa mặt dịu nhẹ sáng tối và bôi kem mụn y khoa phù hợp.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Cơ thể Huy tiếp tục phát triển rậm lông ở nách và vùng kín, ria mép cũng mọc đen hơn. Huy nghe các bạn nam rỉ tai nhau rằng cạo lông nách sẽ làm cơ thể mất đi vẻ nam tính, khiến cậu lo lắng phân vân.",
      "choices": [
        { "text": "Tự tin quyết định giữ lại hoặc dọn dẹp vệ sinh lông cơ thể an toàn dựa hoàn toàn trên sự thoải mái và sạch sử của chính mình.", "nextNode": "success_end" },
        { "text": "Bị ảnh hưởng bởi định kiến, chịu đựng sự ngứa ngáy nóng bức và không dám cắt tỉa vệ sinh.", "nextNode": "fail_prejudice" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn hảo! Bạn đã kiểm soát tốt mùi cơ thể, biết cách chăm sóc làn da mụn thông thái và làm chủ các thói quen vệ sinh cá nhân văn minh.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_perfume": {
      "text": "❌ Chưa đúng! Xịt nước hoa chồng lên mồ hôi chỉ tạo ra hỗn hợp mùi hỗn loạn, gây khó chịu hơn cho những người xung quanh.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_avoid": {
      "text": "❌ Chưa đúng! Trốn tránh thể thao không giải quyết được vấn đề vệ sinh sinh học, ngược lại còn làm bạn mất đi cơ hội rèn luyện sức khỏe.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_pop": {
      "text": "❌ Sai rồi! Tự ý dùng tay nặn mụn bọc sưng đỏ dễ gây nhiễm trùng máu, để lại sẹo lõm và vết thâm vĩnh viễn trên da mặt.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_prejudice": {
      "text": "❌ Sai rồi! Quyết định dọn dẹp hay giữ lông cơ thể hoàn toàn là lựa chọn cá nhân hướng tới sự sạch sẽ, không phản ánh giới tính hay nhân cách của bạn.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các quan niệm về chăm sóc diện mạo dậy thì:",
  "leftBox": { "title": "Chăm sóc lành mạnh" },
  "rightBox": { "title": "Ngược đãi da / Gây hại" },
  "items": [
    { "text": "Rửa mặt nhẹ nhàng bằng sữa rửa mặt dịu nhẹ 2 lần mỗi ngày", "correctBox": "left" },
    { "text": "Dùng cồn hoặc xà phòng chà sát thật mạnh lên vết mụn để diệt khuẩn", "correctBox": "right" },
    { "text": "Mặc đồ lót bằng vải cotton thoáng khí và thay giặt sạch sẽ hàng ngày", "correctBox": "left" },
    { "text": "Tự ý nặn mụn bọc sưng đỏ khi nhân mụn chưa chín bằng tay chưa rửa", "correctBox": "right" },
    { "text": "Sử dụng lăn/xịt khử mùi sau khi đã tắm sạch và lau khô cơ thể", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa thay đổi thể chất dậy thì và định nghĩa tương ứng:",
  "pairs": [
    { "left": "Tuyến bã nhờn", "right": "Tuyến hoạt động mạnh giải phóng dầu thừa gây tắc nghẽn lỗ chân lông tuổi dậy thì." },
    { "left": "Tuyến mồ hôi đặc biệt", "right": "Tuyến tiết dịch ở nách và vùng kín, dễ gây mùi đặc trưng khi bị vi khuẩn phân hủy." },
    { "left": "Lông cơ thể", "right": "Tấm khiên tự nhiên giúp bảo vệ các vùng da nhạy cảm khỏi ma sát." },
    { "left": "Mụn bọc", "right": "Nốt mụn sưng đỏ, cần được chăm sóc y khoa thay vì tự ý nặn tay." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về vệ sinh diện mạo dậy thì:",
  "sentence": "Hormone tăng trưởng kích thích tuyến [blank1] hoạt động mạnh gây ra mụn. Hãy vệ sinh da mặt bằng sữa rửa mặt [blank2] và tuyệt đối không tự ý [blank3] mụn. Bên cạnh đó, hãy tắm rửa hàng ngày để kiểm soát [blank4] cơ thể phát sinh.",
  "blanks": {
    "blank1": { "correct": "bã nhờn", "placeholder": "..." },
    "blank2": { "correct": "dịu nhẹ", "placeholder": "..." },
    "blank3": { "correct": "nặn", "placeholder": "..." },
    "blank4": { "correct": "mùi", "placeholder": "..." }
  },
  "words": ["bã nhờn", "dịu nhẹ", "nặn", "mùi", "đồ lót", "nước hoa", "cạo sạch", "lo âu"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Tại sao mồ hôi lúc đá bóng của bạn dạo này lại có mùi đậm hơn lúc nhỏ rất nhiều?",
  "enableLives": true,
  "choices": [
    { "text": "Vì mồ hôi của bạn dạo này chứa nhiều vi khuẩn tự nhiên có hại hơn trước.", "correct": false, "emoji": "😐" },
    { "text": "Vì hormone dậy thì kích hoạt tuyến mồ hôi đặc biệt ở nách và vùng kín hoạt động, chất dịch này khi bị vi khuẩn trên da phân hủy sẽ tạo ra mùi cơ thể đặc trưng.", "correct": true, "emoji": "💚" },
    { "text": "Vì bạn không chịu tắm rửa bằng các loại xà phòng sát khuẩn liều cao.", "correct": false, "emoji": "🙁" },
    { "text": "Vì quần áo thể thao của bạn hấp thụ quá nhiều ánh sáng mặt trời.", "correct": false, "emoji": "🛑" }
  ]
}', 6);



-- =========================================================================
-- BÀI HỌC 3: "Đến Tháng" & Chuyện Phía Trong: Hiểu Để Đỡ Lo! (Reproductive)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'den-thang-va-co-quan-sinh-san',
    '"Đến Tháng" & Chuyện Phía Trong: Hiểu Để Đỡ Lo!',
    'Giải mã hoạt động của hệ sinh sản, chu kỳ kinh nguyệt, mộng tinh và cách chuẩn bị tâm lý cùng dụng cụ vệ sinh.',
    'Bài học làm rõ nguyên lý sinh học bên trong, hướng dẫn chuẩn bị dụng cụ kinh nguyệt và giúp bạn bình tĩnh xử lý các sự cố tế nhị.',
    30,
    false,
    100,
    12
);
SET @lesson3_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson3_id, 'Scarleteen - Quickies: Sexual Anatomy', 'https://www.scarleteen.com/read/bodies/quickies-sexual-anatomy', 'website'),
(@lesson3_id, 'Scarleteen - Quickies: Periods & Menstrual Cycle', 'https://www.scarleteen.com/read/bodies/quickies-periods-menstrual-cycle', 'website');

-- --- Micro Lesson 3.1: Hệ sinh sản thức giấc! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Hệ sinh sản thức giấc!', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có biết bên trong cơ thể tụi mình đang diễn ra một cuộc tổng diễn tập âm thầm để chuẩn bị cho khả năng sinh sản không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Ở bạn gái, buồng trứng bắt đầu rụng trứng và tử cung chuẩn bị lớp niêm mạc giàu dinh dưỡng mỗi tháng.", "Ở bạn trai, tinh hoàn bắt đầu sản xuất hàng triệu tinh trùng và hormone testosterone mỗi ngày.", "Đây là hoạt động sinh học bình thường chuẩn bị cho vai trò làm cha mẹ trong tương lai xa."]}', 2),
(@ml_id, 'scenario', '{"title": "Đau bụng nhẹ", "body": "Thảo dạo này thỉnh thoảng thấy đau nhẹ ở vùng bụng dưới vào giữa tháng, cô bé lo sợ mình bị đau ruột thừa."}', 3),
(@ml_id, 'flashcard', '{"front": "Cơ quan sinh sản bên trong hoạt động có gây ra cảm giác đau đớn gì bình thường không?", "back": "Bạn gái có thể thấy hơi đau bụng dưới nhẹ khi rụng trứng hoặc hành kinh; bạn trai có thể thấy hơi căng tức tinh hoàn nhẹ. Nếu đau dữ dội, hãy báo ngay cho người lớn.", "notes": "Lắng nghe tín hiệu cơ thể để biết khi nào cần nghỉ ngơi."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng học về cơ quan sinh sản trong môn Sinh học ở trường chưa? Bạn có câu hỏi nào chưa được giải đáp không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hệ sinh sản thức giấc là minh chứng rõ ràng nhất cho thấy bạn đang tiến gần hơn tới thế giới của người lớn."]}', 6);

-- --- Micro Lesson 3.2: Kỳ kinh đầu tiên & Mộng tinh ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Kỳ kinh đầu tiên & Mộng tinh', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để không hoảng loạn khi đột ngột thấy vệt máu trên quần chip hoặc thức dậy với chiếc quần ướt át?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Kinh nguyệt (Period) là hiện tượng lớp niêm mạc tử cung bong ra và thoát ra ngoài khi không có sự thụ tinh. Nó đánh dấu bạn gái có khả năng mang thai.", "Mộng tinh (Wet Dream) là hiện tượng xuất tinh tự nhiên không chủ ý khi đang ngủ ở bạn trai, giúp giải phóng lượng tinh dịch thừa.", "Cả hai hiện tượng này đều là cột mốc sinh lý tự nhiên bình thường đáng mừng!"]}', 2),
(@ml_id, 'scenario', '{"title": "Quần lót dính dịch", "body": "Duy thức dậy vào buổi sáng và phát hiện quần lót của mình bị ướt một khoảng lớn dính dính. Duy nghĩ mình bị bệnh nặng và vội vàng giấu chiếc quần lót đi vì xấu hổ."}', 3),
(@ml_id, 'interaction', '{"question": "Duy nên hiểu hiện tượng này thế nào cho đúng khoa học?", "choices": [{"text": "Đây là hiện tượng mộng tinh hoàn toàn bình thường ở bạn trai dậy thì. Duy chỉ cần đem quần đi giặt sạch và không cần phải xấu hổ hay lo sợ.", "correct": true, "emoji": "💚"}, {"text": "Chắc chắn Duy đã bị viêm đường tiết niệu nặng, cần phải đi mua thuốc kháng sinh tự uống ngay.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn gái đã chuẩn bị sẵn sàng tâm lý đón nhận kỳ kinh đầu tiên, và bạn trai đã hiểu về mộng tinh chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Kinh nguyệt hay mộng tinh là những vị khách tự nhiên của tuổi dậy thì. Hãy đón tiếp chúng một cách bình tĩnh."]}', 6);

-- --- Micro Lesson 3.3: Vượt qua sự bối rối khó nói ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Vượt qua sự bối rối khó nói', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao nhiều người vẫn coi kinh nguyệt hay mộng tinh là điều gì đó dơ bẩn và ngại nhắc đến công khai?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Do những định kiến cũ kỹ và thiếu kiến thức khoa học nên xã hội từng coi đây là chủ đề cấm kỵ.", "Thực chất, máu kinh nguyệt hay tinh dịch là những chất dịch sinh học hoàn toàn sạch sẽ, không có gì tội lỗi.", "Nói chuyện cởi mở và khoa học giúp xóa bỏ sự kỳ thị và giúp đỡ nhau tốt hơn khi gặp sự cố."]}', 2),
(@ml_id, 'scenario', '{"title": "Băng vệ sinh rơi ra", "body": "Một miếng băng vệ sinh chưa dùng rơi ra từ cặp sách của Hân trong lớp, các bạn nam bắt đầu chỉ trỏ trêu chọc khiến Hân xấu hổ khóc nức nở."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các cách ứng xử đối với chủ đề kinh nguyệt/mộng tinh:", "leftBox": {"title": "Cởi mở văn minh"}, "rightBox": {"title": "Kỳ thị né tránh"}, "items": [{"text": "Vui vẻ cho bạn mượn băng vệ sinh khi bạn gặp sự cố khẩn cấp ở lớp", "correctBox": "left"}, {"text": "Cười cợt, trêu chọc khi thấy bạn gái vô tình bị dây máu kinh ra váy", "correctBox": "right"}, {"text": "Chủ động tìm hiểu kiến thức để chăm sóc bản thân và thấu cảm với bạn khác giới", "correctBox": "left"}, {"text": "Lấy từ mộng tinh ra để làm từ ngữ chửi bới, hạ nhục bạn bè", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thấy ngại ngùng khi đi mua băng vệ sinh ở tiệm tạp hóa không? Tại sao tụi mình lại có cảm giác đó nhỉ?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Kinh nguyệt và sinh sản là cội nguồn của sự sống. Hãy tôn trọng và tự hào về cơ thể mình."]}', 6);

-- --- Micro Lesson 3.4: Tình huống: Sự cố hành kinh ở trường ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Tình huống: Sự cố hành kinh ở trường', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để xử lý thật êm đẹp và bình tĩnh khi đột ngột bị đến tháng ngay trong giờ học mà không mang theo dụng cụ dự phòng?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Đừng hoảng loạn, đây là sự cố mà hầu như bạn gái nào cũng từng trải qua ít nhất một lần.", "Bạn có thể tạm thời lót giấy vệ sinh sạch vào quần chip và đi tìm sự trợ giúp ngay lập tức.", "Tình bạn và sự hỗ trợ từ các bạn gái khác hoặc cô giáo y tế là chiếc phao cứu sinh tuyệt vời."]}', 2),
(@ml_id, 'scenario', '{"title": "Vệt đỏ sau váy", "body": "Trong tiết Toán, Trang bỗng cảm thấy bụng dưới quặn đau và có dịch ẩm tràn ra. Khi đứng dậy phát hiện váy đồng phục phía sau đã bị thấm một vệt đỏ nhỏ. Trang vô cùng xấu hổ."}', 3),
(@ml_id, 'flashcard', '{"front": "Bạn bè xung quanh nên giúp đỡ Trang thế nào trong tình huống này?", "back": "Bạn ngồi cạnh có thể cho Trang mượn áo khoác buộc ngang hông để che vệt đỏ, đưa cho Trang một miếng băng vệ sinh dự phòng và đi cùng Trang xuống phòng y tế trường.", "notes": "Sự tinh tế và giúp đỡ kịp thời của bạn là món quà vô giá giúp bạn mình đỡ tủi thân."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn luôn mang theo một miếng băng vệ sinh nhỏ trong ba lô đi học để dự phòng cho mình và bạn bè chứ?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Giúp đỡ bạn bè khi gặp sự cố hành kinh là biểu hiện cao nhất của sự tinh tế và tử tế tuổi học trò."]}', 6);

-- --- Micro Lesson 3.5: Cẩm nang sử dụng dụng cụ vệ sinh ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Cẩm nang sử dụng dụng cụ vệ sinh', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn đã biết cách lựa chọn và sử dụng băng vệ sinh đúng chuẩn để luôn khô thoáng, tự tin trong những ngày đèn đỏ chưa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bóc lớp giấy dán phía sau băng vệ sinh và dán chặt vào đáy quần chip, ôm khít cơ thể.", "Thay băng vệ sinh sau mỗi 3 đến 4 tiếng để ngăn ngừa vi khuẩn sinh sôi gây mùi và viêm nhiễm.", "Cuộn tròn băng vệ sinh đã dùng vào giấy gói sạch và bỏ vào thùng rác, tuyệt đối không vứt vào bồn cầu."]}', 2),
(@ml_id, 'scenario', '{"title": "Ngại thay băng vệ sinh", "body": "Mai nghĩ rằng máu kinh ra ít nên để nguyên một miếng băng vệ sinh suốt từ sáng đi học đến tối mịt mới thay, dẫn đến vùng kín bị ngứa ngáy."}', 3),
(@ml_id, 'interaction', '{"question": "Mai đã mắc sai lầm gì trong việc sử dụng băng vệ sinh?", "choices": [{"text": "Mai để băng vệ sinh quá lâu không thay (quá 4 tiếng), tạo điều kiện cho vi khuẩn phát triển gây viêm nhiễm da.", "correct": true, "emoji": "💚"}, {"text": "Mai nên dùng nước xà phòng thụt rửa sâu bên trong âm đạo để làm sạch triệt để.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có tự lập cho mình một chiếc túi nhỏ xinh đựng băng vệ sinh, quần chip dự phòng trong ba lô chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Thay băng đúng giờ giúp bạn luôn khô thoáng, sạch sẽ và tràn đầy năng lượng hoạt động."]}', 6);

-- --- Micro Lesson 3.6: Cơ thể là một khối thống nhất ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Cơ thể là một khối thống nhất', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để sống hòa bình và yêu thương hệ sinh sản của mình thay vì coi nó là nguồn cơn của những rắc rối?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Những cơn đau bụng kinh, sự ẩm ướt của mộng tinh hay mụn nội tiết đôi khi khiến bạn thấy ghét bỏ cơ thể.", "Nhưng hãy nhớ, hệ sinh sản đang làm việc ngày đêm để giúp bạn phát triển toàn diện cả về thể chất lẫn nội tiết tố.", "Học cách lắng nghe, chăm sóc và thấu cảm với những chu kỳ sinh học của bản thân."]}', 2),
(@ml_id, 'scenario', '{"title": "Cảm giác ghét bỏ cơ thể", "body": "Mỗi lần đến tháng đau bụng nằm bẹp một chỗ, Hoa lại cáu bẳn tự trách cơ thể mình phiền phức và ước gì mình sinh ra không có tử cung."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các thói quen chăm sóc sức khỏe sinh sản:", "leftBox": {"title": "Chăm sóc thông thái"}, "rightBox": {"title": "Gây hại cơ thể"}, "items": [{"text": "Ghi chép ngày bắt đầu kinh nguyệt vào ứng dụng điện thoại để theo dõi chu kỳ", "correctBox": "left"}, {"text": "Uống thuốc giảm đau bụng kinh vô tội vạ mà không hỏi ý kiến bác sĩ", "correctBox": "right"}, {"text": "Chườm ấm bụng dưới và uống nước ấm để giảm nhẹ cơn đau bụng kinh", "correctBox": "left"}, {"text": "Mặc quần lót ẩm ướt sau khi vận động thể thao vì lười thay", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang sử dụng ứng dụng nào trên điện thoại để theo dõi chu kỳ kinh nguyệt của mình không? Nó rất tiện lợi đấy!"}', 5),
(@ml_id, 'takeaway', '{"items": ["Thấu hiểu chu kỳ cơ thể giúp bạn làm chủ sức khỏe và tự tin bước qua tuổi dậy thì."]}', 6);

-- --- Micro Lesson 3.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson3_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Đến Tháng & Chuyện Phía Trong: Hiểu Để Đỡ Lo!''! Bạn có 3 mạng để tự tin đối phó với các sự cố sinh học tuổi dậy thì."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Tự tin ứng phó sự cố hành kinh và mộng tinh",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Trong tiết Toán, Trang bỗng cảm thấy đau quặn ở bụng dưới và có dịch ẩm tràn ra quần lót. Khi đứng dậy lên bảng, Trang phát hiện váy đồng phục phía sau đã bị thấm một vệt đỏ nhỏ. Các bạn xung quanh bắt đầu nhận ra và thì thầm.",
      "choices": [
        { "text": "Xấu hổ khóc lóc và lập tức bỏ chạy thẳng ra khỏi cổng trường để về nhà.", "nextNode": "fail_escape" },
        { "text": "Bình tĩnh dùng áo khoác buộc ngang hông che vệt đỏ, mượn bạn một miếng băng vệ sinh dự phòng và xin phép xuống phòng y tế trường.", "nextNode": "step2" },
        { "text": "Ngồi im chịu trận tại chỗ suốt các tiết học tiếp theo đến tối mịt mới về nhà thay quần áo.", "nextNode": "fail_stay" }
      ]
    },
    "step2": {
      "text": "Trang được cô giáo y tế hướng dẫn thay băng vệ sinh và cho nghỉ ngơi. Tối hôm đó, cậu bạn Duy thức dậy và phát hiện quần lót của mình bị ướt dính một khoảng lớn. Duy hoang mang nghĩ mình bị bệnh tiết niệu nặng.",
      "choices": [
        { "text": "Giấu kỹ chiếc quần lót bẩn vào góc tủ vì xấu hổ và tự mua thuốc kháng sinh tự uống.", "nextNode": "fail_hide" },
        { "text": "Hiểu rằng đây là hiện tượng mộng tinh sinh lý hoàn toàn bình thường ở bạn trai, đem quần lót đi giặt sạch sẽ.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Duy và Trang đi học trở lại. Trong giờ ra chơi, một nhóm bạn nam nhặt được miếng băng vệ sinh chưa dùng rơi ra từ cặp của bạn khác và cười cợt làm trò đùa giễu cợt trước lớp.",
      "choices": [
        { "text": "Thẳng thắn nhắc nhở: ''Băng vệ sinh là dụng cụ y tế cá nhân sạch sẽ giúp bạn gái bảo vệ sức khỏe, có gì để cười cợt đâu các cậu?''", "nextNode": "success_end" },
        { "text": "Tránh phiền phức, im lặng bỏ qua coi như không thấy gì để không bị ghét.", "nextNode": "fail_bypass" }
      ]
    },
    "success_end": {
      "text": "🎉 Chúc mừng! Bạn đã xử lý sự cố hành kinh thông minh, thấu hiểu hiện tượng mộng tinh và có tư duy văn minh xóa bỏ định kiến về sức khỏe sinh sản.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_escape": {
      "text": "❌ Chưa đúng! Bỏ học chạy trốn không giải quyết được vệt đỏ trên váy mà còn khiến bạn bị mất bài học và vi phạm kỷ luật trường.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_stay": {
      "text": "❌ Chưa đúng! Ngồi im mặc đồ ẩm ướt dính máu kinh suốt nhiều tiếng liên tục rất mất vệ sinh, gây mùi khó chịu và tăng nguy cơ viêm nhiễm nặng.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_hide": {
      "text": "❌ Sai rồi! Giấu quần lót bẩn gây mùi hôi mốc, và việc tự ý uống kháng sinh bừa bãi cực kỳ gây hại cho sức khỏe gan thận của bạn.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_bypass": {
      "text": "❌ Sai rồi! Sự im lặng đồng lõa với trò đùa vô duyên khiến các bạn gái tiếp tục bị tổn thương và duy trì định kiến xấu về chu kỳ sinh học tự nhiên.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các hành vi chăm sóc sức khỏe sinh sản:",
  "leftBox": { "title": "Chăm sóc thông thái" },
  "rightBox": { "title": "Gây hại hoặc kỳ thị" },
  "items": [
    { "text": "Chườm ấm bụng dưới và uống nước ấm khi bị đau bụng kinh nhẹ", "correctBox": "left" },
    { "text": "Thụt rửa sâu vào bên trong âm đạo bằng nước xà phòng sát khuẩn", "correctBox": "right" },
    { "text": "Thay băng vệ sinh đúng giờ sau mỗi 3 đến 4 tiếng hành kinh", "correctBox": "left" },
    { "text": "Để nguyên một miếng băng vệ sinh suốt cả ngày để tiết kiệm", "correctBox": "right" },
    { "text": "Ghi chú ngày bắt đầu kinh nguyệt vào lịch để theo dõi chu kỳ sinh học", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp các khái niệm sức khỏe sinh sản và định nghĩa tương ứng:",
  "pairs": [
    { "left": "Kinh nguyệt - Period", "right": "Hiện tượng lớp niêm mạc tử cung bong ra và thoát ra ngoài khi trứng không thụ tinh." },
    { "left": "Mộng tinh - Wet Dream", "right": "Sự xuất tinh tự nhiên không chủ ý khi đang ngủ ở bạn trai dậy thì." },
    { "left": "Băng vệ sinh", "right": "Dụng cụ thấm hút máu kinh dùng một lần, cần được gói gọn vứt sọt rác." },
    { "left": "Chu kỳ kinh nguyệt", "right": "Thời gian tính từ ngày đầu hành kinh tháng này đến ngày đầu hành kinh tháng sau." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về chu kỳ sinh sản:",
  "sentence": "Kinh nguyệt và mộng tinh là các cột mốc [blank1] tự nhiên chứng tỏ bạn đang lớn. Khi hành kinh, cần thay [blank2] đúng giờ để tránh [blank3]. Hãy cởi mở chia sẻ khoa học và xóa bỏ sự [blank4] vô căn cứ.",
  "blanks": {
    "blank1": { "correct": "sinh lý", "placeholder": "..." },
    "blank2": { "correct": "băng vệ sinh", "placeholder": "..." },
    "blank3": { "correct": "viêm nhiễm", "placeholder": "..." },
    "blank4": { "correct": "kỳ thị", "placeholder": "..." }
  },
  "words": ["sinh lý", "băng vệ sinh", "viêm nhiễm", "kỳ thị", "xấu hổ", "vô sinh", "dơ bẩn", "thụt rửa"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Tại sao bạn gái tuyệt đối không nên tự ý thụt rửa sâu bên trong âm đạo khi tắm rửa vệ sinh ngày đèn đỏ?",
  "enableLives": true,
  "choices": [
    { "text": "Vì thụt rửa sâu làm mất cân bằng độ pH tự nhiên của âm đạo, tiêu diệt vi khuẩn có lợi và đẩy vi khuẩn bên ngoài vào sâu gây viêm nhiễm đường sinh sản.", "correct": true, "emoji": "💚" },
    { "text": "Vì âm đạo có thể tự co bóp đẩy hết nước rửa ra ngoài gây lãng phí xà phòng.", "correct": false, "emoji": "😐" },
    { "text": "Vì việc này làm cản trở quá trình rụng trứng ở buồng trứng của bạn gái.", "correct": false, "emoji": "🙁" },
    { "text": "Vì nước xà phòng sẽ làm phai màu niêm mạc cơ quan sinh dục.", "correct": false, "emoji": "🛑" }
  ]
}', 6);



-- =========================================================================
-- BÀI HỌC 4: Bão Cảm Xúc: Sáng Nắng Chiều Mưa, Có Sao Đâu? (Emotional Changes)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'bao-cam-xuc-tuoi-day-thi',
    'Bão Cảm Xúc: Sáng Nắng Chiều Mưa, Có Sao Đâu?',
    'Hiểu về hormone ảnh hưởng đến tâm trạng, sự nhạy cảm tuổi mới lớn và học kỹ năng cân bằng cảm xúc.',
    'Bài học hướng dẫn bạn gọi tên cảm xúc, giải quyết bất đồng lành mạnh với bố mẹ và thiết lập các bài tập xoa dịu stress.',
    31,
    false,
    100,
    12
);
SET @lesson4_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson4_id, 'Scarleteen - Puberty Basics', 'https://www.scarleteen.com/read/bodies/not-everything-you-wanted-know-about-puberty-pretty-darn-close', 'website');

-- --- Micro Lesson 4.1: Những "kẻ quậy phá" âm thầm: Hormone! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Những "kẻ quậy phá" âm thầm: Hormone!', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Có bao giờ bạn bỗng dưng muốn khóc hoặc nổi giận đùng đùng mà chính bản thân cũng không giải thích nổi lý do không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tuổi dậy thì là thời kỳ nồng độ các hormone estrogen (ở nữ) và testosterone (ở nam) tăng vọt đột ngột.", "Những chất hóa học này tác động trực tiếp lên vùng não điều khiển cảm xúc, khiến tâm trạng của bạn biến đổi liên tục.", "Sự thay đổi tâm trạng này không phải do bạn hư, đó chỉ là phản ứng sinh lý tạm thời."]}', 2),
(@ml_id, 'scenario', '{"title": "Khóc vô cớ", "body": "Hạnh đang xem một chương trình hoạt hình vui nhộn bỗng dưng nước mắt trào ra dữ dội, cảm thấy buồn bã tột cùng mà không hiểu vì sao."}', 3),
(@ml_id, 'flashcard', '{"front": "Có phải cảm xúc thất thường tuổi dậy thì là do bạn cố tình gây sự hoặc không biết kiềm chế?", "back": "KHÔNG. Đó chủ yếu là do sự xáo trộn mạnh mẽ của các hormone trong não bộ gây ra. Cảm xúc này hoàn toàn có thật và bạn cần thời gian để làm quen.", "notes": "Hãy tự nói với mình: Cảm xúc này là tạm thời, mình sẽ bình tĩnh lại sớm thôi."}', 4),
(@ml_id, 'reflection', '{"question": "Lần gần đây nhất bạn nổi cáu vô cớ với ai đó là khi nào? Bạn có nhận ra nguyên nhân lúc đó không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơn bão cảm xúc chỉ là phản ứng của não bộ trước bản cập nhật hormone mới. Đừng quá khắt khe với bản thân."]}', 6);

-- --- Micro Lesson 4.2: Đọc vị cơn giận vô cớ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Đọc vị cơn giận vô cớ', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để nhận diện cơn giận trước khi nó bùng phát thành hành động làm tổn thương người khác?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cơn giận thường gửi tín hiệu trên cơ thể trước: tim đập nhanh, mặt nóng bừng, nghiến răng.", "Nhận biết những tín hiệu báo động này giúp bạn kịp thời phanh lại trước khi nói ra những lời hối hận.", "Chấp nhận cảm xúc giận dữ nhưng học cách bày tỏ nó một cách văn minh, không phá hủy mối quan hệ."]}', 2),
(@ml_id, 'scenario', '{"title": "Vở vẽ bị đổ nước", "body": "Em trai vô tình làm đổ nước vào cuốn vở vẽ của Bình. Bình thấy máu nóng dồn lên mặt, tim đập thình thịch và định lao vào đánh em."}', 3),
(@ml_id, 'interaction', '{"question": "Bình nên làm gì ngay lúc đó để xử lý cơn giận một cách Green Flag?", "choices": [{"text": "Hít thở sâu 3 nhịp, đi ra chỗ khác rửa mặt bằng nước lạnh để hạ nhiệt trước khi quay lại nói chuyện với em.", "correct": true, "emoji": "💚"}, {"text": "Lao vào giật tóc em và ném đồ đạc để em biết thế nào là lễ độ.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Cơ thể bạn thường báo động điều gì đầu tiên khi bạn bắt đầu chuẩn bị nổi giận?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn có quyền cảm thấy giận dữ, nhưng bạn không có quyền dùng cơn giận để làm tổn thương người khác."]}', 6);

-- --- Micro Lesson 4.3: Chiếc kính lúp nhạy cảm ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Chiếc kính lúp nhạy cảm', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao tuổi dậy thì tụi mình lại cực kỳ nhạy cảm và dễ suy diễn trước những ánh mắt, lời nói của người xung quanh?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Bộ não tuổi teen đang tái cấu trúc, khiến bạn có xu hướng nghĩ rằng ai cũng đang nhìn và đánh giá mình.", "Một lời nhận xét vô tình của bạn bè cũng có thể bị bạn phóng đại lên thành sự chỉ trích, ghét bỏ.", "Hãy nhớ: hầu hết mọi người chỉ đang bận tâm đến bản thân họ, họ không soi xét bạn kỹ đâu."]}', 2),
(@ml_id, 'scenario', '{"title": "Cái nhìn của bạn cùng lớp", "body": "Vy đi ngang qua nhóm bạn đang thì thầm nói chuyện, thấy một bạn nhìn mình rồi quay đi cười. Vy lập tức nghĩ họ đang nói xấu chiếc quần bị bẩn của mình."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các suy nghĩ khi đối mặt với nhận xét của người khác:", "leftBox": {"title": "Suy nghĩ tỉnh táo"}, "rightBox": {"title": "Suy diễn phóng đại"}, "items": [{"text": "Bạn ấy nhìn mình chắc là vì áo mình có dính vết bẩn gì thôi, cứ hỏi thử xem sao", "correctBox": "left"}, {"text": "Thầy giáo không gọi mình phát biểu chắc chắn là vì thầy ghét mình và thấy mình dốt", "correctBox": "right"}, {"text": "Lời góp ý của bạn là để slide bài tập nhóm của mình tốt hơn, không có ý chê bai cá nhân", "correctBox": "left"}, {"text": "Mọi người đang cười nói khi mình đi qua chắc chắn là họ đang bàn tán nói xấu mình", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng mất ngủ cả đêm chỉ vì một câu nói đùa vô tình của một người bạn cùng lớp chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đừng để chiếc kính lúp suy diễn bóp méo sự thật. Hãy nhìn mọi việc với lăng kính đơn giản hơn."]}', 6);

-- --- Micro Lesson 4.4: Tình huống: Bất đồng với bố mẹ ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Tình huống: Bất đồng với bố mẹ', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để bày tỏ mong muốn tự lập của mình mà không biến mọi cuộc trò chuyện với bố mẹ thành một trận cãi vã?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Mong muốn tự chủ tăng lên khiến bạn dễ cảm thấy bố mẹ kiểm soát quá đà, áp đặt hoặc không thấu hiểu mình.", "Tuy nhiên, cãi vã, đóng sầm cửa hay chiến tranh lạnh chỉ khiến khoảng cách thế hệ càng thêm xa.", "Dùng kỹ năng giao tiếp tôn trọng để bày tỏ suy nghĩ của bạn một cách trưởng thành."]}', 2),
(@ml_id, 'scenario', '{"title": "Chọn trang phục đi tiệc", "body": "Mẹ muốn Vy mặc chiếc váy ren xòe đi tiệc cưới họ hàng, nhưng Vy thích mặc quần jeans năng động hơn. Mẹ bảo Vy bướng bỉnh, Vy thấy uất ức."}', 3),
(@ml_id, 'flashcard', '{"front": "Vy nên nói chuyện với mẹ thế nào để giữ được chính kiến mà không gây hỗn hào?", "back": "Vy có thể nói nhẹ nhàng: Mẹ ơi, con mặc quần jeans này trông vẫn rất lịch sự và con thấy thoải mái nhất khi di chuyển. Mẹ tôn trọng lựa chọn này của con nha mẹ?.", "notes": "Lời nói nhẹ nhàng nhưng kiên định luôn hiệu quả hơn tiếng la hét tức giận."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có hay chọn cách la hét hay chọn cách im lặng lánh mặt khi bất đồng ý kiến với bố mẹ?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bày tỏ sự trưởng thành bằng cách giao tiếp tôn trọng, bố mẹ sẽ dễ lắng nghe tiếng nói của bạn hơn."]}', 6);

-- --- Micro Lesson 4.5: Hộp công cụ bình ổn tâm trạng ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Hộp công cụ bình ổn tâm trạng', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn đã tích lũy cho mình những bí kíp siêu dễ để kéo tâm trạng lên mỗi khi cảm thấy buồn bã hoặc stress chưa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Viết nhật ký để trút bỏ mọi suy nghĩ lộn xộn ra trang giấy.", "Vận động thể thao nhẹ nhàng: đi bộ, đạp xe giúp cơ thể tiết ra hormone hạnh phúc.", "Dành 5 phút hít thở sâu hoặc nghe một bản nhạc êm dịu không lời để xoa dịu thần kinh."]}', 2),
(@ml_id, 'scenario', '{"title": "Áp lực thi cử", "body": "Hùng cảm thấy vô cùng áp lực trước kỳ thi học kỳ, đầu óc Hùng trống rỗng và Hùng bắt đầu thấy bồn chồn đau bụng dữ dội do lo âu."}', 3),
(@ml_id, 'interaction', '{"question": "Hùng nên dùng phương pháp nào để xoa dịu sự lo âu ngay lúc này?", "choices": [{"text": "Tạm dừng học 15 phút, nhắm mắt hít thở sâu theo nhịp 4-7-8 và uống một ngụm nước ấm.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục cố ngồi học thêm 3 tiếng nữa dưới áp lực căng thẳng cao độ.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Hoạt động nào thường giúp bạn lấy lại sự bình yên và năng lượng nhanh nhất mỗi khi gặp áp lực?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chăm sóc sức khỏe tinh thần cũng quan trọng như chăm sóc thể chất. Hãy cho phép bản thân nghỉ ngơi khi cần."]}', 6);

-- --- Micro Lesson 4.6: Kết bạn với những cơn bão ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Kết bạn với những cơn bão', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Học cách coi những xáo trộn cảm xúc tuổi dậy thì là một trải nghiệm phong phú của cuộc sống, tại sao không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cảm xúc dù tiêu cực hay tích cực đều là những tín hiệu quý giá mách bảo về nhu cầu bên trong của bạn.", "Đừng cố đè nén hay phủ nhận nỗi buồn, cơn giận. Hãy gọi tên và đón nhận chúng.", "Đi qua những xáo trộn này sẽ giúp bạn trở thành một người trưởng thành có chiều sâu hơn."]}', 2),
(@ml_id, 'scenario', '{"title": "Đè nén giọt nước mắt", "body": "Nam cố nuốt nước mắt vào trong khi chú cún yêu quý qua đời vì sợ các bạn nam khác trêu mình là ẻo lả, yếu đuối."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các cách đối xử với cảm xúc cá nhân:", "leftBox": {"title": "Kết bạn cảm xúc"}, "rightBox": {"title": "Đè nén chối bỏ"}, "items": [{"text": "Khóc một trận thật to khi thấy buồn để giải tỏa hết uất ức", "correctBox": "left"}, {"text": "Cố gắng tỏ ra vui vẻ bên ngoài khi bên trong đang vô cùng đau khổ", "correctBox": "right"}, {"text": "Tự nhủ: Mình được phép buồn lúc này, ngày mai mình sẽ ổn hơn", "correctBox": "left"}, {"text": "Ghét bỏ bản thân vì thấy mình yếu đuối, dễ khóc trước mặt người khác", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang cho phép mình được khọc hoặc tỏ ra yếu đuối khi thực sự mệt mỏi không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cảm xúc của bạn là hợp lệ. Hãy ôm ấp lấy cả những ngày mưa giông trong lòng mình."]}', 6);

-- --- Micro Lesson 4.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson4_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Bão Cảm Xúc: Sáng Nắng Chiều Mưa, Có Sao Đâu?''! Bạn có 3 mạng để tự tin đối phó và làm chủ cơn bão cảm xúc tuổi dậy thì."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Làm chủ cơn bão cảm xúc và giao tiếp lành mạnh",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Bình đang rất hào hứng hoàn thành bức tranh vẽ dự thi của mình. Em trai Bình vô tình chạy nô đùa làm đổ cả cốc nước lọc lên bức tranh khiến màu nhòe nhoẹt, hỏng hoàn toàn. Bình cảm thấy máu nóng dồn lên mặt, tim đập thình thịch và muốn lao vào đánh em.",
      "choices": [
        { "text": "Lao vào đánh em một trận lôi đình để trút giận: ''Mày làm hỏng hết bài của tao rồi!'' và ném đồ đạc.", "nextNode": "fail_explode" },
        { "text": "Hít thở sâu 3 nhịp, nói to: ''Em đi ra ngoài đi!'' rồi vào nhà tắm rửa mặt bằng nước lạnh để bình tĩnh lại trước khi dọn dẹp.", "nextNode": "step2" },
        { "text": "Cố chịu đựng ấm ức, im lặng nhặt bức tranh hỏng lên rồi chạy vào phòng đóng sập cửa, nằm khóc dằn vặt bản thân cả đêm.", "nextNode": "fail_suppress" }
      ]
    },
    "step2": {
      "text": "Sau khi rửa mặt hạ nhiệt, Bình thấy bình tĩnh hơn. Tối hôm đó, lúc ăn cơm, bố mẹ so sánh: ''Bằng tuổi con, con nhà cô Lan đã biết phụ giúp việc nhà và học giỏi, sao con chỉ biết vẽ vời vô ích!''. Cảm giác ức chế lại dâng lên.",
      "choices": [
        { "text": "Gào khóc cãi lại: ''Bố mẹ lúc nào cũng con nhà người ta, con ghét bố mẹ!'' rồi bỏ bữa cơm.", "nextNode": "fail_clash" },
        { "text": "Hít sâu giữ bình tĩnh, trả lời lịch sự: ''Bố mẹ ơi, con vẽ tranh là sở thích lành mạnh và con vẫn cố gắng hoàn thành việc học mà. Con mong bố mẹ động viên con thay vì so sánh ạ''.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Mặc dù đã đối thoại tốt, Bình vẫn thấy trong lòng còn bứt rứt, lo lắng dồn nén trước kỳ thi học kỳ sắp tới. Cậu muốn tìm cách bình ổn lại tâm lý của mình.",
      "choices": [
        { "text": "Tạm dừng học 15 phút, tắt điện thoại, thực hiện kỹ thuật thở 4-7-8 điều hòa nhịp tim và nghe một bản nhạc nhẹ.", "nextNode": "success_end" },
        { "text": "Cố ngồi nhồi nhét tài liệu liên tục 4 tiếng nữa dưới áp lực đau đầu dữ dội.", "nextNode": "fail_overwork" }
      ]
    },
    "success_end": {
      "text": "🎉 Xuất sắc! Bạn đã kiểm soát tốt cơn giận bộc phát, giao tiếp văn minh với gia đình và biết cách chăm sóc tinh thần khi quá tải.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_explode": {
      "text": "❌ Chưa đúng! Hành động bộc phát bạo lực làm tổn thương em trai, gây rạn nứt gia đình và khiến bạn dằn vặt dằn vặt sau đó.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_suppress": {
      "text": "❌ Chưa đúng! Đè nén uất ức một mình mà không giải tỏa lành mạnh chỉ làm quả bóng cảm xúc thêm phình to và dễ phát nổ sau này.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_clash": {
      "text": "❌ Sai rồi! La hét phản kháng hỗn hào chỉ làm tăng mâu thuẫn gia đình và khiến bố mẹ có ấn tượng xấu về sự trưởng thành của bạn.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_overwork": {
      "text": "❌ Sai rồi! Ép bộ não làm việc khi đang kiệt sức dưới áp lực cao độ chỉ gây phản tác dụng, làm giảm trí nhớ và tăng triệu chứng stress thể chất.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các cách đối xử với bão cảm xúc dậy thì:",
  "leftBox": { "title": "Kết bạn cảm xúc" },
  "rightBox": { "title": "Chối bỏ hoặc Trút giận" },
  "items": [
    { "text": "Cho phép bản thân khóc khi buồn để giải tỏa bớt năng lượng tiêu cực", "correctBox": "left" },
    { "text": "Cố tỏ ra vui cười hớn hở bên ngoài khi trong lòng đang tan nát", "correctBox": "right" },
    { "text": "Tự viết nhật ký trút bỏ mọi suy nghĩ bực bội ra giấy rồi xé bỏ", "correctBox": "left" },
    { "text": "Quát mắng em nhỏ hoặc đập phá đồ đạc để hạ hỏa cơn cáu giận", "correctBox": "right" },
    { "text": "Tự nhủ: Cảm xúc lo lắng này là hợp lệ, mình sẽ đối diện và vượt qua", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp các khái niệm xáo trộn cảm xúc và định nghĩa tương ứng:",
  "pairs": [
    { "left": "Estrogen & Testosterone", "right": "Các hormone sinh học tăng vọt tuổi dậy thì làm biến động tâm trạng." },
    { "left": "Kính lúp suy diễn", "right": "Bẫy tâm lý phóng đại một lời nhận xét hay ánh mắt thành chỉ trích cá nhân." },
    { "left": "Bất đồng thế hệ", "right": "Mâu thuẫn nảy sinh khi nhu cầu tự lập của con va chạm với sự bảo bọc của bố mẹ." },
    { "left": "Kỹ thuật thở 4-7-8", "right": "Bài tập hít thở vật lý giúp kích hoạt hệ thần kinh đối giao cảm làm dịu não bộ." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về điều tiết cảm xúc:",
  "sentence": "Sự thay đổi tâm trạng tuổi dậy thì là do tác động của [blank1]. Đừng rơi vào bẫy kính lúp [blank2] mọi chuyện. Hãy trò chuyện [blank3] với bố mẹ và sử dụng các công cụ [blank4] cảm xúc để giữ bình tĩnh.",
  "blanks": {
    "blank1": { "correct": "hormone", "placeholder": "..." },
    "blank2": { "correct": "suy diễn", "placeholder": "..." },
    "blank3": { "correct": "tôn trọng", "placeholder": "..." },
    "blank4": { "correct": "bình ổn", "placeholder": "..." }
  },
  "words": ["hormone", "suy diễn", "tôn trọng", "bình ổn", "hỗn hào", "chối bỏ", "trốn tránh", "game"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Tại sao việc gọi tên chính xác cảm xúc của mình lúc giận dữ (ví dụ: ''con đang rất uất ức vì bị so sánh'') lại giúp hạ nhiệt cơn giận?",
  "enableLives": true,
  "choices": [
    { "text": "Vì gọi tên cảm xúc chuyển hướng hoạt động từ hạch hạnh nhân (trung tâm cảm xúc) sang vỏ não trước trán (trung tâm tư duy lô-gíc), giúp não bộ lấy lại quyền kiểm soát hành vi.", "correct": true, "emoji": "💚" },
    { "text": "Vì nói ra sẽ làm cho đối phương lập tức sợ hãi và nhượng bộ bạn.", "correct": false, "emoji": "😐" },
    { "text": "Vì nó làm cho hormone testosterone bị biến mất khỏi cơ thể ngay lập tức.", "correct": false, "emoji": "🙁" },
    { "text": "Vì đó là câu thần chú tự động làm mát nhiệt độ phòng học.", "correct": false, "emoji": "🛑" }
  ]
}', 6);



-- =========================================================================
-- BÀI HỌC 5: Yêu Lấy Chiếc Body: Đừng Để Ai "Body Shame"! (Body Image)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'yeu-lay-chiec-body',
    'Yêu Lấy Chiếc Body: Đừng Để Ai "Body Shame"!',
    'Hiểu về hình ảnh cơ thể lành mạnh, ứng phó trước phán xét ngoại hình và lọc bớt áp lực từ mạng xã hội.',
    'Bài học giúp bạn xây dựng lòng tự tin bên trong, kiên định phản hồi trước những lời chê bai ngoại hình và tôn trọng sự đa dạng cơ thể.',
    32,
    false,
    100,
    12
);
SET @lesson5_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson5_id, 'Scarleteen - Body Image', 'https://www.scarleteen.com/read/body-image', 'website');

-- --- Micro Lesson 5.1: Chiếc gương phản chiếu: Body Image là gì? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Chiếc gương phản chiếu: Body Image là gì?', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Mỗi khi nhìn vào gương, bạn nhìn thấy điều gì đầu tiên: những khuyết điểm hay nét đẹp độc đáo?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hình ảnh cơ thể (Body Image) là cách bạn suy nghĩ, cảm nhận và hình dung về ngoại hình của chính mình.", "Body image lành mạnh là khi bạn chấp nhận, trân trọng và thấy thoải mái với cơ thể thật của mình.", "Trân trọng cơ thể vì những gì nó giúp bạn làm (chạy nhảy, ôm ấp), chứ không chỉ vì trông nó thế nào."]}', 2),
(@ml_id, 'scenario', '{"title": "Ngắm mình trong gương", "body": "Hòa dành cả tiếng đồng hồ đứng trước gương để soi những chiếc mụn nhỏ và tự hỏi tại sao chân mình không được thon dài như các mẫu ảnh."}', 3),
(@ml_id, 'flashcard', '{"front": "Ngoại hình của bạn có quyết định giá trị con người và hạnh phúc của bạn không?", "back": "Tuyệt đối KHÔNG. Giá trị của bạn nằm ở tâm hồn, tài năng, nhân cách và cách bạn đối xử với mọi người. Cơ thể chỉ là ngôi nhà chở che bạn thôi.", "notes": "Hãy trân trọng cơ thể vì những gì nó giúp bạn làm thay vì chỉ soi xét vẻ ngoài."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn thường nói những lời yêu thương hay những lời chê bai khi tự ngắm mình trong gương?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể bạn là duy nhất. Hãy trân trọng nó vì nó đang làm việc chăm chỉ để bảo vệ bạn mỗi ngày."]}', 6);

-- --- Micro Lesson 5.2: Nhận diện "Body Shaming" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Nhận diện "Body Shaming"', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Những lời nhận xét có vẻ đùa vui như Dạo này béo thế! hay Cao như cái sào! thực chất là gì?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Body Shaming (Phán xét ngoại hình) là hành vi bình luận tiêu cực, chế giễu hoặc chê bai vóc dáng, ngoại hình của người khác.", "Nó thường được bao biện bằng câu nói: Chỉ đùa vui thôi mà làm gì căng thế?.", "Nhận diện sớm giúp bạn thiết lập ranh giới bảo vệ bản thân và tránh làm tổn thương người khác."]}', 2),
(@ml_id, 'scenario', '{"title": "Lời trêu chọc đùi to", "body": "Trong nhóm chat chung, một bạn đăng ảnh chụp lén Vân đang ăn bánh mì kèm chú thích: Ăn thế này bảo sao đùi to như cột đình!. Cả nhóm hùa vào thả icon cười cợt."}', 3),
(@ml_id, 'interaction', '{"question": "Hành vi của nhóm bạn trong group chat đối với Vân là gì?", "choices": [{"text": "Hành vi Body Shaming gây tổn thương nghiêm trọng đến lòng tự trọng và tâm lý của Vân.", "correct": true, "emoji": "💚"}, {"text": "Một trò đùa vui nhộn lành mạnh giúp Vân có thêm động lực giảm cân.", "correct": false, "emoji": "🚩"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng vô tình dùng từ ngữ chê bai ngoại hình để làm biệt danh trêu chọc một người bạn của mình chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tôn trọng ngoại hình của người khác là biểu hiện cơ bản nhất của một lối sống văn minh."]}', 6);

-- --- Micro Lesson 5.3: Cạm bẫy filter và mạng xã hội ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Cạm bẫy filter và mạng xã hội', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có bao giờ cảm thấy tự ti khi lướt mạng xã hội nhìn thấy những bức ảnh da trắng mịn của các hot teen?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Hầu hết hình ảnh trên mạng xã hội đã qua chỉnh sửa góc chụp, ánh sáng và vô số lớp filter làm đẹp.", "So sánh cơ thể thật của bạn với những hình ảnh ảo đã qua chỉnh sửa là một việc vô lý.", "Hãy follow những trang chia sẻ về vẻ đẹp tự nhiên đa dạng và tắt thông báo các tài khoản độc hại."]}', 2),
(@ml_id, 'scenario', '{"title": "Sống ảo hoàn hảo", "body": "Khánh dành 30 phút bóp eo, làm mịn da bằng các app chỉnh ảnh trước khi đăng lên mạng xã hội, rồi ngồi lo sợ nếu các bạn gặp mình ngoài đời sẽ chê xấu."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành vi sử dụng mạng xã hội lành mạnh cho tâm lý:", "leftBox": {"title": "Bảo vệ tinh thần"}, "rightBox": {"title": "Rơi vào tự ti"}, "items": [{"text": "Tự nhắc nhở bản thân: Ảnh trên mạng chỉ là sản phẩm của góc chụp và filter", "correctBox": "left"}, {"text": "Tìm mọi cách ăn kiêng hà khắc để có được vòng eo giống idol trên mạng", "correctBox": "right"}, {"text": "Nhấn nút hủy theo dõi các tài khoản luôn khiến mình thấy tự ti về cơ thể", "correctBox": "left"}, {"text": "Liên tục sử dụng các app chỉnh ảnh bóp méo vóc dáng thật trước khi đăng bài", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thấy thoải mái hơn khi đăng một bức ảnh mặt mộc mỉm cười tự nhiên của mình lên mạng không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cuộc sống thật có khuyết điểm và khuyết điểm làm nên sự độc bản đáng quý của bạn."]}', 6);

-- --- Micro Lesson 5.4: Tình huống: Bị phán xét công khai ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Tình huống: Bị phán xét công khai', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để giữ vững sự tự tin khi ai đó bất ngờ chê bai ngoại hình của bạn ngay trước mặt đám đông?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Khi bị chê bai công khai, phản ứng tự nhiên của chúng ta là xấu hổ, tức giận hoặc muốn thu mình lại.", "Lối sống ứng xử vô duyên hay lịch sự nằm ở người nhận xét, không nằm ở cơ thể bạn.", "Phản hồi kiên định, lịch sự và rời khỏi cuộc trò chuyện mang lại năng lượng tiêu cực."]}', 2),
(@ml_id, 'scenario', '{"title": "Họ hàng nhận xét", "body": "Tại buổi họp gia đình, một người họ hàng nói lớn: Ơ hay dạo này Vy ăn gì béo thế con? Con gái con lứa phải biết giữ dáng chứ!. Mọi người bắt đầu cười."}', 3),
(@ml_id, 'flashcard', '{"front": "Vy nên ứng phó thế nào trước lời nhận xét kém tinh tế của người họ hàng?", "back": "Vy có thể mỉm cười nhẹ và nói bình thản: Dạ dạo này con đang dậy thì nên cơ thể phát triển khỏe mạnh là tốt rồi ạ bác. rồi xin phép đi lấy nước để tránh đôi co.", "notes": "Tự tin bảo vệ ranh giới cơ thể mình bằng thái độ lịch sự nhưng cứng rắn."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn đã từng dũng cảm lên tiếng bảo vệ bản thân khi bị người lớn hoặc bạn bè chê bai ngoại hình chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Giá trị của bạn không được định nghĩa bởi thước đo của người khác. Hãy tự tin tỏa sáng theo cách riêng."]}', 6);

-- --- Micro Lesson 5.5: Cách đối phó với những lời chỉ trích ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Cách đối phó với những lời chỉ trích', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để biến những lời chê bai ngoại hình thành cơ hội để xây dựng lòng yêu thương bản thân?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Học cách lọc thông tin: chỉ lắng nghe lời khuyên y khoa lành mạnh từ chuyên gia hoặc người thực sự quan tâm đến sức khỏe.", "Bỏ qua các lời chỉ trích công kích mang tính hạ nhục trên mạng bằng cách chặn (block) và báo cáo (report).", "Thực hành viết những điều bạn yêu thích nhất về cơ thể mình để củng cố tự tin bên trong."]}', 2),
(@ml_id, 'scenario', '{"title": "Comment chế giễu chiều cao", "body": "Hùng bị một số tài khoản ảo trên mạng để lại bình luận chế giễu chiều cao khiêm tốn dưới bức ảnh chụp chung với đội bóng rổ của trường."}', 3),
(@ml_id, 'interaction', '{"question": "Hùng nên xử lý thế nào để bảo vệ sức khỏe tinh thần của mình?", "choices": [{"text": "Chặn các tài khoản đó, báo cáo bình luận và tự nhắc mình: Mình chơi bóng rổ tốt bằng kỹ thuật và sự nhanh nhẹn, chiều cao không định nghĩa được tài năng.", "correct": true, "emoji": "💚"}, {"text": "Nhắn tin cãi nhau tay đôi với họ suốt đêm để chứng minh mình không yếu đuối.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thể viết ra ngay bây giờ 3 điều cơ thể bạn đã giúp bạn làm được và bạn thấy trân trọng nhất không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Chặn đi những năng lượng độc hại để nhường chỗ cho sự phát triển an lành của bản thân."]}', 6);

-- --- Micro Lesson 5.6: Cơ thể đa dạng là một món quà ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Cơ thể đa dạng là một món quà', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Sẽ thế nào nếu thế giới này tất cả mọi người đều có vóc dáng giống hệt như những ma-nơ-canh?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Sự đa dạng về hình dáng, màu da và kích thước chính là điều làm nên vẻ đẹp phong phú của thế giới loài người.", "Không có một cơ thể nào được coi là chuẩn mực duy nhất để phán xét các cơ thể khác.", "Tôn trọng sự đa dạng cơ thể giúp xây dựng học đường không bạo lực và đầy lòng nhân ái."]}', 2),
(@ml_id, 'scenario', '{"title": "Cô bạn cơ bắp", "body": "Một số bạn trêu chọc Hà trông như đàn ông vì Hà có bắp tay cơ bắp săn chắc do tập võ bơi lội, khiến Hà e dè không dám mặc áo ngắn tay."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành vi ứng xử tôn trọng sự đa dạng cơ thể:", "leftBox": {"title": "Tôn trọng đa dạng"}, "rightBox": {"title": "Áp đặt khuôn mẫu"}, "items": [{"text": "Khen ngợi nụ cười rạng rỡ của bạn thay vì nhận xét bạn béo hay gầy", "correctBox": "left"}, {"text": "Đánh giá một bạn nữ là không nữ tính chỉ vì bạn ấy có cơ bắp khỏe mạnh", "correctBox": "right"}, {"text": "Chào đón tất cả các bạn có vóc dáng khác nhau tham gia chơi trò chơi tập thể", "correctBox": "left"}, {"text": "Bắt người yêu phải giảm cân để có được thân hình thon gọn giống các mẫu ảnh", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng yêu thương cơ thể mình ngay cả khi nó không hoàn hảo theo tiêu chuẩn của đám đông không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn là một tác phẩm nghệ thuật độc bản của tự nhiên. Hãy tự hào và trân trọng chiếc body duy nhất của mình."]}', 6);

-- --- Micro Lesson 5.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson5_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Yêu Lấy Chiếc Body: Đừng Để Ai Body Shame''! Bạn có 3 mạng để tự tin bảo vệ ranh giới hình ảnh cơ thể."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Tự tin bảo vệ vóc dáng trước phán xét ngoại hình",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Trong nhóm chat chung của lớp, một bạn nam đăng ảnh chụp lén Vân đang ăn bánh mì ở góc sân trường kèm chú thích trêu cợt: ''Ăn thế này bảo sao đùi to như cột đình!''. Cả nhóm hùa vào thả icon cười cợt, làm Vân vô cùng xấu hổ và tổn thương.",
      "choices": [
        { "text": "Nhắn tin chửi bới dữ dội và dọa gặp bạn nam đó ở cổng trường để giải quyết bằng bạo lực.", "nextNode": "fail_violence" },
        { "text": "Chụp màn hình làm bằng chứng, rời khỏi nhóm chat toxic, tự trấn an bản thân và chia sẻ sự việc với thầy cô hoặc bố mẹ.", "nextNode": "step2" },
        { "text": "U uất buồn bã, quyết định nhịn ăn bỏ bữa trưa và bữa tối để nhanh chóng giảm cân.", "nextNode": "fail_starve" }
      ]
    },
    "step2": {
      "text": "Được thầy cô can thiệp, nhóm bạn đã xin lỗi Vân. Cuối tuần đó, tại bữa cơm gia đình có họ hàng xa đến chơi, một người lớn nhận xét oang oang trước mọi người: ''Ơ hay dạo này Vy ăn gì béo thế con? Con gái phải biết giữ dáng chứ!''. Vy thấy ngực nghẹn lại.",
      "choices": [
        { "text": "Cúi đầu khóc thút thít, bỏ đũa chạy thẳng lên phòng khóa cửa lại uất ức.", "nextNode": "fail_cry" },
        { "text": "Mỉm cười nhẹ, trả lời kiên định và lịch sự: ''Dạ dạo này con đang dậy thì nên cơ thể phát triển khỏe mạnh là tốt rồi ạ bác!'' rồi chuyển chủ đề ôn hòa.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Mọi người gật gù đồng ý và nể phục sự tự tin của Vy. Tối đến, Vy lướt Instagram thấy các hot teen đăng ảnh có vòng eo con kiến mịn màng ảo diệu, sự so sánh xã hội trỗi dậy làm Vy thấy tự ti.",
      "choices": [
        { "text": "Nhận thức rõ mạng xã hội chỉ là sản phẩm của filter và góc chụp, tắt điện thoại đi ngủ và tập trung vào sức khỏe thực tế của mình.", "nextNode": "success_end" },
        { "text": "Tiếp tục lướt suốt đêm để tìm các bài viết hướng dẫn ăn kiêng cực đoan.", "nextNode": "fail_diet" }
      ]
    },
    "success_end": {
      "text": "🎉 Tuyệt vời! Bạn đã bảo vệ bản thân thành công trước body shaming mạng xã hội và gia đình, đồng thời có tư duy lành mạnh về vẻ đẹp cơ thể.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_violence": {
      "text": "❌ Chưa đúng! Sử dụng bạo lực hoặc chửi bới chỉ làm mâu thuẫn leo thang và biến bạn thành người sai trước pháp luật học đường.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_starve": {
      "text": "❌ Chưa đúng! Nhịn ăn cực đoan gây hại nghiêm trọng cho hệ tiêu hóa và làm suy nhược cơ thể đang tuổi lớn.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_cry": {
      "text": "❌ Sai rồi! Khóc lóc bỏ chạy chỉ làm cho không khí gia đình căng thẳng và chứng tỏ bạn đang hoàn toàn bị lời chê bai đó đánh gục.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_diet": {
      "text": "❌ Sai rồi! Tìm kiếm chế độ ăn kiêng cực đoan thâu đêm làm bạn kiệt sức, lún sâu vào bẫy tự ti ảo trên mạng.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các hành vi ứng xử đối với vóc dáng cơ thể:",
  "leftBox": { "title": "Tôn trọng cơ thể" },
  "rightBox": { "title": "Body Shaming / Phán xét" },
  "items": [
    { "text": "Khen ngợi nụ cười rạng rỡ hoặc tính cách dễ mến của bạn học", "correctBox": "left" },
    { "text": "Trêu chọc chiều cao khiêm tốn của bạn cùng lớp để mua vui", "correctBox": "right" },
    { "text": "Tự nhủ: Cơ bắp khỏe khoắn giúp mình vận động dẻo dai tốt", "correctBox": "left" },
    { "text": "Nhận xét bạn gái trông thô kệch chỉ vì bạn ấy có bắp tay săn chắc", "correctBox": "right" },
    { "text": "Bỏ theo dõi những trang MXH chuyên đăng ảnh tiêu chuẩn vóc dáng phi thực tế", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa về hình ảnh cơ thể dậy thì và định nghĩa phù hợp:",
  "pairs": [
    { "left": "Hình ảnh cơ thể", "right": "Cách bạn suy nghĩ, cảm nhận và hình dung về ngoại hình của chính mình." },
    { "left": "Body Shaming", "right": "Hành vi bình luận tiêu cực, giễu cợt hoặc chê bai vóc dáng người khác." },
    { "left": "Cạm bẫy filter", "right": "Hình ảnh ảo đã qua chỉnh sửa bóp eo, mịn da tạo tiêu chuẩn phi thực tế." },
    { "left": "Đa dạng cơ thể", "right": "Sự thật sinh học rằng mỗi gen quy định chiều cao và khung xương khác nhau." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành định nghĩa yêu thương cơ thể:",
  "sentence": "Hình ảnh cơ thể lành mạnh bắt nguồn từ sự [blank1]. Khi bị phán xét ngoại hình, hãy kiên định thiết lập [blank2] bảo vệ mình. Tránh xa chiếc bẫy so sánh [blank3] và trân trọng vẻ đẹp [blank4] của bản thân.",
  "blanks": {
    "blank1": { "correct": "tự chấp nhận", "placeholder": "..." },
    "blank2": { "correct": "ranh giới", "placeholder": "..." },
    "blank3": { "correct": "mạng xã hội", "placeholder": "..." },
    "blank4": { "correct": "độc bản", "placeholder": "..." }
  },
  "words": ["tự chấp nhận", "ranh giới", "mạng xã hội", "độc bản", "ăn kiêng", "chê bai", "hoàn hảo", "sống ảo"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Ý kiến hoặc lời phán xét tiêu cực của người khác về cơ thể bạn phản ánh điều gì?",
  "enableLives": true,
  "choices": [
    { "text": "Nó chỉ phản ánh thế giới quan và mức độ lịch sự/thiếu tế nhị của chính họ, chứ không định nghĩa được giá trị thật sự hay vẻ đẹp của con người bạn.", "correct": true, "emoji": "💚" },
    { "text": "Nó phản ánh chính xác 100% những khiếm khuyết mà bạn bắt buộc phải sửa đổi ngay lập tức.", "correct": false, "emoji": "😐" },
    { "text": "Nó phản ánh việc bạn đang không biết cách ăn mặc hợp thời trang.", "correct": false, "emoji": "🙁" },
    { "text": "Nó phản ánh việc bố mẹ đã nuôi dạy bạn không đúng cách.", "correct": false, "emoji": "🛑" }
  ]
}', 6);



-- =========================================================================
-- BÀI HỌC 6: Tự Chăm Sóc Bản Thân: Học Cách Yêu Mình Đúng Điệu! (Self-Care)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'tu-cham-soc-ban-than-dung-dieu',
    'Tự Chăm Sóc Bản Thân: Học Cách Yêu Mình Đúng Điệu!',
    'Tầm quan trọng của dinh dưỡng, giấc ngủ, lắng nghe tín hiệu mệt mỏi và xây dựng thói quen tự chăm sóc hàng ngày.',
    'Bài học trang bị thói quen ngủ nghỉ khoa học, cách hạn chế lướt điện thoại ban đêm và kiên nhẫn bao dung với bản thân.',
    33,
    false,
    100,
    12
);
SET @lesson6_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson6_id, 'Scarleteen - Puberty Basics', 'https://www.scarleteen.com/read/bodies/not-everything-you-wanted-know-about-puberty-pretty-darn-close', 'website');

-- --- Micro Lesson 6.1: Năng lượng cho cỗ máy lớn lên ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Năng lượng cho cỗ máy lớn lên', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có biết cơ thể bạn đang tiêu tốn nhiều năng lượng để phát triển ở tuổi dậy thì tương đương một vận động viên không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tuổi dậy thì đòi hỏi một lượng dinh dưỡng phong phú: đạm xây dựng cơ, canxi phát triển xương và các vitamin.", "Bỏ bữa, ăn kiêng cực đoan dễ khiến cơ thể bị thiếu hụt năng lượng hoặc mất cân bằng nội tiết.", "Hãy lắng nghe cơn đói của cơ thể và nạp năng lượng bằng những thực phẩm lành mạnh."]}', 2),
(@ml_id, 'scenario', '{"title": "Nhịn ăn giảm cân", "body": "Phương nhịn ăn trưa để mong có thân hình thon gọn như thần tượng Hàn Quốc, dẫn đến việc bị hạ đường huyết ngất xỉu trong giờ thể dục."}', 3),
(@ml_id, 'flashcard', '{"front": "Nhịn ăn để giảm cân nhanh chóng ở tuổi dậy thì có phải là ý tưởng tốt không?", "back": "Tuyệt đối KHÔNG. Nhịn ăn làm cản trở sự phát triển chiều cao, gây mệt mỏi, suy giảm trí nhớ và xáo trộn nội tiết tố nghiêm trọng.", "notes": "Hãy chọn ăn uống đầy đủ chất dinh dưỡng kết hợp vận động thể thao để có cơ thể khỏe mạnh tự nhiên."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có hay bỏ bữa sáng vì vội đi học không? Bữa sáng chính là xăng để khởi động ngày mới của bạn đấy!"}', 5),
(@ml_id, 'takeaway', '{"items": ["Ăn uống đủ chất là cách bạn tiếp thêm sức mạnh cho hành trình lớn lên của cơ thể."]}', 6);

-- --- Micro Lesson 6.2: Giấc ngủ: Thời gian vàng "Upgrade" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Giấc ngủ: Thời gian vàng "Upgrade"', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao tụi mình thường được khuyên phải ngủ đủ 8 đến 10 tiếng mỗi đêm ở tuổi mới lớn?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Khi bạn ngủ sâu, tuyến yên trong não sẽ giải phóng hormone tăng trưởng (GH) nhiều nhất để giúp cao lớn và hồi phục.", "Thiếu ngủ kéo dài dẫn đến mất tập trung học tập, nổi mụn và tâm trạng dễ cáu bẳn bực dọc.", "Tránh xa màn hình điện thoại ít nhất 30 phút trước khi ngủ để có giấc ngủ sâu chất lượng."]}', 2),
(@ml_id, 'scenario', '{"title": "Rank game thâu đêm", "body": "Bách thường xuyên thức khuya đến 2h sáng để cày rank game. Sáng hôm sau đi học, Bách luôn trong tình trạng lờ đờ và ngủ gật trong lớp."}', 3),
(@ml_id, 'interaction', '{"question": "Bách nên thay đổi thói quen ngủ thế nào để hỗ trợ cơ thể phát triển tốt nhất?", "choices": [{"text": "Thiết lập giờ ngủ cố định trước 11h đêm, để điện thoại ở xa giường và ngủ đủ 8-9 tiếng mỗi ngày.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục thức khuya cày game, bù lại bằng cách ngủ bù 12 tiếng vào ngày chủ nhật là được.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thói quen mang điện thoại lên giường lướt mạng trước khi đi ngủ không? Điều này có ảnh hưởng đến giấc ngủ của bạn?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Giấc ngủ sâu là phòng thí nghiệm thần kỳ nơi cơ thể âm thầm sửa chữa và cao lớn lên mỗi đêm."]}', 6);

-- --- Micro Lesson 6.3: Lắng nghe tiếng nói của cơ thể ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Lắng nghe tiếng nói của cơ thể', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để nhận biết khi cơ thể đang phát tín hiệu cầu cứu vì bị làm việc hoặc học tập quá tải?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tín hiệu báo động bao gồm: mỏi mắt, đau đầu liên tục, uể oải chán ăn, hoặc bồn chồn lo lắng ở bụng.", "Nhiều bạn trẻ thường bỏ qua các tín hiệu này, cố gắng gồng mình học tập vì áp lực thành tích.", "Lắng nghe và cho phép cơ thể nghỉ ngơi chính là biểu hiện của sự tự chăm sóc thông thái."]}', 2),
(@ml_id, 'scenario', '{"title": "Mệt mỏi trước kỳ thi", "body": "Đầu óc nhức nhối quay cuồng trước kỳ thi học kỳ, nhưng Nam vẫn cố bấm điện thoại đọc tài liệu đến 1h sáng vì sợ trượt."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các phản ứng trước tín hiệu mệt mỏi của cơ thể:", "leftBox": {"title": "Lắng nghe thông thái"}, "rightBox": {"title": "Phớt lờ gượng ép"}, "items": [{"text": "Tạm dừng học, đi bộ xung quanh sân nhà 10 phút để thư giãn gân cốt", "correctBox": "left"}, {"text": "Uống thêm 1 lon nước ngọt/cafe đậm đặc để cố thức đêm cày bài dù đầu đang nhức", "correctBox": "right"}, {"text": "Nằm nghỉ ngơi thả lỏng cơ thể khi cảm thấy bụng dưới đau âm ỉ do kinh nguyệt", "correctBox": "left"}, {"text": "Cố gắng chạy bộ thêm 5km dù chân đang bị căng cơ đau nhói để đạt chỉ tiêu", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng cố học tập hay làm việc đến kiệt sức chỉ vì sợ bị đánh giá là lười biếng chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Cơ thể là người bạn đồng hành trung thực. Hãy nghỉ ngơi khi bạn ấy lên tiếng báo động mệt mỏi nhé."]}', 6);

-- --- Micro Lesson 6.4: Tình huống: Thức khuya cày điện thoại ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Tình huống: Thức khuya cày điện thoại', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để chiến thắng sức hấp dẫn của chiếc màn hình điện thoại rực rỡ vào lúc nửa đêm?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Ánh sáng xanh từ điện thoại ngăn cản cơ thể tiết hormone melatonin gây buồn ngủ.", "Lướt mạng xã hội vào ban đêm dễ kéo bạn vào những luồng suy nghĩ lo âu, so sánh tiêu cực.", "Thiết lập ranh giới rõ ràng với công nghệ là bước tự chăm sóc bản thân khôn ngoan nhất."]}', 2),
(@ml_id, 'scenario', '{"title": "Tiktok nửa đêm", "body": "Linh định chỉ lướt Tiktok 15 phút trước khi ngủ lúc 10h tối, nhưng các video ngắn lôi cuốn cuốn Linh đi liên tục khiến Linh thức đến 1h sáng."}', 3),
(@ml_id, 'flashcard', '{"front": "Linh nên làm thế nào để tránh tình trạng lướt điện thoại quên giờ giấc vào ban đêm?", "back": "Bật chế độ không làm phiền (Do Not Disturb), cài đặt giới hạn thời gian sử dụng app và đặt điện thoại ngoài tầm với của tay khi đã lên giường ngủ.", "notes": "Phòng ngủ nên là thánh đường của sự nghỉ ngơi, không phải là nơi lướt mạng thâu đêm."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có sẵn sàng tắt kết nối wifi điện thoại sau 10h30 tối để dành không gian yên tĩnh cho tâm trí nghỉ ngơi không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tắt điện thoại, mở giấc ngủ ngon. Đó là món quà tuyệt vời nhất bạn dành tặng cho sức khỏe của mình."]}', 6);

-- --- Micro Lesson 6.5: Lập thời gian biểu "Yêu Mình" ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Lập thời gian biểu "Yêu Mình"', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm thế nào để cân bằng giữa việc học tập bận rộn ở trường và thời gian chăm sóc bản thân mỗi ngày?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tự chăm sóc bản thân (Self-care) không cần những việc đắt đỏ, nó là những thói quen nhỏ đều đặn.", "Lập một thời gian biểu có xen kẽ thời gian học tập, thời gian thể thao và khoảng thời gian không làm gì cả.", "Học cách nói không với các yêu cầu không quan trọng khi bạn cần ưu tiên nghỉ ngơi."]}', 2),
(@ml_id, 'scenario', '{"title": "Vy không còn thời gian vẽ", "body": "Vy có lịch học thêm dày đặc cả tuần, không có lấy một buổi tối rảnh rỗi để vẽ tranh (sở thích lớn nhất của Vy), khiến Vy thấy uể oải."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên sắp xếp lại lịch sinh hoạt thế nào cho cân bằng cảm xúc?", "choices": [{"text": "Xin phép bố mẹ bớt một buổi học thêm không quá cấp thiết để dành tối thứ 7 cho sở thích vẽ tranh cá nhân.", "correct": true, "emoji": "💚"}, {"text": "Tiếp tục cố học hết công suất, đợi đến kỳ nghỉ hè mới bắt đầu vẽ tranh lại.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang dành ra ít nhất 30 phút mỗi ngày cho một sở thích lành mạnh mang lại niềm vui thuần khiết không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tự chăm sóc không phải là ích kỷ, đó là cách bạn sạc đầy pin để học tập và yêu thương cuộc sống tốt hơn."]}', 6);

-- --- Micro Lesson 6.6: Tự chăm sóc là một hành trình dài ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Tự chăm sóc là một hành trình dài', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tự chăm sóc bản thân có phải là việc chỉ làm một lần khi thấy mệt rồi thôi không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Tự chăm sóc là một phong cách sống bền vững, là sự cam kết lắng nghe và tôn trọng cơ thể mình mỗi ngày.", "Sẽ có những ngày bạn ăn uống không lành mạnh, đừng tự trách móc quá mức. Hãy bắt đầu lại vào ngày mai.", "Hãy kiên nhẫn và bao dung với chính mình trên hành trình học cách trưởng thành."]}', 2),
(@ml_id, 'scenario', '{"title": "Tự trách vì lười biếng", "body": "Hân tự sỉ vả mình vô dụng cả ngày vì lỡ dành cả buổi chiều thứ bảy nằm ngủ lười biếng thay vì đi học nhóm."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các quan niệm đúng đắn về hành trình tự chăm sóc bản thân:", "leftBox": {"title": "Lành mạnh lâu dài"}, "rightBox": {"title": "Sai lầm nhất thời"}, "items": [{"text": "Tự chăm sóc là thói quen nhỏ hàng ngày: uống đủ nước, ngủ đủ giấc", "correctBox": "left"}, {"text": "Chỉ tự chăm sóc bản thân bằng cách đi mua sắm những món đồ hiệu thật đắt tiền", "correctBox": "right"}, {"text": "Chấp nhận những ngày mình mệt mỏi và cho phép bản thân nghỉ ngơi không áy náy", "correctBox": "left"}, {"text": "Ép bản thân phải luôn vui vẻ tích cực 24/7 và không được phép buồn", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang bao dung và nhẹ nhàng với chính mình mỗi khi gặp thất bại hay phạm sai lầm không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Tự chăm sóc là hành trình trọn đời. Hãy bước đi thong thả với lòng bao dung dành cho bản thân mình."]}', 6);

-- --- Micro Lesson 6.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson6_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Tự Chăm Sóc Bản Thân: Học Cách Yêu Mình Đúng Điệu!''! Bạn có 3 mạng để xây dựng lối sống lành mạnh."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Xây dựng thói quen tự chăm sóc khoa học",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Linh định chỉ lướt điện thoại 15 phút trước khi đi ngủ lúc 10h tối để F5 tinh thần. Tuy nhiên, các video ngắn lôi cuốn trên Tiktok liên tục kéo Linh đi hết clip này sang clip khác khiến cô bé thức đến 1h sáng. Ngày hôm sau, Linh thức dậy mỏi mệt, uể oải và đi học muộn.",
      "choices": [
        { "text": "Tiếp tục mang điện thoại lên giường ngủ hàng đêm và lướt đến khi nào ngủ quên thì thôi.", "nextNode": "fail_phone" },
        { "text": "Bật chế độ không làm phiền sau 10h30 tối, để điện thoại ngoài tầm với của giường ngủ và ngủ đủ 8-9 tiếng mỗi ngày.", "nextNode": "step2" },
        { "text": "Thức khuya học bù và cày game tiếp, uống 2 lon nước tăng lực để lấy lại tỉnh táo ban ngày.", "nextNode": "fail_energy" }
      ]
    },
    "step2": {
      "text": "Nhờ ngủ sớm, Linh cảm thấy cơ thể khỏe mạnh, da dẻ bớt mụn hẳn. Một buổi trưa, Linh cảm thấy mắt mỏi rã rời, vai gáy căng nhức sau 5 tiết học căng thẳng trên lớp, nhưng chiều lại có buổi tập thể dục chạy bền.",
      "choices": [
        { "text": "Bất chấp mệt mỏi, cố gắng chạy hết công suất 5km để đạt chỉ tiêu thành tích cao nhất.", "nextNode": "fail_overwork" },
        { "text": "Lắng nghe tín hiệu cơ thể, xin phép thầy giáo thể dục cho chạy vừa sức và dành thời gian kéo giãn cơ nhẹ nhàng.", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Sau tiết thể dục, Linh thấy thoải mái. Cô bé muốn thiết lập kế hoạch ăn uống và lối sống tự chăm sóc bản thân lành mạnh lâu dài.",
      "choices": [
        { "text": "Nhịn bữa trưa và ăn kiêng hà khắc để ép cân nặng giảm thật nhanh giống như các người mẫu trên mạng.", "nextNode": "fail_diet" },
        { "text": "Ăn uống đủ chất đạm, canxi, vitamin và tự thưởng cho mình một khoảng thời gian nghỉ ngơi thư giãn 30 phút mỗi ngày.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Hoàn hảo! Bạn đã xây dựng được thói quen ngủ sớm bảo vệ sức khỏe, biết lắng nghe tín hiệu mệt mỏi của cơ thể và thiết lập chế độ sinh hoạt tự chăm sóc bản thân thông thái.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_phone": {
      "text": "❌ Chưa đúng! Thức khuya cày điện thoại ngăn cản cơ thể tiết melatonin, làm gián đoạn nhịp sinh học tự nhiên và gây kiệt quệ thể chất.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_energy": {
      "text": "❌ Chưa đúng! Lạm dụng nước tăng lực ép cơ thể làm việc quá sức sẽ tàn phá hệ tim mạch và làm suy nhược thần kinh nghiêm trọng.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_overwork": {
      "text": "❌ Sai rồi! Phớt lờ tín hiệu mệt mỏi thể chất để cố quá sức dễ gây chấn thương xương khớp và khiến cơ thể bị suy nhược sâu sắc.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_diet": {
      "text": "❌ Sai rồi! Nhịn ăn ép cân cực đoan ở tuổi dậy thì sẽ cản trở nghiêm trọng quá trình phát triển chiều cao, gây hạ đường huyết nguy hiểm.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các hành vi lắng nghe cơ thể:",
  "leftBox": { "title": "Lắng nghe thông thái" },
  "rightBox": { "title": "Phớt lờ gượng ép" },
  "items": [
    { "text": "Tạm dừng học bài, đi bộ thư giãn ngoài sân 10 phút khi thấy mỏi mắt", "correctBox": "left" },
    { "text": "Uống ly cafe đậm đặc để thức thâu đêm ôn thi dù đầu đang nhức búa bổ", "correctBox": "right" },
    { "text": "Nằm nghỉ ngơi thư giãn khi cảm thấy bụng dưới đau âm ỉ ngày hành kinh", "correctBox": "left" },
    { "text": "Tiếp tục chạy bộ gắng sức dù chân đang bị căng cơ sưng đỏ", "correctBox": "right" },
    { "text": "Dành ra 30 phút vẽ tranh hoặc chơi nhạc cụ giải tỏa lo âu mỗi tối", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp từ khóa tự chăm sóc và định nghĩa tương ứng:",
  "pairs": [
    { "left": "Hormone GH", "right": "Hormone tăng trưởng được giải phóng nhiều nhất khi cơ thể ngủ sâu trước 11h đêm." },
    { "left": "Melatonin", "right": "Hormone kích thích giấc ngủ ngon, bị ngăn cản bởi ánh sáng xanh điện thoại." },
    { "left": "Self-care", "right": "Phong cách sống lắng nghe nhu cầu sinh học và tinh thần để tự sạc pin bản thân." },
    { "left": "Thói quen nhỏ", "right": "Những bước đi dễ dàng như uống thêm nước giúp bộ não không bị quá tải phản kháng." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về tự chăm sóc bản thân:",
  "sentence": "Tự chăm sóc bản thân là một hành trình [blank1] đòi hỏi sự kiên nhẫn. Hãy ngủ sâu trước 11h đêm để giải phóng [blank2] tăng trưởng và ăn uống đủ [blank3] thay vì nhịn ăn. Đừng quên [blank4] cơ thể khi mệt mỏi.",
  "blanks": {
    "blank1": { "correct": "lâu dài", "placeholder": "..." },
    "blank2": { "correct": "hormone", "placeholder": "..." },
    "blank3": { "correct": "dinh dưỡng", "placeholder": "..." },
    "blank4": { "correct": "lắng nghe", "placeholder": "..." }
  },
  "words": ["lâu dài", "hormone", "dinh dưỡng", "lắng nghe", "nhất thời", "thuốc bổ", "nhịn ăn", "phớt lờ"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Tại sao giấc ngủ từ 10h tối đến 6h sáng lại được coi là thời gian vàng để phát triển chiều cao?",
  "enableLives": true,
  "choices": [
    { "text": "Vì trong khoảng từ 11h đêm đến 1h sáng, tuyến yên giải phóng hormone tăng trưởng (GH) nhiều gấp 4 lần bình thường nếu cơ thể đã ngủ sâu giấc.", "correct": true, "emoji": "💚" },
    { "text": "Vì ngủ ban đêm giúp kéo giãn các khớp xương một cách vật lý khi nằm ngang.", "correct": false, "emoji": "😐" },
    { "text": "Vì ban đêm cơ thể không phải nạp thêm thức ăn và tiêu hóa năng lượng.", "correct": false, "emoji": "🙁" },
    { "text": "Vì ngủ ban đêm giúp bạn tránh được ánh nắng mặt trời có hại cho chiều cao.", "correct": false, "emoji": "🛑" }
  ]
}', 6);



-- =========================================================================
-- BÀI HỌC 7: "Tin Chuẩn" Vs "Tin Đồn": Giải Mã Thắc Mắc Khó Nói! (Myths & FAQs)
-- =========================================================================
INSERT INTO lessons (course_id, slug, title, summary, content, lesson_order, is_free, xp_reward, estimated_minutes)
VALUES (
    @course_id,
    'giai-ma-tin-don-tuoi-day-thi',
    '"Tin Chuẩn" Vs "Tin Đồn": Giải Mã Thắc Mắc Khó Nói!',
    'Phân biệt tin đồn phản khoa học về chiều cao, hành vi tự khám phá cơ thể và cách tìm kiếm thông tin chính thống.',
    'Bài học cuối cùng giúp giải mã các tin đồn nhảm học đường, hướng dẫn tư duy phản biện khi đọc tin và tự tin làm chủ tuổi dậy thì.',
    34,
    false,
    100,
    12
);
SET @lesson7_id = LAST_INSERT_ID();

INSERT INTO lesson_sources (lesson_id, source_name, source_url, source_type) VALUES
(@lesson7_id, 'Scarleteen - Do It', 'https://www.scarleteen.com/read/bodies/do-it', 'website'),
(@lesson7_id, 'Scarleteen - Puberty Basics', 'https://www.scarleteen.com/read/bodies/not-everything-you-wanted-know-about-puberty-pretty-darn-close', 'website');

-- --- Micro Lesson 7.1: Giải mã tin đồn về chiều cao và vóc dáng ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Giải mã tin đồn về chiều cao và vóc dáng', 1);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn có tin vào lời đồn rằng qua tuổi dậy thì là chiều cao của bạn sẽ vĩnh viễn đứng yên không?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Chiều cao chịu ảnh hưởng di truyền, nhưng dinh dưỡng, giấc ngủ và thể thao đóng vai trò quyết định.", "Xương của bạn vẫn tiếp tục phát triển và chỉ thực sự đóng khớp hoàn toàn vào khoảng tuổi 20 đến 22.", "Đừng vội bỏ cuộc hay lo lắng, bạn vẫn còn thời gian để cải thiện chiều cao khoa học."]}', 2),
(@ml_id, 'scenario', '{"title": "Nỗi lo lùn tịt", "body": "Huy 14 tuổi nhưng lùn nhất nhóm bạn nam, cậu sợ hãi nghĩ mình sẽ lùn tịt cả đời và định mua thực phẩm chức năng tăng chiều cao cấp tốc."}', 3),
(@ml_id, 'flashcard', '{"front": "Có phải uống sữa tăng chiều cao thần tốc trên quảng cáo là cách duy nhất để cao lên không?", "back": "KHÔNG. Không có sữa hay thuốc thần kỳ nào giúp cao vọt ngay lập tức. Cần ăn uống đủ chất, ngủ sớm trước 11h đêm và tập luyện thể thao (bơi lội, bóng rổ).", "notes": "Hãy cảnh giác với các sản phẩm tăng chiều cao thần tốc không rõ nguồn gốc."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có đang duy trì một môn thể thao vận động kéo giãn cơ thể nào đều đặn mỗi tuần không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Sự cao lớn cần thời gian và thói quen sinh hoạt lành mạnh bền bỉ, không có đường tắt nào cả."]}', 6);

-- --- Micro Lesson 7.2: Sự thật về việc khám phá cơ thể ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Sự thật về việc khám phá cơ thể', 2);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Liệu hành vi tự khám phá cơ thể (thủ dâm) có gây ra những tác hại đáng sợ như lời đồn thổi?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Thủ dâm (Masturbation) là hành vi tự kích thích cơ quan sinh dục của mình để tìm kiếm cảm giác thư giãn.", "Về mặt y học, đây là hành vi sinh lý hoàn toàn bình thường, lành mạnh và an toàn để khám phá cơ thể.", "Nó chỉ bất ổn khi bạn làm quá thường xuyên gây ảnh hưởng cuộc sống hoặc làm ở nơi công cộng."]}', 2),
(@ml_id, 'scenario', '{"title": "Nỗi sợ vô căn cứ", "body": "Bách nghe các bạn nam rỉ tai nhau rằng thủ dâm sẽ làm suy giảm trí nhớ, gây vô sinh. Bách vô cùng hoang mang lo sợ."}', 3),
(@ml_id, 'interaction', '{"question": "Bách nên hiểu đúng về hành vi tự khám phá cơ thể thế nào cho khoa học?", "choices": [{"text": "Đây là hiện tượng sinh lý bình thường của tuổi dậy thì, không gây ra các tác hại ghê gớm nếu thực hiện điều độ, kín đáo và vệ sinh sạch sẽ.", "correct": true, "emoji": "💚"}, {"text": "Chắc chắn lời đồn là đúng, Bách nên đi khám bác sĩ tâm thần để điều trị ngay lập tức.", "correct": false, "emoji": "🛑"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có cảm thấy bớt lo lắng và tội lỗi hơn sau khi hiểu rõ góc nhìn khoa học về hành vi này chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Khám phá cơ thể là bình thường. Hãy thực hiện nó với thái độ tôn trọng cơ thể, kín đáo và giữ vệ sinh sạch sẽ."]}', 6);

-- --- Micro Lesson 7.3: Tại sao lại ngại hỏi? ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Tại sao lại ngại hỏi?', 3);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Tại sao tụi mình thường chọn cách âm thầm lên Google tra cứu hoặc tin vào lời đồn hơn là hỏi trực tiếp chuyên gia?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Cảm giác xấu hổ, sợ bị người lớn phán xét, mắng mỏ khiến tụi mình ngại ngùng che giấu.", "Nhưng tìm kiếm thông tin không chính thống dễ dẫn đến hiểu biết sai lệch, gây ra nỗi sợ vô lý.", "Vượt qua sự ngại ngùng để tìm kiếm những nguồn tin khoa học chính là cách bạn tự bảo vệ mình."]}', 2),
(@ml_id, 'scenario', '{"title": "Search Google giật gân", "body": "Vy băn khoăn về khí hư có màu trắng đục, cô bé tự search Google và đọc trúng bài viết bảo mình đã bị ung thư cổ tử cung khiến Vy khóc lóc tuyệt vọng."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các nguồn tìm kiếm thông tin sức khỏe tuổi dậy thì:", "leftBox": {"title": "Nguồn tin tin cậy"}, "rightBox": {"title": "Nguồn tin rác"}, "items": [{"text": "Website giáo dục giới tính uy tín như Scarleteen hoặc của tổ chức WHO, UNICEF", "correctBox": "left"}, {"text": "Các video ngắn không rõ nguồn gốc, giật tít câu view trên mạng xã hội", "correctBox": "right"}, {"text": "Bác sĩ nhi khoa, chuyên gia tâm lý hoặc giáo viên sinh học tại trường", "correctBox": "left"}, {"text": "Các diễn đàn mạng ẩn danh chuyên chia sẻ các mẹo truyền miệng dân gian trị bệnh", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có từng đọc được một thông tin sức khỏe giật gân trên mạng khiến bạn vô cùng hoảng sợ chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Đặt câu hỏi không có gì là xấu. Hãy tìm kiếm câu trả lời từ những nguồn tin khoa học và đáng tin cậy."]}', 6);

-- --- Micro Lesson 7.4: Tình huống: Lời rỉ tai ở trường ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Tình huống: Lời rỉ tai ở trường', 4);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao ứng phó khi bạn bè truyền tai nhau những thông tin sai lệch về tình dục hay thủ dâm ngay tại trường học?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Áp lực đồng trang lứa và sự tò mò khiến các tin đồn nhảm tuổi dậy thì lan truyền rất nhanh ở trường học.", "Bạn không cần phải hùa theo đám đông để tỏ ra sành sỏi, cũng không cần tranh cãi làm mất lòng bạn bè.", "Giữ cho mình đầu óc tỉnh táo, tin vào kiến thức khoa học đã học."]}', 2),
(@ml_id, 'scenario', '{"title": "Rỉ tai phòng học", "body": "Trong giờ ra chơi, một nhóm bạn đang bàn tán xôn xao rằng chỉ cần ôm nhau thôi bạn gái cũng có thể mang thai. Khánh đứng bên nghe thấy lo sợ tột cùng vì hôm qua vừa ôm một bạn nữ."}', 3),
(@ml_id, 'flashcard', '{"front": "Khánh nên xử lý nỗi sợ hãi của mình thế nào trước lời đồn của bạn bè?", "back": "Khánh nên tự trấn an: Ôm nhau không thể mang thai được. Sau đó, Khánh có thể đọc lại sách y khoa hoặc hỏi mẹ để giải tỏa hoàn toàn nỗi lo sợ ngớ ngẩn này.", "notes": "Đừng để những lời rỉ tai vô căn cứ kiểm soát tâm trạng và hành vi của bạn."}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có thói quen đối chiếu lại những thông tin nghe được từ bạn bè với sách giáo khoa không?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Kiến thức khoa học là chiếc la bàn tốt nhất giúp bạn vượt qua những sương mù tin đồn tuổi mới lớn."]}', 6);

-- --- Micro Lesson 7.5: Trở thành bộ lọc thông tin ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Trở thành bộ lọc thông tin', 5);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Làm sao để rèn luyện tư duy phản biện, tự biến mình thành một bộ lọc thông tin thông thái trước biển kiến thức?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Áp dụng quy tắc kiểm chứng thông tin: Ai viết? (Nguồn uy tín?), Dựa trên cơ sở nào? (Cơ sở y khoa?), Mục đích làm gì? (Giáo dục hay bán hàng?).", "Tránh chia sẻ những thông tin giật gân, chưa kiểm chứng lên mạng vì dễ gây hoang mang cho người khác.", "Luôn giữ thái độ cởi mở nhưng tỉnh táo trước mọi thông tin mới."]}', 2),
(@ml_id, 'scenario', '{"title": "Vy định share bài dứa", "body": "Vy đọc được bài viết trên Tiktok bảo rằng ăn nhiều dứa giúp ngày hành kinh thơm tho và không bị đau bụng, cô bé định chia sẻ ngay về trang cá nhân."}', 3),
(@ml_id, 'interaction', '{"question": "Vy nên làm gì trước khi nhấn nút chia sẻ bài viết đó?", "choices": [{"text": "Tìm kiếm lại từ khóa đó trên các trang y khoa uy tín để xác nhận tính chính xác của mẹo dân gian này trước khi chia sẻ.", "correct": true, "emoji": "💚"}, {"text": "Chia sẻ ngay lập tức vì thấy mẹo này rất thú vị và có ích cho các bạn gái khác.", "correct": false, "emoji": "🙁"}]}', 4),
(@ml_id, 'reflection', '{"question": "Bạn có bao giờ dừng lại suy ngẫm về tính chính xác của một thông tin trước khi nhấn nút share trên mạng chưa?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Hãy là một Netizen thông thái, biết lọc sạch thông tin trước khi nạp vào đầu và lan tỏa cho người khác."]}', 6);

-- --- Micro Lesson 7.6: Tự tin bước qua tuổi dậy thì! ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Tự tin bước qua tuổi dậy thì!', 6);
SET @ml_id = LAST_INSERT_ID();
INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@ml_id, 'hook', '{"title": "Bạn đã sẵn sàng khép lại chương học này để tự tin làm chủ hành trình dậy thì thành công của mình chưa?"}', 1),
(@ml_id, 'explanation', '{"bullets": ["Dậy thì không đáng sợ khi bạn đã trang bị đầy đủ kiến thức khoa học và lòng yêu thương bản thân.", "Chúc mừng bạn đã hoàn thành khóa học và tích lũy được những kỹ năng quan trọng để bảo vệ, chăm sóc cơ thể cũng như cảm xúc.", "Hãy tiếp tục bước đi trên con đường lớn lên với sự tự tin và tràn đầy năng lượng tích cực!"]}', 2),
(@ml_id, 'scenario', '{"title": "Nhìn lại hành trình", "body": "Khánh dạo này không còn hoảng hốt khi thấy da nổi mụn, biết tự giác ngủ sớm trước 11h và sẵn sàng tâm sự khó khăn sức khỏe với bố mẹ."}', 3),
(@ml_id, 'sorting', '{"instruction": "Phân loại các hành vi thể hiện sự sẵn sàng làm chủ tuổi dậy thì:", "leftBox": {"title": "Dậy thì thành công"}, "rightBox": {"title": "Chưa sẵn sàng lớn"}, "items": [{"text": "Tự tin chăm sóc vệ sinh cá nhân sạch sẽ và ăn uống đủ chất hàng ngày", "correctBox": "left"}, {"text": "Trốn tránh không dám nói chuyện với ai khi cơ thể gặp sự cố khó chịu", "correctBox": "right"}, {"text": "Tôn trọng sự đa dạng vóc dáng và cảm xúc thay đổi của bản thân, bạn bè", "correctBox": "left"}, {"text": "Tiếp tục tin vào những lời đồn thổi phản khoa học của bạn bè cùng lớp", "correctBox": "right"}]}', 4),
(@ml_id, 'reflection', '{"question": "Sau khóa học này, bạn cảm thấy mình đã tự tin hơn bao nhiêu phần trăm để đối mặt với những thay đổi của tuổi dậy thì?"}', 5),
(@ml_id, 'takeaway', '{"items": ["Bạn đã sẵn sàng và đầy bản lĩnh. Hãy tự tin bước ra thế giới và tỏa sáng theo cách riêng của mình!"]}', 6);

-- --- Micro Lesson 7.7: Bài kiểm tra: Thử thách tổng kết ---
INSERT INTO micro_lessons (lesson_id, title, micro_order) VALUES (@lesson7_id, 'Bài kiểm tra: Thử thách tổng kết', 99);
SET @assessment_ml_id = LAST_INSERT_ID();

INSERT INTO micro_lesson_blocks (micro_lesson_id, block_type, content_json, order_index) VALUES
(@assessment_ml_id, 'hook', '{"title": "Chào mừng bạn đến với Thử thách Tổng kết bài học ''Tin Chuẩn Vs Tin Đồn: Giải Mã Thắc Mắc Khó Nói!''! Bạn có 3 mạng để phân biệt kiến thức khoa học dậy thì."}', 1),
(@assessment_ml_id, 'scenario-choice', '{
  "title": "Cuộc phiêu lưu: Trở thành bộ lọc thông tin thông thái",
  "startNode": "step1",
  "nodes": {
    "step1": {
      "text": "Vy đọc được một bài viết trên TikTok được chia sẻ rầm rộ bảo rằng ăn thật nhiều dứa thay cơm trong ngày hành kinh giúp cơ thể thơm tho và giảm hoàn toàn 100% cơn đau bụng kinh. Vy thấy mẹo này rất thú vị và định chia sẻ ngay về trang cá nhân của mình.",
      "choices": [
        { "text": "Nhấn nút chia sẻ ngay lập tức về trang cá nhân để bạn bè cùng biết.", "nextNode": "fail_share" },
        { "text": "Tìm kiếm lại từ khóa đó trên các trang y khoa hoặc hỏi mẹ để xác nhận tính chính xác của mẹo dân gian này trước khi share.", "nextNode": "step2" },
        { "text": "Tự thực hành thí nghiệm ăn 3 quả dứa thay cơm cả ngày để tự kiểm chứng.", "nextNode": "fail_experiment" }
      ]
    },
    "step2": {
      "text": "Mẹ Vy giải thích rằng dứa có enzyme bromelain giúp giãn cơ tử cung nhẹ nhưng ăn quá nhiều thay cơm gây loét dạ dày. Hôm sau ở lớp, bạn Duy lo sợ tột cùng kể với Khánh rằng hôm qua Duy vô tình ôm một bạn nữ, và Duy nghe đồn là ôm nhau có thể làm bạn gái mang thai.",
      "choices": [
        { "text": "Rỉ tai đồn tiếp với các bạn nam khác để cùng cười cợt chọc ghẹo Duy.", "nextNode": "fail_spread" },
        { "text": "Trấn an Duy: ''Ôm nhau không thể mang thai được đâu cậu ơi. Cần có sự gặp gỡ trực tiếp của tinh trùng và trứng cơ, cậu yên tâm nhé!''", "nextNode": "step3" }
      ]
    },
    "step3": {
      "text": "Duy thở phào nhẹ nhõm. Cuối ngày, bạn Bách băn khoăn khi nghe các bạn rỉ tai nhau rằng hành vi tự khám phá cơ thể (thủ dâm) sẽ làm suy giảm trí nhớ, vô sinh và hỏng thận.",
      "choices": [
        { "text": "Bách hoang mang tin sái cổ và đi mua thuốc bổ thận tráng dương tự uống.", "nextNode": "fail_myth" },
        { "text": "Bách hiểu đúng khoa học: Đây là hành vi sinh lý bình thường nếu thực hiện điều độ, kín đáo và giữ vệ sinh sạch sẽ.", "nextNode": "success_end" }
      ]
    },
    "success_end": {
      "text": "🎉 Xuất sắc! Bạn đã có tư duy phản biện xuất sắc, biết chọn lọc nguồn tin y khoa chuẩn xác và dũng cảm xóa bỏ các tin đồn nhảm học đường.",
      "isEnd": true,
      "isSuccess": true
    },
    "fail_share": {
      "text": "❌ Chưa đúng! Chia sẻ thông tin giật gân, chưa kiểm chứng góp phần lan truyền tin đồn nhảm và làm giảm uy tín cá nhân của bạn.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_experiment": {
      "text": "❌ Chưa đúng! Ăn dứa thay cơm cả ngày tàn phá niêm mạc dạ dày do lượng axit cao, gây hại lớn cho hệ tiêu hóa.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_spread": {
      "text": "❌ Sai rồi! Lan truyền tin đồn sai lệch về mang thai gây hoang mang dư luận học đường và thể hiện sự thiếu hiểu biết giáo dục giới tính.",
      "isEnd": true,
      "isSuccess": false
    },
    "fail_myth": {
      "text": "❌ Sai rồi! Tin vào tin đồn thiếu khoa học làm bạn sống trong cảm giác tội lỗi, sợ hãi vô lý và việc tự uống thuốc bừa bãi có hại cho gan thận.",
      "isEnd": true,
      "isSuccess": false
    }
  }
}', 2),
(@assessment_ml_id, 'sorting', '{
  "instruction": "Hãy kéo thẻ hoặc click phân loại các nguồn tìm kiếm kiến thức sức khỏe dậy thì:",
  "leftBox": { "title": "Nguồn tin cậy khoa học" },
  "rightBox": { "title": "Nguồn tin rác / Tin đồn" },
  "items": [
    { "text": "Website của Tổ chức Y tế Thế giới WHO, UNICEF hoặc Bộ Y tế Việt Nam", "correctBox": "left" },
    { "text": "Các video ngắn giật tít câu view của các tiktoker không có chuyên môn y khoa", "correctBox": "right" },
    { "text": "Sách giáo khoa Sinh học hoặc phòng tư vấn tâm lý học đường của trường", "correctBox": "left" },
    { "text": "Các lời rỉ tai truyền miệng của hội bạn thân trong phòng vệ sinh học đường", "correctBox": "right" },
    { "text": "Bác sĩ chuyên khoa tại các bệnh viện nhi hoặc trung tâm y tế uy tín", "correctBox": "left" }
  ]
}', 3),
(@assessment_ml_id, 'matching', '{
  "instruction": "Ghép cặp các khái niệm giải mã thắc mắc dậy thì và định nghĩa tương ứng:",
  "pairs": [
    { "left": "Thủ dâm - Masturbation", "right": "Hành vi tự kích thích cơ quan sinh dục tìm cảm giác thư giãn, bình thường về sinh lý." },
    { "left": "Tư duy phản biện", "right": "Kỹ năng đặt câu hỏi kiểm chứng nguồn tin trước khi tin hoặc chia sẻ." },
    { "left": "Sụn tăng trưởng đóng khớp", "right": "Hiện tượng đầu xương hóa cốt hoàn toàn vào khoảng tuổi 20-22 làm ngừng tăng chiều cao." },
    { "left": "Giáo dục giới tính", "right": "Kiến thức khoa học giúp thấu hiểu cơ thể, cảm xúc và các mối quan hệ an toàn." }
  ]
}', 4),
(@assessment_ml_id, 'fill-blank', '{
  "instruction": "Điền các từ thích hợp để hoàn thành đoạn văn về giải mã tin đồn dậy thì:",
  "sentence": "Đừng vội tin vào các tin đồn học đường, hãy rèn luyện tư duy [blank1]. Tự khám phá cơ thể là hành vi [blank2] bình thường nếu điều độ. Chiều cao chỉ dừng lại khi [blank3] đóng khớp hoàn toàn. Hãy hỏi [blank4] khi gặp băn khoăn.",
  "blanks": {
    "blank1": { "correct": "phản biện", "placeholder": "..." },
    "blank2": { "correct": "sinh lý", "placeholder": "..." },
    "blank3": { "correct": "xương", "placeholder": "..." },
    "blank4": { "correct": "chuyên gia", "placeholder": "..." }
  },
  "words": ["phản biện", "sinh lý", "xương", "chuyên gia", "bệnh hoạn", "vô sinh", "Google", "nhịn ăn"]
}', 5),
(@assessment_ml_id, 'interaction', '{
  "question": "Thử thách trắc nghiệm: Làm thế nào để cải thiện chiều cao tối ưu ở giai đoạn cuối tuổi dậy thì một cách khoa học?",
  "enableLives": true,
  "choices": [
    { "text": "Duy trì chế độ dinh dưỡng giàu canxi/protein, đi ngủ sớm trước 11h đêm để giải phóng hormone tăng trưởng và tích cực chơi thể thao kéo giãn xương.", "correct": true, "emoji": "💚" },
    { "text": "Uống các loại thuốc tăng chiều cao siêu tốc và ăn thật nhiều đồ ngọt.", "correct": false, "emoji": "😐" },
    { "text": "Nằm im một chỗ cả ngày trên giường để xương không bị đè nén.", "correct": false, "emoji": "🙁" },
    { "text": "Nhịn ăn giảm cân và chỉ uống sữa thay cơm hàng ngày.", "correct": false, "emoji": "🛑" }
  ]
}', 6);

