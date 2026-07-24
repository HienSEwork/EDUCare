import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { CONTACT_PAGE_COPY } from "@/content/socialCopy";

const icons = [Mail, Phone, MapPin] as const;

export default function ContactPage() {
  return (
    <div className="min-h-screen relative overflow-hidden -mt-24 pt-36 pb-20 md:-mt-28 md:pt-44 text-slate-100 font-body"
      style={{ background: "linear-gradient(160deg, #0a071e 0%, #120c38 45%, #1f1254 100%)" }}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute left-1/3 bottom-10 h-[450px] w-[450px] rounded-full bg-pink-500/15 blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <section className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-950/60 px-5 py-2 text-xs font-extrabold tracking-widest text-cyan-300 uppercase backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              {CONTACT_PAGE_COPY.eyebrow}
            </span>
            <h1 className="mx-auto max-w-4xl font-heading text-4xl font-extrabold leading-tight text-white md:text-5xl">
              {CONTACT_PAGE_COPY.title}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-indigo-100/80">
              {CONTACT_PAGE_COPY.description}
            </p>
          </motion.div>
        </section>

        <section className="mb-12">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {CONTACT_PAGE_COPY.cards.map((card, index) => {
              const Icon = icons[index];

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[1.9rem] border border-indigo-500/25 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-indigo-950/80 border border-indigo-400/30">
                    <Icon className="h-7 w-7 text-cyan-300" />
                  </div>
                  <h2 className="font-heading text-xl font-extrabold text-white">{card.title}</h2>
                  <p className="mt-3 text-lg font-bold text-amber-300">{card.value}</p>
                  <p className="mt-3 text-sm leading-relaxed text-indigo-100/80">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl rounded-[2.2rem] border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-indigo-950/80 border border-indigo-400/30">
                <ShieldCheck className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-white">{CONTACT_PAGE_COPY.supportTitle}</h2>
                <p className="mt-2 text-sm leading-relaxed text-indigo-100/80">{CONTACT_PAGE_COPY.supportDescription}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
