import { useParams } from 'react-router'

import { useCategoriesFeaturedVideos } from '@/api/hooks/categoriesFeaturedVideos'
import { BasicVideoFeaturedInCategoryFragment } from '@/api/queries/__generated__/fragments.generated'
import { CategoryIcon } from '@/components/CategoryIcon'
import { VideoCategoryHero } from '@/components/_video/VideoCategoryHero'
import { displayCategoriesLookup } from '@/config/categories'
import { useHeadTags } from '@/hooks/useHeadTags'
import { cVar } from '@/styles'

import { CategoryVideos } from './CategoryVideos'

export const CategoryView = () => {
  const { id = '' } = useParams()

  const currentCategory = displayCategoriesLookup[id]

  const headTags = useHeadTags(currentCategory?.name)

  const { categoriesFeaturedVideos, loading: categoriesFeaturedVideosLoading } = useCategoriesFeaturedVideos(
    currentCategory?.defaultVideoCategory || ''
  )

  const videoHeroVideos = useVideoHeroVideos(categoriesFeaturedVideos)

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

  const thumbnailPhotoUrl1 = videoHeroVideos?.[0]?.video?.thumbnailPhoto?.resolvedUrl

  const thumbnailPhotoUrl2 = videoHeroVideos?.[1]?.video?.thumbnailPhoto?.resolvedUrl

  const thumbnailPhotoUrl3 = videoHeroVideos?.[2]?.video?.thumbnailPhoto?.resolvedUrl

  if (!videoHeroVideos) return [null, null, null]

  if (videoHeroVideos[0]) {
    videoHeroVideos[0].thumbnailPhotoUrl = thumbnailPhotoUrl1 ?? ''
  }
  if (videoHeroVideos[1]) {
    videoHeroVideos[1].thumbnailPhotoUrl = thumbnailPhotoUrl2 ?? ''
  }
  if (videoHeroVideos[2]) {
    videoHeroVideos[2].thumbnailPhotoUrl = thumbnailPhotoUrl3 ?? ''
  }

  return videoHeroVideos
}
