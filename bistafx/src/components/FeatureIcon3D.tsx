"use client";

import dynamic from "next/dynamic";

const ThreeIcon = dynamic(() => import("@/components/ThreeIcon"), {
  ssr: false,
  loading: () => (
    <div className="w-14 h-14 rounded-xl bg-gold-dim border border-[rgba(255,199,44,0.12)] animate-pulse" />
  ),
});

export type FeatureIcon3DProps = {
  icon: string;
  /** "md" = 56px (feature cards), "sm" = 44px (about list), "lg" = 72px (services) */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = { sm: 44, md: 56, lg: 72 } as const;

export default function FeatureIcon3D({
  icon,
  size = "md",
  className = "",
}: FeatureIcon3DProps) {
  const px = SIZES[size];
  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-gold-dim border border-[rgba(255,199,44,0.12)] ${className}`}
      style={{ width: px, height: px, minWidth: px }}
    >
      <ThreeIcon
        icon={icon}
        size={px}
        rotationSpeed={0.12 + Math.random() * 0.08}
        floatSpeed={1.5 + Math.random()}
        floatIntensity={0.3}
      />
    </div>
  );
}
