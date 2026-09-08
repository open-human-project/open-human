import { ImageResponse } from "next/og";

export const alt = "Open Human — The open-source manual for being human";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#f5f2e9",
          color: "#18231f",
          fontFamily: "Georgia",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #18231f",
              borderRadius: "50%",
              fontFamily: "Arial",
              fontSize: 19,
            }}
          >
            +
          </div>
          <span style={{ fontFamily: "Arial", fontSize: 22, fontWeight: 600 }}>Open Human</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ margin: "0 0 22px", fontFamily: "Arial", fontSize: 16, letterSpacing: "0.16em", textTransform: "uppercase", color: "#67716c" }}>
            An open knowledge project
          </p>
          <p style={{ maxWidth: 960, margin: 0, fontSize: 70, lineHeight: 1.03, letterSpacing: "-0.04em" }}>
            You were born human. Nobody gave you the manual.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 24, borderTop: "1px solid rgba(24,35,31,.25)", fontFamily: "Arial", fontSize: 14, color: "#67716c" }}>
          <span>Understand yourself. Understand humans. Understand the world.</span>
          <span>Awareness over obedience.</span>
        </div>
      </div>
    ),
    size,
  );
}
