"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/components/AuthProvider";
import { PromptswapAPI } from "./api";

export function useAuth() {
  return useContext(AuthContext);
}

export function useBalance() {
  const { token } = useAuth();
  const [balance, setBalance] = useState<{
    balance_cents: number;
    swap_credits: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const api = new PromptswapAPI(token);
      const data = await api.balance();
      setBalance(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { balance, loading, refresh };
}

export function useJobs(role?: string) {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const api = new PromptswapAPI(token);
      const data = await api.listJobs(role);
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { jobs, loading, refresh };
}
