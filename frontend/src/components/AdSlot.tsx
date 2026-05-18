import { AD_SLOT_COPY } from "@/content/experienceCopy";

interface AdSlotProps {
  title?: string;
  className?: string;
}

export default function AdSlot({ title = "Góc nội dung tài trợ", className = "" }: AdSlotProps) {
  return (
    <div className={`rounded-[1.75rem] border border-dashed border-primary/20 bg-card/70 p-4 shadow-soft ${className}`}>
      <div className="flex min-h-24 items-center justify-between gap-4 rounded-[1.25rem] bg-gradient-to-r from-pink/10 via-lavender/10 to-teal/10 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{AD_SLOT_COPY.eyebrow}</p>
          <p className="mt-1 font-heading text-lg font-bold">{title}</p>
        </div>
        <p className="max-w-xs text-right text-sm text-muted-foreground">{AD_SLOT_COPY.description}</p>
      </div>
    </div>
  );
}
