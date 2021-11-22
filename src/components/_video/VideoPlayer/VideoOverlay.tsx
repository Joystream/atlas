import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicVideos } from '@/api/hooks'
import { AssetAvailability, BasicVideoFieldsFragment } from '@/api/queries'
import { oldColors, transitions } from '@/styles'
import { getRandomIntInclusive } from '@/utils/number'

import { EndingOverlay, ErrorOverlay, InactiveOverlay } from './VideoOverlays'
import { PlayerState } from './VideoPlayer'

type VideoOverlaProps = {
  playerState: PlayerState
  onPlay: () => void
  channelId?: string
  currentThumbnailUrl?: string | null
  videoId?: string
  isFullScreen?: boolean
}
export const VideoOverlay: React.FC<VideoOverlaProps> = ({
  playerState,
  onPlay,
  channelId,
  currentThumbnailUrl,
  videoId,
  isFullScreen,
}) => {
  const [randomNextVideo, setRandomNextVideo] = useState<BasicVideoFieldsFragment | null>(null)
  const { videos } = useBasicVideos({
    where: {
      channelId_eq: channelId,
      isPublic_eq: true,
      mediaAvailability_eq: AssetAvailability.Accepted,
    },
  })

  useEffect(() => {
    if (!videos?.length || videos.length <= 1) {
      return
    }
    const filteredVideos = videos.filter((video) => video.id !== videoId)
    const randomNumber = getRandomIntInclusive(0, filteredVideos.length - 1)

    setRandomNextVideo(filteredVideos[randomNumber])
  }, [videoId, videos])

  return (
    <SwitchTransition>
      <CSSTransition
        key={playerState}
        timeout={playerState !== 'error' ? parseInt(transitions.timings.sharp) : 0}
        classNames={transitions.names.fade}
        mountOnEnter
        unmountOnExit
        appear
      >
        <div>
          {playerState === 'pending' && <InactiveOverlay />}
          {playerState === 'loading' && <LoadingOverlay />}
          {playerState === 'ended' && (
            <EndingOverlay
              isFullScreen={isFullScreen}
              isEnded={true}
              onPlayAgain={onPlay}
              channelId={channelId}
              currentThumbnailUrl={currentThumbnailUrl}
              randomNextVideo={randomNextVideo}
            />
          )}
          {playerState === 'error' && <ErrorOverlay />}
        </div>
      </CSSTransition>
    </SwitchTransition>
  )
}

export const LoadingOverlay = styled.div`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${oldColors.transparentBlack[54]};
  display: flex;
  background-size: cover;
  justify-content: center;
  pointer-events: none;
  align-items: center;
`
