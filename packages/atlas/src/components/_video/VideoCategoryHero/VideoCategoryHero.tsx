import { round } from 'lodash-es'
import { FC, SyntheticEvent, useState } from 'react'

import { VideoHero } from '../VideoHero'
import { VideoHeroCategory, VideoHeroFeaturedVideo } from '../VideoHero/VideoHero.types'

export type VideoCategoryHeroProps = {
  category: VideoHeroCategory
  videos?: (VideoHeroFeaturedVideo | null)[]
  loading?: boolean
}

export const VideoCategoryHero: FC<VideoCategoryHeroProps> = ({ category, videos, loading }) => {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)

  const videosLength = videos?.length || 0

  const handleVideoClick = (idx: number) => {
    setActiveVideoIdx(idx)
    setVideoProgress(0)
  }

  const handleEnded = () => {
    const idx = activeVideoIdx + 1 >= videosLength ? 0 : activeVideoIdx + 1
    setVideoProgress(0)
    setActiveVideoIdx(idx)
  }

  const handleTimeUpdate = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    const currentTime = e.currentTarget.currentTime
    const duration = e.currentTarget.duration
    if (duration && currentTime) {
      const progressInPercentage = round((currentTime / duration) * 100, 2)
      setVideoProgress(progressInPercentage)
    } else {
      setVideoProgress(0)
    }
  }

  const videosWithProgress = videos?.map((video, idx) =>
    video ? { ...video, progress: idx === activeVideoIdx ? videoProgress : 0 } : null
  )

  const videoSlider =
    videosLength > 1
      ? {
          activeVideoIdx,
          onTileClick: handleVideoClick,
          videos: videosWithProgress,
        }
      : undefined

  const currentVideoData = videos?.[activeVideoIdx]
  const videoHeroData = currentVideoData
    ? {
        video: currentVideoData?.video,
        heroTitle: currentVideoData?.video.title || '',
        heroVideoCutUrl: currentVideoData?.videoCutUrl || '',
        heroPosterUrl: null,
      }
    : null

  return (
    <VideoHero
      loading={loading}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      videoSlider={videoSlider}
      videoHeroData={videoHeroData}
      category={category ? category : undefined}
    />
  )
}
