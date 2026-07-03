import { ImageResponse } from "next/og";

// Favicon — matches the PWA app icon (icon-192/512): the aura ring glowing
// on deep space.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "3px solid #00e5a0",
            boxShadow: "0 0 6px 1px rgba(0,229,160,0.7)",
          }}
        />
      </div>
    ),
    size,
  );
}
