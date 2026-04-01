const TOKEN_KEY = "promptswap_token";
const USERNAME_KEY = "promptswap_username";

const ADJECTIVES = [
  "swift", "bright", "calm", "dark", "eager", "fair", "glad", "keen",
  "bold", "cool", "dry", "fast", "gold", "high", "iron", "jade",
  "kind", "lean", "mild", "neat", "pale", "rare", "sage", "tall",
  "vast", "warm", "wild", "zinc", "blue", "red", "gray", "deep",
];
const NOUNS = [
  "fox", "owl", "elk", "bee", "cod", "eel", "jay", "ram",
  "yak", "bat", "cat", "dog", "ant", "ape", "hen", "hog",
  "lion", "bear", "deer", "duck", "frog", "goat", "hawk", "lynx",
  "mole", "newt", "seal", "slug", "swan", "toad", "wolf", "wren",
];

function randomUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}-${noun}-${num}`;
}

function randomPassword(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USERNAME_KEY);
}

export function saveAuth(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export async function register(): Promise<{
  token: string;
  username: string;
}> {
  const username = randomUsername();
  const password = randomPassword();

  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "register", username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");

  const token = data.token;
  const finalUsername = data.user?.username || username;
  saveAuth(token, finalUsername);
  return { token, username: finalUsername };
}

export async function login(
  username: string,
  password: string
): Promise<{ token: string; username: string }> {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");

  const token = data.token;
  const finalUsername = data.user?.username || username;
  saveAuth(token, finalUsername);
  return { token, username: finalUsername };
}
