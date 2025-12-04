import { Suspense, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { generateAllLayers } from '@/lib/webGeometry';
import { LayeredSpiderWeb } from './LayeredSpiderWeb';
import { LayeredNodes } from './LayeredNodes';
import { MultiLayerScanners } from './HolographicScanner';
import { VerificationParticles } from './VerificationParticles';
import { CameraController } from './CameraController';
import { VerificationOverlay } from './VerificationOverlay';
import { useVerificationStepController, VerificationStatus } from './VerificationStepController';
import { useScrollProgress } from '@/hooks/useParallaxOnScroll';

interface Verification3DSceneProps {
  status?: VerificationStatus;
  activeNodes?: string[];
  onNodeClick?: (nodeId: string) => void;
  themeColors?: {
    primary?: string;
    secondary?: string;
  };
  showOverlay?: boolean;
  enableParallax?: boolean;
  enableBloom?: boolean;
}

function Scene({
  status,
  activeNodes,
  onNodeClick,
  isMobile,
  scrollProgress,
  enableBloom,
}: {
  status: VerificationStatus;
  activeNodes: string[];
  onNodeClick?: (nodeId: string) => void;
  isMobile: boolean;
  scrollProgress: number;
  enableBloom: boolean;
}) {
  // Generate web geometry - scale down on mobile
  const { nodes, connections } = useMemo(() => {
    const scaleFactor = isMobile ? 0.5 : 1;
    return generateAllLayers(scaleFactor);
  }, [isMobile]);

  // Get node IDs for active highlighting
  const effectiveActiveNodes = useMemo(() => {
    if (activeNodes.length > 0) return activeNodes;
    
    // Default: highlight some random nodes based on status
    if (status === 'processing' || status === 'queued') {
      return nodes
        .filter(n => n.isMain || Math.random() > 0.85)
        .slice(0, 15)
        .map(n => n.id);
    }
    if (status === 'completed' || status === 'failed') {
      return nodes.filter(n => n.isMain).map(n => n.id);
    }
    return [];
  }, [activeNodes, nodes, status]);

  // Verification controller
  const { highlightedNodes, scannerActive } = useVerificationStepController({
    status,
    activeNodes: effectiveActiveNodes,
  });

  // Calculate layer offsets based on scroll
  const layerOffsets = useMemo(() => ({
    foreground: scrollProgress * 5 * 1.0,
    midground: scrollProgress * 5 * 0.6,
    background: scrollProgress * 5 * 0.3,
  }), [scrollProgress]);

  return (
    <>
      {/* Camera with parallax */}
      <CameraController 
        status={status} 
        scrollProgress={scrollProgress}
        isMobile={isMobile}
      />

      {/* Ambient light */}
      <ambientLight intensity={0.15} />

      {/* Main rotating group */}
      <group>
        {/* Spider Web Lines */}
        <LayeredSpiderWeb
          nodes={nodes}
          connections={connections}
          status={status}
          activeNodes={highlightedNodes}
          layerOffsets={layerOffsets}
        />

        {/* Nodes */}
        <LayeredNodes
          nodes={nodes}
          status={status}
          activeNodes={highlightedNodes}
          layerOffsets={layerOffsets}
          onNodeClick={onNodeClick}
        />

        {/* Holographic Scanners */}
        <MultiLayerScanners 
          active={scannerActive} 
          status={status}
        />

        {/* Particles */}
        <VerificationParticles
          count={isMobile ? 80 : 200}
          radius={25}
          status={status}
          activeNodes={highlightedNodes}
          isMobile={isMobile}
        />
      </group>

      {/* Post Processing - disabled on mobile for performance */}
      {enableBloom && !isMobile && (
        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette darkness={0.4} offset={0.3} />
        </EffectComposer>
      )}
    </>
  );
}

export function Verification3DScene({
  status = 'idle',
  activeNodes = [],
  onNodeClick,
  showOverlay = true,
  enableParallax = true,
  enableBloom = true,
}: Verification3DSceneProps) {
  const [isMobile, setIsMobile] = useState(false);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dynamic pixel ratio for performance
  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1;
    return Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5);
  }, [isMobile]);

  const nodeCount = useMemo(() => {
    const { nodes } = generateAllLayers(isMobile ? 0.5 : 1);
    return nodes.length;
  }, [isMobile]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#030712' }}
    >
      {/* Loading fallback */}
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-[#030712]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#00E4FF] border-t-transparent rounded-full animate-spin" />
              <span className="text-[#00E4FF]/70 text-sm">Initializing Verification Engine...</span>
            </div>
          </div>
        }
      >
        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 24], fov: 60 }}
          dpr={dpr}
          gl={{ 
            antialias: !isMobile, 
            alpha: true,
            powerPreference: 'high-performance',
          }}
          aria-hidden="true"
        >
          <Scene
            status={status}
            activeNodes={activeNodes}
            onNodeClick={onNodeClick}
            isMobile={isMobile}
            scrollProgress={enableParallax ? scrollProgress : 0}
            enableBloom={enableBloom}
          />
        </Canvas>
      </Suspense>

      {/* UI Overlay */}
      {showOverlay && (
        <VerificationOverlay 
          status={status}
          nodeCount={nodeCount}
        />
      )}
    </div>
  );
}

export default Verification3DScene;
