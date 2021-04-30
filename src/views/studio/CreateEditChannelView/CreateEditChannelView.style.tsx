import styled from '@emotion/styled'
import { sizes, media } from '@/shared/theme'
import { Avatar } from '@/shared/components'
import { Header, TitleSection } from '@/views/viewer/ChannelView/ChannelView.style'
import Checkout from '@/shared/components/Checkout'

export const StyledHeader = styled(Header)``

export const StyledTitleSection = styled(TitleSection)`
  display: inline-flex;
  width: auto;
  flex-direction: row;
  padding-top: ${sizes(8)};
  ${media.small} {
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

  ${media.medium} {
    padding-bottom: 200px;
  }
`

export const StyledAvatar = styled(Avatar)`
  position: relative;
  margin-right: ${sizes(4)};
  flex-shrink: 0;
  width: 80px;
  height: 80px;

  ${media.small} {
    width: 136px;
    height: 136px;
  }
`
