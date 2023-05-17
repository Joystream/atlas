import { FC, useState } from 'react'

import {
  SvgActionMember,
  SvgActionNewTab,
  SvgSidebarExplore,
  SvgSidebarHome,
  SvgSidebarMarketplace,
  SvgSidebarYpp,
} from '@/assets/icons'
import { AppLogo } from '@/components/AppLogo'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user/user.hooks'
import { ConsoleLogger } from '@/utils/logs'

import { FollowedChannels } from './FollowedChannels'

import { SidenavBase } from '../SidenavBase'

export const viewerNavItems = [
  {
    icon: <SvgSidebarHome />,
    name: 'Home',
    to: absoluteRoutes.viewer.index(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarMarketplace />,
    expandedName: 'Marketplace',
    name: 'Market',
    to: absoluteRoutes.viewer.marketplace(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarExplore />,
    name: 'Discover',
    to: absoluteRoutes.viewer.discover(),
    bottomNav: true,
  },
  ...(atlasConfig.features.ypp.googleConsoleClientId
    ? [
        {
          icon: <SvgSidebarYpp />,
          name: 'YPP',
          expandedName: 'YouTube Partner Program',
          to: absoluteRoutes.viewer.ypp(),
          bottomNav: true,
        },
      ]
    : []),
]
export const SidenavViewer: FC = () => {
  const [expanded, setExpanded] = useState(false)
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)
  const unFollow = usePersonalDataStore((state) => state.actions.unfollowChannel)
  const { openSignInDialog } = useDisplaySignInDialog()

  const handleChannelNotFound = (id: string) => {
    ConsoleLogger.warn(`Followed channel not found, removing id: ${id}`)
    unFollow(id)
  }

  const { signIn, isLoggedIn } = useUser()

  const closeAndSignIn = () => {
    setExpanded(false)
    signIn(undefined, openSignInDialog)
  }
  const buttonsContent = !isLoggedIn ? (
    <Button icon={<SvgActionMember />} onClick={closeAndSignIn}>
      Log in
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
      logoNode={<AppLogo variant="full" height={32} width={undefined} />}
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
