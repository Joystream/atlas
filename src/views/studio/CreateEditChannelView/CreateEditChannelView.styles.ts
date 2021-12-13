import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { ProgressDrawer } from '@/components/ProgressDrawer'
import { TitleArea } from '@/components/_inputs/TitleArea'
import { media, sizes, transitions, zIndex } from '@/styles'
import { SubTitle, TitleSection } from '@/views/viewer/ChannelView/ChannelView.styles'

export const StyledTitleSection = styled(TitleSection)`
  display: inline-flex;
  width: auto;
  flex-direction: row;
  padding-top: ${sizes(8)};
  ${media.sm} {
    padding-top: 0;
  }

  /* Hidden visibility on container to not block hover state on Channel cover. 
  TitleArea, SubTitle and Avatar must be visible  */
  visibility: hidden;
`

export const StyledTitleArea = styled(TitleArea)`
  visibility: visible;
  margin-left: ${sizes(2)};
`

export const StyledSubTitle = styled(SubTitle)`
  visibility: visible;
`

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const InnerFormContainer = styled.div<{ actionBarHeight: number }>`
  width: 100%;
  margin-top: 50px;
  padding-bottom: ${({ actionBarHeight = 0 }) => actionBarHeight}px;
`

export const StyledAvatar = styled(Avatar)`
  position: relative;
  margin-right: ${sizes(4)};
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  visibility: visible;
  ${media.sm} {
    width: 136px;
    height: 136px;
  }
`

export const ActionBarTransactionWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: var(--size-sidenav-width);
  right: 0;
  z-index: ${zIndex.header};

  &.${transitions.names.fade}-enter-active {
    transition: opacity ${transitions.timings.loading} ${transitions.easing} 800ms !important;
  }
`

export const StyledProgressDrawer = styled(ProgressDrawer)`
  display: none;
  ${media.md} {
    position: absolute;
    right: 0;
    bottom: 100%;
    display: block;
  }
`
