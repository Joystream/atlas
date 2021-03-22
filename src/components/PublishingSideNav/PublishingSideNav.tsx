import React from 'react'
import routes from '@/config/routes'
import { ViewerSideNav } from '@/components'
import { NavItemType } from '@/components/ViewerSideNav'

const PUBLISHING_SIDENAVBAR_ITEMS: NavItemType[] = [
  {
    icon: 'my-videos',
    name: 'Videos',
    expandedName: 'My Videos',
    to: routes.studioVideos(),
  },
  {
    icon: 'my-channel',
    name: 'Channel',
    expandedName: 'My Channel',
    to: routes.studioEditChannel(),
  },
  {
    icon: 'my-uploads',
    name: 'Uploads',
    expandedName: 'My Uploads',
    to: routes.studioUploads(),
  },
]

const PublishingSideNav: React.FC = () => {
  return <ViewerSideNav items={PUBLISHING_SIDENAVBAR_ITEMS} isStudio />
}

export default PublishingSideNav
