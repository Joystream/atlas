import React, { useState } from 'react'
import { useDrafts, useActiveUser } from '@/hooks'
import { absoluteRoutes } from '@/config/routes'
import { Button } from '@/shared/components'
import SidenavBase, { NavItemType } from '@/components/Sidenav/SidenavBase'
import { SvgGlyphAddVideo, SvgGlyphExternal, SvgNavChannel, SvgNavUpload, SvgNavVideos } from '@/shared/icons'

const studioNavbarItems: NavItemType[] = [
  {
    icon: <SvgNavVideos />,
    name: 'Videos',
    expandedName: 'My videos',
    to: absoluteRoutes.studio.videos(),
  },
  {
    icon: <SvgNavChannel />,
    name: 'Channel',
    expandedName: 'My channel',
    to: absoluteRoutes.studio.editChannel(),
  },
  {
    icon: <SvgNavUpload />,
    name: 'Uploads',
    expandedName: 'My uploads',
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
            icon={<SvgGlyphExternal />}
            to={absoluteRoutes.viewer.index()}
          >
            Joystream
          </Button>
          <Button icon={<SvgGlyphAddVideo />} onClick={handleNewVideoOpen}>
            New Video
          </Button>
        </>
      }
    />
  )
}
