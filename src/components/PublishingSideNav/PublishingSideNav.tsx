import React from 'react'
import { studioRoutes } from '@/config/routes'
import { ViewerSideNav } from '@/components'
import { NavItemType } from '@/components/ViewerSideNav'

const PUBLISHING_SIDENAVBAR_ITEMS: NavItemType[] = [
  {
    icon: 'my-videos',
    name: 'Videos',
    expandedName: 'My Videos',
    to: studioRoutes.videos(),
  },
  {
    icon: 'my-channel',
    name: 'Channel',
    expandedName: 'My Channel',
    to: studioRoutes.editChannel(),
  },
  {
    icon: 'my-uploads',
    name: 'Uploads',
    expandedName: 'My Uploads',
    to: studioRoutes.uploads(),
  },
]

const PublishingSideNav: React.FC = () => {
  return <ViewerSideNav items={PUBLISHING_SIDENAVBAR_ITEMS} isStudio />
}

export default PublishingSideNav
