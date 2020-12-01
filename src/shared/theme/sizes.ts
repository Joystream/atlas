const base = 4

export function sizes<B extends boolean>(n: number, raw?: B): B extends false ? string : number
export function sizes(n: number, raw?: boolean) {
  return raw ? base * n : `${base * n}px`
}

export const zIndex = {
  1: 10,
  2: 20,
  3: 30,
  4: 40,
  5: 50,
  '-1': -10,
  '-2': -20,
  '-3': -30,
  '-4': -40,
  '-5': -50,
  minusInfinity: -9999,
  infinity: 9999,
}
