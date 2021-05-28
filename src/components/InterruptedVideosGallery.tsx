import React from 'react'
import { RouteComponentProps } from '@reach/router'

import { usePersonalData } from '@/hooks'
import { VideoGallery } from '@/components'

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

  const onVideoNotFound = (id: string) => {
    console.warn(`Interrupted video not found, removing id: ${id}`)
    updateWatchedVideos('REMOVED', id)
  }

  return (
    <VideoGallery
      title="Continue watching"
      videos={interruptedVideosId}
      loading={false}
      removeButton
      onRemoveButtonClick={onRemoveButtonClick}
      onVideoNotFound={onVideoNotFound}
    />
  )
}

export default InterruptedVideosGallery
