import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo } from 'react'

import { useMemberships } from '@/api/hooks/membership'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { AssetLogger, SentryLogger } from '@/utils/logs'

import { useUserStore } from './user.store'
import { UserContextValue } from './user.types'

import { useAuth } from '../auth/auth.hooks'

const UserContext = createContext<undefined | UserContextValue>(undefined)
UserContext.displayName = 'UserContext'

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const { channelId } = useUserStore((state) => state)
  const { setActiveUser } = useUserStore((state) => state.actions)
  const { currentUser } = useAuth()

  const {
    memberships: currentMemberships,
    previousData,
    loading: membershipsLoading,
    refetch,
    error,
  } = useMemberships(
    {
      where: {
        id_eq: currentUser?.id,
      },
    },
    {
      skip: !currentUser,
      onError: (error) =>
        SentryLogger.error('Failed to fetch user memberships', 'UserProvider', error, { user: currentUser ?? {} }),
    }
  )

  const memberships = currentMemberships ?? previousData?.memberships

  const refetchUserMemberships = useCallback(() => {
    return refetch()
  }, [refetch])

  // keep user used by loggers in sync
  useEffect(() => {
    const user = {
      accountId: currentUser?.joystreamAccount,
      memberId: currentUser?.membershipId,
      channelId,
    }
    SentryLogger.setUser(user)
    AssetLogger.setUser(user)
  }, [channelId, currentUser?.joystreamAccount, currentUser?.membershipId])

  const activeMembership =
    (currentUser?.membershipId && memberships?.find((membership) => membership.id === currentUser?.membershipId)) ||
    null
  const activeChannel =
    (activeMembership && activeMembership?.channels.find((channel) => channel.id === channelId)) || null

  const isChannelBelongsToTheUserOrExists = activeMembership?.channels.length
    ? activeMembership.channels.some((channel) => channel.id === channelId)
    : true

  useEffect(() => {
    if (!isChannelBelongsToTheUserOrExists) {
      setActiveUser({ channelId: activeMembership?.channels.length ? activeMembership.channels[0].id : null })
    }
  }, [activeMembership?.channels, isChannelBelongsToTheUserOrExists, setActiveUser])

  const contextValue: UserContextValue = useMemo(
    () => ({
      memberships: memberships || [],
      membershipsLoading,
      activeMembership,
      activeChannel,
      refetchUserMemberships,
    }),
    [activeChannel, memberships, membershipsLoading, activeMembership, refetchUserMemberships]
  )

  if (error) {
    return <ViewErrorFallback />
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
  const ctx = useContext(UserContext)
  if (ctx === undefined) {
    throw new Error('useActiveUserContext must be used within a UserProvider')
  }
  return ctx
}
