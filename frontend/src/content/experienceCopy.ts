export const HOME_COPY = {
  eyebrow: "EDUcare cho sức khỏe tinh thần tuổi teen",
  titleLine1: "Hiểu mình hơn,",
  titleLine2: "tự tin lớn lên.",
  description:
    "EDUcare là không gian học tập và đồng hành dành cho tuổi teen, nơi bạn có thể tìm hiểu cảm xúc, kỹ năng sống và cách chăm sóc bản thân theo cách an toàn, gần gũi.",
  primaryActionLoggedIn: "Vào bảng điều khiển",
  primaryActionGuest: "Bắt đầu miễn phí",
  secondaryAction: "Xem khóa học",
  stats: [
    { value: "10+", label: "Bài học" },
    { value: "6", label: "Bài viết" },
    { value: "4", label: "Nhóm chat" },
  ],
  heroNoteTitle: "Không gian đồng hành",
  heroNoteDescription: "Nội dung gần gũi, trình bày nhẹ nhàng và phù hợp với hành trình lớn lên của học sinh.",
  toolsTitle: "Công cụ đồng hành",
  toolsDescription:
    "Theo dõi cảm xúc, gửi câu hỏi ẩn danh và nhận những lời nhắc ngắn gọn để chăm sóc bản thân mỗi ngày.",
  reasonsTitle: "Vì sao EDUcare dễ đồng hành",
  reasonsDescription:
    "Mọi nội dung đều hướng tới sự gần gũi, dễ tiếp cận và phù hợp với học sinh đang trong giai đoạn lớn lên.",
  features: [
    {
      title: "Bài học có cấu trúc",
      description: "Nội dung được chia thành từng chủ đề rõ ràng để bạn dễ theo dõi và áp dụng vào đời sống hằng ngày.",
    },
    {
      title: "An toàn và kín đáo",
      description: "Những điều khó nói vẫn có thể được chia sẻ theo cách nhẹ nhàng, tôn trọng và phù hợp với tuổi teen.",
    },
    {
      title: "Cộng đồng tương tác",
      description: "Trò chơi, thảo luận và nhóm chat giúp việc học trở nên gần gũi hơn, bớt áp lực hơn.",
    },
    {
      title: "Có người đồng hành",
      description: "EDUcare khuyến khích bạn tìm đến người lớn đáng tin cậy khi cần thêm sự lắng nghe và hỗ trợ.",
    },
    {
      title: "Nội dung thân thiện",
      description: "Cách trình bày nhẹ nhàng, tích cực và gần gũi để bạn thấy an tâm khi bắt đầu tìm hiểu.",
    },
  ],
  bottomTitle: "Không gian học tập thân thiện",
  bottomDescription:
    "Từ khóa học, bài viết đến cộng đồng, mọi phần trên EDUcare đều được sắp xếp để bạn dễ theo dõi, dễ quay lại và luôn có chỗ để hỏi khi cần.",
  sideAdTitle: "Góc nội dung bên cạnh",
} as const;

export const MOOD_TRACKER_COPY = {
  title: "Theo dõi cảm xúc",
  descriptionLoggedIn: "Chọn nhanh tâm trạng hôm nay để lưu lại nhịp cảm xúc của riêng bạn.",
  descriptionGuest: "Đăng nhập để lưu lại cảm xúc hằng ngày và xem những thay đổi của mình.",
  emptyStateLoggedIn: "Chọn một biểu tượng phù hợp với cảm xúc hôm nay để bắt đầu lưu lại.",
  saved: "Đã lưu cảm xúc hôm nay.",
  saveError: "Không thể lưu cảm xúc lúc này.",
  recentTitle: "7 ngày gần đây",
  updatedPrefix: "Lần cập nhật gần nhất",
  loginHint: "Đăng nhập để bắt đầu lưu cảm xúc.",
  moods: [
    {
      code: "HAPPY",
      label: "Rất vui",
      shortLabel: "Vui",
      advice: "Giữ lại khoảnh khắc tích cực này bằng một việc nhỏ khiến bạn thấy biết ơn.",
    },
    {
      code: "OKAY",
      label: "Ổn định",
      shortLabel: "Ổn",
      advice: "Một ngày ổn định cũng rất đáng quý. Hãy tiếp tục giữ nhịp học tập và nghỉ ngơi cân bằng.",
    },
    {
      code: "NEUTRAL",
      label: "Bình thường",
      shortLabel: "Bình thường",
      advice: "Nếu thấy hơi trống rỗng, hãy thử đi bộ ngắn hoặc làm một việc nhỏ khiến bạn dễ chịu hơn.",
    },
    {
      code: "SAD",
      label: "Buồn",
      shortLabel: "Buồn",
      advice: "Buồn là cảm xúc bình thường. Nếu cần, hãy tìm một người bạn tin cậy để trò chuyện.",
    },
    {
      code: "ANXIOUS",
      label: "Lo lắng",
      shortLabel: "Lo",
      advice: "Hít vào chậm, thở ra dài và tạm dừng vài phút có thể giúp cơ thể dịu lại hơn.",
    },
  ],
} as const;

export const ANONYMOUS_INBOX_COPY = {
  title: "Hộp thư ẩn danh",
  badge: "Ẩn danh",
  description:
    "Đặt câu hỏi tại đây. Khi có phản hồi, câu trả lời sẽ được gửi vào mục thông báo cá nhân của bạn.",
  placeholderLoggedIn: "Nhập điều bạn đang băn khoăn...",
  placeholderGuest: "Đăng nhập để gửi câu hỏi ẩn danh...",
  submit: "Gửi câu hỏi",
  submitting: "Đang gửi...",
  success: "Câu hỏi đã được gửi. Bạn có thể xem phản hồi ở mục thông báo.",
  sendError: "Không thể gửi câu hỏi lúc này.",
  helperTitle: "Ghi chú",
  helperItems: [
    "Nếu bạn đang cần hỗ trợ gấp, hãy tìm đến người lớn đáng tin cậy hoặc kênh hỗ trợ phù hợp gần bạn.",
  ],
  viewProfile: "Mở hồ sơ cá nhân",
} as const;

export const RANDOM_ADVICE_COPY = {
  title: "Gợi ý hôm nay",
  description: "Nhấn nút để nhận một lời nhắc ngắn, tích cực và dễ áp dụng trong ngày.",
  button: "Nhận gợi ý",
  spinning: "Đang chọn...",
  advices: [
    { text: "Uống đủ nước và nghỉ giữa giờ giúp cơ thể tỉnh táo hơn khi học.", category: "Sức khỏe" },
    { text: "Nói “không” với điều khiến bạn không thoải mái là một quyền rất quan trọng.", category: "Kỹ năng sống" },
    { text: "Ngủ đủ giấc giúp việc học và điều chỉnh cảm xúc ổn định hơn.", category: "Sức khỏe" },
    { text: "Viết ra ba điều tốt đã xảy ra hôm nay có thể giúp tâm trạng nhẹ hơn.", category: "Tinh thần" },
    { text: "Sai lầm không làm bạn kém đi. Đó chỉ là một phần của quá trình học hỏi.", category: "Tinh thần" },
    { text: "Đi bộ hoặc vận động nhẹ 20 đến 30 phút có thể giúp giảm căng thẳng rõ rệt.", category: "Sức khỏe" },
    { text: "Nếu buồn kéo dài, hãy thử nhắn cho một người bạn tin cậy hoặc người thân.", category: "Tinh thần" },
    { text: "Đừng chia sẻ thông tin riêng tư với người lạ trên mạng, kể cả khi họ tỏ ra thân thiện.", category: "An toàn" },
    { text: "Đừng so sánh bản thân quá nhiều với hình ảnh trên mạng xã hội.", category: "Tinh thần" },
    { text: "Ăn sáng đều đặn giúp bạn dễ tập trung hơn trong giờ học.", category: "Sức khỏe" },
  ],
} as const;

export const PROFILE_COPY = {
  loading: "Đang tải hồ sơ...",
  loadError: "Không thể tải hồ sơ lúc này.",
  title: "Hồ sơ cá nhân",
  subtitle: "Theo dõi thông tin tài khoản và xem phản hồi riêng cho các câu hỏi ẩn danh của bạn.",
  stats: {
    email: "Email",
    age: "Tuổi",
    plan: "Gói",
    xp: "XP",
  },
  plans: {
    free: "Miễn phí",
    popular: "Phổ biến",
    premium: "Cao cấp",
  },
  inboxTitle: "Phản hồi cho câu hỏi ẩn danh",
  inboxDescription: "Những câu trả lời dành riêng cho bạn sẽ xuất hiện tại đây dưới dạng thông báo cá nhân.",
  emptyInbox: "Chưa có phản hồi nào. Khi bạn gửi câu hỏi ẩn danh, câu trả lời sẽ hiện ở đây.",
  allNotificationsTitle: "Thông báo khác",
  emptyNotifications: "Hiện chưa có thông báo nào khác.",
  answerBadge: "Phản hồi riêng",
  generalBadge: "Thông báo",
} as const;

export const AD_SLOT_COPY = {
  eyebrow: "Nội dung gợi ý",
  description: "Có thể dùng cho banner cộng đồng, tài liệu đồng hành hoặc thông điệp phù hợp với chủ đề trang.",
} as const;
