import styled from '@emotion/styled'

import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { GetBasicVideosConnectionLightweightDocument } from '@/api/queries/__generated__/videos.generated'
import { Section } from '@/components/Section/Section'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { publicCryptoVideoFilter } from '@/config/contentFilter'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useInfiniteVideoGrid } from '@/hooks/useInfiniteVideoGrid'
import { DEFAULT_VIDEO_GRID, sizes } from '@/styles'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

export const CuratorHomepage = () => {
  const headTags = useHeadTags('Curator hompage')
  const { columns, fetchMore, pageInfo, tiles } = useInfiniteVideoGrid({
    query: GetBasicVideosConnectionLightweightDocument,
    variables: {
      where: publicCryptoVideoFilter,
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
          loadingTriggerOffset: InfiniteLoadingOffsets.VideoTile,
        }}
      />
    </VideoContentTemplate>
  )
}

const StyledSection = styled(Section)`
  padding: ${sizes(8)} 0;
`
