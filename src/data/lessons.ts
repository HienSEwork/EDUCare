export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  isFree: boolean;
}

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Tuổi dậy thì là gì?',
    order: 1,
    isFree: true,
    content: `Tuổi dậy thì là giai đoạn cơ thể bắt đầu chuyển từ trẻ em sang người trưởng thành. Đây là một quá trình tự nhiên mà hầu hết mọi người đều trải qua. Trong giai đoạn này, cơ thể có nhiều thay đổi cả về thể chất lẫn cảm xúc.

Thông thường, tuổi dậy thì bắt đầu trong khoảng từ 9 đến 14 tuổi đối với nữ và từ 10 đến 15 tuổi đối với nam. Tuy nhiên, mỗi người phát triển khác nhau nên thời điểm có thể sớm hoặc muộn hơn.

Một trong những nguyên nhân chính gây ra sự thay đổi này là hormone. Hormone là các chất hóa học trong cơ thể giúp điều khiển sự phát triển của nhiều bộ phận khác nhau.

Trong tuổi dậy thì, cơ thể sản xuất nhiều hormone hơn, dẫn đến các thay đổi như:
• Tăng chiều cao nhanh
• Thay đổi giọng nói
• Phát triển cơ bắp
• Thay đổi cảm xúc

Điều quan trọng là mỗi người phát triển theo tốc độ riêng của mình.`,
  },
  {
    id: 'lesson-2',
    title: 'Hormone và sự phát triển',
    order: 2,
    isFree: true,
    content: `Hormone đóng vai trò quan trọng trong quá trình phát triển của cơ thể. Chúng hoạt động giống như những "người đưa tin", giúp truyền tín hiệu giữa các cơ quan.

Trong tuổi dậy thì, hai hormone quan trọng nhất là estrogen và testosterone. Estrogen thường liên quan đến sự phát triển của nữ, còn testosterone liên quan đến sự phát triển của nam.

Khi hormone tăng lên, cơ thể bắt đầu thay đổi nhanh chóng. Điều này hoàn toàn bình thường và là một phần tự nhiên của quá trình trưởng thành.`,
  },
  {
    id: 'lesson-3',
    title: 'Thay đổi cơ thể ở nam',
    order: 3,
    isFree: true,
    content: `Trong tuổi dậy thì, cơ thể nam giới trải qua nhiều thay đổi quan trọng:

• Giọng nói trầm hơn: Dây thanh quản dày lên, khiến giọng nói trở nên trầm hơn.
• Mọc râu: Lông bắt đầu mọc trên mặt, đặc biệt ở vùng cằm và môi trên.
• Cơ bắp phát triển: Cơ thể trở nên khỏe mạnh và cơ bắp hơn.
• Vai rộng hơn: Xương vai phát triển, tạo hình dáng nam tính.

Tất cả những thay đổi này là hoàn toàn bình thường và diễn ra ở mỗi người với tốc độ khác nhau.`,
  },
  {
    id: 'lesson-4',
    title: 'Thay đổi cơ thể ở nữ',
    order: 4,
    isFree: false,
    content: `Các thay đổi phổ biến ở nữ trong tuổi dậy thì:

• Phát triển ngực: Đây thường là dấu hiệu đầu tiên của tuổi dậy thì ở nữ.
• Bắt đầu chu kỳ kinh nguyệt: Chu kỳ kinh nguyệt là một phần tự nhiên của sự phát triển.
• Cơ thể thay đổi hình dáng: Hông rộng hơn, cơ thể phát triển theo hướng nữ tính.

Những thay đổi này có thể khiến bạn cảm thấy bối rối, nhưng hãy nhớ rằng đây là điều hoàn toàn bình thường.`,
  },
  {
    id: 'lesson-5',
    title: 'Thay đổi cảm xúc',
    order: 5,
    isFree: false,
    content: `Trong tuổi dậy thì, cảm xúc có thể thay đổi nhanh chóng và mạnh mẽ. Điều này là bình thường vì hormone ảnh hưởng trực tiếp đến não bộ.

Bạn có thể cảm thấy vui vẻ vào một lúc và buồn bã ngay sau đó. Đôi khi bạn có thể cảm thấy tức giận hoặc bực bội mà không rõ lý do. Tất cả điều này là một phần của quá trình trưởng thành.

Điều quan trọng là học cách nhận biết và quản lý cảm xúc của mình.`,
  },
  {
    id: 'lesson-6',
    title: 'Tự tin về bản thân',
    order: 6,
    isFree: false,
    content: `Học cách chấp nhận cơ thể và tôn trọng bản thân là điều rất quan trọng trong tuổi dậy thì.

Mỗi người đều có vẻ đẹp riêng. Đừng so sánh bản thân với người khác hay với những hình ảnh trên mạng xã hội. Hãy tập trung vào những điểm mạnh của mình.

Cách xây dựng sự tự tin:
• Viết ra những điều bạn thích về bản thân
• Đặt mục tiêu nhỏ và đạt được chúng
• Tập thể dục thường xuyên
• Nói chuyện tích cực với bản thân`,
  },
  {
    id: 'lesson-7',
    title: 'Tình bạn và các mối quan hệ',
    order: 7,
    isFree: false,
    content: `Trong tuổi teen, tình bạn đóng vai trò vô cùng quan trọng. Những người bạn tốt sẽ hỗ trợ, khuyến khích và giúp bạn phát triển.

Dấu hiệu của tình bạn lành mạnh:
• Tôn trọng lẫn nhau
• Hỗ trợ khi gặp khó khăn
• Chấp nhận sự khác biệt
• Không ép buộc nhau làm điều không muốn

Nếu một mối quan hệ khiến bạn cảm thấy không thoải mái, hãy nói chuyện với người lớn đáng tin cậy.`,
  },
  {
    id: 'lesson-8',
    title: 'An toàn trên internet',
    order: 8,
    isFree: false,
    content: `Internet là công cụ tuyệt vời nhưng cũng có nhiều rủi ro. Hãy luôn nhớ những quy tắc an toàn:

• Không chia sẻ thông tin cá nhân (địa chỉ, số điện thoại, trường học) với người lạ
• Không gặp người quen trên mạng ngoài đời thực mà không có sự đồng ý của cha mẹ
• Không đăng ảnh riêng tư lên mạng xã hội
• Luôn suy nghĩ trước khi chia sẻ bất cứ điều gì

Nếu bạn gặp tình huống không thoải mái trên mạng, hãy nói ngay với cha mẹ hoặc thầy cô.`,
  },
  {
    id: 'lesson-9',
    title: 'Quản lý cảm xúc',
    order: 9,
    isFree: false,
    content: `Học cách quản lý cảm xúc là kỹ năng quan trọng giúp bạn sống vui vẻ và khỏe mạnh hơn.

Các cách quản lý cảm xúc hiệu quả:
• Nói chuyện với người tin tưởng: Chia sẻ cảm xúc với cha mẹ, thầy cô hoặc bạn bè thân.
• Tập thể dục: Vận động giúp giảm stress và cải thiện tâm trạng.
• Viết nhật ký: Ghi lại cảm xúc giúp bạn hiểu bản thân hơn.
• Hít thở sâu: Khi cảm thấy căng thẳng, hãy dừng lại và hít thở chậm rãi.
• Nghe nhạc: Âm nhạc có thể giúp thư giãn và cải thiện tâm trạng.`,
  },
  {
    id: 'lesson-10',
    title: 'Tìm kiếm sự giúp đỡ',
    order: 10,
    isFree: false,
    content: `Nếu bạn gặp vấn đề hoặc cảm thấy không ổn, đừng ngại tìm sự giúp đỡ. Đây không phải là điều đáng xấu hổ mà là hành động dũng cảm.

Bạn có thể tìm sự giúp đỡ từ:
• Cha mẹ hoặc người thân: Họ luôn yêu thương và muốn giúp đỡ bạn.
• Thầy cô giáo: Thầy cô có thể lắng nghe và hỗ trợ bạn.
• Chuyên gia tâm lý: Nếu cần, hãy gặp chuyên gia để được tư vấn.
• Đường dây nóng: Tổng đài 111 là đường dây bảo vệ trẻ em quốc gia.

Hãy nhớ: Bạn không bao giờ một mình. Luôn có người sẵn sàng giúp đỡ bạn.`,
  },
];
