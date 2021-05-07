import React, { useContext, useEffect, useState } from 'react'
import { useActiveUserStore } from './store'
import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp'
import { AccountId } from '@/joystream-lib'
import { WEB3_APP_NAME } from '@/config/urls'
import { useMembership, useMemberships } from '@/api/hooks'

export type Account = {
  id: AccountId
  name: string
}

type ActiveUserContextValue = ReturnType<typeof useActiveUserStore> & {
  accounts: Account[] | null
  extensionConnected: boolean | null

  memberships: ReturnType<typeof useMemberships>['memberships']
  membershipsLoading: boolean
  refetchMemberships: ReturnType<typeof useMemberships>['refetch']

  activeMembership: ReturnType<typeof useMembership>['membership']
  activeMembershipLoading: boolean
  refetchActiveMembership: ReturnType<typeof useMembership>['refetch']
}
const ActiveUserContext = React.createContext<undefined | ActiveUserContextValue>(undefined)
ActiveUserContext.displayName = 'ActiveUserContext'

export const ActiveUserProvider: React.FC = ({ children }) => {
  const store = useActiveUserStore()

  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [extensionConnected, setExtensionConnected] = useState<boolean | null>(null)

  const accountsIds = (accounts || []).map((a) => a.id)
  const {
    memberships,
    loading: membershipsLoading,
    error: membershipsError,
    refetch: refetchMemberships,
  } = useMemberships({ where: { controllerAccount_in: accountsIds } }, { skip: !accounts || !accounts.length })
  const {
    membership: activeMembership,
    loading: activeMembershipLoading,
    error: activeMembershipError,
    refetch: refetchActiveMembership,
  } = useMembership({ where: { id: store.activeUserState.memberId } }, { skip: !store.activeUserState.memberId })

  if (membershipsError) {
    throw membershipsError
  }

  if (activeMembershipError) {
    throw activeMembershipError
  }

  // handle polkadot extension
  useEffect(() => {
    let unsub: () => void

    const initPolkadotExtension = async () => {
      try {
        const enabledExtensions = await web3Enable(WEB3_APP_NAME)

        if (!enabledExtensions.length) {
          console.warn('No Polkadot extension detected')
          setExtensionConnected(false)
          return
        }

        // subscribe to changes to the accounts list
        unsub = await web3AccountsSubscribe((accounts) => {
          const mappedAccounts = accounts.map((a) => ({
            id: a.address,
            name: a.meta.name || 'Unnamed',
          }))
          setAccounts(mappedAccounts)
        })

        setExtensionConnected(true)
      } catch (e) {
        setExtensionConnected(false)
        console.error('Unknown polkadot extension error', e)
      }
    }

    initPolkadotExtension()

    return () => {
      unsub?.()
    }
  }, [])

  // TODO: move membership fetching logic

  const contextValue: ActiveUserContextValue = {
    ...store,
    accounts,
    extensionConnected,

    memberships,
    membershipsLoading,
    refetchMemberships,

    activeMembership,
    activeMembershipLoading,
    refetchActiveMembership,
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
