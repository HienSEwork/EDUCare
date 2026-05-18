export const BLOG_PAGE_COPY = {
  eyebrow: "Thư viện bài viết",
  titleLine1: "Hiểu mình vững hơn,",
  titleLine2: "lớn lên tích cực hơn.",
  description:
    "Những bài viết gần gũi giúp bạn chăm sóc cảm xúc, xây dựng sự tự tin, giữ an toàn cho bản thân và phát triển các mối quan hệ lành mạnh.",
  allCategory: "Tất cả",
  readAction: "Xem bài viết",
  listTitle: "Danh sách bài viết",
  listDescription: "Chọn chủ đề bạn quan tâm để đọc nhanh những nội dung phù hợp nhất với mình.",
  empty: "Chưa có bài viết phù hợp với chủ đề này.",
  imageAlt: "Nhóm học sinh đang cùng đọc và trao đổi với nhau",
  loadError: "Không thể tải bài viết lúc này.",
} as const;

export const BLOG_DISPLAY_BY_SLUG = {
  "vi-sao-cam-xuc-thay-doi-nhanh": {
    title: "Vì sao cảm xúc thay đổi nhanh ở tuổi teen?",
    excerpt: "Hiểu vì sao tâm trạng dễ thay đổi và cách lắng nghe bản thân nhẹ nhàng hơn mỗi ngày.",
    category: "Cảm xúc",
  },
  "meo-giam-ap-luc-truoc-kiem-tra": {
    title: "Mẹo giảm áp lực trước kiểm tra",
    excerpt: "Những cách đơn giản giúp bạn ôn bài chắc hơn, bớt cuống và giữ đầu óc tỉnh táo.",
    category: "Học tập",
  },
  "cach-noi-voi-bo-me-ve-dieu-kho-noi": {
    title: "Cách nói với bố mẹ về điều khó nói",
    excerpt: "Gợi ý để bạn bắt đầu một cuộc trò chuyện khó theo cách bình tĩnh, rõ ràng và ít áp lực hơn.",
    category: "Gia đình",
  },
  "ranh-gioi-ca-nhan-la-gi": {
    title: "Ranh giới cá nhân là gì?",
    excerpt: "Biết rõ ranh giới giúp bạn tôn trọng bản thân và an toàn hơn trong các mối quan hệ.",
    category: "Kỹ năng sống",
  },
  "lam-sao-de-ngu-ngon-hon": {
    title: "Làm sao để ngủ ngon hơn?",
    excerpt: "Ngủ đủ và đúng giờ giúp bạn học tốt hơn, ổn định cảm xúc và phục hồi năng lượng.",
    category: "Sức khỏe",
  },
  "khi-nao-can-tim-nguoi-ho-tro": {
    title: "Khi nào nên tìm người hỗ trợ?",
    excerpt: "Nhận ra dấu hiệu cho thấy bạn nên chia sẻ với người lớn đáng tin hoặc chuyên gia.",
    category: "Hỗ trợ",
  },
} as const satisfies Record<string, { title: string; excerpt: string; category: string }>;

export const COURSES_PAGE_COPY = {
  eyebrow: "Lộ trình khóa học",
  titleLine1: "Chọn chủ đề phù hợp,",
  titleLine2: "học từng bước dễ theo hơn.",
  description:
    "Mỗi nhóm bài học giúp bạn hiểu cảm xúc, xây dựng sự tự tin, giữ an toàn cho bản thân và biết cách tìm hỗ trợ khi cần.",
  imageTopLeft: "Chủ đề đang có",
  imageTopRightSuffix: "nhóm",
  imageAlt: "Nhóm học sinh đang cùng học và hỗ trợ nhau",
  loadError: "Không thể tải khóa học lúc này.",
  activeBadge: "Chủ đề đang chọn",
  activeLessonsSuffix: "bài học",
  nextTitle: "Bài nên học tiếp",
  nextAction: "Mở bài học",
  noLesson: "Chưa có bài học",
  switchThemeTitle: "Đổi chủ đề",
  allLessonsTitle: "Toàn bộ bài học",
  allLessonsSubtitle: "Theo dõi trọn lộ trình",
  accessTitle: "Học theo nhu cầu",
  accessDescription:
    "Bạn có thể bắt đầu từ nhóm bài gần với mình nhất rồi mở rộng dần sang các chủ đề khác khi đã sẵn sàng.",
  freeBadge: "Miễn phí",
  extendedBadge: "Mở rộng",
  completedBadge: "Đã học",
  lockedBadge: "Đang khóa",
} as const;

export const COURSE_THEME_COPY = [
  {
    id: "hieu-minh",
    title: "Hiểu mình vững hơn",
    summary:
      "Bắt đầu từ việc hiểu cơ thể, cảm xúc và áp lực tuổi teen để bạn bớt hoang mang và biết cách chăm sóc bản thân tốt hơn.",
    badge: "Khởi đầu nhẹ nhàng",
    accentClass: "bg-[linear-gradient(135deg,rgba(255,228,237,0.95)_0%,rgba(255,255,255,0.92)_100%)]",
    orders: [1, 2, 3],
  },
  {
    id: "ket-noi",
    title: "Tự tin và kết nối",
    summary:
      "Rèn sự tự tin, học cách giao tiếp rõ ràng và xây dựng các mối quan hệ lành mạnh, tôn trọng lẫn nhau.",
    badge: "Rất cần cho tuổi teen",
    accentClass: "bg-[linear-gradient(135deg,rgba(234,243,255,0.95)_0%,rgba(255,255,255,0.92)_100%)]",
    orders: [4, 5, 6],
  },
  {
    id: "an-toan",
    title: "An toàn và biết tìm hỗ trợ",
    summary:
      "Tìm hiểu cách giữ an toàn trên mạng, nhận biết khi nào cần tìm người hỗ trợ và bảo vệ mình đúng lúc.",
    badge: "Thực hành mỗi ngày",
    accentClass: "bg-[linear-gradient(135deg,rgba(229,250,244,0.95)_0%,rgba(255,255,255,0.92)_100%)]",
    orders: [7, 8],
  },
] as const;

export const LESSON_DISPLAY_BY_SLUG = {
  "hieu-ve-tuoi-teen": {
    title: "Hiểu về tuổi teen",
    summary: "Nhìn rõ những thay đổi tự nhiên của tuổi teen để bớt lo lắng và hiểu bản thân tích cực hơn.",
  },
  "nhan-dien-cam-xuc": {
    title: "Nhận diện cảm xúc",
    summary: "Biết gọi tên cảm xúc giúp bạn chia sẻ dễ hơn và chăm sóc bản thân tốt hơn.",
  },
  "quan-ly-ap-luc-hoc-tap": {
    title: "Quản lý áp lực học tập",
    summary: "Học cách giảm căng thẳng trước kiểm tra và giữ nhịp học tập bền vững hơn.",
  },
  "ky-nang-noi-khong": {
    title: "Kỹ năng nói không",
    summary: "Biết đặt ranh giới rõ ràng và từ chối những điều khiến bạn không an toàn hoặc không thoải mái.",
  },
  "tu-tin-khi-giao-tiep": {
    title: "Tự tin khi giao tiếp",
    summary: "Rèn sự rõ ràng và bình tĩnh khi nói lên suy nghĩ của mình trước bạn bè, thầy cô và gia đình.",
  },
  "tinh-ban-lanh-manh": {
    title: "Tình bạn lành mạnh",
    summary: "Hiểu dấu hiệu của một tình bạn tích cực để chọn người đồng hành khiến bạn thấy được tôn trọng.",
  },
  "an-toan-tren-mang": {
    title: "An toàn trên mạng",
    summary: "Biết cách bảo vệ thông tin cá nhân và phản ứng an toàn khi gặp tình huống xấu trên internet.",
  },
  "tim-kiem-su-ho-tro": {
    title: "Tìm kiếm sự hỗ trợ",
    summary: "Nhận ra khi nào bạn cần chia sẻ với người lớn đáng tin để được đồng hành kịp thời.",
  },
} as const satisfies Record<string, { title: string; summary: string }>;

export const GAMES_PAGE_COPY = {
  eyebrow: "Khu trò chơi EDUcare",
  titleLine1: "Chọn trò phù hợp,",
  titleLine2: "vào chơi thật vui.",
  description:
    "Mỗi trò chơi là một cách nhẹ nhàng để ôn lại kiến thức, thư giãn và giữ thêm động lực cho hành trình của bạn.",
  primaryAction: "Vào quiz nhanh",
  secondaryAction: "Xem bảng xếp hạng",
  heroPanelTitle: "Không gian vui để học",
  heroPanelCountSuffix: "trò chơi",
  heroImageAlt: "Các bạn trẻ đang hào hứng tham gia hoạt động học tập",
  sectionEyebrow: "Danh sách trò chơi",
  sectionTitle: "Chọn trò hợp với bạn",
  sectionDescription: "Mỗi trò đều có trang riêng để bạn xem mục tiêu và bắt đầu một cách rõ ràng hơn.",
  openLeaderboard: "Mở trang bảng xếp hạng",
  playAction: "Xem chi tiết",
  developingAction: "Đang phát triển",
  quickQuizBadge: "Quiz nhanh",
  longQuizBadge: "Quiz dài",
  flashBadge: "Mini game",
  loadError: "Không thể tải trò chơi lúc này.",
} as const;

export const GAME_DISPLAY_BY_SLUG = {
  "quiz-quick": {
    title: "Quiz nhanh 10 câu",
    summary: "Một lượt ngắn để bạn kiểm tra kiến thức, giữ streak và cộng điểm cho hồ sơ cá nhân.",
  },
  "quiz-long": {
    title: "Quiz dài 30 câu",
    summary: "Dành cho khi bạn muốn thử sức sâu hơn, tăng điểm và bứt lên trên bảng xếp hạng.",
  },
  "anh-sang-tu-tin": {
    title: "Ánh sáng tự tin",
    summary: "Mini game thư giãn giúp bạn lấy lại năng lượng tích cực và nhịp vui sau giờ học.",
  },
} as const satisfies Record<string, { title: string; summary: string }>;
