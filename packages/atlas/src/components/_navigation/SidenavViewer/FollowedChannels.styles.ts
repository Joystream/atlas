import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Text } from '@/components/Text'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { cVar, sizes } from '@/styles'

import { EXPANDED_SIDENAVBAR_WIDTH, NAVBAR_LEFT_PADDING } from '../SidenavBase/SidenavBase.styles'

export const FollowedChannelsWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
`

export const BrowseChannelsWrapper = styled(Link)`
  padding: ${sizes(4)} ${NAVBAR_LEFT_PADDING}px;
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
  margin-bottom: 10px;
`

export const ChannelsList = styled.ul`
  color: ${cVar('colorText')};
  width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
`

export const StyledChannelLink = styled(ChannelLink)`
  width: 100%;
  height: 100%;

  > span {
    margin-left: ${sizes(2)};
  }

  padding: ${sizes(4)} 0;
  color: inherit;
`

export const ChannelsItem = styled.li`
  padding-left: ${NAVBAR_LEFT_PADDING}px;

  &:hover,
  &:focus {
    background-color: ${cVar('colorBackgroundAlpha')};

    h6 {
      color: ${cVar('colorTextStrong')} !important;
    }
  }

  &:active,
  &[data-active='true'] {
    color: ${cVar('colorTextStrong')} !important;
    background-color: ${cVar('colorBackgroundStrongAlpha')};
  }
`
