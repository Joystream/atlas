import React from 'react'

import { Grid } from '@/components/Grid'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'

type SkeletonLoaderVideoGridProps = {
  videosCount?: number
}
export const SkeletonLoaderVideoGrid: React.FC<SkeletonLoaderVideoGridProps> = ({ videosCount = 10 }) => {
  return (
    <Grid>
      {Array.from({ length: videosCount }).map((_, idx) => (
        <VideoTileViewer key={idx} />
      ))}
    </Grid>
  )
}
