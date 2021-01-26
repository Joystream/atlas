import React from 'react'
import styled from '@emotion/styled'
import { RouteComponentProps } from '@reach/router'
import { ErrorBoundary } from '@sentry/react'

import { ErrorFallback, CoverVideo, InfiniteVideoGrid, VideoGallery } from '@/components'
import { useNewestVideos } from '@/api/hooks'

const HomeView: React.FC<RouteComponentProps> = () => {
  const {
    loading: newestVideosLoading,
    data: newestVideos,
    error: newestVideosError,
    newestVideosCount,
    refetch: refetchNewestVideos,
  } = useNewestVideos()

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
          <StyledInfiniteVideoGrid title="More videos" skipCount={newestVideosCount} />
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
