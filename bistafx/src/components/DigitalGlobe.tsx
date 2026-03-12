"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function GlobeWireframe() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x += delta * 0.015;
    }
  });

  const wireframeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#FFD700"),
        wireframe: true,
        transparent: true,
        opacity: 0.06,
      }),
    []
  );

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#FFD700"),
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      }),
    []
  );

  return (
    <group ref={meshRef}>
      {/* Main sphere wireframe */}
      <mesh material={wireframeMaterial}>
        <icosahedronGeometry args={[2.2, 3]} />
      </mesh>
      {/* Outer ring */}
      <mesh material={edgeMaterial} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.008, 16, 100]} />
      </mesh>
      {/* Inner ring tilted */}
      <mesh material={edgeMaterial} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.6, 0.006, 16, 80]} />
      </mesh>
    </group>
  );
}

function DataParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const count = 250;
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 1.2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      spd[i] = 0.2 + Math.random() * 0.5;
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < posArray.length / 3; i++) {
      const idx = i * 3;
      const speed = speeds[i];
      posArray[idx + 1] += Math.sin(time * speed + i) * 0.001;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFD700"
        size={0.015}
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Scene() {
  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.4}>
      <GlobeWireframe />
      <DataParticles />
    </Float>
  );
}

export default function DigitalGlobe() {
  return (
    <div
      className="absolute inset-0 z-0 opacity-60"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <Scene />
      </Canvas>
    </div>
  );
}
