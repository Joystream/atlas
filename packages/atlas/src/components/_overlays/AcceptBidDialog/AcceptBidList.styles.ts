import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const BidRowWrapper = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: auto 2fr auto;
  gap: ${sizes(4)};
  align-items: center;
  padding: ${sizes(2)} ${sizes(4)};
  background-color: ${({ selected }) => selected && cVar('colorBackgroundMutedAlpha')};
  cursor: pointer;

  ${media.xs} {
    grid-template-columns: repeat(2, auto) 2fr auto;
  }

  ${media.md} {
    padding: ${sizes(3)} ${sizes(6)};
  }

  :hover {
    background-color: ${({ selected }) => !selected && cVar('colorBackgroundAlpha')};
  }
`

export const Price = styled.div`
  text-align: right;
  display: grid;
  gap: ${sizes(1)};
`

export const TokenPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
