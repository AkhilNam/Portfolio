import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  data: {
    title: string;
    role: string;
    timeline?: string;
    highlights: string[];
  };
  onClick?: () => void;
}

interface PlanetTextures {
  map?: THREE.Texture;
  bumpMap?: THREE.Texture;
  specularMap?: THREE.Texture;
  cloudsMap?: THREE.Texture;
}

// NASA texture URLs
const textureUrls = {
  earth: {
    map: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    bumpMap: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    specularMap: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    cloudsMap: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'
  },
  mars: {
    map: '/textures/2k_mars.jpg'
  },
  jupiter: {
    map: '/textures/2k_jupiter.jpg'
  }
};

const Planet = ({ position, size, color, data, onClick }: PlanetProps) => {
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [labelOpacity, setLabelOpacity] = useState(0);

  // Always call all useTexture hooks unconditionally
  const earthTextures = useTexture(textureUrls.earth);
  const marsTextures = useTexture(textureUrls.mars);
  const jupiterTextures = useTexture(textureUrls.jupiter);

  // Select the correct texture set
  let textures: PlanetTextures = {};
  if (data.title === "Living Dynamical Systems Lab") {
    textures = earthTextures;
  } else if (data.title === "Strategy Kiln") {
    textures = marsTextures;
  } else if (data.title === "Georgia Tech") {
    textures = jupiterTextures;
  }

  // Convert hex color to THREE.Color for manipulation
  const planetColor = new THREE.Color(color);

  useEffect(() => {
    if (textures.map) {
      setTexturesLoaded(true);
    }
  }, [textures.map]);

  useFrame((state, delta) => {
    if (planetRef.current) {
      // Smooth rotation with consistent timing
      planetRef.current.rotation.y += delta * 0.3;

      // Enhanced hover animation with easing
      if (hovered) {
        const time = state.clock.getElapsedTime();
        const floatOffset = Math.sin(time * 2.5) * 0.08;
        const scaleOffset = 1 + Math.sin(time * 3.5) * 0.03;

        planetRef.current.position.y = THREE.MathUtils.lerp(
          planetRef.current.position.y,
          position[1] + floatOffset,
          0.15
        );
        planetRef.current.scale.lerp(
          new THREE.Vector3(scaleOffset, scaleOffset, scaleOffset),
          0.15
        );
      } else {
        planetRef.current.position.y = THREE.MathUtils.lerp(
          planetRef.current.position.y,
          position[1],
          0.12
        );
        planetRef.current.scale.lerp(
          new THREE.Vector3(1, 1, 1),
          0.12
        );
      }
    }

    // Rotate clouds faster than the planet
    if (cloudsRef.current && data.title === "Living Dynamical Systems Lab" && texturesLoaded) {
      cloudsRef.current.rotation.y += delta * 0.3;
    }

    // Enhanced atmosphere pulsing
    if (atmosphereRef.current) {
      const time = state.clock.getElapsedTime();
      const pulseIntensity = Math.sin(time * 1.5) * 0.15 + (hovered ? 0.6 : 0.3);
      (atmosphereRef.current.material as THREE.MeshPhongMaterial).opacity = pulseIntensity;

      // Color shift on hover
      if (hovered) {
        (atmosphereRef.current.material as THREE.MeshPhongMaterial).color.lerp(
          new THREE.Color(planetColor).multiplyScalar(1.5), 0.1
        );
      } else {
        (atmosphereRef.current.material as THREE.MeshPhongMaterial).color.lerp(
          planetColor, 0.1
        );
      }
    }

    // Smooth label fade
    setLabelOpacity((prev) => {
      if (hovered && prev < 1) return Math.min(1, prev + 0.12);
      if (!hovered && prev > 0) return Math.max(0, prev - 0.08);
      return prev;
    });
  });

  return (
    <group position={position}>
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
        {texturesLoaded && textures.map ? (
          <meshPhysicalMaterial
            map={textures.map}
            metalness={0.5}
            roughness={0.2}
            clearcoat={0.3}
            clearcoatRoughness={0.1}
            envMapIntensity={1}
          />
        ) : (
          <meshStandardMaterial
            color={planetColor}
            emissive={planetColor}
            emissiveIntensity={0.4}
            metalness={0.5}
            roughness={0.2}
          />
        )}
      </mesh>

      {/* Clouds layer (only for Earth) */}
      {data.title === "Living Dynamical Systems Lab" && texturesLoaded && textures.cloudsMap && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[size * 1.01, 64, 64]} />
          <meshPhongMaterial
            map={textures.cloudsMap}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Atmosphere layer */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[size * 1.05, 32, 32]} />
        <meshPhongMaterial
          color={planetColor}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Particle field around planet */}
      {hovered && (
        <group>
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = size * 1.3;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle * 0.5) * 0.3,
                  Math.sin(angle) * radius
                ]}
              >
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial
                  color={planetColor}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            );
          })}
        </group>
      )}

      <Text
        position={[0, size + 0.35, -0.18]}
        fontSize={0.22}
        color="#dddddd"
        anchorX="center"
        anchorY="bottom"
        outlineColor="#3ad1e6"
        outlineWidth={0.015}
        fontWeight={400}
        letterSpacing={0.03}
        fillOpacity={labelOpacity}
      >
        {data.title}
      </Text>
    </group>
  );
};

export default Planet; 