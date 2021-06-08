import { useCallback, useEffect, useState } from 'react'

import { AccountId, ChannelId, MemberId } from '@/joystream-lib'

const LOCAL_STORAGE_KEY = 'activeUser'

export type ActiveUserState = {
  accountId: AccountId | null
  memberId: MemberId | null
  channelId: ChannelId | null
}

const EMPTY_STATE: ActiveUserState = {
  accountId: null,
  memberId: null,
  channelId: null,
}

const getInitialState = (): ActiveUserState => {
  const rawData = localStorage.getItem(LOCAL_STORAGE_KEY)
  return rawData ? JSON.parse(rawData) : EMPTY_STATE
}

export const useActiveUserStore = () => {
  const [state, setState] = useState<ActiveUserState>(getInitialState())

  // synchronize state with local storage on change
  useEffect(() => {
    const rawData = JSON.stringify(state)
    localStorage.setItem(LOCAL_STORAGE_KEY, rawData)
  }, [state])

  const setActiveUser = useCallback((changes: Partial<ActiveUserState>) => {
    setState((currentState) => ({
      ...currentState,
      ...changes,
    }))
  }, [])

  const resetActiveUser = useCallback(() => {
    setState(EMPTY_STATE)
  }, [])

  return { activeUserState: state, setActiveUser, resetActiveUser }
}
