import React, { useState, useRef } from 'react'

import { ErrorBoundary } from '@sentry/react'
import { useInView } from 'react-intersection-observer'
import { useFeaturedVideos, useCategories } from '@/api/hooks'

import { ErrorFallback, BackgroundPattern, VideoGallery } from '@/components'
import { TOP_NAVBAR_HEIGHT, Text } from '@/shared/components'
import {
  StyledViewWrapper,
  StyledCategoryPicker,
  StyledInfiniteVideoGrid,
  IntersectionTarget,
  Header,
  GRID_TOP_PADDING,
  CategoriesVideosContainer,
  FeaturedVideosContainer,
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
        const offset = TOP_NAVBAR_HEIGHT
        const relativeY = topicsRef?.current?.getBoundingClientRect().top || 0
        const scrollY = relativeY + window.pageYOffset - offset
        window.scrollTo({ top: scrollY, behavior: 'smooth' })
      })
    }
  }

  if (categoriesError) {
    throw categoriesError
  }
  const videos = featuredVideos?.map((featuredVideo) => featuredVideo.video)
  const hasFeaturedVideosError = featuredVideosError && !featuredVideosLoading

  return (
    <StyledViewWrapper>
      <BackgroundPattern />
      <div className={transitions.names.slide}>
        <Header variant="hero">Videos</Header>
        {featuredVideosLoading || featuredVideos?.length ? (
          <FeaturedVideosContainer>
            {!hasFeaturedVideosError ? (
              <VideoGallery title="Featured" loading={featuredVideosLoading} videos={videos} />
            ) : (
              <ErrorFallback error={featuredVideosError} resetError={() => refetchFeaturedVideos()} />
            )}
          </FeaturedVideosContainer>
        ) : null}
        <CategoriesVideosContainer>
          <Text ref={topicsRef} variant="h5">
            Topics that may interest you
          </Text>
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
        </CategoriesVideosContainer>
      </div>
    </StyledViewWrapper>
  )
}

export default VideosView
