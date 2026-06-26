// export interface StickerGifItem {
//   name: string;
//   url: string;
//   category: "study" | "motivation" | "emotion" | "funny" | "congrats";
//   keywords: string[];
// }

// export const STICKERS_LIBRARY: StickerGifItem[] = [
//   // Học tập (Study)
//   {
//     name: "🧸 Gấu học bài",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f9f8.png",
//     category: "study",
//     keywords: ["gau", "hoc tap", "doc sach", "study", "reading", "cute"],
//   },
//   {
//     name: "🎓 Tốt nghiệp",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f393.png",
//     category: "study",
//     keywords: ["tot nghiep", "bang", "grad", "study", "thi cu"],
//   },
//   {
//     name: "📝 Ghi chép",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f4dd.png",
//     category: "study",
//     keywords: ["viet", "ghi chep", "not", "memo", "write"],
//   },
//   {
//     name: "💡 Sáng tạo",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f4a1.png",
//     category: "study",
//     keywords: ["y tuong", "sang tao", "bong den", "idea", "light"],
//   },
//   {
//     name: "📚 Sách vở",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f4da.png",
//     category: "study",
//     keywords: ["sach", "hoc", "books", "study", "thu vien"],
//   },

//   // Động lực (Motivation)
//   {
//     name: "🔥 Quyết tâm",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f525.png",
//     category: "motivation",
//     keywords: ["lua", "quyet tam", "chay", "fire", "hot"],
//   },
//   {
//     name: "💪 Cố lên",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f4aa.png",
//     category: "motivation",
//     keywords: ["suc manh", "co len", "co bap", "strong", "fight"],
//   },
//   {
//     name: "💯 Điểm tuyệt đối",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f4af.png",
//     category: "motivation",
//     keywords: ["100 diem", "tuyet doi", "perfect", "good", "win"],
//   },
//   {
//     name: "🏆 Cúp vô địch",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f3c6.png",
//     category: "motivation",
//     keywords: ["cup", "vo dich", "chien thang", "trophy", "winner"],
//   },
//   {
//     name: "🚀 Bứt phá",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f680.png",
//     category: "motivation",
//     keywords: ["ten lua", "but pha", "bay cao", "rocket", "go"],
//   },

//   // Cảm xúc (Emotion)
//   {
//     name: "❤️ Yêu thương",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2764.png",
//     category: "emotion",
//     keywords: ["tim do", "yeu", "love", "heart"],
//   },
//   {
//     name: "😍 Thả tim",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f60d.png",
//     category: "emotion",
//     keywords: ["mat tim", "yeu thich", "thich", "love", "crush"],
//   },
//   {
//     name: "🤔 Suy nghĩ",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f914.png",
//     category: "emotion",
//     keywords: ["suy nghi", "phan van", "think", "wonder"],
//   },
//   {
//     name: "🙏 Trân trọng",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f64f.png",
//     category: "emotion",
//     keywords: ["cam on", "cau nguyen", "pray", "thanks", "respect"],
//   },
//   {
//     name: "🥺 Chia sẻ",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f97a.png",
//     category: "emotion",
//     keywords: ["buon", "mong doi", "chia se", "please", "sad"],
//   },
//   {
//     name: "😭 Khóc thương",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f62d.png",
//     category: "emotion",
//     keywords: ["khoc", "hu hu", "buon ba", "cry", "sad"],
//   },

//   // Vui nhộn (Funny)
//   {
//     name: "😂 Cười lớn",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f602.png",
//     category: "funny",
//     keywords: ["cuoi", "haha", "funny", "laugh", "lol"],
//   },
//   {
//     name: "😎 Ngầu",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f60e.png",
//     category: "funny",
//     keywords: ["kinh ram", "ngau", "cool", "pro", "smart"],
//   },
//   {
//     name: "✨ Tỏa sáng",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2728.png",
//     category: "funny",
//     keywords: ["lap lanh", "sao", "sparkles", "bright", "magic"],
//   },
//   {
//     name: "🥳 Tiệc tùng",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f973.png",
//     category: "funny",
//     keywords: ["vui ve", "party", "celebrate", "happy"],
//   },
//   {
//     name: "🤩 Ngưỡng mộ",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f929.png",
//     category: "funny",
//     keywords: ["mat sao", "vip", "star eyes", "admire", "wow"],
//   },

//   // Chúc mừng (Congrats)
//   {
//     name: "🎉 Chúc mừng",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f389.png",
//     category: "congrats",
//     keywords: ["chuc mung", "phao hoa", "tada", "congrats", "party"],
//   },
//   {
//     name: "👍 Tuyệt vời",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f44d.png",
//     category: "congrats",
//     keywords: ["like", "tot", "tuyet", "thumbs up", "good"],
//   },
//   {
//     name: "👏 Vỗ tay",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f44f.png",
//     category: "congrats",
//     keywords: ["vo tay", "hoan ho", "clapping", "bravo"],
//   },
//   {
//     name: "💖 Yêu thương nhiều",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f496.png",
//     category: "congrats",
//     keywords: ["trai tim lap lanh", "yeu quy", "love", "heart"],
//   },
//   {
//     name: "📖 Sách mở",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f4d6.png",
//     category: "study",
//     keywords: ["sach mo", "book", "open", "doc", "study"],
//   },
//   {
//     name: "✏️ Bút chì",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/270f.png",
//     category: "study",
//     keywords: ["but chi", "pencil", "viet", "write", "study"],
//   },
//   {
//     name: "🏫 Trường học",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f3eb.png",
//     category: "study",
//     keywords: ["truong hoc", "school", "study"],
//   },
//   {
//     name: "⭐ Ngôi sao",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2b50.png",
//     category: "motivation",
//     keywords: ["sao", "star", "hot", "motivation", "win"],
//   },
//   {
//     name: "🎯 Mục tiêu",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f3af.png",
//     category: "motivation",
//     keywords: ["muc tieu", "target", "bullseye", "focus", "motivation"],
//   },
//   {
//     name: "🦁 Sư tử dũng mãnh",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f981.png",
//     category: "motivation",
//     keywords: ["su tu", "lion", "brave", "strong", "motivation"],
//   },
//   {
//     name: "🤝 Đồng hành",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f91d.png",
//     category: "emotion",
//     keywords: ["bat tay", "handshake", "dong hanh", "help", "team"],
//   },
//   {
//     name: "🤗 Ôm ấm áp",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f917.png",
//     category: "emotion",
//     keywords: ["om", "hug", "cam xuc", "emotion", "friendly"],
//   },
//   {
//     name: "😢 Tiếc nuối",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f622.png",
//     category: "emotion",
//     keywords: ["buon", "khoc nhe", "sad", "cry", "emotion"],
//   },
//   {
//     name: "🤪 Nhí nhố",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f92a.png",
//     category: "funny",
//     keywords: ["nghich", "funny", "crazy", "vui"],
//   },
//   {
//     name: "👻 Con ma vui vẻ",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f47b.png",
//     category: "funny",
//     keywords: ["con ma", "ghost", "funny", "cuoi", "treu"],
//   },
//   {
//     name: "😸 Mèo vui sướng",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f638.png",
//     category: "funny",
//     keywords: ["meo cuoi", "cat", "happy", "funny"],
//   },
//   {
//     name: "🥂 Cạn ly ăn mừng",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f942.png",
//     category: "congrats",
//     keywords: ["chuc mung", "can ly", "cheers", "congrats"],
//   },
//   {
//     name: "🎖️ Huy chương danh dự",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f396.png",
//     category: "congrats",
//     keywords: ["huy chuong", "medal", "congrats", "win"],
//   },
//   {
//     name: "🎈 Bong bóng bay",
//     url: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f388.png",
//     category: "congrats",
//     keywords: ["bong bong", "balloon", "congrats", "party"],
//   },
// ];

// export const GIFS_LIBRARY: StickerGifItem[] = [
//   // Học tập (Study)
//   {
//     name: "Cố gắng học tập ✍️",
//     url: "https://i.giphy.com/6XX4V0O8a0xdS.gif",
//     category: "study",
//     keywords: ["hoc tap", "study", "viet bai", "write", "focus", "anime"],
//   },
//   {
//     name: "Đọc sách thư giãn 📚",
//     url: "https://i.giphy.com/d31w24psGYeekCZy.gif",
//     category: "study",
//     keywords: ["doc sach", "read", "book", "chill", "thu gian"],
//   },
//   {
//     name: "Tập trung tối đa 🧠",
//     url: "https://i.giphy.com/1oBwBVLGoLteCP2kyD.gif",
//     category: "study",
//     keywords: ["tap trung", "suy nghi", "think", "focus", "work"],
//   },
//   {
//     name: "Nghiên cứu hăng say 🔬",
//     url: "https://i.giphy.com/l0K408vxIo667ELyo.gif",
//     category: "study",
//     keywords: ["tim toi", "nghien cuu", "hoc tap", "science", "look"],
//   },

//   // Động lực (Motivation)
//   {
//     name: "Cố lên bạn ơi! 🔥",
//     url: "https://i.giphy.com/g9kHnL5ReUUww.gif",
//     category: "motivation",
//     keywords: ["co len", "fighting", "quyet tam", "power", "minions"],
//   },
//   {
//     name: "Quyết tâm chiến thắng 🚀",
//     url: "https://i.giphy.com/KEVNWkmWm6dm8.gif",
//     category: "motivation",
//     keywords: ["quyet tam", "but pha", "fighting", "co len", "yes"],
//   },
//   {
//     name: "Tự tin tỏa sáng ✨",
//     url: "https://i.giphy.com/1CUPpMbgUPCvRXdpc3.gif",
//     category: "motivation",
//     keywords: ["tu tin", "meo ngau", "cool", "confidence", "cat"],
//   },
//   {
//     name: "Bắt đầu thôi! 🏁",
//     url: "https://i.giphy.com/l0G18VkBYupF9ja36.gif",
//     category: "motivation",
//     keywords: ["bat dau", "dong y", "san sang", "ready", "go", "start"],
//   },

//   // Cảm xúc (Emotion)
//   {
//     name: "Gửi cái ôm ấm áp 🤗",
//     url: "https://i.giphy.com/ABjJcFelbuanC.gif",
//     category: "emotion",
//     keywords: ["om", "chia se", "comfort", "hug", "love", "cute"],
//   },
//   {
//     name: "Vỗ về an ủi 🌸",
//     url: "https://i.giphy.com/xcIlI0798VgnPYUQwj.gif",
//     category: "emotion",
//     keywords: ["an ui", "vo ve", "comfort", "pat", "cat", "cute"],
//   },
//   {
//     name: "Khóc một chút rồi thôi 😭",
//     url: "https://i.giphy.com/59d1zo8SUSaUU.gif",
//     category: "emotion",
//     keywords: ["khoc", "buon", "cry", "sad", "comfort"],
//   },
//   {
//     name: "Thở phào nhẹ nhõm 😌",
//     url: "https://i.giphy.com/5tmRHwTlHAA9WkVxTU.gif",
//     category: "emotion",
//     keywords: ["nhe nhom", "het ap luc", "relief", "sigh", "happy"],
//   },

//   // Vui nhộn (Funny)
//   {
//     name: "Cười sảng khoái 😂",
//     url: "https://i.giphy.com/3o7TKSjRrfIPjeiVyM.gif",
//     category: "funny",
//     keywords: ["cuoi", "funny", "haha", "laugh", "happy"],
//   },
//   {
//     name: "Mèo nhảy múa 🐱",
//     url: "https://i.giphy.com/wW95fEq09hOI8.gif",
//     category: "funny",
//     keywords: ["nhay mua", "dance", "meo", "funny", "cat"],
//   },
//   {
//     name: "Thả tim ngập tràn 💖",
//     url: "https://i.giphy.com/paXjnIZYvglz2.gif",
//     category: "funny",
//     keywords: ["trai tim", "love", "heart", "cute", "dễ thương"],
//   },
//   {
//     name: "Xin chào bạn nhé 👋",
//     url: "https://i.giphy.com/qGvmdlfJ0FtBSwxqA3.gif",
//     category: "funny",
//     keywords: ["xin chao", "hello", "hi", "welcome"],
//   },

//   // Chúc mừng (Congrats)
//   {
//     name: "Tuyệt vời quá! 🎉",
//     url: "https://i.giphy.com/879RsXB8GvEuY95LNl.gif",
//     category: "congrats",
//     keywords: ["tuyet voi", "chuc mung", "awesome", "great", "congrats"],
//   },
//   {
//     name: "Vỗ tay tán thưởng 👏",
//     url: "https://i.giphy.com/tODygE8KCqBzy.gif",
//     category: "congrats",
//     keywords: ["vo tay", "hoan ho", "applause", "clapping", "good"],
//   },
//   {
//     name: "Bắn pháo hoa ăn mừng 🎆",
//     url: "https://i.giphy.com/26tOZ42Mg6pbTUPHW.gif",
//     category: "congrats",
//     keywords: ["phao hoa", "chuc mung", "celebrate", "party", "fireworks"],
//   },
//   {
//     name: "Cảm ơn rất nhiều! 🙏",
//     url: "https://i.giphy.com/26gsjCZpPolPr3sBy.gif",
//     category: "congrats",
//     keywords: ["cam on", "thank you", "thanks", "appreciate"],
//   },
//   {
//     name: "Chăm chỉ học bài ✍️",
//     url: "https://i.giphy.com/SgltyjZnNFBoFFvcg4.gif",
//     category: "study",
//     keywords: ["viet", "write", "study", "anime", "hard"],
//   },
//   {
//     name: "Học nhóm thảo luận 👥",
//     url: "https://i.giphy.com/fSYjlNlW2eDJCSgGvt.gif",
//     category: "study",
//     keywords: ["thao luan", "hoc nhom", "study", "group", "discuss"],
//   },
//   {
//     name: "Hành động ngay! 💪",
//     url: "https://i.giphy.com/UqZ4imFIoljlr5O2sM.gif",
//     category: "motivation",
//     keywords: ["quyet tam", "do it", "shia", "motivation", "fight"],
//   },
//   {
//     name: "Thành công xuất sắc 🎯",
//     url: "https://i.giphy.com/OoTKFwKiOAbYc.gif",
//     category: "motivation",
//     keywords: ["thanh cong", "win", "kid", "motivation", "success"],
//   },
//   {
//     name: "Buồn rười rượi 😢",
//     url: "https://i.giphy.com/ISOckXUybVfQ4.gif",
//     category: "emotion",
//     keywords: ["buon", "sad", "stitch", "emotion", "cry"],
//   },
//   {
//     name: "Gửi tình yêu thương ❤️",
//     url: "https://i.giphy.com/5OqXb948EBkyUcnwHt.gif",
//     category: "emotion",
//     keywords: ["om", "hug", "love", "emotion", "bear"],
//   },
//   {
//     name: "Minion cười ngặt nghẽo 😂",
//     url: "https://i.giphy.com/11s7Ke7jcNxCHS.gif",
//     category: "funny",
//     keywords: ["cuoi", "minion", "laugh", "funny", "lol"],
//   },
//   {
//     name: "Mèo quẩy hết mình 🕺",
//     url: "https://i.giphy.com/GeimqsH0TLDt4tScGw.gif",
//     category: "funny",
//     keywords: ["nhay", "cat", "dance", "funny", "happy"],
//   },
//   {
//     name: "Tiệc tùng tưng bừng 🎉",
//     url: "https://i.giphy.com/dq5W62htggVeOI7oO6.gif",
//     category: "congrats",
//     keywords: ["party", "celebrate", "congrats", "fun"],
//   },
//   {
//     name: "Pháo hoa rực rỡ 🎆",
//     url: "https://i.giphy.com/13n4Hd98ewKJsQ.gif",
//     category: "congrats",
//     keywords: ["phao hoa", "congrats", "beautiful", "fireworks"],
//   },
// ];
