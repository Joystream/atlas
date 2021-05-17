import { StudioContainer } from '@/components'
import { Button, Text, Avatar, TextField } from '@/shared/components'
import { media, sizes } from '@/shared/theme'

import styled from '@emotion/styled'

export const Header = styled.header`
  margin-bottom: ${sizes(12)};
  max-width: 580px;
  ${media.medium} {
    max-width: 440px;
  }
`

export const Hero = styled(Text)`
  word-break: break-word;
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(4)};
`

export const Wrapper = styled(StudioContainer)`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  margin-top: 64px;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 150px;
  ${media.medium} {
    align-items: unset;
    flex-direction: row;
  }
`
export const Form = styled.form`
  position: relative;
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  ${media.medium} {
    display: block;
  }
`
export const StyledTextField = styled(TextField)`
  margin-bottom: ${sizes(5)};
`

export const StyledAvatar = styled(Avatar)`
  margin-bottom: ${sizes(4)};
`

export const StyledButton = styled(Button)`
  display: block;
  margin-top: 30px;
  ${media.medium} {
    margin-left: auto;
  }
`
