import React, { useState } from 'react'
import { usePersonalData } from '@/hooks'
import { absoluteRoutes } from '@/config/routes'
import { Button } from '@/shared/components'
import SidenavBase, { NavItemType } from '@/components/Sidenav/SidenavBase'
import FollowedChannels from './FollowedChannels'

const viewerSidenavItems: NavItemType[] = [
  {
    icon: 'home-fill',
    name: 'Home',
    to: absoluteRoutes.viewer.index(),
  },
  {
    icon: 'videos',
    name: 'Videos',
    to: absoluteRoutes.viewer.videos(),
  },
  {
    icon: 'channels',
    name: 'Channels',
    to: absoluteRoutes.viewer.channels(),
  },
]

export const ViewerSidenav: React.FC = () => {
  const [expanded, setExpanded] = useState(false)
  const {
    state: { followedChannels },
  } = usePersonalData()

  return (
    <SidenavBase
      expanded={expanded}
      toggleSideNav={setExpanded}
      items={viewerSidenavItems}
      additionalContent={
        <FollowedChannels onClick={() => setExpanded(false)} followedChannels={followedChannels} expanded={expanded} />
      }
      buttonsContent={
        <>
          <Button
            variant="secondary"
            onClick={() => setExpanded(false)}
            icon="external"
            to={absoluteRoutes.studio.index()}
          >
            Joystream studio
          </Button>
          <Button icon="add-video">New Video</Button>
        </>
      }
    />
  )
}
