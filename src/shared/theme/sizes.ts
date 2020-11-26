const base = 4

export function sizes<B extends boolean>(n: number, raw?: B): B extends false ? string : number
export function sizes(n: number, raw?: boolean) {
  return raw ? base * n : `${base * n}px`
}
