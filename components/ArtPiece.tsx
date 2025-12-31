"use client";
import { Image, Text } from "@react-three/drei";
import { useState, useEffect } from "react";

interface ArtPieceProps {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  description?: string;
  onClick?: () => void;
}

export default function ArtPiece({
  url,
  position,
  rotation = [0, 0, 0],
  title,
  description,
  onClick,
}: ArtPieceProps) {
  const [hovered, setHover] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* 1. THE SOFT LIGHT 
          We place it slightly in front (z=2) and above (y=1).
          Intensity is high because Three.js uses physical units now.
          Distance 7 means it only lights up THIS painting and the floor below it.
      */}
      <pointLight
        position={[0, 1.5, 2.5]}
        intensity={20}
        distance={10}
        decay={2}
        color="#fffaf0"
      />

      {/* OUTER FRAME */}
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[3.8, 4.8, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* INNER BORDER / MATTING */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[3.4, 4.4, 0.05]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>

      {/* THE IMAGE */}
      <Image url={url} scale={[3, 4]} position={[0, 0, 0.05]} />

      {/* THE TITLE */}
      <Text
        position={[0, -2.6, 0.5]}
        fontSize={0.25}
        color="white"
        anchorY="top"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {title}
      </Text>
    </group>
  );
}
