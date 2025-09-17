import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
// Removed framer-motion-3d due to version conflicts
import * as THREE from 'three';
import { useProductionAnimator, TransitionState } from './ProfessionalAnimationController';

interface ProductionPlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  data: {
    title: string;
    role: string;
    timeline?: string;
    description: string;
    highlights: string[];
  };
  onClick?: () => void;
  isFocused?: boolean;
}

const ProductionPlanet = ({ position, size, color, data, onClick, isFocused = false }: ProductionPlanetProps) => {
  const planetGroupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const [transitionState, setTransitionState] = useState(TransitionState.IDLE);
  const [animationProgress, setAnimationProgress] = useState(0);

  const {
    positionAnimator,
    scaleAnimator,
    rotationAnimator,
    updateAnimations
  } = useProductionAnimator();

  // Load textures based on planet type
  const textureUrls = {
    earth: '/textures/2k_jupiter.jpg',
    mars: '/textures/2k_mars.jpg',
    jupiter: '/textures/2k_jupiter.jpg'
  };

  let textureUrl = textureUrls.earth;
  if (data.title.includes('Strategy')) textureUrl = textureUrls.mars;
  if (data.title.includes('Georgia')) textureUrl = textureUrls.jupiter;

  const planetTexture = useTexture(textureUrl);

  // Initialize positions
  useEffect(() => {
    positionAnimator.setPosition(position[0], position[1], position[2]);
    scaleAnimator.setValue(1);
    rotationAnimator.setValue(0);
  }, [position]);

  // Handle focus state changes
  useEffect(() => {
    if (isFocused) {
      setTransitionState(TransitionState.FOCUSED);
      scaleAnimator.setTarget(1.2);
    } else {
      setTransitionState(TransitionState.IDLE);
      scaleAnimator.setTarget(1);
    }
  }, [isFocused]);

  // Handle hover effects
  useEffect(() => {
    if (hovered && !isFocused) {
      setTransitionState(TransitionState.TRANSITIONING);
      scaleAnimator.setTarget(1.1);
    } else if (!hovered && !isFocused) {
      setTransitionState(TransitionState.IDLE);
      scaleAnimator.setTarget(1);
    }
  }, [hovered, isFocused]);

  useFrame((state, deltaTime) => {
    if (!planetGroupRef.current || !planetRef.current) return;

    // Update all animations
    const animations = updateAnimations(deltaTime);
    const time = state.clock.getElapsedTime();

    // Smooth rotation
    planetRef.current.rotation.y += deltaTime * 0.3;

    // Apply scale animation
    const scale = animations.scale;
    planetGroupRef.current.scale.setScalar(scale);

    // Floating animation based on state
    let floatOffset = 0;
    if (transitionState === TransitionState.FOCUSED) {
      floatOffset = Math.sin(time * 2) * 0.15;
    } else if (hovered) {
      floatOffset = Math.sin(time * 3) * 0.08;
    }

    positionAnimator.setTarget(
      position[0],
      position[1] + floatOffset,
      position[2]
    );

    const newPosition = animations.position;
    planetGroupRef.current.position.copy(newPosition);

    // Atmosphere effects
    if (atmosphereRef.current) {
      const material = atmosphereRef.current.material as THREE.MeshPhongMaterial;
      const intensity = hovered || isFocused ? 0.6 : 0.3;
      const targetOpacity = Math.sin(time * 1.5) * 0.2 + intensity;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.1);

      // Color pulsing on hover
      if (hovered || isFocused) {
        const colorIntensity = Math.sin(time * 4) * 0.3 + 0.7;
        material.color.lerp(new THREE.Color(color).multiplyScalar(colorIntensity), 0.1);
      } else {
        material.color.lerp(new THREE.Color(color), 0.1);
      }
    }

    // Glow effects
    if (glowRef.current) {
      const glowScale = hovered || isFocused ? 1.3 : 1.1;
      const targetScale = glowScale + Math.sin(time * 2) * 0.1;
      glowRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      const glowOpacity = hovered || isFocused ? 0.4 : 0.2;
      material.opacity = THREE.MathUtils.lerp(material.opacity, glowOpacity, 0.1);
    }

    // Update animation progress for smooth transitions
    setAnimationProgress(prev => {
      if (hovered || isFocused) {
        return Math.min(1, prev + deltaTime * 3);
      } else {
        return Math.max(0, prev - deltaTime * 2);
      }
    });
  });

  return (
    <group ref={planetGroupRef}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.4, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Atmosphere layer */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[size * 1.05, 32, 32]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main planet */}
      <mesh
        ref={planetRef}
        castShadow
        receiveShadow
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshPhysicalMaterial
          map={planetTexture}
          metalness={0.3}
          roughness={0.6}
          clearcoat={0.2}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
          emissive={color}
          emissiveIntensity={hovered || isFocused ? 0.2 : 0.1}
        />
      </mesh>

      {/* Orbiting particles on hover */}
      {(hovered || isFocused) && (
        <group>
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = size * 1.5;
            const orbitSpeed = 2 + i * 0.3;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(Date.now() * 0.001 * orbitSpeed) * 0.3,
                  Math.sin(angle) * radius
                ]}
              >
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Enhanced label with smooth fade */}
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
        outlineColor={color}
        outlineWidth={0.02}
        fontWeight="bold"
        letterSpacing={0.05}
        fillOpacity={animationProgress}
      >
        {data.title}
      </Text>

      {/* Subtitle on hover */}
      {animationProgress > 0.5 && (
        <Text
          position={[0, size + 0.2, 0]}
          fontSize={0.15}
          color="#cccccc"
          anchorX="center"
          anchorY="bottom"
          fillOpacity={animationProgress * 0.8}
        >
          {data.role}
        </Text>
      )}
    </group>
  );
};

export default ProductionPlanet;