import { FC } from 'react'

import { GetMostViewedVideosConnectionDocument } from '@/api/queries/__generated__/videos.generated'
import { Section } from '@/components/Section/Section'
import { TopTenVideos } from '@/components/_content/TopTenVideos'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useInfiniteVideoGrid } from '@/hooks/useInfiniteVideoGrid'
import { DEFAULT_VIDEO_GRID } from '@/styles/grids'

import { StyledLimidtedWidth } from './PopularView.styles'

export const PopularView: FC = () => {
  const headTags = useHeadTags('Popular')

  const { columns, fetchMore, pageInfo, tiles } = useInfiniteVideoGrid({
    query: GetMostViewedVideosConnectionDocument,
    variables: {
      limit: 200,
    },
  })

  const children = tiles?.map((video, idx) => <VideoTileViewer id={video.id} key={idx} />)

  return (
    <StyledLimidtedWidth big>
      {headTags}
      <TopTenVideos period="month" />
      <Section
        headerProps={{
          start: {
            type: 'title',
            title: 'Popular videos',
          },
        }}
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
            return
          },
          type: 'infinite',
        }}
      />
    </StyledLimidtedWidth>
  )
}
