import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

import { Popover } from './Popover'

import { Text } from '../Text'

export const MAX_POPOVER_HEIGHT = 320

type Dividers = {
  dividers: boolean
}

type Header = {
  hasHeader: boolean
}

const headerContainerDividersStyles = css`
  border-bottom: 1px solid ${colors.gray[600]};
`

export const HeaderContainer = styled(Text)<Dividers>`
  padding-bottom: ${sizes(4)};
  ${({ dividers }) => dividers && headerContainerDividersStyles};
`

const ContentHeaderHasHeaderStyles = ({ hasHeader }: Header) =>
  hasHeader
    ? css`
        padding: ${sizes(4)} 0;
      `
    : css`
        padding-bottom: ${sizes(4)};
      `

export const ContentContainer = styled.div<Dividers & Header>`
  display: grid;
  gap: ${sizes(3)};
  overflow-y: auto;
  ${({ hasHeader }) => ContentHeaderHasHeaderStyles({ hasHeader })}
`

export const footerContainerDividersStyles = css`
  padding-top: ${sizes(4)};
  border-top: 1px solid ${colors.gray[600]};
`

export const FooterContainer = styled.div<Dividers>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: end;
  gap: ${sizes(2)};
  padding-top: ${sizes(4)};

  ${({ dividers }) => dividers && footerContainerDividersStyles};
`

export const PopoverContainer = styled(Popover)<Header>`
  display: grid;
  grid-template-rows: ${({ hasHeader }) => (hasHeader ? 'auto 1fr auto' : '1fr auto')};
  background-color: ${colors.gray[700]};
  padding: ${sizes(4)};
  width: 240px;
  max-height: ${MAX_POPOVER_HEIGHT}px;
`
