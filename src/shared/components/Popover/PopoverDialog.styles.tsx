import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

import { Popover } from './Popover'

import { Text } from '../Text'

export const MAX_POPOVER_HEIGHT = 320

type Dividers = {
  dividers: boolean
}

export const PopoverContainer = styled(Popover)`
  display: flex;
  flex-direction: column;
  background-color: ${colors.gray[700]};
  width: 240px;
  max-height: ${MAX_POPOVER_HEIGHT}px;
`

const headerDividersStyles = css`
  box-shadow: inset 0 -1px 0 0 ${colors.gray[600]};
  padding-bottom: ${sizes(4)};
`

export const Header = styled(Text)<Dividers>`
  padding: ${sizes(4)} ${sizes(4)} 0 ${sizes(4)};

  ${({ dividers }) => dividers && headerDividersStyles};
`

export const ContentContainer = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${sizes(4)};
`

export const footerContainerDividersStyles = css`
  padding-top: ${sizes(4)};
  box-shadow: inset 0 1px 0 0 ${colors.gray[600]};
`

export const FooterContainer = styled.div<Dividers>`
  padding: 0 ${sizes(4)} ${sizes(4)} ${sizes(4)};
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: end;
  gap: ${sizes(2)};

  ${({ dividers }) => dividers && footerContainerDividersStyles};
`
