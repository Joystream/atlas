import { FC } from 'react'
import { Navigate } from 'react-router-dom'

import { StudioLoading } from '@/components/_loaders/StudioLoading'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user'

const DEFAULT_ROUTE = absoluteRoutes.studio.videos()

type StudioEntrypointProps = {
  enterLocation: string
}

export const StudioEntrypoint: FC<StudioEntrypointProps> = ({ enterLocation }) => {
  const { channelId, isLoggedIn, activeMembership, isAuthLoading } = useUser()

  const channelSet = !!channelId

  // not signed user with not account set and/or no extension
  if (!isLoggedIn) {
    return <Navigate to={absoluteRoutes.studio.signIn()} replace />
  }

  // signed users
  if (!isAuthLoading && !channelSet && isLoggedIn) {
    if (!activeMembership?.channels.length) {
      return <Navigate to={absoluteRoutes.studio.signIn()} replace />
    }
    return <Navigate to={enterLocation} replace />
  }

  if (channelSet) {
    return <Navigate to={DEFAULT_ROUTE} replace />
  }

  return <StudioLoading />
}
