import { FC } from 'react'

import { Grid } from '@/components/Grid'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'

type SkeletonLoaderVideoGridProps = {
  videosCount?: number
  onResize?: (sizes: number[]) => void
}
export const SkeletonLoaderVideoGrid: FC<SkeletonLoaderVideoGridProps> = ({ videosCount = 10, onResize }) => {
  return (
    <Grid onResize={onResize}>
      {Array.from({ length: videosCount }).map((_, idx) => (
        <VideoTileViewer key={idx} />
      ))}
    </Grid>
  )
}
