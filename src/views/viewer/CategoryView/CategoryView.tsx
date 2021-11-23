import { sampleSize } from 'lodash'
import React from 'react'
import { useParams } from 'react-router'

import { CategoriesFeaturedVideos, useCategoriesFeaturedVideos } from '@/api/featured/categoriesFeaturedVideos'
import { useCategories, useVideoCount } from '@/api/hooks'
import { VideoCategoryFieldsFragment } from '@/api/queries'
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
import { CategoriesContainer, TitleContainer } from './CategoryView.style'

import { VideoCategoryData, videoCategories } from '../DiscoverView/data'

export const CategoryView = () => {
  const { categories } = useCategories()
  const mappedVideoCategories = categories?.map((category) => ({
    ...videoCategories[category.id],
    ...category,
  }))
  const { id = '' } = useParams()
  const data = useCategoriesFeaturedVideos()
  const featuredVideos = data?.[id] ?? []
  const videoHeroVideos = useVideoHeroVideos(featuredVideos)
  const mdBreakpointMatch = useMediaMatch('md')
  const { videoCount, error } = useVideoCount(
    {},
    {
      onError: (error) => SentryLogger.error('Failed to fetch videos count', 'DiscoverView', error),
    }
  )
  const otherCategory: Array<VideoCategoryData & VideoCategoryFieldsFragment> = React.useMemo(
    () =>
      sampleSize(
        mappedVideoCategories?.filter((category) => category.id !== id),
        3
      ),
    [id, mappedVideoCategories]
  )
  const currentCategory = mappedVideoCategories?.find((category) => category.id === id)

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

      {(featuredVideos.length ?? 0) > 0 && (
        <>
          <TitleContainer>
            <Text variant="h4">Featured category videos</Text>
          </TitleContainer>
          <Grid>
            {featuredVideos.map((video, idx) => (
              <VideoTile id={video.id} key={idx} showChannel />
            ))}
          </Grid>
        </>
      )}

      <CategoryVideos categoryId={id} />

      <TitleContainer>
        <Text variant="h4">Other categories</Text>
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

const useVideoHeroVideos = (featuredVideos: CategoriesFeaturedVideos[string] = []) => {
  const videoHeroVideos = featuredVideos
    .filter((vid) => !!vid.videoCutUrl)
    .slice(0, 3)
    .map((video) => ({
      video,
      thumbnailPhotoUrl: '',
      videoCutUrl: video?.videoCutUrl ?? '',
    }))

  const { url: thumbnailPhotoUrl1 } = useAsset({
    entity: videoHeroVideos?.[0]?.video,
    assetType: AssetType.THUMBNAIL,
  })
  const { url: thumbnailPhotoUrl2 } = useAsset({
    entity: videoHeroVideos?.[1]?.video,
    assetType: AssetType.THUMBNAIL,
  })
  const { url: thumbnailPhotoUrl3 } = useAsset({
    entity: videoHeroVideos?.[2]?.video,
    assetType: AssetType.THUMBNAIL,
  })

  if (!videoHeroVideos) return [null, null, null]

  if (videoHeroVideos[0]) videoHeroVideos[0].thumbnailPhotoUrl = thumbnailPhotoUrl1 ?? ''
  if (videoHeroVideos[1]) videoHeroVideos[1].thumbnailPhotoUrl = thumbnailPhotoUrl2 ?? ''
  if (videoHeroVideos[2]) videoHeroVideos[2].thumbnailPhotoUrl = thumbnailPhotoUrl3 ?? ''

  return videoHeroVideos
}
