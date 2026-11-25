/** Sample commercial load shape for one day. u is 0..1 across 24 hours, result is 0..1. */
export function loadAt(u: number): number {
  const sig = (x: number) => 1 / (1 + Math.exp(-x));
  const occupied = sig((u - 0.27) / 0.03) - sig((u - 0.8) / 0.035);
  const peak = Math.exp(-(((u - 0.62) / 0.075) ** 2));
  return 0.24 + 0.4 * occupied + 0.27 * peak + 0.012 * Math.sin(u * 46);
}

export const PEAK_THRESHOLD = 0.7;
