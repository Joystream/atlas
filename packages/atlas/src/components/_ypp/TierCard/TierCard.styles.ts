import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes, square } from '@/styles'

export const Wrapper = styled.div<{ isDiamond: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${sizes(2)};
  gap: ${sizes(4)};
  background-color: ${cVar('colorBackgroundStrong')};
  border-radius: ${cVar('radiusLarge')};
  width: 100%;
  border: ${(props) => (props.isDiamond ? '1px solid #2EEAD0' : 'none')};
`

export const RewardWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(2)};
  gap: ${sizes(2)};
  border-radius: ${cVar('radiusMedium')};
  background-color: ${cVar('colorBackgroundMutedAlpha')};
`
const pulse = keyframes`
  0% {
    transform: translateX(0) rotate(21.56deg);
  }
  
  16% {
    transform: translateX(1000px) rotate(21.56deg);
  }
  
  100% {
    transform: translateX(1000px) rotate(21.56deg);
  }
`
export const TierBanner = styled.div<{ tier: 'bronze' | 'silver' | 'gold' | 'diamond' }>`
  width: 100%;
  height: 80px;
  border-radius: ${cVar('radiusMedium')};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: ${sizes(2.5)};
  background: ${(props) => {
    switch (props.tier) {
      case 'diamond':
        return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #0FD4B9 0%, #49C9B9 67.19%, #2CAD9F 100%)'
      case 'gold':
        return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C68F00 0%, #DCAA00 67.19%, #EEC117 100%)'
      case 'silver':
        return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C5C7C3 0%, #817D78 67.19%, #615D6A 100%)'
      default:
      case 'bronze':
        return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C77D6E 0%, #834C3F 67.19%, #603930 100%)'
    }
  }};
  text-shadow: 0 1px 4px rgb(0 0 0 / 0.25);

  > div {
    align-self: center;
    z-index: 10;
  }

  svg {
    ${square(36)}
  }

  ::before {
    content: ' ';
    position: absolute;
    inset: 0;
    opacity: 0.3;
    background: ${(props) => {
      switch (props.tier) {
        case 'diamond':
          return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #0FD4B9 0%, #49C9B9 67.19%, #2CAD9F 100%)'
        case 'gold':
          return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C68F00 0%, #DCAA00 67.19%, #EEC117 100%)'
        case 'silver':
          return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C5C7C3 0%, #817D78 67.19%, #615D6A 100%)'
        default:
        case 'bronze':
          return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C77D6E 0%, #834C3F 67.19%, #603930 100%)'
      }
    }};
    filter: url(#noise);
  }

  ${(props) =>
    props.tier === 'diamond' &&
    css`
      ::after {
        content: ' ';
        width: 48px;
        height: 150px;
        top: -42px;
        left: -150px;
        filter: blur(2px);
        transform: rotate(21.56deg);
        position: absolute;
        background: rgb(39 233 206 / 0.5);
        animation: ${pulse} 8.5s ease-out infinite;
      }
    `}
`
