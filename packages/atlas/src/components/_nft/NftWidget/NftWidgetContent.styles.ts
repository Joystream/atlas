import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const sizeObj = { small: 'small', medium: 'medium' } as const
export type Size = keyof typeof sizeObj

export type SizeProps = { 'data-size': keyof typeof sizeObj }

export const ButtonGrid = styled.div<SizeProps & { 'data-two-columns'?: boolean }>`
  display: grid;
  gap: ${sizes(4)};

  &[data-size=${sizeObj.small}] {
    gap: ${sizes(2)};
  }

  &[data-two-columns='true'] {
    grid-template-columns: 1fr 1fr;
  }
`

export const TopBidderContainer = styled.div`
  display: flex;
`

export const TopBidderTokenContainer = styled.div<SizeProps>`
  display: flex;
  align-items: center;
  position: relative;
  left: -4px;
  z-index: 10;

  &::before {
    display: inline-block;
    position: absolute;
    content: '';
    width: 28px;
    height: 28px;
    background: ${cVar('colorBackgroundMuted')};
    border-radius: 100%;
    left: -2px;
    top: -2px;
  }

  &[data-size=${sizeObj.small}] {
    &::before {
      width: 21px;
      height: 21px;
      left: -2.5px;
      top: 1.5px;
    }
  }
`
