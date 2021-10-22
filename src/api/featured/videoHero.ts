import { useApolloClient } from '@apollo/client'
import { useMemo } from 'react'

import { useVideo } from '@/api/hooks'
import { VideoFieldsFragment } from '@/api/queries'
import { GetVideoHeroDocument, GetVideoHeroQuery } from '@/api/queries/__generated__/featured.generated'
import { AssetType, useAsset } from '@/providers/assets'
import { SentryLogger } from '@/utils/logs'

import { useGenericFeaturedData } from './helpers'

type RawVideoHeroData = {
  videoId: string
  heroTitle: string
  heroVideoCutUrl: string
}

export type VideoHeroData = {
  video: VideoFieldsFragment
  heroTitle: string
  heroVideoCutUrl: string
  thumbnailPhotoUrl?: string | null
  progress?: number
}

export const useVideoHeroData = (): VideoHeroData | null => {
  const client = useApolloClient()
  const fetchVideoHero = useMemo(
    () => async () => (await client.query<GetVideoHeroQuery>({ query: GetVideoHeroDocument })).data.videoHero,
    [client]
  )
  const { data: rawData } = useGenericFeaturedData<RawVideoHeroData>('video-hero', fetchVideoHero)

  const { video } = useVideo(rawData?.videoId || '', {
    skip: !rawData?.videoId,
    onError: (error) =>
      SentryLogger.error('Failed to fetch video hero', 'VideoHero', error, {
        video: { id: rawData?.videoId },
      }),
  })

  const { url: thumbnailPhotoUrl } = useAsset({
    entity: video,
    assetType: AssetType.THUMBNAIL,
  })

  return video && rawData
    ? {
        video,
        heroTitle: rawData.heroTitle,
        heroVideoCutUrl: rawData.heroVideoCutUrl,
        thumbnailPhotoUrl,
      }
    : null
}
