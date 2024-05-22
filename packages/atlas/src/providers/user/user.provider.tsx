import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useMemberships } from '@/api/hooks/membership'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { useJoystream } from '@/providers/joystream/joystream.provider'
import { usePersonalDataStore } from '@/providers/personalData'
import { SentryLogger, UserEventsLogger } from '@/utils/logs'

import { UserContextValue } from './user.types'

import { useAuth } from '../auth/auth.hooks'

export const UserContext = createContext<undefined | UserContextValue>(undefined)
UserContext.displayName = 'UserContext'

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const { setApiActiveAccount } = useJoystream()
  const {
    lastUsedChannelId,
    actions: { setLastUsedChannelId },
  } = usePersonalDataStore((state) => state)
  const [channelId, setChannelId] = useState<string | null>(lastUsedChannelId)
  const [membershipId, setMemberId] = useState<string | null>(lastUsedChannelId)

  const setActiveChannel = useCallback(
    (channelId: string) => {
      setChannelId(channelId)
      setLastUsedChannelId(channelId)
    },
    [setLastUsedChannelId]
  )

  const {
    memberships: currentMemberships,
    previousData,
    loading: membershipsLoading,
    refetch,
    error,
  } = useMemberships(
    {
      where: {
        controllerAccount: {
          id_eq: currentUser?.joystreamAccountId,
        },
      },
    },
    {
      onCompleted: (data) => {
        const activeMembership = data.memberships[0] || null
        setMemberId(activeMembership?.id)
        if (activeMembership && !activeMembership.channels.some((channel) => channel.id === channelId)) {
          setActiveChannel(activeMembership.channels[0].id)
        }
      },
      skip: !currentUser?.joystreamAccountId,
      onError: (error) =>
        SentryLogger.error('Failed to fetch user memberships', 'UserProvider', error, { user: currentUser ?? {} }),
    }
  )

  const memberships = currentMemberships ?? previousData?.memberships

  const refetchUserMemberships = useCallback(async () => {
    const res = await refetch()
    setMemberId(res.data.memberships[0]?.id)
    return res
  }, [refetch])

  // keep user used by loggers in sync
  useEffect(() => {
    const user = {
      accountId: currentUser?.joystreamAccountId,
      memberId: membershipId,
      channelId: currentMemberships?.[0]?.channels[0]?.id,
    }

    SentryLogger.setUser(user)
    UserEventsLogger.setUser(user)
  }, [currentMemberships, currentUser?.email, currentUser?.joystreamAccountId, membershipId, setApiActiveAccount])

  const activeMembership = (membershipId && memberships?.find((membership) => membership.id === membershipId)) || null
  const activeChannel =
    (channelId
      ? activeMembership?.channels.find((channel) => channel.id === channelId)
      : activeMembership?.channels[0]) || null

  const contextValue: UserContextValue = useMemo(
    () => ({
      memberships: memberships || [],
      memberChannels: activeMembership?.channels ?? null,
      membershipsLoading,
      activeMembership,
      activeChannel,
      refetchUserMemberships,
      memberId: membershipId ?? null,
      accountId: currentUser?.joystreamAccountId ?? null,
      channelId,
      setActiveChannel,
    }),
    [
      memberships,
      activeMembership,
      membershipsLoading,
      activeChannel,
      refetchUserMemberships,
      membershipId,
      currentUser?.joystreamAccountId,
      channelId,
      setActiveChannel,
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
