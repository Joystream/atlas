import React from 'react'
import { RouteComponentProps } from '@reach/router'

import { useQuery } from '@apollo/client'
import { usePersonalData } from '@/hooks'

import { GET_VIDEOS_WITH_IDS } from '@/api/queries'
import { VideoFields } from '@/api/queries/__generated__/VideoFields'
import { GetVideosWithIdsVariables } from '@/api/queries/__generated__/GetVideosWithIds'

import { ErrorFallback, VideoGallery } from '@/components'

const InterruptedVideosGallery: React.FC<RouteComponentProps> = () => {
  const {
    state: { watchedVideos },
  } = usePersonalData()
  const interruptedVideosState = watchedVideos.filter((video) => video.__typename === 'INTERRUPTED' && video.timestamp)
  const interruptedVideosId = interruptedVideosState.map((video) => video.id)

  const {
    loading: interruptedVideosLoading,
    data: interruptedVideosData,
    error: interruptedVideosError,
    refetch: refetchInterruptedVideos,
  } = useQuery<{ videos: VideoFields[] }, GetVideosWithIdsVariables>(GET_VIDEOS_WITH_IDS, {
    variables: { ids: interruptedVideosId },
  })

  const interruptedVideos = interruptedVideosData?.videos.map((video, idx) => ({
    ...video,
    // @ts-ignore interruptedVideosState is filtered so it has timestamp
    timestamp: interruptedVideosState[idx].timestamp,
    // @ts-ignore interruptedVideosState is filtered so it has timestamp
    progress: (interruptedVideosState[idx].timestamp / video.duration) * 100,
  }))
  const hasInterruptedVideosError = interruptedVideosError && !interruptedVideosLoading

  return (
    <>
      {!hasInterruptedVideosError ? (
        <VideoGallery title="Continue watching" loading={interruptedVideosLoading} videos={interruptedVideos} />
      ) : (
        <ErrorFallback error={interruptedVideosError} resetError={() => refetchInterruptedVideos()} />
      )}
    </>
  )
}

export default InterruptedVideosGallery
