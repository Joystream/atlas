import React, { useReducer, useContext, useCallback, Dispatch } from 'react'

import {
  FollowedChannel,
  WatchedVideo,
  PersonalDataClient,
  getInitialPersonalData,
  localStorageClient,
} from './localStorageClient'

const personalClient = localStorageClient

type UpdateWatchedVideosAction = {
  type: 'UPDATE_WATCHED_VIDEOS'
  watchedVideos: WatchedVideo[]
}
type UpdateChannelFollowingAction = {
  type: 'UPDATE_FOLLOWED_CHANNELS'
  followedChannels: FollowedChannel[]
}

type Action = UpdateWatchedVideosAction | UpdateChannelFollowingAction
function asyncReducer(state: PersonalData, action: Action): PersonalData {
  switch (action.type) {
    case 'UPDATE_WATCHED_VIDEOS': {
      return {
        ...state,
        ...action.watchedVideos,
      }
    }
    case 'UPDATE_FOLLOWED_CHANNELS': {
      return {
        ...state,
        ...action.followedChannels,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`)
    }
  }
}
type ContextValue = {
  state: PersonalData
  dispatch: Dispatch<Action>
}
const PersonalDataContext = React.createContext<ContextValue | undefined>(undefined)
PersonalDataContext.displayName = 'PersonalDataContext'

function usePersonalData() {
  const context = useContext(PersonalDataContext)
  if (!context) {
    throw new Error(`usePersonalData must be used within a PersonalData Provider.`)
  }
  const { state, dispatch } = context
  const updateChannelFollowing = useCallback(
    async (...setChannelFollowingArgs: Parameters<PersonalDataClient['setChannelFollowing']>) => {
      try {
        await personalClient.setChannelFollowing(...setChannelFollowingArgs)
        const updatedChannels = await personalClient.followedChannels()
        dispatch({ type: 'UPDATE_FOLLOWED_CHANNELS', followedChannels: updatedChannels })
      } catch (error) {
        return Promise.reject(error)
      }
    },
    [dispatch]
  )
  const updateWatchedVideos = useCallback(
    async (...setWatchedVideoArgs: Parameters<PersonalDataClient['setWatchedVideo']>) => {
      try {
        await personalClient.setWatchedVideo(...setWatchedVideoArgs)
        const updatedWatchedVideos = await personalClient.watchedVideos()
        dispatch({ type: 'UPDATE_WATCHED_VIDEOS', watchedVideos: updatedWatchedVideos })
      } catch (error) {
        return Promise.reject(error)
      }
    },
    [dispatch]
  )
  return { state, updateWatchedVideos, updateChannelFollowing }
}
type PersonalData = {
  watchedVideos: WatchedVideo[]
  followedChannels: FollowedChannel[]
}
const PersonalDataProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<typeof asyncReducer, undefined>(asyncReducer, undefined, () => ({
    ...getInitialPersonalData(),
  }))

  const value = {
    state,
    dispatch,
  }
  return <PersonalDataContext.Provider value={value}>{children}</PersonalDataContext.Provider>
}

export { usePersonalData, PersonalDataContext, PersonalDataProvider }
