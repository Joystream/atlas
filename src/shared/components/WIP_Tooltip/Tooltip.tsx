import styled from '@emotion/styled'
import { colors, sizes, typography } from '@/shared/theme'

export const StyledTooltip = styled.span`
  position: absolute;
  opacity: 0;
  transition: 0.2s;
  left: 0;
  bottom: -${sizes(4)};
  &:before {
    display: inline-block;
    content: attr(data-text);
    font-size: ${typography.sizes.body2};
    font-weight: ${typography.weights.light};
    position: absolute;
    top: ${sizes(4)};
    width: 200px;
    padding: 10px;
    background: ${colors.gray[400]};
    color: ${colors.white};
    text-align: center;
  }
  &:after {
    display: inline-block;
    content: '';
    margin-left: ${sizes(4)};
    transform: rotate(90deg);
    border: 10px solid transparent;
    border-right-color: ${colors.gray[400]};
  }
`
