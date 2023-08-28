import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { TextButton } from '@/components/_buttons/Button'
import { cVar, media, sizes } from '@/styles'

export const Wrapper = styled(LimitedWidthContainer)`
  display: grid;
  row-gap: ${sizes(16)};
  margin-top: ${sizes(8)};

  ${media.md} {
    grid-template-columns: 2fr 1fr;
    column-gap: ${sizes(6)};
  }
`

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${sizes(4)};

  svg {
    cursor: pointer;
    margin-right: ${sizes(4)};
  }

  ${media.md} {
    grid-column: 1/3;
  }
`

export const HeaderButton = styled(TextButton)`
  margin-left: auto;
`

export const HeaderInnerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${sizes(4)};
  border-left: 1px solid ${cVar('colorCoreNeutral600')};
  padding-left: ${sizes(4)};
  min-height: 40px;
  align-items: center;
`

export const FirstColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(12)};

  ${media.md} {
    gap: ${sizes(16)};
  }
`

export const SecondColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(6)};
`

export const Placeholder = styled.div<{ height: number }>`
  height: ${({ height }) => height + 'px'};
  background-color: #2b2d42;
  display: grid;
  place-items: center;
`
