import { ImageResponse } from "next/og";

// iOS home-screen icon — same aura ring as the favicon and PWA icons.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090c",
        }}
      >
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: "50%",
            border: "10px solid #00e5a0",
            boxShadow: "0 0 32px 4px rgba(0,229,160,0.55)",
          }}
        />
      </div>
    ),
    size,
  );
}
