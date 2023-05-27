import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'

import { useMemberships } from '@/api/hooks/membership'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { useWallet } from '@/providers/wallet/wallet.hooks'
import { AssetLogger, SentryLogger } from '@/utils/logs'
import { setAnonymousAuth } from '@/utils/user'

import { useUserStore } from './user.store'
import { UserContextValue } from './user.types'

const UserContext = createContext<undefined | UserContextValue>(undefined)
UserContext.displayName = 'UserContext'

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const { accountId, memberId, channelId, userId } = useUserStore((state) => state)
  const { setActiveUser, setUserId } = useUserStore((state) => state.actions)
  const { walletAccounts } = useWallet()

  const accountsIds = walletAccounts.map((a) => a.address)

  const firstRender = useRef(true)
  // run this once to make sure that userId is set in localstorage and its up to date
  useEffect(() => {
    if (firstRender.current) {
      setAnonymousAuth(userId).then((userId) => setUserId(userId || null))
      firstRender.current = false
    }
  }, [setUserId, userId])

  const {
    memberships: currentMemberships,
    previousData,
    loading: membershipsLoading,
    refetch,
    error,
  } = useMemberships(
    {
      where: {
        controllerAccount_in: accountsIds,
      },
    },
    {
      skip: !accountsIds.length,
      onError: (error) =>
        SentryLogger.error('Failed to fetch user memberships', 'UserProvider', error, { user: { accountsIds } }),
    }
  )

  const memberships = currentMemberships ?? previousData?.memberships

  const refetchUserMemberships = useCallback(() => {
    return refetch()
  }, [refetch])

  // keep user used by loggers in sync
  useEffect(() => {
    const user = {
      accountId,
      memberId,
      channelId,
    }
    SentryLogger.setUser(user)
    AssetLogger.setUser(user)
  }, [accountId, channelId, memberId])

  const activeMembership = (memberId && memberships?.find((membership) => membership.id === memberId)) || null
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
