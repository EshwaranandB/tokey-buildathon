import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandMenu } from "../command/CommandMenu";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full bg-canvas">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1 overflow-auto px-6 py-5">{children}</main>
      </div>
      <CommandMenu />
    </div>
  );
}
