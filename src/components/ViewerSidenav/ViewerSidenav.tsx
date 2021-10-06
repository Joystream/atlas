import React, { useState } from 'react'

import { SidenavBase } from '@/components/SidenavBase'
import { viewerNavItems } from '@/config/nav'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers/personalData'
import { Button } from '@/shared/components/Button'
import { SvgGlyphExternal } from '@/shared/icons'
import { openInNewTab } from '@/utils/browser'
import { ConsoleLogger } from '@/utils/logs'

import { FollowedChannels } from './FollowedChannels'

export const ViewerSidenav: React.FC = () => {
  const [expanded, setExpanded] = useState(false)
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)

  const handleChannelNotFound = (id: string) => {
    ConsoleLogger.warn(`Followed channel not found, removing id: ${id}`)
    updateChannelFollowing(id, false)
  }

  return (
    <SidenavBase
      expanded={expanded}
      toggleSideNav={setExpanded}
      items={viewerNavItems}
      additionalContent={
        followedChannels.length ? (
          <FollowedChannels
            onClick={() => setExpanded(false)}
            onChannelNotFound={handleChannelNotFound}
            followedChannels={followedChannels}
            expanded={expanded}
          />
        ) : null
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
