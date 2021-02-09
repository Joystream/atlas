import React from 'react'
import styled from '@emotion/styled'

import { Grid } from '@/shared/components'
import VideoPreview from './VideoPreviewWithNavigation'
import { VideoFieldsFragment } from '@/api/queries'

const StyledVideoPreview = styled(VideoPreview)`
  margin: 0 auto;
  width: 100%;
`

type VideoGridProps = {
  videos: VideoFieldsFragment[]
  showChannel?: boolean
  onVideoClick?: (id: string) => void
  onChannelClick?: (id: string) => void
}
const VideoGrid: React.FC<VideoGridProps> = ({ videos, showChannel = true, onVideoClick, onChannelClick }) => {
  return (
    <Grid>
      {videos.map((v, idx) => (
        <StyledVideoPreview
          id={v.id}
          channelId={v.channel.id}
          key={idx}
          title={v.title}
          channelName={v.channel.handle}
          channelAvatarURL={v.channel.avatarPhotoUrl}
          createdAt={v.createdAt}
          duration={v.duration}
          views={v.views}
          posterURL={v.thumbnailUrl}
          showChannel={showChannel}
          onClick={() => {
            if (onVideoClick) {
              onVideoClick(v.id)
            }
          }}
          onChannelClick={() => {
            if (onChannelClick) {
              onChannelClick(v.channel.id)
            }
          }}
        />
      ))}
    </Grid>
  )
}
export default VideoGrid
