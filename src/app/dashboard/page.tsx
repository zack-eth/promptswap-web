"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useBalance, useJobs } from "@/lib/hooks";
import { PromptswapAPI } from "@/lib/api";

interface Job {
  id: number;
  tag: string;
  status: string;
  buyer: string;
  seller: string | null;
  price_cents: number;
  swap: boolean;
  swap_credit_cost: number;
  created_at: string;
  description?: string;
}

interface SwapEntry {
  id: number;
  amount: number;
  reason: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { token, username, loading: authLoading } = useAuth();
  const { balance, loading: balanceLoading, refresh: refreshBalance } = useBalance();
  const [tab, setTab] = useState<"buyer" | "seller">("buyer");
  const { jobs, loading: jobsLoading, refresh: refreshJobs } = useJobs(tab);
  const [swapHistory, setSwapHistory] = useState<SwapEntry[]>([]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token, router]);

  useEffect(() => {
    if (!token) return;
    const api = new PromptswapAPI(token);
    api
      .swapHistory()
      .then((data) => setSwapHistory(Array.isArray(data) ? data : []))
      .catch(() => setSwapHistory([]));
  }, [token]);

  if (authLoading || !token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  const typedJobs = jobs as Job[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <span className="text-sm text-muted font-mono">{username}</span>
      </div>

      {/* Balance card */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-xs text-muted uppercase tracking-wider mb-1">
            Balance
          </div>
          <div className="text-2xl font-bold font-mono text-success">
            {balanceLoading
              ? "..."
              : `$${((balance?.balance_cents || 0) / 100).toFixed(2)}`}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-xs text-muted uppercase tracking-wider mb-1">
            Swap Credits
          </div>
          <div className="text-2xl font-bold font-mono text-accent-violet">
            {balanceLoading ? "..." : balance?.swap_credits || 0}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="text-xs text-muted uppercase tracking-wider mb-1">
            Jobs
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {jobsLoading ? "..." : typedJobs.length}
          </div>
        </div>
      </div>

      {/* Job history */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Job History</h2>
          <div className="flex gap-1 rounded-lg bg-surface p-1">
            {(["buyer", "seller"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1 text-xs transition-colors ${
                  tab === t
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                As {t === "buyer" ? "Buyer" : "Seller"}
              </button>
            ))}
          </div>
        </div>

        {jobsLoading ? (
          <div className="text-sm text-muted">Loading...</div>
        ) : typedJobs.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-6 text-center text-sm text-muted">
            No jobs found as {tab}.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-3 py-2 text-left font-semibold text-muted">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-muted">
                    Tag
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-muted">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-muted">
                    Mode
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-muted">
                    {tab === "buyer" ? "Seller" : "Buyer"}
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-muted">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {typedJobs.map((job) => (
                  <tr key={job.id} className="border-b border-border">
                    <td className="px-3 py-2 font-mono text-muted">
                      #{job.id}
                    </td>
                    <td className="px-3 py-2 font-mono">{job.tag}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {job.swap ? (
                        <span className="text-accent-violet">
                          swap ({job.swap_credit_cost})
                        </span>
                      ) : (
                        <span className="text-success">
                          ${(job.price_cents / 100).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-mono text-muted">
                      {tab === "buyer"
                        ? job.seller || "open"
                        : job.buyer}
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Swap history */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Swap History</h2>
        {swapHistory.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-6 text-center text-sm text-muted">
            No swap transactions yet.
          </div>
        ) : (
          <div className="space-y-2">
            {swapHistory.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
              >
                <div>
                  <span className="text-sm">{entry.reason}</span>
                  <span className="ml-2 text-xs text-muted">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`font-mono text-sm font-semibold ${
                    entry.amount > 0 ? "text-success" : "text-accent-violet"
                  }`}
                >
                  {entry.amount > 0 ? "+" : ""}
                  {entry.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    requested: "bg-yellow-900/30 text-yellow-400",
    accepted: "bg-blue-900/30 text-blue-400",
    delivered: "bg-green-900/30 text-green-400",
    cancelled: "bg-red-900/30 text-red-400",
    expired: "bg-red-900/30 text-red-400",
  };

  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-mono ${
        colors[status] || "bg-surface text-muted"
      }`}
    >
      {status}
    </span>
  );
}
