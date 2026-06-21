export interface Myth {
  id: number;
  statement: string;
  isTrue: boolean;
  explanation: string;
  category: string;
}

export const ALL_MYTHS: Myth[] = [
  // Dậy thì & cơ thể
  {
    id: 1,
    statement: "Mụn trứng cá xuất hiện ở tuổi dậy thì là hoàn toàn bình thường.",
    isTrue: true,
    explanation: "Hormone tăng mạnh ở tuổi dậy thì làm tuyến bã nhờn hoạt động nhiều hơn, dẫn đến mụn. Đây là phần tự nhiên của sự phát triển.",
    category: "Cơ thể",
  },
  {
    id: 2,
    statement: "Ăn sô-cô-la và thức ăn dầu mỡ là nguyên nhân chính gây mụn.",
    isTrue: false,
    explanation: "Thực tế, mụn chủ yếu do hormone và vi khuẩn gây ra. Chế độ ăn có ảnh hưởng nhỏ, nhưng không phải nguyên nhân chính.",
    category: "Cơ thể",
  },
  {
    id: 3,
    statement: "Con gái có thể phát triển ngực từ khoảng 8–13 tuổi.",
    isTrue: true,
    explanation: "Sự phát triển ngực thường bắt đầu trong khoảng này và là dấu hiệu đầu tiên của dậy thì ở nữ. Mỗi người có tốc độ khác nhau.",
    category: "Cơ thể",
  },
  {
    id: 4,
    statement: "Cơ thể ngừng phát triển chiều cao ngay sau khi đến 'tháng' lần đầu.",
    isTrue: false,
    explanation: "Sau kỳ kinh nguyệt đầu tiên, cơ thể vẫn có thể cao thêm 5–7 cm hoặc hơn trong vài năm tiếp theo.",
    category: "Cơ thể",
  },
  {
    id: 5,
    statement: "Nam giới có thể bắt đầu dậy thì từ 9 tuổi và đây là bình thường.",
    isTrue: true,
    explanation: "Tuổi dậy thì ở nam có thể bắt đầu từ 9–14 tuổi. Sự đa dạng này hoàn toàn bình thường về mặt sinh học.",
    category: "Cơ thể",
  },
  {
    id: 6,
    statement: "Cạo lông khiến lông mọc lại nhiều hơn và cứng hơn.",
    isTrue: false,
    explanation: "Đây là quan niệm sai. Cạo lông không thay đổi số lượng hay độ cứng của lông. Lông trông có vẻ cứng hơn vì đầu bị cắt phẳng.",
    category: "Cơ thể",
  },
  {
    id: 7,
    statement: "Kinh nguyệt không đều ở vài năm đầu là điều bình thường.",
    isTrue: true,
    explanation: "Trong 2–3 năm đầu sau kỳ kinh nguyệt đầu tiên, chu kỳ có thể không đều vì cơ thể đang điều chỉnh hormone.",
    category: "Cơ thể",
  },
  {
    id: 8,
    statement: "Mộng tinh (xuất tinh khi ngủ) là dấu hiệu bất thường ở nam giới tuổi teen.",
    isTrue: false,
    explanation: "Mộng tinh là hiện tượng hoàn toàn bình thường và phổ biến ở nam giới trong giai đoạn dậy thì. Đây không phải bệnh.",
    category: "Cơ thể",
  },

  // Cảm xúc & tâm lý
  {
    id: 9,
    statement: "Cảm xúc thay đổi thất thường ở tuổi teen có liên quan đến hormone.",
    isTrue: true,
    explanation: "Hormone dậy thì tác động trực tiếp đến não và hệ thần kinh, gây ra những biến động cảm xúc khá rõ rệt.",
    category: "Cảm xúc",
  },
  {
    id: 10,
    statement: "Buồn hoặc khóc nhiều luôn có nghĩa là bạn bị trầm cảm.",
    isTrue: false,
    explanation: "Buồn là cảm xúc bình thường. Trầm cảm được chẩn đoán khi cảm giác đó kéo dài trên 2 tuần và ảnh hưởng đến sinh hoạt hàng ngày.",
    category: "Cảm xúc",
  },
  {
    id: 11,
    statement: "Stress kéo dài có thể ảnh hưởng xấu đến hệ miễn dịch và sức khỏe thể chất.",
    isTrue: true,
    explanation: "Căng thẳng mãn tính làm tăng cortisol, gây suy giảm miễn dịch, đau đầu và rối loạn giấc ngủ.",
    category: "Cảm xúc",
  },
  {
    id: 12,
    statement: "Tìm đến chuyên gia tâm lý là dấu hiệu của sự yếu đuối.",
    isTrue: false,
    explanation: "Tìm kiếm sự hỗ trợ chuyên nghiệp khi cần là hành động dũng cảm và thông minh, giống như đi khám bác sĩ khi ốm.",
    category: "Cảm xúc",
  },

  // Mối quan hệ & đồng thuận
  {
    id: 13,
    statement: "Đồng thuận phải được thể hiện rõ ràng, không thể giả định.",
    isTrue: true,
    explanation: "Sự đồng ý phải được bày tỏ rõ ràng bằng lời nói hoặc hành động. Im lặng không có nghĩa là đồng ý.",
    category: "Quan hệ",
  },
  {
    id: 14,
    statement: "Nếu ai đó không nói 'không', tức là họ đã đồng ý.",
    isTrue: false,
    explanation: "Thiếu từ chối không phải là sự đồng ý. Người ta có thể im lặng vì sợ hãi, bị ép buộc hoặc không thoải mái nói ra.",
    category: "Quan hệ",
  },
  {
    id: 15,
    statement: "Bạn có quyền thay đổi ý kiến và rút lại sự đồng ý bất cứ lúc nào.",
    isTrue: true,
    explanation: "Sự đồng ý có thể bị thu hồi bất kỳ lúc nào. Không ai có quyền tiếp tục khi đối phương đã nói không.",
    category: "Quan hệ",
  },
  {
    id: 16,
    statement: "Ghen tuông là bằng chứng của tình yêu thật sự.",
    isTrue: false,
    explanation: "Ghen tuông quá mức thường là dấu hiệu của sự kiểm soát và thiếu tin tưởng, không phải tình yêu lành mạnh.",
    category: "Quan hệ",
  },
  {
    id: 17,
    statement: "Đặt mật khẩu mạng xã hội của mình cho người yêu xem là vi phạm ranh giới cá nhân.",
    isTrue: true,
    explanation: "Mật khẩu là thông tin riêng tư. Trong một mối quan hệ lành mạnh, không ai nên ép buộc người kia chia sẻ thông tin đăng nhập.",
    category: "Quan hệ",
  },

  // An toàn số
  {
    id: 18,
    statement: "Chia sẻ vị trí thật của mình với người lạ trên mạng là an toàn nếu họ trông có vẻ tốt bụng.",
    isTrue: false,
    explanation: "Trên mạng, bạn không thể xác minh danh tính thật của ai. Không bao giờ chia sẻ vị trí thật với người lạ.",
    category: "An toàn số",
  },
  {
    id: 19,
    statement: "Một khi đã đăng ảnh lên mạng, rất khó để xóa hoàn toàn.",
    isTrue: true,
    explanation: "Ảnh có thể được chụp màn hình, lưu và chia sẻ lại trước khi bạn kịp xóa. Dấu chân số tồn tại lâu dài.",
    category: "An toàn số",
  },
  {
    id: 20,
    statement: "Tài khoản mạng xã hội đặt chế độ riêng tư là hoàn toàn an toàn.",
    isTrue: false,
    explanation: "Chế độ riêng tư giới hạn ai xem được, nhưng bạn bè trong danh sách vẫn có thể chụp màn hình và chia sẻ nội dung.",
    category: "An toàn số",
  },
  {
    id: 21,
    statement: "Bắt nạt trực tuyến (cyberbullying) có thể gây hại tâm lý nghiêm trọng như bắt nạt trực tiếp.",
    isTrue: true,
    explanation: "Nghiên cứu cho thấy cyberbullying gây ra lo âu, trầm cảm và cô lập xã hội tương đương hoặc nghiêm trọng hơn bắt nạt trực tiếp.",
    category: "An toàn số",
  },

  // Sức khỏe giới tính
  {
    id: 22,
    statement: "Giáo dục giới tính giúp học sinh có kiến thức để bảo vệ bản thân tốt hơn.",
    isTrue: true,
    explanation: "Nghiên cứu toàn cầu cho thấy giáo dục giới tính toàn diện giúp học sinh đưa ra quyết định an toàn và có trách nhiệm hơn.",
    category: "Giới tính",
  },
  {
    id: 23,
    statement: "Chỉ phụ nữ mới cần quan tâm đến sức khỏe sinh sản.",
    isTrue: false,
    explanation: "Sức khỏe sinh sản là vấn đề của tất cả mọi người, bất kể giới tính. Nam giới cũng cần hiểu về cơ thể và trách nhiệm của mình.",
    category: "Giới tính",
  },
  {
    id: 24,
    statement: "Việc tự khám phá cơ thể của mình ở tuổi teen là điều tự nhiên và lành mạnh.",
    isTrue: true,
    explanation: "Tìm hiểu về cơ thể của mình là một phần bình thường của sự phát triển. Điều quan trọng là hiểu đúng và không có cảm giác xấu hổ không cần thiết.",
    category: "Giới tính",
  },
  {
    id: 25,
    statement: "Người trẻ không thể bị ảnh hưởng bởi áp lực tình dục từ bạn bè.",
    isTrue: false,
    explanation: "Áp lực bạn bè là một trong những yếu tố ảnh hưởng lớn nhất đến quyết định của người trẻ. Điều quan trọng là nhận ra và biết nói không.",
    category: "Giới tính",
  },

  // Kỹ năng sống
  {
    id: 26,
    statement: "Xin lỗi khi làm sai là dấu hiệu của sự trưởng thành và dũng cảm.",
    isTrue: true,
    explanation: "Nhận ra lỗi lầm và xin lỗi thể hiện sự trưởng thành về cảm xúc. Đây là kỹ năng quan trọng trong mọi mối quan hệ.",
    category: "Kỹ năng sống",
  },
  {
    id: 27,
    statement: "Nếu bạn tốt với ai đó, họ phải tốt lại với bạn — đó là nghĩa vụ.",
    isTrue: false,
    explanation: "Lòng tốt không tạo ra nghĩa vụ. Mỗi người có quyền tự do trong mối quan hệ. Mong đợi như vậy có thể dẫn đến thao túng.",
    category: "Kỹ năng sống",
  },
  {
    id: 28,
    statement: "Nói không với điều bạn không muốn làm là quyền của bạn.",
    isTrue: true,
    explanation: "Từ chối là kỹ năng cần thiết để bảo vệ sức khỏe tinh thần và thể chất. Bạn không cần giải thích dài dòng khi từ chối.",
    category: "Kỹ năng sống",
  },
  {
    id: 29,
    statement: "Người hướng nội thì không thể là người lãnh đạo tốt.",
    isTrue: false,
    explanation: "Nhiều nhà lãnh đạo thành công là người hướng nội. Kỹ năng lãnh đạo không phụ thuộc vào tính cách hướng nội hay hướng ngoại.",
    category: "Kỹ năng sống",
  },
  {
    id: 30,
    statement: "Ngủ đủ 8 tiếng mỗi đêm giúp cải thiện trí nhớ và hiệu quả học tập.",
    isTrue: true,
    explanation: "Giấc ngủ là thời gian não củng cố ký ức và học hỏi. Thiếu ngủ làm giảm khả năng tập trung và ghi nhớ đáng kể.",
    category: "Kỹ năng sống",
  },
];

export const MYTH_CATEGORIES = [...new Set(ALL_MYTHS.map((m) => m.category))];
