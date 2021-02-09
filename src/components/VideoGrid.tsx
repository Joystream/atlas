import React from 'react'
import styled from '@emotion/styled'

import { Grid } from '@/shared/components'
import VideoPreview from './VideoPreview'
import { VideoFieldsFragment } from '@/api/queries'

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
        <StyledVideoPreview key={idx} id={v.id} showChannel={showChannel} />
      ))}
    </Grid>
  )
}
export default VideoGrid
