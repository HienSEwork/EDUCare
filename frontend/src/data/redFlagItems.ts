export interface RedFlagHotspot {
  id: string;
  label: string;
  x: number; // % from left
  y: number; // % from top
  w: number; // width %
  h: number; // height %
  explanation: string;
}

export interface RedFlagScene {
  id: number;
  title: string;
  description: string;
  sceneType: "facebook" | "email" | "tiktok";
  hotspots: RedFlagHotspot[];
  totalFlags: number;
}

export const RED_FLAG_SCENES: RedFlagScene[] = [
  {
    id: 1,
    title: "Trang cá nhân Facebook lạ",
    description: "Ai đó vừa gửi cho bạn lời mời kết bạn. Nhìn vào trang cá nhân của họ và tìm các dấu hiệu đáng ngờ.",
    sceneType: "facebook",
    totalFlags: 6,
    hotspots: [
      {
        id: "fb_1",
        label: "Tài khoản mới tạo",
        x: 62, y: 8, w: 30, h: 5,
        explanation: "Tài khoản chỉ mới 2 tuần tuổi là dấu hiệu đáng ngờ. Kẻ lừa đảo thường tạo tài khoản mới để tiếp cận nạn nhân.",
      },
      {
        id: "fb_2",
        label: "Ảnh đại diện lấy từ người nổi tiếng",
        x: 5, y: 5, w: 20, h: 18,
        explanation: "Ảnh đại diện là ảnh của một diễn viễn nổi tiếng, không phải ảnh thật của người này. Đây là tài khoản giả mạo.",
      },
      {
        id: "fb_3",
        label: "Không có bạn chung",
        x: 62, y: 35, w: 30, h: 6,
        explanation: "0 bạn chung trong khi bạn học cùng trường là bất thường. Người thật trong cộng đồng thường có nhiều bạn chung.",
      },
      {
        id: "fb_4",
        label: "Thông tin không nhất quán",
        x: 5, y: 42, w: 45, h: 8,
        explanation: "Hồ sơ ghi 'Đà Nẵng' nhưng bài đăng lại toàn ảnh ở Hà Nội — thông tin mâu thuẫn là dấu hiệu của tài khoản giả.",
      },
      {
        id: "fb_5",
        label: "Chỉ có 3 ảnh trong 1 năm",
        x: 5, y: 55, w: 60, h: 10,
        explanation: "Album ảnh trống rỗng hoặc quá ít ảnh qua nhiều năm là dấu hiệu tài khoản được tạo vội hoặc dùng để lừa đảo.",
      },
      {
        id: "fb_6",
        label: "Tin nhắn ngay sau khi thêm bạn",
        x: 62, y: 58, w: 30, h: 10,
        explanation: "Gửi tin nhắn ngay lập tức sau khi kết bạn, đặc biệt với nội dung mang tính tâng bốc hoặc xin thông tin là dấu hiệu đáng ngờ.",
      },
    ],
  },
  {
    id: 2,
    title: "Email lừa đảo",
    description: "Bạn nhận được email này trong hộp thư. Hãy tìm các dấu hiệu cho thấy đây là email giả mạo.",
    sceneType: "email",
    totalFlags: 5,
    hotspots: [
      {
        id: "em_1",
        label: "Địa chỉ email lạ",
        x: 5, y: 8, w: 55, h: 6,
        explanation: "Email từ 'noreply@vietcombank-secure.xyz' không phải địa chỉ chính thức. Tổ chức thật không dùng đuôi '.xyz' hay tên có thêm chữ '-secure'.",
      },
      {
        id: "em_2",
        label: "Tạo cảm giác khẩn cấp",
        x: 5, y: 18, w: 90, h: 8,
        explanation: "'Trong 24 giờ tài khoản sẽ bị khóa' là chiêu tạo áp lực để bạn hành động vội vàng mà không suy nghĩ. Email hợp lệ không bao giờ dọa như vậy.",
      },
      {
        id: "em_3",
        label: "Lỗi chính tả",
        x: 5, y: 32, w: 85, h: 8,
        explanation: "Email có nhiều lỗi chính tả và ngữ pháp sai là dấu hiệu rõ của email lừa đảo. Tổ chức chuyên nghiệp không mắc lỗi như vậy.",
      },
      {
        id: "em_4",
        label: "Link đáng ngờ",
        x: 5, y: 52, w: 80, h: 7,
        explanation: "URL 'http://vietcombank-login.ru/verify' không phải website Vietcombank thật (vietcombank.com.vn). Đuôi '.ru' là tên miền Nga, hoàn toàn không liên quan.",
      },
      {
        id: "em_5",
        label: "Yêu cầu thông tin cá nhân",
        x: 5, y: 65, w: 90, h: 10,
        explanation: "Ngân hàng không bao giờ yêu cầu bạn nhập số thẻ, mật khẩu qua email. Đây luôn luôn là lừa đảo.",
      },
    ],
  },
  {
    id: 3,
    title: "TikTok với nội dung xấu",
    description: "Một video trên TikTok đang lan truyền trong trường. Hãy xác định các vấn đề với video này.",
    sceneType: "tiktok",
    totalFlags: 4,
    hotspots: [
      {
        id: "tt_1",
        label: "Quay lén người khác không đồng ý",
        x: 10, y: 10, w: 80, h: 40,
        explanation: "Video này quay lén một bạn học sinh mà không có sự đồng ý. Đây vi phạm quyền riêng tư và có thể vi phạm pháp luật về bảo vệ hình ảnh cá nhân.",
      },
      {
        id: "tt_2",
        label: "Caption bắt nạt",
        x: 5, y: 52, w: 90, h: 8,
        explanation: "Caption nhận xét chế nhạo ngoại hình/hành động của người bị quay là bắt nạt trực tuyến. Nội dung này cần được báo cáo.",
      },
      {
        id: "tt_3",
        label: "Tag sai người",
        x: 5, y: 65, w: 50, h: 7,
        explanation: "Tag tên thật của nạn nhân vào video xấu làm tăng phạm vi bắt nạt và gây hại tâm lý nghiêm trọng hơn cho họ.",
      },
      {
        id: "tt_4",
        label: "Bình luận xúc phạm",
        x: 5, y: 75, w: 90, h: 20,
        explanation: "Các bình luận chế nhạo trong section bình luận cũng là bắt nạt. Nếu bạn thấy, hãy báo cáo cả video lẫn các bình luận này.",
      },
    ],
  },
];
