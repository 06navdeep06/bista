"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/* ── 3D Extruded Logo from SVG ────────────────── */
function LogoModel() {
  const svgData = useLoader(SVGLoader, "/logo.svg");
  const groupRef = useRef<THREE.Group>(null);

  const { goldGeoms, darkGeoms, scaleFactor } = useMemo(() => {
    const gold: THREE.BufferGeometry[] = [];
    const dark: THREE.BufferGeometry[] = [];
    const all: THREE.BufferGeometry[] = [];

    svgData.paths.forEach((path) => {
      const hex = "#" + path.color.getHexString();
      // Skip the black square background
      if (hex === "#000000") return;

      const shapes = SVGLoader.createShapes(path);
      shapes.forEach((shape) => {
        const pts = shape.getPoints(8);
        if (pts.length === 0) return;
        // Filter out text paths — hexagon symbol lives at avgY < 350
        const avgY = pts.reduce((s, p) => s + p.y, 0) / pts.length;
        if (avgY > 350) return;

        const isDark =
          hex === "#040301" || hex === "#040200" || hex === "#150d01";

        const geom = new THREE.ExtrudeGeometry(shape, {
          depth: 20,
          bevelEnabled: true,
          bevelSize: 1,
          bevelSegments: 3,
          bevelThickness: 1,
        });

        geom.computeBoundingBox();
        (isDark ? dark : gold).push(geom);
        all.push(geom);
      });
    });

    // Compute combined bounding box, centre all geometries
    const box = new THREE.Box3();
    all.forEach((g) => {
      if (g.boundingBox) box.union(g.boundingBox);
    });
    const center = box.getCenter(new THREE.Vector3());
    all.forEach((g) => g.translate(-center.x, -center.y, -center.z));

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const sc = 3.5 / maxDim;

    return { goldGeoms: gold, darkGeoms: dark, scaleFactor: sc };
  }, [svgData]);

  // Slow Y-axis rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f5c542"),
        metalness: 0.9,
        roughness: 0.25,
        emissive: new THREE.Color("#f5c542"),
        emissiveIntensity: 0.12,
        side: THREE.DoubleSide,
      }),
    []
  );

  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0a0a0a"),
        metalness: 0.3,
        roughness: 0.7,
        side: THREE.DoubleSide,
      }),
    []
  );

  return (
    <group ref={groupRef} scale={[scaleFactor, -scaleFactor, scaleFactor]}>
      {goldGeoms.map((geom, i) => (
        <mesh key={`g${i}`} geometry={geom} material={goldMat} />
      ))}
      {darkGeoms.map((geom, i) => (
        <mesh
          key={`d${i}`}
          geometry={geom}
          material={darkMat}
          position={[0, 0, 0.5]}
        />
      ))}
    </group>
  );
}

/* ── Orbit Rings ──────────────────────────────── */
function OrbitRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (r1.current) r1.current.rotation.z += delta * 0.08;
    if (r2.current) r2.current.rotation.x += delta * 0.06;
    if (r3.current) r3.current.rotation.y += delta * 0.1;
  });

  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#f5c542"),
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      }),
    []
  );

  return (
    <>
      <mesh ref={r1} rotation={[Math.PI / 6, 0, 0]} material={mat}>
        <torusGeometry args={[3.2, 0.008, 16, 100]} />
      </mesh>
      <mesh ref={r2} rotation={[0, 0, Math.PI / 3]} material={mat}>
        <torusGeometry args={[3.0, 0.006, 16, 80]} />
      </mesh>
      <mesh ref={r3} rotation={[Math.PI / 4, Math.PI / 4, 0]} material={mat}>
        <torusGeometry args={[2.8, 0.005, 16, 80]} />
      </mesh>
    </>
  );
}

/* ── Starfield Particles ──────────────────────── */
function Starfield() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f5c542"
        size={0.02}
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ── Scene Assembly ───────────────────────────── */
function Scene() {
  return (
    <>
      {/* Cinematic lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -5]} intensity={0.5} color="#f5c542" />
      {/* Rim / back-light for gold edge glow */}
      <pointLight position={[0, 0, -8]} intensity={2} color="#f5c542" distance={18} />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Suspense fallback={null}>
          <LogoModel />
        </Suspense>
        <OrbitRings />
      </Float>

      <Starfield />
    </>
  );
}

/* ── Exported Component ───────────────────────── */
export default function HeroLogo3D() {
  return (
    <div
      className="absolute inset-0 z-0 opacity-70"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
