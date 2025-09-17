import { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PerformanceSettings {
  shadows: boolean;
  bloom: boolean;
  postProcessing: boolean;
  particleCount: number;
  starCount: number;
  cameraShake: boolean;
  atmosphereEffects: boolean;
  textureQuality: 'low' | 'medium' | 'high';
}

export const usePerformanceManager = () => {
  const { gl, scene } = useThree();
  const [fps, setFps] = useState(60);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());
  const [settings, setSettings] = useState<PerformanceSettings>({
    shadows: true,
    bloom: true,
    postProcessing: true,
    particleCount: 200,
    starCount: 5000,
    cameraShake: false,
    atmosphereEffects: true,
    textureQuality: 'high'
  });

  // Monitor FPS and adapt quality
  useFrame(() => {
    setFrameCount(prev => prev + 1);

    if (frameCount % 60 === 0) { // Check every 60 frames
      const now = performance.now();
      const delta = now - lastTime;
      const currentFps = 60000 / delta;
      setFps(currentFps);
      setLastTime(now);

      // Adaptive quality based on FPS
      if (currentFps < 30) {
        setSettings(prev => ({
          ...prev,
          shadows: false,
          bloom: false,
          postProcessing: false,
          particleCount: 50,
          starCount: 3000,
          cameraShake: false,
          atmosphereEffects: false,
          textureQuality: 'low'
        }));
      } else if (currentFps < 45) {
        setSettings(prev => ({
          ...prev,
          shadows: true,
          bloom: false,
          postProcessing: false,
          particleCount: 100,
          starCount: 5000,
          cameraShake: false,
          atmosphereEffects: true,
          textureQuality: 'medium'
        }));
      } else if (currentFps >= 55) {
        setSettings(prev => ({
          ...prev,
          shadows: true,
          bloom: true,
          postProcessing: true,
          particleCount: 200,
          starCount: 7000,
          cameraShake: true,
          atmosphereEffects: true,
          textureQuality: 'high'
        }));
      }
    }
  });

  useEffect(() => {
    // Optimize renderer settings
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.shadowMap.enabled = settings.shadows;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.2;

    // Enable frustum culling
    scene.traverse((object) => {
      if ('isMesh' in object && object.isMesh) {
        object.frustumCulled = true;
      }
    });
  }, [gl, scene, settings.shadows]);

  return { settings, fps };
};

export default usePerformanceManager;