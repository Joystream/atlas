import { FC } from 'react'

import { useTop10Channels } from '@/api/hooks'
import { ChannelGallery } from '@/components/_channel/ChannelGallery'
import { ExpandableChannelsList } from '@/components/_channel/ExpandableChannelsList'
import { DiscoverChannels } from '@/components/_content/DiscoverChannels'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { useHeadTags } from '@/hooks/useHeadTags'
import { SentryLogger } from '@/utils/logs'

export const ChannelsView: FC = () => {
  const { channels, loading, error } = useTop10Channels(
    {},
    { onError: (error) => SentryLogger.error('Failed to fetch channels', 'ChannelsView', error) }
  )
  const headTags = useHeadTags('Browse channels')

  return (
    <>
      {headTags}
      <VideoContentTemplate title="Browse channels" cta={['popular', 'new', 'home']}>
        {!error ? <ChannelGallery hasRanking channels={channels} loading={loading} title="Top 10 channels" /> : null}
        <DiscoverChannels />
        <ExpandableChannelsList queryType="regular" title="Channels in your language" languageSelector />
      </VideoContentTemplate>
    </>
  )
}
