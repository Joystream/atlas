import styled from '@emotion/styled'
import React from 'react'

import { VideoFieldsFragment } from '@/api/queries'
import { Grid } from '@/shared/components'

import { VideoPreview } from '.'

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
export const VideoGrid: React.FC<VideoGridProps> = ({ videos, showChannel = true, onVideoClick, onChannelClick }) => {
  return (
    <Grid>
      {videos.map((v, idx) => (
        <StyledVideoPreview
          key={idx}
          id={v.id}
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
