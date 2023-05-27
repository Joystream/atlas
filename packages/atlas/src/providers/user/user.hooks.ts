import { useUserContext } from './user.provider'
import { UserStoreActions, useUserStore } from './user.store'
import { ActiveUserState, UserContextValue } from './user.types'

type UseUserHookReturn = ActiveUserState &
  UserStoreActions &
  UserContextValue & {
    isLoggedIn: boolean
  }

export const useUser = (): UseUserHookReturn => {
  const { accountId, memberId, channelId, actions } = useUserStore()
  const userContext = useUserContext()

  const isLoggedIn = !!accountId && !!memberId

  return {
    accountId,
    memberId,
    channelId,
    isLoggedIn,
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
