import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { WebNode } from './spiderWebUtils';

interface NeonNodesProps {
  nodes: WebNode[];
  status: 'idle' | 'processing' | 'completed' | 'failed';
}

function GlowingNode({ 
  node, 
  status 
}: { 
  node: WebNode; 
  status: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const baseColor = useMemo(() => {
    if (status === 'completed') return '#00FF88';
    if (status === 'failed') return '#FF3366';
    return node.isMain ? '#00E4FF' : '#1A66FF';
  }, [node.isMain, status]);

  useFrame((state) => {
    if (meshRef.current) {
      // Breathing effect
      const breathe = Math.sin(state.clock.elapsedTime * 2 + node.id * 0.5) * 0.15 + 1;
      const scale = node.size * breathe;
      meshRef.current.scale.setScalar(scale);
      
      // Flicker for main nodes
      if (node.isMain && Math.random() > 0.98) {
        meshRef.current.scale.setScalar(scale * 1.3);
      }
    }
    
    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3 + node.id) * 0.3 + 0.7;
      glowRef.current.scale.setScalar(node.size * 2.5 * pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 * pulse;
    }
  });

  return (
    <group position={node.position}>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={baseColor} />
      </mesh>
      
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color={baseColor} 
          transparent 
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

export function NeonNodes({ nodes, status }: NeonNodesProps) {
  return (
    <group>
      {nodes.map((node) => (
        <GlowingNode key={node.id} node={node} status={status} />
      ))}
    </group>
  );
}
