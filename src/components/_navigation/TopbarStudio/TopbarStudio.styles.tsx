import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { colors, media, sizes, transitions, typography, zIndex } from '@/theme'

import { TopbarBase } from '../TopbarBase'

type CommonStudioTopbarProps = {
  isActive?: boolean
  hasChannels?: boolean
}

export const StyledTopbarBase = styled(TopbarBase)`
  ${media.sm} {
    display: flex;
    justify-content: space-between;
  }
`

export const ChannelInfoContainer = styled.div<CommonStudioTopbarProps>`
  display: flex;
  align-items: center;
  background-color: ${({ isActive }) => isActive && colors.transparentPrimary[10]};

  &:hover {
    cursor: pointer;
    background-color: ${({ isActive }) => (isActive ? colors.transparentPrimary[10] : colors.transparentPrimary[18])};
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
`

export const StyledChannelInfoText = styled(Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

      ${media.md} {
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
  border-top: ${({ hasChannels }) => hasChannels && `1px solid ${colors.transparentPrimary[18]}`};
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

export const DrawerMemberText = styled(Text)`
  max-width: 140px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  ${media.md} {
    max-width: 160px;
  }
`

export const DrawerMemberTitleText = styled(Text)`
  background-color: ${colors.transparentPrimary[18]};
  color: ${colors.gray[50]};
  padding: ${sizes(0.5)} ${sizes(1)};
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
  transform: translateY(${({ isActive }) => (isActive ? 'var(--size-topbar-height)' : '-100%')});
  background-color: ${colors.gray[700]};
  transition: transform ${transitions.timings.regular} ${transitions.easing};
  z-index: ${zIndex.nearOverlay};

  ${media.md} {
    width: 328px;
  }
  ${ChannelInfoContainer} {
    padding: ${sizes(2)};
  }
  ${StyledAvatar} {
    margin-left: 0;
  }
  ${TextContainer} {
    ${media.md} {
      width: 200px;
    }
  }
`

export const DrawerChannelsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: ${sizes(4)};
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
`

export const AvatarSkeletonLoader = styled(SkeletonLoader)`
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
