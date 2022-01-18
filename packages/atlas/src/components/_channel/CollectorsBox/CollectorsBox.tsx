import React, { useState } from 'react'

import { Avatar } from '@/components/Avatar'
import { AvatarGroup, AvatarGroupSingleAvatar } from '@/components/Avatar/AvatarGroup'
import { ListItem } from '@/components/ListItem'
import { Text } from '@/components/Text'
import { SvgActionPlus } from '@/components/_icons'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { cVar } from '@/styles'

import { CollectorsBoxWrapper, PlusIconBackground, PlusIconWrapper } from './CollectorsBox.styles'

type Collector = AvatarGroupSingleAvatar & { nftsAmount?: number }

export type CollectorsBoxProps = {
  collectors: Collector[]
}

const MAX_SHOWED_COLLECTORS = 5

export const CollectorsBox: React.FC<CollectorsBoxProps> = ({ collectors }) => {
  const [open, setOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const sortedCollectors = [...collectors]
    .sort((a, b) => (b?.nftsAmount || 0) - (a?.nftsAmount || 0))
    .map((collector) => ({
      ...collector,
      onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation()
        collector.onClick?.(e)
      },
    }))

  const avatarsWhenCollectorsMoreThan5: Collector[] = [
    ...sortedCollectors.slice(0, MAX_SHOWED_COLLECTORS - 1),
    {
      children: (
        <PlusIconBackground background={isHovered ? cVar('colorBackgroundStrong') : cVar('colorBackground')}>
          <PlusIconWrapper isHovered={isHovered}>
            <SvgActionPlus />
          </PlusIconWrapper>
        </PlusIconBackground>
      ),
      tooltipText: `${sortedCollectors.length} collectors`,
      withoutOutline: true,
    },
  ]

  const avatars: Collector[] =
    sortedCollectors.length < MAX_SHOWED_COLLECTORS ? sortedCollectors : avatarsWhenCollectorsMoreThan5

  return (
    <CollectorsBoxWrapper
      onClick={(e) => {
        setOpen(true)
        setIsHovered(false)
      }}
      onMouseMove={() => !open && setIsHovered(true)}
      onMouseOut={() => !open && setIsHovered(false)}
    >
      <Text variant="t200" secondary={!isHovered}>
        NFTs collected by
      </Text>
      <AvatarGroup
        avatars={avatars}
        direction="right"
        avatarStrokeColor={isHovered ? cVar('colorBackgroundStrong') : cVar('colorBackground')}
      />
      <DialogModal show={open} title="NFTs collected by" onExitClick={() => setOpen(false)} dividers>
        {sortedCollectors.map((collector, idx) => (
          <ListItem
            nodeStart={<Avatar size="small" assetUrl={collector.assetUrl} />}
            nodeEnd={
              <Text variant="t100" secondary>
                Owns {collector.nftsAmount}
              </Text>
            }
            key={idx}
            label={collector?.tooltipText || ''}
          />
        ))}
      </DialogModal>
    </CollectorsBoxWrapper>
  )
}
