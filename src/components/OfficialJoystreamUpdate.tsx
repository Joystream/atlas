import React from 'react'

import { useVideos } from '@/api/hooks'
import { VideoGallery } from '@/components'
import { readEnv } from '@/config/envs'

const channelId = readEnv('OFFICIAL_JOYSTREAM_CHANNEL')
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
      <VideoGallery
        title="Official Joystream updates"
        videos={videos || []}
        seeAllUrl={`/channel/${channelId}`}
        loading={loading}
      />
    </section>
  )
}
