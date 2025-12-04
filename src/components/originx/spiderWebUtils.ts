import * as THREE from 'three';

export interface WebNode {
  id: number;
  position: THREE.Vector3;
  ring: number;
  angle: number;
  size: number;
  isMain: boolean;
}

export interface WebConnection {
  start: THREE.Vector3;
  end: THREE.Vector3;
  ringConnection: boolean;
}

// Generate nodes in a radial spider-web pattern
export function generateWebNodes(
  ringCount: number = 6,
  nodesPerRing: number = 12,
  radiusStep: number = 3,
  zVariance: number = 2
): WebNode[] {
  const nodes: WebNode[] = [];
  let id = 0;

  // Center node
  nodes.push({
    id: id++,
    position: new THREE.Vector3(0, 0, 0),
    ring: 0,
    angle: 0,
    size: 0.3,
    isMain: true,
  });

  // Generate rings
  for (let ring = 1; ring <= ringCount; ring++) {
    const radius = ring * radiusStep;
    const nodeCount = nodesPerRing + (ring - 1) * 4;
    
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const angleVariance = (Math.random() - 0.5) * 0.2;
      const radiusVariance = (Math.random() - 0.5) * 1;
      
      const x = Math.cos(angle + angleVariance) * (radius + radiusVariance);
      const y = Math.sin(angle + angleVariance) * (radius + radiusVariance);
      const z = (Math.random() - 0.5) * zVariance * (ring / ringCount);

      nodes.push({
        id: id++,
        position: new THREE.Vector3(x, y, z),
        ring,
        angle: angle + angleVariance,
        size: Math.random() > 0.9 ? 0.25 : 0.1 + Math.random() * 0.08,
        isMain: Math.random() > 0.85,
      });
    }
  }

  return nodes;
}

// Generate connections between nodes
export function generateWebConnections(nodes: WebNode[]): WebConnection[] {
  const connections: WebConnection[] = [];
  
  // Connect center to first ring
  const firstRingNodes = nodes.filter(n => n.ring === 1);
  const centerNode = nodes.find(n => n.ring === 0);
  
  if (centerNode) {
    firstRingNodes.forEach(node => {
      connections.push({
        start: centerNode.position.clone(),
        end: node.position.clone(),
        ringConnection: false,
      });
    });
  }

  // Connect nodes within same ring (circular connections)
  const ringGroups = new Map<number, WebNode[]>();
  nodes.forEach(node => {
    if (!ringGroups.has(node.ring)) {
      ringGroups.set(node.ring, []);
    }
    ringGroups.get(node.ring)!.push(node);
  });

  ringGroups.forEach((ringNodes, ring) => {
    if (ring === 0) return;
    
    // Sort by angle
    ringNodes.sort((a, b) => a.angle - b.angle);
    
    for (let i = 0; i < ringNodes.length; i++) {
      const nextIndex = (i + 1) % ringNodes.length;
      connections.push({
        start: ringNodes[i].position.clone(),
        end: ringNodes[nextIndex].position.clone(),
        ringConnection: true,
      });
    }
  });

  // Connect between rings (radial connections)
  for (let ring = 1; ring < 6; ring++) {
    const currentRing = nodes.filter(n => n.ring === ring);
    const nextRing = nodes.filter(n => n.ring === ring + 1);
    
    currentRing.forEach(node => {
      // Find closest nodes in next ring
      const closest = nextRing
        .map(n => ({ node: n, dist: node.position.distanceTo(n.position) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 2);
      
      closest.forEach(({ node: targetNode }) => {
        connections.push({
          start: node.position.clone(),
          end: targetNode.position.clone(),
          ringConnection: false,
        });
      });
    });
  }

  return connections;
}

// Generate random positions for floating particles
export function generateParticlePositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.random() * radius;
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  
  return positions;
}

// Colors for the verification system
export const NEON_CYAN = new THREE.Color('#00E4FF');
export const HYPER_BLUE = new THREE.Color('#1A66FF');
export const SUCCESS_GREEN = new THREE.Color('#00FF88');
export const ERROR_RED = new THREE.Color('#FF3366');
