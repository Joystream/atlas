import React from 'react'
import { useParams } from 'react-router'

import { useVideos } from '@/api/hooks'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { VideoCategoryHero } from '@/components/VideoCategoryHero'
import { SvgVideoCategoriesFilmAndAnimation } from '@/shared/icons'

import { CategoryVideos } from './CategoryVideos'

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
  const { videos } = useVideos({ limit: 3 })
  const { id } = useParams()

  const dummyVideos = videos
    ? videos.map((video, idx) => ({
        video,
        heroTitle: dummyHeroVideos[idx].heroTitle,
        heroVideoCutUrl: dummyHeroVideos[idx].heroVideoCutUrl,
        thumbnailPhotoUrl: dummyHeroVideos[idx].thumbnailPhotoUrl,
      }))
    : [null, null, null]
  return (
    <LimitedWidthContainer big>
      <VideoCategoryHero
        header={{
          title: 'Film & Animation',
          icon: <SvgVideoCategoriesFilmAndAnimation />,
        }}
        videos={dummyVideos}
      />
      <CategoryVideos categoryId={id} />
    </LimitedWidthContainer>
  )
}
