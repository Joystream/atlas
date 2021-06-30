import styled from '@emotion/styled'
import React from 'react'

import { BasicChannelFieldsFragment, VideoFieldsFragment } from '@/api/queries'
import { ChannelGallery, VideoGallery, VideoPreview } from '@/components'
import { Placeholder, Text } from '@/shared/components'
import { sizes } from '@/shared/theme'

type AllResultsTabProps = {
  videos: VideoFieldsFragment[]
  channels: BasicChannelFieldsFragment[]
  loading: boolean
  onVideoClick: (id: string) => void
  onChannelClick: (id: string) => void
}

export const AllResultsTab: React.FC<AllResultsTabProps> = ({
  videos: allVideos,
  channels,
  loading,
  onVideoClick,
  onChannelClick,
}) => {
  const [bestMatch, ...videos] = allVideos

  return (
    <>
      <div>
        {loading && <Placeholder width={200} height={16} bottomSpace={18} />}
        {bestMatch && <h3>Best Match</h3>}
        <VideoPreview id={bestMatch?.id} main onClick={() => onVideoClick(bestMatch?.id)} />
      </div>
      {(videos.length > 0 || loading) && (
        <div>
          {loading ? (
            <Placeholder width={200} height={16} bottomSpace={18} />
          ) : (
            <SectionHeader variant="h5">Videos</SectionHeader>
          )}
          <VideoGallery videos={videos} loading={loading} onVideoClick={onVideoClick} />
        </div>
      )}
      {(channels.length > 0 || loading) && (
        <div>
          {loading ? (
            <Placeholder width={200} height={16} bottomSpace={18} />
          ) : (
            <SectionHeader variant="h5">Channels</SectionHeader>
          )}
          <ChannelGallery channels={channels} loading={loading} onChannelClick={onChannelClick} />
        </div>
      )}
    </>
  )
}

const SectionHeader = styled(Text)`
  margin: 0 0 ${sizes(4)};
`
