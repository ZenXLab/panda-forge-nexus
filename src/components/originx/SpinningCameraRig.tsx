import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpinningCameraRigProps {
  status: 'idle' | 'processing' | 'completed' | 'failed';
}

export function SpinningCameraRig({ status }: SpinningCameraRigProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    const speedMultiplier = status === 'processing' ? 1.5 : 1;
    
    // Slow rotation
    groupRef.current.rotation.z = time * 0.02 * speedMultiplier;
    
    // Gentle camera movement (dolly effect)
    const camera = state.camera;
    const targetZ = 22 + Math.sin(time * 0.1) * 2;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.01);
    
    // Slight tilt
    camera.position.x = Math.sin(time * 0.05) * 1;
    camera.position.y = Math.cos(time * 0.03) * 0.5;
    
    camera.lookAt(0, 0, 0);
  });

  return <group ref={groupRef} />;
}
