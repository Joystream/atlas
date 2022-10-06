import { useChannelPreviewVideos } from '@/api/hooks/video'
import { VideoGallery } from '@/components/_video/VideoGallery'
import { readEnv } from '@/config/env'
import { SentryLogger } from '@/utils/logs'

const channelId = readEnv('OFFICIAL_JOYSTREAM_CHANNEL_ID')

export const OfficialJoystreamUpdate = () => {
  const { videos, loading, error } = useChannelPreviewVideos(channelId, {
    onError: (error) => SentryLogger.error('Failed to fetch videos', 'OfficialJoystreamUpdate', error),
    context: { delay: 1500 },
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
