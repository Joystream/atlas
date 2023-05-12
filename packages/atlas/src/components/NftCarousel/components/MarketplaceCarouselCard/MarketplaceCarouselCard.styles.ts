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

  :hover {
    ${InformationContainer} {
      opacity: 1;
    }
  }
`

export const VideoContainer = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  width: 100%;
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
