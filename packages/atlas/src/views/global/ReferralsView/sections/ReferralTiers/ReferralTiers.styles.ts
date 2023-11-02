import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { AvatarSize } from '@/components/Avatar'
import { media, sizes, square } from '@/styles'

export const TiersGraphicWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 2fr 1fr 2fr;
  gap: 0;
  height: 100%;
  width: 75%;
  margin: 0 auto ${sizes(4)} auto;
  align-items: center;
  align-content: center;
`

export const StyledSideLine = styled.div<{ isRight?: boolean }>`
  display: flex;
  align-items: center;
  width: 90%;
  margin: 64px auto 0;
  position: relative;
  padding: 66px 2em;
  box-sizing: border-box;
  background: #000;
  background-clip: padding-box;
  border: solid 2px transparent;
  border-radius: ${({ isRight }) => `${isRight ? '0 40px 0 0' : '40px 0 0 0'}`};
  grid-row: 1 / 3;
  grid-column: ${({ isRight }) => `${isRight ? '3 / 4' : '1 / 2'}`};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: ${({ isRight }) => `${isRight ? '0' : '20px'}`};
    bottom: 20px;
    left: ${({ isRight }) => `${isRight ? '20px' : '0'}`};
    z-index: -1;
    margin: -2px;
    border-radius: inherit;
    background: ${({ isRight }) =>
      `linear-gradient(${
        isRight ? '120' : '240'
      }deg, rgba(0 125 255 1) 0%, #007dff 31%, #afd5fc 90%, rgba(175 213 252 0) 100%) `};
  }
`

export const AvatarWrapper = styled.div<{ size: AvatarSize }>`
  ${({ size }) => square(`${size}px`)};

  border-radius: 100%;
  margin: auto;
  z-index: 2;
  box-shadow: 0 0 80px 10px rgba(2 127 255 1);
`

const rot = keyframes`
  0% {
        background-position: 0 100%;
  }
  80% {
        background-position: 0 100%; 
  }
  100% {
        background-position: 0 -20%; 
  }
`

export const StyledVertLine = styled.div`
  width: 2px;
  height: 76px;
  background: linear-gradient(
    rgba(0 125 255 0) 0%,
    rgba(0 125 255 1) 25%,
    rgba(175 213 252 1) 50%,
    rgba(175 213 252 0) 75%,
    rgba(175 213 252 0) 100%
  );
  background-size: 400% 400%;
  margin: 10px auto 0;
  animation: ${rot} 3s linear infinite;
`

export const StyledTierCardsWrapper = styled.div`
  display: grid;
  width: 100%;
  justify-content: center;
  gap: ${sizes(4)};
  grid-template-columns: 1fr;

  ${media.sm} {
    grid-template-columns: 1fr 1fr;
  }

  ${media.md} {
    gap: ${sizes(6)};
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`
