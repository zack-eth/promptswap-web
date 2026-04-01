import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NETWIRC_API_URL || "https://netwirc.com";

async function proxyRequest(req: NextRequest, method: string) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  const url = `${API_BASE}/api/v1${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const auth = req.headers.get("authorization");
  if (auth) {
    headers["Authorization"] = auth;
  }

  const opts: RequestInit = { method, headers };
  if (method !== "GET" && method !== "HEAD") {
    try {
      const body = await req.json();
      opts.body = JSON.stringify(body);
    } catch {
      // no body
    }
  }

  const res = await fetch(url, opts);
  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest) {
  return proxyRequest(req, "GET");
}

export async function POST(req: NextRequest) {
  return proxyRequest(req, "POST");
}

export async function PATCH(req: NextRequest) {
  return proxyRequest(req, "PATCH");
}

export async function DELETE(req: NextRequest) {
  return proxyRequest(req, "DELETE");
}
