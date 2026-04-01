import Link from "next/link";
import Terminal from "@/components/Terminal";

const features = [
  {
    title: "Swap Credits",
    description:
      "Earn credits by selling your local LLM capacity. Spend them to use Claude, Ollama, or any model on the network. No money needed.",
    icon: "\u21C4",
  },
  {
    title: "OpenAI-Compatible Proxy",
    description:
      "Run promptswap proxy and get a local endpoint that works with any tool expecting the OpenAI API. Cursor, Continue, Python \u2014 they all just work.",
    icon: "\u26A1",
  },
  {
    title: "One-Command Integrations",
    description:
      "Connect your favorite tools instantly. promptswap connect cursor sets up everything. Works with Cursor, Continue, OpenClaw, Python, and curl.",
    icon: "\u2692",
  },
  {
    title: "Agent-Ready",
    description:
      "Built for both humans and AI agents. CLI pipes, Claude Code /use skill, and a clean API. Agents can buy and sell capacity programmatically.",
    icon: "\u2699",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-24 pb-20 text-center">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Trade LLM capacity.{" "}
          <span className="text-accent">No API keys needed.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Peer-to-peer marketplace where developers share LLM access using swap
          credits. Sell your local Ollama, earn credits, use Claude for free.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <div className="rounded-lg border border-border bg-code-bg px-5 py-3 font-mono text-sm">
            <span className="text-success">$</span>{" "}
            <span>npm install -g promptswap</span>
          </div>
          <Link
            href="/prompt"
            className="rounded-lg bg-accent px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Try in Browser
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold">How it works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Install & Setup",
                code: "$ npm i -g promptswap\n$ promptswap setup",
                desc: "One command to install globally. Setup creates your account and configures everything.",
              },
              {
                step: "2",
                title: "Earn Credits",
                code: "$ promptswap earn ollama",
                desc: "Host your local LLM and earn swap credits every time someone uses it.",
              },
              {
                step: "3",
                title: "Use Any Model",
                code: '$ use claude "explain monads"',
                desc: "Spend credits to use Claude, Ollama, or any model on the network. Swap first, pay only if needed.",
              },
            ].map(({ step, title, code, desc }) => (
              <div
                key={step}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 font-mono text-sm font-bold text-accent">
                  {step}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <pre className="mt-3 rounded border-0 bg-code-bg px-3 py-2 text-xs">
                  {code}
                </pre>
                <p className="mt-3 text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold">Features</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {features.map(({ title, description, icon }) => (
              <div
                key={title}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <div className="mb-3 text-2xl">{icon}</div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="border-t border-border px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold">Quick Start</h2>
          <div className="mt-10">
            <Terminal
              title="getting started"
              lines={[
                "# Install promptswap",
                "$ npm install -g promptswap",
                "",
                "# One-time setup (creates account, installs integrations)",
                "$ promptswap setup",
                "",
                "# Start earning swap credits with your local model",
                "$ promptswap earn ollama",
                "",
                "# Use Claude for free with your earned credits",
                '$ use claude "explain monads in simple terms"',
                "",
                "# Or connect your favorite tool",
                "$ promptswap connect cursor --local",
              ]}
            />
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/docs"
              className="text-sm text-accent hover:underline"
            >
              Read the full docs &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border px-6 py-20 text-center">
        <h2 className="text-2xl font-bold">Get started in 60 seconds</h2>
        <p className="mt-3 text-muted">
          No API keys. No credit card. Just install and start swapping.
        </p>
        <div className="mt-8 inline-block rounded-lg border border-border bg-code-bg px-5 py-3 font-mono text-sm">
          <span className="text-success">$</span>{" "}
          <span>npm install -g promptswap</span>
        </div>
      </section>
    </div>
  );
}
