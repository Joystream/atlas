import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const BidRowWrapper = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: auto 2fr auto;
  gap: ${sizes(4)};
  align-items: center;
  padding: ${sizes(3)} ${sizes(4)};
  background-color: ${({ selected }) => selected && cVar('colorBackgroundAlpha')};

  ${media.xs} {
    grid-template-columns: repeat(2, auto) 2fr auto;
  }

  ${media.md} {
    padding: ${sizes(3)} ${sizes(6)};
  }

  :hover {
    background-color: ${({ selected }) => !selected && cVar('colorBackgroundMutedAlpha')};
  }
`

export const Price = styled.div`
  text-align: right;
`

export const TokenPrice = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${sizes(1)};
  justify-content: flex-end;
`
