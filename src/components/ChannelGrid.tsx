import React from 'react'
import styled from '@emotion/styled'

import { BasicChannelFields } from '@/api/queries/__generated__/BasicChannelFields'
import { Grid } from '@/shared/components'
import ChannelPreview from './ChannelPreviewWithNavigation'

const StyledChannelPreview = styled(ChannelPreview)`
  margin: 0 auto;
`

type ChannelGridProps = {
  channels: BasicChannelFields[]
} & React.ComponentProps<typeof Grid>

const ChannelGrid: React.FC<ChannelGridProps> = ({ channels, ...gridProps }) => {
  return (
    <Grid {...gridProps}>
      {channels.map((c) => (
        <StyledChannelPreview key={c.id} id={c.id} name={c.handle} avatarURL={c.avatarPhotoUrl} />
      ))}
    </Grid>
  )
}
export default ChannelGrid
