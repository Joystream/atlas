import styled from '@emotion/styled'
import React from 'react'

import { VideoFieldsFragment } from '@/api/queries'
import { Grid } from '@/components/Grid'

import { VideoTileViewer } from '../VideoTileViewer'

const StyledVideoTile = styled(VideoTileViewer)`
  margin: 0 auto;
  width: 100%;
`

type VideoGridProps = {
  videos: VideoFieldsFragment[]
}
export const VideoGrid: React.FC<VideoGridProps> = ({ videos }) => {
  return (
    <Grid>
      {videos.map((v, idx) => (
        <StyledVideoTile key={idx} id={v.id} />
      ))}
    </Grid>
  )
}
