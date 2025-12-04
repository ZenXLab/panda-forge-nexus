import { motion, AnimatePresence } from 'framer-motion';

interface VerificationOverlayProps {
  status: 'idle' | 'processing' | 'completed' | 'failed';
}

export function VerificationOverlay({ status }: VerificationOverlayProps) {
  const getStatusText = () => {
    switch (status) {
      case 'processing': return 'Verifying...';
      case 'completed': return 'Verified ✓';
      case 'failed': return 'Verification Failed';
      default: return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing': return 'text-[#00E4FF]';
      case 'completed': return 'text-[#00FF88]';
      case 'failed': return 'text-[#FF3366]';
      default: return 'text-[#00E4FF]';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E4FF]/10 border border-[#00E4FF]/30 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E4FF] animate-pulse" />
            <span className="text-[#00E4FF] text-sm font-medium">AI-Powered Verification</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-white">OriginX</span>{' '}
            <span className="bg-gradient-to-r from-[#00E4FF] to-[#1A66FF] bg-clip-text text-transparent">
              Verification Engine
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8"
          >
            AI-powered identity, education, developer, and employment verification
          </motion.p>

          {/* Status */}
          <AnimatePresence mode="wait">
            {status !== 'idle' && (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`text-xl font-semibold ${getStatusColor()}`}
              >
                {getStatusText()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Corner Labels */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute bottom-8 left-8 hidden md:block"
      >
        <div className="flex items-center gap-2 text-[#00E4FF]/80 text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00E4FF] animate-pulse" />
          <span>Identity Check</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute bottom-8 right-8 hidden md:block"
      >
        <div className="flex items-center gap-2 text-[#1A66FF]/80 text-sm">
          <span>Developer Score</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1A66FF] animate-pulse" />
        </div>
      </motion.div>

      {/* Top Corner Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute top-8 left-8 hidden lg:flex flex-col gap-1"
      >
        <div className="text-[#00E4FF]/60 text-xs uppercase tracking-wider">Nodes Active</div>
        <div className="text-white text-2xl font-bold">127</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute top-8 right-8 hidden lg:flex flex-col gap-1 text-right"
      >
        <div className="text-[#1A66FF]/60 text-xs uppercase tracking-wider">Verifications</div>
        <div className="text-white text-2xl font-bold">1.2M+</div>
      </motion.div>
    </div>
  );
}
