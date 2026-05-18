import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { CONTACT_PAGE_COPY } from "@/content/socialCopy";

const icons = [Mail, Phone, MapPin] as const;

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="mb-6 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary shadow-soft">
              {CONTACT_PAGE_COPY.eyebrow}
            </span>
            <h1 className="mx-auto max-w-4xl font-heading text-4xl font-bold leading-tight md:text-5xl">
              {CONTACT_PAGE_COPY.title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              {CONTACT_PAGE_COPY.description}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
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
                  className="rounded-[1.9rem] gradient-card p-6 shadow-card"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="font-heading text-xl font-bold">{card.title}</h2>
                  <p className="mt-3 text-lg font-semibold text-foreground">{card.value}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-[2.2rem] gradient-card p-8 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary/10">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold">{CONTACT_PAGE_COPY.supportTitle}</h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">{CONTACT_PAGE_COPY.supportDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
