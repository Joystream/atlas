import { StudioContainer } from '@/components'
import { Button, Text, Avatar } from '@/shared/components'
import { media, colors, sizes } from '@/shared/theme'

import styled from '@emotion/styled'

export const Header = styled.header`
  max-width: 440px;
  margin-bottom: ${sizes(12)};
`

export const Hero = styled(Text)`
  word-break: break-word;
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(4)};
`

export const Wrapper = styled(StudioContainer)`
  display: flex;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  margin-top: 64px;
  justify-content: space-between;
`
export const Form = styled.form`
  position: relative;
  width: 100%;
  max-width: 580px;
  height: initial;

  ${media.medium} {
    left: 0;
    height: calc(100vh - 300px);
    width: 100%;
  }
`

export const StyledAvatar = styled(Avatar)`
  margin-bottom: ${sizes(4)};
`

export const StyledButton = styled(Button)`
  display: block;
  cursor: pointer;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: auto;
`
export const StyledText = styled(Text)`
  color: ${colors.gray[300]};
  margin-top: ${sizes(3)};
`
