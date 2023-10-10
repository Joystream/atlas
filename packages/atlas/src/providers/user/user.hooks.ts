import { useAuth } from '@/providers/auth/auth.hooks'

import { useUserContext } from './user.provider'
import { UserContextValue } from './user.types'

type UseUserHookReturn = UserContextValue & {
  isLoggedIn?: boolean
}

export const useUser = (): UseUserHookReturn => {
  const userContext = useUserContext()
  const { isLoggedIn } = useAuth()

  return {
    isLoggedIn,
    ...userContext,
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
