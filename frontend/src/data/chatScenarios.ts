export interface ChatMessage {
  id: number;
  from: "stranger" | "player";
  text: string;
  delay?: number; // ms typing delay
}

export interface ChatChoice {
  id: string;
  text: string;
  nextSceneId: string;
  isGood: boolean;
}

export interface ChatScene {
  id: string;
  messages: ChatMessage[];
  choices?: ChatChoice[];
  isEnding?: boolean;
  endingType?: "good" | "bad" | "neutral";
  endingTitle?: string;
  endingText?: string;
  points?: number;
}

export interface ChatScenario {
  id: number;
  title: string;
  description: string;
  strangerName: string;
  strangerAvatar: string;
  scenes: Record<string, ChatScene>;
  startSceneId: string;
}

export const CHAT_SCENARIOS: ChatScenario[] = [
  // Kịch bản 1: Kẻ giả mạo
  {
    id: 1,
    title: "Người lạ mặt",
    description: "Một tài khoản lạ nhắn tin làm quen, tự xưng là học sinh cùng thành phố...",
    strangerName: "minh_cool_99",
    strangerAvatar: "😎",
    startSceneId: "s1_start",
    scenes: {
      s1_start: {
        id: "s1_start",
        messages: [
          { id: 1, from: "stranger", text: "Chào! Mình thấy bạn trong nhóm học tập, trông bạn hay đấy 😊", delay: 800 },
          { id: 2, from: "stranger", text: "Mình cũng học lớp 9, bạn học trường nào vậy?", delay: 1200 },
        ],
        choices: [
          { id: "c1a", text: "Mình học trường THCS Nguyễn Trãi, còn bạn?", nextSceneId: "s1_shared_info", isGood: false },
          { id: "c1b", text: "Bạn là ai vậy? Chúng ta chưa từng gặp mà.", nextSceneId: "s1_cautious", isGood: true },
          { id: "c1c", text: "Mình không thoải mái chia sẻ thông tin với người lạ.", nextSceneId: "s1_safe_end", isGood: true },
        ],
      },
      s1_shared_info: {
        id: "s1_shared_info",
        messages: [
          { id: 3, from: "stranger", text: "Ồ hay quá! Mình ở gần đó lắm. Vậy nhà bạn ở đường nào?", delay: 900 },
          { id: 4, from: "stranger", text: "Mình muốn đến rủ bạn đi chơi", delay: 600 },
        ],
        choices: [
          { id: "c2a", text: "Nhà mình ở đường Lê Lợi, số nhà 45.", nextSceneId: "s1_danger_end", isGood: false },
          { id: "c2b", text: "Khoan đã, mình không thoải mái chia sẻ địa chỉ với người chưa quen.", nextSceneId: "s1_recover", isGood: true },
        ],
      },
      s1_cautious: {
        id: "s1_cautious",
        messages: [
          { id: 5, from: "stranger", text: "Uh, mình là Minh, học lớp 9A. Bạn có thể cho mình xin số điện thoại không?", delay: 1000 },
        ],
        choices: [
          { id: "c3a", text: "Okay, số của mình là 0912...", nextSceneId: "s1_phone_bad", isGood: false },
          { id: "c3b", text: "Không, mình không cho số người chưa quen. Block luôn.", nextSceneId: "s1_safe_end", isGood: true },
          { id: "c3c", text: "Mình sẽ hỏi ý kiến bố/mẹ trước đã.", nextSceneId: "s1_parent_end", isGood: true },
        ],
      },
      s1_phone_bad: {
        id: "s1_phone_bad",
        messages: [
          { id: 6, from: "stranger", text: "Cảm ơn! Để mình gọi cho bạn nhé...", delay: 800 },
          { id: 7, from: "stranger", text: "Thực ra mình cần nhờ bạn chuyển khoản giúp mình 200k vì mình đang kẹt tiền...", delay: 1500 },
        ],
        isEnding: true,
        endingType: "bad",
        endingTitle: "⚠️ Cạm bẫy!",
        endingText: "Đây là kịch bản lừa đảo phổ biến: làm quen, xin số, rồi nhờ chuyển khoản. Không bao giờ cho số điện thoại người chưa quen và không chuyển tiền dù có lý do gì.",
        points: 0,
      },
      s1_danger_end: {
        id: "s1_danger_end",
        messages: [
          { id: 8, from: "stranger", text: "Tuyệt! Mình sẽ ghé qua bạn nhé!", delay: 600 },
        ],
        isEnding: true,
        endingType: "bad",
        endingTitle: "🚨 Nguy hiểm!",
        endingText: "Cung cấp địa chỉ nhà cho người lạ trên mạng là cực kỳ nguy hiểm. Người này có thể có ý đồ xấu. Hãy block và báo ngay cho người lớn.",
        points: 0,
      },
      s1_recover: {
        id: "s1_recover",
        messages: [
          { id: 9, from: "stranger", text: "Thôi được, bạn khó tính quá...", delay: 800 },
          { id: 10, from: "stranger", text: "Vậy chụp ảnh selfie gửi mình xem được không?", delay: 1000 },
        ],
        choices: [
          { id: "c4a", text: "Okay, đây nè 📸", nextSceneId: "s1_photo_bad", isGood: false },
          { id: "c4b", text: "Block và báo cho bố/mẹ biết về cuộc trò chuyện này.", nextSceneId: "s1_safe_end", isGood: true },
        ],
      },
      s1_photo_bad: {
        id: "s1_photo_bad",
        messages: [
          { id: 11, from: "stranger", text: "Ảnh đẹp quá! Mình sẽ giữ để nhớ bạn nhé 😏", delay: 1000 },
        ],
        isEnding: true,
        endingType: "bad",
        endingTitle: "⚠️ Rủi ro!",
        endingText: "Gửi ảnh cá nhân cho người lạ là sai lầm. Ảnh có thể bị dùng để tống tiền hoặc đăng lên mạng mà không có sự đồng ý của bạn.",
        points: 10,
      },
      s1_safe_end: {
        id: "s1_safe_end",
        messages: [
          { id: 12, from: "stranger", text: "...", delay: 500 },
        ],
        isEnding: true,
        endingType: "good",
        endingTitle: "✅ An toàn!",
        endingText: "Xuất sắc! Bạn đã nhận ra dấu hiệu nguy hiểm và từ chối chia sẻ thông tin cá nhân. Đây là cách bảo vệ bản thân đúng đắn trên mạng.",
        points: 100,
      },
      s1_parent_end: {
        id: "s1_parent_end",
        messages: [
          { id: 13, from: "stranger", text: "Thôi khỏi, mình nhắn nhầm người rồi...", delay: 800 },
        ],
        isEnding: true,
        endingType: "good",
        endingTitle: "✅ Thông minh!",
        endingText: "Hỏi ý kiến bố/mẹ trước khi làm bất cứ điều gì với người lạ trên mạng là quyết định khôn ngoan. Người lạ thật sự không tốt thường sẽ bỏ đi khi bạn nhắc đến người lớn.",
        points: 90,
      },
    },
  },

  // Kịch bản 2: Bắt nạt trực tuyến
  {
    id: 2,
    title: "Tin nhắn xấu",
    description: "Một nhóm bạn cùng lớp bắt đầu nhắn tin xúc phạm bạn trong nhóm chat...",
    strangerName: "nhóm_lớp_9A",
    strangerAvatar: "😡",
    startSceneId: "s2_start",
    scenes: {
      s2_start: {
        id: "s2_start",
        messages: [
          { id: 1, from: "stranger", text: "Ê, mọi người ơi, con này hôm nay ăn mặc xấu không chịu được 😂", delay: 800 },
          { id: 2, from: "stranger", text: "Ai đồng ý với tao ấn like nào", delay: 600 },
          { id: 3, from: "stranger", text: "🤣🤣🤣 @bạn", delay: 400 },
        ],
        choices: [
          { id: "c1a", text: "Cũng được mà, không thấy xấu gì đâu. Thôi bỏ qua đi.", nextSceneId: "s2_ignore", isGood: false },
          { id: "c1b", text: "Mọi người ơi, đừng nói thế. Nhận xét ngoại hình người khác là không tốt.", nextSceneId: "s2_defend", isGood: true },
          { id: "c1c", text: "Chụp màn hình lưu lại rồi báo cáo tin nhắn này với giáo viên.", nextSceneId: "s2_report", isGood: true },
        ],
      },
      s2_ignore: {
        id: "s2_ignore",
        messages: [
          { id: 4, from: "stranger", text: "Ha, mày cũng đồng ý với tao à? Vậy thì cả lớp đều thấy nó xấu rồi 😈", delay: 1000 },
          { id: 5, from: "stranger", text: "Mày giỏi chứ, dám im lặng đồng lõa", delay: 700 },
        ],
        isEnding: true,
        endingType: "bad",
        endingTitle: "😔 Im lặng tiếp tay",
        endingText: "Im lặng khi chứng kiến bắt nạt vô tình tiếp tay cho kẻ bắt nạt. Nếu không dám lên tiếng trực tiếp, bạn có thể nhắn riêng cho nạn nhân để hỗ trợ, hoặc báo với giáo viên/người lớn.",
        points: 20,
      },
      s2_defend: {
        id: "s2_defend",
        messages: [
          { id: 6, from: "stranger", text: "Ôi thôi nào, nhạy cảm vậy. Tao chỉ đùa thôi mà", delay: 800 },
          { id: 7, from: "stranger", text: "Mày muốn bảo vệ nó hả? Coi chừng tao bắt nạt mày luôn đó", delay: 1000 },
        ],
        choices: [
          { id: "c2a", text: "Thôi xin lỗi, mình chỉ nói thôi. Không có ý gì đâu.", nextSceneId: "s2_backdown", isGood: false },
          { id: "c2b", text: "Mình sẽ chụp màn hình và báo với cô giáo về cuộc trò chuyện này.", nextSceneId: "s2_report", isGood: true },
        ],
      },
      s2_backdown: {
        id: "s2_backdown",
        messages: [
          { id: 8, from: "stranger", text: "Ha! Biết điều rồi đó. Lần sau khỏi xen vào.", delay: 700 },
        ],
        isEnding: true,
        endingType: "neutral",
        endingTitle: "😐 Bỏ cuộc giữa chừng",
        endingText: "Rút lui trước kẻ bắt nạt không giải quyết được vấn đề. Hãy nhớ: kẻ bắt nạt dùng đe dọa để giữ quyền lực. Báo cáo với người có thẩm quyền luôn là lựa chọn đúng đắn.",
        points: 40,
      },
      s2_report: {
        id: "s2_report",
        messages: [
          { id: 9, from: "stranger", text: "...", delay: 500 },
        ],
        isEnding: true,
        endingType: "good",
        endingTitle: "✅ Hành động đúng!",
        endingText: "Lưu bằng chứng và báo cáo với người có thẩm quyền là cách xử lý bắt nạt trực tuyến hiệu quả nhất. Bạn không chỉ bảo vệ người bị hại mà còn ngăn chặn hành vi xấu tiếp diễn.",
        points: 100,
      },
    },
  },

  // Kịch bản 3: Tống tiền
  {
    id: 3,
    title: "Tin nhắn đe dọa",
    description: "Ai đó nhắn tin nói có ảnh xấu của bạn và đòi tiền...",
    strangerName: "unknown_user",
    strangerAvatar: "😈",
    startSceneId: "s3_start",
    scenes: {
      s3_start: {
        id: "s3_start",
        messages: [
          { id: 1, from: "stranger", text: "Mình có ảnh nhạy cảm của mày đây.", delay: 800 },
          { id: 2, from: "stranger", text: "Chuyển 500k cho tao hoặc tao sẽ gửi cho cả trường.", delay: 1000 },
        ],
        choices: [
          { id: "c1a", text: "Okay okay, mình chuyển ngay. Tài khoản nào vậy?", nextSceneId: "s3_pay", isGood: false },
          { id: "c1b", text: "Block ngay và kể với bố/mẹ hoặc cô giáo.", nextSceneId: "s3_report", isGood: true },
          { id: "c1c", text: "Mình sẽ chụp màn hình cuộc trò chuyện này rồi báo công an.", nextSceneId: "s3_police", isGood: true },
        ],
      },
      s3_pay: {
        id: "s3_pay",
        messages: [
          { id: 3, from: "stranger", text: "Hay đấy. Chuyển vào số 0123456789.", delay: 600 },
          { id: 4, from: "stranger", text: "Chuyển rồi à? Tốt. Nhưng tao cần thêm 1 triệu nữa...", delay: 1200 },
        ],
        isEnding: true,
        endingType: "bad",
        endingTitle: "🚨 Sai lầm nghiêm trọng!",
        endingText: "Không bao giờ trả tiền cho kẻ tống tiền! Nếu bạn trả một lần, chúng sẽ tiếp tục đòi thêm mãi. Hãy block, chụp màn hình làm bằng chứng, và báo cáo ngay với người lớn hoặc công an.",
        points: 0,
      },
      s3_report: {
        id: "s3_report",
        messages: [
          { id: 5, from: "stranger", text: "Mày sẽ hối hận...", delay: 800 },
        ],
        isEnding: true,
        endingType: "good",
        endingTitle: "✅ Đúng rồi!",
        endingText: "Không trả tiền và báo ngay với người lớn là phản ứng đúng đắn. Đây là hành vi tống tiền trực tuyến - tội hình sự. Người lớn sẽ giúp bạn giải quyết và bảo vệ bạn.",
        points: 100,
      },
      s3_police: {
        id: "s3_police",
        messages: [
          { id: 6, from: "stranger", text: "...(im lặng)", delay: 600 },
        ],
        isEnding: true,
        endingType: "good",
        endingTitle: "✅ Hành động mạnh mẽ!",
        endingText: "Chụp màn hình bằng chứng và báo cơ quan chức năng là hoàn toàn đúng đắn. Tống tiền trực tuyến là tội hình sự. Đừng xóa bằng chứng và hãy nhờ người lớn hỗ trợ bạn.",
        points: 100,
      },
    },
  },
];
