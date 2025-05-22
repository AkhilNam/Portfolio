import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars,
  CameraShake,
  Sparkles,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useRef, useState } from 'react';
import Sun from './Sun';
import Planet from './Planet';
import ProjectStar from './ProjectStar';
import ResumeSatellite from './ResumeSatellite';
import SpaceStation from './SpaceStation';
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
  onClick?: () => void;
}

// Helper component for orbiting planets
function OrbitingPlanet({ radius, speed, phase, yOffset = 0, isFocused, ...props }: OrbitingPlanetProps & { isFocused?: boolean }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!isFocused && group.current) {
      const t = clock.getElapsedTime() * speed + phase;
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      group.current.position.x = x;
      group.current.position.z = z;
      group.current.position.y = yOffset;
    }
  });

  return (
    <group ref={group}>
      <Planet position={[0, 0, 0]} {...props} />
    </group>
  );
}

const CameraAnimator = ({ 
  focusOnSun, 
  shouldZoomOut, 
  setShouldZoomOut, 
  focusPlanet,
  fixedPlanetPosition 
}: { 
  focusOnSun: boolean, 
  shouldZoomOut: boolean, 
  setShouldZoomOut: (v: boolean) => void, 
  focusPlanet: any,
  fixedPlanetPosition: [number, number, number] | null
}) => {
  const { camera } = useThree();
  const sunPosition = [0, 0, 4];
  const zoomOutPosition = [0, 0, 12];
  const planetTarget = fixedPlanetPosition ? [
    fixedPlanetPosition[0],
    fixedPlanetPosition[1],
    fixedPlanetPosition[2] + 2
  ] : null;

  useFrame(() => {
    if (focusOnSun) {
      camera.position.lerp(new THREE.Vector3(...sunPosition), 0.08);
      camera.lookAt(0, 0, 0);
    } else if (planetTarget && fixedPlanetPosition) {
      // Smoothly move camera to planet position
      camera.position.lerp(new THREE.Vector3(...planetTarget), 0.08);
      // Look at the fixed planet position
      camera.lookAt(
        fixedPlanetPosition[0],
        fixedPlanetPosition[1],
        fixedPlanetPosition[2]
      );
    } else if (shouldZoomOut) {
      camera.position.lerp(new THREE.Vector3(...zoomOutPosition), 0.08);
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(new THREE.Vector3(...zoomOutPosition)) < 0.2) {
        setShouldZoomOut(false);
      }
    }
  });
  return null;
};

const SolarSystem = () => {
  // Distribute planets at 120-degree intervals, with yOffset for 3D spread
  const planetConfigs = [
    {
      radius: 8,
      speed: 0.3,
      phase: 0,
      size: 1.5,
      color: "#4B9CD3",
      accentColor: "#4B9CD3",
      yOffset: 0,
      data: {
        title: "Living Dynamical Systems Lab",
        role: "Undergraduate Researcher",
        timeline: "Aug 2024 to Present",
        description: "Engineering and modeling real-world biological systems through smart hardware and AI. Built a real-time data acquisition + visualization pipeline for a capacitive sensor system, cutting calibration time by 75% and enabling more precise experiments.",
        highlights: [],
      }
    },
    {
      radius: 8,
      speed: 0.25,
      phase: 2 * Math.PI / 3,
      size: 1.2,
      color: "#FF6B6B",
      accentColor: "#FF6B6B",
      yOffset: 2,
      data: {
        title: "Strategy Kiln",
        role: "Analyst Intern",
        timeline: "May 2024 – Sept 2024",
        description: "Worked at the intersection of data and strategy, managing $65M in CRM leads and building automated pipelines that boosted conversion by 25%. Used SQL + Python to segment users, forecast trends, and guide client growth.",
        highlights: [],
      }
    },
    {
      radius: 8,
      speed: 0.2,
      phase: 4 * Math.PI / 3,
      size: 1.3,
      color: "#4CAF50",
      accentColor: "#4CAF50",
      yOffset: -2,
      data: {
        title: "Georgia Tech",
        role: "Undergraduate Student",
        timeline: "",
        description: "Exploring the intersection of computation, data, and intelligent systems. I dive deep into AI, robotics, and optimization — and bring ideas to life through projects, research, and rapid iteration.",
        highlights: [],
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
    [8, 6, -7],
  ];
  const starData = [
    {
      title: "PhantomShield",
      description: "Real-time deepfake detection tool",
      tech: ["PyTorch", "Electron.js", "OpenCV"],
      highlights: ["85% accuracy", "live video monitoring UI"],
      github: "https://github.com/akhilnam/phantomshield"
    },
    {
      title: "EV-Arb Tool",
      description: "Sports betting prop evaluator",
      tech: ["Python", "FastAPI", "React"],
      highlights: ["Analyzes 10k+ props daily", "full-stack dashboard"],
      github: "https://github.com/akhilnam/ev-arb-tool"
    },
    {
      title: "Pet Mood Detection",
      description: "CV project for classifying dog breeds",
      tech: ["TensorFlow", "OpenCV"],
      highlights: ["MobileNetV2", "data augmentation", "85% accuracy"],
      github: "https://github.com/AkhilNam/DogBreedPrediction"
    },
    {
      title: "ROS Autonomous Robot",
      description: "Simulated SLAM + path planning bot",
      tech: ["Python", "ROS", "Gazebo"],
      highlights: ["Multi-goal routing", "TF debugging", "RViz visualization"],
      github: "https://github.com/AkhilNam/ros-autonomous-navigation"
    },
    {
      title: "BiasScope",
      description: "Real-time media bias detector",
      tech: ["Python", "React", "Sonar API"],
      highlights: ["AI-powered source comparison", "tone analysis"],
      github: "https://github.com/akhilnam/biasscope"
    },
    {
      title: "ScholarGrind",
      description: "Study assistant with LLM + calendar sync",
      tech: ["Django", "PostgreSQL", "Google Calendar API", "OpenAI API"],
      highlights: ["Smart scheduling", "AI-powered study recommendations"],
      github: "https://github.com/svkapoor/scholargrind"
    },
    {
      title: "Sports Highlight Detector",
      description: "Video-based sports moment extractor",
      tech: ["Python", "OpenCV"],
      highlights: ["Motion pattern detection", "automatic clip extraction"],
      github: "https://github.com/akhilnam/Sports-Highlight-Detector"
    },
    {
      title: "College4U",
      description: "College admissions and counseling platform",
      tech: ["React", "Node.js", "MongoDB"],
      highlights: ["Personalized recommendations", "Application tracking"],
      github: "https://github.com/AkhilNam/College4U"
    }
  ];

  const [focusOnSun, setFocusOnSun] = useState(false);
  const [focusPlanet, setFocusPlanet] = useState<null | { position: [number, number, number], data: any, color: string }>(null);
  const [shouldZoomOut, setShouldZoomOut] = useState(false);
  const [fixedPlanetPosition, setFixedPlanetPosition] = useState<[number, number, number] | null>(null);

  // Calculate planet positions
  const getPlanetPosition = (planet: typeof planetConfigs[0]) => {
    const t = performance.now() * 0.001 * planet.speed + planet.phase;
    return [
      Math.cos(t) * planet.radius,
      planet.yOffset ?? 0,
      Math.sin(t) * planet.radius
    ] as [number, number, number];
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Canvas 
        camera={{ position: [0, 0, 25], fov: 60 }}
        shadows
      >
        <Suspense fallback={null}>
          <CameraAnimator 
            focusOnSun={focusOnSun} 
            shouldZoomOut={shouldZoomOut} 
            setShouldZoomOut={setShouldZoomOut} 
            focusPlanet={focusPlanet}
            fixedPlanetPosition={fixedPlanetPosition}
          />
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight
            position={[0, 0, 0]}
            intensity={2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Dense Starfield */}
          <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
          <Sparkles count={200} scale={100} size={2} speed={0.4} />
          
          <Sun onClick={() => setFocusOnSun(true)} />
          <ResumeSatellite />
          <SpaceStation />
          
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
              onClick={() => {
                const pos = getPlanetPosition(planet);
                setFixedPlanetPosition(pos);
                setFocusPlanet({ 
                  position: pos,
                  data: planet.data, 
                  color: planet.color 
                });
              }}
            />
          ))}
          
          {/* Project Stars */}
          {starPositions.map((pos, i) => (
            <ProjectStar 
              key={i} 
              position={pos as [number, number, number]} 
              data={starData[i]} 
              onClick={() => window.open(starData[i].github, '_blank')}
            />
          ))}
          
          {/* Orbit Rings for each planet */}
          {planetConfigs.map((planet, i) => (
            <mesh
              key={`orbit-ring-${i}`}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[planet.radius - 0.05, planet.radius + 0.05, 64]} />
              <meshBasicMaterial color="white" transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>
          ))}
          
          <OrbitControls 
            enableZoom={!focusOnSun && !focusPlanet} 
            enablePan={!focusOnSun && !focusPlanet} 
            enableRotate={!focusOnSun && !focusPlanet} 
          />
          
          {/* Camera Effects */}
          <CameraShake 
            yawFrequency={0.1} 
            pitchFrequency={0.1} 
            rollFrequency={0.1} 
            intensity={0.2} 
          />
          
          {/* Post-processing Effects */}
          <EffectComposer>
            <Bloom 
              intensity={1.5}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              height={300}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Profile Overlay for Sun */}
      {focusOnSun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Glowing, blurred, sun-like modal */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              p-10 rounded-3xl shadow-[0_0_60px_#ffd700,0_0_120px_#ff6a00]
              bg-[radial-gradient(circle_at_60%_40%,#fff_0%,#ffd700_40%,#ff6a00_100%)]
              backdrop-blur-md opacity-90
              border-4 border-yellow-200
              animate-pulse-sun"
            style={{
              boxShadow: '0 0 60px 20px #ffd700, 0 0 120px 40px #ff6a00',
              borderColor: '#ffd700',
              minWidth: 340,
              maxWidth: 420,
              filter: 'drop-shadow(0 0 60px #ffd700) drop-shadow(0 0 120px #ff6a00)',
              background: 'radial-gradient(circle at 60% 40%, #fff 0%, #ffd700 40%, #ff6a00 100%)',
              backgroundColor: 'rgba(255, 106, 0, 0.85)',
            }}
          >
            <button
              className="absolute top-4 right-6 text-white text-3xl font-bold bg-black bg-opacity-30 rounded-full px-2 py-0.5 shadow-lg hover:bg-opacity-60 transition"
              onClick={() => {
                setFocusOnSun(false);
                setShouldZoomOut(true);
              }}
              style={{ zIndex: 10, textShadow: '0 0 8px rgba(0,0,0,0.7)' }}
            >
              ×
            </button>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-extrabold mb-2 text-white" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>Akhil Nampally</h1>
              <p className="mb-4 text-lg text-white text-center font-semibold" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                Researching smart systems & building real-time AI tools.
              </p>
              {/* Add more info, links, etc. here */}
              <div className="mt-4 text-white text-center" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                <p className="mb-2 font-medium">Georgia Tech | CS + Math | Researcher | Builder</p>
                <a
                  href="mailto:anampally3@gatech.edu"
                  className="underline text-blue-300 font-bold hover:text-blue-200 transition"
                  style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}
                >
                  anampally3@gatech.edu
                </a>
              </div>
            </div>
          </div>
          {/* Optional: extra soft glow ring/aura */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#ffd700_0%,#ff6a00_60%,transparent_100%)] opacity-40 blur-3xl animate-pulse-sun" />
        </div>
      )}
      {/* Profile Overlay for Planets */}
      {focusPlanet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Glowing, blurred, planet-like modal */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              p-10 rounded-3xl shadow-[0_0_60px] backdrop-blur-md opacity-90 border-4 animate-pulse-sun"
            style={{
              boxShadow: `0 0 60px 20px ${focusPlanet.color}, 0 0 120px 40px #fff`,
              borderColor: focusPlanet.color,
              minWidth: 340,
              maxWidth: 420,
              filter: `drop-shadow(0 0 60px ${focusPlanet.color}) drop-shadow(0 0 120px #fff)`,
              background: `radial-gradient(circle at 60% 40%, #fff 0%, ${focusPlanet.color} 40%, #000 100%)`,
              backgroundColor: 'rgba(0,0,0,0.85)',
            }}
          >
            <button
              className="absolute top-4 right-6 text-white text-3xl font-bold bg-black bg-opacity-30 rounded-full px-2 py-0.5 shadow-lg hover:bg-opacity-60 transition"
              onClick={() => {
                setFocusPlanet(null);
                setFixedPlanetPosition(null);
                setShouldZoomOut(true);
              }}
              style={{ zIndex: 10, textShadow: '0 0 8px rgba(0,0,0,0.7)' }}
            >
              ×
            </button>
            <div className="flex flex-col items-center justify-center">
              {/* Planet-specific content */}
              {focusPlanet.data.title === 'Georgia Tech' && (
                <>
                  <h1 className="text-3xl font-bold mb-2 text-white" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>Georgia Tech</h1>
                  <p className="text-lg text-white mb-2 font-semibold" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>Undergraduate Student — CS + Math</p>
                  <p className="text-white text-center mb-2" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                    Exploring the intersection of computation, data, and intelligent systems. I dive deep into AI, robotics, and optimization — and bring ideas to life through projects, research, and rapid iteration.
                  </p>
                </>
              )}
              {focusPlanet.data.title === 'Strategy Kiln' && (
                <>
                  <h1 className="text-3xl font-bold mb-2 text-white" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>Strategy Kiln</h1>
                  <p className="text-lg text-white mb-2 font-semibold" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>Analyst Intern — Summer 2024</p>
                  <p className="text-white text-center mb-2" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                    Worked at the intersection of data and strategy, managing $65M in CRM leads and building automated pipelines that boosted conversion by 25%. Used SQL + Python to segment users, forecast trends, and guide client growth.
                  </p>
                </>
              )}
              {focusPlanet.data.title === 'Living Dynamical Systems Lab' && (
                <>
                  <h1 className="text-3xl font-bold mb-2 text-white" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>Living Dynamical Systems Lab</h1>
                  <p className="text-lg text-white mb-2 font-semibold" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>Undergraduate Researcher — Aug 2024 to Present</p>
                  <p className="text-white text-center mb-2" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                    Engineering and modeling real-world biological systems through smart hardware and AI. Built a real-time data acquisition + visualization pipeline for a capacitive sensor system, cutting calibration time by 75% and enabling more precise experiments.
                  </p>
                </>
              )}
            </div>
          </div>
          {/* Optional: extra soft glow ring/aura */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 w-[500px] h-[500px] rounded-full"
            style={{
              background: `radial-gradient(circle,${focusPlanet.color}_0%,#fff_60%,transparent_100%)`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SolarSystem; 