"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useBalance } from "@/lib/hooks";
import { PromptswapAPI } from "@/lib/api";

const MODELS = [
  { label: "Ollama", value: "prompt" },
  { label: "Claude Sonnet", value: "claude-sonnet" },
  { label: "Claude Opus", value: "claude-opus" },
  { label: "Claude Haiku", value: "claude-haiku" },
  { label: "Codex", value: "codex" },
];

export default function PromptPage() {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const { balance, refresh: refreshBalance } = useBalance();
  const [model, setModel] = useState("claude-sonnet");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "polling" | "done" | "error"
  >("idle");
  const [meta, setMeta] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  if (authLoading || !token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  async function submit() {
    if (!prompt.trim() || status === "submitting" || status === "polling")
      return;

    setResponse("");
    setError("");
    setMeta("");
    setStatus("submitting");

    const api = new PromptswapAPI(token!);

    try {
      // Try swap first
      let job;
      let usedSwap = false;

      try {
        job = await api.quickJob(model, prompt.trim(), 0, { swap: true });
        usedSwap = true;
      } catch {
        // Swap failed, try paid
        job = await api.quickJob(model, prompt.trim(), 5);
      }

      const cost = usedSwap
        ? `swap (${job.swap_credit_cost || 1} credit${(job.swap_credit_cost || 1) > 1 ? "s" : ""})`
        : `paid ($${((job.price_cents || 5) / 100).toFixed(2)})`;
      setMeta(`Job #${job.id} — ${cost}`);

      // Check if result is already available
      if (job.delivery_body) {
        setResponse(job.delivery_body);
        setStatus("done");
        refreshBalance();
        return;
      }

      // Poll for result
      setStatus("polling");
      const timeout = 120_000;
      const start = Date.now();

      while (Date.now() - start < timeout) {
        await sleep(2000);
        const updated = await api.getJob(job.id);

        if (updated.delivery_body) {
          setResponse(updated.delivery_body);
          setStatus("done");
          refreshBalance();
          return;
        }

        if (
          updated.status === "cancelled" ||
          updated.status === "expired"
        ) {
          setError(`Job ${updated.status}`);
          setStatus("error");
          return;
        }
      }

      setError("Timed out waiting for response");
      setStatus("error");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prompt Runner</h1>
        {balance && (
          <div className="text-xs font-mono text-muted">
            <span className="text-accent-violet">
              {balance.swap_credits} credits
            </span>
            {" | "}
            <span className="text-success">
              ${(balance.balance_cents / 100).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Model selector */}
      <div className="mb-4">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          {MODELS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Prompt input */}
      <div className="mb-4">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your prompt..."
          rows={4}
          className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none font-mono"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted">
            {status === "idle" ? (
              <>Cmd+Enter to submit</>
            ) : status === "submitting" ? (
              <>Submitting...</>
            ) : status === "polling" ? (
              <>Waiting for response...</>
            ) : null}
          </span>
          <button
            onClick={submit}
            disabled={
              !prompt.trim() ||
              status === "submitting" ||
              status === "polling"
            }
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" || status === "polling"
              ? "Running..."
              : "Run"}
          </button>
        </div>
      </div>

      {/* Meta info */}
      {meta && (
        <div className="mb-2 text-xs font-mono text-muted">{meta}</div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Response */}
      {response && (
        <div
          ref={responseRef}
          className="rounded-lg border border-border bg-code-bg p-4 text-sm leading-relaxed font-mono whitespace-pre-wrap"
        >
          {response}
        </div>
      )}
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
