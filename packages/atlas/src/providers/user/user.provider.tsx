import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useMemberships } from '@/api/hooks/membership'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { useJoystream } from '@/providers/joystream/joystream.provider'
import { AssetLogger, SentryLogger } from '@/utils/logs'

import { UserContextValue } from './user.types'

import { useAuth } from '../auth/auth.hooks'

export const UserContext = createContext<undefined | UserContextValue>(undefined)
UserContext.displayName = 'UserContext'

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const [channelId, setChannelId] = useState<string | null>(null)
  const { setApiActiveAccount } = useJoystream()

  const {
    memberships: currentMemberships,
    previousData,
    loading: membershipsLoading,
    refetch,
    error,
  } = useMemberships(
    {
      where: {
        id_eq: currentUser?.membershipId,
      },
    },
    {
      onCompleted: (data) => {
        const activeMembership =
          (currentUser?.membershipId &&
            data.memberships?.find((membership) => membership.id === currentUser?.membershipId)) ||
          null
        if (activeMembership) {
          setChannelId(activeMembership.channels[0].id)
        }
      },
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
      channelId: currentMemberships?.[0].channels[0]?.id,
    }

    SentryLogger.setUser(user)
    AssetLogger.setUser(user)
  }, [
    currentMemberships,
    currentUser?.email,
    currentUser?.joystreamAccount,
    currentUser?.membershipId,
    setApiActiveAccount,
  ])

  const activeMembership =
    (currentUser?.membershipId && memberships?.find((membership) => membership.id === currentUser?.membershipId)) ||
    null

  const activeChannel =
    (channelId
      ? activeMembership?.channels.find((channel) => channel.id === channelId)
      : activeMembership?.channels[0]) || null

  const contextValue: UserContextValue = useMemo(
    () => ({
      memberships: memberships || [],
      membershipsLoading,
      activeMembership,
      activeChannel,
      refetchUserMemberships,
      memberId: currentUser?.membershipId ?? null,
      accountId: currentUser?.joystreamAccount ?? null,
      channelId,
      setActiveChannel: setChannelId,
    }),
    [
      memberships,
      membershipsLoading,
      activeMembership,
      activeChannel,
      refetchUserMemberships,
      currentUser?.membershipId,
      currentUser?.joystreamAccount,
      channelId,
    ]
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
