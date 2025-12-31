"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  MeshReflectorMaterial,
  Environment,
} from "@react-three/drei";
import ArtPiece from "@/components/ArtPiece";
import MuseumDoor from "@/components/MuseumDoor";
import SecretRoom from "@/components/SecretRoom";
import Entrance from "@/components/Entrance";
import { Suspense, useState, useEffect, useRef } from "react";
import Loader from "@/components/Loader";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import AudioManager from "@/components/AudioManager";
import ArtOverlay, { ArtData } from "@/components/ArtOverlay";
import ProgressIndicator from "@/components/ProgressIndicator";

// --- CONFIGURATION & ART DATA ---
const ART_GAP = 15; // Increased gap slightly for better breathing room
const ART_DATA: ArtData[] = [
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-25.jpeg?${Date.now()}`,
    title: "The Start",
    description:
      "Every story begins with a single moment. This is where ours started.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-10.jpeg?${Date.now()}`,
    title: "Our Start",
    description:
      "I kept looking at you in that black dress, thinking how lucky I was to finally call you mine.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-31.jpeg?${Date.now()}`,
    title: "New Beginnings",
    description:
      "Starting the year in your arms and knowing exactly who I want by my side for every year to follow.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-32.jpeg?${Date.now()}`,
    title: "A New Year",
    description:
      "The first of many midnights together, and I still wouldn't change a single thing.",
  },

  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-1.jpeg?${Date.now()}`,
    title: "Truly Us",
    description:
      "When the walls came down and we finally let our goofy side out. I love how much we laugh together.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-29.jpeg?${Date.now()}`,
    title: "Everything",
    description:
      "I look at you and I see my whole future. There is nobody else I’d rather have by my side.",
  },

  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-12.jpeg?${Date.now()}`,
    title: "My Favorite Person",
    description:
      "I love that I can be my truest, goofiest self with you and you're right there with me.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-2.jpeg?${Date.now()}`,
    title: "Always You",
    description:
      "I could spend every second just laughing with you and it still wouldn't be enough time.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-22.jpeg?${Date.now()}`,
    title: "In Your Light",
    description:
      "Every time you laugh, I fall in love with you all over again. You are my entire world.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-26.jpeg?${Date.now()}`,
    title: "The Best Part of Me",
    description:
      "You make life so much brighter just by being in it. I am so incredibly grateful for you.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-28.jpeg?${Date.now()}`,
    title: "My Greatest Blessing",
    description:
      "Every day with you will always be a gift I never want to take for granted.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-5.jpeg?${Date.now()}`,
    title: "Soulmate",
    description: "You're the one my heart has always searched for.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-6.jpeg?${Date.now()}`,
    title: "Infinite",
    description:
      "No matter where life takes us, my heart belongs exactly where it is right now—with you.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-8.jpeg?${Date.now()}`,
    title: "My Only One",
    description:
      "You are the beat in my heart and the only person I’ll ever need to be happy.",
  },
  {
    url: `https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/img-9.jpeg?${Date.now()}`,
    title: "Forever & Always",
    description:
      "This is only the beginning of our story, and I can’t wait to spend the rest of it with you.",
  },
];

// --- DYNAMIC SCENE DIMENSIONS ---
const ART_COUNT = ART_DATA.length;
const LAST_ART_Z = -(ART_COUNT - 1) * ART_GAP;
const DOOR_Z = LAST_ART_Z - 15;
const SECRET_ROOM_Z = LAST_ART_Z - 30;

// Camera path constants
const CAMERA_START_Z = 25;
const CAMERA_END_Z = SECRET_ROOM_Z - 5;
const DOOR_TRIGGER_Z = DOOR_Z + 12;

// Scroll pages (approx 1 page per 18 units of distance for a steady, controlled pace)
const TOTAL_DISTANCE = Math.abs(CAMERA_START_Z - CAMERA_END_Z);
const SCROLL_PAGES = Math.max(3, Math.ceil(TOTAL_DISTANCE / 18));

function Rig({ setOpen }: { setOpen: (v: boolean) => void }) {
  const scroll = useScroll();
  const prevDoorState = useRef(false);

  useFrame((state) => {
    const offset = scroll.offset;

    // 1. FORWARD MOVEMENT (Dynamic based on art count)
    const zPos = THREE.MathUtils.lerp(CAMERA_START_Z, CAMERA_END_Z, offset);

    // Trigger door open based on dynamic DOOR_Z
    // Only update state when it actually changes to prevent mobile issues
    const shouldBeOpen = zPos < DOOR_TRIGGER_Z;
    if (shouldBeOpen !== prevDoorState.current) {
      prevDoorState.current = shouldBeOpen;
      setOpen(shouldBeOpen);
    }

    // 2. ENHANCED MOUSE PARALLAX
    const xPos = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.mouse.x * 8,
      0.08
    );
    const yPos = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.mouse.y * 4,
      0.08
    );

    state.camera.position.set(xPos, yPos, zPos);

    // 3. LOOK AT
    state.camera.lookAt(state.mouse.x * 4, yPos * 0.5, zPos - 15);
  });
  return null;
}

function ProgressSyncer() {
  const scroll = useScroll();
  useFrame(() => {
    const bar = document.getElementById("progress-bar-fill");
    const text = document.getElementById("progress-text");
    if (bar && text) {
      const percentage = Math.round(scroll.offset * 100);
      bar.style.width = `${percentage}%`;
      text.innerText = `${percentage}% explored`;
    }
  });
  return null;
}

function Hallway() {
  // Hallway length is dynamically calculated to be slightly longer than the secret room
  const hallwayLength = Math.abs(SECRET_ROOM_Z) + 100;
  const hallwayZ = -hallwayLength / 2 + 25;

  return (
    <group>
      {/* CEILING */}
      <mesh position={[0, 6, hallwayZ]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, hallwayLength]} />
        <meshStandardMaterial color="#080808" />
      </mesh>

      {/* FLOOR with Reflection */}
      <mesh position={[0, -2.5, hallwayZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, hallwayLength]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#101010"
          metalness={0.5}
        />
      </mesh>

      {/* LEFT WALL */}
      <mesh position={[-15, 2, hallwayZ]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[hallwayLength, 15]} />
        <meshStandardMaterial color="#020202" />
      </mesh>

      {/* RIGHT WALL */}
      <mesh position={[15, 2, hallwayZ]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[hallwayLength, 15]} />
        <meshStandardMaterial color="#020202" />
      </mesh>

      {/* ARCHITECTURAL PILLARS / DETAILS - Also dynamic */}
      {[...Array(Math.ceil(hallwayLength / 15))].map((_, i) => (
        <group key={i} position={[0, 0, -i * 15]}>
          <mesh position={[-14.8, 1.75, 0]}>
            <boxGeometry args={[0.5, 8.5, 0.5]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
          <mesh position={[14.8, 1.75, 0]}>
            <boxGeometry args={[0.5, 8.5, 0.5]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Scene({
  setGlobalDoorOpen,
  onArtClick,
}: {
  setGlobalDoorOpen: (v: boolean) => void;
  onArtClick: (data: ArtData) => void;
}) {
  const [isOpen, setOpen] = useState(false);

  // Sync local isOpen state with parent doorOpen state
  useEffect(() => {
    setGlobalDoorOpen(isOpen);
  }, [isOpen, setGlobalDoorOpen]);

  return (
    <>
      <Rig setOpen={setOpen} />
      <Hallway />

      {/* --- ENTRANCE --- */}
      <Entrance position={[0, 0, 12]} />

      {/* --- CEILING LIGHTS - Also dynamic --- */}
      {[...Array(Math.ceil(Math.abs(DOOR_Z) / 10))].map((_, i) => (
        <group key={i} position={[0, 5.8, -i * 10 - 5]}>
          <mesh>
            <boxGeometry args={[2, 0.2, 0.5]} />
            <meshStandardMaterial
              color="white"
              emissive="white"
              emissiveIntensity={2}
            />
          </mesh>
          <pointLight intensity={10} distance={15} decay={2} color="#ffeebb" />
        </group>
      ))}

      {/* --- AUTOMATED ART LIST --- */}
      {ART_DATA.map((art, i) => {
        const isLeft = i % 2 === 0;
        const zPos = -i * ART_GAP;
        const xPos = isLeft ? -6 : 6;
        const rotationY = isLeft ? 0.4 : -0.4;

        return (
          <ArtPiece
            key={i}
            url={art.url}
            position={[xPos, 1, zPos]}
            rotation={[0, rotationY, 0]}
            title={art.title}
            description={art.description}
            onClick={() => onArtClick(art)}
          />
        );
      })}

      {/* --- THE DOOR AT THE END --- */}
      <MuseumDoor position={[0, 0, DOOR_Z]} isOpen={isOpen} />

      {/* --- SECRET ROOM --- */}
      <SecretRoom position={[0, 0, SECRET_ROOM_Z]} isDoorOpen={isOpen} />
    </>
  );
}

export default function Home() {
  const [interacted, setInteracted] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [activeArt, setActiveArt] = useState<ArtData | null>(null);

  useEffect(() => {
    const handleResize = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main
      className="fixed inset-0 bg-black"
      onPointerDown={() => setInteracted(true)}
      style={{
        width: "100dvw",
        height: "100dvh",
        touchAction: "none",
        overflow: "hidden",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `::-webkit-scrollbar { display: none !important; } html, body { scrollbar-width: none !important; overflow: hidden !important; overscroll-behavior: none !important; }`,
        }}
      />

      {/* Overlay Rendering */}
      <ArtOverlay art={activeArt} onClose={() => setActiveArt(null)} />

      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 25], fov: 45 }}
      >
        <color attach="background" args={["#000"]} />
        <fog attach="fog" args={["#000", 10, 50]} />
        <ambientLight intensity={0.1} />
        <Environment preset="city" />

        <Suspense fallback={<Loader />}>
          <ScrollControls
            pages={SCROLL_PAGES}
            damping={0.2}
            enabled={!activeArt}
          >
            <Scene
              setGlobalDoorOpen={setDoorOpen}
              onArtClick={(data) => setActiveArt(data)}
            />
            <ProgressSyncer />
          </ScrollControls>
        </Suspense>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={0.5}
          />
          <Noise opacity={0.03} />
          <Vignette eskil={false} offset={0.1} darkness={1.05} />
        </EffectComposer>
      </Canvas>
      <AudioManager
        started={interacted}
        doorOpen={doorOpen}
        isArtActive={!!activeArt}
      />
      {!activeArt && <ProgressIndicator />}
    </main>
  );
}
