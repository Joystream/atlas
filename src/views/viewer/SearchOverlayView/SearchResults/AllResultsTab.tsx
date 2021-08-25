import styled from '@emotion/styled'
import React from 'react'

import { BasicChannelFieldsFragment, VideoFieldsFragment } from '@/api/queries'
import { ChannelGallery } from '@/components/ChannelGallery'
import { VideoGallery } from '@/components/VideoGallery'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { Text } from '@/shared/components/Text'
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
  return (
    <>
      {(allVideos.length > 0 || loading) && (
        <div>
          {loading ? (
            <SkeletonLoader width={200} height={16} bottomSpace={18} />
          ) : (
            <SectionHeader variant="h5">Videos</SectionHeader>
          )}
          <VideoGallery videos={allVideos} loading={loading} onVideoClick={onVideoClick} />
        </div>
      )}
      {(channels.length > 0 || loading) && (
        <div>
          {loading ? (
            <SkeletonLoader width={200} height={16} bottomSpace={18} />
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
