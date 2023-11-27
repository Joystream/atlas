import styled from '@emotion/styled'
import { animated } from 'react-spring'

import { Avatar } from '@/components/Avatar'
import { smallBadgeStyles } from '@/components/Badge'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

import { SectionContainer } from './MemberDropdown.styles'

export const MemberInfoAndBgWrapper = styled.div`
  position: relative;
  width: 280px;
`

export const BlurredBG = styled.div<{ memberUrl?: string | null; channelUrl?: string | null; isChannel?: boolean }>`
  position: absolute;
  z-index: -1;
  top: 0;
  width: 100%;
  height: 100%;

  &::before,
  &::after {
    z-index: -1;
    top: 0;
    left: 0;
    position: absolute;
    width: inherit;
    height: inherit;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    content: '';
    background-color: ${cVar('colorCoreNeutral500')};
  }

  &::before {
    background-image: url(${({ channelUrl }) => channelUrl});
  }

  &::after {
    opacity: ${({ isChannel }) => (isChannel ? 0 : 1)};
    transition: opacity ${cVar('animationTransitionMedium')};
    background-image: url(${({ memberUrl }) => memberUrl});
  }
`

export const Filter = styled.div`
  position: absolute;
  backdrop-filter: blur(32px);
  background-color: ${cVar('colorBackgroundOverlay')};
  width: 280px;
  height: 100%;
`

export const MemberInfoContainer = styled.div`
  position: relative;
  border-bottom: 1px solid ${cVar('colorBorderMutedAlpha')};
  padding: ${sizes(4)};
`

export const AvatarContainer = styled.div`
  display: grid;
  justify-content: start;
  grid-template-columns: auto auto;
  gap: ${sizes(2)};
`

export const StyledAvatar = styled(Avatar)`
  width: 48px;
  height: 48px;
  transition: opacity ${cVar('animationTransitionMedium')};
`

type FixedSizeContainerProps = {
  height?: number | string
  width?: number | string
}
export const FixedSizeContainer = styled.div<FixedSizeContainerProps>`
  height: ${({ height }) => (height ? (typeof height === 'number' ? `${height}px` : height) : 'unset')};
  width: ${({ width }) => (width ? (typeof width === 'number' ? `${width}px` : width) : 'unset')};
`

export const AddressContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  border-radius: ${cVar('radiusSmall')};
  background-color: ${cVar('colorCoreNeutral800Lighten')};
  padding: ${sizes(2)};
  overflow: hidden;
  width: 100%;
  grid-column: 1/3;
  margin-top: ${sizes(2)};

  path {
    fill: ${cVar('colorText')};
  }

  svg {
    cursor: pointer;
  }
`

export const UserBalance = styled.div`
  display: flex;
  align-items: start;
  gap: ${sizes(1)};
  margin-top: ${sizes(2)};
`

export const Divider = styled.div`
  width: 1px;
  height: 16px;
  background: ${cVar('colorBorderMutedAlpha')};
`

export const TextLink = styled(Text)`
  text-decoration: none;
  cursor: pointer;
  display: flex;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-left: ${sizes(1)};

    path {
      fill: ${cVar('colorCoreNeutral200Lighten')};
    }
  }
`

export const BalanceContainer = styled.div`
  clear: both;
  margin-top: ${sizes(1)};
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  gap: 8px;
`

export const AnimatedSectionContainer = styled(animated(SectionContainer))`
  border-top: unset;
  width: 100%;
`

export const MemberHandleText = styled(Text)`
  word-break: break-word;
  display: block;
`

export const Badge = styled.div`
  position: relative;
  ${smallBadgeStyles};

  &[data-badge]::after {
    position: relative;
  }
`
