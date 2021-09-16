import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

import { Popover } from './Popover'

import { Text } from '../Text'

export const MAX_CONTENT_HEIGHT = 219

type Scrollable = {
  isScrollable: boolean
}

const headerContainerScrollableStyles = css`
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[600]};
`

export const HeaderContainer = styled(Text)<Scrollable>`
  ${({ isScrollable }) => isScrollable && headerContainerScrollableStyles};
`

export const ContentContainer = styled.div`
  display: grid;
  gap: ${sizes(3)};
  padding: ${sizes(4)} 0;
  max-height: ${MAX_CONTENT_HEIGHT}px;
  overflow-y: auto;
`

export const FooterContainer = styled.div<Scrollable>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: end;
  gap: ${sizes(2)};

  ${({ isScrollable }) =>
    isScrollable &&
    `
    padding-top: ${sizes(4)};
    border-top: 1px solid ${colors.gray[600]};
  `}
`

export const PopoverContainer = styled(Popover)`
  background-color: ${colors.gray[700]};
  padding: ${sizes(4)};
  width: 240px;
`
