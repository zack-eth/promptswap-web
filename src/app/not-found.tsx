import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="font-mono text-6xl font-bold text-accent">404</div>
      <p className="mt-4 text-lg text-muted">Page not found.</p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Home
        </Link>
        <Link
          href="/docs"
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          Docs
        </Link>
      </div>
    </div>
  );
}
