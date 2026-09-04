import type { LucideIcon } from "lucide-react";
import { Database, FileText, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/cn";

export type PolicyContext = { title: string; detail: string; source: string; icon?: LucideIcon; tone?: "neutral" | "ok" | "warn" };

const TONE = { neutral: "bg-inset text-ink-2", ok: "bg-ok-soft text-ok-strong", warn: "bg-warn-soft text-warn-strong" };
const DEFAULT_CONTEXT: PolicyContext[] = [
  { title: "Authority policy", detail: "Only approved vendors, purposes, rails, and limits can authorize an agent action.", source: "Signed mandate", icon: ShieldCheck, tone: "ok" },
  { title: "Execution evidence", detail: "Provider evidence is matched to the reserved amount and recorded exactly once.", source: "Settlement record", icon: Database, tone: "neutral" },
];

export function ContextCards({ items = DEFAULT_CONTEXT, className }: { items?: PolicyContext[]; className?: string }) {
  return <section className={cn("space-y-2", className)} aria-label="Policy context">
    <div className="flex items-center gap-2 px-0.5"><span className="text-[13px] font-semibold text-ink">Policy context</span><span className="inline-flex h-5 items-center rounded-control bg-inset px-1.5 text-[11px] font-medium text-ink-2 shadow-hairline tabular-nums">{items.length}</span></div>
    {items.map((item, index) => { const Icon = item.icon ?? FileText; return <article key={item.title} className="overflow-hidden rounded-card bg-surface shadow-card animate-fade-up" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="primitive-card-bar flex items-center gap-2.5 border-b border-line"><Icon className="h-3.5 w-3.5 text-ink-3" /><span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{item.title}</span><span className="text-[11px] text-ink-3">retrieved</span></div>
      <p className="px-3 pt-2 pb-2 text-[12.5px] leading-relaxed text-ink-2">{item.detail}</p><div className="px-3 pb-3"><span className={cn("inline-flex h-6 items-center gap-1.5 rounded-full px-2 text-[11px] font-medium shadow-btn", TONE[item.tone ?? "neutral"])}><FileText className="h-3 w-3" />{item.source}</span></div>
    </article>; })}
  </section>;
}
