import { web3Accounts, web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import React, { useContext, useEffect, useMemo, useState } from 'react'

import { useMembership, useMemberships } from '@/api/hooks'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { WEB3_APP_NAME } from '@/config/urls'
import { AccountId } from '@/joystream-lib'
import { AssetLogger, ConsoleLogger, SentryLogger } from '@/utils/logs'

import { ActiveUserState, ActiveUserStoreActions, useActiveUserStore } from './store'

export type Account = {
  id: AccountId
  name: string
}

type ActiveUserContextValue = ActiveUserStoreActions & {
  activeUserState: ActiveUserState
  accounts: Account[] | null
  extensionConnected: boolean | null

  memberships: ReturnType<typeof useMemberships>['memberships']
  membershipsLoading: boolean
  refetchMemberships: ReturnType<typeof useMemberships>['refetch']

  activeMembership: ReturnType<typeof useMembership>['membership']
  activeMembershipLoading: boolean
  refetchActiveMembership: ReturnType<typeof useMembership>['refetch']

  userInitialized: boolean
}

const ActiveUserContext = React.createContext<undefined | ActiveUserContextValue>(undefined)
ActiveUserContext.displayName = 'ActiveUserContext'

export const ActiveUserProvider: React.FC = ({ children }) => {
  const activeUserState = useActiveUserStore((state) => state)
  const {
    actions: { setActiveUser, resetActiveUser },
  } = activeUserState
  useEffect(() => {
    SentryLogger.setUser(activeUserState)
    AssetLogger.setUser(activeUserState)
  }, [activeUserState])

  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [extensionConnected, setExtensionConnected] = useState<boolean | null>(null)

  const accountsIds = (accounts || []).map((a) => a.id)
  const {
    memberships: membershipsData,
    previousData: membershipPreviousData,
    loading: membershipsLoading,
    error: membershipsError,
    refetch: refetchMemberships,
  } = useMemberships(
    { where: { controllerAccount_in: accountsIds } },
    {
      skip: !accounts || !accounts.length,
      onError: (error) =>
        SentryLogger.error('Failed to fetch memberships', 'ActiveUserProvider', error, {
          accounts: { ids: accountsIds },
        }),
    }
  )

  // use previous values when doing the refetch, so the app doesn't think we don't have any memberships
  const memberships = membershipsData || membershipPreviousData?.memberships

  const {
    membership: activeMembership,
    loading: activeMembershipLoading,
    error: activeMembershipError,
    refetch: refetchActiveMembership,
  } = useMembership(
    { where: { id: activeUserState.memberId } },
    {
      skip: !activeUserState.memberId,
      onError: (error) => SentryLogger.error('Failed to fetch active membership', 'ActiveUserProvider', error),
    }
  )

  // handle polkadot extension
  useEffect(() => {
    let unsub: () => void

    const initPolkadotExtension = async () => {
      try {
        const enabledExtensions = await web3Enable(WEB3_APP_NAME)

        if (!enabledExtensions.length) {
          ConsoleLogger.warn('No Polkadot extension detected')
          setExtensionConnected(false)
          return
        }

        const handleAccountsChange = (accounts: InjectedAccountWithMeta[]) => {
          const mappedAccounts = accounts.map((a) => ({
            id: a.address,
            name: a.meta.name || 'Unnamed',
          }))
          setAccounts(mappedAccounts)
        }

        // subscribe to changes to the accounts list
        unsub = await web3AccountsSubscribe(handleAccountsChange)
        const accounts = await web3Accounts()
        handleAccountsChange(accounts)

        setExtensionConnected(true)
      } catch (e) {
        setExtensionConnected(false)
        SentryLogger.error('Failed to initialize Polkadot signer extension', 'ActiveUserProvider', e)
      }
    }

    initPolkadotExtension()

    return () => {
      unsub?.()
    }
  }, [])

  useEffect(() => {
    if (!accounts || !activeUserState.accountId || extensionConnected !== true) {
      return
    }

    const account = accounts.find((a) => a.id === activeUserState.accountId)

    if (!account) {
      ConsoleLogger.warn('Selected accountId not found in extension accounts, resetting user')
      resetActiveUser()
    }
  }, [accounts, activeUserState.accountId, extensionConnected, resetActiveUser])

  const firstMembership = memberships?.length && memberships[0]
  useEffect(() => {
    if (!extensionConnected || !firstMembership) {
      return
    }
    if (!activeUserState.memberId && firstMembership) {
      setActiveUser({ memberId: firstMembership.id, accountId: firstMembership.controllerAccount })
    }
  }, [activeUserState.memberId, extensionConnected, firstMembership, memberships, setActiveUser])

  const userInitialized =
    (extensionConnected === true && (!!memberships || !accounts?.length)) || extensionConnected === false

  const contextValue: ActiveUserContextValue = useMemo(
    () => ({
      activeUserState,
      setActiveUser,
      resetActiveUser,

      accounts,
      extensionConnected,

      memberships,
      membershipsLoading,
      refetchMemberships,

      activeMembership,
      activeMembershipLoading,
      refetchActiveMembership,

      userInitialized,
    }),
    [
      accounts,
      activeMembership,
      activeMembershipLoading,
      activeUserState,
      extensionConnected,
      memberships,
      membershipsLoading,
      refetchActiveMembership,
      refetchMemberships,
      resetActiveUser,
      setActiveUser,
      userInitialized,
    ]
  )

  if (membershipsError || activeMembershipError) {
    return <ViewErrorFallback />
  }

  return <ActiveUserContext.Provider value={contextValue}>{children}</ActiveUserContext.Provider>
}

const useActiveUserContext = () => {
  const ctx = useContext(ActiveUserContext)
  if (ctx === undefined) {
    throw new Error('useMember must be used within a ActiveUserProvider')
  }
  return ctx
}

export const useUser = () => {
  const {
    activeUserState: { accountId: activeAccountId, memberId: activeMemberId, channelId: activeChannelId },
    ...rest
  } = useActiveUserContext()

  return {
    activeAccountId,
    activeMemberId,
    activeChannelId,
    ...rest,
  }
}

export const useAuthorizedUser = () => {
  const { activeAccountId, activeMemberId, activeChannelId, ...rest } = useUser()
  if (!activeAccountId || !activeMemberId || !activeChannelId) {
    throw new Error('Trying to use authorized user without authorization')
  }

  return {
    activeAccountId,
    activeMemberId,
    activeChannelId,
    ...rest,
  }
}
