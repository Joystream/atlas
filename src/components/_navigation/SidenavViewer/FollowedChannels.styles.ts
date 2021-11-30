import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { cVar, oldColors, sizes } from '@/styles'

import { EXPANDED_SIDENAVBAR_WIDTH, NAVBAR_LEFT_PADDING } from '../SidenavBase'

export const FollowedChannelsWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
`

export const ChannelsTitle = styled(Text)`
  margin-top: ${sizes(6)};
  margin-bottom: ${sizes(4)};
  padding-left: ${NAVBAR_LEFT_PADDING}px;
  width: ${EXPANDED_SIDENAVBAR_WIDTH - NAVBAR_LEFT_PADDING}px;
  color: ${oldColors.gray[300]};
`
export const ChannelsWrapper = styled.div`
  padding-left: ${NAVBAR_LEFT_PADDING}px;
  width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 10px;
`

export const ChannelsList = styled.ul`
  width: ${EXPANDED_SIDENAVBAR_WIDTH - NAVBAR_LEFT_PADDING}px;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
`
export const StyledChannelLink = styled(ChannelLink)`
  > span {
    margin-left: ${sizes(6)};
  }
`

export const ChannelsItem = styled.li`
  margin-top: ${sizes(5)};
  list-style: none;
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
  color: ${oldColors.white};
`

export const ShowMoreIconWrapper = styled.span`
  padding: ${sizes(2)};
  margin-right: ${sizes(6)};
`
