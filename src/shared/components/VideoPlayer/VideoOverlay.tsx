import React, { useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useVideosWithBasicInformation } from '@/api/hooks'
import { AssetAvailability, VideoBasicFieldsFragment } from '@/api/queries'
import { transitions } from '@/shared/theme'
import { getRandomIntInclusive } from '@/utils/number'

import { EndingOverlay, ErrorOverlay, LoadingOverlay } from './VideoOverlays'
import { PlayerState } from './VideoPlayer'

type VideoOverlaProps = {
  playerState: PlayerState
  onPlay: () => void
  channelId?: string
  currentThumbnailUrl?: string | null
  videoId?: string
}
export const VideoOverlay: React.FC<VideoOverlaProps> = ({
  playerState,
  onPlay,
  channelId,
  currentThumbnailUrl,
  videoId,
}) => {
  const [randomNextVideo, setRandomNextVideo] = useState<VideoBasicFieldsFragment | null>(null)
  const { videos } = useVideosWithBasicInformation({
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
          {playerState === 'loading' && <LoadingOverlay onPlay={onPlay} />}
          {playerState === 'ended' && (
            <EndingOverlay
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
