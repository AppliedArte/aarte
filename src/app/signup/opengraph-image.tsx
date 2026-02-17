import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Get AARTE — Plans starting at $79.99/mo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await fetch(
    new URL("../../../public/aarte.jpeg", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const logoBase64 = `data:image/jpeg;base64,${Buffer.from(logoData).toString("base64")}`;

  const plans = [
    { label: "MINIMUM", price: "$79", cents: ".99" },
    { label: "PREMIUM", price: "$159", cents: ".99" },
    { label: "MAXIMUM", price: "$199", cents: ".99" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          position: "relative",
          padding: "60px 80px",
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

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 48,
          }}
        >
          <img src={logoBase64} width={80} height={80} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "white",
                display: "flex",
              }}
            >
              Get AARTE
            </div>
            <div
              style={{
                fontSize: 16,
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                display: "flex",
              }}
            >
              Your Personal AI Agent
            </div>
          </div>
        </div>

        {/* Plan cards */}
        <div
          style={{
            display: "flex",
            gap: 20,
            flex: 1,
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.label}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "32px 28px",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.15em",
                  marginBottom: 16,
                  display: "flex",
                }}
              >
                {plan.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span
                  style={{
                    fontSize: 56,
                    fontWeight: 600,
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {plan.cents}
                </span>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontFamily: "monospace",
                  color: "rgba(255,255,255,0.35)",
                  marginTop: 8,
                  display: "flex",
                }}
              >
                / month
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 32,
            fontSize: 13,
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <span>aarte.co/signup</span>
          <span>Secure payment via Whop</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
