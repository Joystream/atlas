import { createStore } from '@/store'

import {
  DismissedMessage,
  FollowedChannel,
  RecentSearch,
  RecentSearchType,
  WatchedVideo,
  WatchedVideoStatus,
} from './types'

export type PersonalDataStoreState = {
  watchedVideos: WatchedVideo[]
  followedChannels: FollowedChannel[]
  recentSearches: RecentSearch[]
  dismissedMessages: DismissedMessage[]
  playerVolume: number
}

export type PersonalDataStoreActions = {
  updateWatchedVideos: (__typename: WatchedVideoStatus, id: string, timestamp?: number) => void
  updateChannelFollowing: (id: string, follow: boolean) => void
  updateRecentSearches: (id: string, type: RecentSearchType) => void
  updateDismissedMessages: (id: string, add?: boolean) => void
  updatePlayerVolume: (volume: number) => void
}

export const usePersonalDataStore = createStore<PersonalDataStoreState, PersonalDataStoreActions>(
  {
    state: { watchedVideos: [], followedChannels: [], recentSearches: [], dismissedMessages: [], playerVolume: 1 },
    actionsFactory: (set) => ({
      updateWatchedVideos: (__typename, id, timestamp) => {
        set((state) => {
          const currentVideo = state.watchedVideos.find((v) => v.id === id)
          if (!currentVideo) {
            const newVideo = __typename === 'COMPLETED' ? { __typename, id } : { __typename, id, timestamp }
            state.watchedVideos.push(newVideo)
          } else {
            const index = state.watchedVideos.findIndex((v) => v.id === id)
            if (index !== -1) state.watchedVideos[index] = { __typename, id, timestamp }
          }
        })
      },
      updateChannelFollowing: (id, follow) => {
        set((state) => {
          const isFollowing = state.followedChannels.some((channel) => channel.id === id)
          if (isFollowing && !follow) {
            state.followedChannels = state.followedChannels.filter((channel) => channel.id !== id)
          }
          if (!isFollowing && follow) {
            state.followedChannels.push({ id })
          }
        })
      },
      updateRecentSearches: (id, type) => {
        set((state) => {
          state.recentSearches = state.recentSearches.filter((search) => search.id !== id)
          state.recentSearches.unshift({ id, type })
        })
      },
      updateDismissedMessages: (id, add = true) => {
        set((state) => {
          state.dismissedMessages = state.dismissedMessages.filter((dissmissedMessage) => dissmissedMessage.id !== id)
          if (add) {
            state.dismissedMessages.unshift({ id })
          }
        })
      },
      updatePlayerVolume: (volume) =>
        set((state) => {
          state.playerVolume = volume
        }),
    }),
  },
  {
    persist: {
      key: 'personalData',
      whitelist: ['watchedVideos', 'followedChannels', 'recentSearches', 'dismissedMessages', 'playerVolume'],
      version: 1,
      migrate: (oldState, oldVersion, storageValue) => {
        if (!oldVersion && oldVersion !== 0) {
          return {
            personalData: storageValue,
          }
        } else if (oldVersion === 0) {
          return {
            personalData: oldState,
          }
        }
      },
    },
  }
)
