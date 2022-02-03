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

export const ChannelsTitle = styled(Text)`
  font: ${cVar('typographyDesktopH100')};
  margin-top: ${sizes(6)};
  margin-bottom: ${sizes(4)};
  padding-left: ${NAVBAR_LEFT_PADDING}px;
  width: ${EXPANDED_SIDENAVBAR_WIDTH - NAVBAR_LEFT_PADDING}px;
  color: ${cVar('colorText')};
  text-transform: uppercase;
  letter-spacing: 0.07em;
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

type HasSecondaryProps = {
  textSecondary: boolean
}

export const StyledChannelLink = styled(ChannelLink)<HasSecondaryProps>`
  width: 100%;
  height: ${sizes(6)};

  > span {
    margin-left: ${sizes(2)};
  }

  margin: ${sizes(4)} 0;
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
