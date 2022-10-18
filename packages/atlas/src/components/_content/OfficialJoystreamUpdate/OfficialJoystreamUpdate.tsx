import { useChannelPreviewVideos } from '@/api/hooks/video'
import { VideoGallery } from '@/components/_video/VideoGallery'
import { atlasConfig } from '@/config'
import { SentryLogger } from '@/utils/logs'

const channelId = atlasConfig.content.officialJoystreamChannelId

export const OfficialJoystreamUpdate = () => {
  const { videos, loading, error } = useChannelPreviewVideos(channelId, {
    onError: (error) => SentryLogger.error('Failed to fetch videos', 'OfficialJoystreamUpdate', error),
    context: { delay: 1500 },
    skip: !channelId,
  })

  if (error || !channelId) {
    return null
  }

  return (
    <section>
      <VideoGallery title="Official Joystream updates" videos={videos || []} loading={loading} />
    </section>
  )
}
