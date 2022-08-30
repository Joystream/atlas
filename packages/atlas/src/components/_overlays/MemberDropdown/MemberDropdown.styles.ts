import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { cVar, media, sizes, zIndex } from '@/styles'

const paddingStyles = css`
  padding: ${sizes(6)} ${sizes(4)};
`

export const Container = styled.div`
  position: fixed;
  right: ${sizes(4)};
  top: 0;
  width: 280px;
  height: 0;
  z-index: ${zIndex.nearTransactionBar};

  ${media.md} {
    right: ${sizes(8)};
  }
`

export const LIST_TRANSITION = 'list-transition'

export const MEMBER_CHANNEL_TRANSITION = 'member-channel-transition'

export const MemberHandleTransitionContainer = styled.div<{ slideDirection: 'right' | 'left' }>`
  transition: opacity ${cVar('animationTransitionMedium')}, transform ${cVar('animationTransitionMedium')};

  &.${MEMBER_CHANNEL_TRANSITION}-enter {
    opacity: 0;
    transform: translateX(${({ slideDirection }) => (slideDirection === 'left' ? '280px' : '-280px')});
  }

  &.${MEMBER_CHANNEL_TRANSITION}-enter-active {
    opacity: 1;
    transform: translateX(20px);
  }

  &.${MEMBER_CHANNEL_TRANSITION}-exit {
    opacity: 1;
  }

  &.${MEMBER_CHANNEL_TRANSITION}-exit-active {
    opacity: 0;
    transform: translateX(${({ slideDirection }) => (slideDirection === 'left' ? '280px' : '-280px')});
  }
`

export const SectionContainer = styled.div`
  border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
  padding: ${sizes(2)} 0;
`

export const AnimatedSectionContainer = styled(SectionContainer)<{ slideDirection: 'right' | 'left' }>`
  border-top: unset;
  transition: opacity ${cVar('animationTransitionMedium')}, transform ${cVar('animationTransitionMedium')};

  &.${MEMBER_CHANNEL_TRANSITION}-enter {
    opacity: 0;
    transform: translateX(${({ slideDirection }) => (slideDirection === 'left' ? '280px' : '-280px')});
  }

  &.${MEMBER_CHANNEL_TRANSITION}-enter-active {
    opacity: 1;
    transform: translateX(0);
  }

  &.${MEMBER_CHANNEL_TRANSITION}-exit {
    opacity: 1;
  }

  &.${MEMBER_CHANNEL_TRANSITION}-exit-active {
    opacity: 0;
    transform: translateX(${({ slideDirection }) => (slideDirection === 'left' ? '280px' : '-280px')});
  }
`

export const SlideAnimationContainer = styled.div<{ slideDirection?: 'left' | 'right' }>`
  position: absolute;
  height: 100%;
  width: 280px;
  will-change: transform, opacity;
  overflow-x: hidden;
  transition: opacity ${cVar('animationTransitionMedium')}, transform ${cVar('animationTransitionMedium')};

  &.${MEMBER_CHANNEL_TRANSITION}-enter {
    ${() => Filter}::before, ${() => AnimatedTextLink} {
      opacity: 0;
    }
    ${MemberHandleTransitionContainer}, ${AnimatedSectionContainer} {
      opacity: 0;
      transform: translateX(${({ slideDirection }) => (slideDirection === 'left' ? '280px' : '-280px')});
    }
  }

  &.${MEMBER_CHANNEL_TRANSITION}-enter-active {
    ${() => Filter}::before, ${() => AnimatedTextLink} {
      opacity: 1;
    }
    ${MemberHandleTransitionContainer}, ${AnimatedSectionContainer} {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &.${MEMBER_CHANNEL_TRANSITION}-exit {
    opacity: 1;
  }

  &.${MEMBER_CHANNEL_TRANSITION}-exit-active {
    ${() => Filter}::before, ${() => AnimatedTextLink} {
      opacity: 0;
    }
    ${MemberHandleTransitionContainer}, ${AnimatedSectionContainer} {
      opacity: 0;
      transform: translateX(${({ slideDirection }) => (slideDirection === 'left' ? '280px' : '-280px')});
    }
  }
`

export const InnerContainer = styled.div<{
  isActive: boolean
  containerHeight: number
  slideDirection: 'left' | 'right'
}>`
  width: 280px;
  position: relative;
  max-height: calc(100vh - ${sizes(4)} - var(--size-topbar-height));
  height: ${({ containerHeight }) => containerHeight}px;
  transform: translateY(
    ${({ isActive, containerHeight }) =>
      isActive ? 'var(--size-topbar-height)' : `calc(-${containerHeight}px + var(--size-topbar-height)) `}
  );
  transition: transform ${cVar('animationTransitionMedium')}, height ${cVar('animationTransitionMedium')};
  will-change: height, transform;
  box-shadow: ${cVar('effectElevation24Layer2')}, ${cVar('effectElevation24Layer1')};
  border-radius: 0 0 ${cVar('radiusMedium')} ${cVar('radiusMedium')};
  background-color: ${cVar('colorBackgroundStrong')};
  overflow-y: auto;
  overflow-x: hidden;

  &.${LIST_TRANSITION}-enter {
    ${SlideAnimationContainer} {
      opacity: 0;
      transform: translateX(${({ slideDirection }) => (slideDirection === 'left' ? '280px' : '-280px')});
    }
  }

  &.${LIST_TRANSITION}-enter-active {
    ${SlideAnimationContainer} {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &.${LIST_TRANSITION}-exit {
    opacity: 1;
  }

  &.${LIST_TRANSITION}-exit-active {
    ${SlideAnimationContainer} {
      opacity: 0;
      transform: translateX(${({ slideDirection }) => (slideDirection === 'left' ? '280px' : '-280px')});
    }
  }
`

export const AvatarsGroupContainer = styled.div`
  display: grid;
  justify-content: start;
  grid-template-columns: auto auto;
  gap: ${sizes(4)};
`

export const AvatarWrapper = styled.div`
  position: relative;
`

export const StyledIconWrapper = styled(IconWrapper)`
  position: absolute;
  right: -8px;
  bottom: -8px;
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

export const BlurredBG = styled.div<{ url?: string | null }>`
  position: relative;
  width: 280px;
  height: 100%;

  &::before {
    transition: opacity ${cVar('animationTransitionMedium')};
    position: absolute;
    width: inherit;
    height: inherit;
    background-image: url(${({ url }) => url});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    content: '';
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
  display: grid;
  gap: ${sizes(4)};
  ${paddingStyles}

  border-bottom: 1px solid ${cVar('colorBorderMutedAlpha')};
`

export const MemberHandleText = styled(Text)`
  word-break: break-word;
`

export const ChannelsSectionTitle = styled(Text)`
  padding: ${sizes(2)} ${sizes(4)};
  display: block;
`

export const SwitchMemberItemListContainer = styled.div`
  padding: ${sizes(2)} 0;
`

export const UserBalance = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  gap: 5px;
  margin-top: ${sizes(2)};
`

export const BalanceContainer = styled.div`
  margin-top: ${sizes(1)};
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  gap: 8px;
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

export const AnimatedTextLink = styled(TextLink)`
  transition: opacity ${cVar('animationTransitionMedium')};

  &.${MEMBER_CHANNEL_TRANSITION}-enter {
    opacity: 0;
  }

  &.${MEMBER_CHANNEL_TRANSITION}-enter-active {
    opacity: 1;
  }

  &.${MEMBER_CHANNEL_TRANSITION}-exit {
    opacity: 1;
  }

  &.${MEMBER_CHANNEL_TRANSITION}-exit-active {
    opacity: 0;
  }
`
