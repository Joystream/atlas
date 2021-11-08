import React from 'react'
import { Navigate } from 'react-router-dom'

import { StudioLoading } from '@/components/StudioLoading'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user'

const DEFAULT_ROUTE = absoluteRoutes.studio.videos()

type StudioEntrypointProps = {
  enterLocation: string
}

export const StudioEntrypoint: React.FC<StudioEntrypointProps> = ({ enterLocation }) => {
  const {
    activeAccountId,
    activeMemberId,
    activeChannelId,
    setActiveUser,
    extensionConnected,
    memberships,
    membershipsLoading,
    activeMembership,
    activeMembershipLoading,
  } = useUser()

  const hasMemberships = !membershipsLoading && memberships?.length

  const accountSet = !!activeAccountId && !!extensionConnected
  const memberSet = accountSet && !!activeMemberId
  const channelSet = memberSet && !!activeChannelId

  // not signed user with not created memberships and/or no extension
  if (!hasMemberships) {
    // go to /signin/join
    return <Navigate to={absoluteRoutes.studio.signInJoin()} replace />
  }

  // not signed user with extension and with created memberships
  if (hasMemberships && !memberSet) {
    // go to /signin
    return <Navigate to={absoluteRoutes.studio.signIn()} replace />
  }

  // signed users
  if (!activeMembershipLoading && memberSet && !channelSet && hasMemberships) {
    if (!activeMembership?.channels.length) {
      return <Navigate to={absoluteRoutes.studio.newChannel()} replace />
    }
    setActiveUser({ channelId: activeMembership.channels[0].id })
    return <Navigate to={enterLocation} replace />
  }

  if (channelSet) {
    return <Navigate to={DEFAULT_ROUTE} replace />
  }

  return <StudioLoading />
}
