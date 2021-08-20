import { useActiveUserStore } from '@/providers/user/store'

export const getLogArgs = (message: string, details?: unknown) => {
  if (details) {
    return [message, details]
  }
  return [message]
}

export const getUserInfo = (includeIp = true): Record<string, unknown> => {
  const { actions, ...userState } = useActiveUserStore.getState()
  return {
    ...userState,
    ...(includeIp ? { ip_address: '{{auto}}' } : {}),
  }
}
