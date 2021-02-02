import styled from '@emotion/styled'
import { fluidRange } from 'polished'
import { Text } from '@/shared/components'
import { colors, sizes, typography } from '@/shared/theme'

export const Title = styled(Text)`
  line-height: 1;
  padding: ${sizes(1)} ${sizes(2)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '40px' })};
  background-color: ${colors.gray[800]};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  max-width: 600px;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    filter: brightness(80%);
  }
`

export const WarningText = styled(Text)`
  color: ${colors.warning};
  background-color: ${colors.gray[800]};
  max-width: 600px;
  padding: ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '10px', toSize: '16px' })};
`

export const StyledInput = styled.input`
  line-height: 1;
  padding: ${sizes(1)} ${sizes(2)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '40px' })};
  color: white;
  background-color: ${colors.gray[800]};
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.bold};
  border: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  max-width: 600px;
  max-height: 50px;
`

export const StyledTooltip = styled.span`
  position: relative;
  opacity: 0;
  transition: 0.2s;
  &:before {
    display: inline-block;
    content: attr(data-text);
    font-size: ${typography.sizes.body2};
    font-weight: ${typography.weights.light};
    position: absolute;
    top: ${sizes(4)};
    width: 200px;
    padding: 10px;
    background: #52616b;
    color: #fff;
    text-align: center;
  }
  &:after {
    display: inline-block;
    content: '';
    margin-left: ${sizes(4)};
    transform: rotate(90deg);
    border: 10px solid #52616b;
    border-color: transparent #52616b transparent transparent;
  }
`

export const Container = styled.div`
  position: relative;
  & ${Title}:hover ~ ${StyledTooltip} {
    opacity: 1;
  }
`
