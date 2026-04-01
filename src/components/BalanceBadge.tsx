"use client";

import { useAuth } from "@/lib/hooks";
import { useBalance } from "@/lib/hooks";

export default function BalanceBadge() {
  const { token } = useAuth();
  const { balance } = useBalance();

  if (!token || !balance) return null;

  return (
    <div className="flex items-center gap-2 rounded-md bg-surface px-2.5 py-1 text-xs font-mono">
      <span className="text-accent-violet">
        {balance.swap_credits} credits
      </span>
      <span className="text-border">|</span>
      <span className="text-success">
        ${(balance.balance_cents / 100).toFixed(2)}
      </span>
    </div>
  );
}
