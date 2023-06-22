import { FC, MouseEvent, useState } from 'react'

import { SvgActionPlus } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { AvatarGroup, AvatarGroupUrlAvatar } from '@/components/Avatar/AvatarGroup'
import { ListItem } from '@/components/ListItem'
import { Text } from '@/components/Text'
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
        <Text as="span" variant="t200" color={!isHovered ? 'colorText' : undefined}>
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
              nodeStart={<Avatar size={40} assetUrl={collector.urls} />}
              nodeEnd={
                <Text as="span" variant="t100" color="colorText">
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
