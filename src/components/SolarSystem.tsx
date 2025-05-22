import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import Sun from './Sun';
import Planet from './Planet';
import ProjectStar from './ProjectStar';
import * as THREE from 'three';

// Types for OrbitingPlanet
interface OrbitingPlanetProps {
  radius: number;
  speed: number;
  phase: number;
  size: number;
  color: string;
  data: {
    title: string;
    role: string;
    timeline?: string;
    highlights: string[];
  };
  yOffset?: number;
}

// Helper component for orbiting planets
function OrbitingPlanet({ radius, speed, phase, yOffset = 0, ...props }: OrbitingPlanetProps) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    if (group.current) {
      group.current.position.x = Math.cos(t) * radius;
      group.current.position.z = Math.sin(t) * radius;
      group.current.position.y = yOffset;
    }
  });
  return (
    <group ref={group}>
      <Planet position={[0, 0, 0]} {...props} />
    </group>
  );
}

const SolarSystem = () => {
  // Distribute planets at 120-degree intervals, with yOffset for 3D spread
  const planetConfigs = [
    {
      radius: 8,
      speed: 0.3,
      phase: 0,
      size: 1.5,
      color: "#4B9CD3",
      yOffset: 0,
      data: {
        title: "Living Dynamical Systems Lab",
        role: "Undergraduate Student Researcher",
        timeline: "Aug 2024 – Present",
        highlights: [
          "Built a real-time data acquisition system for a capacitive sensor",
          "Used Python for modeling and data visualization",
          "Improved calibration time by 75%",
          "Gave weekly presentations on research updates"
        ]
      }
    },
    {
      radius: 8,
      speed: 0.25,
      phase: 2 * Math.PI / 3,
      size: 1.2,
      color: "#FF6B6B",
      yOffset: 2,
      data: {
        title: "Strategy Kiln",
        role: "Analyst Intern",
        timeline: "May 2024 – Sept 2024",
        highlights: [
          "Managed $65M in CRM leads, improved funnels by 25%",
          "Used SQL/Python for segmentation and forecasting"
        ]
      }
    },
    {
      radius: 8,
      speed: 0.2,
      phase: 4 * Math.PI / 3,
      size: 1.3,
      color: "#4CAF50",
      yOffset: -2,
      data: {
        title: "Georgia Tech",
        role: "Undergraduate Student",
        highlights: [
          "CS + Math major",
          "Research in robotics, AI, and systems modeling"
        ]
      }
    }
  ];

  // Distribute project stars more evenly
  const starPositions: [number, number, number][] = [
    [5, 5, 5],
    [-5, 5, -5],
    [7, -3, 4],
    [-7, -3, -4],
    [4, -5, -6],
    [-4, -5, 6],
    [0, -7, 0],
  ];
  const starData = [
    {
      title: "PhantomShield",
      description: "Real-time deepfake detection tool",
      tech: ["PyTorch", "Electron.js", "OpenCV"],
      highlights: ["85% accuracy", "live video monitoring UI"]
    },
    {
      title: "EV-Arb Tool",
      description: "Sports betting prop evaluator",
      tech: ["Python", "FastAPI", "React"],
      highlights: ["Analyzes 10k+ props daily", "full-stack dashboard"]
    },
    {
      title: "Pet Mood Detection",
      description: "CV project for classifying dog breeds",
      tech: ["TensorFlow", "OpenCV"],
      highlights: ["MobileNetV2", "data augmentation", "85% accuracy"]
    },
    {
      title: "ROS Autonomous Robot",
      description: "Simulated SLAM + path planning bot",
      tech: ["Python", "ROS", "Gazebo"],
      highlights: ["Multi-goal routing", "TF debugging", "RViz visualization"]
    },
    {
      title: "BiasScope",
      description: "Real-time media bias detector",
      tech: ["Python", "React", "Sonar API"],
      highlights: ["AI-powered source comparison", "tone analysis"]
    },
    {
      title: "ScholarGrind",
      description: "Study assistant with LLM + calendar sync",
      tech: ["Django", "PostgreSQL", "Google Calendar API", "OpenAI API"],
      highlights: ["Smart scheduling", "AI-powered study recommendations"]
    },
    {
      title: "Sports Highlight Detector",
      description: "Video-based sports moment extractor",
      tech: ["Python", "OpenCV"],
      highlights: ["Motion pattern detection", "automatic clip extraction"]
    }
  ];

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Sun />
          {/* Animated Planets */}
          {planetConfigs.map((planet, i) => (
            <OrbitingPlanet
              key={i}
              radius={planet.radius}
              speed={planet.speed}
              phase={planet.phase}
              size={planet.size}
              color={planet.color}
              data={planet.data}
              yOffset={planet.yOffset}
            />
          ))}
          {/* Project Stars */}
          {starPositions.map((pos, i) => (
            <ProjectStar key={i} position={pos as [number, number, number]} data={starData[i]} />
          ))}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SolarSystem; 