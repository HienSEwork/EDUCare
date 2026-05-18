import { motion } from "framer-motion";
import { BookOpen, Heart, Shield, Sparkles, Target } from "lucide-react";
import { ABOUT_PAGE_COPY } from "@/content/socialCopy";

const values = [
  {
    icon: Shield,
    title: "An toàn",
    description: "Nội dung được chọn lọc để phù hợp với độ tuổi, dễ tiếp cận và tôn trọng cảm xúc của người học.",
  },
  {
    icon: Heart,
    title: "Đồng hành",
    description: "EDUcare ưu tiên cảm giác được lắng nghe và được dẫn dắt nhẹ nhàng hơn là tạo áp lực.",
  },
  {
    icon: BookOpen,
    title: "Rõ ràng",
    description: "Bài học, bài viết và trò chơi đều dùng ngôn ngữ gần gũi để người dùng hiểu ngay từ lần đầu tiếp cận.",
  },
  {
    icon: Sparkles,
    title: "Tích cực",
    description: "Mỗi trải nghiệm đều hướng tới việc giúp tuổi teen thấy mình tiến bộ hơn, an tâm hơn và tự tin hơn.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto space-y-8 px-4">
        <section className="theme-section overflow-hidden rounded-[2.5rem] border border-white/60 bg-[linear-gradient(135deg,rgba(255,232,241,0.92)_0%,rgba(245,241,255,0.96)_50%,rgba(227,245,255,0.88)_100%)] px-6 py-12 shadow-card md:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex rounded-full bg-white/82 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary shadow-soft">
                {ABOUT_PAGE_COPY.eyebrow}
              </span>
              <h1 className="mx-auto mt-6 max-w-4xl font-heading text-4xl font-bold leading-tight md:text-5xl">
                {ABOUT_PAGE_COPY.title}
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{ABOUT_PAGE_COPY.description}</p>
            </motion.div>
          </div>
        </section>

        <section className="surface-panel rounded-[2.2rem] p-8 md:p-10">
          <h2 className="font-heading text-3xl font-bold">{ABOUT_PAGE_COPY.storyTitle}</h2>
          <div className="mt-6 space-y-4 text-base leading-8 text-muted-foreground">
            {ABOUT_PAGE_COPY.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="surface-panel rounded-[2rem] p-8"
          >
            <Target className="mb-4 h-12 w-12 text-primary" />
            <h3 className="font-heading text-2xl font-bold">{ABOUT_PAGE_COPY.missionTitle}</h3>
            <p className="mt-4 leading-8 text-muted-foreground">{ABOUT_PAGE_COPY.mission}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="surface-panel-soft rounded-[2rem] p-8"
          >
            <Sparkles className="mb-4 h-12 w-12 text-primary" />
            <h3 className="font-heading text-2xl font-bold">{ABOUT_PAGE_COPY.visionTitle}</h3>
            <p className="mt-4 leading-8 text-muted-foreground">{ABOUT_PAGE_COPY.vision}</p>
          </motion.div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="surface-panel rounded-[1.8rem] p-6"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary/10">
                <value.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}
