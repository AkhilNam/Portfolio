import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface ProjectStarProps {
  position: [number, number, number];
  data: {
    title: string;
    description: string;
    tech: string[];
    highlights: string[];
  };
  size?: number;
  onClick?: () => void;
}

const STAR_TEXTURE_URL = '/textures/star_4k.png';

const ProjectStar = ({ position, data, size, onClick }: ProjectStarProps) => {
  const [hovered, setHovered] = useState(false);
  const starRef = useRef<THREE.Mesh>(null);
  const starTexture = useTexture(STAR_TEXTURE_URL);

  // Generate a random size on mount (between 0.12 and 0.18)
  const [randomSize] = useState(() => size ?? (0.12 + Math.random() * 0.06));

  useFrame((_state, delta) => {
    if (starRef.current) {
      starRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={starRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[randomSize, 32, 32]} />
        <meshStandardMaterial
          map={starTexture}
          transparent
          roughness={0.5}
          metalness={0.7}
          emissive="#ffffff"
          emissiveIntensity={hovered ? 1.2 : 0.6}
        />
      </mesh>

      {/* Floating label on hover */}
      {hovered && (
        <Text
          position={[0, randomSize + 0.4, 0]}
          fontSize={0.18}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineColor="black"
          outlineWidth={0.01}
        >
          {data.title}
        </Text>
      )}
    </group>
  );
};

export default ProjectStar; 