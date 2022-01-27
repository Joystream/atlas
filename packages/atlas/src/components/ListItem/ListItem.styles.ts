import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

import { ListItemSizes } from '.'
import { SvgActionCheck } from '../_icons'

const getContainerPadding = (size: ListItemSizes) => {
  switch (size) {
    case 'large':
      return css`
        padding: ${sizes(3)} ${sizes(4)};
      `
    case 'medium':
      return css`
        padding: ${sizes(2)} ${sizes(4)};
      `
    case 'small':
      return css`
        padding: ${sizes(1)} ${sizes(4)};
      `
  }
}
const disabledStyles = css`
  opacity: 0.25;
  cursor: not-allowed;
`
const interactiveStyles = css`
  &:focus,
  &:hover {
    background-color: ${cVar('colorBackgroundAlpha')};
  }

  &:active {
    background-color: ${cVar('colorBackgroundMutedAlpha')};
  }
`
type ContainerProps = { size: ListItemSizes; hasNodeStart: boolean; disabled?: boolean }
export const Container = styled.div<ContainerProps>`
  display: grid;
  grid-gap: ${sizes(3)};
  grid-auto-flow: column;
  grid-template-columns: ${({ hasNodeStart }) => (hasNodeStart ? 'auto 1fr' : '1fr')};
  align-items: center;
  user-select: none;
  cursor: pointer;

  ${({ disabled }) => disabled && disabledStyles};
  ${({ size }) => getContainerPadding(size)};
  ${({ disabled }) => !disabled && interactiveStyles};
`

export const LabelCaptionContainer = styled.div<{ captionBottom: boolean }>`
  display: grid;
  grid-template-columns: ${({ captionBottom }) => (captionBottom ? '1fr' : '1fr auto')};
  grid-gap: 0 ${sizes(3)};
  align-items: center;
`

export const SelectedIcon = styled(SvgActionCheck)`
  path {
    fill: ${cVar('colorTextPrimary')};
  }
`
type CaptionPosition = {
  captionPosition?: 'right' | 'bottom'
}
const captionRightStyles = ({ captionPosition }: CaptionPosition) =>
  captionPosition === 'right' &&
  css`
    text-align: right;
  `
export const Caption = styled(Text)<CaptionPosition>`
  ${captionRightStyles}
`

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: 24px;
`

export const NodeContainer = styled.div<{ destructive?: boolean }>`
  * path {
    fill: ${({ destructive }) => destructive && cVar('colorTextError')};
  }
`
