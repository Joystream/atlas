import React from 'react'
import styled from '@emotion/styled'

import { Grid } from '@/shared/components'
import VideoPreview from './VideoPreviewWithNavigation'
import { VideoFieldsFragment } from '@/api/queries/videos'

const StyledVideoPreview = styled(VideoPreview)`
  margin: 0 auto;
  width: 100%;
`

type VideoGridProps = {
  videos: VideoFieldsFragment[]
  showChannel?: boolean
}
const VideoGrid: React.FC<VideoGridProps> = ({ videos, showChannel = true }) => {
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
        />
      ))}
    </Grid>
  )
}
export default VideoGrid
