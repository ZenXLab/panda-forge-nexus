import { useEffect, useRef, useState } from 'react';

export type VerificationStatus = 'idle' | 'queued' | 'processing' | 'completed' | 'failed';

interface VerificationStep {
  id: string;
  nodeIds: string[];
  status: VerificationStatus;
}

interface VerificationStepControllerProps {
  status: VerificationStatus;
  activeNodes: string[];
  steps?: VerificationStep[];
  onStepComplete?: (stepId: string) => void;
  onAllComplete?: () => void;
}

export function useVerificationStepController({
  status,
  activeNodes,
  steps = [],
  onStepComplete,
  onAllComplete,
}: VerificationStepControllerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [scannerActive, setScannerActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    switch (status) {
      case 'idle':
        setHighlightedNodes([]);
        setPulseIntensity(1);
        setScannerActive(false);
        break;

      case 'queued':
        // Gentle pulse on origin/first nodes
        setHighlightedNodes(activeNodes.slice(0, 3));
        setPulseIntensity(1.2);
        setScannerActive(false);
        break;

      case 'processing':
        setScannerActive(true);
        setPulseIntensity(2);
        
        // Cycle through active nodes
        let nodeIndex = 0;
        intervalRef.current = setInterval(() => {
          const nodesToHighlight = activeNodes.slice(
            nodeIndex, 
            Math.min(nodeIndex + 5, activeNodes.length)
          );
          setHighlightedNodes(nodesToHighlight);
          nodeIndex = (nodeIndex + 2) % activeNodes.length;
        }, 300);
        break;

      case 'completed':
        setHighlightedNodes(activeNodes);
        setPulseIntensity(2.5);
        setScannerActive(false);
        
        // Flash effect
        setTimeout(() => {
          setPulseIntensity(1.5);
        }, 500);
        
        onAllComplete?.();
        break;

      case 'failed':
        setHighlightedNodes(activeNodes.slice(0, 3));
        setPulseIntensity(1.8);
        setScannerActive(false);
        break;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, activeNodes, onAllComplete]);

  // Process steps sequentially
  useEffect(() => {
    if (status !== 'processing' || steps.length === 0) return;

    const processStep = () => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setHighlightedNodes(step.nodeIds);
        
        // Simulate step completion
        setTimeout(() => {
          onStepComplete?.(step.id);
          setCurrentStepIndex(prev => prev + 1);
        }, 1500);
      }
    };

    processStep();
  }, [currentStepIndex, status, steps, onStepComplete]);

  return {
    highlightedNodes,
    pulseIntensity,
    scannerActive,
    currentStepIndex,
  };
}

// Color utilities based on status
export function getStatusColors(status: VerificationStatus) {
  switch (status) {
    case 'completed':
      return {
        primary: '#00FF8A',
        secondary: '#00CC6A',
        glow: 'rgba(0, 255, 138, 0.3)',
      };
    case 'failed':
      return {
        primary: '#FF4D6D',
        secondary: '#CC3D57',
        glow: 'rgba(255, 77, 109, 0.3)',
      };
    case 'processing':
      return {
        primary: '#00E4FF',
        secondary: '#1A66FF',
        glow: 'rgba(0, 228, 255, 0.3)',
      };
    case 'queued':
      return {
        primary: '#FFD700',
        secondary: '#FFA500',
        glow: 'rgba(255, 215, 0, 0.3)',
      };
    default:
      return {
        primary: '#1A66FF',
        secondary: '#0A3366',
        glow: 'rgba(26, 102, 255, 0.2)',
      };
  }
}
