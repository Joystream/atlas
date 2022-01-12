import styled from '@emotion/styled'
import React from 'react'

import { Pill } from '@/components/Pill'
import { SvgActionDraft, SvgActionEdit, SvgActionTrash, SvgIllustrativeEdit } from '@/components/_icons'
import { singleDraftSelector, useDraftStore } from '@/providers/drafts'
import { square } from '@/styles'
import { formatDateAgo } from '@/utils/time'

import { VideoTile } from '../VideoTile'

type VideoTilePublisherProps = {
  id?: string
  onClick?: () => void
  onDeleteVideoClick?: () => void
}

export const VideoTileDraft: React.FC<VideoTilePublisherProps> = React.memo(({ id, onDeleteVideoClick, onClick }) => {
  const draft = useDraftStore(singleDraftSelector(id ?? ''))

  const kebabMenuItems = [
    {
      icon: <SvgActionEdit />,
      onClick: onClick,
      title: 'Edit draft',
    },
    {
      icon: <SvgActionTrash />,
      onClick: onDeleteVideoClick,
      title: 'Delete draft',
    },
  ]

  return (
    <VideoTile
      onClick={onClick}
      contentSlot={<CoverNoImage />}
      slots={{
        center: {
          element: <SvgIllustrativeEdit />,
          type: 'hover',
        },
        bottomLeft: {
          element: <Pill icon={<SvgActionDraft />} label="Draft" />,
        },
      }}
      detailsVariant="withoutChannel"
      videoTitle={draft?.title || 'Untitled'}
      videoSubTitle={`Last updated ${formatDateAgo(new Date(draft?.updatedAt ?? 0))}`}
      kebabMenuItems={kebabMenuItems}
    />
  )
})

export const CoverNoImage = styled.div`
  ${square('100%')}

  background: linear-gradient(125deg, rgb(16 18 20) 30%, rgb(34 36 38) 65%, rgb(16 18 20) 100%);
`

VideoTileDraft.displayName = 'VideoTileDraft'
