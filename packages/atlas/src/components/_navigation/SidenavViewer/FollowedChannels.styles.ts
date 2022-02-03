import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { cVar, sizes } from '@/styles'

import { EXPANDED_SIDENAVBAR_WIDTH, NAVBAR_LEFT_PADDING } from '../SidenavBase'

export const FollowedChannelsWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
`

// TODO
export const ChannelsTitle = styled(Text)`
  margin-top: ${sizes(6)};
  margin-bottom: ${sizes(4)};
  padding-left: ${NAVBAR_LEFT_PADDING}px;
  width: ${EXPANDED_SIDENAVBAR_WIDTH - NAVBAR_LEFT_PADDING}px;
  color: ${cVar('colorText')};
`

export const ChannelsWrapper = styled.div`
  width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 10px;
`

export const ChannelsList = styled.ul`
  width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
`

export const StyledChannelLink = styled(ChannelLink)`
  width: 100%;

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
    color: ${cVar('colorTextStrong')};
  }

  &:active,
  &[data-active='true'] {
    color: ${cVar('colorTextStrong')};
    background-color: ${cVar('colorBackgroundStrongAlpha')};
  }
`

export const ShowMoreButton = styled.button`
  border: none;
  background: none;
  font: ${cVar('typographyDesktopT200Strong')};
  letter-spacing: ${cVar('typographyDesktopT200StrongLetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200StrongTextTransform')};
  cursor: pointer;
  padding: ${sizes(5)} 0;
  display: flex;
  align-items: center;
  color: ${cVar('colorText')};
`

export const ShowMoreIconWrapper = styled.span`
  padding: ${sizes(2)};
  margin-right: ${sizes(6)};
`
