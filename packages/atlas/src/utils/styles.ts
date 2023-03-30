import { css } from '@emotion/react'

export const toPx = (n: number | string) => (typeof n === 'number' ? `${n}px` : n)

export type MaskProps = {
  shadowsVisible: {
    left: boolean
    right: boolean
  }
}

export const getMaskImage = ({ shadowsVisible }: MaskProps) => {
  if (shadowsVisible.left && shadowsVisible.right) {
    return css`
      mask-image: linear-gradient(to left, transparent 5%, black 25%, black 75%, transparent 95%);
    `
  }
  if (shadowsVisible.left) {
    return css`
      mask-image: linear-gradient(90deg, rgb(0 0 0 / 0) 5%, rgb(0 0 0 / 1) 25%);
    `
  }
  if (shadowsVisible.right) {
    return css`
      mask-image: linear-gradient(270deg, rgb(0 0 0 / 0) 5%, rgb(0 0 0 / 1) 25%);
    `
  }
}
