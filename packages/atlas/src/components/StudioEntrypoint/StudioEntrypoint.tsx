import { FC } from 'react'
import { Navigate } from 'react-router-dom'

import { StudioLoading } from '@/components/_loaders/StudioLoading'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user/user.hooks'

const DEFAULT_ROUTE = absoluteRoutes.studio.videos()

type StudioEntrypointProps = {
  enterLocation: string
}

export const INITIAL_ROUTES = [absoluteRoutes.studio.index(), absoluteRoutes.studio.signIn()]

export const StudioEntrypoint: FC<StudioEntrypointProps> = ({ enterLocation }) => {
  const { channelId, isLoggedIn, activeMembership } = useUser()

  const channelSet = !!(channelId && activeMembership?.channels.find((channel) => channel.id === channelId))

  // not signed user with not account set and/or no extension
  if (!isLoggedIn) {
    return <Navigate to={absoluteRoutes.studio.signIn()} replace />
  }

  // signed users
  if (!channelSet && isLoggedIn) {
    if (!activeMembership?.channels.length) {
      return <Navigate to={absoluteRoutes.studio.signIn()} replace />
    }
    return <Navigate to={INITIAL_ROUTES.includes(enterLocation) ? DEFAULT_ROUTE : enterLocation} replace />
  }

  if (channelSet) {
    return <Navigate to={INITIAL_ROUTES.includes(enterLocation) ? DEFAULT_ROUTE : enterLocation} replace />
  }

  return <StudioLoading />
}
