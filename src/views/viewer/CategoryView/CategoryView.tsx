import React from 'react'

import { useVideos } from '@/api/hooks'
import { CategoryVideos } from '@/components/CategoryVideos'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { VideoCategoryHero } from '@/components/VideoCategoryHero'
import { SvgVideoCategoriesFilmAndAnimation } from '@/shared/icons'

const dummyHero = [
  'https://eu-central-1.linodeobjects.com/atlas-hero/hero-cut-3768.mp4',
  'https://eu-central-1.linodeobjects.com/atlas-hero/cover-cut-ghost-signals.mp4',
  'https://eu-central-1.linodeobjects.com/atlas-hero/cover-cut-1103.mp4',
]

export const CategoryView = () => {
  const { videos } = useVideos({ limit: 3 })

  const dummyVideos = videos
    ? videos.map((video, idx) => ({
        video,
        heroTitle: 'Ghost signals',
        heroVideoCutUrl: dummyHero[idx],
        thumbnailPhotoUrl: 'https://picsum.photos/200/300',
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
      <CategoryVideos />
    </LimitedWidthContainer>
  )
}
