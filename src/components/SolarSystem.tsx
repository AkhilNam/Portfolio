import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  CameraShake,
  Sparkles,
  Preload,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Sun from './Sun';
import Planet from './Planet';
import ProjectStar from './ProjectStar';
import ResumeSatellite from './ResumeSatellite';
import SpaceStation from './SpaceStation';
// Cleaned up unused imports
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
  fixedPlanetPosition
}: {
  focusOnSun: boolean,
  shouldZoomOut: boolean,
  setShouldZoomOut: (v: boolean) => void,
  focusPlanet: { position: [number, number, number], data: { title: string; role: string; timeline?: string; description: string; highlights: string[] }, color: string } | null,
  fixedPlanetPosition: [number, number, number] | null
}) => {
  const { camera, size } = useThree();

  // Responsive camera positions based on screen size
  const isMobile = size.width < 768;
  const sunPosition = isMobile ? [0, 0, 6] : [0, 0, 4];
  const zoomOutPosition = isMobile ? [0, 0, 18] : [0, 0, 12];

  const planetTarget = fixedPlanetPosition ? [
    fixedPlanetPosition[0],
    fixedPlanetPosition[1],
    fixedPlanetPosition[2] + (isMobile ? 3 : 2)
  ] : null;

  useFrame(() => {
    // Smoother camera transitions with easing
    const lerpSpeed = 0.08;

    if (focusOnSun) {
      camera.position.lerp(new THREE.Vector3(sunPosition[0], sunPosition[1], sunPosition[2]), lerpSpeed);
      camera.lookAt(0, 0, 0);
    } else if (planetTarget && fixedPlanetPosition) {
      camera.position.lerp(new THREE.Vector3(planetTarget[0], planetTarget[1], planetTarget[2]), lerpSpeed);

      // Smooth look-at with slight offset for better viewing angle
      const lookAtTarget = new THREE.Vector3(fixedPlanetPosition[0], fixedPlanetPosition[1], fixedPlanetPosition[2]);

      // Create a smooth look-at animation
      const currentTarget = new THREE.Vector3();
      camera.getWorldDirection(currentTarget);
      currentTarget.normalize();

      const desiredDirection = lookAtTarget.clone().sub(camera.position).normalize();
      currentTarget.lerp(desiredDirection, lerpSpeed);

      const lookAtPoint = camera.position.clone().add(currentTarget.multiplyScalar(10));
      camera.lookAt(lookAtPoint);

    } else if (shouldZoomOut) {
      camera.position.lerp(new THREE.Vector3(zoomOutPosition[0], zoomOutPosition[1], zoomOutPosition[2]), lerpSpeed);
      camera.lookAt(0, 0, 0);

      const distance = camera.position.distanceTo(new THREE.Vector3(zoomOutPosition[0], zoomOutPosition[1], zoomOutPosition[2]));
      if (distance < 0.3) {
        setShouldZoomOut(false);
      }
    }
  });
  return null;
};

const SolarSystem = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Simple settings object for now
  const settings = {
    shadows: true,
    bloom: true,
    postProcessing: true,
    particleCount: 200,
    starCount: 5000,
    cameraShake: false,
    atmosphereEffects: true,
    textureQuality: 'high' as const
  };
  const fps = 60;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize planet configurations for performance
  const planetConfigs = useMemo(() => [
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
  ], []);

  // Memoize star positions and data for performance
  const starPositions: [number, number, number][] = useMemo(() => [
    [5, 5, 5],
    [-5, 5, -5],
    [7, -3, 4],
    [-7, -3, -4],
    [4, -5, -6],
    [-4, -5, 6],
    [0, -7, 0],
    [8, 6, -7],
  ], []);

  const starData = useMemo(() => [
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
  ], []);

  const [focusOnSun, setFocusOnSun] = useState(false);
  const [focusPlanet, setFocusPlanet] = useState<null | { position: [number, number, number], data: typeof planetConfigs[0]['data'], color: string }>(null);
  const [shouldZoomOut, setShouldZoomOut] = useState(false);
  const [fixedPlanetPosition, setFixedPlanetPosition] = useState<[number, number, number] | null>(null);

  // Memoize planet position calculator
  const getPlanetPosition = useCallback((planet: typeof planetConfigs[0]) => {
    const t = performance.now() * 0.001 * planet.speed + planet.phase;
    return [
      Math.cos(t) * planet.radius,
      planet.yOffset ?? 0,
      Math.sin(t) * planet.radius
    ] as [number, number, number];
  }, []);

  // Memoize event handlers
  const handleSunClick = useCallback(() => setFocusOnSun(true), []);

  const handlePlanetClick = useCallback((planet: typeof planetConfigs[0]) => {
    const pos = getPlanetPosition(planet);
    setFixedPlanetPosition(pos);
    setFocusPlanet({
      position: pos,
      data: planet.data,
      color: planet.color
    });
  }, [getPlanetPosition]);

  const handleStarClick = useCallback((github: string) => {
    window.open(github, '_blank');
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {/* Performance indicator for debugging */}
      {import.meta.env.DEV && (
        <div className="fixed top-4 left-4 z-50 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
          FPS: {Math.round(fps)}
        </div>
      )}

      <Canvas
        camera={{
          position: isMobile ? [0, 0, 30] : [0, 0, 25],
          fov: isMobile ? 70 : 60
        }}
        shadows
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.setClearColor('#000000');
        }}
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

          {/* Starfield */}
          <Stars radius={100} depth={50} count={settings.starCount} factor={4} saturation={0} fade speed={1} />
          <Sparkles count={settings.particleCount} scale={100} size={2} speed={0.4} />
          
          <Sun onClick={handleSunClick} />
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
              onClick={() => handlePlanetClick(planet)}
            />
          ))}
          
          {/* Project Stars */}
          {starPositions.map((pos, i) => (
            <ProjectStar 
              key={i} 
              position={pos as [number, number, number]} 
              data={starData[i]} 
              onClick={() => handleStarClick(starData[i].github)}
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
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            panSpeed={0.8}
            minDistance={isMobile ? 15 : 10}
            maxDistance={isMobile ? 50 : 40}
            autoRotate={false}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN
            }}
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

          {/* Preload assets for better performance */}
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Profile Overlay for Sun */}
      {focusOnSun && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sun-modal-title"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setFocusOnSun(false);
              setShouldZoomOut(true);
            }
          }}
          tabIndex={-1}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => {
              setFocusOnSun(false);
              setShouldZoomOut(true);
            }}
          />

          {/* Modal content */}
          <div
            className={`relative z-10 rounded-3xl shadow-[0_0_60px_#ffd700,0_0_120px_#ff6a00]
              bg-[radial-gradient(circle_at_60%_40%,#fff_0%,#ffd700_40%,#ff6a00_100%)]
              backdrop-blur-md opacity-90 border-4 border-yellow-200 animate-pulse-sun
              ${isMobile ? 'p-6 mx-4 max-w-sm' : 'p-10 min-w-[340px] max-w-[420px]'}`}
            style={{
              boxShadow: '0 0 60px 20px #ffd700, 0 0 120px 40px #ff6a00',
              borderColor: '#ffd700',
              filter: 'drop-shadow(0 0 60px #ffd700) drop-shadow(0 0 120px #ff6a00)',
              background: 'radial-gradient(circle at 60% 40%, #fff 0%, #ffd700 40%, #ff6a00 100%)',
              backgroundColor: 'rgba(255, 106, 0, 0.85)',
            }}
          >
            <button
              className="absolute top-4 right-4 text-white text-2xl md:text-3xl font-bold bg-black bg-opacity-30 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg hover:bg-opacity-60 transition focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => {
                setFocusOnSun(false);
                setShouldZoomOut(true);
              }}
              aria-label="Close modal"
              style={{ textShadow: '0 0 8px rgba(0,0,0,0.7)' }}
            >
              ×
            </button>

            <div className="flex flex-col items-center justify-center">
              <h1
                id="sun-modal-title"
                className={`font-extrabold mb-2 text-white ${isMobile ? 'text-2xl' : 'text-4xl'}`}
                style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}
              >
                Akhil Nampally
              </h1>

              <p className={`mb-4 text-white text-center font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}
                 style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                Researching smart systems & building real-time AI tools.
              </p>

              <div className="mt-4 text-white text-center space-y-3" style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                <p className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
                  Georgia Tech | CS + Math | Researcher | Builder
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  <a
                    href="mailto:anampally3@gatech.edu"
                    className="underline text-blue-300 font-bold hover:text-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1"
                    style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}
                  >
                    anampally3@gatech.edu
                  </a>

                  <a
                    href="https://linkedin.com/in/akhilnampally"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-300 font-bold hover:text-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-2 py-1"
                    style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,#ffd700_0%,#ff6a00_60%,transparent_100%)] opacity-40 blur-3xl animate-pulse-sun" />
        </div>
      )}
      {/* Profile Overlay for Planets */}
      {focusPlanet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="planet-modal-title"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setFocusPlanet(null);
              setFixedPlanetPosition(null);
              setShouldZoomOut(true);
            }
          }}
          tabIndex={-1}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => {
              setFocusPlanet(null);
              setFixedPlanetPosition(null);
              setShouldZoomOut(true);
            }}
          />

          {/* Modal content */}
          <div
            className={`relative z-10 rounded-3xl shadow-[0_0_60px] backdrop-blur-md opacity-90 border-4 animate-pulse-sun
              ${isMobile ? 'p-6 mx-4 max-w-sm' : 'p-10 min-w-[340px] max-w-[420px]'}`}
            style={{
              boxShadow: `0 0 60px 20px ${focusPlanet.color}, 0 0 120px 40px #fff`,
              borderColor: focusPlanet.color,
              filter: `drop-shadow(0 0 60px ${focusPlanet.color}) drop-shadow(0 0 120px #fff)`,
              background: `radial-gradient(circle at 60% 40%, #fff 0%, ${focusPlanet.color} 40%, #000 100%)`,
              backgroundColor: 'rgba(0,0,0,0.85)',
            }}
          >
            <button
              className="absolute top-4 right-4 text-white text-2xl md:text-3xl font-bold bg-black bg-opacity-30 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shadow-lg hover:bg-opacity-60 transition focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => {
                setFocusPlanet(null);
                setFixedPlanetPosition(null);
                setShouldZoomOut(true);
              }}
              aria-label="Close modal"
              style={{ textShadow: '0 0 8px rgba(0,0,0,0.7)' }}
            >
              ×
            </button>

            <div className="flex flex-col items-center justify-center">
              {/* Planet-specific content */}
              {focusPlanet.data.title === 'Georgia Tech' && (
                <>
                  <h1
                    id="planet-modal-title"
                    className={`font-bold mb-2 text-white ${isMobile ? 'text-xl' : 'text-3xl'}`}
                    style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}
                  >
                    Georgia Tech
                  </h1>
                  <p className={`text-white mb-2 font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}
                     style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                    Undergraduate Student — CS + Math
                  </p>
                  <p className={`text-white text-center mb-2 ${isMobile ? 'text-sm' : ''}`}
                     style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                    Exploring the intersection of computation, data, and intelligent systems. I dive deep into AI, robotics, and optimization — and bring ideas to life through projects, research, and rapid iteration.
                  </p>
                </>
              )}
              {focusPlanet.data.title === 'Strategy Kiln' && (
                <>
                  <h1
                    id="planet-modal-title"
                    className={`font-bold mb-2 text-white ${isMobile ? 'text-xl' : 'text-3xl'}`}
                    style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}
                  >
                    Strategy Kiln
                  </h1>
                  <p className={`text-white mb-2 font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}
                     style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                    Analyst Intern — Summer 2024
                  </p>
                  <p className={`text-white text-center mb-2 ${isMobile ? 'text-sm' : ''}`}
                     style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                    Worked at the intersection of data and strategy, managing $65M in CRM leads and building automated pipelines that boosted conversion by 25%. Used SQL + Python to segment users, forecast trends, and guide client growth.
                  </p>
                </>
              )}
              {focusPlanet.data.title === 'Living Dynamical Systems Lab' && (
                <>
                  <h1
                    id="planet-modal-title"
                    className={`font-bold mb-2 text-white ${isMobile ? 'text-xl' : 'text-3xl'}`}
                    style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}
                  >
                    Living Dynamical Systems Lab
                  </h1>
                  <p className={`text-white mb-2 font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}
                     style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                    Undergraduate Researcher — Aug 2024 to Present
                  </p>
                  <p className={`text-white text-center mb-2 ${isMobile ? 'text-sm' : ''}`}
                     style={{textShadow: '0 0 8px rgba(0,0,0,0.7)'}}>
                    Engineering and modeling real-world biological systems through smart hardware and AI. Built a real-time data acquisition + visualization pipeline for a capacitive sensor system, cutting calibration time by 75% and enabling more precise experiments.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 w-[500px] h-[500px] rounded-full"
            style={{
              background: `radial-gradient(circle,${focusPlanet.color}_0%,#fff_60%,transparent_100%)`,
              opacity: 0.4,
              filter: 'blur(60px)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SolarSystem; 