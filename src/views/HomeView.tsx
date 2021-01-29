import React from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/client'
import { ErrorBoundary } from '@sentry/react'

import { ErrorFallback, CoverVideo, InfiniteVideoGrid, VideoGallery, InterruptedVideosGallery } from '@/components'
import { GET_NEWEST_VIDEOS } from '@/api/queries'
import { GetNewestVideos, GetNewestVideosVariables } from '@/api/queries/__generated__/GetNewestVideos'

const NEWEST_VIDEOS_COUNT = 8

const HomeView: React.FC = () => {
  const {
    loading: newestVideosLoading,
    data: videosData,
    error: newestVideosError,
    refetch: refetchNewestVideos,
  } = useQuery<GetNewestVideos, GetNewestVideosVariables>(GET_NEWEST_VIDEOS, {
    variables: { first: NEWEST_VIDEOS_COUNT },
    notifyOnNetworkStatusChange: true,
  })

  const newestVideos = videosData?.videosConnection.edges.slice(0, NEWEST_VIDEOS_COUNT).map((e) => e.node)

  const hasNewestVideosError = newestVideosError && !newestVideosLoading

  return (
    <>
      <CoverVideo />
      <Container>
        <InterruptedVideosGallery />
        {!hasNewestVideosError ? (
          <VideoGallery title="Newest videos" loading={newestVideosLoading} videos={newestVideos} />
        ) : (
          <ErrorFallback error={newestVideosError} resetError={() => refetchNewestVideos()} />
        )}

        <ErrorBoundary fallback={ErrorFallback}>
          <StyledInfiniteVideoGrid title="More videos" skipCount={NEWEST_VIDEOS_COUNT} />
        </ErrorBoundary>
      </Container>
    </>
  )
}

const Container = styled.div`
  position: relative;
  & > * {
    margin-bottom: 3rem;
  }
`

const StyledInfiniteVideoGrid = styled(InfiniteVideoGrid)`
  margin: 0;
  padding-bottom: 4rem;
`

export default HomeView
