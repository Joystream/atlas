import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useMemberships } from '@/api/hooks'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { AssetLogger, SentryLogger } from '@/utils/logs'

import { useSignerWallet } from './user.helpers'
import { useUserStore } from './user.store'
import { UserContextValue } from './user.types'

const UserContext = createContext<undefined | UserContextValue>(undefined)
UserContext.displayName = 'UserContext'

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const { accountId, memberId, channelId, walletAccounts, walletStatus, lastUsedWalletName } = useUserStore(
    (state) => state
  )
  const { setActiveUser, setSignInModalOpen } = useUserStore((state) => state.actions)
  const { initSignerWallet } = useSignerWallet()

  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const accountsIds = walletAccounts.map((a) => a.address)

  const {
    memberships: currentMemberships,
    previousData,
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

  const signIn = useCallback(
    async (walletName?: string): Promise<boolean> => {
      let accounts = walletAccounts

      if (!walletName) {
        setSignInModalOpen(true)
        return true
      }

      try {
        const initializedAccounts = await initSignerWallet(walletName)
        if (initializedAccounts == null) {
          SentryLogger.error('Selected wallet not found or not installed', 'UserProvider')
          setSignInModalOpen(true)
          return false
        }
        accounts = initializedAccounts
      } catch (e) {
        SentryLogger.error('Failed to enable selected wallet', 'UserProvider', e)
        return false
      }

      const accountsIds = accounts.map((a) => a.address)

      const { data, error } = await refetch({ where: { controllerAccount_in: accountsIds } })

      if (error) {
        // error is logged in hook
        return false
      }

      const memberships = data?.memberships || []

      if (memberships.length) {
        setSignInModalOpen(false)
      }

      if (!memberId && memberships.length) {
        const firstMembership = memberships[0]
        setActiveUser({
          memberId: firstMembership.id,
          accountId: firstMembership.controllerAccount,
          channelId: firstMembership.channels[0]?.id || null,
        })
        return true
      }

      return true
    },
    [initSignerWallet, memberId, refetch, setActiveUser, setSignInModalOpen, walletAccounts]
  )

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
    if (walletStatus !== 'unknown' || !lastUsedWalletName) {
      setIsAuthLoading(false)
      return
    }

    if (!accountId || !memberId) {
      setIsAuthLoading(false)
      return
    }

    setTimeout(() => {
      // add a slight delay - sometimes the extension will not initialize by the time of this call and may appear unavailable
      signIn(lastUsedWalletName).then(() => setIsAuthLoading(false))
    }, 200)
  }, [accountId, lastUsedWalletName, memberId, signIn, walletStatus])

  const activeMembership = (memberId && memberships?.find((membership) => membership.id === memberId)) || null

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
