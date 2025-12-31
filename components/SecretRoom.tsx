import {
  Text,
  Float,
  Stars,
  Sparkles,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Romantic Font URL
// Romantic Font URL - using a reliable CDN
const FONT_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/great-vibes@5.0.8/files/great-vibes-latin-400-normal.woff";
// const FONT_URL = "./fonts/romantic.ttf";
function HeartbeatText() {
  const [scale, setScale] = useState(1);

  useFrame((state) => {
    // Gentle heartbeat sine wave
    const t = state.clock.getElapsedTime();
    const pulse = Math.sin(t * 3) * 0.1 + 1; // Base pulse
    setScale(pulse);
  });

  return (
    <group scale={scale}>
      <Text
        position={[0, 1, 0]}
        fontSize={1.5}
        color="#ff0080"
        anchorX="center"
        anchorY="middle"
        font={FONT_URL}
        outlineWidth={0.02}
        outlineColor="#ffbad2"
      >
        I LOVE YOU
        <meshStandardMaterial
          color="#ff0080"
          emissive="#ff0060"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Text>
    </group>
  );
}

function Confetti({
  position,
  trigger,
}: {
  position: [number, number, number];
  trigger: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [exploded, setExploded] = useState(false);
  const count = 600;

  // Physics state
  const particles = useRef(
    new Array(count).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        Math.random() * 5 + 5, // Start high
        (Math.random() - 0.5) * 10
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        Math.random() * -0.1 - 0.05, // Downward
        (Math.random() - 0.5) * 0.2
      ),
      rotation: new THREE.Euler(Math.random(), Math.random(), Math.random()),
      rotSpeed: new THREE.Euler(
        Math.random() * 0.1,
        Math.random() * 0.1,
        Math.random() * 0.1
      ),
      scale: Math.random() * 0.5 + 0.5,
      color: ["#ff0080", "#ffd700", "#ffffff"][Math.floor(Math.random() * 3)],
    }))
  );

  const dummy = new THREE.Object3D();

  // Use useEffect for trigger detection - more reliable on mobile than useFrame
  useEffect(() => {
    if (trigger && !exploded) {
      setExploded(true);
    }
  }, [trigger, exploded]);

  useFrame(() => {
    if (exploded && meshRef.current) {
      particles.current.forEach((p, i) => {
        // Apply gravity and velocity
        p.position.add(p.velocity);
        p.rotation.x += p.rotSpeed.x;
        p.rotation.y += p.rotSpeed.y;
        p.rotation.z += p.rotSpeed.z;

        // Floor bounce / recycle (simple loop)
        if (p.position.y < -2) {
          p.position.y = 8;
          p.velocity.y = Math.random() * -0.1 - 0.05;
        }

        dummy.position.copy(p.position);
        dummy.rotation.copy(p.rotation);
        dummy.scale.setScalar(p.scale);

        dummy.updateMatrix();
        meshRef.current?.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Set initial colors
  useEffect(() => {
    if (meshRef.current) {
      particles.current.forEach((p, i) => {
        const c = new THREE.Color(p.color);
        meshRef.current?.setColorAt(i, c);
      });
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [exploded]);

  if (!exploded) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      position={position}
    >
      <planeGeometry args={[0.1, 0.2]} />
      <meshStandardMaterial side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function VideoScreen({ isDoorOpen }: { isDoorOpen: boolean }) {
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(
    null
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const leftCurtainRef = useRef<THREE.Mesh>(null);
  const rightCurtainRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // Manual Video Element Creation for Maximum Mobile Compatibility
    const vid = document.createElement("video");
    vid.src =
      "https://pub-488f9223861748549a473b048bba3a82.r2.dev/gallery/meshup.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true; // Critical for iOS
    vid.setAttribute("playsinline", ""); // Double safety
    vid.setAttribute("webkit-playsinline", ""); // Triple safety

    videoRef.current = vid;

    // Attempt play immediately
    vid.play().catch((e) => console.warn("Auto-play blocked:", e));

    // Force play on first interaction
    const onTouch = () => {
      if (vid.paused) {
        vid
          .play()
          .then(() => console.log("Playing via touch"))
          .catch(console.error);
      }
    };
    window.addEventListener("touchstart", onTouch, { once: true });
    window.addEventListener("click", onTouch, { once: true });

    const texture = new THREE.VideoTexture(vid);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;

    setVideoTexture(texture);

    return () => {
      vid.pause();
      vid.src = "";
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("click", onTouch);
      texture.dispose();
    };
  }, []);

  // Try to play video when door opens
  useEffect(() => {
    if (isDoorOpen && videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  }, [isDoorOpen]);

  // Animate curtains - faster animation
  useFrame(() => {
    // Curtains start covering screen (-6 and +6), open to off-screen (-18 and +18)
    const leftTarget = isDoorOpen ? -18 : -6;
    const rightTarget = isDoorOpen ? 18 : 6;

    if (leftCurtainRef.current) {
      leftCurtainRef.current.position.x = THREE.MathUtils.lerp(
        leftCurtainRef.current.position.x,
        leftTarget,
        0.08 // Faster animation
      );
    }
    if (rightCurtainRef.current) {
      rightCurtainRef.current.position.x = THREE.MathUtils.lerp(
        rightCurtainRef.current.position.x,
        rightTarget,
        0.08
      );
    }
  });

  const frameColor = "#2a1515"; // Slightly lighter to be more visible
  const trimColor = "#d4af37"; // Gold
  const curtainColor = "#8B0000"; // Dark red velvet

  return (
    <group position={[0, 3, -11]}>
      {/* === CINEMA FRAME (sized for 22x11.25 video) === */}
      {/* Top Frame */}
      <mesh position={[0, 6.1, 0.2]}>
        <boxGeometry args={[24, 1, 0.6]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* Top Gold Trim */}
      <mesh position={[0, 5.5, 0.5]}>
        <boxGeometry args={[23, 0.12, 0.1]} />
        <meshStandardMaterial
          color={trimColor}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Bottom Frame */}
      <mesh position={[0, -6.1, 0.2]}>
        <boxGeometry args={[24, 1, 0.6]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* Bottom Gold Trim */}
      <mesh position={[0, -5.5, 0.5]}>
        <boxGeometry args={[23, 0.12, 0.1]} />
        <meshStandardMaterial
          color={trimColor}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Left Frame */}
      <mesh position={[-11.5, 0, 0.2]}>
        <boxGeometry args={[1, 13.2, 0.6]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* Left Gold Trim */}
      <mesh position={[-10.9, 0, 0.5]}>
        <boxGeometry args={[0.12, 11, 0.1]} />
        <meshStandardMaterial
          color={trimColor}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Right Frame */}
      <mesh position={[11.5, 0, 0.2]}>
        <boxGeometry args={[1, 13.2, 0.6]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* Right Gold Trim */}
      <mesh position={[10.9, 0, 0.5]}>
        <boxGeometry args={[0.12, 11, 0.1]} />
        <meshStandardMaterial
          color={trimColor}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* === VELVET CURTAINS === */}
      {/* Left Curtain - starts at -6 covering left half */}
      <mesh ref={leftCurtainRef} position={[-6, 0, 0.3]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color={curtainColor}
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right Curtain - starts at +6 covering right half */}
      <mesh ref={rightCurtainRef} position={[6, 0, 0.3]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color={curtainColor}
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* === VIDEO CONTENT === */}
      <mesh
        onClick={(e) => {
          // Manual toggle on click
          if (videoTexture && videoTexture.image) {
            const vid = videoTexture.image;
            vid.paused ? vid.play() : vid.pause();
          }
        }}
      >
        <planeGeometry args={[22, 11.25]} />
        {videoTexture ? (
          <meshBasicMaterial
            map={videoTexture}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        ) : (
          // Fallback while loading
          <meshStandardMaterial color="#111" />
        )}
      </mesh>
    </group>
  );
}

export default function SecretRoom({
  position,
  isDoorOpen,
}: {
  position: [number, number, number];
  isDoorOpen: boolean;
}) {
  return (
    <group position={position}>
      {/* ROOM SHELL */}
      {/* Floor */}
      <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[29, 30]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={40} // Reduced from 80
          roughness={0.4} // Increased from 0.1 for softer look
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#150005"
          metalness={0.6} // Reduced from 0.8
        />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -15]}>
        <planeGeometry args={[29, 20]} />
        <meshStandardMaterial color="#200005" />
      </mesh>

      {/* Side Walls */}
      <mesh position={[-14.5, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#200005" />
      </mesh>
      <mesh position={[14.5, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#200005" />
      </mesh>

      {/* Ceiling (Starlight Headliner Base) */}
      <mesh position={[0, 4.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[29, 30]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>

      {/* Fiber Optics (The Stars) */}
      <Sparkles
        count={800}
        scale={[28, 2, 28]}
        size={1.2}
        speed={0.2}
        opacity={1}
        color="#ffffff"
        position={[0, 4.8, 0]}
      />

      {/* AMBIENCE */}
      <Stars
        radius={100}
        depth={50}
        count={2000} // Reduced outer stars so the roof pops more
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <Sparkles
        count={100}
        scale={10}
        size={1.5}
        speed={0.1}
        opacity={0.4}
        color="#ff69b4"
      />

      {/* LIGHTING */}
      {/* Main pink glow */}
      <pointLight
        position={[0, 5, -5]}
        intensity={15}
        color="#ff0080"
        distance={25}
        decay={2}
      />

      {/* Warm fill light for contrast */}
      <pointLight
        position={[5, 2, -5]}
        intensity={5}
        color="#ffaa00"
        distance={15}
      />

      {/* General Ambience */}
      <ambientLight intensity={0.5} color="#ffd1dc" />

      {/* Gradient Env Light */}
      <hemisphereLight
        args={["#ff0080", "#200020", 0.5]}
        position={[0, 50, 0]}
      />

      {/* VIDEO SCREEN */}
      <Suspense fallback={null}>
        <VideoScreen isDoorOpen={isDoorOpen} />
      </Suspense>

      <Confetti position={[0, 0, 0]} trigger={isDoorOpen} />

      {/* CENTERPIECE */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={[0, -0.5, -5]}>
          <HeartbeatText />

          <Text
            position={[0, -0.5, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
            font={FONT_URL}
            letterSpacing={0.1}
          >
            Happy New Year
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </Text>
        </group>
      </Float>

      {/* DECORATIVE HEARTS (Static positions) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[Math.sin(i * 1.5) * 5, 1 + i * 0.5, Math.cos(i * 1.5) * 5]}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="red"
            emissive="#ff0000"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}
