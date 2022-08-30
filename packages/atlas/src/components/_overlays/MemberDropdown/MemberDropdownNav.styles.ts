import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { animated } from 'react-spring'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { cVar, sizes } from '@/styles'

import { SectionContainer } from './MemberDropdown.styles'

const paddingStyles = css`
  padding: ${sizes(6)} ${sizes(4)};
`

export const BlurredBG = styled.div<{ memberUrl?: string | null; channelUrl?: string | null; isChannel?: boolean }>`
  position: relative;
  width: 280px;
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
  background: ${cVar('colorBackgroundOverlay')};
  width: 280px;
  height: 100%;
`

export const MemberInfoContainer = styled.div`
  position: relative;
  ${paddingStyles}

  border-bottom: 1px solid ${cVar('colorBorderMutedAlpha')};
`

export const AvatarsGroupContainer = styled.div`
  display: grid;
  justify-content: start;
  grid-template-columns: auto auto;
  gap: ${sizes(4)};
  margin-bottom: ${sizes(6)};
`

export const AvatarWrapper = styled.div`
  position: relative;
`

export const StyledAvatar = styled(Avatar)<{ isDisabled: boolean }>`
  width: 40px;
  height: 40px;
  clip-path: path(
    'm 40 0 h -40 v 40 h 20.5041 c -0.3291 -1.2785 -0.5041 -2.6188 -0.5041 -4 c 0 -8.8366 7.1634 -16 16 -16 c 1.3812 0 2.7215 0.175 4 0.5041 v -20.5041 z'
  );
  opacity: ${({ isDisabled }) => (isDisabled ? 0.25 : 1)};
  transition: opacity ${cVar('animationTransitionMedium')};
`

export const AddAvatar = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${cVar('colorBackgroundAlpha')};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledIconWrapper = styled(IconWrapper)`
  position: absolute;
  right: -8px;
  bottom: -8px;
`

type FixedSizeContainerProps = {
  height?: number | string
  width?: number | string
}
export const FixedSizeContainer = styled.div<FixedSizeContainerProps>`
  height: ${({ height }) => (height ? (typeof height === 'number' ? `${height}px` : height) : 'unset')};
  width: ${({ width }) => (width ? (typeof width === 'number' ? `${width}px` : width) : 'unset')};
`

export const UserBalance = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  gap: 5px;
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

export const AnimatedTextLink = styled(animated(TextLink))``

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
`

export const ChannelsSectionTitle = styled(Text)`
  padding: ${sizes(2)} ${sizes(4)};
  display: block;
`
