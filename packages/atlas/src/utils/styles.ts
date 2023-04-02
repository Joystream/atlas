import { css } from '@emotion/react'

export const toPx = (n: number | string) => (typeof n === 'number' ? `${n}px` : n)

export type MaskProps = {
  visibleShadows: {
    left: boolean
    right: boolean
  }
}

export const getMaskImage = ({ visibleShadows }: MaskProps) => {
  if (visibleShadows.left && visibleShadows.right) {
    return css`
      mask-image: linear-gradient(to left, transparent 5%, black 25%, black 75%, transparent 95%);
    `
  }
  if (visibleShadows.left) {
    return css`
      mask-image: linear-gradient(90deg, rgb(0 0 0 / 0) 5%, rgb(0 0 0 / 1) 25%);
    `
  }
  if (visibleShadows.right) {
    return css`
      mask-image: linear-gradient(270deg, rgb(0 0 0 / 0) 5%, rgb(0 0 0 / 1) 25%);
    `
  }
}
