export const NAV_COPY = {
  home: "Trang chủ",
  blog: "Blog",
  blogPosts: "Bài viết",
  courses: "Khóa học",
  community: "Cộng đồng",
  games: "Trò chơi",
  leaderboard: "Bảng xếp hạng",
  discussion: "Thảo luận",
  chat: "Nhóm chat",
  about: "Về chúng tôi",
  intro: "Giới thiệu",
  contact: "Liên hệ",
  login: "Đăng nhập",
  notifications: "Thông báo",
  profile: "Hồ sơ",
  studySpace: "Study space",
  favorites: "Yêu thích",
  settings: "Cài đặt",
  logout: "Đăng xuất",
  admin: "Quản trị",
} as const;

export const LEADERBOARD_PAGE_COPY = {
  eyebrow: "Bảng xếp hạng cộng đồng",
  title: "Giữ streak đều, vững nhịp tiến bộ",
  description:
    "Bảng xếp hạng ưu tiên streak thật của người dùng. Khi nhiều người có cùng streak, tổng điểm quiz sẽ quyết định thứ hạng tiếp theo, còn XP phản ánh quá trình đồng hành lâu dài.",
  playAction: "Bắt đầu chơi ngay",
  formulaTitle: "Cách tính thứ hạng",
  formulaItems: [
    "Chỉ những tài khoản có streak từ 7 ngày trở lên mới xuất hiện trên bảng xếp hạng.",
    "Streak được ưu tiên trước để tôn vinh sự đều đặn trong học tập và tham gia trò chơi.",
    "Nếu cùng streak, tổng điểm quiz sẽ được dùng để phân hạng tiếp theo.",
  ],
  stats: {
    members: "Thành viên",
    topStreak: "Streak cao nhất",
    topScore: "Điểm quiz cao nhất",
  },
  podiumLabels: ["Hạng 1", "Hạng 2", "Hạng 3"],
  currentStreak: "Streak",
  quizScore: "Score",
  xp: "XP",
  listTitle: "Bảng xếp hạng chi tiết",
  listDescription: "Theo dõi vị trí, streak và tổng điểm của những thành viên đang giữ nhịp tốt nhất.",
  loading: "Đang tải bảng xếp hạng...",
  loadError: "Không thể tải bảng xếp hạng lúc này.",
  yourStatsTitle: "Thành tích của bạn",
  yourStatsDescription: "Giữ streak đều mỗi ngày để có mặt trên bảng xếp hạng và tăng cơ hội bứt lên.",
  empty: "Hiện chưa có ai đủ điều kiện streak để vào bảng xếp hạng.",
} as const;

export const COMMUNITY_PAGE_COPY = {
  eyebrow: "Không gian thảo luận",
  title: "Chia sẻ điều bạn đang nghĩ và nhận lại phản hồi tích cực.",
  description:
    "Đây là nơi để học sinh trò chuyện về cảm xúc, học tập, gia đình và những băn khoăn thường ngày trong một không gian tôn trọng, nhẹ nhàng và an toàn.",
} as const;

export const CHAT_PAGE_COPY = {
  eyebrow: "Nhóm chat cộng đồng",
  title: "Chọn nhóm ở bên trái, trò chuyện ở bên phải.",
  description:
    "Mỗi nhóm chat đều lấy dữ liệu thật từ hệ thống. crewBot luôn có sẵn để bạn bắt đầu cuộc trò chuyện ngay cả khi chưa có ai online cùng lúc.",
  empty: "Chưa có tin nhắn nào trong nhóm này. Hãy bắt đầu bằng một lời chào hoặc một câu hỏi ngắn.",
  inputPlaceholder: "Nhập tin nhắn cho nhóm...",
  loginPlaceholder: "Đăng nhập để tham gia trò chuyện...",
  imageAction: "Ảnh",
  audioAction: "Ghi âm",
  stopAudioAction: "Dừng ghi âm",
  sendAction: "Gửi",
  clearAttachment: "Xóa tệp đính kèm",
  attachmentImage: "Ảnh đính kèm",
  attachmentAudio: "Đoạn ghi âm",
  loadRoomsError: "Không thể tải danh sách nhóm chat.",
  loadMessagesError: "Không thể tải tin nhắn.",
  sendError: "Không thể gửi tin nhắn.",
  recordError: "Trình duyệt chưa cho phép micro hoặc thiết bị không hỗ trợ ghi âm.",
  pollingLabel: "Đồng bộ liên tục",
  crewBotLabel: "Trợ lý đồng hành",
} as const;

export const PROFILE_PAGE_COPY = {
  title: "Hồ sơ cá nhân",
  subtitle: "Theo dõi quá trình học tập, các lối vào nhanh và những mục bạn thường dùng nhất.",
  stats: {
    email: "Email",
    age: "Tuổi",
    plan: "Gói",
    xp: "XP",
    streak: "Streak",
    quizScore: "Điểm quiz",
  },
  studySpaceTitle: "Study space",
  studySpaceDescription: "Các lối vào nhanh giúp bạn quay lại bài học, trò chơi và bảng theo dõi cá nhân chỉ với một chạm.",
  favoritesTitle: "Yêu thích",
  favoritesDescription: "Lưu lại những nơi bạn muốn quay lại nhanh trong hành trình học tập cùng EDUcare.",
  settingsTitle: "Cài đặt",
  settingsDescription: "Quản lý trải nghiệm cá nhân và các khu vực bạn thường truy cập trong menu avatar.",
  loading: "Đang tải hồ sơ...",
  loadError: "Không thể tải hồ sơ lúc này.",
  welcomeLabel: "Không gian của bạn",
  anchors: {
    studySpace: "study-space",
    favorites: "favorites",
    settings: "settings",
    notifications: "notifications",
  },
} as const;

export const ABOUT_PAGE_COPY = {
  eyebrow: "Về chúng tôi",
  title: "EDUcare đồng hành cùng tuổi teen bằng nội dung an toàn, gần gũi và tích cực.",
  description:
    "EDUcare được xây dựng để giúp học sinh tìm thấy những bài học, bài viết, trò chơi và cộng đồng phù hợp với giai đoạn lớn lên của mình theo cách nhẹ nhàng và dễ tiếp cận hơn.",
  storyTitle: "Vì sao EDUcare xuất hiện",
  story: [
    "Tuổi teen là giai đoạn có nhiều thay đổi cùng lúc về cảm xúc, cơ thể, học tập và các mối quan hệ. Không phải lúc nào cũng dễ để hiểu mình hoặc tìm được nơi phù hợp để hỏi.",
    "EDUcare ra đời để trở thành một không gian dễ tiếp cận hơn, nơi người trẻ có thể học từng bước, đọc nội dung gần gũi, chơi để ôn lại kiến thức và kết nối cùng cộng đồng tích cực.",
    "Mỗi phần trong nền tảng đều được thiết kế để người dùng cảm thấy được đồng hành, không bị choáng ngợp vì quá nhiều thuật ngữ hay áp lực không cần thiết.",
  ],
  missionTitle: "Sứ mệnh",
  mission:
    "Giúp tuổi teen hiểu mình hơn, biết cách chăm sóc bản thân, học những kỹ năng sống cần thiết và tìm được sự đồng hành phù hợp trong các giai đoạn quan trọng.",
  visionTitle: "Tầm nhìn",
  vision:
    "Trở thành một nền tảng đồng hành đáng tin cậy cho học sinh Việt Nam trong hành trình học tập, phát triển và trưởng thành lành mạnh hơn.",
} as const;

export const CONTACT_PAGE_COPY = {
  eyebrow: "Liên hệ",
  title: "Kết nối với EDUcare khi bạn cần thêm thông tin hoặc muốn đồng hành cùng dự án.",
  description:
    "Nếu bạn muốn góp ý nội dung, trao đổi hợp tác hoặc tìm hiểu thêm về cách EDUcare hoạt động, bạn có thể liên hệ qua các kênh dưới đây.",
  cards: [
    {
      title: "Email làm việc",
      value: "hello@educare.vn",
      description: "Phù hợp cho góp ý nội dung, hợp tác truyền thông hoặc các trao đổi chính thức.",
    },
    {
      title: "Hotline",
      value: "1900 6868",
      description: "Kênh liên hệ nhanh cho các câu hỏi chung về nền tảng và cách sử dụng EDUcare.",
    },
    {
      title: "Địa chỉ",
      value: "Quận 1, TP. Hồ Chí Minh",
      description: "Không gian vận hành và phát triển nội dung của EDUcare.",
    },
  ],
  supportTitle: "Khi cần hỗ trợ khẩn cấp",
  supportDescription:
    "EDUcare là nền tảng đồng hành và học tập. Nếu bạn đang ở trong tình huống cần được hỗ trợ ngay, hãy tìm đến người lớn đáng tin cậy hoặc các kênh hỗ trợ phù hợp gần bạn.",
} as const;
