import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WebNode, LAYER_CONFIGS, COLORS } from '@/lib/webGeometry';

interface LayeredNodesProps {
  nodes: WebNode[];
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
  activeNodes: string[];
  layerOffsets: {
    foreground: number;
    midground: number;
    background: number;
  };
  onNodeClick?: (nodeId: string) => void;
}

interface GlowingNodeProps {
  node: WebNode;
  status: string;
  isActive: boolean;
  layerOffset: number;
  onClick?: () => void;
}

function GlowingNode({ node, status, isActive, layerOffset, onClick }: GlowingNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const layerConfig = LAYER_CONFIGS.find(c => c.layer === node.layer);
  
  const getColor = () => {
    if (isActive) {
      if (status === 'completed') return '#00FF8A';
      if (status === 'failed') return '#FF4D6D';
      if (status === 'processing') return '#00E4FF';
      if (status === 'queued') return '#FFD700';
    }
    
    switch (node.layer) {
      case 'foreground': return node.isMain ? '#00E4FF' : '#1A66FF';
      case 'midground': return node.isMain ? '#1A66FF' : '#0066CC';
      case 'background': return '#0A3366';
      default: return '#1A66FF';
    }
  };

  const offsetPosition = useMemo(() => {
    return new THREE.Vector3(
      node.position.x,
      node.position.y - layerOffset,
      node.position.z
    );
  }, [node.position, layerOffset]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Breathing effect
    const breathe = Math.sin(time * 2 + node.angle * 2) * 0.15 + 1;
    let scale = node.size * breathe;
    
    // Active node effects
    if (isActive) {
      scale *= 1.3 + Math.sin(time * 6) * 0.2;
      
      // Random flicker for processing
      if (status === 'processing' && Math.random() > 0.95) {
        scale *= 1.4;
      }
    }
    
    // Main node emphasis
    if (node.isMain) {
      scale *= 1.2;
    }
    
    meshRef.current.scale.setScalar(scale);
    
    // Glow
    if (glowRef.current) {
      const glowPulse = Math.sin(time * 3 + node.angle) * 0.3 + 0.7;
      const glowScale = scale * (isActive ? 3 : 2) * glowPulse;
      glowRef.current.scale.setScalar(glowScale);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 
        (isActive ? 0.25 : 0.12) * glowPulse * (layerConfig?.opacity || 1);
    }
  });

  return (
    <group position={offsetPosition}>
      {/* Core sphere */}
      <mesh 
        ref={meshRef} 
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = onClick ? 'pointer' : 'default'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={getColor()} />
      </mesh>
      
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial 
          color={getColor()} 
          transparent 
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function LayeredNodes({ 
  nodes, 
  status, 
  activeNodes, 
  layerOffsets,
  onNodeClick 
}: LayeredNodesProps) {
  const activeSet = useMemo(() => new Set(activeNodes), [activeNodes]);

  return (
    <group>
      {nodes.map((node) => (
        <GlowingNode
          key={node.id}
          node={node}
          status={status}
          isActive={activeSet.has(node.id)}
          layerOffset={layerOffsets[node.layer]}
          onClick={onNodeClick ? () => onNodeClick(node.id) : undefined}
        />
      ))}
    </group>
  );
}
