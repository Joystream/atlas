import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { media, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import { Avatar, Text, Placeholder } from '@/shared/components'
import TopbarBase from '../TopbarBase'
import { TOP_NAVBAR_HEIGHT } from '../TopbarBase.style'

type CommonStudioTopbarProps = {
  isActive?: boolean
  hasChannels?: boolean
}

export const StyledTopbarBase = styled(TopbarBase)`
  ${media.small} {
    display: flex;
    justify-content: space-between;
  }
`

export const ChannelInfoContainer = styled.div<CommonStudioTopbarProps>`
  display: flex;
  align-items: center;
  background-color: ${({ isActive }) => isActive && colors.transparentPrimary[12]};
  &:hover {
    cursor: pointer;
    background-color: ${({ isActive }) => (isActive ? colors.transparentPrimary[12] : colors.transparentPrimary[20])};
  }
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};
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

      ${media.medium} {
        display: flex;
      }
    }
  }
`

export const NewChannelAvatar = styled(Avatar)`
  margin: 0 ${sizes(4)} 0 ${sizes(5)};
`

export const MemberInfoContainer = styled.div<CommonStudioTopbarProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  border-top: ${({ hasChannels }) => hasChannels && `1px solid ${colors.transparentWhite[18]}`};
`
export const MemberInnerContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${sizes(6)} ${sizes(2)};
`

export const MemberTextContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

export const MemberTitleText = styled(Text)`
  background-color: ${colors.transparentPrimary[20]};
  color: ${colors.gray[50]};
  padding: ${sizes(0.5)} ${sizes(1)};
  margin-left: ${sizes(3)};
`

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${colors.white};
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
  background-color: ${colors.gray[800]};
  border-radius: 100%;
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
  background-color: ${colors.gray[700]};
  transition: transform ${transitions.timings.regular} ${transitions.easing};
  z-index: ${zIndex.nearOverlay};

  ${media.medium} {
    width: 328px;
  }
  ${ChannelInfoContainer} {
    padding: ${sizes(2)};
  }
  ${StyledAvatar} {
    margin-left: 0;
  }
  ${TextContainer} {
    ${media.medium} {
      width: 200px;
    }
  }
`

export const AvatarPlaceholder = styled(Placeholder)`
  border-radius: 100%;
  width: 42px;
  height: 42px;
  margin-left: ${sizes(5)};
  margin-right: ${sizes(2.5)};
`

export const GlyphCheckContainer = styled.div`
  width: ${sizes(6)};
  height: ${sizes(6)};
  display: flex;
  justify-content: center;
  align-items: center;
`
