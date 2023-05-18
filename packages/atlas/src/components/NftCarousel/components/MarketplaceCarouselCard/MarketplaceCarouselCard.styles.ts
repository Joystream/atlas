import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const InformationContainer = styled.div`
  width: fit-content;
  display: flex;
  align-items: end;
  transition: all ${cVar('animationTransitionMedium')};
  margin-top: ${sizes(4)};
  margin-bottom: ${sizes(8)};
  z-index: 12;

  ${media.sm} {
    position: absolute;
    margin: 0;
    opacity: 0.25;
    inset: auto auto 40px 32px;
  }
`

export const Container = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  justify-content: end;

  :hover {
    ${InformationContainer} {
      opacity: 1;
    }
  }
`

export const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;

  ${media.sm} {
    aspect-ratio: 16/9;
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
