import { web3Accounts, web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { useMembership, useMemberships } from '@/api/hooks'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Loader } from '@/components/_loaders/Loader'
import { Modal } from '@/components/_overlays/Modal'
import { QUERY_PARAMS } from '@/config/routes'
import { WEB3_APP_NAME } from '@/config/urls'
import { AccountId } from '@/joystream-lib'
import { AssetLogger, ConsoleLogger, SentryLogger } from '@/utils/logs'
import { urlParams } from '@/utils/url'

import { ActiveUserState, ActiveUserStoreActions, useActiveUserStore } from './store'

import { useConfirmationModal } from '../confirmationModal'

export type Account = {
  id: AccountId
  name: string
}

const ACCESS_TIMEOUT = 10000

type ActiveUserContextValue = ActiveUserStoreActions & {
  activeUserState: ActiveUserState
  accounts: Account[] | null
  extensionConnected: boolean | null | 'pending'

  memberships: ReturnType<typeof useMemberships>['memberships']
  membershipsLoading: boolean
  refetchMemberships: ReturnType<typeof useMemberships>['refetch']

  activeMembership: ReturnType<typeof useMembership>['membership']
  activeMembershipLoading: boolean
  refetchActiveMembership: ReturnType<typeof useMembership>['refetch']

  signIn: () => Promise<void>
}

const ActiveUserContext = React.createContext<undefined | ActiveUserContextValue>(undefined)
ActiveUserContext.displayName = 'ActiveUserContext'

export const ActiveUserProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [openLongLoadingModal, closeLongLoadingModal] = useConfirmationModal()
  const activeUserState = useActiveUserStore((state) => state)
  const navigate = useNavigate()
  const unsubscribeRef = React.useRef<(() => void) | null>()
  const {
    actions: { setActiveUser, resetActiveUser },
  } = activeUserState
  useEffect(() => {
    SentryLogger.setUser(activeUserState)
    AssetLogger.setUser(activeUserState)
  }, [activeUserState])

  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [extensionConnected, setExtensionConnected] = useState<boolean | null | 'pending'>(null)

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

  useEffect(() => {
    if (!isLoading) {
      closeLongLoadingModal()
      return
    }
    const timeout = setTimeout(() => {
      openLongLoadingModal({
        iconType: 'warning',
        title: 'Something went wrong',
        description: `Check out your Polkadot extension and allow app the access. If you can't do that, reload page and try again.`,
        primaryButton: {
          text: 'Reload page',
          onClick: () => {
            window.location.reload()
            closeLongLoadingModal()
            setIsLoading(false)
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => {
            closeLongLoadingModal()
            setIsLoading(false)
          },
        },
      })
    }, ACCESS_TIMEOUT)
    return () => {
      clearTimeout(timeout)
    }
  }, [isLoading, openLongLoadingModal, closeLongLoadingModal])

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

  const initPolkadotExtension = useCallback(async () => {
    try {
      setExtensionConnected('pending')
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

      const accounts = await web3Accounts()
      handleAccountsChange(accounts)
      // subscribe to changes to the accounts list
      unsubscribeRef.current = await web3AccountsSubscribe(handleAccountsChange)

      setExtensionConnected(true)
    } catch (e) {
      setExtensionConnected(false)
      SentryLogger.error('Failed to initialize Polkadot signer extension', 'ActiveUserProvider', e)
    }
  }, [])

  useEffect(() => {
    if (extensionConnected === true) {
      return
    }
    if (!activeMembership?.id) {
      initPolkadotExtension()
    }
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [activeMembership?.id, extensionConnected, initPolkadotExtension])

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

  const signIn = useCallback(async () => {
    setIsLoading(true)
    await initPolkadotExtension()
    const membershipsResponse = await refetchMemberships()
    const memberships = membershipsResponse?.data?.memberships
    setIsLoading(false)

    if (!activeUserState.memberId && memberships?.length) {
      const firstMembership = memberships[0]
      setActiveUser({
        memberId: firstMembership.id,
        accountId: firstMembership.controllerAccount,
        channelId: firstMembership.channels[0]?.id || null,
      })
      return
    }

    if (!extensionConnected) {
      navigate({ search: urlParams({ [QUERY_PARAMS.LOGIN]: 1 }) })
    }
    if (extensionConnected) {
      navigate({ search: urlParams({ [QUERY_PARAMS.LOGIN]: 2 }) })
    }
  }, [activeUserState.memberId, extensionConnected, initPolkadotExtension, navigate, refetchMemberships, setActiveUser])

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

      signIn,
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
      signIn,
    ]
  )

  if (membershipsError || activeMembershipError) {
    return <ViewErrorFallback />
  }

  return (
    <ActiveUserContext.Provider value={contextValue}>
      <Modal show={isLoading} noBoxShadow>
        <Loader variant="xlarge" />
      </Modal>
      {children}
    </ActiveUserContext.Provider>
  )
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
