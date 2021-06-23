import { RouteComponentProps } from '@reach/router'
import React from 'react'

import { VideoGallery } from '@/components'
import { usePersonalDataStore } from '@/providers'
import { Logger } from '@/utils/logger'

const INTERRUPTED_VIDEOS_COUNT = 16

export const InterruptedVideosGallery: React.FC<RouteComponentProps> = () => {
  const watchedVideos = usePersonalDataStore((state) => state.watchedVideos)
  const updateWatchedVideos = usePersonalDataStore((state) => state.actions.updateWatchedVideos)

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
    Logger.warn(`Interrupted video not found, removing id: ${id}`)
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
