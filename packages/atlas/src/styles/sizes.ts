import { css } from '@emotion/react'

import { toPx } from '@/utils/styles'

const base = 4

export function sizes(n: number): string
export function sizes<B extends boolean>(n: number, raw?: B): B extends false ? string : number

export function sizes(n: number, raw?: boolean) {
  return raw === true ? base * n : (`${base * n}px` as string)
}

export const zIndex = {
  background: -10,
  farBackground: -20,
  overlay: 10,
  nearOverlay: 20,
  transactionBar: 80,
  nearTransactionBar: 81,
  header: 100,
  sideNav: 200,
  videoWorkspaceOverlay: 250,
  nearVideoWorkspaceOverlay: 260,
  globalOverlay: 999,
}

export function square(rawSize: string | number) {
  const size = toPx(rawSize)
  return css`
    width: ${size};
    min-width: ${size};
    height: ${size};
  `
}
