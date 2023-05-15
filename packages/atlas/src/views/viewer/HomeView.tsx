import styled from '@emotion/styled'
import { FC } from 'react'

import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { GetBasicVideosConnectionDocument } from '@/api/queries/__generated__/videos.generated'
import { Section } from '@/components/Section/Section'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { publicVideoFilter } from '@/config/contentFilter'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useInfiniteVideoGrid } from '@/hooks/useInfiniteVideoGrid'
import { DEFAULT_VIDEO_GRID, sizes } from '@/styles'

export const HomeView: FC = () => {
  const headTags = useHeadTags()
  const { columns, fetchMore, pageInfo, tiles } = useInfiniteVideoGrid({
    query: GetBasicVideosConnectionDocument,
    variables: {
      // limit: 200,
      where: publicVideoFilter,
      orderBy: VideoOrderByInput.VideoRelevanceDesc,
    },
  })

  return (
    <VideoContentTemplate>
      {headTags}
      <StyledSection
        contentProps={{
          type: 'grid',
          grid: DEFAULT_VIDEO_GRID,
          children: tiles?.map((video, idx) => <VideoTileViewer id={video.id} key={idx} />),
        }}
        footerProps={{
          reachedEnd: !pageInfo?.hasNextPage,
          fetchMore: async () => {
            if (pageInfo?.hasNextPage) {
              await fetchMore({
                variables: { first: columns * 4, after: pageInfo.endCursor },
              })
            }
            return
          },
          type: 'infinite',
        }}
      />
    </VideoContentTemplate>
  )
}

const StyledSection = styled(Section)`
  padding: ${sizes(8)} 0;
`
