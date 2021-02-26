import styled from '@emotion/styled'
import { sizes, breakpoints } from '@/shared/theme'
import { Textarea, ActionBarTransaction, Avatar } from '@/shared/components'

export const Form = styled.form`
  padding-bottom: 100px;
`

export const InnerFormContainer = styled.div`
  max-width: 760px;
  margin-top: 50px;
  margin-left: 144px;
`

export const StyledTextarea = styled(Textarea)`
  position: relative;
  height: 120px;
  margin-bottom: 100px;
`

export const StyledActionBarTransaction = styled(ActionBarTransaction)`
  @media screen and (min-width: ${breakpoints.medium}) {
    padding: ${sizes(3)} 144px;
  }
`
export const StyledAvatar = styled(Avatar)`
  margin-bottom: ${sizes(3)};
  position: relative;
  @media (min-width: ${breakpoints.small}) {
    margin: 0 ${sizes(6)} 0 0;
  }
`
