"use client";

import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/* ── Shared gold material (reused across all icons) ── */
const GOLD_MAT_PARAMS: THREE.MeshStandardMaterialParameters = {
  color: new THREE.Color("#f5c542"),
  metalness: 0.9,
  roughness: 0.25,
  emissive: new THREE.Color("#f5c542"),
  emissiveIntensity: 0.1,
  side: THREE.DoubleSide,
};

/* ── Single 3D icon mesh from SVG ──────────────── */
function IconMesh({
  url,
  rotationSpeed = 0.15,
}: {
  url: string;
  rotationSpeed?: number;
}) {
  const svgData = useLoader(SVGLoader, url);
  const groupRef = useRef<THREE.Group>(null);

  const geometries = useMemo(() => {
    const geoms: THREE.BufferGeometry[] = [];

    svgData.paths.forEach((path) => {
      const shapes = SVGLoader.createShapes(path);
      shapes.forEach((shape) => {
        const geom = new THREE.ExtrudeGeometry(shape, {
          depth: 4,
          bevelEnabled: true,
          bevelSize: 0.3,
          bevelSegments: 2,
          bevelThickness: 0.3,
        });
        geom.computeBoundingBox();
        geoms.push(geom);
      });
    });

    // Centre all geometries together
    const box = new THREE.Box3();
    geoms.forEach((g) => {
      if (g.boundingBox) box.union(g.boundingBox);
    });
    const center = box.getCenter(new THREE.Vector3());
    geoms.forEach((g) => g.translate(-center.x, -center.y, -center.z));

    return geoms;
  }, [svgData]);

  // Compute uniform scale so the icon fits within ~1.8 units
  const scale = useMemo(() => {
    if (geometries.length === 0) return 1;
    const box = new THREE.Box3();
    geometries.forEach((g) => {
      g.computeBoundingBox();
      if (g.boundingBox) box.union(g.boundingBox);
    });
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 1.8 / maxDim : 1;
  }, [geometries]);

  const material = useMemo(
    () => new THREE.MeshStandardMaterial(GOLD_MAT_PARAMS),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, -scale, scale]}>
      {geometries.map((geom, i) => (
        <mesh key={i} geometry={geom} material={material} />
      ))}
    </group>
  );
}

/* ── Scene wrapper with lighting ───────────────── */
function IconScene({
  url,
  rotationSpeed,
  floatSpeed = 2,
  floatIntensity = 0.4,
}: {
  url: string;
  rotationSpeed?: number;
  floatSpeed?: number;
  floatIntensity?: number;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 5]} intensity={1} />
      <directionalLight position={[-2, -1, -3]} intensity={0.4} color="#f5c542" />
      <Float speed={floatSpeed} rotationIntensity={0.08} floatIntensity={floatIntensity}>
        <Suspense fallback={null}>
          <IconMesh url={url} rotationSpeed={rotationSpeed} />
        </Suspense>
      </Float>
    </>
  );
}

/* ── Viewport visibility hook ──────────────────── */
function useInView(ref: React.RefObject<HTMLDivElement | null>, margin = "100px") {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: margin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, margin]);
  return visible;
}

/* ── Exported component ────────────────────────── */
export type ThreeIconProps = {
  /** Filename in /assets/3d-icons/, e.g. "shield" */
  icon: string;
  /** CSS width/height of the canvas container */
  size?: number;
  /** Y-axis rotation speed (rad/s) */
  rotationSpeed?: number;
  /** Float animation speed */
  floatSpeed?: number;
  /** Float animation intensity */
  floatIntensity?: number;
  /** Extra CSS classes on the container */
  className?: string;
};

export default function ThreeIcon({
  icon,
  size = 56,
  rotationSpeed = 0.15,
  floatSpeed = 2,
  floatIntensity = 0.4,
  className = "",
}: ThreeIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visible = useInView(containerRef);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: size, height: size, pointerEvents: "none" }}
    >
      {visible && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <IconScene
            url={`/assets/3d-icons/${icon}.svg`}
            rotationSpeed={rotationSpeed}
            floatSpeed={floatSpeed}
            floatIntensity={floatIntensity}
          />
        </Canvas>
      )}
    </div>
  );
}
