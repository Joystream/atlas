import React, { Dispatch, useCallback, useContext, useReducer } from 'react'

import { Logger } from '@/utils/logger'

import {
  DismissedMessage,
  FollowedChannel,
  PersonalDataClient,
  RecentSearch,
  WatchedVideo,
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
type UpdateSearchesAction = {
  type: 'UPDATE_SEARCHES'
  recentSearches: RecentSearch[]
}
type UpdateDismissedMessagesAction = {
  type: 'UPDATE_DISMISSED_MESSAGES'
  dismissedMessages: DismissedMessage[]
}
type UpdatePlayerVolume = {
  type: 'UPDATE_PLAYER_VOLUME'
  playerVolume: number
}

type Action =
  | UpdateWatchedVideosAction
  | UpdateChannelFollowingAction
  | UpdateSearchesAction
  | UpdateDismissedMessagesAction
  | UpdatePlayerVolume
const asyncReducer = (state: PersonalData, action: Action) => {
  switch (action.type) {
    case 'UPDATE_WATCHED_VIDEOS': {
      return {
        ...state,
        watchedVideos: action.watchedVideos,
      }
    }
    case 'UPDATE_FOLLOWED_CHANNELS': {
      return {
        ...state,
        followedChannels: action.followedChannels,
      }
    }
    case 'UPDATE_SEARCHES': {
      return {
        ...state,
        recentSearches: action.recentSearches,
      }
    }
    case 'UPDATE_DISMISSED_MESSAGES': {
      return {
        ...state,
        dismissedMessages: action.dismissedMessages,
      }
    }
    case 'UPDATE_PLAYER_VOLUME': {
      return {
        ...state,
        playerVolume: action.playerVolume,
      }
    }
    default: {
      Logger.error(`Unhandled action type, returning state unchanged...`)
      return state
    }
  }
}
type ContextValue = {
  state: PersonalData
  dispatch: Dispatch<Action>
}
const PersonalDataContext = React.createContext<ContextValue | undefined>(undefined)
PersonalDataContext.displayName = 'PersonalDataContext'

const usePersonalData = () => {
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

  const updateRecentSearches = useCallback(
    async (...setRecentSearchArgs: Parameters<PersonalDataClient['setRecentSearch']>) => {
      try {
        await personalClient.setRecentSearch(...setRecentSearchArgs)
        const updatedRecentSearches = await personalClient.recentSearches()
        dispatch({ type: 'UPDATE_SEARCHES', recentSearches: updatedRecentSearches })
      } catch (error) {
        return Promise.reject(error)
      }
    },
    [dispatch]
  )

  const updateDismissedMessages = useCallback(
    async (...setDismissedMessageArgs: Parameters<PersonalDataClient['setDismissedMessage']>) => {
      try {
        await personalClient.setDismissedMessage(...setDismissedMessageArgs)
        const updatedDismissedMessages = await personalClient.dismissedMessages()
        dispatch({ type: 'UPDATE_DISMISSED_MESSAGES', dismissedMessages: updatedDismissedMessages })
      } catch (error) {
        return Promise.reject(error)
      }
    },
    [dispatch]
  )
  const updatePlayerVolume = useCallback(
    async (...setPlayerVolumeArgs: Parameters<PersonalDataClient['setPlayerVolume']>) => {
      try {
        await personalClient.setPlayerVolume(...setPlayerVolumeArgs)
        const updatedPlayerVolume = await personalClient.playerVolume()
        dispatch({ type: 'UPDATE_PLAYER_VOLUME', playerVolume: updatedPlayerVolume })
      } catch (error) {
        return Promise.reject(error)
      }
    },
    [dispatch]
  )
  return {
    state,
    updateWatchedVideos,
    updateChannelFollowing,
    updateRecentSearches,
    updateDismissedMessages,
    updatePlayerVolume,
  }
}
type PersonalData = {
  watchedVideos: WatchedVideo[]
  followedChannels: FollowedChannel[]
  recentSearches: RecentSearch[]
  dismissedMessages: DismissedMessage[]
  playerVolume: number
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
