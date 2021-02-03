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
  onChannelClick?: (id: string) => void
} & React.ComponentProps<typeof Grid>

const ChannelGrid: React.FC<ChannelGridProps> = ({ channels, onChannelClick, ...gridProps }) => {
  const handleClick = (id: string) => {
    if (onChannelClick) {
      onChannelClick(id)
    }
  }

  return (
    <Grid {...gridProps}>
      {channels.map((c) => (
        <StyledChannelPreview key={c.id} id={c.id} onClick={() => handleClick(c.id)} />
      ))}
    </Grid>
  )
}
export default ChannelGrid
