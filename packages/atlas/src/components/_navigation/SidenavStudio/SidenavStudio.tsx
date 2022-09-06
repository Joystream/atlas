import { FC, useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import {
  SvgActionAddVideo,
  SvgActionPlay,
  SvgSidebarChannel,
  SvgSidebarUpload,
  SvgSidebarVideos,
} from '@/components/_icons'
import { SvgAtlasLogoStudio } from '@/components/_illustrations'
import { NavItemType } from '@/components/_navigation/NavItem'
import { SidenavBase } from '@/components/_navigation/SidenavBase'
import { absoluteRoutes } from '@/config/routes'
import { chanelUnseenDraftsSelector, useDraftStore } from '@/providers/drafts'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { useUser } from '@/providers/user/user.hooks'

const studioNavbarItems: NavItemType[] = [
  {
    icon: <SvgSidebarVideos />,
    name: 'Videos',
    expandedName: 'My videos',
    to: absoluteRoutes.studio.videos(),
  },
  {
    icon: <SvgSidebarChannel />,
    name: 'Channel',
    expandedName: 'My channel',
    to: absoluteRoutes.studio.editChannel(),
  },
  {
    icon: <SvgSidebarUpload />,
    name: 'Uploads',
    expandedName: 'My uploads',
    to: absoluteRoutes.studio.uploads(),
  },
]

type SidenavStudioProps = {
  className?: string
}

export const SidenavStudio: FC<SidenavStudioProps> = ({ className }) => {
  const [expanded, setExpanded] = useState(false)
  const { channelId } = useUser()
  const unseenDrafts = useDraftStore(chanelUnseenDraftsSelector(channelId || ''))

  const uploadsStatus = useUploadsStore((state) => state.uploadsStatus)

  const assetsInProgress = Object.values(uploadsStatus).filter(
    (asset) => asset?.lastStatus === 'inProgress' || asset?.lastStatus === 'processing'
  )

  const studioNavbarItemsWithBadge = studioNavbarItems.map((item) => {
    if (item.to === absoluteRoutes.studio.videos()) {
      return { ...item, badgeNumber: unseenDrafts.length }
    }
    if (item.to === absoluteRoutes.studio.uploads()) {
      return { ...item, badgeNumber: assetsInProgress.length }
    }
    return item
  })

  const buttons = (
    <>
      <Button
        icon={<SvgActionAddVideo />}
        onClick={() => setExpanded(false)}
        to={absoluteRoutes.studio.videoWorkspace()}
      >
        Upload video
      </Button>
      <Button
        variant="secondary"
        to={absoluteRoutes.viewer.index()}
        onClick={() => setExpanded(false)}
        icon={<SvgActionPlay />}
      >
        Go to Atlas
      </Button>
    </>
  )

  return (
    <SidenavBase
      expanded={expanded}
      toggleSideNav={setExpanded}
      logoNode={<SvgAtlasLogoStudio />}
      logoLinkUrl={absoluteRoutes.studio.index()}
      items={studioNavbarItemsWithBadge}
      buttonsContent={buttons}
      className={className}
    />
  )
}
