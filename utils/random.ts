export function random2D(x: number, y: number, seed = 12345): number {
  let n = x * 374761393 + y * 668265263 + seed * 69069;

  n = (n ^ (n >> 13)) * 1274126177;
  n ^= n >> 16;

  return (n >>> 0) / 4294967295;
}
