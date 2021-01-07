import React, { useReducer, useContext, useCallback, Dispatch } from 'react'

import { getInitialPersonalData, localStorageClient } from '@/api'
import { FollowedChannel, WatchedVideo } from '@/api/localStorage'
type State<T> = {
  data: T
  backupData: T | null
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

        backupData: state.data,
      }
    }
    case 'FINISH_UPDATE': {
      return {
        ...state,
        data: { ...state.data, ...action.updates },

        backupData: null,
      }
    }
    case 'FAIL_UPDATE': {
      return {
        ...state,
      }
    }
    case 'RESET': {
      return {
        ...state,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as Action<PersonalData>).type}`)
    }
  }
}
type ContextValue = {
  state: State<PersonalData>
  dispatch: Dispatch<Action<PersonalData>>
  updateChannelFollowing: (
    ...setChannelFollowingArgs: Parameters<typeof localStorageClient.setChannelFollowing>
  ) => Promise<void>
  updateWatchedVideos: (...setWatchedVideoArgs: Parameters<typeof localStorageClient.setWatchedVideo>) => Promise<void>
  watchedVideos: typeof localStorageClient.watchedVideos
  watchedVideo: typeof localStorageClient.watchedVideo
  completedVideos: typeof localStorageClient.completedVideos
  followedChannels: typeof localStorageClient.followedChannels
  isFollowingChannel: typeof localStorageClient.isFollowingChannel
}
const PersonalDataContext = React.createContext<ContextValue | undefined>(undefined)
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

  const updateChannelFollowing = useCallback(
    async (...setChannelFollowingArgs: Parameters<typeof localStorageClient.setChannelFollowing>) => {
      dispatch({ type: 'START_UPDATE' })
      try {
        await localStorageClient.setChannelFollowing(...setChannelFollowingArgs)
        const updatedChannels = await localStorageClient.followedChannels()
        dispatch({ type: 'FINISH_UPDATE', updates: { followedChannels: updatedChannels } })
      } catch (error) {
        dispatch({ type: 'FAIL_UPDATE', error })
        return Promise.reject(error)
      }
    },
    []
  )
  const updateWatchedVideos = useCallback(
    async (...setWatchedVideoArgs: Parameters<typeof localStorageClient.setWatchedVideo>) => {
      dispatch({ type: 'START_UPDATE' })
      try {
        await localStorageClient.setWatchedVideo(...setWatchedVideoArgs)
        const updatedWatchedVideos = await localStorageClient.watchedVideos()
        dispatch({ type: 'FINISH_UPDATE', updates: { watchedVideos: updatedWatchedVideos } })
      } catch (error) {
        dispatch({ type: 'FAIL_UPDATE', error })
        return Promise.reject(error)
      }
    },
    []
  )

  const watchedVideos = useCallback(() => localStorageClient.watchedVideos(), [])
  const interruptedVideos = useCallback(() => localStorageClient.interruptedVideos(), [])
  const completedVideos = useCallback(() => localStorageClient.completedVideos(), [])
  const watchedVideo = useCallback((id) => localStorageClient.watchedVideo(id), [])
  const followedChannels = useCallback(() => localStorageClient.followedChannels(), [])
  const isFollowingChannel = useCallback((id) => localStorageClient.isFollowingChannel(id), [])

  const value = {
    state,
    dispatch,
    updateChannelFollowing,
    updateWatchedVideos,
    watchedVideos,
    interruptedVideos,
    completedVideos,
    watchedVideo,
    followedChannels,
    isFollowingChannel,
  }
  return <PersonalDataContext.Provider value={value}>{children}</PersonalDataContext.Provider>
}

export { usePersonalData, PersonalDataContext, PersonalDataProvider }
