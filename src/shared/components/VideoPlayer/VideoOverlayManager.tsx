import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useVideos } from '@/api/hooks'
import { AssetAvailability, VideoFieldsFragment } from '@/api/queries'
import { transitions } from '@/shared/theme'
import { getRandomIntInclusive } from '@/utils/number'

import { EndingOverlay, ErrorOverlay, LoadingOverlay } from './VideoOverlays'
import { PlayerState } from './VideoPlayer'

type VideoOverlayManagerProps = {
  playerState: PlayerState
  onPlay: () => void
  channelId?: string
  currentThumbnail?: string | null
}
export const VideoOverlayManager: React.FC<VideoOverlayManagerProps> = ({
  playerState,
  onPlay,
  channelId,
  currentThumbnail,
}) => {
  const { id } = useParams()
  const [randomNextVideo, setRandomNextVideo] = useState<VideoFieldsFragment | null>(null)
  const { videos } = useVideos({
    where: {
      channelId_eq: channelId,
      isPublic_eq: true,
      mediaAvailability_eq: AssetAvailability.Accepted,
    },
  })

  const getRandomNumber = useCallback((videosLength: number) => {
    return getRandomIntInclusive(0, videosLength - 1)
  }, [])

  useEffect(() => {
    if (!videos?.length || videos.length <= 1) {
      return
    }
    const filteredVideos = videos.filter((video) => video.id !== id)
    const randomNumber = getRandomNumber(filteredVideos.length)

    setRandomNextVideo(filteredVideos[randomNumber])
  }, [getRandomNumber, id, videos])

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
          {playerState === 'loading' && <LoadingOverlay onPlay={onPlay} />}
          {playerState === 'ended' && (
            <EndingOverlay
              isEnded={true}
              onPlayAgain={onPlay}
              channelId={channelId}
              currentThumbnail={currentThumbnail}
              randomNextVideo={randomNextVideo}
            />
          )}
          {playerState === 'error' && <ErrorOverlay />}
        </div>
      </CSSTransition>
    </SwitchTransition>
  )
}
