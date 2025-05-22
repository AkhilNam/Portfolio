import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const SUN_TEXTURE_URL = '/textures/2k_sun.jpg';

interface SunProps {
  onClick?: () => void;
}

const Sun = ({ onClick }: SunProps) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const sunTexture = useTexture(SUN_TEXTURE_URL);

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Main sun sphere with texture only */}
      <mesh ref={sunRef} castShadow receiveShadow onClick={onClick}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>
      {/* Title Text */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Akhil Nampally
      </Text>
    </group>
  );
};

export default Sun;
