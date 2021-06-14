import React from 'react'

import { Grid } from '@/shared/components'

import { VideoPreview } from '.'

type PlaceholderVideoGridProps = {
  videosCount?: number
}
export const PlaceholderVideoGrid: React.FC<PlaceholderVideoGridProps> = ({ videosCount = 10 }) => {
  return (
    <Grid>
      {Array.from({ length: videosCount }).map((_, idx) => (
        <VideoPreview key={idx} />
      ))}
    </Grid>
  )
}
