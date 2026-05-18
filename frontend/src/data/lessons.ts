export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  isFree: boolean;
}

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    title: "Tuổi dậy thì là gì?",
    order: 1,
    isFree: true,
    content: `Tuổi dậy thì là giai đoạn cơ thể bắt đầu chuyển từ trẻ em sang trưởng thành. Đây là một quá trình tự nhiên mà hầu như ai cũng sẽ trải qua.

Trong giai đoạn này, cơ thể và cảm xúc thay đổi khá nhanh. Bạn có thể cao lên, thay đổi giọng nói, để ý hơn đến ngoại hình hoặc thấy tâm trạng lên xuống thất thường.

Điều quan trọng là hiểu rằng mỗi người phát triển theo một tốc độ khác nhau. Không có chuyện “đúng chuẩn” phải giống hệt bạn bè cùng tuổi.`,
  },
  {
    id: "lesson-2",
    title: "Hormone và sự phát triển",
    order: 2,
    isFree: true,
    content: `Hormone là những chất giúp cơ thể điều phối quá trình phát triển. Trong tuổi dậy thì, hormone đóng vai trò rất lớn trong việc tạo ra những thay đổi về thể chất và cảm xúc.

Ở mỗi người, sự thay đổi có thể đến sớm hoặc muộn hơn một chút. Điều đó hoàn toàn bình thường.

Thay vì lo lắng, hãy xem đây là tín hiệu cho thấy cơ thể bạn đang lớn lên theo cách riêng.`,
  },
  {
    id: "lesson-3",
    title: "Thay đổi cơ thể ở nam",
    order: 3,
    isFree: true,
    content: `Ở nam, tuổi dậy thì thường đi kèm với việc tăng chiều cao, vai rộng hơn, giọng nói trầm hơn và cơ bắp phát triển rõ hơn.

Bạn cũng có thể thấy lông cơ thể xuất hiện nhiều hơn hoặc bắt đầu quan tâm hơn tới mùi cơ thể và vệ sinh cá nhân.

Mỗi thay đổi đều là một phần tự nhiên của quá trình trưởng thành.`,
  },
  {
    id: "lesson-4",
    title: "Thay đổi cơ thể ở nữ",
    order: 4,
    isFree: false,
    content: `Ở nữ, tuổi dậy thì thường gắn với sự phát triển vòng ngực, thay đổi vóc dáng và bắt đầu chu kỳ kinh nguyệt.

Những thay đổi này đôi khi khiến bạn bỡ ngỡ hoặc thiếu tự tin. Điều đó là dễ hiểu.

Hiểu đúng về cơ thể sẽ giúp bạn chăm sóc bản thân tốt hơn và bớt lo lắng hơn.`,
  },
  {
    id: "lesson-5",
    title: "Thay đổi cảm xúc",
    order: 5,
    isFree: false,
    content: `Trong tuổi teen, cảm xúc có thể thay đổi nhanh. Có lúc bạn vui, có lúc lại buồn hoặc cáu gắt mà không rõ lý do.

Điều này có thể đến từ hormone, áp lực học tập, mối quan hệ với bạn bè hoặc gia đình.

Nhận diện cảm xúc của mình là bước đầu để học cách quản lý chúng.`,
  },
  {
    id: "lesson-6",
    title: "Tự tin về bản thân",
    order: 6,
    isFree: false,
    content: `Tự tin không có nghĩa là lúc nào cũng thấy mình giỏi. Tự tin là chấp nhận bản thân và dám thử những điều mới.

Bạn có thể bắt đầu bằng việc ghi lại điểm mạnh của mình, đặt mục tiêu nhỏ và ngừng so sánh bản thân với người khác trên mạng xã hội.

Sự tự tin được xây dựng từng ngày, không phải xuất hiện ngay lập tức.`,
  },
  {
    id: "lesson-7",
    title: "Tình bạn và các mối quan hệ",
    order: 7,
    isFree: false,
    content: `Tình bạn là một phần rất quan trọng của tuổi teen. Một mối quan hệ lành mạnh cần có sự tôn trọng, lắng nghe và cảm giác an toàn.

Nếu ai đó khiến bạn thường xuyên áp lực, bị ép buộc hoặc không được là chính mình, đó là dấu hiệu bạn cần nhìn lại mối quan hệ ấy.

Bạn xứng đáng có những kết nối tích cực và tử tế.`,
  },
  {
    id: "lesson-8",
    title: "An toàn trên internet",
    order: 8,
    isFree: false,
    content: `Internet rất hữu ích nhưng cũng có rủi ro. Bạn không nên chia sẻ thông tin cá nhân như địa chỉ, số điện thoại hoặc trường học cho người lạ.

Nếu gặp nội dung quấy rối, đe dọa hoặc khiến bạn sợ hãi, hãy chụp lại bằng chứng và nói với người lớn đáng tin cậy.

Biết cách bảo vệ mình trên mạng cũng quan trọng như ngoài đời thực.`,
  },
  {
    id: "lesson-9",
    title: "Quản lý cảm xúc",
    order: 9,
    isFree: false,
    content: `Quản lý cảm xúc không có nghĩa là kìm nén chúng. Đó là biết dừng lại, gọi tên cảm xúc và chọn cách phản ứng phù hợp.

Bạn có thể thử viết nhật ký, hít thở sâu, đi bộ, nghe nhạc hoặc chia sẻ với người mình tin tưởng.

Những việc nhỏ nhưng đều đặn có thể giúp tâm trạng ổn định hơn nhiều.`,
  },
  {
    id: "lesson-10",
    title: "Tìm kiếm sự giúp đỡ",
    order: 10,
    isFree: false,
    content: `Nếu bạn thấy quá áp lực, buồn kéo dài hoặc mất hứng thú với mọi thứ, việc tìm sự giúp đỡ là rất cần thiết.

Bạn có thể bắt đầu từ cha mẹ, thầy cô, người thân đáng tin cậy hoặc chuyên gia tâm lý.

Nhờ hỗ trợ không phải là yếu đuối. Đó là một cách bảo vệ chính mình.`,
  },
];
