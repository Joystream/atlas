import React from 'react'
import { RouteComponentProps } from '@reach/router'

import { useQuery } from '@apollo/client'
import { usePersonalData } from '@/hooks'
import { GET_VIDEOS_WITH_IDS } from '@/api/queries'

import { GetVideosWithIds, GetVideosWithIdsVariables } from '@/api/queries/__generated__/GetVideosWithIds'

import { ErrorFallback, VideoGallery } from '@/components'

interface Lookup {
  [key: string]: number
}

const InterruptedVideosGallery: React.FC<RouteComponentProps> = () => {
  const {
    state: { watchedVideos },
  } = usePersonalData()
  const interruptedVideosState = watchedVideos.filter((video) => video.__typename === 'INTERRUPTED' && video.timestamp)
  const interruptedVideosId = interruptedVideosState.map((video) => video.id)

  const { loading, data, error, refetch } = useQuery<GetVideosWithIds, GetVideosWithIdsVariables>(GET_VIDEOS_WITH_IDS, {
    variables: { ids: interruptedVideosId },
  })

  const videoTimestampsMap: Record<string, number> = interruptedVideosState.reduce((acc: Lookup, video) => {
    if (video.__typename === 'INTERRUPTED') {
      acc[video.id] = video.timestamp || 0
      return acc
    }
    return acc
  }, {})

  const interruptedVideos = data?.videos?.map((video) => ({
    ...video,
    timestamp: videoTimestampsMap[video.id],
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
