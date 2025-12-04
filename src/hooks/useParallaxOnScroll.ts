import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParallaxConfig {
  enabled: boolean;
  intensity: number;
  smoothness: number;
  mobileReduced: boolean;
}

interface LayerParallax {
  foreground: number;
  midground: number;
  background: number;
}

const DEFAULT_CONFIG: ParallaxConfig = {
  enabled: true,
  intensity: 1,
  smoothness: 0.05,
  mobileReduced: true,
};

const LAYER_SPEEDS: LayerParallax = {
  foreground: 1.0,
  midground: 0.6,
  background: 0.3,
};

export function useParallaxOnScroll(config: Partial<ParallaxConfig> = {}) {
  const { enabled, intensity, smoothness, mobileReduced } = { ...DEFAULT_CONFIG, ...config };
  
  const scrollY = useRef(0);
  const targetScrollY = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const { camera } = useThree();
  
  const basePosition = useRef(new THREE.Vector3(0, 0, 22));
  const baseRotation = useRef(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollY.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame(() => {
    if (!enabled) return;

    // Smooth interpolation
    scrollY.current = THREE.MathUtils.lerp(scrollY.current, targetScrollY.current, smoothness);

    const effectiveIntensity = isMobile && mobileReduced ? intensity * 0.3 : intensity;
    const scroll = scrollY.current * effectiveIntensity;

    // Camera position based on scroll
    camera.position.y = basePosition.current.y - scroll * 3;
    camera.position.z = basePosition.current.z - scroll * 2;
    
    // Subtle rotation
    camera.rotation.x = baseRotation.current.x + scroll * 0.1;
  });

  const getLayerOffset = (layer: 'foreground' | 'midground' | 'background') => {
    const effectiveIntensity = isMobile && mobileReduced ? intensity * 0.3 : intensity;
    return scrollY.current * LAYER_SPEEDS[layer] * effectiveIntensity * 5;
  };

  return {
    scrollProgress: scrollY.current,
    getLayerOffset,
    isMobile,
  };
}

// Simple scroll progress hook for components outside R3F
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
