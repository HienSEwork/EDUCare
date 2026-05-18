import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Gamepad2, HeartHandshake, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import heroImg from "@/assets/hero-illustration.png";
import MoodTracker from "@/components/MoodTracker";
import AnonymousQuestionBox from "@/components/AnonymousQuestionBox";
import RandomAdvice from "@/components/RandomAdvice";
import { HOME_COPY } from "@/content/experienceCopy";

const featureIcons = [BookOpen, Shield, Gamepad2, Users, HeartHandshake] as const;
const featureColors = [
  "bg-pink/30 text-pink-foreground",
  "bg-lavender/30 text-lavender-foreground",
  "bg-teal/30 text-teal-foreground",
  "bg-peach/30 text-peach-foreground",
  "bg-mint/30 text-mint-foreground",
] as const;

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="gradient-hero -mt-24 overflow-hidden pb-12 pt-36 md:-mt-28 md:pb-16 md:pt-40">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
              <p className="mb-5 inline-flex rounded-full bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                {HOME_COPY.eyebrow}
              </p>
              <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">
                {HOME_COPY.titleLine1}
                <span className="block text-gradient">{HOME_COPY.titleLine2}</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">{HOME_COPY.description}</p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to={user ? "/dashboard" : "/register"}>
                  <Button size="lg" className="gradient-primary px-8 text-primary-foreground">
                    {user ? HOME_COPY.primaryActionLoggedIn : HOME_COPY.primaryActionGuest}
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="outline" className="px-8">
                    {HOME_COPY.secondaryAction}
                  </Button>
                </Link>
              </div>

              <div className="mt-10 grid max-w-md grid-cols-3 gap-6">
                {HOME_COPY.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-heading text-3xl font-bold text-gradient">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="relative">
              <div className="absolute -left-4 top-12 hidden w-56 rounded-[1.75rem] bg-card/85 p-4 shadow-card lg:block">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{HOME_COPY.heroNoteTitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{HOME_COPY.heroNoteDescription}</p>
              </div>
              <img src={heroImg} alt="EDUcare hero" className="mx-auto w-full max-w-[760px] drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-3xl font-bold">{HOME_COPY.toolsTitle}</h2>
            <p className="mt-2 text-muted-foreground">{HOME_COPY.toolsDescription}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <MoodTracker />
            <AnonymousQuestionBox />
            <RandomAdvice />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold">{HOME_COPY.reasonsTitle}</h2>
            <p className="mt-2 text-muted-foreground">{HOME_COPY.reasonsDescription}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {HOME_COPY.features.map((feature, index) => {
              const Icon = featureIcons[index];
              const color = featureColors[index];

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="gradient-card rounded-[1.75rem] p-6 shadow-card"
                >
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-heading text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
