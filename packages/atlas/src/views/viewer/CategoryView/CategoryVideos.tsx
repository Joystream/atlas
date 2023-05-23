import { FC, useRef } from 'react'

import {
  GetBasicVideosConnectionDocument,
  GetBasicVideosConnectionQuery,
} from '@/api/queries/__generated__/videos.generated'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Section } from '@/components/Section/Section'
import { Button } from '@/components/_buttons/Button'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { publicVideoFilter } from '@/config/contentFilter'
import { absoluteRoutes } from '@/config/routes'
import { useInfiniteVideoGrid } from '@/hooks/useInfiniteVideoGrid'
import { DEFAULT_VIDEO_GRID } from '@/styles'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

import { Container, FallbackContainer } from './CategoryVideos.styles'

type CategoryVideosProps = {
  categoriesId?: string[]
}

export const CategoryVideos: FC<CategoryVideosProps> = ({ categoriesId }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { tiles, pageInfo, fetchMore, columns } = useInfiniteVideoGrid<GetBasicVideosConnectionQuery>({
    query: GetBasicVideosConnectionDocument,
    variables: {
      where: {
        ...publicVideoFilter,
        category: {
          id_in: categoriesId,
        },
      },
    },
  })

  const children = tiles.length
    ? tiles?.map((video, idx) => <VideoTileViewer id={video.id} key={idx} />)
    : [
        <FallbackContainer key="fallback">
          <EmptyFallback
            title="No videos here for now"
            button={
              <Button variant="secondary" to={absoluteRoutes.viewer.discover()}>
                Go back to Discover page
              </Button>
            }
          />
        </FallbackContainer>,
      ]

  return (
    <Container ref={containerRef}>
      <Section
        contentProps={{
          children: children,
          type: 'grid',
          grid: DEFAULT_VIDEO_GRID,
        }}
        footerProps={{
          reachedEnd: !pageInfo?.hasNextPage,
          fetchMore: async () => {
            if (pageInfo?.hasNextPage) {
              await fetchMore({
                variables: { first: columns * 4, after: pageInfo.endCursor },
              })
            }
          },
          type: 'infinite',
          loadingTriggerOffset: InfiniteLoadingOffsets.VideoTile,
        }}
      />
    </Container>
  )
}
