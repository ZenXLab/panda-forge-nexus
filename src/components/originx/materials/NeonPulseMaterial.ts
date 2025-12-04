import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// Custom shader material for neon glowing pulsing lines
export const NeonLineMaterial = shaderMaterial(
  {
    uTime: 0,
    uPulseSpeed: 1.0,
    uGlowIntensity: 1.5,
    uColor: new THREE.Color('#00E4FF'),
    uSecondaryColor: new THREE.Color('#1A66FF'),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform float uPulseSpeed;
    uniform float uGlowIntensity;
    uniform vec3 uColor;
    uniform vec3 uSecondaryColor;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      // Create pulsing effect along the line
      float pulse = sin(vUv.x * 10.0 - uTime * uPulseSpeed) * 0.5 + 0.5;
      
      // Mix between primary and secondary colors
      vec3 color = mix(uColor, uSecondaryColor, pulse);
      
      // Add glow intensity
      float glow = pulse * uGlowIntensity;
      
      // Edge fade for softer look
      float edgeFade = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
      
      gl_FragColor = vec4(color * (1.0 + glow * 0.5), edgeFade * (0.6 + pulse * 0.4));
    }
  `
);

// Custom shader for glowing nodes
export const NeonNodeMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00E4FF'),
    uGlowIntensity: 2.0,
    uPulsePhase: 0,
  },
  // Vertex shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uGlowIntensity;
    uniform float uPulsePhase;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Fresnel effect for glow
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
      
      // Breathing/pulse effect
      float pulse = sin(uTime * 2.0 + uPulsePhase) * 0.3 + 0.7;
      
      // Core brightness
      float core = 0.8 + fresnel * 0.4;
      
      vec3 finalColor = uColor * core * pulse * uGlowIntensity;
      
      gl_FragColor = vec4(finalColor, 0.9);
    }
  `
);

// Particle material with floating animation
export const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00E4FF'),
    uSize: 2.0,
  },
  // Vertex shader
  `
    uniform float uTime;
    uniform float uSize;
    
    attribute float aScale;
    attribute float aPhase;
    
    varying float vAlpha;
    
    void main() {
      vec3 pos = position;
      
      // Floating animation
      pos.x += sin(uTime * 0.5 + aPhase) * 0.3;
      pos.y += cos(uTime * 0.3 + aPhase * 1.5) * 0.3;
      pos.z += sin(uTime * 0.4 + aPhase * 0.7) * 0.2;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
      
      vAlpha = 0.3 + sin(uTime + aPhase) * 0.2;
    }
  `,
  // Fragment shader
  `
    uniform vec3 uColor;
    varying float vAlpha;
    
    void main() {
      // Circular point with soft edges
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      
      float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
      gl_FragColor = vec4(uColor, alpha);
    }
  `
);
