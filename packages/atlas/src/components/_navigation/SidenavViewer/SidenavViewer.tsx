import { FC, useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { SvgActionMember, SvgActionNewTab } from '@/components/_icons'
import { SvgAtlasLogoFull } from '@/components/_illustrations'
import { viewerNavItems } from '@/config/nav'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user/user.hooks'
import { ConsoleLogger } from '@/utils/logs'

import { FollowedChannels } from './FollowedChannels'

import { SidenavBase } from '../SidenavBase'

export const SidenavViewer: FC = () => {
  const [expanded, setExpanded] = useState(false)
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)

  const handleChannelNotFound = (id: string) => {
    ConsoleLogger.warn(`Followed channel not found, removing id: ${id}`)
    updateChannelFollowing(id, false)
  }

  const { signIn, isLoggedIn } = useUser()

  const closeAndSignIn = () => {
    setExpanded(false)
    signIn()
  }
  const buttonsContent = !isLoggedIn ? (
    <Button icon={<SvgActionMember />} onClick={closeAndSignIn}>
      Connect wallet
    </Button>
  ) : (
    <Button
      variant="secondary"
      to={absoluteRoutes.studio.index()}
      onClick={() => setExpanded(false)}
      icon={<SvgActionNewTab />}
    >
      Go to Studio
    </Button>
  )

  return (
    <SidenavBase
      expanded={expanded}
      toggleSideNav={setExpanded}
      logoNode={<SvgAtlasLogoFull />}
      logoLinkUrl={absoluteRoutes.viewer.index()}
      items={viewerNavItems}
      additionalContent={
        <FollowedChannels
          onClick={() => setExpanded(false)}
          onChannelNotFound={handleChannelNotFound}
          followedChannels={followedChannels}
          expanded={expanded}
        />
      }
      buttonsContent={buttonsContent}
    />
  )
}
