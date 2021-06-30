import styled from '@emotion/styled'
import React from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries'
import { Gallery } from '@/shared/components'
import { sizes } from '@/shared/theme'

import { ChannelPreview } from './ChannelPreview'

type ChannelGalleryProps = {
  title?: string
  channels?: BasicChannelFieldsFragment[]
  loading?: boolean
  onChannelClick?: (id: string) => void
}

const PLACEHOLDERS_COUNT = 12

export const ChannelGallery: React.FC<ChannelGalleryProps> = ({ title, channels = [], loading, onChannelClick }) => {
  if (!loading && channels?.length === 0) {
    return null
  }

  const createClickHandler = (id?: string) => () => id && onChannelClick && onChannelClick(id)

  const placeholderItems = Array.from({ length: loading ? PLACEHOLDERS_COUNT : 0 }, () => ({ id: undefined }))
  return (
    <Gallery title={title} itemWidth={220} exactWidth={true} paddingLeft={sizes(2, true)} paddingTop={sizes(2, true)}>
      {[...channels, ...placeholderItems].map((channel, idx) => (
        <StyledChannelPreview key={idx} id={channel.id} onClick={createClickHandler(channel.id)} />
      ))}
    </Gallery>
  )
}

const StyledChannelPreview = styled(ChannelPreview)`
  + * {
    margin-left: 16px;
  }
`
