import { typography, colors } from '../../theme'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'

export type CustomLinkStyleProps = Record<string, unknown>

export const StyledLink = styled(Link)`
  font-family: ${typography.fonts.base};
  font-size: ${typography.sizes.overhead};
  color: ${colors.blue[400]};
  text-decoration: none;
  cursor: pointer;
`

export const DisabledLabel = styled.label`
  font-family: ${typography.fonts.base};
  font-size: ${typography.sizes.overhead};
  color: ${colors.gray[200]};
  text-decoration: none;
  cursor: not-allowed;
`
