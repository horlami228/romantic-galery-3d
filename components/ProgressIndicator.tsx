"use client";

export default function ProgressIndicator() {
  return (
    <div
      id="progress-indicator-container"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        pointerEvents: "none",
        // Initially hide or keep at 0
      }}
    >
      {/* Progress Bar */}
      <div
        style={{
          width: "120px",
          height: "4px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          id="progress-bar-fill"
          style={{
            width: "0%",
            height: "100%",
            backgroundColor: "#ff0080",
            borderRadius: "2px",
            transition: "width 0.1s ease-out",
          }}
        />
      </div>

      {/* Label */}
      <span
        id="progress-text"
        style={{
          fontSize: "10px",
          color: "rgba(255, 255, 255, 0.5)",
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        0% explored
      </span>
    </div>
  );
}
