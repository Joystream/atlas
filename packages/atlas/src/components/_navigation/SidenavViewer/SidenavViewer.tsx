import styled from '@emotion/styled'
import { FC, useState } from 'react'

import {
  SvgActionAddChannel,
  SvgActionMember,
  SvgActionMoney,
  SvgActionNewTab,
  SvgSidebarHome,
  SvgSidebarMarketplace,
  SvgSidebarReferrals,
} from '@/assets/icons'
import { AppLogo } from '@/components/AppLogo'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { getCorrectLoginModal } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useUser } from '@/providers/user/user.hooks'
import { square } from '@/styles'

import { FollowedChannels } from './FollowedChannels'

import { SidenavBase } from '../SidenavBase'

const StyledSvgActionMoney = styled(SvgActionMoney)`
  ${square(24)}
`

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
          icon: <StyledSvgActionMoney />,
          name: 'Earn',
          expandedName: 'Creator Rewards',
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
  const { activeMembership } = useUser()
  const {
    actions: { setAuthModalOpenName },
  } = useAuthStore()
  const hasAtLeastOneChannel = !!activeMembership?.channels.length && activeMembership?.channels.length >= 1

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
      additionalContent={<FollowedChannels onClick={() => setExpanded(false)} expanded={expanded} />}
      buttonsContent={buttonsContent}
    />
  )
}
