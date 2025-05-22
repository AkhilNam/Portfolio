import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import Modal from './Modal';

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
}

const Planet = ({ position, size, color, data }: PlanetProps) => {
  const [showModal, setShowModal] = useState(false);
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <>
      <group position={position}>
        <mesh
          ref={planetRef}
          onClick={() => setShowModal(true)}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>

        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {data.title}
        </Text>
      </group>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">{data.title}</h2>
            <p className="text-xl mb-2">{data.role}</p>
            {data.timeline && (
              <p className="text-gray-400 mb-4">{data.timeline}</p>
            )}
            <h3 className="text-lg font-semibold mb-2">Highlights:</h3>
            <ul className="list-disc list-inside">
              {data.highlights.map((highlight, index) => (
                <li key={index} className="mb-1">{highlight}</li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Planet; 