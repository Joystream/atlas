import axios from 'axios'
import { useEffect, useState } from 'react'

import { useVideo } from '@/api/hooks'
import { VideoFieldsFragment } from '@/api/queries'
import { BUILD_ENV } from '@/config/envs'
import { VIDEO_HERO_DATA_URL } from '@/config/urls'
import { AssetType, useAsset } from '@/providers/assets'
import { SentryLogger } from '@/utils/logs'

import backupVideoHeroData from './backupVideoHeroData.json'

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
}

export const useVideoHeroData = (): VideoHeroData | null => {
  const [fetchedVideoHeroData, setFetchedVideoHeroData] = useState<RawVideoHeroData | null>(null)

  const { video, loading } = useVideo(fetchedVideoHeroData?.videoId || '', {
    skip: !fetchedVideoHeroData?.videoId,
    onError: (error) =>
      SentryLogger.error('Failed to fetch video hero', 'VideoHero', error, {
        video: { id: fetchedVideoHeroData?.videoId },
      }),
  })

  const { url: thumbnailPhotoUrl } = useAsset({
    entity: video,
    assetType: AssetType.THUMBNAIL,
  })

  useEffect(() => {
    if (fetchedVideoHeroData && !video && !loading && BUILD_ENV !== 'production') {
      setFetchedVideoHeroData(backupVideoHeroData)
    }
  }, [fetchedVideoHeroData, loading, video])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<RawVideoHeroData>(VIDEO_HERO_DATA_URL)
        setFetchedVideoHeroData(response.data)
      } catch (e) {
        SentryLogger.error('Failed to fetch video hero info', 'useVideoHeroData', e, {
          videoHero: { url: VIDEO_HERO_DATA_URL },
        })
        setFetchedVideoHeroData(backupVideoHeroData)
      }
    }

    fetchData()
  }, [])

  return video && fetchedVideoHeroData
    ? {
        video,
        heroTitle: fetchedVideoHeroData.heroTitle,
        heroVideoCutUrl: fetchedVideoHeroData.heroVideoCutUrl,
        thumbnailPhotoUrl,
      }
    : null
}
