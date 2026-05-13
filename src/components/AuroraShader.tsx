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
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
    );
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
    );
    vec3 m = max(
      0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
      0.0
    );
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
    float t = uTime * 0.1;
    vec2 p = uv;

    float n1 = snoise(p * 1.6 + t);
    float n2 = snoise(p * 2.2 - t * 0.8);
    p += vec2(n1, n2) * 0.2;

    float field = snoise(p * 1.8 + vec2(t, -t * 0.6));

    float topLeft  = (1.0 - uv.x) * (1.0 - uv.y);
    float botRight = uv.x * uv.y;
    float spread   = topLeft + botRight;

    /* base: --c-surface #F5F3EE */
    vec3 base    = vec3(0.961, 0.953, 0.933);
    /* --c-teal #63CBD6 */
    vec3 cTeal   = vec3(0.388, 0.796, 0.839);
    /* --c-stacey #EC7FA3 */
    vec3 cPink   = vec3(0.925, 0.498, 0.639);

    vec3 accent  = mix(cTeal, cPink, smoothstep(-0.4, 0.4, field));
    vec3 color   = mix(base, accent, spread * 0.13 + 0.04 * smoothstep(-0.5, 0.5, field));

    float alpha  = 0.55 + 0.3 * smoothstep(-0.5, 0.5, field) * spread;
    alpha        = clamp(alpha, 0.4, 0.85);

    gl_FragColor = vec4(color, alpha);
  }
`;

function Scene() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();
  const mouse = useMemo(() => new THREE.Vector2(0, 0), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    const { clock, mouse: m } = state;
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    mouse.set(m.x, m.y);
    materialRef.current.uniforms.uMouse.value.lerp(mouse, 0.05);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
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
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Scene />
      </Canvas>
    </div>
  );
}