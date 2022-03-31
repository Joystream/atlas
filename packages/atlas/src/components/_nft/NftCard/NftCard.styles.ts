import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

const shinyStyles = ({ opacity, gradientPos, sparkPos }: ContainerProps) => css`
  --color1: #efb2fb;
  --color2: #acc6f8;

  width: 61vw;
  height: 75vw;
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
  background-image: var(--front);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  transform-origin: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-repeat: no-repeat;
    opacity: 0.5;
    mix-blend-mode: color-dodge;
    transition: all 0.33s ease;
  }

  &::before {
    background-position: 50% 50%;
    background-size: 300% 300%;
    background-image: linear-gradient(
      115deg,
      transparent 0%,
      var(--color1) 25%,
      transparent 47%,
      transparent 53%,
      var(--color2) 75%,
      transparent 100%
    );
    opacity: 0.5;
    filter: brightness(0.5) contrast(1);
    z-index: 1;
  }

  &::after {
    /* background-image: url('https://assets.codepen.io/13471/sparkles.gif'), url(https://assets.codepen.io/13471/holo.png),
      linear-gradient(125deg, #ff008450 15%, #fca40040 30%, #ffff0030 40%, #00ff8a20 60%, #00cfff40 70%, #cc4cfa50 85%); */

    /* pattern */
    background-image: url('https://i.imgur.com/Y9uPQ9n.png');
    background-image: url('https://i.imgur.com/uPpc6dE.png');
    background-position: 50% 50%;
    background-size: 120%;

    /* background-blend-mode: overlay; */
    z-index: 20;
    filter: brightness(0.31) contrast(0.31);
    transition: all 0.33s ease;
    mix-blend-mode: color-dodge;
    opacity: 0;

    /* mask-image: url(https://i.imgur.com/uPpc6dE.png); */
    mask-mode: alpha;
    mask-repeat: no-repeat;
    mask-size: 100%;
    mask-position: center;
  }

  &:hover::after {
    filter: brightness(0.51) contrast(0.251);
    opacity: ${opacity || 1};
    background-position: ${sparkPos};
  }

  &:hover {
    animation: none;
    transition: box-shadow 0.1s ease-out;
  }

  /* &:hover::before {
    animation: none;
    background-image: linear-gradient(110deg, transparent 25%, var(--color1) 48%, var(--color2) 52%, transparent 75%),
      url('https://i.imgur.com/AjBArhU.png');
    background-position: 50% 50%;
    background-size: 500% 500%;
    opacity: 0.88;
    filter: brightness(0.66) contrast(1.33);
    transition: none;
    background-position: ${gradientPos};
  } */

  &:hover::before,
  &:hover::after {
    animation: none;
    transition: none;
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

  @keyframes holoCard {
    0%,
    100% {
      transform: rotateZ(0deg) rotateX(0deg) rotateY(0deg);
    }

    5%,
    8% {
      transform: rotateZ(0deg) rotateX(6deg) rotateY(-20deg);
    }

    13%,
    16% {
      transform: rotateZ(0deg) rotateX(-9deg) rotateY(32deg);
    }

    35%,
    38% {
      transform: rotateZ(3deg) rotateX(12deg) rotateY(20deg);
    }

    55% {
      transform: rotateZ(-3deg) rotateX(-12deg) rotateY(-27deg);
    }
  }
`

type ContainerProps = { fullWidth?: boolean; opacity: number; gradientPos: string; sparkPos: string }
export const Container = styled.div<ContainerProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '360px')};
  background-color: ${cVar('colorBackgroundStrong')};

  ${shinyStyles}
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
