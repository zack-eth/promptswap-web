export interface NavItem {
  title: string;
  href: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const docsNav: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Installation", href: "/docs/installation" },
      { title: "Setup", href: "/docs/setup" },
      { title: "Quick Start", href: "/docs/quick-start" },
    ],
  },
  {
    title: "Concepts",
    items: [
      { title: "How Swap Credits Work", href: "/docs/swap-credits" },
    ],
  },
  {
    title: "CLI Reference",
    items: [
      { title: "Commands", href: "/docs/cli-reference" },
    ],
  },
  {
    title: "Providers",
    items: [
      { title: "Ollama", href: "/docs/providers/ollama" },
      { title: "Claude", href: "/docs/providers/claude" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { title: "Cursor", href: "/docs/integrations/cursor" },
      { title: "Continue", href: "/docs/integrations/continue" },
      { title: "OpenClaw", href: "/docs/integrations/openclaw" },
      { title: "Python", href: "/docs/integrations/python" },
      { title: "curl", href: "/docs/integrations/curl" },
      { title: "AI Agents", href: "/docs/integrations/agents" },
    ],
  },
  {
    title: "Advanced",
    items: [
      { title: "Proxy Server", href: "/docs/proxy" },
      { title: "Daemon Mode", href: "/docs/daemon" },
    ],
  },
];

export const MODEL_TAGS: Record<string, string> = {
  ollama: "prompt",
  claude: "claude-sonnet",
  opus: "claude-opus",
  sonnet: "claude-sonnet",
  haiku: "claude-haiku",
  codex: "codex",
};
