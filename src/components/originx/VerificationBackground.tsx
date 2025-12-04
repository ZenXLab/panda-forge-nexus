import { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { generateWebNodes } from './spiderWebUtils';
import { NeonSpiderWeb } from './NeonSpiderWeb';
import { NeonNodes } from './NeonNodes';
import { PulseFlows } from './PulseFlows';
import { Particles } from './Particles';
import { SpinningCameraRig } from './SpinningCameraRig';
import { VerificationOverlay } from './VerificationOverlay';

interface OriginXVerificationMeshProps {
  status?: 'idle' | 'processing' | 'completed' | 'failed';
}

function Scene({ status }: { status: 'idle' | 'processing' | 'completed' | 'failed' }) {
  const nodes = useMemo(() => generateWebNodes(6, 12, 3, 2), []);
  
  return (
    <>
      {/* Camera Animation */}
      <SpinningCameraRig status={status} />
      
      {/* Ambient light */}
      <ambientLight intensity={0.1} />
      
      {/* Spider Web Structure */}
      <NeonSpiderWeb nodes={nodes} status={status} />
      
      {/* Glowing Nodes */}
      <NeonNodes nodes={nodes} status={status} />
      
      {/* Pulse Flows */}
      <PulseFlows nodes={nodes} status={status} />
      
      {/* Floating Particles */}
      <Particles count={150} radius={25} status={status} />
      
      {/* Post Processing */}
      <EffectComposer>
        <Bloom 
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export function OriginXVerificationMesh({ status = 'idle' }: OriginXVerificationMeshProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#030712] overflow-hidden">
      {/* 3D Canvas */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#00E4FF] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Canvas
          camera={{ position: [0, 0, 22], fov: 60 }}
          dpr={isMobile ? 1 : [1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene status={status} />
        </Canvas>
      </Suspense>
      
      {/* UI Overlay */}
      <VerificationOverlay status={status} />
    </div>
  );
}

export default OriginXVerificationMesh;
