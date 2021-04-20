import styled from '@emotion/styled'
import { colors, sizes, typography } from '@/shared/theme'

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

export const StyledTooltip = styled.div`
  display: inline-flex;
  padding: ${sizes(2)};
  background-color: ${colors.gray[500]};
  span {
    max-width: 200px;
    line-height: ${typography.lineHeights.subtitle1};
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
