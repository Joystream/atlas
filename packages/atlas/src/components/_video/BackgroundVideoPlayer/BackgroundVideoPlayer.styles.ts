import isPropValid from '@emotion/is-prop-valid'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { cVar, media, sizes, zIndex } from '@/styles'

type VideoWrapperProps = {
  poster?: string
}
export const VideoWrapper = styled.div<VideoWrapperProps>`
  height: 0;
  overflow: hidden;
`

export const VideoPoster = styled.img`
  position: absolute;
  object-fit: cover;
  max-height: 100%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  :hover {
    & + span {
      opacity: 0;
    }
  }
`

export const StyledVideo = styled.video`
  position: absolute;
  object-fit: cover;
  max-height: 100%;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const ButtonBox = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: ${zIndex.modals};
  display: flex;
  gap: ${sizes(2)};

  ${media.sm} {
    bottom: 32px;
    right: 32px;
  }

  svg {
    filter: ${cVar('filterEffectElevation1Layer1')};
    height: 18px;
    width: 18px;
  }
`

// on Firefox there is a gap between fades, negative margin fixes that
export const StyledLink = styled(Link, { shouldForwardProp: isPropValid })<{ withFade?: boolean }>`
  ::after {
    content: '';
    position: absolute;
    inset: 50% 0 0 0;
    margin: 0 0 -2px;

    ${media.sm} {
      ${(props) =>
        props.withFade &&
        css`
          background: linear-gradient(
            180deg,
            rgb(7 8 8 / 0) 0%,
            rgb(7 8 8 / 0.0071) 11.79%,
            rgb(7 8 8 / 0.0276) 21.38%,
            rgb(7 8 8 / 0.0598) 29.12%,
            rgb(7 8 8 / 0.1026) 35.34%,
            rgb(7 8 8 / 0.1543) 40.37%,
            rgb(7 8 8 / 0.2135) 44.56%,
            rgb(7 8 8 / 0.2789) 48.24%,
            rgb(7 8 8 / 0.349) 51.76%,
            rgb(7 8 8 / 0.4222) 55.44%,
            rgb(7 8 8 / 0.4974) 59.63%,
            rgb(7 8 8 / 0.5729) 64.66%,
            rgb(7 8 8 / 0.6474) 70.88%,
            rgb(7 8 8 / 0.7193) 78.62%,
            rgb(7 8 8 / 0.7873) 88.21%,
            rgb(7 8 8 / 0.85) 100%
          );
          box-shadow: 0 32px 0 0 ${cVar('colorCoreNeutral700Darken')};
        `}
    }
  }
`
