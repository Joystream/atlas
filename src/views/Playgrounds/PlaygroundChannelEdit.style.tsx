import styled from '@emotion/styled'
import { sizes, breakpoints } from '@/shared/theme'
import { Textarea, ActionBarTransaction, Avatar, FormField } from '@/shared/components'
import { TitleSection } from '../ChannelView/ChannelView.style'

export const StyledTitleSection = styled(TitleSection)`
  display: inline-flex;
  width: auto;
  flex-direction: row;
  padding-top: ${sizes(8)};
  @media (min-width: ${breakpoints.small}) {
    padding-top: 0;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const InnerFormContainer = styled.div`
  width: 100%;
  max-width: 760px;
  margin-top: 50px;
  padding-bottom: 200px;
  @media screen and (min-width: ${breakpoints.large}) {
    margin-left: calc(144px - var(--global-horizontal-padding));
  }
`

export const StyledFormField = styled(FormField)`
  margin-top: 40px;
`

export const StyledTextarea = styled(Textarea)`
  position: relative;
  width: 100%;
  textarea {
    height: 120px;
  }
`

export const StyledActionBarTransaction = styled(ActionBarTransaction)`
  @media screen and (min-width: ${breakpoints.large}) {
    padding: ${sizes(3)} 144px;
  }
`
export const StyledAvatar = styled(Avatar)`
  position: relative;
  margin-right: ${sizes(4)};
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  @media (min-width: ${breakpoints.small}) {
    width: 136px;
    height: 136px;
  }
`
