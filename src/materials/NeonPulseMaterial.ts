import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// Advanced neon pulse shader with scanning capability
export const NeonPulseMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00E4FF'),
    uSecondaryColor: new THREE.Color('#1A66FF'),
    uGlow: 1.5,
    uPulseSpeed: 1.0,
    uScanCenter: new THREE.Vector3(0, 0, 0),
    uScanRadius: 0,
    uScanActive: 0,
    uOpacity: 1.0,
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uSecondaryColor;
    uniform float uGlow;
    uniform float uPulseSpeed;
    uniform vec3 uScanCenter;
    uniform float uScanRadius;
    uniform float uScanActive;
    uniform float uOpacity;
    
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
      // Base pulse along UV
      float pulse = sin(vUv.x * 8.0 - uTime * uPulseSpeed * 3.0) * 0.5 + 0.5;
      
      // Mix colors based on pulse
      vec3 color = mix(uColor, uSecondaryColor, pulse);
      
      // Scan highlight effect
      float distToScan = length(vWorldPosition.xy - uScanCenter.xy);
      float scanHighlight = 0.0;
      
      if (uScanActive > 0.5) {
        float scanEdge = smoothstep(uScanRadius - 0.5, uScanRadius, distToScan) 
                       - smoothstep(uScanRadius, uScanRadius + 0.5, distToScan);
        scanHighlight = scanEdge * 2.0;
        
        // Nodes inside scan radius get boosted
        float insideScan = 1.0 - smoothstep(0.0, uScanRadius, distToScan);
        color += vec3(0.2, 0.5, 0.8) * insideScan * 0.3;
      }
      
      // Edge fade for soft lines
      float edgeFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
      
      // Glow intensity
      float glow = (1.0 + pulse * uGlow * 0.5 + scanHighlight);
      
      gl_FragColor = vec4(color * glow, edgeFade * uOpacity * (0.5 + pulse * 0.5));
    }
  `
);

// Holographic scanner ring shader
export const HolographicScannerMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00E4FF'),
    uRadius: 10,
    uThickness: 0.3,
    uIntensity: 1.5,
    uSweepAngle: 0,
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uRadius;
    uniform float uThickness;
    uniform float uIntensity;
    uniform float uSweepAngle;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    #define PI 3.14159265359
    
    void main() {
      vec2 centered = vUv - 0.5;
      float dist = length(centered) * 2.0;
      float angle = atan(centered.y, centered.x);
      
      // Ring shape
      float ring = smoothstep(1.0 - uThickness, 1.0 - uThickness * 0.5, dist)
                 * smoothstep(1.0, 1.0 - uThickness * 0.5, dist);
      
      // Sweep arc (partial ring)
      float normalizedAngle = (angle + PI) / (2.0 * PI);
      float sweepNormalized = uSweepAngle / (2.0 * PI);
      
      // Create sweep effect
      float sweep = smoothstep(sweepNormalized - 0.1, sweepNormalized, normalizedAngle)
                  * smoothstep(sweepNormalized + 0.02, sweepNormalized, normalizedAngle);
      
      // Trailing glow
      float trail = smoothstep(sweepNormalized - 0.3, sweepNormalized - 0.05, normalizedAngle)
                  * (1.0 - smoothstep(sweepNormalized - 0.05, sweepNormalized, normalizedAngle));
      
      // Combine
      float alpha = ring * (sweep * 2.0 + trail * 0.5 + 0.1);
      
      // Pulsing glow
      float pulse = sin(uTime * 4.0) * 0.2 + 0.8;
      
      vec3 finalColor = uColor * uIntensity * pulse;
      
      gl_FragColor = vec4(finalColor, alpha * 0.8);
    }
  `
);

// Node glow shader
export const NodeGlowMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00E4FF'),
    uGlow: 2.0,
    uPulsePhase: 0,
    uActive: 0,
    uStatus: 0, // 0=idle, 1=processing, 2=completed, 3=failed
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uGlow;
    uniform float uPulsePhase;
    uniform float uActive;
    uniform float uStatus;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    
    void main() {
      // Fresnel for rim glow
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
      
      // Breathing pulse
      float pulse = sin(uTime * 2.5 + uPulsePhase) * 0.25 + 0.75;
      
      // Active boost
      float activeBoost = uActive * (sin(uTime * 8.0) * 0.3 + 0.7);
      
      // Status color modifications
      vec3 finalColor = uColor;
      if (uStatus > 1.5 && uStatus < 2.5) {
        // Completed - green flash
        finalColor = mix(uColor, vec3(0.0, 1.0, 0.54), 0.8);
      } else if (uStatus > 2.5) {
        // Failed - red
        finalColor = mix(uColor, vec3(1.0, 0.3, 0.42), 0.8);
      }
      
      float intensity = (0.6 + fresnel * 0.6) * pulse * uGlow + activeBoost;
      
      gl_FragColor = vec4(finalColor * intensity, 0.95);
    }
  `
);
