export interface EmotionCard {
  id: number;
  label: string;
  emoji: string;
  isHealthy: boolean;
  explanation: string;
  color: string;
}

export const ALL_EMOTION_CARDS: EmotionCard[] = [
  // Lành mạnh
  { id: 1, label: "Tâm sự với bạn thân", emoji: "🗣️", isHealthy: true, explanation: "Chia sẻ cảm xúc với người tin tưởng giúp giảm tải áp lực và cảm thấy được đồng hành.", color: "#06d6a0" },
  { id: 2, label: "Nghe nhạc thư giãn", emoji: "🎵", isHealthy: true, explanation: "Âm nhạc giúp điều tiết cảm xúc và giảm hormone căng thẳng cortisol hiệu quả.", color: "#4361ee" },
  { id: 3, label: "Vận động thể dục", emoji: "🏃", isHealthy: true, explanation: "Tập thể dục giải phóng endorphin — hormone hạnh phúc, giúp cải thiện tâm trạng rõ rệt.", color: "#06d6a0" },
  { id: 4, label: "Viết nhật ký cảm xúc", emoji: "📓", isHealthy: true, explanation: "Ghi chép giúp bạn nhìn nhận cảm xúc rõ ràng hơn và xử lý chúng một cách lành mạnh.", color: "#9b5de5" },
  { id: 5, label: "Ngủ đủ giấc", emoji: "😴", isHealthy: true, explanation: "Giấc ngủ phục hồi năng lượng và giúp não xử lý cảm xúc tiêu cực hiệu quả hơn.", color: "#4361ee" },
  { id: 6, label: "Khóc khi buồn", emoji: "😢", isHealthy: true, explanation: "Khóc là cơ chế giải phóng cảm xúc tự nhiên của cơ thể. Cho phép bản thân khóc là lành mạnh.", color: "#06d6a0" },
  { id: 7, label: "Xin lỗi khi làm sai", emoji: "🙏", isHealthy: true, explanation: "Nhận lỗi và xin lỗi thể hiện sự trưởng thành cảm xúc và giúp hòa giải mối quan hệ.", color: "#9b5de5" },
  { id: 8, label: "Đặt ranh giới rõ ràng", emoji: "✋", isHealthy: true, explanation: "Biết nói không và đặt giới hạn bảo vệ sức khỏe tâm thần và thể chất của bạn.", color: "#4361ee" },
  { id: 9, label: "Tìm kiếm sự giúp đỡ", emoji: "🤝", isHealthy: true, explanation: "Nhờ sự hỗ trợ khi cần là dấu hiệu của sức mạnh, không phải yếu đuối.", color: "#06d6a0" },
  { id: 10, label: "Hít thở sâu khi tức giận", emoji: "🧘", isHealthy: true, explanation: "Kỹ thuật thở sâu kích hoạt hệ thần kinh phó giao cảm, giúp bình tĩnh nhanh chóng.", color: "#9b5de5" },
  { id: 11, label: "Vẽ hoặc sáng tạo", emoji: "🎨", isHealthy: true, explanation: "Nghệ thuật là liệu pháp cảm xúc hiệu quả, giúp diễn đạt những điều khó nói thành lời.", color: "#4361ee" },
  { id: 12, label: "Dành thời gian trong tự nhiên", emoji: "🌳", isHealthy: true, explanation: "Tiếp xúc với thiên nhiên giảm cortisol, huyết áp và cải thiện tâm trạng đáng kể.", color: "#06d6a0" },
  { id: 13, label: "Tha thứ cho bản thân", emoji: "💙", isHealthy: true, explanation: "Tự chăm sóc và tha thứ cho bản thân giúp ngăn ngừa cảm giác tội lỗi quá mức gây hại.", color: "#9b5de5" },
  { id: 14, label: "Nói chuyện với chuyên gia tâm lý", emoji: "🧠", isHealthy: true, explanation: "Chuyên gia tâm lý có công cụ và kỹ thuật chuyên biệt để giúp bạn vượt qua khó khăn.", color: "#4361ee" },
  { id: 15, label: "Ăn uống điều độ", emoji: "🥗", isHealthy: true, explanation: "Chế độ ăn lành mạnh cung cấp năng lượng cho não hoạt động tốt và ổn định tâm trạng.", color: "#06d6a0" },
  { id: 16, label: "Nghỉ ngơi khi mệt mỏi", emoji: "☕", isHealthy: true, explanation: "Lắng nghe cơ thể và nghỉ ngơi kịp thời ngăn ngừa kiệt sức và burnout.", color: "#9b5de5" },
  { id: 17, label: "Đặt mục tiêu nhỏ hàng ngày", emoji: "✅", isHealthy: true, explanation: "Hoàn thành các mục tiêu nhỏ tạo cảm giác thành tựu và xây dựng tự tin theo thời gian.", color: "#4361ee" },
  { id: 18, label: "Cảm ơn người giúp đỡ mình", emoji: "🌸", isHealthy: true, explanation: "Thực hành biết ơn giúp chuyển hướng chú ý sang điều tích cực và tăng cảm giác hạnh phúc.", color: "#06d6a0" },
  { id: 19, label: "Giới hạn thời gian dùng điện thoại", emoji: "📵", isHealthy: true, explanation: "Detox digital giúp giảm lo âu, cải thiện giấc ngủ và cho phép bạn hiện diện hơn.", color: "#9b5de5" },
  { id: 20, label: "Vui chơi hoặc chơi thể thao", emoji: "⚽", isHealthy: true, explanation: "Hoạt động vui chơi kích thích não bộ và là cách hiệu quả để giải phóng căng thẳng.", color: "#4361ee" },

  // Không lành mạnh
  { id: 21, label: "Tự làm đau bản thân", emoji: "💢", isHealthy: false, explanation: "Tự làm hại là cơ chế đối phó nguy hiểm. Hãy tìm đến người lớn đáng tin hoặc đường dây hỗ trợ ngay.", color: "#ef4444" },
  { id: 22, label: "Uống rượu để quên", emoji: "🍺", isHealthy: false, explanation: "Rượu bia không giải quyết vấn đề mà tạo ra nhiều hệ quả sức khỏe và pháp lý nghiêm trọng.", color: "#ef4444" },
  { id: 23, label: "Chạy trốn vào game cả ngày", emoji: "🎮", isHealthy: false, explanation: "Dùng game để thoát khỏi thực tế khiến vấn đề tích lũy và tạo thói quen nghiện ngập có hại.", color: "#f97316" },
  { id: 24, label: "Chửi bới người khác khi tức", emoji: "😤", isHealthy: false, explanation: "Xả giận vào người khác gây tổn thương mối quan hệ và không giải quyết cảm xúc gốc rễ.", color: "#ef4444" },
  { id: 25, label: "Không ngủ cả đêm lướt mạng", emoji: "📱", isHealthy: false, explanation: "Thiếu ngủ tác động nghiêm trọng đến sức khỏe tâm thần, trí nhớ và khả năng điều tiết cảm xúc.", color: "#f97316" },
  { id: 26, label: "Bỏ ăn khi stress", emoji: "🚫", isHealthy: false, explanation: "Nhịn ăn khi căng thẳng làm não thiếu glucose, khiến tâm trạng và khả năng phán đoán tệ hơn.", color: "#ef4444" },
  { id: 27, label: "Đổ lỗi cho người khác", emoji: "👉", isHealthy: false, explanation: "Luôn đổ lỗi ngăn bạn nhìn nhận và phát triển từ lỗi lầm của mình.", color: "#f97316" },
  { id: 28, label: "Hút thuốc để giảm stress", emoji: "🚬", isHealthy: false, explanation: "Nicotine gây nghiện nhanh chóng. Cảm giác giảm stress chỉ là tạm thời và tạo ra vòng lặp phụ thuộc.", color: "#ef4444" },
  { id: 29, label: "Giam mình trong phòng không gặp ai", emoji: "🏠", isHealthy: false, explanation: "Cô lập kéo dài là triệu chứng và nguyên nhân của trầm cảm. Kết nối xã hội là nhu cầu thiết yếu.", color: "#f97316" },
  { id: 30, label: "Nói xấu người khác sau lưng", emoji: "🗣️", isHealthy: false, explanation: "Tán gẫu tiêu cực tạm thời cho cảm giác vượt trội nhưng xây dựng thói quen tư duy tiêu cực.", color: "#ef4444" },
  { id: 31, label: "Ăn quá nhiều khi buồn", emoji: "🍰", isHealthy: false, explanation: "'Ăn cảm xúc' che lấp cảm xúc thật sự mà không giải quyết chúng, thường gây hối hận sau đó.", color: "#f97316" },
  { id: 32, label: "Cắt đứt liên lạc với tất cả mọi người", emoji: "📵", isHealthy: false, explanation: "Tự cắt đứt hoàn toàn làm trầm trọng thêm cảm giác cô đơn và khiến bạn mất đi mạng lưới hỗ trợ.", color: "#ef4444" },
  { id: 33, label: "Đọc tin tức tiêu cực mãi", emoji: "📰", isHealthy: false, explanation: "Doomscrolling (xem tin xấu liên tục) kích hoạt phản ứng stress mãn tính và tăng lo âu.", color: "#f97316" },
  { id: 34, label: "So sánh bản thân với người khác trên mạng", emoji: "📊", isHealthy: false, explanation: "Mạng xã hội chỉ hiển thị phần tích cực của cuộc sống người khác. So sánh không công bằng gây hại cho lòng tự trọng.", color: "#ef4444" },
  { id: 35, label: "Kìm nén cảm xúc không cho ai biết", emoji: "🤐", isHealthy: false, explanation: "Kìm nén cảm xúc dài hạn gây ra các vấn đề tâm lý và thể chất nghiêm trọng. Cảm xúc cần được xử lý.", color: "#f97316" },
];

export const EMOTION_CATEGORIES = {
  healthy: ALL_EMOTION_CARDS.filter(c => c.isHealthy),
  unhealthy: ALL_EMOTION_CARDS.filter(c => !c.isHealthy),
};
