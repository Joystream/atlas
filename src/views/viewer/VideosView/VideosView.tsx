import React, { useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { useCategories, useVideos } from '@/api/hooks'
import { VideoOrderByInput } from '@/api/queries'
import { BackgroundPattern, TOP_NAVBAR_HEIGHT, VideoGallery, ViewErrorFallback } from '@/components'
import { Text } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'

import {
  CategoriesVideosContainer,
  FeaturedVideosContainer,
  GRID_TOP_PADDING,
  Header,
  IntersectionTarget,
  StyledCategoryPicker,
  StyledInfiniteVideoGrid,
  StyledViewWrapper,
} from './VideosView.style'

export const VideosView: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { loading: categoriesLoading, categories, error: categoriesError } = useCategories(undefined, {
    onError: (error) => Logger.captureError('Failed to fetch categories', 'VideosView', error),
  })
  const { loading: featuredVideosLoading, videos: featuredVideos, error: videosError } = useVideos(
    {
      where: {
        isFeatured_eq: true,
      },
      orderBy: VideoOrderByInput.CreatedAtDesc,
    },
    {
      notifyOnNetworkStatusChange: true,
      onError: (error) => Logger.captureError('Failed to fetch videos', 'VideosView', error),
    }
  )

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

  if (videosError || categoriesError) {
    return <ViewErrorFallback />
  }

  return (
    <StyledViewWrapper>
      <BackgroundPattern />
      <div className={transitions.names.slide}>
        <Header variant="hero">Videos</Header>
        {featuredVideosLoading || featuredVideos?.length ? (
          <FeaturedVideosContainer>
            <VideoGallery title="Featured" loading={featuredVideosLoading} videos={featuredVideos || []} />
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
          <StyledInfiniteVideoGrid categoryId={selectedCategoryId || undefined} ready={!!categories} />
        </CategoriesVideosContainer>
      </div>
    </StyledViewWrapper>
  )
}
