import React from 'react'
import styled from '@emotion/styled'

import { Grid } from '@/shared/components'
import ChannelPreview from './ChannelPreview'
import { BasicChannelFieldsFragment } from '@/api/queries'

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
        <StyledChannelPreview key={c.id} id={c.id} />
      ))}
    </Grid>
  )
}
export default ChannelGrid
