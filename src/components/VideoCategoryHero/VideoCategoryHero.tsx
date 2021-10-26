import { round } from 'lodash'
import React, { ReactNode, useState } from 'react'

import { VideoHeroData } from '@/api/featured'

import { VideoHeroHeader } from './VideoHereoHeader'
import { VideoHeroSlider } from './VideoHeroSlider'

import { VideoHero } from '../VideoHero'

export type VideoCategoryHeroProps = {
  header: {
    icon?: ReactNode
    title?: string
  }
  videos?: (VideoHeroData | null)[]
}

export const VideoCategoryHero: React.FC<VideoCategoryHeroProps> = ({ header, videos }) => {
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

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
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

  const shouldShowSlider = videosLength > 1

  return (
    <VideoHero
      isCategory
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      videoHeroData={videos ? videos[activeVideoIdx] : null}
      headerNode={
        !!header.title &&
        !!header.icon && <VideoHeroHeader icon={header.icon} title={header.title} loading={!videos?.[activeVideoIdx]} />
      }
      sliderNode={
        shouldShowSlider ? (
          <VideoHeroSlider
            loading={!videos?.[activeVideoIdx]}
            activeVideoIdx={activeVideoIdx}
            videos={videosWithProgress}
            onTileClick={handleVideoClick}
          />
        ) : undefined
      }
    />
  )
}
