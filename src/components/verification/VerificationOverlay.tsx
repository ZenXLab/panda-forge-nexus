import { motion, AnimatePresence } from 'framer-motion';
import { getStatusColors, VerificationStatus } from './VerificationStepController';

interface VerificationOverlayProps {
  status: VerificationStatus;
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  nodeCount?: number;
  verificationCount?: string;
}

export function VerificationOverlay({
  status,
  title = 'OriginX Verification Engine',
  subtitle = 'AI-powered identity, education, developer, and employment verification',
  showStats = true,
  nodeCount = 127,
  verificationCount = '1.2M+',
}: VerificationOverlayProps) {
  const colors = getStatusColors(status);

  const getStatusText = () => {
    switch (status) {
      case 'queued': return 'Queued...';
      case 'processing': return 'Verifying...';
      case 'completed': return 'Verified ✓';
      case 'failed': return 'Verification Failed';
      default: return '';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-t-transparent rounded-full"
            style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
          />
        );
      case 'completed':
        return <span className="text-xl">✓</span>;
      case 'failed':
        return <span className="text-xl">✕</span>;
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Accessible status for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {status !== 'idle' && `Verification status: ${getStatusText()}`}
      </div>

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: `${colors.primary}15`,
              border: `1px solid ${colors.primary}40`,
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <span style={{ color: colors.primary }} className="text-sm font-medium">
              AI-Powered Verification
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-white">OriginX</span>{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
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
            {subtitle}
          </motion.p>

          {/* Status Indicator */}
          <AnimatePresence mode="wait">
            {status !== 'idle' && (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-3 text-xl font-semibold"
                style={{ color: colors.primary }}
              >
                {getStatusIcon()}
                <span>{getStatusText()}</span>
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
        <div className="flex items-center gap-2 text-sm" style={{ color: `${colors.primary}CC` }}>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
          <span>Identity Check</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="absolute bottom-8 right-8 hidden md:block"
      >
        <div className="flex items-center gap-2 text-sm" style={{ color: `${colors.secondary}CC` }}>
          <span>Developer Score</span>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: colors.secondary }}
          />
        </div>
      </motion.div>

      {/* Stats */}
      {showStats && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute top-8 left-8 hidden lg:flex flex-col gap-1"
          >
            <div className="text-xs uppercase tracking-wider" style={{ color: `${colors.primary}99` }}>
              Nodes Active
            </div>
            <div className="text-white text-2xl font-bold">{nodeCount}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="absolute top-8 right-8 hidden lg:flex flex-col gap-1 text-right"
          >
            <div className="text-xs uppercase tracking-wider" style={{ color: `${colors.secondary}99` }}>
              Verifications
            </div>
            <div className="text-white text-2xl font-bold">{verificationCount}</div>
          </motion.div>
        </>
      )}

      {/* Processing indicator rings */}
      <AnimatePresence>
        {status === 'processing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2"
          >
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
