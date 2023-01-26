import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { ColumnGapBlock } from '@/components/_layouts'
import { VideoListItem } from '@/components/_video/VideoListItem'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
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
  height: fit-content;
  background-color: ${cVar('colorCoreNeutral900')};

  > *:first-of-type {
    border-bottom: 1px solid ${cVar('colorBackgroundStrongAlpha')};
  }
`

export const DetailsWrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: ${sizes(6)};
  padding: ${sizes(6)};
  padding-bottom: ${sizes(12)};

  ${media.sm} {
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr;
  }

  ${media.md} {
    grid-auto-flow: row;
    grid-template-columns: 1fr;
  }
`

export const Thumbnail = styled.img`
  object-fit: contain;
  justify-self: center;
  max-width: 100%;
  max-height: 200px;
`

export const DetailsButtonsWrapper = styled(ColumnGapBlock)`
  padding-top: ${sizes(4)};
  flex-direction: column;

  ${media.xs} {
    gap: ${sizes(4)};
    flex-direction: row;
  }
`

export const StyledVideoListItem = styled(VideoListItem)`
  ${media.xs} {
    grid-template-rows: auto;
    grid-template-columns: max-content max-content;
  }
`

export const Counter = styled.div`
  border-radius: 50%;
  width: ${sizes(6)};
  min-width: ${sizes(6)};
  height: ${sizes(6)};
  min-height: ${sizes(6)};
  line-height: ${sizes(6)};
  display: grid;
  place-items: center;
  color: ${cVar('colorTextMuted')};
  background-color: ${cVar('colorBorderMutedAlpha')};
  margin-top: ${sizes(3)};

  ${media.xs} {
    margin-top: 0;
    align-self: center;
  }
`
export const StyledVideoTileViewer = styled(VideoTileViewer)`
  flex: 1;

  ${media.xs} {
    display: grid;
    grid-template-columns: minmax(160px, 197px) minmax(160px, 320px);
  }
`
