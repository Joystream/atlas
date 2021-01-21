import React from 'react'
import { RouteComponentProps } from '@reach/router'

import { useQuery } from '@apollo/client'

import { usePersonalData } from '@/hooks'

import { GET_VIDEOS_WITH_IDS } from '@/api/queries'
import { GetVideosWithIds, GetVideosWithIdsVariables } from '@/api/queries/__generated__/GetVideosWithIds'

import { ErrorFallback, VideoGallery } from '@/components'

const InterruptedVideosGallery: React.FC<RouteComponentProps> = () => {
  const {
    state: { watchedVideos },
  } = usePersonalData()
  const interruptedVideosStore = watchedVideos.filter((video) => video.__typename === 'INTERRUPTED' && video.timestamp)
  const interruptedVideosId = interruptedVideosStore.map((video) => video.id)
  const {
    loading: interruptedVideosLoading,
    data: interruptedVideosData,
    error: interruptedVideosError,
    refetch: refetchInterruptedVideos,
  } = useQuery<GetVideosWithIds, GetVideosWithIdsVariables>(GET_VIDEOS_WITH_IDS, {
    variables: { ids: interruptedVideosId },
  })

  const interruptedVideos = interruptedVideosData?.videosConnection.edges.map((e) => e.node)
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
