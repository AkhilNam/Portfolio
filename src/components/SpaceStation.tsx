import { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const STATION_POSITION: [number, number, number] = [60, -5, -30];
const LINKEDIN_URL = 'https://www.linkedin.com/in/akhilnampally/'; // Replace with your LinkedIn

const SpaceStation = () => {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <group
      ref={group}
      position={STATION_POSITION}
      scale={hovered ? 1.13 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => window.open(LINKEDIN_URL, '_blank')}
    >
      {/* Invisible hitbox for reliable hover/click */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[14, 6, 6]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {/* Main modular habitat: central block */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 2, 2]} />
        <meshStandardMaterial color="#333" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Side modules */}
      <mesh position={[-3, 0.7, 0]}>
        <boxGeometry args={[2, 1, 1.2]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[3, -0.7, 0]}>
        <boxGeometry args={[2, 1, 1.2]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Connecting corridor */}
      <mesh position={[0, 0, 1.3]}>
        <boxGeometry args={[1.2, 1, 1]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Solar panel arrays */}
      <mesh position={[-5, 0, 0]}>
        <boxGeometry args={[6, 0.15, 1.2]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[5, 0, 0]}>
        <boxGeometry args={[6, 0.15, 1.2]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Light strips on solar panels */}
      <mesh position={[-5, 0.08, 0.4]}>
        <boxGeometry args={[6, 0.03, 0.08]} />
        <meshStandardMaterial color="#4fd1c5" emissive="#4fd1c5" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[5, 0.08, 0.4]}>
        <boxGeometry args={[6, 0.03, 0.08]} />
        <meshStandardMaterial color="#4fd1c5" emissive="#4fd1c5" emissiveIntensity={0.7} />
      </mesh>
      {/* Antenna mast */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2, 12]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Dish */}
      <mesh position={[0, 2.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.5, 0.7, 20, 1, true]} />
        <meshStandardMaterial color="#eee" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Station lights (red, blue, white) */}
      <mesh position={[-2, 1, 1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={hovered ? 2 : 1} />
      </mesh>
      <mesh position={[2, -1, -1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#4fd1c5" emissive="#4fd1c5" emissiveIntensity={hovered ? 2 : 1} />
      </mesh>
      <mesh position={[0, 0.8, -1.2]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={hovered ? 1.5 : 0.7} />
      </mesh>
      {/* Hovering platform/landing bay effect */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 3.2, 48]} />
        <meshBasicMaterial color="#4fd1c5" transparent opacity={0.13} />
      </mesh>
      {/* Floating label on hover */}
      {hovered && (
        <Text
          position={[0, 5.5, 0]}
          fontSize={1.1}
          color="#4fd1c5"
          anchorX="center"
          anchorY="bottom"
          outlineColor="#222"
          outlineWidth={0.07}
        >
          Connect on LinkedIn
        </Text>
      )}
    </group>
  );
};

export default SpaceStation; 