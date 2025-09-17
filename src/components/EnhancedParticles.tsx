import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnhancedParticlesProps {
  count: number;
  scale: number;
  speed: number;
}

const EnhancedParticles = ({ count, scale, speed }: EnhancedParticlesProps) => {
  const meshRef = useRef<THREE.Points>(null);

  // Create optimized particle geometry
  const { positions, velocities, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random spherical distribution
      const radius = Math.random() * scale;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random velocities for floating effect
      velocities[i * 3] = (Math.random() - 0.5) * speed;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;

      sizes[i] = Math.random() * 4 + 1;

      // Sparkle colors
      const sparkleType = Math.random();
      if (sparkleType < 0.4) {
        // Blue sparkles
        colors[i * 3] = 0.4;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      } else if (sparkleType < 0.7) {
        // White sparkles
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else {
        // Golden sparkles
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0.2;
      }
    }

    return { positions, velocities, sizes, colors };
  }, [count, scale, speed]);

  // High-performance shader material
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 velocity;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;

          // Floating animation
          vec3 pos = position + velocity * time * 0.5;

          // Wrap particles around the scene
          pos = mod(pos + 50.0, 100.0) - 50.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

          // Dynamic size based on distance and time
          float distanceFactor = 1.0 / (1.0 + 0.01 * length(mvPosition.xyz));
          float pulseFactor = sin(time * 3.0 + position.x * 0.1) * 0.3 + 0.7;

          gl_PointSize = size * pixelRatio * distanceFactor * pulseFactor * 150.0 / -mvPosition.z;

          // Alpha based on distance for depth effect
          vAlpha = distanceFactor * 0.8;

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          if (distanceToCenter > 0.5) discard;

          // Create sparkle effect
          float sparkle = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          sparkle = pow(sparkle, 2.0);

          gl_FragColor = vec4(vColor, vAlpha * sparkle);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current && particleMaterial.uniforms) {
      particleMaterial.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={meshRef} material={particleMaterial} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-velocity"
          args={[velocities, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
    </points>
  );
};

export default EnhancedParticles;