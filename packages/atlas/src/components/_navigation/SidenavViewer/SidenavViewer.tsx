import React, { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { SvgActionNewTab } from '@/components/_icons'
import { SvgJoystreamLogoFull } from '@/components/_illustrations'
import { viewerNavItems } from '@/config/nav'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers/personalData'
import { ConsoleLogger } from '@/utils/logs'

import { FollowedChannels } from './FollowedChannels'

import { SidenavBase } from '../SidenavBase'

export const SidenavViewer: React.FC = () => {
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
      logoNode={<SvgJoystreamLogoFull />}
      logoLinkUrl={absoluteRoutes.viewer.index()}
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
            to={absoluteRoutes.studio.index()}
            onClick={() => setExpanded(false)}
            icon={<SvgActionNewTab />}
          >
            Joystream Studio
          </Button>
        </>
      }
    />
  )
}
