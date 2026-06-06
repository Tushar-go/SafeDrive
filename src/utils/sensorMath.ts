export function magnitude(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

export function magnitudeXY(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

/** Simple moving-average smoother — mutates buffer in place */
export function movingAverage(val: number, buf: number[], size = 5): number {
  buf.push(val);
  if (buf.length > size) buf.shift();
  return buf.reduce((a, b) => a + b, 0) / buf.length;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
