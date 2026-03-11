export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  emoji: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Hiểu về tuổi dậy thì',
    excerpt: 'Tuổi dậy thì là giai đoạn quan trọng trong cuộc đời mỗi người.',
    category: 'Sức khỏe',
    date: '2024-01-15',
    readTime: '5 phút',
    emoji: '🌱',
    content: `Tuổi dậy thì là giai đoạn quan trọng trong cuộc đời mỗi người. Đây là thời điểm cơ thể phát triển nhanh chóng và nhiều thay đổi xảy ra cả về thể chất lẫn tinh thần.

Trong giai đoạn này, bạn có thể cảm thấy bối rối trước những thay đổi của cơ thể. Đây là điều hoàn toàn bình thường. Mỗi người trải qua tuổi dậy thì theo cách riêng, và không có gì phải lo lắng nếu bạn phát triển sớm hơn hoặc muộn hơn so với bạn bè.

Điều quan trọng là bạn cần hiểu rằng những thay đổi này là tự nhiên và cần thiết cho sự trưởng thành.`,
  },
  {
    id: 'blog-2',
    title: 'Cách quản lý stress tuổi teen',
    excerpt: 'Stress có thể đến từ học tập, bạn bè hoặc gia đình.',
    category: 'Tinh thần',
    date: '2024-01-20',
    readTime: '4 phút',
    emoji: '🧘',
    content: `Stress có thể đến từ học tập, bạn bè hoặc gia đình. Học cách quản lý stress giúp bạn cảm thấy tốt hơn và sống vui vẻ hơn.

Một số cách giảm stress hiệu quả:
• Tập thể dục đều đặn — chỉ cần 30 phút đi bộ mỗi ngày
• Ngủ đủ giấc — ít nhất 8 tiếng mỗi đêm
• Nói chuyện với người thân về những lo lắng
• Hít thở sâu khi cảm thấy căng thẳng
• Dành thời gian cho sở thích cá nhân

Nhớ rằng: Stress là điều bình thường, nhưng nếu bạn cảm thấy quá áp lực, hãy tìm sự giúp đỡ.`,
  },
  {
    id: 'blog-3',
    title: 'Tự tin trong tuổi teen',
    excerpt: 'Sự tự tin giúp bạn dám thử những điều mới.',
    category: 'Kỹ năng sống',
    date: '2024-02-01',
    readTime: '3 phút',
    emoji: '💪',
    content: `Sự tự tin giúp bạn dám thử những điều mới và phát triển bản thân. Không ai sinh ra đã tự tin — đây là kỹ năng có thể học và rèn luyện.

Cách xây dựng sự tự tin:
• Chấp nhận bản thân — cả ưu điểm và khuyết điểm
• Đặt mục tiêu nhỏ và đạt được chúng
• Không so sánh mình với người khác
• Học từ sai lầm thay vì sợ sai
• Nói chuyện tích cực với bản thân

Hãy nhớ: Bạn là duy nhất và có giá trị riêng!`,
  },
  {
    id: 'blog-4',
    title: 'An toàn trên mạng xã hội',
    excerpt: 'Không chia sẻ địa chỉ hoặc thông tin cá nhân với người lạ.',
    category: 'An toàn',
    date: '2024-02-10',
    readTime: '5 phút',
    emoji: '🛡️',
    content: `Mạng xã hội là nơi tuyệt vời để kết nối với bạn bè, nhưng cũng ẩn chứa nhiều rủi ro.

Quy tắc an toàn trên mạng xã hội:
• Không chia sẻ địa chỉ nhà, số điện thoại hoặc tên trường
• Cài đặt chế độ riêng tư cho tài khoản
• Không chấp nhận kết bạn từ người lạ
• Suy nghĩ kỹ trước khi đăng bất cứ điều gì
• Không tải xuống file từ nguồn không tin cậy

Nếu bạn bị bắt nạt trên mạng hoặc gặp tình huống không thoải mái, hãy nói ngay với cha mẹ.`,
  },
  {
    id: 'blog-5',
    title: 'Cách xây dựng tình bạn tốt',
    excerpt: 'Một tình bạn tốt cần sự tôn trọng và tin tưởng.',
    category: 'Quan hệ',
    date: '2024-02-15',
    readTime: '4 phút',
    emoji: '🤝',
    content: `Một tình bạn tốt cần sự tôn trọng và tin tưởng lẫn nhau. Bạn bè là những người đồng hành quan trọng trong cuộc sống.

Đặc điểm của tình bạn lành mạnh:
• Tôn trọng sở thích và ý kiến khác nhau
• Hỗ trợ nhau trong lúc khó khăn
• Vui mừng khi bạn thành công
• Trung thực nhưng tế nhị
• Không ép buộc nhau làm điều sai trái

Nếu một mối quan hệ khiến bạn cảm thấy tệ, hãy dũng cảm nói ra hoặc tìm sự giúp đỡ.`,
  },
  {
    id: 'blog-6',
    title: 'Tại sao giấc ngủ quan trọng?',
    excerpt: 'Ngủ đủ giấc giúp cơ thể phát triển khỏe mạnh.',
    category: 'Sức khỏe',
    date: '2024-03-01',
    readTime: '3 phút',
    emoji: '😴',
    content: `Ngủ đủ giấc giúp cơ thể phát triển khỏe mạnh, đặc biệt trong tuổi dậy thì khi cơ thể cần nhiều năng lượng để phát triển.

Lợi ích của giấc ngủ đủ:
• Giúp não bộ hoạt động tốt hơn
• Cải thiện khả năng tập trung học tập
• Tăng cường hệ miễn dịch
• Hỗ trợ tăng trưởng chiều cao
• Cải thiện tâm trạng

Thiếu niên cần ngủ 8-10 tiếng mỗi đêm. Hãy tạo thói quen ngủ đúng giờ!`,
  },
  {
    id: 'blog-7',
    title: 'Thói quen sống lành mạnh',
    excerpt: 'Ăn uống, vận động và nghỉ ngơi đầy đủ giúp cơ thể khỏe mạnh.',
    category: 'Sức khỏe',
    date: '2024-03-10',
    readTime: '4 phút',
    emoji: '🥗',
    content: `Ăn uống, vận động và nghỉ ngơi đầy đủ giúp cơ thể khỏe mạnh. Đây là ba trụ cột quan trọng cho sức khỏe tuổi teen.

Thói quen tốt cần xây dựng:
• Ăn đa dạng thực phẩm: rau xanh, trái cây, protein
• Uống đủ nước mỗi ngày (ít nhất 2 lít)
• Tập thể dục ít nhất 30 phút mỗi ngày
• Hạn chế đồ ăn nhanh và nước ngọt
• Ngủ đủ giấc và đúng giờ
• Giảm thời gian sử dụng điện thoại`,
  },
  {
    id: 'blog-8',
    title: 'Khi nào nên tìm sự giúp đỡ?',
    excerpt: 'Nếu bạn cảm thấy quá áp lực, hãy tìm sự hỗ trợ.',
    category: 'Tinh thần',
    date: '2024-03-15',
    readTime: '5 phút',
    emoji: '💝',
    content: `Nếu bạn cảm thấy quá áp lực hoặc buồn bã kéo dài, hãy tìm sự hỗ trợ từ người lớn. Đây không phải là điều đáng xấu hổ.

Những dấu hiệu bạn cần tìm sự giúp đỡ:
• Cảm thấy buồn bã kéo dài hơn 2 tuần
• Mất hứng thú với mọi hoạt động
• Khó ngủ hoặc ngủ quá nhiều
• Cảm thấy cô đơn và không ai hiểu mình
• Có suy nghĩ tiêu cực về bản thân

Bạn có thể tìm sự giúp đỡ từ:
• Cha mẹ hoặc người thân
• Thầy cô giáo hoặc cố vấn học tập
• Tổng đài 111 — đường dây bảo vệ trẻ em
• Chuyên gia tâm lý

Hãy nhớ: Tìm sự giúp đỡ là hành động dũng cảm! ❤️`,
  },
];
