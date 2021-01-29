import React from 'react'
import { RouteComponentProps } from '@reach/router'

import { useQuery } from '@apollo/client'
import { usePersonalData } from '@/hooks'
import { GET_VIDEOS_WITH_IDS } from '@/api/queries'

import { GetVideosWithIds, GetVideosWithIdsVariables } from '@/api/queries/__generated__/GetVideosWithIds'

import { ErrorFallback, VideoGallery } from '@/components'

const INTERRUPTED_VIDEOS_COUNT = 16

const InterruptedVideosGallery: React.FC<RouteComponentProps> = () => {
  const {
    state: { watchedVideos },
  } = usePersonalData()

  const interruptedVideosState = watchedVideos
    .filter((video) => video.__typename === 'INTERRUPTED')
    .slice(-INTERRUPTED_VIDEOS_COUNT)
  const interruptedVideosId = interruptedVideosState.map((video) => video.id)

  const { loading, data, error, refetch } = useQuery<GetVideosWithIds, GetVideosWithIdsVariables>(GET_VIDEOS_WITH_IDS, {
    variables: { ids: interruptedVideosId },
  })

  const videoTimestampsMap = interruptedVideosState.reduce((acc, video) => {
    if (video.__typename === 'INTERRUPTED') {
      acc[video.id] = video.timestamp || 0
    }
    return acc
  }, {} as Record<string, number>)

  const interruptedVideos = data?.videos?.map((video) => ({
    ...video,
    progress: (videoTimestampsMap[video.id] / video.duration) * 100,
  }))

  const hasInterruptedVideosError = error && !loading

  return (
    <>
      {!hasInterruptedVideosError ? (
        <VideoGallery title="Continue watching" loading={loading} videos={interruptedVideos} />
      ) : (
        <ErrorFallback error={error} resetError={() => refetch()} />
      )}
    </>
  )
}

export default InterruptedVideosGallery
