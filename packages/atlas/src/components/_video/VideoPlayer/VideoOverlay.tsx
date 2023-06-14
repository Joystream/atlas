import styled from '@emotion/styled'
import { FC, useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useBasicVideos } from '@/api/hooks/video'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { BasicVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { publicVideoFilter } from '@/config/contentFilter'
import { cVar, transitions } from '@/styles'
import { getRandomIntInclusive } from '@/utils/number'

import { EndingOverlay, ErrorOverlay, InactiveOverlay } from './VideoOverlays'
import { PlayerState } from './utils'

type VideoOverlayProps = {
  playerState: PlayerState
  onPlayAgain: () => void
  channelId?: string
  currentThumbnailUrl?: string | null
  videoId?: string
  isFullScreen?: boolean
  isPlayNextDisabled?: boolean
  playRandomVideoOnEnded?: boolean
  isMinimized?: boolean
  currentVideoCreatedAt?: Date
}
export const VideoOverlay: FC<VideoOverlayProps> = ({
  playerState,
  onPlayAgain,
  channelId,
  currentThumbnailUrl,
  videoId,
  isFullScreen,
  isPlayNextDisabled,
  isMinimized,
  playRandomVideoOnEnded = true,
  currentVideoCreatedAt,
}) => {
  const [randomNextVideo, setRandomNextVideo] = useState<BasicVideoFieldsFragment | null>(null)
  const { videos, refetch } = useBasicVideos(
    {
      limit: 1,
      orderBy: VideoOrderByInput.ChannelCreatedAtAsc,
      where: {
        ...publicVideoFilter,
        channel: {
          id_eq: channelId,
        },
        createdAt_gt: currentVideoCreatedAt,
      },
    },
    { notifyOnNetworkStatusChange: true }
  )

  useEffect(() => {
    if (!videos?.length || videos.length === 0) {
      refetch({
        where: {
          channel: {
            id_eq: channelId,
          },
          createdAt_lt: currentVideoCreatedAt,
        },
      })
      return
    }
    const filteredVideos = videos.filter((video) => video.id !== videoId)
    const randomNumber = getRandomIntInclusive(0, filteredVideos.length - 1)

    setRandomNextVideo(filteredVideos[randomNumber])
  }, [channelId, currentVideoCreatedAt, refetch, videoId, videos])

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
          {!isMinimized && playerState === 'ended' && (
            <EndingOverlay
              isFullScreen={isFullScreen}
              isEnded={true}
              isPlayNextDisabled={isPlayNextDisabled}
              onPlayAgain={onPlayAgain}
              channelId={channelId}
              currentThumbnailUrl={currentThumbnailUrl}
              randomNextVideo={playRandomVideoOnEnded ? randomNextVideo : undefined}
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
  height: 100%;
  z-index: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${cVar('colorCoreNeutral500Darken')};
  display: flex;
  background-size: cover;
  justify-content: center;
  pointer-events: none;
  align-items: center;
`
