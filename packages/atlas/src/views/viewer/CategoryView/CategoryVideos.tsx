import { FC, useRef } from 'react'

import { useBasicVideosConnection } from '@/api/hooks/videosConnection'
import { Section } from '@/components/Section/Section'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { publicVideoFilter } from '@/config/contentFilter'
import { useBreakpointKey } from '@/hooks/useBreakPointKey'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { createPlaceholderData } from '@/utils/data'

import { Container } from './CategoryVideos.styles'

type CategoryVideosProps = {
  categoriesId?: string[]
}

const GRID = {
  xxs: {
    columns: 1,
  },
  xs: {
    columns: 1,
  },
  sm: {
    columns: 2,
  },
  md: {
    columns: 3,
  },
  lg: {
    columns: 4,
  },
  xl: {
    columns: 5,
  },
  xxl: {
    columns: 6,
  },
}

export const CategoryVideos: FC<CategoryVideosProps> = ({ categoriesId }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const rowsToLoad = useVideoGridRows('main')

  const breakPointKey = useBreakpointKey()

  const columns = (breakPointKey && GRID[breakPointKey].columns) ?? 0

  const { edges, fetchMore, pageInfo, loading, totalCount } = useBasicVideosConnection(
    {
      first: columns * rowsToLoad,
      where: {
        ...publicVideoFilter,
        category: {
          id_in: categoriesId,
        },
      },
    },
    { skip: !columns }
  )

  const loadedItemsCount = edges?.length ?? 0
  const allItemsLoaded = !pageInfo?.hasNextPage || false

  const firstLoad = !loadedItemsCount && loading
  const firstPlaceholders = firstLoad ? createPlaceholderData(columns * rowsToLoad) : []
  const displayedItems = edges?.map((edge) => edge.node) || []

  const itemsLeft = (totalCount || 0) - (edges?.length || 0)
  const itemsToLoad = Math.min(itemsLeft, columns)

  const newPlaceholders = allItemsLoaded ? [] : createPlaceholderData(itemsToLoad)

  const children = [...firstPlaceholders, ...displayedItems, ...newPlaceholders]?.map((video, idx) => (
    <VideoTileViewer id={video.id} key={idx} />
  ))

  return (
    <Container ref={containerRef}>
      <Section
        contentProps={{
          children,
          type: 'grid',
          grid: GRID,
        }}
        footerProps={{
          reachEnd: pageInfo?.hasNextPage,
          fetchMore: async () => {
            if (pageInfo?.hasNextPage) {
              await fetchMore({
                variables: { first: columns, after: pageInfo.endCursor },
              })
            }
            return
          },
          type: 'infinite',
        }}
      />
    </Container>
  )
}
