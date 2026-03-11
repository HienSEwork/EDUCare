export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  avatar: string;
}

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Minh Anh', xp: 2450, streak: 15, avatar: '👩‍🎓' },
  { rank: 2, name: 'Đức Huy', xp: 2100, streak: 12, avatar: '👨‍🎓' },
  { rank: 3, name: 'Thanh Hà', xp: 1980, streak: 10, avatar: '🧑‍💻' },
  { rank: 4, name: 'Quang Minh', xp: 1750, streak: 8, avatar: '🎓' },
  { rank: 5, name: 'Thu Trang', xp: 1600, streak: 7, avatar: '📚' },
  { rank: 6, name: 'Hoàng Nam', xp: 1450, streak: 6, avatar: '🌟' },
  { rank: 7, name: 'Ngọc Linh', xp: 1300, streak: 5, avatar: '💫' },
  { rank: 8, name: 'Văn Khoa', xp: 1150, streak: 4, avatar: '🎯' },
  { rank: 9, name: 'Phương Mai', xp: 1000, streak: 3, avatar: '🏆' },
  { rank: 10, name: 'Tuấn Kiệt', xp: 850, streak: 2, avatar: '⭐' },
];
