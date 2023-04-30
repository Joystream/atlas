import styled from '@emotion/styled'
import { FC } from 'react'

import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { GetBasicVideosConnectionDocument } from '@/api/queries/__generated__/videos.generated'
import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { useHeadTags } from '@/hooks/useHeadTags'
import { sizes, transitions } from '@/styles'

export const HomeView: FC = () => {
  const headTags = useHeadTags()

  return (
    <VideoContentTemplate>
      {headTags}
      <Container className={transitions.names.slide}>
        <InfiniteVideoGrid
          orderBy={[
            VideoOrderByInput.VideoRelevanceDesc,
            VideoOrderByInput.CreatedAtDesc,
            VideoOrderByInput.ViewsNumDesc,
          ]}
          query={GetBasicVideosConnectionDocument}
        />
      </Container>
    </VideoContentTemplate>
  )
}

const Container = styled.div`
  position: relative;
  padding: ${sizes(8)} 0;

  > section {
    :not(:first-of-type) {
      margin-top: ${sizes(32)};
    }
  }
`
