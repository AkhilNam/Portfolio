import { useRef, useCallback } from 'react';
import * as THREE from 'three';

export class SmoothAnimator {
  private position = new THREE.Vector3();
  private targetPosition = new THREE.Vector3();
  private velocity = new THREE.Vector3();
  private rotation = new THREE.Euler();
  private targetRotation = new THREE.Euler();
  private scale = new THREE.Vector3(1, 1, 1);
  private targetScale = new THREE.Vector3(1, 1, 1);

  constructor(
    private dampingFactor = 0.1,
    private maxVelocity = 10
  ) {}

  setTargetPosition(x: number, y: number, z: number) {
    this.targetPosition.set(x, y, z);
  }

  setTargetRotation(x: number, y: number, z: number) {
    this.targetRotation.set(x, y, z);
  }

  setTargetScale(scale: number) {
    this.targetScale.setScalar(scale);
  }

  update(object: THREE.Object3D, deltaTime: number) {
    // Smooth position interpolation with velocity damping
    this.velocity.subVectors(this.targetPosition, this.position);
    this.velocity.multiplyScalar(this.dampingFactor);

    // Clamp velocity to prevent overshooting
    if (this.velocity.length() > this.maxVelocity) {
      this.velocity.normalize().multiplyScalar(this.maxVelocity);
    }

    this.position.add(this.velocity.clone().multiplyScalar(deltaTime * 60));
    object.position.copy(this.position);

    // Smooth rotation interpolation
    this.rotation.x = THREE.MathUtils.lerp(this.rotation.x, this.targetRotation.x, this.dampingFactor);
    this.rotation.y = THREE.MathUtils.lerp(this.rotation.y, this.targetRotation.y, this.dampingFactor);
    this.rotation.z = THREE.MathUtils.lerp(this.rotation.z, this.targetRotation.z, this.dampingFactor);
    object.rotation.copy(this.rotation);

    // Smooth scale interpolation
    this.scale.lerp(this.targetScale, this.dampingFactor);
    object.scale.copy(this.scale);
  }

  getCurrentPosition() {
    return this.position.clone();
  }

  setCurrentPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
    this.targetPosition.set(x, y, z);
  }
}

export const useSmoothAnimator = (dampingFactor = 0.1, maxVelocity = 10) => {
  const animatorRef = useRef<SmoothAnimator>(
    new SmoothAnimator(dampingFactor, maxVelocity)
  );

  const updateAnimation = useCallback((object: THREE.Object3D, deltaTime: number) => {
    animatorRef.current.update(object, deltaTime);
  }, []);

  return {
    animator: animatorRef.current,
    updateAnimation
  };
};

// High-performance easing functions
export const easing = {
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
};

export default SmoothAnimator;