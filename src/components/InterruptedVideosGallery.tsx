import { RouteComponentProps } from '@reach/router'
import React from 'react'

import { VideoGallery } from '@/components'
import { usePersonalData } from '@/hooks'

const INTERRUPTED_VIDEOS_COUNT = 16

const InterruptedVideosGallery: React.FC<RouteComponentProps> = () => {
  const {
    state: { watchedVideos },
    updateWatchedVideos,
  } = usePersonalData()

  const interruptedVideosState = watchedVideos
    .filter((video) => video.__typename === 'INTERRUPTED')
    // display the newest videos first
    .reverse()
    .slice(-INTERRUPTED_VIDEOS_COUNT)

  const interruptedVideosId = interruptedVideosState.map((video) => ({ id: video.id, progress: 0 }))

  const onRemoveButtonClick = (id: string) => {
    updateWatchedVideos('REMOVED', id)
  }

  return (
    <VideoGallery
      title="Continue watching"
      videos={interruptedVideosId}
      loading={false}
      removeButton
      onRemoveButtonClick={onRemoveButtonClick}
    />
  )
}

export default InterruptedVideosGallery
