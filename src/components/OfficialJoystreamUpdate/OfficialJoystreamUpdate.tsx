import React from 'react'

import { useChannelPreviewVideos } from '@/api/hooks'
import { VideoGallery } from '@/components/VideoGallery'
import { readEnv } from '@/config/envs'
import { SentryLogger } from '@/utils/logs'

const channelId = readEnv('OFFICIAL_JOYSTREAM_CHANNEL_ID')

export const OfficialJoystreamUpdate = () => {
  const { videos, loading, error } = useChannelPreviewVideos(channelId, {
    onError: (error) => SentryLogger.error('Failed to fetch videos', 'OfficialJoystreamUpdate', error),
  })

  if (error) {
    return null
  }

  return (
    <section>
      <VideoGallery title="Official Joystream updates" videos={videos || []} loading={loading} />
    </section>
  )
}
