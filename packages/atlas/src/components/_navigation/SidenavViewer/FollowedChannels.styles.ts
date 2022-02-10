import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, sizes } from '@/styles'

import { EXPANDED_SIDENAVBAR_WIDTH, NAVBAR_LEFT_PADDING } from '../SidenavBase/SidenavBase.styles'

export const StyledSkeletonLoader = styled(SkeletonLoader)`
  margin-left: ${sizes(4)};
`

export const FollowedChannelsWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
`

export const BrowseChannelsWrapper = styled(Link)`
  padding: ${sizes(3)} ${NAVBAR_LEFT_PADDING}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  color: ${cVar('colorText')};

  &:hover,
  &:focus {
    color: ${cVar('colorTextStrong')};
    background-color: ${cVar('colorBackgroundAlpha')};
  }
`

export const BrowseChannelsIcon = styled.div`
  background-color: ${cVar('colorBackgroundAlpha')};
  border-radius: 50%;
  opacity: 0.5;
  width: ${sizes(8)};
  height: ${sizes(8)};
  padding: ${sizes(2)};
  margin-right: ${sizes(4)};

  > svg > path {
    fill: ${cVar('colorTextStrong')} !important;
  }
`

export const BrowseChannelsText = styled(Text)`
  color: inherit;
  margin-left: ${sizes(4)};
`

export const ChannelTitle = styled(Text)`
  padding-left: ${sizes(4)};
  color: inherit !important;
`

export const ChannelsTitle = styled(Text)`
  margin-top: ${sizes(6)};
  margin-bottom: ${sizes(4)};
  padding-left: ${NAVBAR_LEFT_PADDING}px;
  width: ${EXPANDED_SIDENAVBAR_WIDTH - NAVBAR_LEFT_PADDING}px;
`

export const ChannelsWrapper = styled.div`
  width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  overflow-y: auto;
  overflow-x: hidden;
`

export const ChannelsList = styled.ul`
  color: ${cVar('colorText')};
  width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
`
