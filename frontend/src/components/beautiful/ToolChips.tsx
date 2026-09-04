import { CheckCircle2, Fingerprint, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/cn";

const TOOLS = [
  { label: "Mandate checked", Icon: ShieldCheck, tone: "text-ok-strong bg-ok-soft" },
  { label: "Human approval", Icon: CheckCircle2, tone: "text-warn-strong bg-warn-soft" },
  { label: "Evidence bound", Icon: Fingerprint, tone: "text-info-strong bg-info-soft" },
];

export function ToolChips({ className }: { className?: string }) {
  return <div className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label="Tokey control layers">
    {TOOLS.map(({ label, Icon, tone }) => <span key={label} className={cn("inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium shadow-btn", tone)}><Icon className="h-3.5 w-3.5" />{label}</span>)}
  </div>;
}
