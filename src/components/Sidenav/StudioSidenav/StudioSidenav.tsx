import React from 'react'
import { useDrafts, useActiveUser } from '@/hooks'
import { absoluteRoutes } from '@/config/routes'
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
  const { activeUser } = useActiveUser()
  const channelId = activeUser.channelId ? activeUser.channelId : undefined
  const { unseenDrafts } = useDrafts('video', channelId)
  const channelUnseenDrafts = unseenDrafts.filter((draft) => draft.channelId === channelId)

  const handleNewVideoOpen = () => {
    // TODO add logic for opening new video view
  }

  return (
    <SidenavBase
      isStudio
      items={studioNavbarItems}
      onNewVideoOpenClick={handleNewVideoOpen}
      unseenDraftsNumber={channelUnseenDrafts.length}
    />
  )
}
