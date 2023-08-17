import { useEffect } from 'react'
import { useParams } from 'react-router'

import { useCategoriesFeaturedVideos } from '@/api/hooks/categoriesFeaturedVideos'
import { BasicVideoFeaturedInCategoryFragment } from '@/api/queries/__generated__/fragments.generated'
import { CategoryIcon } from '@/components/CategoryIcon'
import { VideoCategoryHero } from '@/components/_video/VideoCategoryHero'
import { displayCategoriesLookup } from '@/config/categories'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { cVar } from '@/styles'

import { CategoryVideos } from './CategoryVideos'

export const CategoryView = () => {
  const { id = '' } = useParams()

  const currentCategory = displayCategoriesLookup[id]

  const headTags = useHeadTags(currentCategory?.name)
  const { trackPageView } = useSegmentAnalytics()

  const { categoriesFeaturedVideos, loading: categoriesFeaturedVideosLoading } = useCategoriesFeaturedVideos(
    currentCategory?.defaultVideoCategory || ''
  )

  const videoHeroVideos = useVideoHeroVideos(categoriesFeaturedVideos)

  useEffect(() => {
    //category name doesn't match page title without timeout
    const timeout = setTimeout(() => {
      if (id) {
        trackPageView('Category', { category: currentCategory?.name })
      }
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [currentCategory?.name, id, trackPageView])

  return (
    <>
      {headTags}
      <VideoCategoryHero
        loading={categoriesFeaturedVideosLoading}
        category={{
          title: currentCategory?.name ?? undefined,
          icon: (
            <CategoryIcon
              url={currentCategory?.iconUrl}
              color={videoHeroVideos.length ? cVar('colorTextStrong') : cVar('colorCoreBaseBlack')}
            />
          ),
          color: currentCategory.color,
          coverImgUrl: currentCategory.coverImgUrl,
        }}
        videos={videoHeroVideos}
      />
      <CategoryVideos categoriesId={currentCategory?.videoCategories} />
    </>
  )
}

const useVideoHeroVideos = (featuredVideos: BasicVideoFeaturedInCategoryFragment[] = []) => {
  const videoHeroVideos = featuredVideos
    .filter((vid) => !!vid.videoCutUrl)
    .filter((vid) => !!vid.video)
    .slice(0, 3)
    .map((featuredVideo) => ({
      video: featuredVideo.video,
      videoCutUrl: featuredVideo.videoCutUrl || '',
      thumbnailPhotoUrl: '',
    }))

  const thumbnailPhotoUrls1 = videoHeroVideos?.[0]?.video?.thumbnailPhoto?.resolvedUrls

  const thumbnailPhotoUrls2 = videoHeroVideos?.[1]?.video?.thumbnailPhoto?.resolvedUrls

  const thumbnailPhotoUrls3 = videoHeroVideos?.[2]?.video?.thumbnailPhoto?.resolvedUrls

  if (!videoHeroVideos) return [null, null, null]

  if (videoHeroVideos[0]) {
    videoHeroVideos[0].thumbnailPhotoUrl = thumbnailPhotoUrls1?.[0] ?? ''
  }
  if (videoHeroVideos[1]) {
    videoHeroVideos[1].thumbnailPhotoUrl = thumbnailPhotoUrls2?.[0] ?? ''
  }
  if (videoHeroVideos[2]) {
    videoHeroVideos[2].thumbnailPhotoUrl = thumbnailPhotoUrls3?.[0] ?? ''
  }

  return videoHeroVideos
}
