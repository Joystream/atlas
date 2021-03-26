import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { breakpoints, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import { Avatar, Text, Button, Icon } from '@/shared/components'
import TopbarBase from '../TopbarBase'
import { TOP_NAVBAR_HEIGHT } from '../TopbarBase.style'

type CommonStudioTopbarProps = {
  isActive?: boolean
  hasChannels?: boolean
}

export const StyledTopbarBase = styled(TopbarBase)`
  @media screen and (min-width: ${breakpoints.small}) {
    display: flex;
    justify-content: space-between;
  }
`

export const DrawerButton = styled(Button)<CommonStudioTopbarProps>`
  svg {
    width: auto;
    height: auto;
    transform: rotate(${({ isActive }) => (isActive ? '180deg' : '0')});
    transition: transform ${transitions.timings.regular} ${transitions.easing};
  }
`

export const ChannelInfoContainer = styled.div<CommonStudioTopbarProps>`
  display: flex;
  align-items: center;
  background-color: ${({ isActive }) => isActive && colors.gray[600]};
  &:hover {
    cursor: pointer;
    background-color: ${({ isActive }) => (isActive ? colors.gray[600] : colors.gray[700])};
  }
`

export const StyledAvatar = styled(Avatar)`
  margin-left: ${sizes(5)};
  margin-right: ${sizes(2.5)};
`

export const TextContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  margin-right: auto;
  width: 160px;
  p:nth-of-type(1) {
    font-size: ${typography.sizes.body1};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  p:nth-of-type(2) {
    font-size: ${typography.sizes.caption};
    color: ${colors.gray[300]};
  }
`

export const StudioTopbarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: ${sizes(3)};
  ${ChannelInfoContainer} {
    &:hover {
      background-color: ${colors.transparent};
    }
    ${TextContainer} {
      display: none;
      @media screen and (min-width: ${breakpoints.medium}) {
        display: flex;
      }
    }
  }
`

export const NewChannelIcon = styled(Icon)`
  opacity: 0.4;
  margin: 0 ${sizes(4)} 0 ${sizes(5)};
  height: 20px;
  width: 20px;
`

export const MemberInfoContainer = styled.div<CommonStudioTopbarProps>`
  display: flex;
  align-items: center;
  margin: 0 calc(-1 * ${sizes(3)});
  margin-bottom: 0;
  border-top: ${({ hasChannels }) => hasChannels && `1px solid ${colors.transparentWhite[18]}`};
  padding: ${sizes(4)} ${sizes(5)} 0;
`

export const MemberTextContainer = styled.div`
  display: flex;
  align-items: center;
`

export const MemberTitleText = styled(Text)`
  background-color: ${colors.gray[400]};
  font-size: ${typography.sizes.caption};
  padding: ${sizes(1)};
  opacity: 0.6;
  margin-left: ${sizes(3)};
`

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
`

export const NewChannel = styled.div`
  display: flex;
  align-items: center;
  padding: ${sizes(2)};
  p {
    margin-left: ${sizes(2)};
    font-size: ${typography.sizes.body1};
    color: ${colors.white};
    text-decoration: none;
  }
  &:hover {
    cursor: pointer;
    background-color: ${colors.gray[700]};
  }
`

export const NewChannelIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  background-color: ${colors.gray[600]};
  border-radius: 100%;
  svg {
    opacity: 0.4;
  }
`

export const DrawerContainer = styled.div<CommonStudioTopbarProps>`
  position: fixed;
  right: ${sizes(2.5)};
  top: 0;
  width: 280px;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${sizes(4)};
  padding: ${({ hasChannels }) => (hasChannels ? sizes(3) : `0 ${sizes(3)} ${sizes(3)}`)};
  transform: translateY(${({ isActive }) => (isActive ? `${TOP_NAVBAR_HEIGHT}px` : '-100%')});
  background-color: ${colors.gray[800]};
  transition: transform ${transitions.timings.regular} ${transitions.easing};
  z-index: ${zIndex.nearOverlay};
  @media screen and (min-width: ${breakpoints.medium}) {
    width: 328px;
  }
  ${ChannelInfoContainer} {
    padding: ${sizes(2)};
    padding-right: ${sizes(4)};
  }
  ${StyledAvatar} {
    margin-left: 0;
  }
  ${TextContainer} {
    @media screen and (min-width: ${breakpoints.medium}) {
      width: 200px;
    }
  }
`
