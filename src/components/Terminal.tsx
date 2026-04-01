"use client";

import { useState } from "react";

interface TerminalProps {
  lines: string[];
  title?: string;
}

export default function Terminal({ lines, title = "terminal" }: TerminalProps) {
  const [copied, setCopied] = useState(false);

  const text = lines.join("\n");

  function copy() {
    // Copy only the command lines (starting with $), stripping the $ prefix
    const commands = lines
      .filter((l) => l.startsWith("$ "))
      .map((l) => l.slice(2))
      .join("\n");
    navigator.clipboard.writeText(commands || text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-border bg-code-bg overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 text-xs text-muted">{title}</span>
        </div>
        <button
          onClick={copy}
          className="text-xs text-muted hover:text-foreground transition-colors"
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>
      <pre className="m-0 rounded-none border-0 p-4 text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div key={i}>
            {line.startsWith("$ ") ? (
              <>
                <span className="text-success">$</span>
                <span className="text-foreground">{line.slice(1)}</span>
              </>
            ) : line.startsWith("# ") ? (
              <span className="text-muted">{line}</span>
            ) : (
              <span className="text-muted">{line}</span>
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}
