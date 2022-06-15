import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { useMemberships } from '@/api/hooks'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { QUERY_PARAMS } from '@/config/routes'
import { AssetLogger, SentryLogger } from '@/utils/logs'
import { urlParams } from '@/utils/url'

import { useSignerWallet } from './user.helpers'
import { useUserStore } from './user.store'
import { UserContextValue } from './user.types'

const UserContext = createContext<undefined | UserContextValue>(undefined)
UserContext.displayName = 'UserContext'

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const { accountId, memberId, channelId, walletAccounts, walletStatus } = useUserStore((state) => state)
  const { setActiveUser } = useUserStore((state) => state.actions)
  const { initSignerWallet } = useSignerWallet()

  const navigate = useNavigate()

  const accountsIds = walletAccounts.map((a) => a.address)

  const { memberships, refetch, loading, error } = useMemberships(
    {
      where: {
        controllerAccount_in: accountsIds,
      },
    },
    { skip: !accountsIds.length }
  )

  const refetchUserMemberships = useCallback(() => {
    return refetch()
  }, [refetch])

  const signIn = useCallback(async () => {
    let accounts = walletAccounts

    if (walletStatus !== 'connected') {
      const initializedAccounts = await initSignerWallet()
      if (!initializedAccounts) {
        navigate({ search: urlParams({ [QUERY_PARAMS.LOGIN]: 1 }) })
        return
      }
      accounts = initializedAccounts
    }

    const accountsIds = accounts.map((a) => a.address)

    const { data, error } = await refetch({ where: { controllerAccount_in: accountsIds } })

    if (error) {
      // error is logged in hook
      return
    }

    const memberships = data?.memberships || []

    if (!memberId && memberships.length) {
      const firstMembership = memberships[0]
      setActiveUser({
        memberId: firstMembership.id,
        accountId: firstMembership.controllerAccount,
        channelId: firstMembership.channels[0]?.id || null,
      })
      return
    }

    if (!memberId) {
      navigate({ search: urlParams({ [QUERY_PARAMS.LOGIN]: 2 }) })
    }
  }, [initSignerWallet, memberId, navigate, refetch, setActiveUser, walletAccounts, walletStatus])

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

  // if the user has account/member IDs set, initialize sign in automatically
  useEffect(() => {
    if (walletStatus !== 'unknown') {
      return
    }

    if (!accountId || !memberId) {
      return
    }

    signIn()
  }, [accountId, memberId, signIn, walletStatus])

  const activeMembership = (memberId && memberships?.find((membership) => membership.id === memberId)) || null
  const isAuthLoading = walletStatus === 'pending' || loading

  const contextValue: UserContextValue = useMemo(
    () => ({
      memberships: memberships || [],
      activeMembership,
      isAuthLoading,
      signIn,
      refetchUserMemberships,
    }),
    [memberships, activeMembership, isAuthLoading, signIn, refetchUserMemberships]
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
