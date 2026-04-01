import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-sm text-muted sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono text-accent">
            promptswap
          </Link>
          <span>Peer-to-peer LLM marketplace</span>
        </div>
        <div className="flex gap-6">
          <Link href="/docs" className="hover:text-foreground transition-colors">
            Docs
          </Link>
          <a
            href="https://github.com/zack-eth/promptswap"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
