import axios from 'axios'
import { useEffect, useState } from 'react'

import { useVideo } from '@/api/hooks'
import { VideoFieldsFragment } from '@/api/queries'
import { BUILD_ENV } from '@/config/envs'
import { COVER_VIDEO_INFO_URL } from '@/config/urls'
import { SentryLogger } from '@/utils/logs'

import backupVideoHeroInfo from './backupVideoHeroInfo.json'

type RawCoverInfo = {
  videoId: string
  coverTitle: string
  coverDescription: string
  coverCutMediaUrl: string
}

type CoverInfo =
  | (Omit<RawCoverInfo, 'videoId'> & {
      video: VideoFieldsFragment
    })
  | null

export const useVideoHero = (): CoverInfo => {
  const [fetchedCoverInfo, setFetchedCoverInfo] = useState<RawCoverInfo | null>(null)
  const { video, loading } = useVideo(fetchedCoverInfo?.videoId || '', {
    skip: !fetchedCoverInfo?.videoId,
    onError: (error) =>
      SentryLogger.error('Failed to fetch video hero', 'VideoHero', error, {
        video: { id: fetchedCoverInfo?.videoId },
      }),
  })

  useEffect(() => {
    if (fetchedCoverInfo && !video && !loading && BUILD_ENV !== 'production') {
      setFetchedCoverInfo(backupVideoHeroInfo)
    }
  }, [fetchedCoverInfo, loading, video])

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get<RawCoverInfo>(COVER_VIDEO_INFO_URL)
        setFetchedCoverInfo(response.data)
      } catch (e) {
        SentryLogger.error('Failed to fetch video hero info', 'VideoHero', e, {
          videoHero: { url: COVER_VIDEO_INFO_URL },
        })
        setFetchedCoverInfo(backupVideoHeroInfo)
      }
    }

    fetchInfo()
  }, [])

  return video && fetchedCoverInfo
    ? {
        video,
        coverTitle: fetchedCoverInfo.coverTitle,
        coverDescription: fetchedCoverInfo.coverDescription,
        coverCutMediaUrl: fetchedCoverInfo.coverCutMediaUrl,
      }
    : null
}
