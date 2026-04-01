"use client";

import { useRef } from "react";
import CopyButton from "./CopyButton";

export default function CodeBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLPreElement>(null);

  function getText() {
    return ref.current?.textContent || "";
  }

  return (
    <div className="group relative mb-4">
      <pre
        ref={ref}
        className="rounded-lg border border-border bg-code-bg p-4 text-sm leading-relaxed overflow-x-auto"
      >
        {children}
      </pre>
      <CopyButton text={getText()} />
    </div>
  );
}
