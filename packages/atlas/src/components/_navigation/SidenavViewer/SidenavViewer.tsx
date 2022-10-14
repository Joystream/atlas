import { FC, useState } from 'react'

import {
  SvgActionMember,
  SvgActionNewTab,
  SvgSidebarChannels,
  SvgSidebarExplore,
  SvgSidebarHome,
  SvgSidebarNew,
  SvgSidebarNft,
  SvgSidebarPopular,
  SvgSidebarYpp,
} from '@/assets/icons'
import { AppLogo } from '@/components/AppLogo'
import { Button } from '@/components/_buttons/Button'
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
    icon: <SvgSidebarPopular />,
    name: 'Popular',
    to: absoluteRoutes.viewer.popular(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarNft />,
    expandedName: 'Video NFTs',
    name: 'NFT',
    to: absoluteRoutes.viewer.nfts(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarNew />,
    expandedName: 'New & Noteworthy',
    name: 'New',
    to: absoluteRoutes.viewer.new(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarExplore />,
    name: 'Discover',
    to: absoluteRoutes.viewer.discover(),
    bottomNav: false,
  },
  {
    icon: <SvgSidebarChannels />,
    name: 'Channels',
    to: absoluteRoutes.viewer.channels(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarYpp />,
    name: 'YPP',
    expandedName: 'YouTube Partner Program',
    to: absoluteRoutes.viewer.ypp(),
    bottomNav: false,
  },
]
export const SidenavViewer: FC = () => {
  const [expanded, setExpanded] = useState(false)
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)
  const { openSignInDialog } = useDisplaySignInDialog()

  const handleChannelNotFound = (id: string) => {
    ConsoleLogger.warn(`Followed channel not found, removing id: ${id}`)
    updateChannelFollowing(id, false)
  }

  const { signIn, isLoggedIn } = useUser()

  const closeAndSignIn = () => {
    setExpanded(false)
    signIn(undefined, openSignInDialog)
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
