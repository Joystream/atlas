import styled from '@emotion/styled'
import { FC, memo } from 'react'

import { SvgActionDraft, SvgActionEdit, SvgActionTrash, SvgIllustrativeEdit } from '@/assets/icons'
import { Pill } from '@/components/Pill'
import { singleDraftSelector, useDraftStore } from '@/providers/drafts'
import { square } from '@/styles'
import { formatDateAgo } from '@/utils/time'

import { VideoTile } from '../VideoTile'

type VideoTilePublisherProps = {
  id?: string
  onClick?: () => void
  onDeleteVideoClick?: () => void
}

export const VideoTileDraft: FC<VideoTilePublisherProps> = memo(({ id, onDeleteVideoClick, onClick }) => {
  const draft = useDraftStore(singleDraftSelector(id ?? ''))

  const kebabMenuItems = [
    {
      nodeStart: <SvgActionEdit />,
      onClick: onClick,
      label: 'Edit draft',
    },
    {
      nodeStart: <SvgActionTrash />,
      onClick: onDeleteVideoClick,
      label: 'Delete draft',
      destructive: true,
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
