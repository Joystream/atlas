import styled from '@emotion/styled'
import { round } from 'lodash'
import React, { ReactNode, useState } from 'react'

import { VideoHeroData } from '@/api/featured'
import { IconButton } from '@/shared/components/IconButton'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { SvgGlyphChevronLeft } from '@/shared/icons'
import { media } from '@/shared/theme'

import { Divider, VideoHeroHeader, VideoHeroHeaderTitle } from './VideoCategoryHero.style'
import { VideoHeroSlider } from './VideoHeroSlider'

import { VideoHero } from '../VideoHero'

export type VideoCategoryHeroProps = {
  header: {
    icon: ReactNode
    title: string
  }
  videos?: (VideoHeroData | null)[]
}

export const VideoCategoryHero: React.FC<VideoCategoryHeroProps> = ({ header, videos }) => {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)

  const handleVideoClick = (idx: number) => {
    setActiveVideoIdx(idx)
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const currentTime = e.currentTarget.currentTime
    const duration = e.currentTarget.duration
    const progressInPercentage = round((currentTime / duration) * 100, 2)
    setVideoProgress(progressInPercentage)
  }

  return (
    <StyledVideoHero
      onTimeUpdate={handleTimeUpdate}
      videoHeroData={videos ? videos[activeVideoIdx] : null}
      headerNode={
        <VideoHeroHeader>
          {header ? (
            <IconButton variant="tertiary">
              <SvgGlyphChevronLeft />
            </IconButton>
          ) : (
            <SkeletonLoader rounded height={40} width={40} />
          )}
          <Divider />
          {header ? (
            <>
              {header.icon}
              <VideoHeroHeaderTitle variant="h5">{header.title}</VideoHeroHeaderTitle>
            </>
          ) : (
            <SkeletonLoader height={24} width={160} />
          )}
        </VideoHeroHeader>
      }
      sliderNode={
        <VideoHeroSlider
          activeVideoIdx={activeVideoIdx}
          progress={videoProgress}
          videos={videos}
          onTileClick={handleVideoClick}
        />
      }
    />
  )
}

const StyledVideoHero = styled(VideoHero)`
  ${media.sm} {
    height: 392px;
  }
`
