import React from 'react'
import styled from '@emotion/styled'
import { RouteComponentProps } from '@reach/router'
import { ErrorBoundary } from '@sentry/react'

import { ErrorFallback, CoverVideo, InfiniteVideoGrid, VideoGallery } from '@/components'
import useVideosConnection from '@/api/hooks/videosConnection'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'

const NEWEST_VIDEOS_COUNT = 8

const HomeView: React.FC<RouteComponentProps> = () => {
  const {
    loading: newestVideosLoading,
    videosConnection,
    error: newestVideosError,
    refetch: refetchNewestVideos,
  } = useVideosConnection({ first: 8, orderBy: VideoOrderByInput.CreatedAtDesc })

  const newestVideos = videosConnection?.edges.slice(0, NEWEST_VIDEOS_COUNT).map((e) => e.node)

  const hasNewestVideosError = newestVideosError && !newestVideosLoading

  return (
    <>
      <CoverVideo />
      <Container>
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
