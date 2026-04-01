import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://promptswap.dev";

export const metadata: Metadata = {
  title: {
    default: "promptswap — peer-to-peer LLM marketplace",
    template: "%s | promptswap",
  },
  description:
    "Trade LLM capacity with swap credits. Sell your local Ollama, earn credits, use Claude for free. No API keys needed.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "promptswap — peer-to-peer LLM marketplace",
    description:
      "Trade LLM capacity with swap credits. No API keys needed.",
    url: SITE_URL,
    siteName: "promptswap",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "promptswap — peer-to-peer LLM marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "promptswap — peer-to-peer LLM marketplace",
    description:
      "Trade LLM capacity with swap credits. No API keys needed.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
