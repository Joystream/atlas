import { sample, sampleSize } from 'lodash-es'
import { useMemo } from 'react'
import { useParams } from 'react-router'

import { useCategories } from '@/api/hooks/categories'
import { useCategoriesFeaturedVideos } from '@/api/hooks/categoriesFeaturedVideos'
import { GetCategoriesFeaturedVideosQuery } from '@/api/queries/__generated__/featured.generated'
import { VideoCategoryFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Grid } from '@/components/Grid'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronR } from '@/components/_icons'
import { SvgFromUrl } from '@/components/_icons/SvgFromUrl'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoCategoryCard } from '@/components/_video/VideoCategoryCard'
import { VideoCategoryHero } from '@/components/_video/VideoCategoryHero'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { VideoCategoryData, displayCategories, findDisplayCategory } from '@/config/categories'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useVideosInCategories } from '@/hooks/useVideosInCategories'
import { useAsset } from '@/providers/assets/assets.hooks'

import { CategoryVideos } from './CategoryVideos'
import { CategoriesContainer, TitleContainer } from './CategoryView.styles'

export const CategoryView = () => {
  const mdBreakpointMatch = useMediaMatch('md')
  const { id = '' } = useParams()

  const { totalVideosCount, loading } = useCategories()
  const videosInCategories = useVideosInCategories()

  const mappedVideoCategories = displayCategories.map((category) => ({
    ...category,
    activeVideosCounter: videosInCategories(category),
  }))
  const otherCategory: Array<VideoCategoryData & VideoCategoryFieldsFragment> = useMemo(
    () =>
      sampleSize(
        mappedVideoCategories?.filter((category) => category.id !== id),
        3
      ),
    [id, mappedVideoCategories]
  )
  const currentCategory = findDisplayCategory(id)

  const headTags = useHeadTags(currentCategory?.name)

  const { categoriesFeaturedVideos } = useCategoriesFeaturedVideos(sample(currentCategory?.videoCategories) || '')
  const videoHeroVideos = useVideoHeroVideos(categoriesFeaturedVideos)

  return (
    <VideoContentTemplate cta={['popular', 'new', 'home']}>
      {headTags}
      <VideoCategoryHero
        header={{
          title: currentCategory?.name ?? undefined,
          icon: <SvgFromUrl path={currentCategory?.icon} />,
        }}
        videos={videoHeroVideos}
      />

      {!!categoriesFeaturedVideos?.length && (
        <>
          <TitleContainer>
            <Text as="h2" variant="h500">
              Featured category videos
            </Text>
          </TitleContainer>
          <Grid>
            {categoriesFeaturedVideos?.map((featuredVideo, idx) => (
              <VideoTileViewer id={featuredVideo.video.id} key={idx} />
            ))}
          </Grid>
        </>
      )}

      <CategoryVideos categoriesId={currentCategory?.videoCategories} />

      <TitleContainer>
        <Text as="h2" variant="h500">
          Other categories
        </Text>
        <Button
          icon={<SvgActionChevronR />}
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
              title={category.name ?? ''}
              isLoading={loading}
              coverImg={category.coverImg}
              color={category.color}
              categoryVideosCount={category.activeVideosCounter}
              icon={<SvgFromUrl path={category.icon} />}
              videosTotalCount={totalVideosCount}
              variant={mdBreakpointMatch ? 'default' : 'compact'}
              id={category.id}
            />
          </GridItem>
        ))}
      </CategoriesContainer>
    </VideoContentTemplate>
  )
}

const useVideoHeroVideos = (featuredVideos: GetCategoriesFeaturedVideosQuery['categoryFeaturedVideos'] = []) => {
  const videoHeroVideos = featuredVideos
    .filter((vid) => !!vid.videoCutUrl)
    .filter((vid) => !!vid.video)
    .slice(0, 3)
    .map((featuredVideo) => ({
      video: featuredVideo.video,
      videoCutUrl: featuredVideo.videoCutUrl || '',
      thumbnailPhotoUrl: '',
      isLoadingThumbnail: true,
    }))

  const { url: thumbnailPhotoUrl1, isLoadingAsset: isLoadingThumbnail1 } = useAsset(
    videoHeroVideos?.[0]?.video?.thumbnailPhoto
  )
  const { url: thumbnailPhotoUrl2, isLoadingAsset: isLoadingThumbnail2 } = useAsset(
    videoHeroVideos?.[1]?.video?.thumbnailPhoto
  )
  const { url: thumbnailPhotoUrl3, isLoadingAsset: isLoadingThumbnail3 } = useAsset(
    videoHeroVideos?.[2]?.video?.thumbnailPhoto
  )

  if (!videoHeroVideos) return [null, null, null]

  if (videoHeroVideos[0]) {
    videoHeroVideos[0].thumbnailPhotoUrl = thumbnailPhotoUrl1 ?? ''
    videoHeroVideos[0].isLoadingThumbnail = isLoadingThumbnail1
  }
  if (videoHeroVideos[1]) {
    videoHeroVideos[1].thumbnailPhotoUrl = thumbnailPhotoUrl2 ?? ''
    videoHeroVideos[1].isLoadingThumbnail = isLoadingThumbnail2
  }
  if (videoHeroVideos[2]) {
    videoHeroVideos[2].thumbnailPhotoUrl = thumbnailPhotoUrl3 ?? ''
    videoHeroVideos[2].isLoadingThumbnail = isLoadingThumbnail3
  }

  return videoHeroVideos
}
