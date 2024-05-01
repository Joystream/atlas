import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { cVar, media, sizes } from '@/styles'

export const InformationContainer = styled.div<{ isPaused: boolean }>`
  width: 100%;
  display: flex;
  align-items: end;
  transition: all ${cVar('animationTransitionMedium')};
  margin-top: ${sizes(4)};
  z-index: 12;

  ${media.sm} {
    width: fit-content;
    max-width: 90%;
    position: absolute;
    margin: 0;
    opacity: ${({ isPaused }) => (isPaused ? 1 : 0.25)};
    inset: auto auto 40px 32px;
  }
`

export const Container = styled.div`
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
  width: 100%;
`

export const StatsContainer = styled.div`
  display: grid;
  width: 100%;
  grid-gap: ${sizes(4)};
  grid-template-columns: 1fr 1fr;

  ${media.sm} {
    display: flex;
    flex-wrap: wrap;
    row-gap: ${sizes(4)};
    column-gap: ${sizes(8)};

    * > {
      flex: 1;
    }
  }
`

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`
