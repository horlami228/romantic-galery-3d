"use client";
import { useEffect, useState, useRef } from "react";

export interface ArtData {
  url: string;
  title: string;
  description: string;
}

export default function ArtOverlay({
  art,
  onClose,
}: {
  art: ArtData | null;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [currentArt, setCurrentArt] = useState<ArtData | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(
        window.innerWidth > window.innerHeight && window.innerHeight < 600
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (art) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setCurrentArt(art);
      setIsRendered(true);
      // Small delay to ensure render before animation starts
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      timeoutRef.current = setTimeout(() => {
        setIsRendered(false);
        setCurrentArt(null);
      }, 500); // Match transition duration
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [art]);

  if (!isRendered || !currentArt) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isLandscape ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          gap: isLandscape ? "40px" : "0",
          transform: isVisible
            ? "scale(1) translateY(0)"
            : "scale(0.9) translateY(20px)",
          opacity: isVisible ? 1 : 0,
          transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {/* Image */}
        <img
          src={currentArt.url}
          alt={currentArt.title}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: isLandscape ? "50dvw" : "85dvw",
            maxHeight: isLandscape ? "80dvh" : "50dvh",
            objectFit: "contain",
            borderRadius: "4px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />

        {/* Text Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isLandscape ? "flex-start" : "center",
            textAlign: isLandscape ? "left" : "center",
            maxWidth: isLandscape ? "400px" : "500px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: isLandscape ? "0" : "32px",
              padding: isLandscape ? "0" : "0 24px",
            }}
          >
            <h2
              style={{
                color: "white",
                fontSize: isLandscape ? "24px" : "28px",
                fontWeight: 300,
                fontFamily: "serif",
                marginBottom: "16px",
                letterSpacing: "0.05em",
              }}
            >
              {currentArt.title}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: isLandscape ? "15px" : "17px",
                fontStyle: "italic",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              {currentArt.description}
            </p>
          </div>

          {/* Close Hint */}
          <button
            onClick={onClose}
            style={{
              marginTop: isLandscape ? "24px" : "40px",
              background: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.5)",
              padding: "8px 24px",
              borderRadius: "20px",
              fontSize: "12px",
              letterSpacing: "0.2em",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
