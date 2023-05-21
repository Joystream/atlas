import { useSignerWallet } from './user.helpers'
import { useUserContext } from './user.provider'
import { UserStoreActions, useUserStore } from './user.store'
import { ActiveUserState, SignerWalletAccount, SignerWalletStatus, UserContextValue } from './user.types'

type UseUserHookReturn = ActiveUserState &
  UserStoreActions &
  UserContextValue & {
    walletAccounts: SignerWalletAccount[]
    walletStatus: SignerWalletStatus

    isLoggedIn: boolean
    isWalletLoading: boolean

    getWalletsList: ReturnType<typeof useSignerWallet>['getWalletsList']
  }

export const useUser = (): UseUserHookReturn => {
  const { accountId, memberId, channelId, walletStatus, walletAccounts, loggedInAccountId, actions } = useUserStore()
  const userContext = useUserContext()
  const { getWalletsList } = useSignerWallet()

  const isLoggedIn = loggedInAccountId === accountId && !!memberId

  return {
    loggedInAccountId,
    accountId,
    memberId,
    channelId,
    walletStatus,
    walletAccounts,
    isLoggedIn,
    isWalletLoading: walletStatus === 'pending',
    getWalletsList,
    ...userContext,
    ...actions,
  }
}
export const useAuthorizedUser = () => {
  const { accountId, memberId, channelId, ...rest } = useUser()
  if (!accountId || !memberId || !channelId) {
    throw new Error('Trying to use authorized user without authorization')
  }

  return {
    accountId,
    memberId,
    channelId,
    ...rest,
  }
}
