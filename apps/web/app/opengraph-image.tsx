import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} — Reputation & review platform`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#fafafa" }}>{siteConfig.name}</div>
        <div style={{ marginTop: 24, fontSize: 34, color: "#a1a1aa", maxWidth: 900 }}>
          Turn customer feedback into your best growth channel
        </div>
      </div>
    ),
    { ...size },
  );
}
