import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
  scrollProgress: number;
  isMobile: boolean;
}

export function CameraController({ status, scrollProgress, isMobile }: CameraControllerProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  const baseZ = 24;
  const targetPosition = useRef(new THREE.Vector3(0, 0, baseZ));
  const currentRotation = useRef(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Determine animation speed based on status
    const rotationSpeed = status === 'processing' ? 0.04 : 0.015;
    const bobSpeed = status === 'processing' ? 1.5 : 0.8;
    
    // Slow rotation
    currentRotation.current += rotationSpeed * 0.016; // ~60fps normalized
    
    // Camera position with scroll parallax
    const scrollOffset = isMobile ? scrollProgress * 1 : scrollProgress * 3;
    
    targetPosition.current.set(
      Math.sin(time * 0.05) * (isMobile ? 0.5 : 1.5),
      -scrollOffset + Math.cos(time * 0.03) * (isMobile ? 0.3 : 0.8),
      baseZ - scrollOffset * 0.5 + Math.sin(time * 0.1) * 1
    );
    
    // Smooth interpolation
    camera.position.lerp(targetPosition.current, 0.02);
    
    // Look at center with slight offset
    const lookTarget = new THREE.Vector3(0, -scrollOffset * 0.3, 0);
    camera.lookAt(lookTarget);
    
    // Update group rotation for the whole scene
    if (groupRef.current) {
      groupRef.current.rotation.z = currentRotation.current;
    }
  });

  return <group ref={groupRef} />;
}
