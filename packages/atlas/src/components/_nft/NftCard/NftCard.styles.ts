import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { animated } from 'react-spring'

import { Avatar } from '@/components/Avatar'
import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

const shinyStyles = ({ opacity, gradientPos, sparkPos, patternPos }: ContainerProps) => css``
type ContainerProps = {
  fullWidth?: boolean
  opacity: number
  gradientPos: string
  patternPos: string
  sparkPos: string
}

export const Container = styled(animated.div)<ContainerProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '360px')};

  --color1: #efb2fb;
  --color2: #acc6f8;

  /* width: 61vw;
  height: 75vw; */
  box-shadow: -7px -7px 10px -5px transparent, 7px 7px 10px -5px transparent, 0 0 5px 0 rgb(255 255 255 / 0),
    0 55px 35px -20px rgb(0 0 0 / 0.5);
  position: relative;
  overflow: hidden;
  margin: 20px;
  overflow: hidden;
  z-index: 10;
  touch-action: none;
  transition: transform 0.5s ease, box-shadow 0.2s ease;
  will-change: transform, filter;
  background-color: #040712;
  background-color: ${cVar('colorBackgroundStrong')};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  transform-origin: center;

  &:hover {
    animation: none;
    transition: box-shadow 0.1s ease-out;
  }

  @keyframes holoSparkle {
    0%,
    100% {
      opacity: 0.75;
      background-position: 50% 50%;
      filter: brightness(1.2) contrast(1.25);
    }

    5%,
    8% {
      opacity: 1;
      background-position: 40% 40%;
      filter: brightness(0.8) contrast(1.2);
    }

    13%,
    16% {
      opacity: 0.5;
      background-position: 50% 50%;
      filter: brightness(1.2) contrast(0.8);
    }

    35%,
    38% {
      opacity: 1;
      background-position: 60% 60%;
      filter: brightness(1) contrast(1);
    }

    55% {
      opacity: 0.33;
      background-position: 45% 45%;
      filter: brightness(1.2) contrast(1.25);
    }
  }

  @keyframes holoGradient {
    0%,
    100% {
      opacity: 0.5;
      background-position: 50% 50%;
      filter: brightness(0.5) contrast(1);
    }

    5%,
    9% {
      background-position: 100% 100%;
      opacity: 1;
      filter: brightness(0.75) contrast(1.25);
    }

    13%,
    17% {
      background-position: 0% 0%;
      opacity: 0.88;
    }

    35%,
    39% {
      background-position: 100% 100%;
      opacity: 1;
      filter: brightness(0.5) contrast(1);
    }

    55% {
      background-position: 0% 0%;
      opacity: 1;
      filter: brightness(0.75) contrast(1.25);
    }
  }

  /* ${shinyStyles} */
`

export const Title = styled(Text)`
  margin-bottom: ${sizes(4)};

  ${media.sm} {
    margin-bottom: ${sizes(6)};
  }
`

export const Details = styled.div`
  padding: ${sizes(4)};

  ${media.sm} {
    padding: ${sizes(6)};
  }
`

export const Content = styled.div`
  display: grid;

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const MembersWrapper = styled.div`
  padding: ${sizes(4)} 0;
  grid-column: 1 / span 2;

  &:last-of-type {
    padding-bottom: 0;
  }

  &:first-of-type {
    padding-top: 0;
    padding-bottom: 0;
  }

  ${media.sm} {
    grid-column: unset;

    &:nth-of-type(even) {
      border: 0;
      padding-top: 0;
      justify-self: flex-end;
    }
  }
`

export const Separator = styled.hr`
  grid-column: 1 / span 2;
  background-color: ${cVar('colorBorderMutedAlpha')};
  border: 0;
  height: 1px;
  width: 100%;
`

export const Caption = styled(Text)`
  display: block;
  margin-bottom: ${sizes(2)};
`

export const AvatarGroupWrapper = styled.div`
  display: flex;
  align-items: center;

  ${media.sm} {
    justify-content: flex-end;
  }
`

export const AvatarWrapper = styled.div`
  display: flex;
`

export const StyledAvatarGroup = styled(AvatarGroup)`
  margin-right: ${sizes(1)};
`

export const StyledAvatar = styled(Avatar)`
  margin-right: ${sizes(2)};
`

export const MemberName = styled(Text)`
  word-break: break-word;
`
