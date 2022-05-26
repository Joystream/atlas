import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { ProgressDrawer } from '@/components/ProgressDrawer'
import { TitleInput } from '@/components/_inputs/TitleInput'
import { media, sizes, transitions, zIndex } from '@/styles'
import { SubTitle, TitleSection } from '@/views/viewer/ChannelView/ChannelView.styles'

export const StyledTitleSection = styled(TitleSection)`
  margin-top: 0;
  padding-top: ${sizes(8)};
  display: inline-flex;
  width: auto;
  flex-direction: row;

  /* Hidden visibility on container to not block hover state on Channel cover. 
  TitleArea, SubTitle and Avatar must be visible  */
  visibility: hidden;
`

export const StyledTitleArea = styled(TitleInput)`
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
  z-index: ${zIndex.transactionBar};

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
