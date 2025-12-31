"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioManager({
  started,
  doorOpen,
  isArtActive,
}: {
  started: boolean;
  doorOpen: boolean;
  isArtActive: boolean;
}) {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const airRef = useRef<HTMLAudioElement | null>(null);
  const footstepsRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatRef = useRef<HTMLAudioElement | null>(null);
  const doorSfxRef = useRef<HTMLAudioElement | null>(null);
  const confettiSfxRef = useRef<HTMLAudioElement | null>(null);
  const lightSfxRef = useRef<HTMLAudioElement | null>(null);
  const shimmerSfxRef = useRef<HTMLAudioElement | null>(null);
  const whooshSfxRef = useRef<HTMLAudioElement | null>(null);

  const [muted, setMuted] = useState(false);
  const lastOffset = useRef(0);
  const footstepTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevIsArtActive = useRef(isArtActive);

  useEffect(() => {
    // Background Music
    bgmRef.current = new Audio(
      "https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/Fireboy-DML-Like-I-Do-%5BTrendyBeatz.com%5D.mp3"
    );
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.4;

    // Ambient Air
    airRef.current = new Audio("/sounds/ambient_air.mp3");
    airRef.current.loop = true;
    airRef.current.volume = 0.15;

    // Footsteps (loopable walking sound)
    // footstepsRef.current = new Audio("/sounds/footsteps.mp3");
    // footstepsRef.current.loop = true;
    // footstepsRef.current.volume = 0; // Controlled by movement

    // // Heartbeat (build-up)
    // heartbeatRef.current = new Audio("/sounds/heartbeat.mp3");
    // heartbeatRef.current.loop = true;
    // heartbeatRef.current.volume = 0; // Controlled by proximity

    // Interaction SFX
    doorSfxRef.current = new Audio("/sounds/door_open.mp3");
    confettiSfxRef.current = new Audio("/sounds/confetti.mp3");
    lightSfxRef.current = new Audio("/sounds/light_on.mp3");
    shimmerSfxRef.current = new Audio("/sounds/shimmer.mp3");
    whooshSfxRef.current = new Audio("/sounds/whoosh.mp3");

    return () => {
      [
        bgmRef,
        airRef,
        footstepsRef,
        heartbeatRef,
        doorSfxRef,
        confettiSfxRef,
        lightSfxRef,
        shimmerSfxRef,
        whooshSfxRef,
      ].forEach((ref) => {
        ref.current?.pause();
      });
    };
  }, []);

  // Handle Playback Start
  useEffect(() => {
    if (started && bgmRef.current) {
      bgmRef.current.play().catch(() => {});
      airRef.current?.play().catch(() => {});
      footstepsRef.current?.play().catch(() => {});
      heartbeatRef.current?.play().catch(() => {});
    }
  }, [started]);

  // Handle Art Interaction SFX
  useEffect(() => {
    if (!started || muted) {
      prevIsArtActive.current = isArtActive;
      return;
    }

    if (isArtActive) {
      if (shimmerSfxRef.current) {
        shimmerSfxRef.current.currentTime = 0;
        shimmerSfxRef.current.play().catch(() => {});
      }
    } else if (prevIsArtActive.current) {
      // Only play whoosh if we was previously active (transition from active to inactive)
      if (whooshSfxRef.current) {
        whooshSfxRef.current.currentTime = 0;
        whooshSfxRef.current.play().catch(() => {});
      }
    }
    prevIsArtActive.current = isArtActive;
  }, [isArtActive, started, muted]);

  // Track previous door state for transition detection
  const prevDoorOpen = useRef(false);

  // Handle Door & Secret Room Event SFX
  useEffect(() => {
    // Only trigger on transition from closed to open
    if (doorOpen && !prevDoorOpen.current) {
      // 1. Play Door Sound immediately
      if (!muted) doorSfxRef.current?.play().catch(() => {});

      // 2. Play Confetti Sound with a tiny delay to match explosion
      setTimeout(() => {
        if (!muted) confettiSfxRef.current?.play().catch(() => {});
      }, 300);

      // 3. Play Light Sound (hum)
      setTimeout(() => {
        if (!muted) lightSfxRef.current?.play().catch(() => {});
      }, 800);
    }
    prevDoorOpen.current = doorOpen;
  }, [doorOpen, muted]);

  // Handle Mute
  useEffect(() => {
    const allSounds = [
      bgmRef.current,
      airRef.current,
      doorSfxRef.current,
      confettiSfxRef.current,
      lightSfxRef.current,
      shimmerSfxRef.current,
      whooshSfxRef.current,
    ];
    allSounds.forEach((s) => {
      if (s) s.muted = muted;
    });
  }, [muted]);

  if (!started) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 mix-blend-difference pointer-events-auto">
      <button
        onClick={() => setMuted(!muted)}
        className="text-white/50 hover:text-white transition-opacity text-xs uppercase tracking-widest"
      >
        {muted ? "UNMUTE" : "MUTE"}
      </button>
    </div>
  );
}
