import { sizes, colors, breakpoints } from '@/shared/theme'
import styled from '@emotion/styled'
import Text from '../Text'

export const Header = styled.header`
  max-width: 440px;
  margin-bottom: ${sizes(12)};
`

export const Hero = styled(Text)`
  font-size: 54px;
  word-break: break-word;
  @media screen and (min-width: ${breakpoints.small}) {
    font-size: 72px;
  }
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(3)};
  color: ${colors.gray[300]};
`
