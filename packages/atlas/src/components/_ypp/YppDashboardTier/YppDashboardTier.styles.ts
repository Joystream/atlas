import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { cVar, sizes, square } from '@/styles'
import { YppChannelTierTypes } from '@/views/global/YppLandingView/YppLandingView.types'

export const SignInWrapper = styled.div`
  background-color: ${cVar('colorBackgroundAlpha')};
  border: 1px solid ${cVar('colorBorderAlpha')};
  display: grid;
  place-items: center;
  gap: ${sizes(1)};
  padding: ${sizes(3.5)};
  width: 100%;
  border-radius: ${cVar('radiusMedium')};

  svg {
    ${square(32)};

    path {
      fill: ${cVar('colorTextMuted')};
    }
  }

  :hover {
    cursor: pointer;
    background-color: ${cVar('colorBackgroundStrongAlpha')};

    svg {
      ${square(32)};

      path {
        fill: ${cVar('colorText')};
      }
    }
  }
`

export const VerificationWrapper = styled.div`
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  padding: ${sizes(6)};
  width: 100%;
  border-radius: ${cVar('radiusMedium')};

  svg {
    ${square(32)};

    path {
      fill: ${cVar('colorTextMuted')};
    }
  }
`

export const Wrapper = styled(FlexBox)`
  padding: ${sizes(6)};
  height: 100%;
  background-color: ${cVar('colorBackgroundMuted')};
`
export const shine = keyframes`
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

export const TierWrapper = styled(FlexBox)<{ tier: YppChannelTierTypes }>`
  border-radius: ${cVar('radiusMedium')};
  padding: ${sizes(4)};
  position: relative;
  overflow: hidden;

  > div {
    svg {
      ${square(42)};
    }

    .pill {
      background-color: rgb(10 28 41 / 0.52);
      padding: ${sizes(0.5)} ${sizes(1.5)};
      border-radius: ${cVar('radiusMedium')};
    }

    z-index: 10;
  }

  background: ${(props) => {
    switch (props.tier) {
      case 'Verified::Diamond':
        return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #0FD4B9 0%, #49C9B9 67.19%, #2CAD9F 100%)'
      case 'Verified::Gold':
        return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C68F00 0%, #DCAA00 67.19%, #EEC117 100%)'
      case 'Verified::Silver':
        return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C5C7C3 0%, #817D78 67.19%, #615D6A 100%)'
      default:
      case 'Verified::Bronze':
        return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C77D6E 0%, #834C3F 67.19%, #603930 100%)'
    }
  }};

  ::before {
    content: ' ';
    position: absolute;
    inset: 0;
    opacity: 0.3;
    background: ${(props) => {
      switch (props.tier) {
        case 'Verified::Diamond':
          return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #0FD4B9 0%, #49C9B9 67.19%, #2CAD9F 100%)'
        case 'Verified::Gold':
          return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C68F00 0%, #DCAA00 67.19%, #EEC117 100%)'
        case 'Verified::Silver':
          return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C5C7C3 0%, #817D78 67.19%, #615D6A 100%)'
        default:
        case 'Verified::Bronze':
          return 'radial-gradient(128.74% 56.2% at 50% 97.53%, #C77D6E 0%, #834C3F 67.19%, #603930 100%)'
      }
    }};
    filter: url(#noise);
  }

  ${(props) =>
    props.tier === 'Verified::Diamond' &&
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
        animation: ${shine} 8.5s ease-out infinite;
      }
    `}
`

export const SuspendedWrapper = styled.div`
  background-color: rgb(254 71 71 / 0.15);
  padding: ${sizes(6)};
  border: 1px dashed ${cVar('colorTextError')};
  width: 100%;
  border-radius: ${cVar('radiusMedium')};

  svg {
    ${square(32)};

    path {
      fill: ${cVar('colorTextError')};
    }
  }
`
