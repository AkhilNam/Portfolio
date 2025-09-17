import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useProductionAnimator } from './ProfessionalAnimationController';

interface ProductionSunProps {
  onClick?: () => void;
  isFocused?: boolean;
}

const ProductionSun = ({ onClick, isFocused = false }: ProductionSunProps) => {
  const sunGroupRef = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);
  const sunTexture = useTexture('/textures/2k_sun.jpg');

  const {
    scaleAnimator,
    updateAnimations
  } = useProductionAnimator();

  // Initialize scale
  React.useEffect(() => {
    scaleAnimator.setValue(1);
  }, []);

  // Handle hover and focus states
  React.useEffect(() => {
    if (isFocused) {
      scaleAnimator.setTarget(1.3);
    } else if (hovered) {
      scaleAnimator.setTarget(1.1);
    } else {
      scaleAnimator.setTarget(1);
    }
  }, [hovered, isFocused]);

  useFrame((state, deltaTime) => {
    const time = state.clock.getElapsedTime();
    const animations = updateAnimations(deltaTime);

    if (sunRef.current) {
      // Smooth rotation
      sunRef.current.rotation.y += deltaTime * 0.2;
      sunRef.current.rotation.x += deltaTime * 0.02;

      // Apply scale animation
      const scale = animations.scale;
      sunRef.current.scale.setScalar(scale);
    }

    // Enhanced corona animation
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= deltaTime * 0.15;
      coronaRef.current.rotation.z += deltaTime * 0.05;

      const intensity = Math.sin(time * 1.2) * 0.3 + 0.7;
      const material = coronaRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = (hovered || isFocused ? 0.4 : 0.25) * intensity;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.1);

      // Color temperature variation
      const temperature = Math.sin(time * 0.8) * 0.1 + 0.9;
      material.color.setRGB(1, temperature * 0.8, temperature * 0.4);
    }

    // Dynamic glow effect
    if (glowRef.current) {
      const glowScale = 1 + Math.sin(time * 1.5) * 0.15;
      const targetScale = (hovered || isFocused ? glowScale * 1.2 : glowScale);
      glowRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08
      );

      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const glowIntensity = hovered || isFocused ? 0.6 : 0.4;
      material.opacity = THREE.MathUtils.lerp(material.opacity, glowIntensity, 0.1);
    }

    // Solar flares animation
    if (flareRef.current) {
      flareRef.current.rotation.y += deltaTime * 0.3;
      flareRef.current.children.forEach((flare, i) => {
        const flareTime = time + i * 0.5;
        const intensity = Math.sin(flareTime * 3) * 0.5 + 0.5;
        const scale = intensity * (hovered || isFocused ? 1.5 : 1);
        flare.scale.setScalar(scale);

        const material = (flare as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = intensity * 0.8;
      });
    }

    // Subtle floating animation
    if (sunGroupRef.current && (hovered || isFocused)) {
      const floatOffset = Math.sin(time * 2) * 0.1;
      sunGroupRef.current.position.y = floatOffset;
    } else if (sunGroupRef.current) {
      sunGroupRef.current.position.y = THREE.MathUtils.lerp(sunGroupRef.current.position.y, 0, 0.1);
    }
  });

  return (
    <group ref={sunGroupRef}>
      {/* Outer glow layers */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Corona layer */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[4.2, 32, 32]} />
        <meshBasicMaterial
          color="#ff9900"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main sun */}
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
          emissiveIntensity={hovered || isFocused ? 1.2 : 0.8}
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
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Solar flares */}
      <group ref={flareRef}>
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const distance = 4;
          const height = Math.random() * 2 + 1;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * distance,
                (Math.random() - 0.5) * height,
                Math.sin(angle) * distance
              ]}
            >
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial
                color="#ffff00"
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}
      </group>

      {/* Enhanced title */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineColor="#ff6600"
        outlineWidth={0.03}
        fontWeight="bold"
        letterSpacing={0.08}
      >
        Akhil Nampally
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, 4.2, 0]}
        fontSize={0.25}
        color="#ffcc99"
        anchorX="center"
        anchorY="middle"
        outlineColor="#ff6600"
        outlineWidth={0.01}
        letterSpacing={0.03}
      >
        Software Engineer & AI Researcher
      </Text>

      {/* Interactive hint */}
      {hovered && (
        <Text
          position={[0, -4.5, 0]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineColor="#ff6600"
          outlineWidth={0.01}
        >
          Click to learn more
        </Text>
      )}
    </group>
  );
};

export default ProductionSun;