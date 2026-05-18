set names utf8mb4;

use educare;

insert into users (id, full_name, email, username, password_hash, age, plan, xp, streak, quiz_score_total, avatar_url, role)
values
  ('9f3fbf44-16f2-4f88-9cf5-3f6c2d2b0011', 'EDUcare Admin', 'admin@educare.vn', 'educare_admin', '$2b$10$2PZ0ZSIK6XXvnRprYDgBI.l9EwT3TF.hnrSRBKbpLbhf7w52IXnCe', 18, 'PREMIUM', 0, 0, 0, null, 'ADMIN'),
  ('a8d9d888-22f7-46b5-919b-3df25a590021', 'Minh Anh', 'minhanh@educare.vn', 'minhanh', '$2b$10$2PZ0ZSIK6XXvnRprYDgBI.l9EwT3TF.hnrSRBKbpLbhf7w52IXnCe', 16, 'FREE', 0, 10, 0, null, 'STUDENT');

insert into lessons (slug, title, summary, content, lesson_order, is_free)
values
  ('hieu-ve-tuoi-teen', 'Hiểu về tuổi teen', 'Tổng quan về những thay đổi của tuổi teen trong học tập, cảm xúc và các mối quan hệ.', 'Bài học mở đầu giúp học sinh nhận ra tuổi teen là một giai đoạn phát triển bình thường và đáng được thấu hiểu.\nNội dung nhắc đến những thay đổi về cơ thể, cảm xúc và các nhu cầu cần được tôn trọng.\nMục tiêu là giúp người học bớt hoang mang và có cái nhìn tích cực hơn về bản thân.', 1, true),
  ('nhan-dien-cam-xuc', 'Nhận diện cảm xúc', 'Học cách gọi tên cảm xúc và nhận ra dấu hiệu trên cơ thể.', 'Khi biết mình đang buồn, lo, tức giận hay mệt mỏi, bạn sẽ dễ xử lý hơn.\nBài học hướng dẫn cách dùng nhật ký ngắn, bảng màu cảm xúc và câu hỏi tự phản chiếu.\nĐây là nền tảng để cải thiện giao tiếp và tự chăm sóc bản thân.', 2, true),
  ('quan-ly-ap-luc-hoc-tap', 'Quản lý áp lực học tập', 'Gợi ý các cách giảm căng thẳng trước bài kiểm tra và trong giai đoạn ôn tập.', 'Áp lực học tập là điều rất phổ biến ở tuổi teen.\nNội dung này gồm chia nhỏ mục tiêu, sắp xếp thời gian, nghỉ giải lao và tìm người đồng hành.\nBạn cũng được nhắc đến việc ngủ đủ, ăn uống điều độ và nói với bản thân nhẹ nhàng hơn.', 3, true),
  ('ky-nang-noi-khong', 'Kỹ năng nói không', 'Học cách đặt ranh giới và nói không trong các tình huống không an toàn.', 'Ranh giới là điều cần thiết để giữ sự tôn trọng.\nBài học đưa ra các tình huống gần gũi tại trường, trong tình bạn và trên mạng.\nNgười học được luyện cách nói ngắn gọn, rõ ràng và lịch sự.', 4, true),
  ('tu-tin-khi-giao-tiep', 'Tự tin khi giao tiếp', 'Xây dựng sự tự tin khi nói trước người khác và chia sẻ suy nghĩ của mình.', 'Tự tin không có nghĩa là lúc nào cũng mạnh mẽ.\nNội dung tập trung vào chuẩn bị trước, giữ nhất quán trong thông điệp và tập nói từng bước nhỏ.\nĐây là bài học hữu ích cho việc học, thuyết trình và giao tiếp trong gia đình.', 5, false),
  ('tinh-ban-lanh-manh', 'Tình bạn lành mạnh', 'Phân biệt tình bạn tích cực, sự tôn trọng và dấu hiệu của mối quan hệ không lành mạnh.', 'Bạn bè có ảnh hưởng rất lớn đến tâm trạng và cách sống của tuổi teen.\nBài học này giúp học sinh nhận ra dấu hiệu của sự ép buộc, nói xấu và thao túng.\nĐồng thời, bài học cũng hướng dẫn cách tìm nhóm bạn an toàn và đồng hành.', 6, false),
  ('an-toan-tren-mang', 'An toàn trên mạng', 'Hướng dẫn cách bảo vệ thông tin cá nhân và xử lý tình huống xấu trên internet.', 'Mạng xã hội có thể rất hữu ích nhưng cũng có rủi ro.\nNội dung bài học nhắc đến bảo mật mật khẩu, chia sẻ ảnh, nói chuyện với người lạ và cách báo cáo nội dung xấu.\nMục tiêu là giúp người học sử dụng internet tự tin và an toàn hơn.', 7, false),
  ('tim-kiem-su-ho-tro', 'Tìm kiếm sự hỗ trợ', 'Biết khi nào cần nói với người lớn đáng tin và cách tìm đến kênh hỗ trợ.', 'Không phải lúc nào bạn cũng cần tự giải quyết mọi việc một mình.\nBài học cuối giúp người học nhận ra các dấu hiệu cần xin hỗ trợ và nhắc đến những kênh an toàn như gia đình, giáo viên, tổng đài 111 và chuyên gia.', 8, false);

insert into blog_posts (slug, title, excerpt, content, category, published_at, read_time_minutes, emoji)
values
  ('vi-sao-cam-xuc-thay-doi-nhanh', 'Vì sao cảm xúc thay đổi nhanh ở tuổi teen?', 'Giải thích đơn giản về việc cảm xúc thay đổi nhanh và cách hiểu mình rõ hơn.', 'Cảm xúc ở tuổi teen có thể thay đổi nhanh vì có nhiều yếu tố cùng xuất hiện một lúc.\nNội dung này giúp bạn hiểu ảnh hưởng của học tập, tình bạn, gia đình và giấc ngủ.\nQuan trọng hơn, bài viết nhắc rằng mọi cảm xúc đều đáng được lắng nghe.', 'Cảm xúc', '2025-01-15', 5, ':)'),
  ('meo-giam-ap-luc-truoc-kiem-tra', 'Mẹo giảm áp lực trước kiểm tra', 'Những cách nhỏ để ôn bài có nhịp độ và bớt bị quá tải.', 'Khi quá lo lắng, bạn dễ học nhiều mà nhớ ít.\nThử chia việc cần học thành từng chặng ngắn, đổi môn sau 25 phút và nghỉ ngắn giữa các chặng.\nChuẩn bị trước một đêm và ngủ đủ vẫn là điều quan trọng nhất.', 'Học tập', '2025-01-22', 4, ':D'),
  ('cach-noi-voi-bo-me-ve-dieu-kho-noi', 'Cách nói với bố mẹ về điều khó nói', 'Gợi ý một lời mở đầu nhẹ nhàng để bắt đầu cuộc trò chuyện khó.', 'Nói về áp lực, thay đổi cơ thể hay một nỗi lo lắng không hề dễ.\nBạn có thể bắt đầu bằng một câu ngắn, chọn lúc mọi người đang bình tĩnh và nói rõ điều bạn đang cần.\nNếu khó nói trực tiếp, viết ra trước cũng là một cách tốt.', 'Gia đình', '2025-02-03', 6, '<3'),
  ('ranh-gioi-ca-nhan-la-gi', 'Ranh giới cá nhân là gì?', 'Hiểu đúng về ranh giới để biết cách tự tôn trọng và bảo vệ mình.', 'Ranh giới là những điều khiến bạn thấy an toàn và được tôn trọng.\nBài viết đưa ví dụ về giao tiếp, đụng chạm, mật khẩu và việc chia sẻ hình ảnh.\nBạn có quyền nói không với điều khiến mình không thoải mái.', 'Kỹ năng sống', '2025-02-18', 5, '[!]'),
  ('lam-sao-de-ngu-ngon-hon', 'Làm sao để ngủ ngon hơn?', 'Ngủ đủ và đúng giờ giúp tâm trạng và trí nhớ ổn định hơn.', 'Ngủ không chỉ là nghỉ ngơi mà còn là thời gian để cơ thể và trí não phục hồi.\nGiảm thời gian dùng điện thoại trước khi ngủ, uống đủ nước và tránh thức khuya sát ngày kiểm tra đều rất hữu ích.\nThói quen nhỏ lặp lại mỗi ngày sẽ tạo khác biệt lớn.', 'Sức khỏe', '2025-03-01', 4, 'zzz'),
  ('khi-nao-can-tim-nguoi-ho-tro', 'Khi nào cần tìm người hỗ trợ?', 'Một số dấu hiệu cho thấy bạn nên nói với người lớn đáng tin.', 'Nếu lo lắng kéo dài, bị cô lập, mất ngủ hoặc có suy nghĩ tiêu cực lặp lại, bạn không nên giữ một mình.\nMột cuộc trò chuyện đúng lúc với người lớn đáng tin có thể giúp bạn an toàn hơn.\nTìm hỗ trợ không phải là yếu đuối mà là biết bảo vệ bản thân.', 'Hỗ trợ', '2025-03-12', 5, ':(');

insert into games (slug, title, summary, description, game_type, play_path, cover_image, accent_color, is_published)
values
  ('quiz-quick', 'Quiz nhanh 10 câu', 'Một lượt chơi gọn để kiểm tra kiến thức và cộng điểm cá nhân.', 'Chế độ quiz nhanh được rút gọn trong 10 câu hỏi ngẫu nhiên từ ngân hàng câu hỏi.\nNgười chơi đi hết lượt mà không bị dừng lại khi sai.\nKết quả sau mỗi lượt được cộng vào tổng điểm quiz và cập nhật streak tương tác.', 'QUIZ', '/games/quiz?mode=quick', 'hero-illustration.png', '#9b5de5', true),
  ('quiz-long', 'Quiz dài 30 câu', 'Chế độ dài dành cho người muốn luyện tập sâu hơn và đưa lên bảng xếp hạng.', 'Chế độ quiz dài lấy 30 câu hỏi ngẫu nhiên từ quiz bank.\nCàng làm nhiều, điểm cá nhân và streak càng được cập nhật rõ hơn.\nĐây là chế độ chính để nhận biết mức độ hiểu bài và giữ nhịp học đều.', 'QUIZ', '/games/quiz?mode=long', 'hero-illustration.png', '#f15bb5', true),
  ('anh-sang-tu-tin', 'Ánh sáng tự tin', 'Mini game phong cách flash nhẹ nhàng, hợp chủ đề tuổi teen và xây dựng tự tin.', 'Người chơi điều khiển nhân vật thu thập bóng đèn tích cực và tránh đám mây lo âu.\nGame có phong cách HTML vui mắt, nhịp nhanh và phù hợp để chơi trong vài phút nghỉ giải lao.\nTrang game được thiết kế theo hướng flash game nhưng vẫn đồng bộ giao diện chung của EDUcare.', 'FLASH', '/games/flash-light-run', 'hero-illustration.png', '#00bbbf', true);

insert into quiz_questions (slug, prompt, category, difficulty, question_type, options_json, correct_index, explanation, sort_order, is_active)
with recursive seq(n) as (
  select 1
  union all
  select n + 1 from seq where n < 100
)
select
  concat('quiz-bank-', lpad(n, 3, '0')) as slug,
  case mod(n, 10)
    when 1 then concat('Khi cảm thấy áp lực trước một bài kiểm tra, lựa chọn nào giúp bạn bình tĩnh hơn? #', n)
    when 2 then concat('Nếu một người bạn khuyên bạn làm điều khiến bạn không thoải mái, bạn nên ưu tiên điều gì? #', n)
    when 3 then concat('Thói quen nào giúp tâm trạng ổn định hơn trong một tuần học bận rộn? #', n)
    when 4 then concat('Khi gặp nội dung xấu trên mạng, phản ứng an toàn nhất là gì? #', n)
    when 5 then concat('Nếu muốn bắt đầu nói chuyện với bố mẹ về một điều khó nói, bạn nên làm gì trước? #', n)
    when 6 then concat('Khi thấy một người bạn buồn nhiều ngày liền, cách đồng hành phù hợp nhất là gì? #', n)
    when 7 then concat('Dấu hiệu nào cho thấy bạn nên tạm dừng để nghỉ ngơi và chăm sóc bản thân? #', n)
    when 8 then concat('Khi cần đặt ranh giới trong giao tiếp, câu nói nào rõ ràng và tôn trọng hơn? #', n)
    when 9 then concat('Nếu bạn quen một người trên mạng và họ xin thông tin riêng, bạn nên xử lý ra sao? #', n)
    else concat('Mục tiêu nào dưới đây phù hợp nhất để xây dựng sự tự tin bền vững? #', n)
  end as prompt,
  case mod(n, 5)
    when 1 then 'Cảm xúc'
    when 2 then 'Tình bạn và ranh giới'
    when 3 then 'Học tập và sức khỏe'
    when 4 then 'An toàn trên mạng'
    else 'Tự tin và hỗ trợ'
  end as category,
  case mod(n, 3)
    when 1 then 'Cơ bản'
    when 2 then 'Trung bình'
    else 'Nâng cao'
  end as difficulty,
  'MULTIPLE_CHOICE' as question_type,
  case mod(n, 10)
    when 1 then '["Cố thức thêm cho đến lúc quá mệt","Hít thở sâu, chia nhỏ việc cần làm và bắt đầu từng bước","Tự trách mình vì chưa giỏi","Bỏ bữa để học cho nhanh"]'
    when 2 then '["Làm theo để khỏi mất bạn","Nói rõ ràng điều mình không đồng ý và giữ ranh giới","Im lặng rồi khó chịu một mình","Đăng lên mạng để đáp trả"]'
    when 3 then '["Ngủ đủ, ăn đều và có khoảng nghỉ ngắn","Lướt điện thoại đến khuya mỗi ngày","Bỏ ăn sáng để đi học sớm","Làm hết mọi việc trong một lần"]'
    when 4 then '["Chia sẻ thêm cho người khác cùng xem","Chụp màn hình, chặn tài khoản và báo cho người lớn đáng tin","Trả lời để đôi co","Xóa ngay và coi như không có gì"]'
    when 5 then '["Chờ đến khi quá bức bối mới nói","Viết ra điều muốn nói và chọn lúc mọi người bình tĩnh","Kể với tất cả mọi người trên lớp","Im lặng vì sợ bị đánh giá"]'
    when 6 then '["Bắt bạn đó vui lên ngay","Lắng nghe, hỏi thăm và khuyên bạn tìm thêm người hỗ trợ nếu cần","Nói là ai cũng từng như vậy","Kể chuyện của bạn mình cho cả lớp nghe"]'
    when 7 then '["Cố gắng thêm dù không tập trung","Nghỉ ngắn, uống nước và trở về với nhiệm vụ sau khi ổn định hơn","Bỏ hết lịch học trong một tháng","Tự phạt mình bằng cách thức trắng đêm"]'
    when 8 then '["Bạn làm gì cũng được, mình không ý kiến","Mình không thoải mái với điều này, mong bạn dừng lại","Nếu thích thì cứ làm","Để mình xem đã"]'
    when 9 then '["Gửi ngay để đổi lại sự tin tưởng","Không chia sẻ thông tin riêng và nói với người lớn đáng tin nếu thấy bất ổn","Hẹn gặp mặt riêng để nói chuyện nhanh hơn","Đưa thêm tài khoản của bạn bè cho họ"]'
    else '["So sánh mình với mọi người xung quanh","Đặt mục tiêu vừa sức và ghi nhận tiến bộ nhỏ mỗi ngày","Chỉ đăng ảnh để được khen","Không bao giờ mắc sai lầm"]'
  end as options_json,
  1 as correct_index,
  case mod(n, 10)
    when 1 then 'Cách hiệu quả nhất là làm nhỏ vấn đề, hít thở đều và bắt đầu từ việc dễ nhất.'
    when 2 then 'Tôn trọng bản thân bắt đầu từ việc nói rõ ràng ranh giới của mình.'
    when 3 then 'Cơ thể và trí não cần nhịp sinh hoạt đều để học tốt và giữ tâm trạng ổn định.'
    when 4 then 'An toàn trên mạng luôn cần bước báo cáo và tìm người hỗ trợ đáng tin.'
    when 5 then 'Chuẩn bị trước giúp cuộc trò chuyện dễ bắt đầu hơn và bớt bị rối.'
    when 6 then 'Lắng nghe và đồng hành nhẹ nhàng thường hữu ích hơn việc ép người khác phải vui lên ngay.'
    when 7 then 'Nghỉ đúng lúc là một kỹ năng chăm sóc bản thân quan trọng.'
    when 8 then 'Đặt ranh giới nên ngắn gọn, lịch sự và rõ ràng.'
    when 9 then 'Thông tin cá nhân cần được bảo vệ, nhất là với người lạ trên mạng.'
    else 'Sự tự tin bền vững đến từ việc tiến bộ đều, không phải từ việc ganh đua.'
  end as explanation,
  n as sort_order,
  true as is_active
from seq;

insert into chat_rooms (slug, name, description)
values
  ('crew-bot', 'crewBot', 'Không gian chat riêng với trợ lý đồng hành của EDUcare.'),
  ('teen-talk', 'Chuyện tuổi teen', 'Nơi trò chuyện về học tập, cảm xúc và những điều đang diễn ra mỗi ngày.'),
  ('study-buddies', 'Bạn học cùng', 'Không gian để chia sẻ cách ôn bài, ghi chú và động viên nhau.'),
  ('safe-space', 'Góc an toàn', 'Phòng chat nhẹ nhàng để tìm sự lắng nghe và những lời nhắc tích cực.');
