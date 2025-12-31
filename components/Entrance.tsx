"use client";
import { Text, Float } from "@react-three/drei";

export default function Entrance({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* --- LIGHTING --- */}
      <pointLight
        position={[0, 5, 5]}
        intensity={100}
        color="#ff0080"
        distance={25}
      />
      <pointLight
        position={[0, 2, -5]}
        intensity={50}
        color="#ff0080"
        distance={15}
      />

      {/* --- BLOCKING CURTAIN / WALL --- */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>

      {/* --- FLOATING TITLE --- */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[0, 3, 2.5]}>
          <Text
            fontSize={1.5}
            color="#ff0080"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#33001a"
          >
            OUR GALLERY
          </Text>

          <Text
            position={[0, -1, 0]}
            fontSize={0.25}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            A Journey Through Us
          </Text>
        </group>
      </Float>

      {/* --- PLAYFUL INSTRUCTIONS --- */}
      <group position={[0, -0.5, 2.5]}>
        {/* Instruction 1 */}
        <Text
          position={[0, 0, 0]}
          fontSize={0.35}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          📱 Rotate to landscape
        </Text>

        {/* Instruction 2 */}
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.35}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          👆 Swipe up to explore
        </Text>

        {/* Instruction 3 */}
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.35}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          🎨 Tap art for its story
        </Text>

        {/* Instruction 4 */}
        <Text
          position={[0, -1.8, 0]}
          fontSize={0.35}
          color="#cccccc"
          anchorX="center"
          anchorY="middle"
        >
          ✨ Tap outside to close
        </Text>

        {/* Call to Action */}
        <Text
          position={[0, -2.8, 0]}
          fontSize={0.5}
          color="#ff0080"
          anchorX="center"
          anchorY="middle"
        >
          ↑ Swipe Up to Begin ↑
        </Text>
      </group>
    </group>
  );
}
