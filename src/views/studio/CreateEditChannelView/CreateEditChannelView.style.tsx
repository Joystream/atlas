import styled from '@emotion/styled'

import { Avatar } from '@/shared/components/Avatar'
import { TitleArea } from '@/shared/components/TitleArea'
import { media, sizes } from '@/shared/theme'
import { SubTitle, TitleSection } from '@/views/viewer/ChannelView/ChannelView.style'

export const StyledTitleSection = styled(TitleSection)`
  display: inline-flex;
  width: auto;
  flex-direction: row;
  padding-top: ${sizes(8)};
  ${media.small} {
    padding-top: 0;
  }

  /* Hidden visibility on container to not block hover state on Channel cover. 
  TitleArea, SubTitle and Avatar must be visible  */
  visibility: hidden;
`

export const StyledTitleArea = styled(TitleArea)`
  visibility: visible;
`

export const StyledSubTitle = styled(SubTitle)`
  visibility: visible;
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const InnerFormContainer = styled.div`
  width: 100%;
  margin-top: 50px;
  padding-bottom: 250px;
`

export const StyledAvatar = styled(Avatar)`
  position: relative;
  margin-right: ${sizes(4)};
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  visibility: visible;
  ${media.small} {
    width: 136px;
    height: 136px;
  }
`
