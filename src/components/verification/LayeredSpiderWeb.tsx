import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { WebNode, WebConnection, LAYER_CONFIGS, COLORS } from '@/lib/webGeometry';

interface LayeredSpiderWebProps {
  nodes: WebNode[];
  connections: WebConnection[];
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
  activeNodes: string[];
  layerOffsets: {
    foreground: number;
    midground: number;
    background: number;
  };
}

interface AnimatedLineProps {
  connection: WebConnection;
  index: number;
  status: string;
  isActive: boolean;
  layerOffset: number;
}

function AnimatedLine({ connection, index, status, isActive, layerOffset }: AnimatedLineProps) {
  const lineRef = useRef<any>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  const layerConfig = LAYER_CONFIGS.find(c => c.layer === connection.layer);
  const baseOpacity = layerConfig?.opacity || 0.6;

  const points = useMemo(() => {
    const offset = new THREE.Vector3(0, -layerOffset, 0);
    return [
      connection.start.clone().add(offset),
      connection.end.clone().add(offset),
    ];
  }, [connection, layerOffset]);

  const getColor = () => {
    if (isActive) {
      if (status === 'completed') return '#00FF8A';
      if (status === 'failed') return '#FF4D6D';
      return '#00E4FF';
    }
    
    switch (connection.layer) {
      case 'foreground': return '#00E4FF';
      case 'midground': return '#1A66FF';
      case 'background': return '#0A3366';
      default: return '#1A66FF';
    }
  };

  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.elapsedTime;
      const pulse = Math.sin(time * 2 + index * 0.05) * 0.3 + 0.7;
      
      let opacity = baseOpacity * pulse;
      
      if (status === 'processing') {
        opacity *= 1.2;
      }
      
      if (isActive) {
        opacity = Math.min(1, opacity * 1.5 + Math.sin(time * 6) * 0.2);
      }
      
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={getColor()}
      lineWidth={connection.layer === 'foreground' ? 2 : connection.layer === 'midground' ? 1.5 : 1}
      transparent
      opacity={baseOpacity}
    >
      <lineBasicMaterial ref={materialRef} transparent />
    </Line>
  );
}

export function LayeredSpiderWeb({ 
  nodes, 
  connections, 
  status, 
  activeNodes,
  layerOffsets 
}: LayeredSpiderWebProps) {
  // Determine which connections are active (connected to active nodes)
  const activeConnectionIds = useMemo(() => {
    const ids = new Set<string>();
    activeNodes.forEach(nodeId => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        node.connections.forEach(connId => ids.add(connId));
      }
    });
    return ids;
  }, [nodes, activeNodes]);

  return (
    <group>
      {connections.map((connection, index) => (
        <AnimatedLine
          key={connection.id}
          connection={connection}
          index={index}
          status={status}
          isActive={activeConnectionIds.has(connection.id)}
          layerOffset={layerOffsets[connection.layer]}
        />
      ))}
    </group>
  );
}
