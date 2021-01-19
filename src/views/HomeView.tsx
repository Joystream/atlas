import React from 'react'
import styled from '@emotion/styled'
import { RouteComponentProps } from '@reach/router'
import { useQuery } from '@apollo/client'
import { ErrorBoundary } from '@sentry/react'

import { ErrorFallback, CoverVideo, InfiniteVideoGrid, VideoGallery } from '@/components'
import { GET_FEATURED_VIDEOS, GET_NEWEST_VIDEOS } from '@/api/queries'
import { GetFeaturedVideos } from '@/api/queries/__generated__/GetFeaturedVideos'
import { GetNewestVideos, GetNewestVideosVariables } from '@/api/queries/__generated__/GetNewestVideos'

const NEWEST_VIDEOS_COUNT = 8

const HomeView: React.FC<RouteComponentProps> = () => {
  const {
    loading: newestVideosLoading,
    data: videosData,
    error: newestVideosError,
    refetch: refetchNewestVideos,
  } = useQuery<GetNewestVideos, GetNewestVideosVariables>(GET_NEWEST_VIDEOS, {
    variables: { first: NEWEST_VIDEOS_COUNT },
    notifyOnNetworkStatusChange: true,
  })
  const {
    loading: featuredVideosLoading,
    data: featuredVideosData,
    error: featuredVideosError,
    refetch: refetchFeaturedVideos,
  } = useQuery<GetFeaturedVideos>(GET_FEATURED_VIDEOS, {
    notifyOnNetworkStatusChange: true,
  })

  const newestVideos = videosData?.videosConnection.edges.slice(0, NEWEST_VIDEOS_COUNT).map((e) => e.node)
  const featuredVideos = featuredVideosData?.featuredVideos.map((featuredVideo) => featuredVideo.video)

  const hasNewestVideosError = newestVideosError && !newestVideosLoading
  const hasFeaturedVideosError = featuredVideosError && !featuredVideosLoading

  return (
    <>
      <CoverVideo />
      <Container>
        {!hasNewestVideosError ? (
          <VideoGallery title="Newest videos" loading={newestVideosLoading} videos={newestVideos} />
        ) : (
          <ErrorFallback error={newestVideosError} resetError={() => refetchNewestVideos()} />
        )}

        {!hasFeaturedVideosError ? (
          <VideoGallery title="Featured videos" loading={featuredVideosLoading} videos={featuredVideos} />
        ) : (
          <ErrorFallback error={featuredVideosError} resetError={() => refetchFeaturedVideos()} />
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
