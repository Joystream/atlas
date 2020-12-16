import React, { useReducer, useContext, Dispatch } from 'react'

import { getInitialPersonalData, localStorageClient } from '@/api'
import { FollowedChannel, WatchedVideo } from '@/api/localStorage'
type State<T> = {
  data: T
  backupData: T | null
  status: 'pending' | 'rejected' | 'resolved' | null
  error: Error | null
}

type StartAction = {
  type: 'START_UPDATE'
}
type FinishAction<T> = {
  type: 'FINISH_UPDATE'
  updates: Partial<T>
}
type ResetAction = {
  type: 'RESET'
}
type FailAction = {
  type: 'FAIL_UPDATE'
  error: Error
}
type Action<T> = StartAction | FinishAction<T> | ResetAction | FailAction

function asyncReducer(state: State<PersonalData>, action: Action<PersonalData>): State<PersonalData> {
  switch (action.type) {
    case 'START_UPDATE': {
      return {
        ...state,
        status: 'pending',
        backupData: state.data,
      }
    }
    case 'FINISH_UPDATE': {
      return {
        ...state,
        data: { ...state.data, ...action.updates },
        status: 'resolved',
        backupData: null,
        error: null,
      }
    }
    case 'FAIL_UPDATE': {
      return {
        ...state,
        status: 'rejected',
        error: action.error,
      }
    }
    case 'RESET': {
      return {
        ...state,
        status: null,
        error: null,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as Action<PersonalData>).type}`)
    }
  }
}

const PersonalDataContext = React.createContext<[State<PersonalData>, Dispatch<Action<PersonalData>>] | undefined>(
  undefined
)
PersonalDataContext.displayName = 'PersonalDataContext'

function usePersonalData() {
  const context = useContext(PersonalDataContext)
  if (!context) {
    throw new Error(`usePersonalData must be used within a PersonalData Provider.`)
  }
  return context
}
type PersonalData = {
  watchedVideos: WatchedVideo[]
  followedChannels: FollowedChannel[]
}
const PersonalDataProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<typeof asyncReducer, undefined>(asyncReducer, undefined, () => {
    const data = getInitialPersonalData()
    return {
      data,
      backupData: data,
      status: null,
      error: null,
    }
  })
  return <PersonalDataContext.Provider value={[state, dispatch]}>{children}</PersonalDataContext.Provider>
}

const updateChannelFollowing = async (
  dispatch: Dispatch<Action<PersonalData>>,
  ...setChannelFollowingArgs: Parameters<typeof localStorageClient.setChannelFollowing>
) => {
  dispatch({ type: 'START_UPDATE' })
  try {
    await localStorageClient.setChannelFollowing(...setChannelFollowingArgs)
    const updatedChannels = await localStorageClient.followedChannels()
    dispatch({ type: 'FINISH_UPDATE', updates: { followedChannels: updatedChannels } })
  } catch (error) {
    dispatch({ type: 'FAIL_UPDATE', error })
    return Promise.reject(error)
  }
}
const updateWatchedVideos = async (
  dispatch: Dispatch<Action<PersonalData>>,
  ...setWatchedVideoArgs: Parameters<typeof localStorageClient.setWatchedVideo>
) => {
  dispatch({ type: 'START_UPDATE' })
  try {
    await localStorageClient.setWatchedVideo(...setWatchedVideoArgs)
    const updatedWatchedVideos = await localStorageClient.watchedVideos()
    dispatch({ type: 'FINISH_UPDATE', updates: { watchedVideos: updatedWatchedVideos } })
  } catch (error) {
    dispatch({ type: 'FAIL_UPDATE', error })
    return Promise.reject(error)
  }
}

export { usePersonalData, PersonalDataContext, PersonalDataProvider, updateChannelFollowing, updateWatchedVideos }
