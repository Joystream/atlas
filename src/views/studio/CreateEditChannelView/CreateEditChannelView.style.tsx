import styled from '@emotion/styled'
import { sizes, breakpoints, transitions } from '@/shared/theme'
import { Textarea, ActionBarTransaction, Avatar, FormField } from '@/shared/components'
import { TitleSection } from '@/views/consumer/ChannelView/ChannelView.style'

type AtionBarProps = {
  isActive?: boolean
}

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
  max-width: var(--max-inner-width);
  margin: 50px auto 0 auto;
  padding-bottom: 100px;
  @media screen and (min-width: ${breakpoints.medium}) {
    padding-bottom: 200px;
  }
`

export const StyledFormField = styled(FormField)`
  margin-top: 40px;
  width: 100%;
  max-width: 760px;
`

export const StyledTextarea = styled(Textarea)`
  position: relative;
  width: 100%;
  max-width: 760px;
  textarea {
    height: 120px;
  }
`

export const StyledActionBarTransaction = styled(ActionBarTransaction)<AtionBarProps>`
  transform: translateY(${({ isActive }) => (isActive ? '0' : '100%')});
  transition: transform ${transitions.timings.regular} ${transitions.easing};
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
