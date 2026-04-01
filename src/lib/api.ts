export class PromptswapAPI {
  constructor(private token: string) {}

  private async request(method: string, path: string, body?: unknown) {
    const res = await fetch(
      `/api/proxy?path=${encodeURIComponent(path)}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  me() {
    return this.request("GET", "/me");
  }

  balance() {
    return this.request("GET", "/wallet/balance");
  }

  quickJob(
    tag: string,
    description: string,
    priceCents: number,
    opts: { swap?: boolean; seller?: string } = {}
  ) {
    const body: Record<string, unknown> = {
      tag,
      description,
      auto_complete: true,
    };
    if (opts.swap) {
      body.swap = true;
    } else {
      body.price_cents = priceCents;
    }
    if (opts.seller) body.seller_username = opts.seller;
    return this.request("POST", "/marketplace/quick", body);
  }

  getJob(id: number) {
    return this.request("GET", `/marketplace/jobs/${id}`);
  }

  listJobs(role?: string, status?: string) {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (status) params.set("status", status);
    return this.request("GET", `/marketplace/jobs?${params}`);
  }

  swapHistory() {
    return this.request("GET", "/wallet/swap_history");
  }

  searchServices(tag: string) {
    const params = new URLSearchParams({ tag, auto_accept: "true" });
    return this.request("GET", `/marketplace/services?${params}`);
  }
}
