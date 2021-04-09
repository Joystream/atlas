import React, { useState } from 'react'
import { useDrafts, useActiveUser } from '@/hooks'
import { absoluteRoutes } from '@/config/routes'
import { Button } from '@/shared/components'
import SidenavBase, { NavItemType } from '@/components/Sidenav/SidenavBase'

const studioNavbarItems: NavItemType[] = [
  {
    icon: 'my-videos',
    name: 'Videos',
    expandedName: 'My Videos',
    to: absoluteRoutes.studio.videos(),
  },
  {
    icon: 'my-channel',
    name: 'Channel',
    expandedName: 'My Channel',
    to: absoluteRoutes.studio.editChannel(),
  },
  {
    icon: 'my-uploads',
    name: 'Uploads',
    expandedName: 'My Uploads',
    to: absoluteRoutes.studio.uploads(),
  },
]

export const StudioSidenav: React.FC = () => {
  const [expanded, setExpanded] = useState(false)
  const { activeUser } = useActiveUser()
  const channelId = activeUser.channelId ?? undefined
  const { unseenDrafts } = useDrafts('video', channelId)

  const handleNewVideoOpen = () => {
    // TODO add logic for opening new video view
  }

  const studioNavbarItemsWithBadge = studioNavbarItems.map((item) =>
    item.to === absoluteRoutes.studio.videos() ? { ...item, badgeNumber: unseenDrafts.length } : item
  )

  return (
    <SidenavBase
      expanded={expanded}
      toggleSideNav={setExpanded}
      isStudio
      items={studioNavbarItemsWithBadge}
      buttonsContent={
        <>
          <Button
            variant="secondary"
            onClick={() => setExpanded(false)}
            icon="external"
            to={absoluteRoutes.viewer.index()}
          >
            Joystream
          </Button>
          <Button icon="add-video" onClick={handleNewVideoOpen}>
            New Video
          </Button>
        </>
      }
    />
  )
}
