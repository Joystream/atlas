import { css } from '@emotion/react'
import styled from '@emotion/styled'

type ContainerProps = {
  fullWidth?: boolean
}

const shinyStyles = () => css`
  --color1: #efb2fb;
  --color2: #acc6f8;

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
    opacity: 1;
    background-image: url('https://assets.codepen.io/13471/sparkles.gif'), url(https://assets.codepen.io/13471/holo.png),
      linear-gradient(125deg, #ff008450 15%, #fca40040 30%, #ffff0030 40%, #00ff8a20 60%, #00cfff40 70%, #cc4cfa50 85%);
    background-position: 50% 50%;
    background-size: 160%;
    background-blend-mode: overlay;
    z-index: 2;
    filter: brightness(1) contrast(1);
    transition: all 0.33s ease;
    mix-blend-mode: color-dodge;
    opacity: 0.75;
  }

  /* active aswell */

  &:hover::after {
    filter: brightness(1) contrast(1);
    opacity: 1;
  }

  &:hover {
    animation: none;
    transition: box-shadow 0.1s ease-out;
  }

  &:hover::before {
    animation: none;
    background-image: linear-gradient(110deg, transparent 25%, var(--color1) 48%, var(--color2) 52%, transparent 75%);
    background-position: 50% 50%;
    background-size: 250% 250%;
    opacity: 0.88;
    filter: brightness(0.66) contrast(1.33);
    transition: none;
  }

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

export const Container = styled.div<ContainerProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '320px')};

  ${shinyStyles}
`
