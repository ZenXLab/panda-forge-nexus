import { useState, useMemo } from 'react';
import { Verification3DScene } from '@/components/verification/Verification3DScene';
import { VerificationStatus } from '@/components/verification/VerificationStepController';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const VerificationHero = () => {
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [showControls, setShowControls] = useState(false);
  const [nodeCount, setNodeCount] = useState(100);
  const [pulseSpeed, setPulseSpeed] = useState(1);

  // Generate active nodes based on slider
  const activeNodes = useMemo(() => {
    const nodes: string[] = [];
    // Generate some node IDs that match the pattern from webGeometry
    for (let i = 0; i < Math.min(nodeCount / 10, 15); i++) {
      nodes.push(`midground-${Math.floor(Math.random() * 5) + 1}-${i}`);
    }
    return nodes;
  }, [nodeCount]);

  const simulateVerification = () => {
    setStatus('queued');
    
    setTimeout(() => {
      setStatus('processing');
      
      setTimeout(() => {
        setStatus(Math.random() > 0.2 ? 'completed' : 'failed');
        
        setTimeout(() => setStatus('idle'), 4000);
      }, 4000);
    }, 1500);
  };

  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
  };

  return (
    <div className="relative min-h-screen">
      {/* 3D Background */}
      <Verification3DScene 
        status={status}
        activeNodes={activeNodes}
        onNodeClick={handleNodeClick}
        enableBloom={true}
        enableParallax={true}
      />

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row gap-4 z-10"
      >
        <Button
          onClick={simulateVerification}
          disabled={status !== 'idle'}
          className="bg-gradient-to-r from-[#00E4FF] to-[#1A66FF] hover:from-[#00E4FF]/90 hover:to-[#1A66FF]/90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-[0_0_30px_rgba(0,228,255,0.3)] hover:shadow-[0_0_40px_rgba(0,228,255,0.5)] transition-all duration-300 disabled:opacity-50"
        >
          {status === 'idle' ? 'Start Verification' : 
           status === 'queued' ? 'Queuing...' :
           status === 'processing' ? 'Verifying...' :
           status === 'completed' ? 'Complete!' : 'Failed'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowControls(!showControls)}
          className="border-[#00E4FF]/50 text-[#00E4FF] hover:bg-[#00E4FF]/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </Button>
      </motion.div>

      {/* Debug Controls Panel */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-24 left-4 z-20 bg-black/80 backdrop-blur-md p-6 rounded-xl border border-[#00E4FF]/30 w-72"
        >
          <h3 className="text-white font-semibold mb-4">Debug Controls</h3>
          
          {/* Status Buttons */}
          <div className="mb-4">
            <label className="text-white/70 text-sm mb-2 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {(['idle', 'queued', 'processing', 'completed', 'failed'] as VerificationStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    status === s
                      ? 'bg-[#00E4FF] text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Node Count Slider */}
          <div className="mb-4">
            <label className="text-white/70 text-sm mb-2 block">
              Node Density: {nodeCount}%
            </label>
            <input
              type="range"
              min="30"
              max="150"
              value={nodeCount}
              onChange={(e) => setNodeCount(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00E4FF]"
            />
          </div>

          {/* Pulse Speed Slider */}
          <div className="mb-4">
            <label className="text-white/70 text-sm mb-2 block">
              Pulse Speed: {pulseSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={pulseSpeed}
              onChange={(e) => setPulseSpeed(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00E4FF]"
            />
          </div>

          {/* Info */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-white/50 text-xs">
              Click nodes to interact. Scroll page to see parallax effect.
            </p>
          </div>
        </motion.div>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-[#00E4FF]/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 bg-[#00E4FF]/50 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Scrollable content for parallax demo */}
      <div className="h-screen" />
      <div className="relative z-10 bg-gradient-to-t from-[#030712] to-transparent min-h-screen flex items-center justify-center">
        <div className="text-center text-white/70 max-w-2xl px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Scroll Parallax Demo</h2>
          <p className="mb-8">
            As you scroll, notice how the foreground layer moves faster than the background, 
            creating a depth effect. The holographic scanners and particles respond to scroll position.
          </p>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#1A66FF] hover:bg-[#1A66FF]/80"
          >
            Back to Top
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationHero;
