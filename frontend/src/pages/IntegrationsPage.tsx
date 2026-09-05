import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { integrations } from "../lib/integrations";
import { Badge } from "../components/primitives/Badge";
import { SectionHeader } from "../components/primitives/Card";
import { Input } from "../components/primitives/Input";

export function IntegrationsPage() {
  const [query,setQuery]=useState("");
  const [group,setGroup]=useState("All");
  const groups=["All",...new Set(integrations.map(i=>i.group))];
  const visible=integrations.filter(i=>(group==="All" || i.group===group) && (i.name+" "+i.description).toLowerCase().includes(query.toLowerCase()));
  return <div className="mx-auto max-w-6xl space-y-6">
    <SectionHeader title="Integrations" description="Bring your agent runtime. Govern its authority in Tokey. Execute through supported payment adapters."/>
    <p className="text-xs text-ink-3">Catalogue and integration roadmap. Historical proof does not indicate current connectivity. Planned and unverified entries are not active connections.</p>
    <Input aria-label="Search integrations" placeholder="Search runtimes, workflows, channels or rails…" value={query} onChange={e=>setQuery(e.target.value)}/>
    <div className="flex flex-wrap gap-2" aria-label="Integration categories">{groups.map(g=><button key={g} type="button" aria-pressed={group===g} onClick={()=>setGroup(g)} className={"rounded-control px-3 py-2 text-xs transition-colors "+(group===g?"bg-ink text-surface":"bg-inset text-ink-2 hover:bg-hover")}>{g}</button>)}</div>
    {groups.slice(1).map(g=>{
      const items=visible.filter(i=>i.group===g);
      if(!items.length)return null;
      return <section key={g}><h2 className="mb-3 text-xs font-semibold text-ink-2">{g}</h2><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(item=><Link key={item.id} to={"/integrations/"+item.id} className="group rounded-card border border-line bg-surface p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card motion-reduce:transform-none">
          <div className="mb-4 flex items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-control bg-white text-xs font-semibold text-black">
            {item.logo ? <img src={"/brands/"+item.logo} width="28" height="28" alt="" className="size-7 object-contain"/> : item.name.slice(0,3)}
          </div><h3 className="flex-1 text-sm font-semibold text-ink">{item.name}</h3><ArrowUpRight className="size-4 text-ink-3"/></div>
          <p className="min-h-12 text-xs leading-5 text-ink-3">{item.description}</p>
          <Badge tone={item.status==="Alpha"?"warn":"neutral"} className="mt-4">{item.status}</Badge>
        </Link>)}
      </div></section>;
    })}
    {!visible.length && <p role="status" className="text-sm text-ink-3">No integrations match this search.</p>}
  </div>;
}
