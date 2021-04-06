import styled from '@emotion/styled'
import { sizes, breakpoints } from '@/shared/theme'
import { Textarea, Avatar } from '@/shared/components'
import { Header, TitleSection } from '@/views/viewer/ChannelView/ChannelView.style'

export const StyledHeader = styled(Header)``

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
  margin-top: 50px;
  padding-bottom: 100px;
  @media screen and (min-width: ${breakpoints.medium}) {
    padding-bottom: 200px;
  }
`

export const StyledTextarea = styled(Textarea)`
  textarea {
    height: 120px;
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
