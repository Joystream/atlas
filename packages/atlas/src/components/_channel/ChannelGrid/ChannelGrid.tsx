import styled from '@emotion/styled'
import { ComponentProps, FC } from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries'
import { Grid } from '@/components/Grid'

import { ChannelCard } from '../ChannelCard'

const StyledChannelCard = styled(ChannelCard)`
  width: 100%;
`

type ChannelGridProps = {
  channels: BasicChannelFieldsFragment[]
  onChannelClick?: (id: string, title?: string) => void
} & ComponentProps<typeof Grid>

export const ChannelGrid: FC<ChannelGridProps> = ({ channels, onChannelClick, ...gridProps }) => {
  const handleClick = (id: string, title?: string) => {
    if (onChannelClick) {
      onChannelClick(id, title)
    }
  }

  return (
    <Grid {...gridProps}>
      {channels.map((channel) => (
        <StyledChannelCard
          key={channel.id}
          channel={channel}
          onClick={() => handleClick(channel.id, channel.title || undefined)}
        />
      ))}
    </Grid>
  )
}
