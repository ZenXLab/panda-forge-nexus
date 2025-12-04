import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { generateWebConnections, WebConnection, NEON_CYAN, HYPER_BLUE, SUCCESS_GREEN, ERROR_RED } from './spiderWebUtils';
import type { WebNode } from './spiderWebUtils';

interface NeonSpiderWebProps {
  nodes: WebNode[];
  status: 'idle' | 'processing' | 'completed' | 'failed';
}

function AnimatedLine({ 
  connection, 
  index, 
  status 
}: { 
  connection: WebConnection; 
  index: number;
  status: string;
}) {
  const lineRef = useRef<any>(null);
  
  const points = useMemo(() => [
    connection.start,
    connection.end,
  ], [connection]);

  const getColor = () => {
    switch (status) {
      case 'completed': return '#00FF88';
      case 'failed': return '#FF3366';
      case 'processing': return index % 2 === 0 ? '#00E4FF' : '#1A66FF';
      default: return index % 3 === 0 ? '#00E4FF' : '#1A66FF';
    }
  };

  useFrame((state) => {
    if (lineRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + index * 0.1) * 0.5 + 0.5;
      const baseOpacity = status === 'processing' ? 0.8 : 0.5;
      lineRef.current.material.opacity = baseOpacity + pulse * 0.3;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={getColor()}
      lineWidth={connection.ringConnection ? 1 : 1.5}
      transparent
      opacity={0.6}
    />
  );
}

export function NeonSpiderWeb({ nodes, status }: NeonSpiderWebProps) {
  const connections = useMemo(() => generateWebConnections(nodes), [nodes]);

  return (
    <group>
      {connections.map((connection, index) => (
        <AnimatedLine 
          key={index} 
          connection={connection} 
          index={index}
          status={status}
        />
      ))}
    </group>
  );
}
