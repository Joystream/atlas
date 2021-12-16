import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { media, oldColors, sizes, transitions } from '@/styles'

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
  background-color: ${({ isActive }) => isActive && oldColors.transparentPrimary[10]};

  &:hover {
    cursor: pointer;
    background-color: ${({ isActive }) =>
      isActive ? oldColors.transparentPrimary[10] : oldColors.transparentPrimary[18]};
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
      background-color: ${oldColors.transparent};
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
