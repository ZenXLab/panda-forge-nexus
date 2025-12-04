import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HolographicScannerProps {
  center?: THREE.Vector3;
  maxRadius?: number;
  sweepSpeed?: number;
  intensity?: number;
  color?: string;
  active: boolean;
  layer: 'foreground' | 'midground' | 'background';
  zOffset: number;
}

export function HolographicScanner({
  center = new THREE.Vector3(0, 0, 0),
  maxRadius = 18,
  sweepSpeed = 0.8,
  intensity = 1.5,
  color = '#00E4FF',
  active,
  layer,
  zOffset,
}: HolographicScannerProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const rippleRef = useRef<THREE.Mesh>(null);
  const currentRadius = useRef(0);
  const sweepAngle = useRef(0);

  // Ring geometry with custom shader-like effect
  const ringGeometry = useMemo(() => {
    return new THREE.RingGeometry(0.5, 1, 64);
  }, []);

  useFrame((state, delta) => {
    if (!active) {
      currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, 0, 0.05);
    } else {
      // Expand radius
      currentRadius.current = THREE.MathUtils.lerp(currentRadius.current, maxRadius, 0.02);
      
      // Rotate sweep
      sweepAngle.current += delta * sweepSpeed;
    }

    if (ringRef.current) {
      const scale = Math.max(0.1, currentRadius.current);
      ringRef.current.scale.set(scale, scale, 1);
      ringRef.current.rotation.z = sweepAngle.current;
      
      // Pulsing opacity
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.2 + 0.6;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = active ? pulse * intensity * 0.3 : 0;
    }

    // Ripple effect
    if (rippleRef.current && active) {
      const ripplePhase = (state.clock.elapsedTime * 2) % 1;
      const rippleScale = ripplePhase * maxRadius;
      rippleRef.current.scale.set(rippleScale, rippleScale, 1);
      (rippleRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - ripplePhase) * 0.15;
    }
  });

  const layerOpacity = layer === 'foreground' ? 1 : layer === 'midground' ? 0.7 : 0.4;

  return (
    <group position={[center.x, center.y, zOffset]}>
      {/* Main scanning ring */}
      <mesh ref={ringRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.95, 1, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh scale={[currentRadius.current * 0.5, currentRadius.current * 0.5, 1]}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.1 * layerOpacity : 0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ripple effect */}
      <mesh ref={rippleRef}>
        <ringGeometry args={[0.98, 1, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Center glow */}
      {active && (
        <mesh>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15 * layerOpacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// Multiple scanners for each layer
interface MultiLayerScannersProps {
  active: boolean;
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
}

export function MultiLayerScanners({ active, status }: MultiLayerScannersProps) {
  const getColor = () => {
    switch (status) {
      case 'completed': return '#00FF8A';
      case 'failed': return '#FF4D6D';
      default: return '#00E4FF';
    }
  };

  const isScanning = active && (status === 'processing' || status === 'queued');

  return (
    <group>
      <HolographicScanner
        active={isScanning}
        layer="foreground"
        zOffset={5}
        maxRadius={12}
        sweepSpeed={1.2}
        color={getColor()}
        intensity={1.8}
      />
      <HolographicScanner
        active={isScanning}
        layer="midground"
        zOffset={0}
        maxRadius={16}
        sweepSpeed={0.8}
        color={getColor()}
        intensity={1.2}
      />
      <HolographicScanner
        active={isScanning}
        layer="background"
        zOffset={-8}
        maxRadius={22}
        sweepSpeed={0.5}
        color={getColor()}
        intensity={0.6}
      />
    </group>
  );
}
