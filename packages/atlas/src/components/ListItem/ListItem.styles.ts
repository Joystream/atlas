import isPropValid from '@emotion/is-prop-valid'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

import { SvgActionCheck } from '../../assets/icons'

export type ListItemSizes = 'small' | 'medium' | 'large'

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

const separatorStyles = css`
  cursor: unset;
`
type ContainerProps = {
  size: ListItemSizes
  hasNodeStart: boolean
  disabled?: boolean
  highlight?: boolean
  isSeparator?: boolean
  isInteractive?: boolean
}
export const Container = styled('div', { shouldForwardProp: isPropValid })<ContainerProps>`
  border: none;
  width: 100%;
  justify-items: start;
  display: grid;
  grid-gap: ${sizes(3)};
  grid-auto-flow: column;
  grid-template-columns: ${({ hasNodeStart }) => (hasNodeStart ? 'auto 1fr' : '1fr')};
  align-items: center;
  user-select: none;
  cursor: ${({ isInteractive }) => (isInteractive ? 'cursor' : 'unset')};
  background-color: ${({ highlight }) => (highlight ? cVar('colorBackgroundMutedAlpha') : 'unset')};
  text-decoration: none;
  position: relative;

  ${({ disabled, isSeparator }) => disabled && !isSeparator && disabledStyles};
  ${({ size }) => getContainerPadding(size)};
  ${({ disabled, isSeparator, isInteractive }) => isInteractive && !disabled && !isSeparator && interactiveStyles};
  ${({ isSeparator }) => isSeparator && separatorStyles};
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
  captionPosition === 'right'
    ? css`
        text-align: right;
      `
    : css`
        text-align: left;
      `
export const Caption = styled(Text)<CaptionPosition>`
  ${captionRightStyles};
`

export const LabelContainer = styled.div<{ isSeparator?: boolean }>`
  display: flex;
  align-items: center;
  min-height: ${({ isSeparator }) => (!isSeparator ? '24px' : 'unset')};
`

export const LabelText = styled(Text)`
  width: 100%;
  word-break: break-word;
  text-align: left;
`

const iconStyles = ({ destructive, isHovering, isSelected }: NodeContainerProps) =>
  css`
    > svg > path {
      fill: ${destructive
        ? cVar('colorTextError')
        : isHovering || isSelected
        ? cVar('colorTextStrong')
        : cVar('colorText')};
    }
  `

type NodeContainerProps = {
  destructive?: boolean
  isHovering?: boolean
  isSelected?: boolean
  position?: 'top' | 'bottom'
}
export const NodeContainer = styled.div<NodeContainerProps>`
  ${iconStyles};

  align-self: ${(props) => (props.position === 'top' ? 'flex-start' : 'unset')};
`

export const SeparatorWrapper = styled.div`
  width: 100%;
  bottom: 0;
  left: 0;

  :first-of-type {
    display: none;
  }
`

const lineStyles = css`
  height: 1px;
`

export const TopLine = styled.div`
  ${lineStyles};

  background-color: ${cVar('colorCoreNeutral400Darken')};
`

export const BottomLine = styled.div`
  ${lineStyles};

  background-color: ${cVar('colorCoreNeutral900Lighten')};
`
