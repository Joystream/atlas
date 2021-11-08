import styled from '@emotion/styled'

import { colors, sizes, typography } from '@/theme'

import { Text } from '../Text'

type StyledTooltipProps = {
  headerText?: boolean
}

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${sizes(5)};
  height: ${sizes(5)};
  margin-right: ${sizes(1)};
`

export const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: ${sizes(3)};
    height: ${sizes(3)};
    background: inherit;
  }

  & {
    visibility: hidden;
  }

  &::before {
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }
`

type TooltipTextProps = {
  withIcon?: boolean
}

export const TooltipText = styled(Text)<TooltipTextProps>`
  max-width: 200px;
  line-height: ${typography.lineHeights.subtitle1};
  ${({ withIcon }) => withIcon && `margin-left: ${sizes(6)}`};
`

export const TooltipHeader = styled.div`
  display: flex;
  margin-bottom: ${sizes(2)};
`

export const StyledTooltip = styled.div<StyledTooltipProps>`
  display: inline-flex;
  flex-direction: ${({ headerText }) => (headerText ? 'column' : 'row')};
  padding: ${sizes(2)};
  background-color: ${colors.gray[400]};

  ${TooltipHeader} {
    align-items: ${({ headerText }) => (headerText ? 'center' : 'flex-start')};
  }

  &[data-placement^='top-start'] ${Arrow} {
    bottom: -6px;
    left: 12px;
  }
  &[data-placement^='top-end'] ${Arrow} {
    bottom: -6px;
    right: 16px;
  }

  &[data-placement^='bottom-end'] ${Arrow} {
    top: -6px;
    right: 16px;
  }

  &[data-placement^='bottom-start'] ${Arrow} {
    top: -6px;
    left: 12px;
  }
`
