import { useRef, useCallback } from 'react';
import * as THREE from 'three';

export class ProductionAnimator {
  private currentValue: number = 0;
  private targetValue: number = 0;
  private velocity: number = 0;
  private dampingFactor: number = 0.15;
  private maxVelocity: number = 50;

  constructor(dampingFactor = 0.15, maxVelocity = 50) {
    this.dampingFactor = dampingFactor;
    this.maxVelocity = maxVelocity;
  }

  setTarget(value: number) {
    this.targetValue = value;
  }

  update(deltaTime: number): number {
    const delta = this.targetValue - this.currentValue;
    this.velocity += delta * this.dampingFactor;

    // Apply damping to velocity
    this.velocity *= 0.9;

    // Clamp velocity
    this.velocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity));

    this.currentValue += this.velocity * deltaTime * 60;

    return this.currentValue;
  }

  getValue(): number {
    return this.currentValue;
  }

  setValue(value: number) {
    this.currentValue = value;
    this.targetValue = value;
    this.velocity = 0;
  }
}

export class Vector3Animator {
  private position = new THREE.Vector3();
  private targetPosition = new THREE.Vector3();
  private velocity = new THREE.Vector3();
  private dampingFactor = 0.12;

  constructor(dampingFactor = 0.12) {
    this.dampingFactor = dampingFactor;
  }

  setTarget(x: number, y: number, z: number) {
    this.targetPosition.set(x, y, z);
  }

  update(deltaTime: number): THREE.Vector3 {
    const delta = this.targetPosition.clone().sub(this.position);
    this.velocity.add(delta.multiplyScalar(this.dampingFactor));
    this.velocity.multiplyScalar(0.85); // Damping

    this.position.add(this.velocity.clone().multiplyScalar(deltaTime * 60));

    return this.position.clone();
  }

  getPosition(): THREE.Vector3 {
    return this.position.clone();
  }

  setPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
    this.targetPosition.set(x, y, z);
    this.velocity.set(0, 0, 0);
  }
}

// Professional easing functions for silky smooth animations
export const easings = {
  // Smooth acceleration and deceleration
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  // Gentle spring effect
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  // Smooth bounce
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  // Cinematic ease
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
};

// Professional transition states
export enum TransitionState {
  IDLE = 'idle',
  TRANSITIONING = 'transitioning',
  FOCUSED = 'focused',
  RETURNING = 'returning'
}

export const useProductionAnimator = () => {
  const positionAnimator = useRef(new Vector3Animator(0.12));
  const scaleAnimator = useRef(new ProductionAnimator(0.15, 10));
  const rotationAnimator = useRef(new ProductionAnimator(0.1, 5));

  const updateAnimations = useCallback((deltaTime: number) => {
    return {
      position: positionAnimator.current.update(deltaTime),
      scale: scaleAnimator.current.update(deltaTime),
      rotation: rotationAnimator.current.update(deltaTime)
    };
  }, []);

  return {
    positionAnimator: positionAnimator.current,
    scaleAnimator: scaleAnimator.current,
    rotationAnimator: rotationAnimator.current,
    updateAnimations
  };
};

export default ProductionAnimator;