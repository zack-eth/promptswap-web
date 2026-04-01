import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NETWIRC_API_URL || "https://netwirc.com";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, username, password } = body;

  const endpoint =
    action === "register" ? "/api/v1/auth/sign_up" : "/api/v1/auth/sign_in";

  const payload: Record<string, string> = { username, password };
  if (action === "register") {
    payload.password_confirmation = password;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || "Authentication failed" },
      { status: res.status }
    );
  }

  // Join marketplace room on registration
  if (action === "register" && data.token) {
    try {
      await fetch(`${API_BASE}/api/v1/rooms/marketplace/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      // non-critical
    }
  }

  return NextResponse.json(data);
}
