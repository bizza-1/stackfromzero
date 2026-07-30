"use client";

// ============================================================
// StatCounter — animated number that counts up on scroll.
// Wraps useCounter and renders the value span.
// ============================================================
import { useCounter } from "@/lib/animation/hooks";

type StatCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

export default function StatCounter({
  value,
  prefix,
  suffix,
  decimals,
  className,
}: StatCounterProps) {
  const ref = useCounter<HTMLSpanElement>({ value, prefix, suffix, decimals });
  // Server render shows the final value for no-JS / SEO; the hook
  // resets it to 0 and animates once mounted.
  return (
    <span ref={ref} className={className}>
      {prefix}
      {decimals ? value.toFixed(decimals) : value}
      {suffix}
    </span>
  );
}
