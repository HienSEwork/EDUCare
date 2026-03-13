import { motion } from 'framer-motion';
import { Heart, Target, Users, Shield, BookOpen, Sparkles } from 'lucide-react';

const values = [
  { icon: Shield, title: 'An toàn', desc: 'Nội dung được kiểm duyệt kỹ lưỡng, phù hợp lứa tuổi 12-18.' },
  { icon: Heart, title: 'Tôn trọng', desc: 'Chúng tôi tôn trọng sự khác biệt và phát triển của mỗi cá nhân.' },
  { icon: BookOpen, title: 'Khoa học', desc: 'Kiến thức dựa trên nghiên cứu và được chuyên gia giáo dục xác nhận.' },
  { icon: Sparkles, title: 'Sáng tạo', desc: 'Phương pháp học thú vị qua game, quiz và nội dung tương tác.' },
];

const team = [
  { name: 'Khoa', role: 'CEO', desc: 'Chịu trách nhiệm định hướng chiến lược, xác định tầm nhìn phát triển của dự án và đại diện nhóm trong các hoạt động đối ngoại.' },
  { name: 'Hiển', role: 'CTO', desc: 'Phụ trách thiết kế kiến trúc hệ thống, đảm bảo chất lượng kỹ thuật và định hướng công nghệ cho nền tảng.' },
  { name: 'Khanh', role: 'CPO', desc: 'Phụ trách phát triển nội dung giáo dục và định hướng trải nghiệm học tập nhằm đảm bảo nội dung phù hợp với người dùng mục tiêu.' },
  { name: 'Thịnh', role: 'Software Engineer', desc: 'Chịu trách nhiệm xây dựng và phát triển hệ thống lõi của nền tảng, đảm bảo các chức năng hoạt động ổn định.' },
  { name: 'Vinh', role: 'Software Engineer', desc: 'Phát triển các tính năng và giao diện UI cho website/app, đồng thời thực hiện kiểm thử để đảm bảo chất lượng sản phẩm.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-lavender/20 text-lavender-foreground text-sm font-medium mb-6">
              🎓 Về chúng tôi
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Sứ mệnh của <span className="text-gradient">EDUcare</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              EDUcare được thành lập năm 2024 với mục tiêu trở thành nền tảng giáo dục giới tính và kỹ năng sống
              hàng đầu cho thanh thiếu niên Việt Nam, nơi mà mọi bạn trẻ đều được tiếp cận kiến thức
              chính xác, an toàn và phù hợp lứa tuổi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold mb-6 text-center">Câu chuyện của chúng tôi</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  EDUcare ra đời từ nhận thấy rằng hàng triệu thanh thiếu niên Việt Nam đang bước vào tuổi dậy thì
                  mà không có đủ kiến thức và sự hỗ trợ cần thiết. Nhiều bạn trẻ tìm kiếm thông tin trên internet
                  nhưng gặp phải nội dung sai lệch, không phù hợp hoặc thậm chí có hại.
                </p>
                <p>
                  Chúng tôi tin rằng mỗi bạn trẻ đều xứng đáng được học hỏi về cơ thể mình, cảm xúc của mình
                  và cách xây dựng các mối quan hệ lành mạnh trong một môi trường an toàn, thân thiện và
                  không phán xét.
                </p>
                <p>
                  Với đội ngũ chuyên gia giáo dục, tâm lý học và công nghệ, EDUcare mang đến trải nghiệm
                  học tập hiện đại kết hợp giữa bài học chất lượng, trò chơi tương tác và cộng đồng hỗ trợ
                  để giúp các bạn trẻ tự tin trưởng thành.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="gradient-card rounded-2xl p-8 shadow-card">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-bold mb-3">Sứ mệnh</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cung cấp kiến thức giáo dục giới tính, sức khỏe tinh thần và kỹ năng sống chính xác,
                khoa học và phù hợp lứa tuổi cho thanh thiếu niên Việt Nam thông qua công nghệ hiện đại.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="gradient-card rounded-2xl p-8 shadow-card">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-bold mb-3">Tầm nhìn</h3>
              <p className="text-muted-foreground leading-relaxed">
                Trở thành nền tảng giáo dục giới tính #1 Đông Nam Á, nơi mọi bạn trẻ đều được
                trang bị kiến thức để tự tin bước vào cuộc sống trưởng thành.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-12 text-center">Giá trị cốt lõi</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="gradient-card rounded-2xl p-6 shadow-card text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-4 text-center">Đội ngũ sáng lập</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Những người đứng sau EDUcare với niềm đam mê giáo dục và công nghệ.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {team.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="gradient-card rounded-2xl p-6 shadow-card text-center">
                <div className="w-20 h-20 rounded-full bg-lavender/30 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {t.name.charAt(0)}
                </div>
                <h3 className="font-heading font-bold mb-1">{t.name}</h3>
                <span className="text-xs text-primary font-semibold">{t.role}</span>
                <p className="text-sm text-muted-foreground mt-2">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-12">Con số ấn tượng</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { num: '5,000+', label: 'Học sinh' },
              { num: '10+', label: 'Bài học' },
              { num: '8+', label: 'Bài blog' },
              { num: '95%', label: 'Hài lòng' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-heading font-bold text-gradient">{s.num}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
