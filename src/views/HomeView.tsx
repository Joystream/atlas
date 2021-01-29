import React from 'react'
import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { ErrorFallback, CoverVideo, InfiniteVideoGrid, VideoGallery } from '@/components'
import useVideosConnection from '@/api/hooks/videosConnection'
import { VideoOrderByInput } from '@/api/queries'
import InterruptedVideosGallery from '@/components/InterruptedVideosGallery'

import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'
import { SIDENAVBAR_WIDTH } from '@/components/SideNavbar/SideNavbar.style'
import { breakpoints, transitions } from '@/shared/theme'

const NEWEST_VIDEOS_COUNT = 8

const HomeView: React.FC = () => {
  const {
    loading: newestVideosLoading,
    videosConnection,
    error: newestVideosError,
    refetch: refetchNewestVideos,
  } = useVideosConnection({ first: 8, orderBy: VideoOrderByInput.CreatedAtDesc })

  const newestVideos = videosConnection?.edges.slice(0, NEWEST_VIDEOS_COUNT).map((e) => e.node)

  const hasNewestVideosError = newestVideosError && !newestVideosLoading

  return (
    <StyledViewContainer>
      <CoverVideo />
<<<<<<< HEAD
      <Container>
        <InterruptedVideosGallery />
=======
      <Container className={transitions.names.slide}>
>>>>>>> 0eaf57b (fix transition fade out on exit and slide up on enter)
        {!hasNewestVideosError ? (
          <VideoGallery title="Newest videos" loading={newestVideosLoading} videos={newestVideos} />
        ) : (
          <ErrorFallback error={newestVideosError} resetError={() => refetchNewestVideos()} />
        )}

        <ErrorBoundary fallback={ErrorFallback}>
          <StyledInfiniteVideoGrid title="More videos" skipCount={NEWEST_VIDEOS_COUNT} />
        </ErrorBoundary>
      </Container>
    </StyledViewContainer>
  )
}

export const StyledViewContainer = styled.div`
  position: absolute;
  top: ${TOP_NAVBAR_HEIGHT}px;
  left: 0;
  right: var(--global-horizontal-padding);
  padding-left: var(--global-horizontal-padding);
  @media screen and (min-width: ${breakpoints.medium}) {
    left: ${SIDENAVBAR_WIDTH}px;
  }
`

export const Container = styled.div`
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
