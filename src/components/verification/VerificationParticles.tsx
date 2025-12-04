import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VerificationParticlesProps {
  count?: number;
  radius?: number;
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
  activeNodes: string[];
  isMobile: boolean;
}

export function VerificationParticles({ 
  count = 150, 
  radius = 30, 
  status,
  activeNodes,
  isMobile 
}: VerificationParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Reduce count on mobile
  const effectiveCount = isMobile ? Math.floor(count * 0.4) : count;

  const { positions, velocities, phases } = useMemo(() => {
    const positions = new Float32Array(effectiveCount * 3);
    const velocities = new Float32Array(effectiveCount * 3);
    const phases = new Float32Array(effectiveCount);

    for (let i = 0; i < effectiveCount; i++) {
      // Distribute in layers
      const layer = i % 3;
      const layerZ = layer === 0 ? 5 : layer === 1 ? 0 : -8;
      const layerRadius = radius * (0.6 + layer * 0.2);

      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * layerRadius;

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r;
      positions[i * 3 + 2] = layerZ + (Math.random() - 0.5) * 4;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;

      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, velocities, phases };
  }, [effectiveCount, radius]);

  const getColor = () => {
    switch (status) {
      case 'completed': return '#00FF8A';
      case 'failed': return '#FF4D6D';
      case 'processing': return '#00E4FF';
      default: return '#1A66FF';
    }
  };

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    const speedMultiplier = status === 'processing' ? 2 : 1;

    for (let i = 0; i < effectiveCount; i++) {
      const i3 = i * 3;
      const phase = phases[i];

      // Floating motion
      positionAttribute.array[i3] += Math.sin(time * 0.3 * speedMultiplier + phase) * 0.003;
      positionAttribute.array[i3 + 1] += Math.cos(time * 0.25 * speedMultiplier + phase * 1.3) * 0.003;
      positionAttribute.array[i3 + 2] += Math.sin(time * 0.2 * speedMultiplier + phase * 0.7) * 0.002;

      // Boundary check - wrap around
      const dist = Math.sqrt(
        positionAttribute.array[i3] ** 2 + 
        positionAttribute.array[i3 + 1] ** 2
      );
      if (dist > radius) {
        const scale = (radius * 0.3) / dist;
        positionAttribute.array[i3] *= scale;
        positionAttribute.array[i3 + 1] *= scale;
      }
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={effectiveCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.06 : 0.08}
        color={getColor()}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
