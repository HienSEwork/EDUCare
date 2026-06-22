export interface SwipeCard {
  id: number;
  scenario: string;
  isSafe: boolean;
  explanation: string;
  category: "Mạng xã hội" | "Ngoài đời thực" | "Tin nhắn" | "Thông tin cá nhân" | "Bạn bè";
  icon: string;
}

export const ALL_SWIPE_CARDS: SwipeCard[] = [
  // Mạng xã hội
  {
    id: 1,
    scenario: "Một người lạ xin kết bạn và nói muốn làm quen vì thấy profile bạn \"rất đáng yêu\".",
    isSafe: false,
    explanation: "Người lạ tiếp cận với lời khen ngoại hình là dấu hiệu cảnh báo. Không nên kết bạn với người bạn không biết ngoài đời thực.",
    category: "Mạng xã hội",
    icon: "👤",
  },
  {
    id: 2,
    scenario: "Bạn thân nhắn tin hỏi mượn tài khoản mạng xã hội vì quên mật khẩu.",
    isSafe: false,
    explanation: "Không bao giờ chia sẻ tài khoản dù là với bạn thân. Đây có thể là tài khoản bị hack hoặc bạn có thể bị lợi dụng mà không hay biết.",
    category: "Mạng xã hội",
    icon: "🔑",
  },
  {
    id: 3,
    scenario: "Bạn đặt tài khoản Instagram ở chế độ Private để chỉ người theo dõi mới xem được.",
    isSafe: true,
    explanation: "Đặt tài khoản ở chế độ riêng tư là thói quen tốt, giúp kiểm soát ai nhìn thấy nội dung của bạn.",
    category: "Mạng xã hội",
    icon: "🔒",
  },
  {
    id: 4,
    scenario: "Một tài khoản nổi tiếng nhắn tin nói bạn đã trúng thưởng iPhone và cần gửi tiền phí để nhận quà.",
    isSafe: false,
    explanation: "Đây là lừa đảo điển hình. Không có cuộc thi thật nào yêu cầu bạn trả tiền để nhận thưởng.",
    category: "Mạng xã hội",
    icon: "🎁",
  },
  {
    id: 5,
    scenario: "Bạn báo cáo (report) một bài đăng có nội dung bắt nạt bạn học lên nền tảng.",
    isSafe: true,
    explanation: "Báo cáo nội dung xấu là đúng đắn và dũng cảm. Đây là cách bảo vệ bản thân và cộng đồng trên mạng.",
    category: "Mạng xã hội",
    icon: "🚩",
  },

  // Thông tin cá nhân
  {
    id: 6,
    scenario: "Một trang web yêu cầu số CMND, địa chỉ nhà và số điện thoại của bạn để \"xác minh tuổi\".",
    isSafe: false,
    explanation: "Không website hợp lệ nào cần tất cả các thông tin nhạy cảm này cùng một lúc. Đây có thể là trang lừa đảo đánh cắp danh tính.",
    category: "Thông tin cá nhân",
    icon: "📋",
  },
  {
    id: 7,
    scenario: "Bạn chia sẻ vị trí thật của mình cho cả nhóm bạn bè thân thiết qua app.",
    isSafe: true,
    explanation: "Chia sẻ vị trí với bạn bè thân thiết và người thân để đảm bảo an toàn là hành động hợp lý.",
    category: "Thông tin cá nhân",
    icon: "📍",
  },
  {
    id: 8,
    scenario: "Bạn đăng ảnh chụp vé tàu lên story, trong ảnh thấy rõ họ tên và số vé.",
    isSafe: false,
    explanation: "Thông tin trên vé có thể bị lợi dụng. Hãy che đi thông tin cá nhân trước khi đăng ảnh giấy tờ.",
    category: "Thông tin cá nhân",
    icon: "🎫",
  },
  {
    id: 9,
    scenario: "Người lạ trên mạng hỏi bạn học trường nào và nhà ở đường nào.",
    isSafe: false,
    explanation: "Không bao giờ cung cấp vị trí cụ thể cho người lạ. Kết hợp thông tin trường + địa chỉ đủ để người khác theo dõi bạn.",
    category: "Thông tin cá nhân",
    icon: "🏫",
  },
  {
    id: 10,
    scenario: "Bạn sử dụng tên giả và ảnh không phải của mình khi đăng ký tài khoản game.",
    isSafe: true,
    explanation: "Bảo vệ danh tính thật khi chơi game trực tuyến là thói quen an toàn, đặc biệt với người lạ.",
    category: "Thông tin cá nhân",
    icon: "🎮",
  },

  // Tin nhắn
  {
    id: 11,
    scenario: "Người quen trên mạng xin ảnh selfie của bạn để \"nhớ mặt\".",
    isSafe: false,
    explanation: "Không gửi ảnh cá nhân cho người chỉ quen trên mạng. Ảnh có thể bị dùng sai mục đích và bạn không kiểm soát được.",
    category: "Tin nhắn",
    icon: "📸",
  },
  {
    id: 12,
    scenario: "Một người lạ nhắn tin nói biết bí mật xấu về bạn và đe dọa sẽ đăng lên mạng nếu bạn không làm theo.",
    isSafe: false,
    explanation: "Đây là hành vi tống tiền và bắt nạt trực tuyến. Hãy lưu bằng chứng, không làm theo yêu cầu và báo ngay cho người lớn đáng tin.",
    category: "Tin nhắn",
    icon: "⚠️",
  },
  {
    id: 13,
    scenario: "Bạn không trả lời tin nhắn của người lạ nhắn tin lúc nửa đêm.",
    isSafe: true,
    explanation: "Bạn không có nghĩa vụ phải trả lời ai, đặc biệt là người lạ và vào giờ bất thường. Đây là ranh giới lành mạnh.",
    category: "Tin nhắn",
    icon: "🌙",
  },
  {
    id: 14,
    scenario: "Bạn bấm vào link trong tin nhắn lạ vì tò mò xem có gì.",
    isSafe: false,
    explanation: "Link lạ có thể chứa virus, phần mềm đánh cắp thông tin hoặc dẫn đến trang web nguy hiểm. Không bao giờ bấm link từ nguồn không rõ.",
    category: "Tin nhắn",
    icon: "🔗",
  },
  {
    id: 15,
    scenario: "Bạn báo cho bố/mẹ khi nhận được tin nhắn đe dọa từ người lạ.",
    isSafe: true,
    explanation: "Tìm sự hỗ trợ từ người lớn đáng tin là phản ứng đúng đắn khi bị đe dọa online. Bạn không cần đối phó một mình.",
    category: "Tin nhắn",
    icon: "🤝",
  },

  // Ngoài đời thực
  {
    id: 16,
    scenario: "Người quen trên mạng rủ bạn gặp ngoài đời ở một địa điểm vắng vẻ, chỉ có hai người.",
    isSafe: false,
    explanation: "Không bao giờ gặp mặt người chỉ quen trên mạng ở nơi hẻo lánh. Nếu muốn gặp, phải có người thân đi cùng ở nơi đông người.",
    category: "Ngoài đời thực",
    icon: "🚗",
  },
  {
    id: 17,
    scenario: "Bạn nhờ bố/mẹ đưa đi khi cần gặp người quen trên mạng lần đầu.",
    isSafe: true,
    explanation: "Đây là cách tiếp cận an toàn và đúng đắn. Gặp ở nơi công cộng với người thân là tiêu chuẩn an toàn tối thiểu.",
    category: "Ngoài đời thực",
    icon: "👨‍👩‍👧",
  },
  {
    id: 18,
    scenario: "Người lạ trên đường tặng bạn kẹo và mời lên xe về nhà.",
    isSafe: false,
    explanation: "Đây là tình huống nguy hiểm cực kỳ. Không nhận quà và không lên xe người lạ bao giờ, dù họ có vẻ thân thiện.",
    category: "Ngoài đời thực",
    icon: "🍬",
  },
  {
    id: 19,
    scenario: "Bạn bảo bạn bè biết mình đang ở đâu khi ra ngoài một mình.",
    isSafe: true,
    explanation: "Cho người thân hoặc bạn bè biết vị trí của bạn là thói quen an toàn quan trọng, đặc biệt khi ở ngoài đêm.",
    category: "Ngoài đời thực",
    icon: "📱",
  },
  {
    id: 20,
    scenario: "Bạn nhận thấy có người lạ theo dõi mình nhiều lần gần nhà và im lặng không nói với ai.",
    isSafe: false,
    explanation: "Khi nghi ngờ bị theo dõi, hãy báo ngay cho bố/mẹ hoặc người lớn đáng tin. Đừng im lặng một mình với cảm giác nguy hiểm.",
    category: "Ngoài đời thực",
    icon: "👁️",
  },

  // Bạn bè
  {
    id: 21,
    scenario: "Bạn bè ép bạn chia sẻ mật khẩu điện thoại \"để chứng minh không giấu gì\".",
    isSafe: false,
    explanation: "Không ai có quyền ép bạn chia sẻ mật khẩu — kể cả bạn bè thân. Ranh giới cá nhân không cần phải chứng minh bằng mật khẩu.",
    category: "Bạn bè",
    icon: "🤜",
  },
  {
    id: 22,
    scenario: "Bạn nói không khi bạn bè rủ làm điều gì khiến bạn không thoải mái, dù bị gọi là nhàm.",
    isSafe: true,
    explanation: "Từ chối là quyền của bạn. Bạn bè thật sự sẽ tôn trọng quyết định của bạn chứ không gây áp lực.",
    category: "Bạn bè",
    icon: "✋",
  },
  {
    id: 23,
    scenario: "Nhóm bạn rủ nhau tạo tài khoản giả để xem story riêng tư của người khác.",
    isSafe: false,
    explanation: "Tạo tài khoản giả để xem nội dung riêng tư là vi phạm sự riêng tư của người khác và có thể vi phạm pháp luật.",
    category: "Bạn bè",
    icon: "🕵️",
  },
  {
    id: 24,
    scenario: "Bạn từ chối chụp ảnh bạn khác khi họ không muốn và xóa ảnh theo yêu cầu.",
    isSafe: true,
    explanation: "Tôn trọng quyền được không bị chụp ảnh của người khác là hành vi văn minh và lành mạnh.",
    category: "Bạn bè",
    icon: "🚫",
  },
  {
    id: 25,
    scenario: "Bạn đăng ảnh cả nhóm lên mạng mà không hỏi ý kiến từng người trong ảnh.",
    isSafe: false,
    explanation: "Trước khi đăng ảnh có người khác, cần hỏi xin phép họ. Mỗi người có quyền kiểm soát hình ảnh cá nhân của mình.",
    category: "Bạn bè",
    icon: "📷",
  },
  {
    id: 26,
    scenario: "Bạn lên tiếng bảo vệ người bị bắt nạt trong nhóm chat của lớp.",
    isSafe: true,
    explanation: "Lên tiếng bảo vệ người bị bắt nạt là hành động dũng cảm và đúng đắn. Sự im lặng đôi khi tiếp tay cho bạo lực.",
    category: "Bạn bè",
    icon: "🛡️",
  },
  {
    id: 27,
    scenario: "Bạn bè gửi link một bộ phim \"18+\" và bảo bạn xem cho \"biết\".",
    isSafe: false,
    explanation: "Nội dung 18+ không phù hợp với người chưa đủ tuổi. Bạn có quyền từ chối mà không cần giải thích.",
    category: "Bạn bè",
    icon: "🎬",
  },
  {
    id: 28,
    scenario: "Khi thấy bạn thân có biểu hiện buồn bã lâu dài, bạn chủ động hỏi thăm và lắng nghe.",
    isSafe: true,
    explanation: "Quan tâm đến sức khỏe tâm thần của bạn bè là điều quan trọng. Lắng nghe mà không phán xét có thể giúp ích rất nhiều.",
    category: "Bạn bè",
    icon: "💙",
  },
  {
    id: 29,
    scenario: "Bạn tham gia nhóm chat lan truyền tin đồn về một bạn học không quen biết.",
    isSafe: false,
    explanation: "Tham gia lan truyền tin đồn là hành vi bắt nạt gián tiếp, dù bạn không trực tiếp nói xấu. Điều này gây hại cho cả bạn và nạn nhân.",
    category: "Bạn bè",
    icon: "💬",
  },
  {
    id: 30,
    scenario: "Bạn nhắc nhở bạn bè không nên chia sẻ ảnh người khác mà không xin phép.",
    isSafe: true,
    explanation: "Nhắc nhở bạn bè về an toàn mạng là hành động trách nhiệm. Bạn đang giúp bảo vệ quyền riêng tư của mọi người.",
    category: "Bạn bè",
    icon: "💡",
  },
];

export const SWIPE_CATEGORIES = [...new Set(ALL_SWIPE_CARDS.map((c) => c.category))];
