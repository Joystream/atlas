import React from 'react'
import { usePersonalData } from '@/hooks'
import { absoluteRoutes } from '@/config/routes'
import SidenavBase, { NavItemType } from '@/components/Sidenav/SidenavBase'

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
  const {
    state: { followedChannels },
  } = usePersonalData()

  return <SidenavBase items={viewerSidenavItems} followedChannels={followedChannels} />
}
