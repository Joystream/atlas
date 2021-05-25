import React, { useState } from 'react'
import { usePersonalData } from '@/hooks'
import { absoluteRoutes } from '@/config/routes'
import { Button } from '@/shared/components'
import SidenavBase, { NavItemType } from '@/components/Sidenav/SidenavBase'
import FollowedChannels from './FollowedChannels'
import { SvgGlyphExternal, SvgNavChannels, SvgNavHome, SvgNavVideos } from '@/shared/icons'

const viewerSidenavItems: NavItemType[] = [
  {
    icon: <SvgNavHome />,
    name: 'Home',
    to: absoluteRoutes.viewer.index(),
  },
  {
    icon: <SvgNavVideos />,
    name: 'Videos',
    to: absoluteRoutes.viewer.videos(),
  },
  {
    // TODO: update to channels icon once it exists
    icon: <SvgNavChannels />,
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
            icon={<SvgGlyphExternal />}
            to={absoluteRoutes.studio.index()}
          >
            Joystream studio
          </Button>
        </>
      }
    />
  )
}
