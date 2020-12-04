const base = 4

export function sizes<B extends boolean>(n: number, raw?: B): B extends false ? string : number
export function sizes(n: number, raw?: boolean) {
  return raw ? base * n : `${base * n}px`
}

export const zIndex = {
  background: -10,
  farBackground: -20,
  header: 100,
  overlay: 10,
  nearOverlay: 20,
  globalOverlay: 999,
}
