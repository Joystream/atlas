import { sampleSize } from 'lodash'
import React from 'react'
import { useParams } from 'react-router'

import { useVideoCount, useVideos } from '@/api/hooks'
import { VideoCategoryHero } from '@/components/VideoCategoryHero'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { VideoContentTemplate } from '@/components/templates/VideoContentTemplate'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { GridItem } from '@/shared/components/LayoutGrid'
import { Text } from '@/shared/components/Text'
import { VideoCategoryCard } from '@/shared/components/VideoCategoryCard'
import { SvgGlyphChevronRight } from '@/shared/icons'
import { SentryLogger } from '@/utils/logs'

import { CategoryVideos } from './CategoryVideos'
import { CategoriesContainer, TitleContainer } from './CategoryView.style'

import { VideoCategoryData, videoCategories } from '../DiscoverView/data'

const dummyHeroVideos = [
  {
    heroTitle: 'Lorem ipsum',
    heroVideoCutUrl: 'https://eu-central-1.linodeobjects.com/atlas-hero/hero-cut-3768.mp4',
    thumbnailPhotoUrl: 'https://picsum.photos/200/300',
  },
  {
    heroTitle: 'Ghost Signals: How We Lost Trust In Authority',
    heroVideoCutUrl: 'https://eu-central-1.linodeobjects.com/atlas-hero/cover-cut-ghost-signals.mp4',
    thumbnailPhotoUrl: 'https://picsum.photos/400/600',
  },
  {
    heroTitle: 'Lorem ipsum dolor sit amet consectetur.',
    heroVideoCutUrl: 'https://eu-central-1.linodeobjects.com/atlas-hero/cover-cut-1103.mp4',
    thumbnailPhotoUrl: 'https://picsum.photos/600/800',
  },
]

export const CategoryView = () => {
  const mdBreakpointMatch = useMediaMatch('md')
  const { id } = useParams()
  const { videos } = useVideos({ limit: 3 })
  const { videoCount, error } = useVideoCount(
    {},
    {
      onError: (error) => SentryLogger.error('Failed to fetch videos count', 'DiscoverView', error),
    }
  )
  const otherCategory: Array<VideoCategoryData> = React.useMemo(
    () =>
      sampleSize(
        Object.values(videoCategories).filter((category) => category.id !== id),
        3
      ),
    [id]
  )
  const currentCategory = Object.values(videoCategories).find((category) => category.id === id)
  const dummyVideos = videos
    ? videos.map((video, idx) => ({
        video,
        heroTitle: dummyHeroVideos[idx].heroTitle,
        heroVideoCutUrl: dummyHeroVideos[idx].heroVideoCutUrl,
        thumbnailPhotoUrl: dummyHeroVideos[idx].thumbnailPhotoUrl,
      }))
    : [null, null, null]

  if (error) {
    return <ViewErrorFallback />
  }

  return (
    <VideoContentTemplate cta={['popular', 'new', 'home']}>
      <VideoCategoryHero
        header={{
          title: currentCategory?.title,
          icon: currentCategory?.icon,
        }}
        videos={dummyVideos}
      />
      <CategoryVideos categoryId={id} />

      <TitleContainer>
        <Text variant="h4">Other categories</Text>
        <Button
          icon={<SvgGlyphChevronRight />}
          to={absoluteRoutes.viewer.discover()}
          iconPlacement="right"
          variant="secondary"
        >
          {mdBreakpointMatch ? 'Browse categories' : ''}
        </Button>
      </TitleContainer>
      <CategoriesContainer>
        {otherCategory.map((category) => (
          <GridItem key={category.id} colSpan={{ base: 6, lg: 4 }}>
            <VideoCategoryCard
              title={category.title}
              coverImg={category.coverImg}
              categoryId={category.id}
              color={category.color}
              icon={category.icon}
              videosTotalCount={videoCount}
              variant={mdBreakpointMatch ? 'default' : 'compact'}
              id={category.id}
            />
          </GridItem>
        ))}
      </CategoriesContainer>
    </VideoContentTemplate>
  )
}
