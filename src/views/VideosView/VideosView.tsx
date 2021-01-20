import React, { useState, useRef } from 'react'

import { RouteComponentProps } from '@reach/router'
import { ErrorBoundary } from '@sentry/react'
import { useQuery } from '@apollo/client'
import { useInView } from 'react-intersection-observer'

import { ErrorFallback, BackgroundPattern, VideoGallery } from '@/components'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'
import {
  StyledText,
  StyledCategoryPicker,
  Container,
  StyledInfiniteVideoGrid,
  IntersectionTarget,
  Header,
  GRID_TOP_PADDING,
} from './VideosView.style'
import { GET_CATEGORIES, GET_FEATURED_VIDEOS } from '@/api/queries'
import { GetCategories } from '@/api/queries/__generated__/GetCategories'
import { GetFeaturedVideos } from '@/api/queries/__generated__/GetFeaturedVideos'

const VideosView: React.FC<RouteComponentProps> = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { loading: categoriesLoading, data: categoriesData, error: categoriesError } = useQuery<GetCategories>(
    GET_CATEGORIES
  )
  const {
    loading: featuredVideosLoading,
    data: featuredVideosData,
    error: featuredVideosError,
    refetch: refetchFeaturedVideos,
  } = useQuery<GetFeaturedVideos>(GET_FEATURED_VIDEOS, {
    notifyOnNetworkStatusChange: true,
  })

  const topicsRef = useRef<HTMLHeadingElement>(null)
  const { ref: targetRef, inView } = useInView({
    rootMargin: `-${TOP_NAVBAR_HEIGHT - GRID_TOP_PADDING}px 0px 0px`,
  })
  const handleCategoryChange = (categoryId: string | null, scrollTop = true) => {
    setSelectedCategoryId(categoryId)
    if (topicsRef.current && scrollTop) {
      setTimeout(() => {
        topicsRef.current?.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' })
      })
    }
  }

  if (categoriesError) {
    throw categoriesError
  }
  const featuredVideos = featuredVideosData?.featuredVideos.map((featuredVideo) => featuredVideo.video)
  const hasFeaturedVideosError = featuredVideosError && !featuredVideosLoading
  return (
    <Container>
      <BackgroundPattern />
      <Header variant="hero">Videos</Header>
      {!hasFeaturedVideosError ? (
        <VideoGallery title="Featured" loading={featuredVideosLoading} videos={featuredVideos} />
      ) : (
        <ErrorFallback error={featuredVideosError} resetError={() => refetchFeaturedVideos()} />
      )}
      <StyledText ref={topicsRef} variant="h5">
        Topics that may interest you
      </StyledText>
      <IntersectionTarget ref={targetRef} />
      <StyledCategoryPicker
        categories={categoriesData?.categories}
        loading={categoriesLoading}
        selectedCategoryId={selectedCategoryId}
        onChange={handleCategoryChange}
        isAtTop={inView}
      />
      <ErrorBoundary fallback={ErrorFallback}>
        <StyledInfiniteVideoGrid categoryId={selectedCategoryId || undefined} ready={!!categoriesData?.categories} />
      </ErrorBoundary>
    </Container>
  )
}

export default VideosView
