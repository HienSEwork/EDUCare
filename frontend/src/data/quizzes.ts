export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: 'Tuổi dậy thì thường bắt đầu ở độ tuổi nào đối với nữ?',
    options: ['5-8 tuổi', '9-14 tuổi', '16-18 tuổi', '20-25 tuổi'],
    correct: 1,
  },
  {
    question: 'Hormone nào liên quan chính đến sự phát triển của nam?',
    options: ['Estrogen', 'Insulin', 'Testosterone', 'Adrenaline'],
    correct: 2,
  },
  {
    question: 'Thiếu niên cần ngủ bao nhiêu tiếng mỗi đêm?',
    options: ['4-5 tiếng', '6-7 tiếng', '8-10 tiếng', '12-14 tiếng'],
    correct: 2,
  },
  {
    question: 'Khi gặp vấn đề trên internet, bạn nên làm gì?',
    options: ['Giữ bí mật', 'Nói với người lớn đáng tin cậy', 'Trả lời người lạ', 'Không quan tâm'],
    correct: 1,
  },
  {
    question: 'Đường dây bảo vệ trẻ em quốc gia là số nào?',
    options: ['113', '114', '111', '115'],
    correct: 2,
  },
  {
    question: 'Dấu hiệu nào cho thấy tình bạn lành mạnh?',
    options: ['Ép buộc nhau', 'Tôn trọng lẫn nhau', 'Luôn đồng ý mọi thứ', 'Giữ bí mật xấu'],
    correct: 1,
  },
  {
    question: 'Cách nào giúp quản lý stress hiệu quả?',
    options: ['Không ngủ', 'Tập thể dục', 'Ăn nhiều đồ ngọt', 'Chơi game cả ngày'],
    correct: 1,
  },
  {
    question: 'Không nên chia sẻ gì với người lạ trên mạng?',
    options: ['Sở thích âm nhạc', 'Địa chỉ nhà và số điện thoại', 'Phim yêu thích', 'Môn học yêu thích'],
    correct: 1,
  },
];
