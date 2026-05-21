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

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
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
  
  // Faster, bouncier time factor
  float t = uTime * 0.15;
  
  // Interactive mouse displacement for a "push" effect
  vec2 mouse = uMouse * 0.25;

  // More fluid noise for organic stretching
  float morphTC = snoise(vec2(uv.x * 3.0 + t * 0.2, uv.y * 3.0 - t * 0.3)) * 0.06;
  float morphBR = snoise(vec2(uv.x * 2.5 - t * 0.3, uv.y * 2.5 + t * 0.2)) * 0.06;

  // Blob movement: Added stronger mouse tracking for interactivity
  vec2 centerTC = vec2(0.5 + sin(t * 0.4) * 0.1, 0.85 + cos(t * 0.5) * 0.05) + mouse * 0.5;
  float distTC = length(uv - centerTC) / (0.5 + morphTC);
  float blobTC = pow(1.0 - smoothstep(0.0, 1.0, distTC), 1.5); 

  vec2 centerBR = vec2(0.8 + cos(t * 0.5) * 0.1, 0.2 + sin(t * 0.6) * 0.08) - mouse * 0.5;
  float distBR = length(uv - centerBR) / (0.45 + morphBR);
  float blobBR = pow(1.0 - smoothstep(0.0, 1.0, distBR), 1.8);

  vec3 finalColor = uTealPale;

  // Playful layering
  vec3 topCenterColor = mix(uTeal, uTealPale, blobTC * 0.5);
  vec3 bottomRightColor = mix(uTeal, uTealDark, blobBR * 0.3); // Reduced dark intensity

  finalColor = mix(finalColor, topCenterColor, blobTC);
  finalColor = mix(finalColor, bottomRightColor, blobBR);

  float edgeFade = smoothstep(1.0, 0.1, length(uv - 0.5));
  float alpha = (0.2 + (blobTC + blobBR) * 0.3) * edgeFade;

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
      uTeal: { value: new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--c-teal").trim()) },
      uTealDark: { value: new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--c-teal-dark").trim()) },
      uTealPale: { value: new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--c-teal-pale").trim()) },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Increased lerp speed for more responsive mouse tracking
    mouse.set(state.mouse.x * 0.5, state.mouse.y * 0.5);
    materialRef.current.uniforms.uMouse.value.lerp(mouse, 0.08);
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
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}