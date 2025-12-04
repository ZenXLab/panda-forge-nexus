import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  radius?: number;
  status: 'idle' | 'processing' | 'completed' | 'failed';
}

export function Particles({ count = 200, radius = 25, status }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, scales, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * radius;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      scales[i] = 0.5 + Math.random() * 1.5;
      phases[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions, scales, phases };
  }, [count, radius]);

  const getColor = () => {
    switch (status) {
      case 'completed': return '#00FF88';
      case 'failed': return '#FF3366';
      default: return '#00E4FF';
    }
  };

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = phases[i];
      
      // Subtle floating motion
      positionAttribute.array[i3] += Math.sin(time * 0.3 + phase) * 0.002;
      positionAttribute.array[i3 + 1] += Math.cos(time * 0.2 + phase * 1.5) * 0.002;
      positionAttribute.array[i3 + 2] += Math.sin(time * 0.25 + phase * 0.7) * 0.001;
    }
    
    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={count}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={getColor()}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
