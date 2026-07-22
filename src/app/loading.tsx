import { AuraMark } from "@/components/aura-logo";

export default function Loading() {
  return (
    <div className="aura-loader">
      <AuraMark />
      <p className="text-xs tracking-[0.35em] text-text-muted uppercase">Loading</p>
    </div>
  );
}
