import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Lock, PlayCircle, Sparkles } from "lucide-react";

import heroIllustration from "@/assets/hero-illustration.png";
import {
  COURSE_THEME_COPY,
  COURSES_PAGE_COPY,
  LESSON_DISPLAY_BY_SLUG,
} from "@/content/pageCopy";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, apiRequest } from "@/lib/api/client";
import type { Lesson } from "@/types/api";

type CourseTheme = (typeof COURSE_THEME_COPY)[number] & {
  lessons: Lesson[];
};

function getLessonDisplay(lesson: Lesson) {
  const display = LESSON_DISPLAY_BY_SLUG[lesson.slug as keyof typeof LESSON_DISPLAY_BY_SLUG];

  return {
    ...lesson,
    title: display?.title ?? lesson.title,
    summary: display?.summary ?? lesson.summary,
  };
}

function buildThemes(lessons: Lesson[]): CourseTheme[] {
  return COURSE_THEME_COPY.map((definition) => ({
    ...definition,
    lessons: lessons.filter((lesson) => definition.orders.includes(lesson.order)),
  })).filter((theme) => theme.lessons.length > 0);
}

export default function CoursesPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeThemeId, setActiveThemeId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void apiRequest<Lesson[]>("/lessons")
      .then((data) => {
        setLessons(data);
        setError(null);
      })
      .catch((requestError) => {
        setError(requestError instanceof ApiError ? requestError.message : COURSES_PAGE_COPY.loadError);
      });
  }, []);

  const displayLessons = useMemo(() => lessons.map(getLessonDisplay), [lessons]);
  const themes = useMemo(() => buildThemes(displayLessons), [displayLessons]);

  useEffect(() => {
    if (!activeThemeId && themes[0]) {
      setActiveThemeId(themes[0].id);
    }
  }, [activeThemeId, themes]);

  const activeTheme = themes.find((theme) => theme.id === activeThemeId) ?? themes[0];
  const nextLesson = displayLessons.find((lesson) => !user?.completedLessons.includes(lesson.slug)) ?? displayLessons[0];

  return (
    <div className="min-h-screen pb-16 pt-8">
      <div className="container mx-auto px-4">
        <section className="rounded-[2.4rem] border border-white/65 bg-[linear-gradient(135deg,rgba(255,230,240,0.88)_0%,rgba(246,241,255,0.96)_48%,rgba(227,245,255,0.88)_100%)] p-6 shadow-card md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex rounded-full bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary shadow-soft">
                {COURSES_PAGE_COPY.eyebrow}
              </span>
              <h1 className="mt-5 max-w-[14ch] font-heading text-4xl font-bold leading-[1.06] tracking-[-0.03em] md:text-5xl">
                <span className="block">{COURSES_PAGE_COPY.titleLine1}</span>
                <span className="block">{COURSES_PAGE_COPY.titleLine2}</span>
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/74 md:text-lg">
                {COURSES_PAGE_COPY.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/74 p-5 shadow-soft"
            >
              <div className="mb-4 flex items-center justify-between rounded-full bg-background/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <span>{COURSES_PAGE_COPY.imageTopLeft}</span>
                <span>{themes.length} {COURSES_PAGE_COPY.imageTopRightSuffix}</span>
              </div>
              <img
                src={heroIllustration}
                alt={COURSES_PAGE_COPY.imageAlt}
                className="mx-auto max-h-[300px] w-full object-contain"
              />
            </motion.div>
          </div>
        </section>

        {error ? <div className="mt-6 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}

        <section className="mt-8">
          <div className="grid gap-5 lg:grid-cols-3">
            {themes.map((theme, index) => (
              <motion.button
                key={theme.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                onClick={() => setActiveThemeId(theme.id)}
                className={`overflow-hidden rounded-[2rem] border border-white/70 p-0 text-left shadow-card transition-all ${
                  activeTheme?.id === theme.id ? "ring-2 ring-primary/25" : ""
                }`}
              >
                <div className={`${theme.accentClass} h-full p-6`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-soft">
                      {theme.badge}
                    </span>
                    <span className="rounded-full bg-background/88 px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {theme.lessons.length} bài
                    </span>
                  </div>

                  <h2 className="mt-5 font-heading text-2xl font-bold">{theme.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-foreground/74">{theme.summary}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {activeTheme ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
            <div className="space-y-6">
              <div className={`rounded-[2.2rem] border border-white/70 p-6 shadow-card ${activeTheme.accentClass}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-white/86 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-soft">
                    {COURSES_PAGE_COPY.activeBadge}
                  </span>
                  <span className="inline-flex rounded-full bg-background/80 px-4 py-2 text-xs font-semibold text-muted-foreground">
                    {activeTheme.lessons.length} {COURSES_PAGE_COPY.activeLessonsSuffix}
                  </span>
                </div>
                <h2 className="mt-5 font-heading text-3xl font-bold">{activeTheme.title}</h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/76">{activeTheme.summary}</p>
              </div>

              <div className="space-y-4">
                {activeTheme.lessons.map((lesson, index) => {
                  const completed = user?.completedLessons.includes(lesson.slug);
                  const locked = !lesson.isFree && (!user || user.plan === "free");

                  const content = (
                    <article className="rounded-[1.8rem] border border-white/70 bg-card/84 p-5 shadow-card transition-shadow hover:shadow-hover">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] ${
                            completed ? "bg-mint/25 text-mint-foreground" : "bg-lavender/25 text-lavender-foreground"
                          }`}
                        >
                          {completed ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-lg font-bold">{lesson.order}</span>}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-heading text-xl font-bold leading-snug">{lesson.title}</h3>
                            {lesson.isFree ? (
                              <span className="rounded-full bg-teal/12 px-3 py-1 text-xs font-semibold text-teal-foreground">
                                {COURSES_PAGE_COPY.freeBadge}
                              </span>
                            ) : (
                              <span className="rounded-full bg-pink/12 px-3 py-1 text-xs font-semibold text-pink-foreground">
                                {COURSES_PAGE_COPY.extendedBadge}
                              </span>
                            )}
                            {completed ? (
                              <span className="rounded-full bg-mint/12 px-3 py-1 text-xs font-semibold text-mint-foreground">
                                {COURSES_PAGE_COPY.completedBadge}
                              </span>
                            ) : null}
                            {locked ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                                <Lock className="h-3.5 w-3.5" />
                                {COURSES_PAGE_COPY.lockedBadge}
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-3 text-sm leading-6 text-muted-foreground">{lesson.summary}</p>
                        </div>
                      </div>
                    </article>
                  );

                  return (
                    <motion.div
                      key={lesson.slug}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04 }}
                    >
                      {locked ? content : <Link to={`/lesson/${lesson.slug}`}>{content}</Link>}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[2rem] gradient-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                    <PlayCircle className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{COURSES_PAGE_COPY.nextTitle}</p>
                    <h3 className="font-heading text-xl font-bold">{nextLesson?.title ?? COURSES_PAGE_COPY.noLesson}</h3>
                  </div>
                </div>
                {nextLesson ? (
                  <Link
                    to={`/lesson/${nextLesson.slug}`}
                    className="mt-4 inline-flex rounded-full gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
                  >
                    {COURSES_PAGE_COPY.nextAction}
                  </Link>
                ) : null}
              </div>

              <div className="rounded-[2rem] gradient-card p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{COURSES_PAGE_COPY.switchThemeTitle}</p>
                <div className="mt-4 space-y-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setActiveThemeId(theme.id)}
                      className={`w-full rounded-[1.4rem] px-4 py-3 text-left text-sm font-semibold transition-colors ${
                        activeTheme.id === theme.id ? "bg-foreground text-background" : "bg-background/76 hover:bg-background"
                      }`}
                    >
                      {theme.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] gradient-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{COURSES_PAGE_COPY.allLessonsTitle}</p>
                    <h3 className="font-heading text-xl font-bold">{COURSES_PAGE_COPY.allLessonsSubtitle}</h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {displayLessons.map((lesson) => {
                    const completed = user?.completedLessons.includes(lesson.slug);
                    const locked = !lesson.isFree && (!user || user.plan === "free");
                    const belongsToActiveTheme = activeTheme.lessons.some((item) => item.slug === lesson.slug);

                    const itemClasses = `block rounded-[1.3rem] px-4 py-3 text-sm transition-colors ${
                      belongsToActiveTheme ? "bg-primary/10" : "bg-background/76 hover:bg-background"
                    }`;

                    const itemContent = (
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{lesson.title}</p>
                        {completed ? <CheckCircle2 className="h-4 w-4 text-mint-foreground" /> : null}
                      </div>
                    );

                    return locked ? (
                      <div key={lesson.slug} className={`${itemClasses} text-muted-foreground`}>
                        {itemContent}
                      </div>
                    ) : (
                      <Link key={lesson.slug} to={`/lesson/${lesson.slug}`} className={itemClasses}>
                        {itemContent}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] gradient-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{COURSES_PAGE_COPY.accessTitle}</p>
                    <h3 className="font-heading text-xl font-bold">Bắt đầu từ điều bạn cần nhất</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{COURSES_PAGE_COPY.accessDescription}</p>
              </div>
            </aside>
          </section>
        ) : null}
      </div>
    </div>
  );
}
