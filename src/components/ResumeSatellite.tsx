import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const RESUME_URL = 'https://drive.google.com/file/d/1n1ycuPIkyrWHXzguZ73RXO379E6dkbP7/view?usp=sharing'; // Replace with your actual resume link

const ORBIT_RADIUS = 15;
const ORBIT_SPEED = 0.12;
const SATELLITE_SIZE = 0.7;

const ResumeSatellite = () => {
  const group = useRef<THREE.Group>(null);
  const satelliteRef = useRef<THREE.Group>(null);
  const leftPanelRef = useRef<THREE.Mesh>(null);
  const rightPanelRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    // Orbit around the Sun
    const t = clock.getElapsedTime() * ORBIT_SPEED;
    const x = Math.cos(t) * ORBIT_RADIUS;
    const z = Math.sin(t) * ORBIT_RADIUS;
    if (group.current) {
      group.current.position.set(x, 1.2, z);
    }
    // Slow self-rotation
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group}>
      {/* Faint orbit ring */}
      {/* (Removed as requested) */}
      <group
        ref={satelliteRef}
        scale={hovered ? [SATELLITE_SIZE * 1.25, SATELLITE_SIZE * 1.25, SATELLITE_SIZE * 1.25] : [SATELLITE_SIZE, SATELLITE_SIZE, SATELLITE_SIZE]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => window.open(RESUME_URL, '_blank')}
        castShadow
        receiveShadow
      >
        {/* Main body with panel detail */}
        <mesh>
          <boxGeometry args={[1, 0.6, 0.5]} />
          <meshStandardMaterial
            color="#aaa"
            metalness={1}
            roughness={0.3}
            envMapIntensity={0.7}
          />
        </mesh>
        {/* Panel detail: darker panels on body */}
        <mesh position={[0, 0, 0.26]}>
          <boxGeometry args={[0.9, 0.5, 0.01]} />
          <meshStandardMaterial color="#666" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, -0.26]}>
          <boxGeometry args={[0.9, 0.5, 0.01]} />
          <meshStandardMaterial color="#666" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Solar panel struts */}
        <mesh position={[-0.7, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
          <meshStandardMaterial color="#aaa" metalness={1} roughness={0.3} />
        </mesh>
        <mesh position={[0.7, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
          <meshStandardMaterial color="#aaa" metalness={1} roughness={0.3} />
        </mesh>
        {/* Solar panels */}
        <mesh ref={leftPanelRef} position={[-1.05, 0, 0]}>
          <planeGeometry args={[1.6, 0.45]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.35} emissive="#1e3a8a" emissiveIntensity={0.5} />
        </mesh>
        <mesh ref={rightPanelRef} position={[1.05, 0, 0]}>
          <planeGeometry args={[1.6, 0.45]} />
          <meshStandardMaterial color="#1e3a8a" metalness={0.8} roughness={0.35} emissive="#1e3a8a" emissiveIntensity={0.5} />
        </mesh>
        {/* Antenna mast */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
          <meshStandardMaterial color="#ccc" metalness={1} roughness={0.2} />
        </mesh>
        {/* Antenna dish (optional, parabolic) */}
        <mesh position={[0, 0.55, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.11, 0.18, 16, 1, true]} />
          <meshStandardMaterial color="#eee" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Glowing beacon light */}
        <mesh position={[0, 0.3, 0.23]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={hovered ? 1.5 : 0.7} />
        </mesh>
      </group>
      {/* Floating label on hover */}
      {hovered && (
        <Text
          position={[0, SATELLITE_SIZE * 0.7 + 0.7, 0]}
          fontSize={0.38}
          color="#00eaff"
          anchorX="center"
          anchorY="bottom"
          outlineColor="#000"
          outlineWidth={0.025}
        >
          📄 View Resume
        </Text>
      )}
    </group>
  );
};

export default ResumeSatellite; 