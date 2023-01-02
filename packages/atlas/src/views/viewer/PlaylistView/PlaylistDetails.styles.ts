import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { cVar, media, sizes } from '@/styles'

export const Wrapper = styled(LimitedWidthContainer)`
  display: grid;
  width: 100%;
  gap: ${sizes(6)};

  ${media.md} {
    grid-template-columns: 420px 1fr;
  }
`
export const InfoContainer = styled.div`
  background-color: ${cVar('colorCoreNeutral900')};

  > *:first-child {
    border-bottom: 1px solid ${cVar('colorBackgroundStrongAlpha')};
  }
`

export const DetailsWrapper = styled.div`
  display: grid;
  gap: ${sizes(6)};
  padding: ${sizes(6)};
  padding-bottom: ${sizes(12)};
`

export const Thumbnail = styled.img`
  object-fit: contain;
  justify-self: center;
  max-width: 100%;
  max-height: 200px;
`
