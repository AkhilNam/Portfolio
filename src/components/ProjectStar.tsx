import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import Modal from './Modal';

interface ProjectStarProps {
  position: [number, number, number];
  data: {
    title: string;
    description: string;
    tech: string[];
    highlights: string[];
  };
}

const ProjectStar = ({ position, data }: ProjectStarProps) => {
  const [showModal, setShowModal] = useState(false);
  const starRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (starRef.current) {
      starRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      <group position={position}>
        <mesh
          ref={starRef}
          onClick={() => setShowModal(true)}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.5}
          />
        </mesh>

        <Text
          position={[0, 0.5, 0]}
          fontSize={0.2}
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
            <p className="text-xl mb-4">{data.description}</p>
            
            <h3 className="text-lg font-semibold mb-2">Technologies:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {data.tech.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-star-gold bg-opacity-20 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

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

export default ProjectStar; 