import axios from 'axios'
import { useEffect, useState } from 'react'

import { useVideo } from '@/api/hooks/video'
import { VideoFieldsFragment } from '@/api/queries'
import { COVER_VIDEO_INFO_URL } from '@/config/urls'
import { Logger } from '@/utils/logger'

import backupCoverVideoInfo from './backupCoverVideoInfo.json'

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

export const useCoverVideo = (): CoverInfo => {
  const [fetchedCoverInfo, setFetchedCoverInfo] = useState<RawCoverInfo | null>(null)
  const { video, error } = useVideo(fetchedCoverInfo?.videoId || '', { skip: !fetchedCoverInfo?.videoId })

  if (error) {
    throw error
  }

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get<RawCoverInfo>(COVER_VIDEO_INFO_URL)
        setFetchedCoverInfo(response.data)
      } catch (e) {
        Logger.error(`Failed to fetch cover info from ${COVER_VIDEO_INFO_URL}. Using backup`, e)
        setFetchedCoverInfo(backupCoverVideoInfo)
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
