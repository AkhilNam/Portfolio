import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const SUN_TEXTURE_URL = '/textures/2k_sun.jpg';

interface SunProps {
  onClick?: () => void;
}

const Sun = ({ onClick }: SunProps) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const sunTexture = useTexture(SUN_TEXTURE_URL);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (sunRef.current) {
      // Smooth rotation with delta time
      sunRef.current.rotation.y += delta * 0.3;
      sunRef.current.rotation.x += delta * 0.05;
    }

    // Enhanced animated corona
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.2;
      const intensity = Math.sin(time * 1.5) * 0.25 + 0.75;
      const material = coronaRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = intensity * (hovered ? 0.25 : 0.15);
    }

    // Enhanced pulsing glow effect
    if (glowRef.current) {
      const scale = 1 + Math.sin(time * 1.2) * 0.08;
      const targetScale = hovered ? scale * 1.1 : scale;
      glowRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[4.2, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Corona layer */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[3.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff9900"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main sun sphere */}
      <mesh
        ref={sunRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive="#ff4400"
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Inner fire layer */}
      <mesh>
        <sphereGeometry args={[3.1, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Solar flares */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 3.5;
        return (
          <Sphere
            key={i}
            args={[0.1, 8, 8]}
            position={[
              Math.cos(angle) * distance,
              Math.sin(angle) * distance * 0.3,
              Math.sin(angle) * distance * 0.5
            ]}
          >
            <meshBasicMaterial
              color="#ffff00"
              transparent
              opacity={0.6}
            />
          </Sphere>
        );
      })}

      {/* Enhanced title text */}
      <Text
        position={[0, 4.2, 0]}
        fontSize={0.6}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineColor="#ff6600"
        outlineWidth={0.02}
        fontWeight="bold"
        letterSpacing={0.05}
      >
        Akhil Nampally
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, 3.6, 0]}
        fontSize={0.2}
        color="#ffcc99"
        anchorX="center"
        anchorY="middle"
        outlineColor="#ff6600"
        outlineWidth={0.01}
        letterSpacing={0.02}
      >
        Software Engineer & Researcher
      </Text>

      {/* Click indicator */}
      {hovered && (
        <Text
          position={[0, -4, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineColor="#ff6600"
          outlineWidth={0.005}
        >
          Click to learn more
        </Text>
      )}
    </group>
  );
};

export default Sun;
