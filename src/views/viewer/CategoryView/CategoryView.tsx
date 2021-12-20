import { sampleSize } from 'lodash'
import React from 'react'
import { useParams } from 'react-router'

import { useCategories, useCategoriesFeaturedVideos, useVideoCount } from '@/api/hooks'
import { VideoCategoryFieldsFragment } from '@/api/queries'
import { GetCategoriesFeaturedVideosQuery } from '@/api/queries/__generated__/featured.generated'
import { Grid } from '@/components/Grid'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronR } from '@/components/_icons'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoCategoryCard } from '@/components/_video/VideoCategoryCard'
import { VideoCategoryHero } from '@/components/_video/VideoCategoryHero'
import { VideoTile } from '@/components/_video/VideoTile'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { AssetType, useAsset } from '@/providers/assets'
import { SentryLogger } from '@/utils/logs'

import { CategoryVideos } from './CategoryVideos'
import { CategoriesContainer, TitleContainer } from './CategoryView.styles'

import { VideoCategoryData, videoCategories } from '../DiscoverView/data'

export const CategoryView = () => {
  const mdBreakpointMatch = useMediaMatch('md')
  const { id = '' } = useParams()

  const { categories } = useCategories()
  const mappedVideoCategories = categories?.map((category) => ({
    ...videoCategories[category.id],
    ...category,
  }))
  const otherCategory: Array<VideoCategoryData & VideoCategoryFieldsFragment> = React.useMemo(
    () =>
      sampleSize(
        mappedVideoCategories?.filter((category) => category.id !== id),
        3
      ),
    [id, mappedVideoCategories]
  )
  const currentCategory = mappedVideoCategories?.find((category) => category.id === id)

  const { categoriesFeaturedVideos } = useCategoriesFeaturedVideos(id)
  const videoHeroVideos = useVideoHeroVideos(categoriesFeaturedVideos)

  const { videoCount, error } = useVideoCount(
    {},
    {
      onError: (error) => SentryLogger.error('Failed to fetch videos count', 'DiscoverView', error),
    }
  )

  if (error) {
    return <ViewErrorFallback />
  }
  return (
    <VideoContentTemplate cta={['popular', 'new', 'home']}>
      <VideoCategoryHero
        header={{
          title: currentCategory?.name ?? undefined,
          icon: currentCategory?.icon,
        }}
        videos={videoHeroVideos}
      />

      <TitleContainer>
        <Text variant="h500">Featured category videos</Text>
      </TitleContainer>
      <Grid>
        {categoriesFeaturedVideos?.map((featuredVideo, idx) => (
          <VideoTile id={featuredVideo.video.id} key={idx} showChannel />
        ))}
      </Grid>

      <CategoryVideos categoryId={id} />

      <TitleContainer>
        <Text variant="h500">Other categories</Text>
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

  const { url: thumbnailPhotoUrl1, isLoadingAsset: isLoadingThumbnail1 } = useAsset({
    entity: videoHeroVideos?.[0]?.video,
    assetType: AssetType.THUMBNAIL,
  })
  const { url: thumbnailPhotoUrl2, isLoadingAsset: isLoadingThumbnail2 } = useAsset({
    entity: videoHeroVideos?.[1]?.video,
    assetType: AssetType.THUMBNAIL,
  })
  const { url: thumbnailPhotoUrl3, isLoadingAsset: isLoadingThumbnail3 } = useAsset({
    entity: videoHeroVideos?.[2]?.video,
    assetType: AssetType.THUMBNAIL,
  })

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
