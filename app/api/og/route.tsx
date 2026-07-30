import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/utils";

export const runtime = "edge";

// Dynamic 1200x630 Open Graph image showing the article title.
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawTitle = searchParams.get("title") ?? siteConfig.name;
  const title = rawTitle.slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #10b981, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
            }}
          >
            ⬢
          </div>
          <div style={{ display: "flex", fontSize: "34px", fontWeight: 700, color: "#f8fafc" }}>
            Stack<span style={{ color: "#10b981" }}>FromZero</span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? "56px" : "68px",
            fontWeight: 800,
            color: "#f8fafc",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>

        {/* Footer accent */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "120px",
              height: "8px",
              borderRadius: "4px",
              background: "linear-gradient(90deg, #10b981, #0ea5e9)",
            }}
          />
          <div style={{ display: "flex", fontSize: "28px", color: "#94a3b8" }}>
            Learn React &amp; Spring Boot from zero
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
