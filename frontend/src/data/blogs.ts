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
    id: "blog-1",
    title: "Hiểu về tuổi dậy thì",
    excerpt: "Tuổi dậy thì là giai đoạn quan trọng với nhiều thay đổi về cơ thể và cảm xúc.",
    category: "Sức khỏe",
    date: "2024-01-15",
    readTime: "5 phút",
    emoji: "🌱",
    content: `Tuổi dậy thì là giai đoạn cơ thể phát triển mạnh mẽ và cảm xúc cũng trở nên nhạy hơn.

Nhiều bạn cảm thấy bối rối khi cơ thể thay đổi, nhưng đó là quá trình tự nhiên của sự trưởng thành.

Điều quan trọng là tiếp cận kiến thức đúng để bớt lo lắng và biết cách chăm sóc bản thân.`,
  },
  {
    id: "blog-2",
    title: "Cách quản lý căng thẳng tuổi teen",
    excerpt: "Căng thẳng có thể đến từ học tập, bạn bè, gia đình hoặc kỳ vọng với bản thân.",
    category: "Tinh thần",
    date: "2024-01-20",
    readTime: "4 phút",
    emoji: "🧠",
    content: `Căng thẳng là điều nhiều bạn trẻ gặp phải, nhất là khi có quá nhiều việc phải làm cùng lúc.

Bạn có thể giảm áp lực bằng cách nghỉ ngơi đúng lúc, chia nhỏ công việc và chia sẻ với người đáng tin cậy.

Nếu căng thẳng kéo dài, đừng ngại tìm thêm sự hỗ trợ.`,
  },
  {
    id: "blog-3",
    title: "Tự tin trong tuổi teen",
    excerpt: "Tự tin là kỹ năng có thể rèn luyện, không phải điều chỉ một số người mới có.",
    category: "Kỹ năng sống",
    date: "2024-02-01",
    readTime: "3 phút",
    emoji: "✨",
    content: `Sự tự tin bắt đầu từ việc hiểu bản thân và tôn trọng chính mình.

Bạn không cần phải hoàn hảo mới có giá trị. Những bước tiến nhỏ, đều đặn sẽ giúp bạn mạnh mẽ hơn.

Hãy bắt đầu bằng việc công nhận những điều bạn đã làm được.`,
  },
  {
    id: "blog-4",
    title: "An toàn trên mạng xã hội",
    excerpt: "Giữ an toàn trên mạng bắt đầu từ việc biết mình nên chia sẻ điều gì và với ai.",
    category: "An toàn",
    date: "2024-02-10",
    readTime: "5 phút",
    emoji: "🛡️",
    content: `Mạng xã hội có thể vui và hữu ích, nhưng cũng tiềm ẩn nhiều rủi ro.

Bạn nên cẩn thận với thông tin cá nhân, tin nhắn từ người lạ và các đường link không rõ nguồn gốc.

Nếu gặp tình huống khiến bạn bất an, hãy dừng lại và tìm người lớn hỗ trợ.`,
  },
  {
    id: "blog-5",
    title: "Cách xây dựng tình bạn tốt",
    excerpt: "Một tình bạn tích cực cần sự tôn trọng, lắng nghe và cảm giác an toàn.",
    category: "Quan hệ",
    date: "2024-02-15",
    readTime: "4 phút",
    emoji: "🤝",
    content: `Bạn tốt không phải người luôn giống mình, mà là người khiến mình thấy được tôn trọng.

Trong một tình bạn lành mạnh, cả hai đều có không gian riêng, được lắng nghe và không bị ép buộc.

Nếu một mối quan hệ khiến bạn kiệt sức, có thể đã đến lúc cần đặt lại ranh giới.`,
  },
  {
    id: "blog-6",
    title: "Vì sao giấc ngủ quan trọng?",
    excerpt: "Ngủ đủ giúp não bộ phục hồi, cảm xúc ổn định hơn và học tập hiệu quả hơn.",
    category: "Sức khỏe",
    date: "2024-03-01",
    readTime: "3 phút",
    emoji: "🌙",
    content: `Thiếu ngủ có thể khiến bạn khó tập trung, dễ cáu gắt và mệt mỏi suốt ngày.

Tuổi teen thường cần khoảng 8 đến 10 tiếng ngủ mỗi đêm để cơ thể phục hồi tốt.

Một lịch ngủ đều đặn là nền tảng rất quan trọng cho sức khỏe tinh thần.`,
  },
  {
    id: "blog-7",
    title: "Thói quen sống lành mạnh",
    excerpt: "Ăn uống, vận động và nghỉ ngơi hợp lý là nền tảng cho sức khỏe tuổi teen.",
    category: "Sức khỏe",
    date: "2024-03-10",
    readTime: "4 phút",
    emoji: "🥗",
    content: `Lối sống lành mạnh không cần quá phức tạp. Bạn có thể bắt đầu từ những việc nhỏ như uống đủ nước, vận động thường xuyên và ngủ đúng giờ.

Sự đều đặn quan trọng hơn việc cố gắng quá mức trong vài ngày rồi bỏ dở.

Hãy chọn những thói quen bạn thực sự duy trì được.`,
  },
  {
    id: "blog-8",
    title: "Khi nào nên tìm sự giúp đỡ?",
    excerpt: "Nếu bạn buồn kéo dài hoặc thấy quá tải, việc tìm hỗ trợ là rất cần thiết.",
    category: "Tinh thần",
    date: "2024-03-15",
    readTime: "5 phút",
    emoji: "💬",
    content: `Có những lúc bạn không nên tự chịu đựng một mình.

Nếu cảm xúc tiêu cực kéo dài, mất ngủ hoặc thấy mình không còn hứng thú với cuộc sống thường ngày, hãy tìm người để chia sẻ.

Việc nhờ hỗ trợ đúng lúc có thể tạo ra khác biệt rất lớn.`,
  },
];
