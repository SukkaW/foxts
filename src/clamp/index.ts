export function clamp(value: number, min: number, max: number): number;
export function clamp(min: number, max: number): (value: number) => number;
export function clamp(a: number, b?: number, c?: number): number | ((value: number) => number) {
  if (c === undefined) {
    const min = a;
    const max = b!;
    return (value: number) => {
      if (value < min) return min;
      if (value > max) return max;
      return value;
    };
  }

  const value = a;
  const min = b!;
  const max = c;

  if (value < min) return min;
  if (value > max) return max;
  return value;
}
