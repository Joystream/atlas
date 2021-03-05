import { sizes, colors, typography } from '@/shared/theme'
import styled from '@emotion/styled'
import ChannelLink from '../ChannelLink'
import Text from '../../shared/components/Text'
import { NAVBAR_LEFT_PADDING, EXPANDED_SIDENAVBAR_WIDTH } from './SideNavbar.style'

export const ChannelsTitle = styled(Text)`
  margin-top: ${sizes(6)};
  margin-bottom: ${sizes(4)};
  padding-left: ${NAVBAR_LEFT_PADDING}px;

  width: ${EXPANDED_SIDENAVBAR_WIDTH - NAVBAR_LEFT_PADDING}px;

  color: ${colors.gray[300]};
`
export const ChannelsWrapper = styled.div`
  padding-left: ${NAVBAR_LEFT_PADDING}px;
  width: ${EXPANDED_SIDENAVBAR_WIDTH}px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 60px;
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

  font-family: ${typography.fonts.base};
  font-size: 1rem;
  font-weight: bold;

  cursor: pointer;
  padding: ${sizes(5)} 0;
  display: flex;
  align-items: center;
  color: ${colors.white};
  svg {
    margin-top: 2px;
    margin-left: 10px;
  }

  > span {
    margin-left: 34px;
  }
`
