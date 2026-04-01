import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#22d3ee",
              letterSpacing: "-2px",
            }}
          >
            promptswap
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#e5e5e5",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: "1.4",
            }}
          >
            Trade LLM capacity.
            <br />
            No API keys needed.
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                color: "#737373",
                backgroundColor: "#1a1a2e",
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid #262626",
              }}
            >
              <span style={{ color: "#34d399" }}>$</span> npm install -g
              promptswap
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
