import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Vector3Animator } from './ProfessionalAnimationController';

interface CinematicCameraControllerProps {
  focusTarget: 'sun' | 'planet' | 'overview' | null;
  planetPosition?: [number, number, number] | null;
  onTransitionComplete?: () => void;
}

export const CinematicCameraController = ({
  focusTarget,
  planetPosition,
  onTransitionComplete
}: CinematicCameraControllerProps) => {
  const { camera, size } = useThree();
  const positionAnimator = useRef(new Vector3Animator(0.08));
  const lookAtAnimator = useRef(new Vector3Animator(0.1));
  const fovAnimator = useRef(60);
  const targetFov = useRef(60);

  const isMobile = size.width < 768;

  // Define camera positions for different states
  const cameraPositions = {
    overview: isMobile ? [0, 5, 25] : [0, 8, 20],
    sun: isMobile ? [0, 2, 8] : [0, 3, 6],
    planet: planetPosition ? [
      planetPosition[0] + (isMobile ? 4 : 3),
      planetPosition[1] + (isMobile ? 3 : 2),
      planetPosition[2] + (isMobile ? 4 : 3)
    ] : [0, 0, 10]
  };

  const lookAtPositions = {
    overview: [0, 0, 0],
    sun: [0, 0, 0],
    planet: planetPosition || [0, 0, 0]
  };

  const fovSettings = {
    overview: isMobile ? 75 : 60,
    sun: isMobile ? 65 : 50,
    planet: isMobile ? 70 : 55
  };

  useFrame((state, deltaTime) => {
    const time = state.clock.getElapsedTime();

    // Determine target based on focus
    let targetPos = cameraPositions.overview;
    let lookAtPos = lookAtPositions.overview;
    let fov = fovSettings.overview;

    switch (focusTarget) {
      case 'sun':
        targetPos = cameraPositions.sun;
        lookAtPos = lookAtPositions.sun;
        fov = fovSettings.sun;
        break;
      case 'planet':
        if (planetPosition) {
          targetPos = cameraPositions.planet;
          lookAtPos = lookAtPositions.planet;
          fov = fovSettings.planet;
        }
        break;
      case 'overview':
      default:
        // Add gentle orbital movement when in overview
        const orbitRadius = 2;
        const orbitSpeed = 0.1;
        targetPos = [
          cameraPositions.overview[0] + Math.sin(time * orbitSpeed) * orbitRadius,
          cameraPositions.overview[1] + Math.cos(time * orbitSpeed * 0.7) * orbitRadius * 0.3,
          cameraPositions.overview[2]
        ];
        break;
    }

    // Update animators
    positionAnimator.current.setTarget(targetPos[0], targetPos[1], targetPos[2]);
    lookAtAnimator.current.setTarget(lookAtPos[0], lookAtPos[1], lookAtPos[2]);

    // Smooth FOV transition
    targetFov.current = fov;
    fovAnimator.current = THREE.MathUtils.lerp(fovAnimator.current, targetFov.current, 0.05);

    // Apply animations
    const newPosition = positionAnimator.current.update(deltaTime);
    const newLookAt = lookAtAnimator.current.update(deltaTime);

    camera.position.copy(newPosition);
    camera.lookAt(newLookAt.x, newLookAt.y, newLookAt.z);
    if ('fov' in camera) {
      camera.fov = fovAnimator.current;
      camera.updateProjectionMatrix();
    }

    // Cinematic camera shake for immersion
    if (focusTarget === 'sun') {
      const shakeIntensity = 0.02;
      const shake = new THREE.Vector3(
        Math.sin(time * 8) * shakeIntensity,
        Math.cos(time * 6) * shakeIntensity,
        Math.sin(time * 10) * shakeIntensity * 0.5
      );
      camera.position.add(shake);
    }

    // Subtle breathing effect for planets
    if (focusTarget === 'planet' && planetPosition) {
      const breathIntensity = 0.1;
      const breathOffset = Math.sin(time * 2) * breathIntensity;
      camera.position.y += breathOffset;
    }

    // Call transition complete callback
    if (onTransitionComplete) {
      const positionDistance = camera.position.distanceTo(new THREE.Vector3(...targetPos));
      if (positionDistance < 0.5) {
        onTransitionComplete();
      }
    }
  });

  return null;
};

export default CinematicCameraController;