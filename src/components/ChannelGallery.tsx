import React from 'react'
import styled from '@emotion/styled'

import { ChannelPreviewBase, Gallery } from '@/shared/components'
import ChannelPreview from './ChannelPreview'
import { sizes } from '@/shared/theme'
import { BasicChannelFieldsFragment } from '@/api/queries'

type ChannelGalleryProps = {
  title?: string
  channels?: BasicChannelFieldsFragment[]
  loading?: boolean
  onChannelClick?: (id: string) => void
}

const PLACEHOLDERS_COUNT = 12

const ChannelGallery: React.FC<ChannelGalleryProps> = ({ title, channels, loading, onChannelClick }) => {
  if (!loading && channels?.length === 0) {
    return null
  }

  const handleClick = (id: string) => {
    if (onChannelClick) {
      onChannelClick(id)
    }
  }

  return (
    <Gallery title={title} itemWidth={220} exactWidth={true} paddingLeft={sizes(2, true)} paddingTop={sizes(2, true)}>
      {loading
        ? Array.from({ length: PLACEHOLDERS_COUNT }).map((_, idx) => (
            <ChannelPreviewBase key={`channel-placeholder-${idx}`} />
          ))
        : channels?.map((channel) => <StyledChannelPreview id={channel.id} key={channel.id} onClick={() => handleClick(channel.id)} />)}
    </Gallery>
  )
}

const StyledChannelPreview = styled(ChannelPreview)`
  + * {
    margin-left: 16px;
  }
`

export default ChannelGallery
