import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  Sparkles,
  Preload,
} from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

import ProductionSun from './ProductionSun';
import ProductionPlanet from './ProductionPlanet';
import CinematicCameraController from './CinematicCameraController';
import ProjectStar from './ProjectStar';
import ResumeSatellite from './ResumeSatellite';
import SpaceStation from './SpaceStation';

// Production-grade orbiting component
function ProductionOrbitingPlanet({
  radius,
  speed,
  phase,
  yOffset = 0,
  isFocused = false,
  ...props
}: {
  radius: number;
  speed: number;
  phase: number;
  yOffset?: number;
  isFocused?: boolean;
  size: number;
  color: string;
  data: any;
  onClick?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  // Removed unused state

  useFrame(({ clock }, deltaTime) => {
    if (!isFocused && groupRef.current) {
      const t = clock.getElapsedTime() * speed + phase;
      const targetX = Math.cos(t) * radius;
      const targetZ = Math.sin(t) * radius;

      // Smooth interpolation for buttery movement
      const lerpFactor = 1 - Math.pow(0.001, deltaTime);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, lerpFactor);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, lerpFactor);
      groupRef.current.position.y = yOffset;

      // Position updated smoothly
    }
  });

  return (
    <group ref={groupRef}>
      <ProductionPlanet
        position={[0, 0, 0]}
        isFocused={isFocused}
        {...props}
      />
    </group>
  );
}

// Production-grade environment
function ProductionEnvironment() {
  return (
    <>
      {/* Professional lighting setup */}
      <ambientLight intensity={0.15} color="#4a5568" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Rim lighting for dramatic effect */}
      <directionalLight
        position={[-10, 5, -5]}
        intensity={0.8}
        color="#ff6b35"
      />

      {/* Fill light */}
      <pointLight
        position={[0, -10, 0]}
        intensity={0.3}
        color="#61dafb"
      />
    </>
  );
}

const ProductionSolarSystem = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [focusState, setFocusState] = useState<'overview' | 'sun' | 'planet'>('overview');
  const [focusedPlanet, setFocusedPlanet] = useState<{
    position: [number, number, number];
    data: any;
    color: string;
  } | null>(null);
  // Removed unused transitioning state

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Production-grade planet configurations
  const planetConfigs = useMemo(() => [
    {
      radius: 8,
      speed: 0.25,
      phase: 0,
      size: 1.4,
      color: "#4B9CD3",
      yOffset: 0,
      data: {
        title: "Living Dynamical Systems Lab",
        role: "Undergraduate Researcher",
        timeline: "Aug 2024 to Present",
        description: "Engineering and modeling real-world biological systems through smart hardware and AI. Built a real-time data acquisition + visualization pipeline for a capacitive sensor system, cutting calibration time by 75% and enabling more precise experiments.",
        highlights: ["Real-time data processing", "Hardware-software integration", "AI modeling"],
      }
    },
    {
      radius: 8,
      speed: 0.2,
      phase: 2 * Math.PI / 3,
      size: 1.1,
      color: "#FF6B6B",
      yOffset: 2,
      data: {
        title: "Strategy Kiln",
        role: "Analyst Intern",
        timeline: "May 2024 – Sept 2024",
        description: "Worked at the intersection of data and strategy, managing $65M in CRM leads and building automated pipelines that boosted conversion by 25%. Used SQL + Python to segment users, forecast trends, and guide client growth.",
        highlights: ["$65M CRM management", "25% conversion boost", "Automated pipelines"],
      }
    },
    {
      radius: 8,
      speed: 0.18,
      phase: 4 * Math.PI / 3,
      size: 1.2,
      color: "#4CAF50",
      yOffset: -2,
      data: {
        title: "Georgia Tech",
        role: "Undergraduate Student",
        timeline: "2022 - Present",
        description: "Exploring the intersection of computation, data, and intelligent systems. I dive deep into AI, robotics, and optimization — and bring ideas to life through projects, research, and rapid iteration.",
        highlights: ["CS + Math Double Major", "AI & Robotics Focus", "Research Experience"],
      }
    }
  ], []);

  // Project stars data
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
    }
  ], []);

  const starPositions = useMemo(() => [
    [6, 4, 6], [-6, 4, -6], [8, -2, 5],
    [-8, -2, -5], [5, -4, -7], [-5, -4, 7]
  ] as [number, number, number][], []);

  // Event handlers
  const handleSunClick = useCallback(() => {
    setFocusState('sun');
    setFocusedPlanet(null);
  }, []);

  const handlePlanetClick = useCallback((planet: typeof planetConfigs[0], position: [number, number, number]) => {
    setFocusState('planet');
    setFocusedPlanet({
      position,
      data: planet.data,
      color: planet.color
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setFocusState('overview');
    setFocusedPlanet(null);
  }, []);

  const handleStarClick = useCallback((github: string) => {
    window.open(github, '_blank');
  }, []);

  // Get current planet position for camera
  const getCurrentPlanetPosition = useCallback((planet: typeof planetConfigs[0]) => {
    const t = performance.now() * 0.001 * planet.speed + planet.phase;
    return [
      Math.cos(t) * planet.radius,
      planet.yOffset,
      Math.sin(t) * planet.radius
    ] as [number, number, number];
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
      {/* Production Canvas */}
      <Canvas
        camera={{
          position: isMobile ? [0, 5, 25] : [0, 8, 20],
          fov: isMobile ? 75 : 60,
          near: 0.1,
          far: 1000
        }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5, max: 1 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl, scene }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          gl.setClearColor('#000000');
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;

          // Optimize scene
          scene.fog = new THREE.Fog(0x000011, 30, 100);
        }}
      >
        <Suspense fallback={null}>
          {/* Cinematic Camera Control */}
          <CinematicCameraController
            focusTarget={focusState}
            planetPosition={focusedPlanet?.position || null}
          />

          {/* Professional Environment */}
          <ProductionEnvironment />

          {/* Enhanced Starfield */}
          <Stars
            radius={150}
            depth={50}
            count={isMobile ? 3000 : 5000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
          <Sparkles
            count={isMobile ? 100 : 200}
            scale={120}
            size={3}
            speed={0.3}
          />

          {/* Production Sun */}
          <ProductionSun
            onClick={handleSunClick}
            isFocused={focusState === 'sun'}
          />

          {/* Satellites and Space Station */}
          <ResumeSatellite />
          <SpaceStation />

          {/* Production Planets */}
          {planetConfigs.map((planet, i) => (
            <ProductionOrbitingPlanet
              key={i}
              radius={planet.radius}
              speed={planet.speed}
              phase={planet.phase}
              size={planet.size}
              color={planet.color}
              data={planet.data}
              yOffset={planet.yOffset}
              isFocused={focusState === 'planet' && focusedPlanet?.data.title === planet.data.title}
              onClick={() => handlePlanetClick(planet, getCurrentPlanetPosition(planet))}
            />
          ))}

          {/* Project Stars */}
          {starPositions.map((pos, i) => (
            <ProjectStar
              key={i}
              position={pos}
              data={starData[i]}
              onClick={() => handleStarClick(starData[i].github)}
            />
          ))}

          {/* Orbit Rings */}
          {planetConfigs.map((planet, i) => (
            <mesh
              key={`orbit-${i}`}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[planet.radius - 0.02, planet.radius + 0.02, 128]} />
              <meshBasicMaterial
                color="white"
                transparent
                opacity={0.08}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}

          {/* Professional Controls */}
          <OrbitControls
            enableZoom={focusState === 'overview'}
            enablePan={focusState === 'overview'}
            enableRotate={focusState === 'overview'}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.3}
            zoomSpeed={0.6}
            panSpeed={0.6}
            minDistance={isMobile ? 12 : 8}
            maxDistance={isMobile ? 40 : 30}
            autoRotate={false}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN
            }}
          />

          {/* Production Post-processing */}
          <EffectComposer enabled>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
              height={300}
            />
            <ToneMapping />
          </EffectComposer>

          <Preload all />
        </Suspense>
      </Canvas>

      {/* Production Modals */}
      <AnimatePresence>
        {focusState === 'sun' && (
          <ProductionModal
            type="sun"
            onClose={handleCloseModal}
            isMobile={isMobile}
          />
        )}
        {focusState === 'planet' && focusedPlanet && (
          <ProductionModal
            type="planet"
            data={focusedPlanet.data}
            color={focusedPlanet.color}
            onClose={handleCloseModal}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Production-grade modal component
const ProductionModal = ({
  type,
  data,
  color,
  onClose,
  isMobile
}: {
  type: 'sun' | 'planet';
  data?: any;
  color?: string;
  onClose: () => void;
  isMobile: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ backdropFilter: "blur(0px)" }}
        animate={{ backdropFilter: "blur(10px)" }}
        exit={{ backdropFilter: "blur(0px)" }}
        className="absolute inset-0 bg-black bg-opacity-50"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300
        }}
        className={`relative z-10 rounded-2xl backdrop-blur-md border-2 ${
          isMobile ? 'p-6 max-w-sm' : 'p-8 max-w-md'
        }`}
        style={{
          background: type === 'sun'
            ? 'radial-gradient(circle at 60% 40%, rgba(255, 215, 0, 0.9) 0%, rgba(255, 106, 0, 0.9) 40%, rgba(0, 0, 0, 0.9) 100%)'
            : `radial-gradient(circle at 60% 40%, ${color}99 0%, ${color}66 40%, rgba(0, 0, 0, 0.9) 100%)`,
          borderColor: type === 'sun' ? '#ffd700' : color,
          boxShadow: type === 'sun'
            ? '0 0 60px rgba(255, 215, 0, 0.3)'
            : `0 0 60px ${color}33`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Content */}
        <div className="text-white">
          {type === 'sun' ? (
            <>
              <h1 className={`font-bold mb-4 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                Akhil Nampally
              </h1>
              <p className={`mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}>
                Software Engineer & AI Researcher passionate about building intelligent systems that solve real-world problems.
              </p>
              <div className="space-y-2">
                <p className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Georgia Tech | CS + Math | Researcher | Builder
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="mailto:anampally3@gatech.edu"
                    className="text-blue-200 hover:text-blue-100 transition-colors underline"
                  >
                    anampally3@gatech.edu
                  </a>
                  <a
                    href="https://linkedin.com/in/akhilnampally"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-blue-100 transition-colors underline"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className={`font-bold mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                {data.title}
              </h1>
              <p className={`font-semibold mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
                {data.role} {data.timeline && `— ${data.timeline}`}
              </p>
              <p className={`mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}>
                {data.description}
              </p>
              {data.highlights.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Key Highlights:</h3>
                  <ul className={`list-disc list-inside space-y-1 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {data.highlights.map((highlight: string, i: number) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductionSolarSystem;