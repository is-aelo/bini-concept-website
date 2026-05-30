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
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
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
    float t1 = uTime * 0.05;
    float t2 = uTime * 0.03;
    float n1 = snoise(uv * 1.2 + vec2(t1, t2));
    float n2 = snoise(uv * 1.6 - vec2(t2 * 1.2, t1));
    vec2 distortedUv = uv + vec2(n1, n2) * 0.35;
    float field1 = snoise(distortedUv * 1.0 + vec2(t1 * 0.5, -t1 * 0.3));
    float field2 = snoise(distortedUv * 1.4 - vec2(-t2, t1 * 0.7));
    vec3 baseColor = vec3(0.961, 0.953, 0.933);
    vec3 colorTeal = vec3(0.388, 0.796, 0.839);
    vec3 colorDeepPink = vec3(1.000, 0.000, 0.431);
    vec3 colorAmber = vec3(1.000, 0.745, 0.043);
    vec3 colorPurple = vec3(0.514, 0.220, 0.925);
    vec3 gradientA = mix(colorTeal, colorDeepPink, smoothstep(-0.4, 0.4, field1));
    vec3 gradientB = mix(colorAmber, colorPurple, smoothstep(-0.5, 0.5, field2));
    vec3 activeAurora = mix(gradientA, gradientB, smoothstep(-0.2, 0.2, field1 + field2));
    float patternIntensity = smoothstep(-0.5, 0.5, field1 * 0.5 + field2 * 0.5);
    vec3 finalColor = mix(baseColor, activeAurora, 0.18 + 0.15 * patternIntensity);
    float finalAlpha = clamp(0.45 + 0.25 * patternIntensity, 0.35, 0.75);
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

function Scene() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();
  const mouse = useMemo(() => new THREE.Vector2(0, 0), []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    mouse.set(state.mouse.x, state.mouse.y);
    materialRef.current.uniforms.uMouse.value.lerp(mouse, 0.03);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function AuroraShader() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
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
