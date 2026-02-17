import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AARTE — Applied Artificial Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await fetch(
    new URL("../../public/aarte.jpeg", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const logoBase64 = `data:image/jpeg;base64,${Buffer.from(logoData).toString("base64")}`;

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
          position: "relative",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top border accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            display: "flex",
          }}
        />

        {/* Logo */}
        <img
          src={logoBase64}
          width={280}
          height={280}
          style={{
            marginBottom: 32,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Applied Artificial Intelligence
        </div>

        {/* Bottom info bar */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 32,
            fontSize: 14,
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <span>aarte.co</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span>Your Personal AI Agent</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span>100% Private</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
