import { css } from '@emotion/react'

import { toPx } from '@/shared/utils/styles'

const base = 4

export function sizes<B extends boolean>(n: number, raw?: B): B extends false ? string : number
export function sizes(n: number, raw?: boolean) {
  return raw ? base * n : `${base * n}px`
}

export const zIndex = {
  background: -10,
  farBackground: -20,
  overlay: 10,
  nearOverlay: 20,
  header: 100,
  sheetOverlay: 150,
  nearSheetOverlay: 160,
  sideNav: 200,
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
