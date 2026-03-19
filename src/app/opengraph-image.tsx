import { ImageResponse } from "next/og";

export const alt = "Wesley Ramalho — Senior Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#0a0a0a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "80px",
        position: "relative",
      }}
    >
      {/* Subtle grid accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Top-right dot */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 80,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#F4F4F5",
        }}
      />
      {/* Name */}
      <div
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: "#F4F4F5",
          letterSpacing: "-3px",
          lineHeight: 1,
        }}
      >
        wesley ramalho
      </div>
      {/* Title */}
      <div
        style={{
          fontSize: 18,
          color: "#71717A",
          letterSpacing: "6px",
          textTransform: "uppercase",
          marginTop: 20,
        }}
      >
        Senior Software Engineer · AI Specialist
      </div>
    </div>,
    size,
  );
}
