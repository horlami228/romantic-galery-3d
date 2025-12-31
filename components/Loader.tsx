"use client";
import { useProgress, Html } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div
        className="flex flex-col items-center justify-center w-screen h-screen bg-black transition-opacity duration-500"
        style={{ zIndex: 800000 }}
      >
        {/* Glowing Pink Title */}
        <h1
          className="text-2xl font-light tracking-[0.2em] text-[#ff0080] mb-2 animate-pulse"
          style={{ textShadow: "0 0 15px #ff0080" }}
        >
          CURATING MEMORIES
        </h1>

        {/* Loading Message - "The White Stuff" style */}
        <p
          className="text-sm tracking-widest text-[#eeeeee] mb-8 font-light"
          style={{ textShadow: "0 0 8px rgba(255,255,255,0.8)" }}
        >
          PREPARING YOUR JOURNEY
        </p>

        {/* Progress Bar Container */}
        <div className="w-64 h-[1px] bg-[#222] rounded-full overflow-hidden mb-4 box-content border-[0.5px] border-[#333]">
          <div
            className="h-full bg-gradient-to-r from-[#ff0080] to-[#ff69b4] shadow-[0_0_10px_#ff0080] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Info */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] text-white/50 tracking-[0.4em] font-mono uppercase">
            {progress < 100 ? "Loading Assets" : "Finalizing Scene"}
          </p>
          <p
            className="text-sm text-white tracking-[0.2em] font-medium"
            style={{
              textShadow:
                "0 0 12px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.4)",
            }}
          >
            PLEASE WAIT... {Math.round(progress)}%
          </p>
        </div>
      </div>
    </Html>
  );
}
