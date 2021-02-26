import React from 'react'
import { RouteComponentProps } from '@reach/router'

import { usePersonalData } from '@/hooks'
import { ErrorFallback, VideoGallery } from '@/components'
import { useVideos } from '@/api/hooks'

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
  const interruptedVideosId = interruptedVideosState.map((video) => video.id)
  const anyInterruptedVideos = interruptedVideosId.length > 0

  const videoOrderMap = interruptedVideosId.reduce((acc, videoId, idx) => {
    acc[videoId] = idx
    return acc
  }, {} as Record<string, number>)

  const { videos, error, loading, refetch } = useVideos(
    {
      id_in: interruptedVideosId,
    },
    { skip: !anyInterruptedVideos }
  )

  const sortedVideos = videos?.slice().sort((v1, v2) => videoOrderMap[v1.id] - videoOrderMap[v2.id])

  const videoTimestampsMap = interruptedVideosState.reduce((acc, video) => {
    if (video.__typename === 'INTERRUPTED') {
      acc[video.id] = video.timestamp || 0
    }
    return acc
  }, {} as Record<string, number>)

  const interruptedSortedVideos = sortedVideos?.map((video) => ({
    ...video,
    progress: video.duration ? Math.min((videoTimestampsMap[video.id] / video.duration) * 100, 100) : 0,
  }))

  const onRemoveButtonClick = (id: string) => {
    updateWatchedVideos('REMOVED', id)
  }

  const hasInterruptedVideosError = error && !loading

  if (!anyInterruptedVideos) {
    return null
  }

  return (
    <>
      {!hasInterruptedVideosError ? (
        <VideoGallery
          title="Continue watching"
          loading={loading}
          videos={interruptedSortedVideos}
          onRemoveButtonClick={onRemoveButtonClick}
          removeButton
        />
      ) : (
        <ErrorFallback error={error} resetError={() => refetch()} />
      )}
    </>
  )
}

export default InterruptedVideosGallery
