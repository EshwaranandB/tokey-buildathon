export type Integration = { id: string; name: string; group: string; description: string; status: string; logo?: string; url?: string };
export const integrations: Integration[] = [
  { id: "openclaw", name: "OpenClaw", group: "Agent runtimes", description: "External runtime using Tokey MCP; historical authority inspection demonstrated.", status: "Historical proof", logo: "openclaw.png", url: "https://openclaw.ai" },
  { id: "codex", name: "Codex", group: "Agent runtimes", description: "OpenAI coding agent. Direct Tokey runtime setup has not been independently verified.", status: "Setup unverified", logo: "openai.png", url: "https://openai.com/codex/" },
  { id: "claude-code", name: "Claude Code", group: "Agent runtimes", description: "Anthropic coding agent. Tokey connection has not been verified.", status: "Setup unverified", logo: "claude.png", url: "https://code.claude.com" },
  { id: "gemini-cli", name: "Gemini CLI", group: "Agent runtimes", description: "Google terminal agent. Tokey connection has not been verified.", status: "Setup unverified", logo: "gemini.png", url: "https://geminicli.com" },
  { id: "cursor", name: "Cursor", group: "Agent runtimes", description: "Coding workspace. Tokey connection has not been verified.", status: "Setup unverified", logo: "cursor.png", url: "https://cursor.com" },
  { id: "copilot", name: "GitHub Copilot", group: "Agent runtimes", description: "GitHub coding agent. Tokey connection has not been verified.", status: "Setup unverified", logo: "github.svg", url: "https://github.com/features/copilot" },
  { id: "custom-agent", name: "Custom agent", group: "Agent runtimes", description: "Use the authenticated Core HTTP or MCP contract with a provisioned agent credential.", status: "API contract" },
  { id: "openai-agents", name: "OpenAI Agents SDK", group: "Orchestration", description: "Agent workflow framework. Tokey adapter setup remains unverified.", status: "Setup unverified", logo: "openai.png", url: "https://openai.github.io/openai-agents-python/" },
  { id: "langgraph", name: "LangGraph", group: "Orchestration", description: "Stateful agent orchestration. A Tokey workflow adapter is planned.", status: "Planned", logo: "langchain.png", url: "https://www.langchain.com/langgraph" },
  { id: "crewai", name: "CrewAI", group: "Orchestration", description: "Multi-agent workflows. A Tokey workflow adapter is planned.", status: "Planned", logo: "crewai.ico", url: "https://www.crewai.com" },
  { id: "n8n", name: "n8n", group: "Orchestration", description: "Automation workflows. A Tokey workflow adapter is planned.", status: "Planned", url: "https://n8n.io" },
  { id: "telegram", name: "Telegram", group: "Channels", description: "Historical TON/OpenClaw authority inspection; current channel connectivity is not queried.", status: "Historical proof", logo: "telegram.png", url: "https://telegram.org" },
  { id: "razorpay", name: "Razorpay", group: "Payment rails", description: "FitFuel Test Mode merchant proof. Inspect capture receipts returned by Core.", status: "Recorded evidence", logo: "razorpay.png", url: "https://razorpay.com" },
  { id: "x402", name: "x402", group: "Payment rails", description: "Experimental execution path; settlement has not been live-verified.", status: "Alpha" },
  { id: "stripe", name: "Stripe", group: "Payment rails", description: "Future payment adapter. No Tokey execution connection is configured here.", status: "Planned", logo: "stripe.svg", url: "https://stripe.com" },
  { id: "upi", name: "UPI", group: "Payment rails", description: "Future direct rail support; not a separately verified Tokey integration.", status: "Planned" },
];
