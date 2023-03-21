import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const InformationContainer = styled.div`
  width: calc(100% + 1px);
  display: flex;
  align-items: end;
  transition: all ${cVar('animationTransitionMedium')};
  margin-top: ${sizes(4)};
  margin-bottom: ${sizes(8)};
  z-index: 12;

  ${media.sm} {
    position: absolute;
    margin-top: 0;
    opacity: 0.25;
    padding: 0 100px 0 ${sizes(8)};
  }
`

export const Container = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  justify-content: end;

  ::after {
    ${media.sm} {
      content: '';
      position: absolute;
      inset: 50% 0 0 0;
      margin-top: 0;

      ${(props) =>
        props.isActive &&
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
          border-bottom: 32px solid ${cVar('colorCoreNeutral700Darken')};
        `}
    }
  }

  :hover {
    ${InformationContainer} {
      opacity: 1;
    }
  }
`

export const VideoContainer = styled.div`
  position: relative;
  height: 325px;

  ${media.sm} {
    min-height: 340px;
  }

  ${media.md} {
    min-height: 410px;
  }

  ${media.lg} {
    min-height: 610px;
  }

  ${media.xl} {
    min-height: 660px;
  }

  ${media.xxl} {
    min-height: 830px;
  }
`

export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(4)};
`

export const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: ${sizes(4)};
  column-gap: ${sizes(6)};

  * > {
    flex: 1;
  }
`

export const ShadeBox = styled.div`
  width: calc(100% + 1px);
  height: 32px;
  opacity: 0.25;

  :hover {
    opacity: 1;
  }
`
