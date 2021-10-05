import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

import { Popover } from './Popover'

import { Text } from '../Text'

export const MAX_POPOVER_HEIGHT = 320

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

const scrollableContentContainerStyles = css`
  overflow-y: scroll;
`
export const ContentContainer = styled.div<Scrollable>`
  display: grid;
  gap: ${sizes(3)};
  padding: ${sizes(4)} 0;

  ${({ isScrollable }) => isScrollable && scrollableContentContainerStyles};
`

export const footerContainerScrollableStyles = css`
  padding-top: ${sizes(4)};
  border-top: 1px solid ${colors.gray[600]};
`

export const FooterContainer = styled.div<Scrollable>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: end;
  gap: ${sizes(2)};

  ${({ isScrollable }) => isScrollable && footerContainerScrollableStyles};
`

export const PopoverContainer = styled(Popover)<Scrollable>`
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: ${colors.gray[700]};
  padding: ${sizes(4)};
  width: 240px;
  max-height: ${MAX_POPOVER_HEIGHT}px;
`
