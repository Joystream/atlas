import React from 'react'
import styled from '@emotion/styled'

import { Grid } from '@/shared/components'
import ChannelPreview from './ChannelPreviewWithNavigation'
import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/channels.generated'

const StyledChannelPreview = styled(ChannelPreview)`
  margin: 0 auto;
`

type ChannelGridProps = {
  channels: BasicChannelFieldsFragment[]
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
