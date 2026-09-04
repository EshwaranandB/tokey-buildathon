import { Check, CircleDotDashed, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/cn";

const STEPS = ["Intent evaluated", "Approval required", "Reservation issued", "Evidence captured"];
export function ApprovalTrace({ active = 1 }: { active?: number }) {
  return <ol className="grid gap-1.5 sm:grid-cols-4" aria-label="Spend authorization progress">
    {STEPS.map((label, index) => { const complete = index < active; const current = index === active; return <li key={label} className={cn("flex items-center gap-2 rounded-control px-2 py-1.5 text-[11px]", complete ? "bg-ok-soft text-ok-strong" : current ? "bg-warn-soft text-warn-strong" : "bg-inset text-ink-3")}>{complete ? <Check className="h-3.5 w-3.5" /> : current ? <CircleDotDashed className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}<span className="truncate">{label}</span></li>; })}
  </ol>;
}
