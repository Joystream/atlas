import React from 'react'

import { Grid } from '@/shared/components'

import { VideoTile } from './VideoTile'

type PlaceholderVideoGridProps = {
  videosCount?: number
}
export const PlaceholderVideoGrid: React.FC<PlaceholderVideoGridProps> = ({ videosCount = 10 }) => {
  return (
    <Grid>
      {Array.from({ length: videosCount }).map((_, idx) => (
        <VideoTile key={idx} />
      ))}
    </Grid>
  )
}
