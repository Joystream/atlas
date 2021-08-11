import styled from '@emotion/styled'
import React from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries'
import { Grid } from '@/shared/components'

import { ChannelCard } from './ChannelCard'

const StyledChannelCard = styled(ChannelCard)`
  margin: 0 auto;
`

type ChannelGridProps = {
  channels: BasicChannelFieldsFragment[]
  onChannelClick?: (id: string) => void
} & React.ComponentProps<typeof Grid>

export const ChannelGrid: React.FC<ChannelGridProps> = ({ channels, onChannelClick, ...gridProps }) => {
  const handleClick = (id: string) => {
    if (onChannelClick) {
      onChannelClick(id)
    }
  }

  return (
    <Grid {...gridProps}>
      {channels.map(({ id }) => (
        <StyledChannelCard key={id} id={id} onClick={() => handleClick(id)} />
      ))}
    </Grid>
  )
}
