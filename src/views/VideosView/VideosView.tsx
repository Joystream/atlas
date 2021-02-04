import React, { useState, useRef } from 'react'

import { ErrorBoundary } from '@sentry/react'
import { useInView } from 'react-intersection-observer'
import { useFeaturedVideos, useCategories } from '@/api/hooks'

import { ErrorFallback, BackgroundPattern, VideoGallery } from '@/components'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'
import {
  StyledText,
  StyledCategoryPicker,
  StyledInfiniteVideoGrid,
  IntersectionTarget,
  Header,
  GRID_TOP_PADDING,
} from './VideosView.style'
import { transitions } from '@/shared/theme'

const VideosView: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { loading: categoriesLoading, categories, error: categoriesError } = useCategories()
  const {
    loading: featuredVideosLoading,
    featuredVideos,
    error: featuredVideosError,
    refetch: refetchFeaturedVideos,
  } = useFeaturedVideos({}, { notifyOnNetworkStatusChange: true })

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
  const videos = featuredVideos?.map((featuredVideo) => featuredVideo.video)
  const hasFeaturedVideosError = featuredVideosError && !featuredVideosLoading
  return (
    <>
      <BackgroundPattern />
      <div className={transitions.names.slide}>
        <Header variant="hero">Videos</Header>
        {!hasFeaturedVideosError ? (
          <VideoGallery title="Featured" loading={featuredVideosLoading} videos={videos} />
        ) : (
          <ErrorFallback error={featuredVideosError} resetError={() => refetchFeaturedVideos()} />
        )}
        <StyledText ref={topicsRef} variant="h5">
          Topics that may interest you
        </StyledText>
        <IntersectionTarget ref={targetRef} />
        <StyledCategoryPicker
          categories={categories}
          loading={categoriesLoading}
          selectedCategoryId={selectedCategoryId}
          onChange={handleCategoryChange}
          isAtTop={inView}
        />
        <ErrorBoundary fallback={ErrorFallback}>
          <StyledInfiniteVideoGrid categoryId={selectedCategoryId || undefined} ready={!!categories} />
        </ErrorBoundary>
      </div>
    </>
  )
}

export default VideosView
