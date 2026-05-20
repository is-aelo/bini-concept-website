"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;

uniform vec3 uTeal;
uniform vec3 uTealDark;
uniform vec3 uTealPale;

varying vec2 vUv;

// Clean noise to add subtle breathing mutation to the blob shapes
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Slow tempo time vector for breathing animation
  float t = uTime * 0.035;
  vec2 mouse = uMouse * 0.03;

  // Discrete structural noise loops for shape morphing
  float morphTC = snoise(vec2(uv.x * 1.4 + t, uv.y * 1.4 - t * 0.5)) * 0.05;
  float morphBR = snoise(vec2(uv.x * 1.2 - t * 0.7, uv.y * 1.2 + t)) * 0.05;

  // --- Top Center Blob Configuration ---
  // Pinned centrally at the top (0.5, 0.95) with a massive, wide presence
  vec2 centerTC = vec2(0.50 + sin(t * 0.6) * 0.03, 0.95 + cos(t * 0.8) * 0.02) + mouse;
  float radiusTC = 0.65 + morphTC;
  float distTC = length(uv - centerTC) / radiusTC;
  float blobTC = 1.0 - smoothstep(0.0, 1.0, distTC);
  blobTC = pow(blobTC, 2.0); 

  // --- Bottom Right Blob Configuration ---
  // Pinned to the lower right corner (0.88, 0.12)
  vec2 centerBR = vec2(0.88 + cos(t * 0.7) * 0.04, 0.12 + sin(t * 0.9) * 0.03) - mouse;
  float radiusBR = 0.52 + morphBR;
  float distBR = length(uv - centerBR) / radiusBR;
  float blobBR = 1.0 - smoothstep(0.0, 1.0, distBR);
  blobBR = pow(blobBR, 2.2);

  // --- Canvas Color Assembly ---
  // Default raw background color state
  vec3 finalColor = uTealPale;

  // Layer 1: Top Center Blob (Completely dominated by uTealPale expanding into uTeal edges)
  vec3 topCenterColor = mix(uTeal * 0.3 + uTealPale * 0.7, uTealPale, blobTC);
  
  // Layer 2: Bottom Right Blob (Dominated completely by uTeal, using uTealDark at its absolute core)
  vec3 bottomRightColor = mix(uTealPale, uTeal, blobBR * 0.95);
  bottomRightColor = mix(bottomRightColor, uTealDark, pow(blobBR, 4.0) * 0.5);

  // Combine both distinct systems together smoothly
  finalColor = mix(finalColor, topCenterColor, blobTC);
  finalColor = mix(finalColor, bottomRightColor, blobBR);

  // Smooth screen vignette to anchor content containers
  float edgeFade = smoothstep(0.9, 0.4, length(uv - 0.5));
  
  // Scale alpha maps to match the brand-new weight proportions perfectly
  float combinedMask = max(blobTC, blobBR);
  float alpha = (0.05 + combinedMask * 0.38) * edgeFade;

  gl_FragColor = vec4(finalColor, alpha);
}
`;

function Scene() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();
  const mouse = useMemo(() => new THREE.Vector2(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uTeal: {
        value: new THREE.Color(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--c-teal")
            .trim()
        ),
      },
      uTealDark: {
        value: new THREE.Color(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--c-teal-dark")
            .trim()
        ),
      },
      uTealPale: {
        value: new THREE.Color(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--c-teal-pale")
            .trim()
        ),
      },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    mouse.set(state.mouse.x, state.mouse.y);
    materialRef.current.uniforms.uMouse.value.lerp(mouse, 0.025);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function ProfileGridShader() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ background: "var(--c-surface)" }}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}