"use client";

/**
 * OrientationBanner
 *
 * This component is only visible in portrait mode via CSS.
 * It encourages the user to rotate their phone for a better experience.
 * Using inline styles to guarantee visibility and colors.
 */
export default function OrientationBanner() {
  return (
    <div
      id="orientation-banner"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        display: "none", // Overridden by globals.css in portrait
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "24px",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff0080"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: "rotate(90deg)" }}
        >
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      </div>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: 300,
          marginBottom: "16px",
          fontFamily: "serif",
          fontStyle: "italic",
          color: "#ffffff",
        }}
      >
        Cinematic Mode Recommended
      </h2>

      <p
        style={{
          color: "rgba(255, 255, 255, 0.6)",
          fontSize: "14px",
          maxWidth: "280px",
          lineHeight: 1.6,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
        }}
      >
        Please rotate your phone to landscape to enter the gallery.
      </p>

      <div
        style={{
          marginTop: "32px",
          width: "48px",
          height: "1px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
      ></div>
    </div>
  );
}
