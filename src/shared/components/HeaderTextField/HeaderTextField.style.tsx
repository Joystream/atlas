import styled from '@emotion/styled'
import { fluidRange } from 'polished'
import { Text } from '@/shared/components'
import { colors, sizes, typography, breakpoints } from '@/shared/theme'

export const Container = styled.div`
  position: relative;
  width: fit-content;
  background-color: ${colors.gray[800]};
`

export const StyledInput = styled.input`
  line-height: 1;
  padding: ${sizes(1)} 0 ${sizes(2)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '40px' })};
  color: white;
  background-color: ${colors.transparent};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.bold};
  border: none;
  min-width: 100px;
  max-width: 100vw;
  height: ${sizes(13)};
  &:hover {
    filter: brightness(80%);
  }
  @media screen and (min-width: ${breakpoints.small}) {
    max-width: 600px;
  }
`

export const WarningText = styled(Text)`
  color: ${({ error }) => (error ? colors.error : colors.warning)};
  background-color: ${colors.gray[800]};
  width: fit-content;
  max-width: 600px;
  padding: ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '10px', toSize: '16px' })};
`
