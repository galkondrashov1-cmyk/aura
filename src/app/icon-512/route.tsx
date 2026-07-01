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
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "26px solid #00e5a0",
            boxShadow: "0 0 90px 10px rgba(0,229,160,0.55)",
          }}
        />
      </div>
    ),
    { width: 512, height: 512 },
  );
}
