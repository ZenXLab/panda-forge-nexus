import * as THREE from 'three';

export interface WebNode {
  id: string;
  position: THREE.Vector3;
  layer: 'foreground' | 'midground' | 'background';
  ring: number;
  angle: number;
  size: number;
  isMain: boolean;
  connections: string[];
}

export interface WebConnection {
  id: string;
  startNodeId: string;
  endNodeId: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  layer: 'foreground' | 'midground' | 'background';
}

export interface LayerConfig {
  layer: 'foreground' | 'midground' | 'background';
  ringCount: number;
  nodesPerRing: number;
  radiusStep: number;
  zOffset: number;
  zVariance: number;
  nodeSize: number;
  opacity: number;
}

export const LAYER_CONFIGS: LayerConfig[] = [
  {
    layer: 'foreground',
    ringCount: 3,
    nodesPerRing: 8,
    radiusStep: 4,
    zOffset: 5,
    zVariance: 1,
    nodeSize: 0.2,
    opacity: 1,
  },
  {
    layer: 'midground',
    ringCount: 5,
    nodesPerRing: 12,
    radiusStep: 3,
    zOffset: 0,
    zVariance: 2,
    nodeSize: 0.12,
    opacity: 0.8,
  },
  {
    layer: 'background',
    ringCount: 6,
    nodesPerRing: 16,
    radiusStep: 3.5,
    zOffset: -8,
    zVariance: 3,
    nodeSize: 0.06,
    opacity: 0.4,
  },
];

// Generate nodes for a specific layer
export function generateLayerNodes(config: LayerConfig): WebNode[] {
  const nodes: WebNode[] = [];
  let nodeIndex = 0;

  // Center node
  nodes.push({
    id: `${config.layer}-center`,
    position: new THREE.Vector3(0, 0, config.zOffset),
    layer: config.layer,
    ring: 0,
    angle: 0,
    size: config.nodeSize * 1.5,
    isMain: true,
    connections: [],
  });

  // Generate rings
  for (let ring = 1; ring <= config.ringCount; ring++) {
    const radius = ring * config.radiusStep;
    const nodeCount = config.nodesPerRing + (ring - 1) * 3;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const angleVariance = (Math.random() - 0.5) * 0.15;
      const radiusVariance = (Math.random() - 0.5) * 0.8;

      const x = Math.cos(angle + angleVariance) * (radius + radiusVariance);
      const y = Math.sin(angle + angleVariance) * (radius + radiusVariance);
      const z = config.zOffset + (Math.random() - 0.5) * config.zVariance;

      nodes.push({
        id: `${config.layer}-${ring}-${nodeIndex++}`,
        position: new THREE.Vector3(x, y, z),
        layer: config.layer,
        ring,
        angle: angle + angleVariance,
        size: config.nodeSize * (0.8 + Math.random() * 0.4),
        isMain: Math.random() > 0.88,
        connections: [],
      });
    }
  }

  return nodes;
}

// Generate connections between nodes in a layer
export function generateLayerConnections(nodes: WebNode[]): WebConnection[] {
  const connections: WebConnection[] = [];
  const centerNode = nodes.find(n => n.ring === 0);

  // Connect center to first ring
  const firstRingNodes = nodes.filter(n => n.ring === 1);
  if (centerNode) {
    firstRingNodes.forEach((node, i) => {
      const connId = `conn-${centerNode.id}-${node.id}`;
      connections.push({
        id: connId,
        startNodeId: centerNode.id,
        endNodeId: node.id,
        start: centerNode.position.clone(),
        end: node.position.clone(),
        layer: node.layer,
      });
      centerNode.connections.push(connId);
      node.connections.push(connId);
    });
  }

  // Group by ring
  const ringGroups = new Map<number, WebNode[]>();
  nodes.forEach(node => {
    if (!ringGroups.has(node.ring)) ringGroups.set(node.ring, []);
    ringGroups.get(node.ring)!.push(node);
  });

  // Ring connections (circular)
  ringGroups.forEach((ringNodes, ring) => {
    if (ring === 0) return;
    ringNodes.sort((a, b) => a.angle - b.angle);

    for (let i = 0; i < ringNodes.length; i++) {
      const nextIndex = (i + 1) % ringNodes.length;
      const connId = `conn-ring-${ring}-${i}`;
      connections.push({
        id: connId,
        startNodeId: ringNodes[i].id,
        endNodeId: ringNodes[nextIndex].id,
        start: ringNodes[i].position.clone(),
        end: ringNodes[nextIndex].position.clone(),
        layer: ringNodes[i].layer,
      });
      ringNodes[i].connections.push(connId);
      ringNodes[nextIndex].connections.push(connId);
    }
  });

  // Radial connections (between rings)
  const maxRing = Math.max(...Array.from(ringGroups.keys()));
  for (let ring = 1; ring < maxRing; ring++) {
    const currentRing = ringGroups.get(ring) || [];
    const nextRing = ringGroups.get(ring + 1) || [];

    currentRing.forEach((node, i) => {
      // Connect to 1-2 closest nodes in next ring
      const closest = nextRing
        .map(n => ({ node: n, dist: node.position.distanceTo(n.position) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, Math.random() > 0.5 ? 2 : 1);

      closest.forEach(({ node: targetNode }) => {
        const connId = `conn-radial-${node.id}-${targetNode.id}`;
        connections.push({
          id: connId,
          startNodeId: node.id,
          endNodeId: targetNode.id,
          start: node.position.clone(),
          end: targetNode.position.clone(),
          layer: node.layer,
        });
        node.connections.push(connId);
        targetNode.connections.push(connId);
      });
    });
  }

  return connections;
}

// Generate all layers
export function generateAllLayers(scaleFactor: number = 1): {
  nodes: WebNode[];
  connections: WebConnection[];
} {
  const allNodes: WebNode[] = [];
  const allConnections: WebConnection[] = [];

  LAYER_CONFIGS.forEach(config => {
    const scaledConfig = {
      ...config,
      ringCount: Math.max(2, Math.floor(config.ringCount * scaleFactor)),
      nodesPerRing: Math.max(4, Math.floor(config.nodesPerRing * scaleFactor)),
    };

    const nodes = generateLayerNodes(scaledConfig);
    const connections = generateLayerConnections(nodes);

    allNodes.push(...nodes);
    allConnections.push(...connections);
  });

  return { nodes: allNodes, connections: allConnections };
}

// Colors
export const COLORS = {
  neonCyan: new THREE.Color('#00E4FF'),
  hyperBlue: new THREE.Color('#1A66FF'),
  successGreen: new THREE.Color('#00FF8A'),
  warningRed: new THREE.Color('#FF4D6D'),
  white: new THREE.Color('#FFFFFF'),
};
