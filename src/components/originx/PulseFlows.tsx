import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateWebConnections } from './spiderWebUtils';
import type { WebNode } from './spiderWebUtils';

interface PulseFlowsProps {
  nodes: WebNode[];
  status: 'idle' | 'processing' | 'completed' | 'failed';
}

interface Pulse {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  progress: number;
  speed: number;
  direction: number;
}

export function PulseFlows({ nodes, status }: PulseFlowsProps) {
  const pulsesRef = useRef<THREE.InstancedMesh>(null);
  
  const connections = useMemo(() => generateWebConnections(nodes), [nodes]);
  
  const pulses = useMemo<Pulse[]>(() => {
    // Create pulses along random connections
    const selectedConnections = connections
      .filter(() => Math.random() > 0.7)
      .slice(0, 30);
    
    return selectedConnections.map((conn, i) => ({
      startPos: conn.start.clone(),
      endPos: conn.end.clone(),
      progress: Math.random(),
      speed: 0.3 + Math.random() * 0.4,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));
  }, [connections]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const getColor = () => {
    switch (status) {
      case 'completed': return '#00FF88';
      case 'failed': return '#FF3366';
      case 'processing': return '#00E4FF';
      default: return '#1A66FF';
    }
  };

  useFrame((state, delta) => {
    if (!pulsesRef.current) return;
    
    const speedMultiplier = status === 'processing' ? 2 : 1;
    
    pulses.forEach((pulse, i) => {
      // Update progress
      pulse.progress += delta * pulse.speed * pulse.direction * speedMultiplier;
      
      // Wrap around
      if (pulse.progress > 1) pulse.progress = 0;
      if (pulse.progress < 0) pulse.progress = 1;
      
      // Calculate position along line
      const pos = new THREE.Vector3().lerpVectors(
        pulse.startPos,
        pulse.endPos,
        pulse.progress
      );
      
      dummy.position.copy(pos);
      dummy.scale.setScalar(0.08);
      dummy.updateMatrix();
      
      pulsesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    pulsesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={pulsesRef} args={[undefined, undefined, pulses.length]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={getColor()} transparent opacity={0.9} />
    </instancedMesh>
  );
}
