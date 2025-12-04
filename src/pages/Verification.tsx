import { useState } from 'react';
import { OriginXVerificationMesh } from '@/components/originx/VerificationBackground';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

type VerificationStatus = 'idle' | 'processing' | 'completed' | 'failed';

const Verification = () => {
  const [status, setStatus] = useState<VerificationStatus>('idle');

  const simulateVerification = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus(Math.random() > 0.2 ? 'completed' : 'failed');
      setTimeout(() => setStatus('idle'), 3000);
    }, 3000);
  };

  return (
    <div className="relative">
      {/* 3D Background */}
      <OriginXVerificationMesh status={status} />
      
      {/* CTA Buttons - Positioned at bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row gap-4 z-10"
      >
        <Button
          onClick={simulateVerification}
          disabled={status === 'processing'}
          className="bg-gradient-to-r from-[#00E4FF] to-[#1A66FF] hover:from-[#00E4FF]/90 hover:to-[#1A66FF]/90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-[0_0_30px_rgba(0,228,255,0.3)] hover:shadow-[0_0_40px_rgba(0,228,255,0.5)] transition-all duration-300"
        >
          {status === 'processing' ? 'Verifying...' : 'Start Verification'}
        </Button>
        <Button
          variant="outline"
          className="border-[#00E4FF]/50 text-[#00E4FF] hover:bg-[#00E4FF]/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
        >
          Explore API Docs
        </Button>
      </motion.div>
      
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
    </div>
  );
};

export default Verification;
