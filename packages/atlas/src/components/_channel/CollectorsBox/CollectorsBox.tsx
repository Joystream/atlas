import { FC, MouseEvent, useState } from 'react'

import { Avatar } from '@/components/Avatar'
import { AvatarGroup, AvatarGroupUrlAvatar } from '@/components/Avatar/AvatarGroup'
import { ListItem } from '@/components/ListItem'
import { Text } from '@/components/Text'
import { SvgActionPlus } from '@/components/_icons'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { cVar } from '@/styles'

import { CollectorsBoxWrapper, PlusIconBackground, PlusIconWrapper, StyledLink } from './CollectorsBox.styles'

export type Collector = AvatarGroupUrlAvatar & { nftsAmount?: number; memberUrl?: string }

export type CollectorsBoxProps = {
  collectors: Collector[]
  maxShowedCollectors?: number
}

export const CollectorsBox: FC<CollectorsBoxProps> = ({ collectors, maxShowedCollectors = 5 }) => {
  const [open, setOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const mappedCollectors = [...collectors].map((collector) => ({
    ...collector,
    onClick: (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      collector.onClick?.(e)
    },
  }))

  const avatarsWhenTooManyCollectors: Collector[] = [
    ...mappedCollectors.slice(0, maxShowedCollectors - 1),
    {
      children: (
        <PlusIconBackground background={isHovered ? cVar('colorBackgroundStrong') : cVar('colorBackground')}>
          <PlusIconWrapper isHovered={isHovered}>
            <SvgActionPlus />
          </PlusIconWrapper>
        </PlusIconBackground>
      ),
      tooltipText: `${mappedCollectors.length} collectors`,
      withoutOutline: true,
    },
  ]

  const avatars: Collector[] =
    mappedCollectors.length < maxShowedCollectors ? mappedCollectors : avatarsWhenTooManyCollectors
  return (
    <>
      <CollectorsBoxWrapper
        onClick={() => {
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
          avatarStrokeColor={isHovered ? cVar('colorBackgroundStrong') : cVar('colorBackground')}
        />
      </CollectorsBoxWrapper>
      <DialogModal show={open} title="NFTs collected by" onExitClick={() => setOpen(false)} dividers>
        {mappedCollectors.map((collector, idx) => (
          <StyledLink key={idx} to={collector.memberUrl || ''}>
            <ListItem
              nodeStart={<Avatar size="small" assetUrl={collector.url} />}
              nodeEnd={
                <Text variant="t100" secondary>
                  Owns {collector.nftsAmount}
                </Text>
              }
              label={collector?.tooltipText || ''}
            />
          </StyledLink>
        ))}
      </DialogModal>
    </>
  )
}
