import React from 'react'

import { useVideos } from '@/api/hooks'
import { VideoGallery } from '@/components/VideoGallery'
import { readEnv } from '@/config/envs'

const channelId = readEnv('OFFICIAL_JOYSTREAM_CHANNEL_ID')
const MAX_VIDEOS = 10

export const OfficialJoystreamUpdate = () => {
  const { videos, loading } = useVideos({
    where: {
      channelId_eq: channelId,
    },
    limit: MAX_VIDEOS,
  })

  return (
    <section>
      <VideoGallery title="Official Joystream updates" videos={videos || []} loading={loading} />
    </section>
  )
}
