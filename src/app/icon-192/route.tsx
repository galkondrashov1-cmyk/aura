import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export function GET() {
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
            width: 112,
            height: 112,
            borderRadius: "50%",
            border: "10px solid #00e5a0",
            boxShadow: "0 0 34px 4px rgba(0,229,160,0.55)",
          }}
        />
      </div>
    ),
    { width: 192, height: 192 },
  );
}
