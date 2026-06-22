export interface StoryChoice {
  id: string;
  text: string;
  nextNodeId: string;
  icon?: string;
}

export interface StoryNode {
  id: string;
  speaker: "narrator" | "minh" | "linh" | "me" | "teacher" | "parent";
  text: string;
  mood?: "happy" | "sad" | "nervous" | "angry" | "neutral" | "scared";
  choices?: StoryChoice[];
  nextNodeId?: string; // if no choices, auto-advance
  isEnding?: boolean;
  endingType?: "good" | "bad" | "secret";
  endingTitle?: string;
  endingText?: string;
  endingEmoji?: string;
}

export interface TeenPathStory {
  id: number;
  title: string;
  premise: string;
  nodes: Record<string, StoryNode>;
  startNodeId: string;
  endings: string[];
}

export const SPEAKERS: Record<string, { name: string; avatar: string; color: string }> = {
  narrator: { name: "Người kể chuyện", avatar: "📖", color: "#9b5de5" },
  minh: { name: "Minh (bạn thân)", avatar: "👦", color: "#4361ee" },
  linh: { name: "Linh (bạn cùng lớp)", avatar: "👧", color: "#ff5d8f" },
  me: { name: "Bạn", avatar: "🙋", color: "#06d6a0" },
  teacher: { name: "Cô giáo", avatar: "👩‍🏫", color: "#f77f00" },
  parent: { name: "Mẹ", avatar: "👩", color: "#e76f51" },
};

export const TEEN_PATH_STORY: TeenPathStory = {
  id: 1,
  title: "Ngã Rẽ Tuổi Teen",
  premise: "Bạn là học sinh lớp 9. Hôm nay, bạn thân Minh rủ bạn tham gia một \"bữa tiệc nhỏ\" ở nhà bạn khác. Đây là một đêm bạn sẽ nhớ mãi...",
  startNodeId: "n1",
  endings: ["end_good_1", "end_good_2", "end_bad_1", "end_bad_2", "end_secret"],
  nodes: {
    n1: {
      id: "n1",
      speaker: "narrator",
      text: "Chiều thứ Sáu, sau giờ học. Bạn đang sắp xếp sách vở thì Minh chạy đến, mặt hớn hở.",
      nextNodeId: "n2",
    },
    n2: {
      id: "n2",
      speaker: "minh",
      text: "Này! Tối nay nhà Hùng có tụ tập nhỏ. Bố mẹ Hùng đi vắng cả tuần. Mày đi không?",
      mood: "happy",
      choices: [
        { id: "c1a", text: "Đi thôi! Vui lắm chắc.", nextNodeId: "n3_yes", icon: "🎉" },
        { id: "c1b", text: "Bố mẹ đi vắng... nghe có vẻ không ổn. Tụ tập gì vậy?", nextNodeId: "n3_question", icon: "🤔" },
        { id: "c1c", text: "Không đi được, mình cần hỏi bố mẹ trước.", nextNodeId: "n3_parent", icon: "📱" },
      ],
    },
    n3_yes: {
      id: "n3_yes",
      speaker: "narrator",
      text: "Bạn đồng ý mà không hỏi thêm. Tối đến, bạn đến nhà Hùng và phát hiện có khoảng 15 người, không quen nhiều.",
      nextNodeId: "n4_yes",
    },
    n4_yes: {
      id: "n4_yes",
      speaker: "linh",
      text: "Hé, bạn mới à? Uống một ly cho vui đi! 🍺 Ở đây ai cũng uống hết, không uống ngại lắm.",
      mood: "happy",
      choices: [
        { id: "c2a", text: "Thôi... uống một chút cũng được.", nextNodeId: "n5_drink", icon: "🍺" },
        { id: "c2b", text: "Mình không uống rượu, cảm ơn. Có nước lọc không?", nextNodeId: "n5_refuse", icon: "💧" },
      ],
    },
    n3_question: {
      id: "n3_question",
      speaker: "minh",
      text: "Chỉ là tụ tập thôi, vài người quen. Có thể có uống tý. Bình thường mà, ai cũng làm vậy.",
      mood: "neutral",
      choices: [
        { id: "c3a", text: "Có uống rượu á? Vậy mình không đi đâu.", nextNodeId: "n6_decline", icon: "🚫" },
        { id: "c3b", text: "Thôi được, mình đi nhưng không uống nhé.", nextNodeId: "n3_yes", icon: "👍" },
      ],
    },
    n3_parent: {
      id: "n3_parent",
      speaker: "narrator",
      text: "Bạn gọi điện cho mẹ hỏi ý kiến. Mẹ hỏi chi tiết về buổi tụ tập và nói bạn không nên đến chỗ không có người lớn giám sát.",
      nextNodeId: "n6_parent_approve",
    },
    n5_drink: {
      id: "n5_drink",
      speaker: "narrator",
      text: "Bạn uống vài ly. Buổi tối tiến triển, người ta bắt đầu chụp ảnh và video. Một người bạn không quen đang quay bạn trong lúc bạn không tỉnh táo.",
      nextNodeId: "n7_photo",
    },
    n7_photo: {
      id: "n7_photo",
      speaker: "narrator",
      text: "Hôm sau, bạn nhận được tin nhắn: một đoạn video của bạn đêm qua đang lan truyền trong nhóm chat của trường.",
      choices: [
        { id: "c4a", text: "Hoảng loạn, xóa tất cả tin nhắn và hy vọng mọi người quên đi.", nextNodeId: "end_bad_1", icon: "😱" },
        { id: "c4b", text: "Kể với bố mẹ và nhờ họ giúp xử lý.", nextNodeId: "n8_help", icon: "👨‍👩‍👧" },
      ],
    },
    n8_help: {
      id: "n8_help",
      speaker: "parent",
      text: "Mẹ thất vọng nhưng không trách mắng. 'Con đã làm đúng khi nói với mẹ. Chúng ta sẽ liên hệ nhà trường và yêu cầu người đó xóa video.'",
      mood: "neutral",
      nextNodeId: "end_neutral",
    },
    n5_refuse: {
      id: "n5_refuse",
      speaker: "linh",
      text: "Ôi, nghiêm túc quá vậy? Thôi tùy! Nhưng mà bạn sẽ lẻ loi cả tối đó.",
      mood: "neutral",
      nextNodeId: "n9_firm",
    },
    n9_firm: {
      id: "n9_firm",
      speaker: "narrator",
      text: "Bạn kiên quyết không uống. Một số người chế giễu nhưng bạn không quan tâm. Sau này, một bạn trong buổi đó kể: có người say và gặp rắc rối to.",
      nextNodeId: "end_good_1",
    },
    n6_decline: {
      id: "n6_decline",
      speaker: "minh",
      text: "Thôi được, mình tôn trọng quyết định của mày. Tụi mình khi khác tụ tập nhé, không có rượu.",
      mood: "happy",
      nextNodeId: "end_good_2",
    },
    n6_parent_approve: {
      id: "n6_parent_approve",
      speaker: "narrator",
      text: "Bạn ở nhà và đêm đó trò chuyện với mẹ về áp lực từ bạn bè. Mẹ chia sẻ những câu chuyện từ thời đi học của mẹ — thật bất ngờ và thú vị.",
      nextNodeId: "end_secret",
    },
    end_neutral: {
      id: "end_neutral",
      speaker: "narrator",
      text: "Tình huống được giải quyết nhờ sự giúp đỡ của người lớn. Đây là bài học quan trọng về hệ quả của quyết định vội vàng.",
      isEnding: true,
      endingType: "bad",
      endingTitle: "Bài Học Đắt Giá",
      endingEmoji: "📚",
      endingText: "Bạn đã làm đúng khi báo với mẹ sau đó, và đó là điểm sáng. Nhưng câu chuyện này cho thấy: một quyết định vội vàng có thể dẫn đến hậu quả lâu dài. Rút kinh nghiệm và tiếp tục trưởng thành.",
    },
    end_bad_1: {
      id: "end_bad_1",
      speaker: "narrator",
      text: "Video tiếp tục lan rộng. Bạn không ngủ được, không muốn đến trường. Cuối cùng, bạn không thể ẩn giấu mãi và vấn đề ngày càng tệ hơn.",
      isEnding: true,
      endingType: "bad",
      endingTitle: "Cô Đơn Trong Bí Mật",
      endingEmoji: "😔",
      endingText: "Giữ bí mật một mình khi gặp rắc rối khiến vấn đề trầm trọng thêm. Người lớn đáng tin — dù bạn sợ họ thất vọng — luôn có thể giúp bạn hơn là để bạn đối mặt một mình.",
    },
    end_bad_2: {
      id: "end_bad_2",
      speaker: "narrator",
      text: "Bạn bị áp lực phải \"bình thường\" và cuối cùng đã làm theo. Nhưng ranh giới một khi nhượng bộ sẽ ngày càng khó giữ hơn.",
      isEnding: true,
      endingType: "bad",
      endingTitle: "Áp Lực Đồng Trang Lứa",
      endingEmoji: "😟",
      endingText: "Bị áp lực làm điều mình không muốn là trải nghiệm phổ biến. Kỹ năng từ chối — nói không một cách kiên định và nhẹ nhàng — là một trong những kỹ năng quan trọng nhất tuổi teen cần học.",
    },
    end_good_1: {
      id: "end_good_1",
      speaker: "narrator",
      text: "Bạn đứng vững với quyết định của mình dù bị áp lực. Hôm sau đến trường, mọi người không còn nhớ chuyện đó — nhưng bạn nhớ cảm giác tự hào về bản thân.",
      isEnding: true,
      endingType: "good",
      endingTitle: "✨ Ranh Giới Vững Chắc",
      endingEmoji: "🏆",
      endingText: "Bạn đã thể hiện một kỹ năng quan trọng: biết từ chối dưới áp lực xã hội. Đây không phải lúc nào cũng dễ, nhưng nó bảo vệ bạn và xây dựng lòng tự trọng thực sự.",
    },
    end_good_2: {
      id: "end_good_2",
      speaker: "narrator",
      text: "Bạn và Minh tụ tập lại vào cuối tuần — đi xem phim và ăn tối, không có rượu bia. Bạn bè thật sự tôn trọng ranh giới của nhau.",
      isEnding: true,
      endingType: "good",
      endingTitle: "🌟 Tình Bạn Thật",
      endingEmoji: "🤝",
      endingText: "Tình bạn lành mạnh không cần bạn phải làm những điều khiến bạn không thoải mái. Bạn bè thật sự tôn trọng 'không' của bạn và tìm cách vui chơi khác.",
    },
    end_secret: {
      id: "end_secret",
      speaker: "narrator",
      text: "Đêm đó, bạn và mẹ trò chuyện sâu hơn bao giờ hết. Bạn phát hiện mẹ cũng từng có những lo lắng tương tự ở tuổi bạn. Một kết nối mới được xây dựng.",
      isEnding: true,
      endingType: "secret",
      endingTitle: "🔮 Kết Cục Bí Mật",
      endingEmoji: "💜",
      endingText: "Bạn đã mở khóa kết cục ẩn! Đôi khi 'ở nhà' không phải là lựa chọn tẻ nhạt — mà là cơ hội để kết nối với gia đình theo cách bất ngờ nhất.",
    },
  },
};
