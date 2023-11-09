import { FC, useState } from 'react'

import {
  SvgActionAddChannel,
  SvgActionMember,
  SvgActionNewTab,
  SvgSidebarHome,
  SvgSidebarMarketplace,
  SvgSidebarReferrals,
  SvgSidebarYpp,
} from '@/assets/icons'
import { AppLogo } from '@/components/AppLogo'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { getCorrectLoginModal } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
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
  {
    icon: <SvgSidebarReferrals />,
    name: 'Referrals',
    expandedName: 'Referrals program',
    to: absoluteRoutes.viewer.referrals(),
    bottomNav: true,
  },
]
export const SidenavViewer: FC = () => {
  const [expanded, setExpanded] = useState(false)
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)
  const unFollow = usePersonalDataStore((state) => state.actions.unfollowChannel)
  const { activeMembership } = useUser()
  const {
    actions: { setAuthModalOpenName },
  } = useAuthStore()
  const hasAtLeastOneChannel = !!activeMembership?.channels.length && activeMembership?.channels.length >= 1

  const handleChannelNotFound = (id: string) => {
    ConsoleLogger.warn(`Followed channel not found, removing id: ${id}`)
    unFollow(id)
  }

  const { isLoggedIn } = useUser()

  const closeAndSignIn = () => {
    setExpanded(false)
    setAuthModalOpenName(getCorrectLoginModal())
  }
  const buttonsContent = !isLoggedIn ? (
    <Button icon={<SvgActionMember />} onClick={closeAndSignIn}>
      Sign in
    </Button>
  ) : hasAtLeastOneChannel ? (
    <Button
      variant="secondary"
      to={absoluteRoutes.studio.index()}
      onClick={() => setExpanded(false)}
      icon={<SvgActionNewTab />}
    >
      Go to Studio
    </Button>
  ) : (
    <Button variant="secondary" icon={<SvgActionAddChannel />} onClick={() => setAuthModalOpenName('createChannel')}>
      Create channel
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
