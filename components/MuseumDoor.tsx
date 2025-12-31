"use client";
import { Text } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MuseumDoor({
  position,
  isOpen,
}: {
  position: [number, number, number];
  isOpen: boolean;
}) {
  const doorGroupRef = useRef<THREE.Group>(null);
  const targetRotation = isOpen ? -Math.PI / 2.5 : 0;

  // Smooth door animation using useFrame - works reliably on mobile
  useFrame(() => {
    if (doorGroupRef.current) {
      doorGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        doorGroupRef.current.rotation.y,
        targetRotation,
        0.1
      );
    }
  });

  return (
    <group position={position}>
      {/* --- DOOR FRAME --- */}
      {/* Top Frame */}
      <mesh position={[0, 5.5, -0.2]}>
        <boxGeometry args={[7, 1, 1]} />
        <meshStandardMaterial color="#2c1e14" />
      </mesh>
      {/* Left Frame */}
      <mesh position={[-3.25, 1, -0.2]}>
        <boxGeometry args={[1, 10, 1]} />
        <meshStandardMaterial color="#2c1e14" />
      </mesh>
      {/* Right Frame */}
      <mesh position={[3.25, 1, -0.2]}>
        <boxGeometry args={[1, 10, 1]} />
        <meshStandardMaterial color="#2c1e14" />
      </mesh>

      {/* --- PIVOTING DOOR GROUP --- */}
      {/* Pivot at x = -2.75 */}
      <group ref={doorGroupRef} position={[-2.75, 1, -0.1]}>
        {/* DOOR BODY (Shifted right by 2.75) */}
        <group position={[2.75, 0, 0]}>
          {/* Main Slab */}
          <mesh>
            <boxGeometry args={[5.5, 8.5, 0.3]} />
            <meshStandardMaterial
              color="#3e0e14"
              roughness={0.6}
              metalness={0.3}
            />
          </mesh>

          {/* --- PANELS (Decorative indented squares) --- */}
          {/* Top Left */}
          <mesh position={[-1.3, 2, 0.2]}>
            <boxGeometry args={[2, 3, 0.1]} />
            <meshStandardMaterial color="#2b0a0e" roughness={0.8} />
          </mesh>
          {/* Top Right */}
          <mesh position={[1.3, 2, 0.2]}>
            <boxGeometry args={[2, 3, 0.1]} />
            <meshStandardMaterial color="#2b0a0e" roughness={0.8} />
          </mesh>
          {/* Bottom Left */}
          <mesh position={[-1.3, -2, 0.2]}>
            <boxGeometry args={[2, 3, 0.1]} />
            <meshStandardMaterial color="#2b0a0e" roughness={0.8} />
          </mesh>
          {/* Bottom Right */}
          <mesh position={[1.3, -2, 0.2]}>
            <boxGeometry args={[2, 3, 0.1]} />
            <meshStandardMaterial color="#2b0a0e" roughness={0.8} />
          </mesh>

          {/* --- DECORATIVE HEART --- */}
          <mesh position={[0, 0, 0.25]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[1.5, 1.5, 0.1]} />
            <meshStandardMaterial
              color="#ff0080"
              emissive="#ff0080"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Handle */}
          <mesh position={[2, -0.5, 0.25]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={1}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* TEXT ABOVE DOOR */}
      <Text
        position={[0, 4.2, 0.4]}
        fontSize={0.6}
        color="#d4af37"
        // font="/fonts/Inter-Bold.ttf"
      >
        ALWAYS US
      </Text>

      <Text position={[0, 3.5, 0.4]} fontSize={0.2} color="white">
        {!isOpen ? "Scroll to Unlock" : "Welcome Home"}
      </Text>
    </group>
  );
}
