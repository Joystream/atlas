import React, { useState } from 'react'

import { NavItemType, SidenavBase } from '@/components/Sidenav/SidenavBase'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers'
import { Button } from '@/shared/components'
import { SvgGlyphExternal, SvgNavChannels, SvgNavHome, SvgNavNew, SvgNavPopular, SvgNavVideos } from '@/shared/icons'
import { openInNewTab } from '@/utils/browser'
import { Logger } from '@/utils/logger'

import { FollowedChannels } from './FollowedChannels'

const viewerSidenavItems: NavItemType[] = [
  {
    icon: <SvgNavHome />,
    name: 'Home',
    to: absoluteRoutes.viewer.index(),
  },
  {
    icon: <SvgNavPopular />,
    name: 'Popular',
    to: absoluteRoutes.viewer.popular(),
  },
  {
    icon: <SvgNavNew />,
    name: 'New',
    to: absoluteRoutes.viewer.new(),
  },
  {
    icon: <SvgNavVideos />,
    name: 'Videos',
    to: absoluteRoutes.viewer.videos(),
  },
  {
    icon: <SvgNavChannels />,
    name: 'Channels',
    to: absoluteRoutes.viewer.channels(),
  },
]

export const ViewerSidenav: React.FC = () => {
  const [expanded, setExpanded] = useState(false)
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)

  const handleChannelNotFound = (id: string) => {
    Logger.warn(`Followed channel not found, removing id: ${id}`)
    updateChannelFollowing(id, false)
  }

  return (
    <SidenavBase
      expanded={expanded}
      toggleSideNav={setExpanded}
      items={viewerSidenavItems}
      additionalContent={
        <FollowedChannels
          onClick={() => setExpanded(false)}
          onChannelNotFound={handleChannelNotFound}
          followedChannels={followedChannels}
          expanded={expanded}
        />
      }
      buttonsContent={
        <>
          <Button
            variant="secondary"
            onClick={() => {
              setExpanded(false)
              openInNewTab(absoluteRoutes.studio.index(), true)
            }}
            icon={<SvgGlyphExternal />}
          >
            Joystream studio
          </Button>
        </>
      }
    />
  )
}
