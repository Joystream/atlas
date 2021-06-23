import { createStore } from '@/store'

import { DismissedMessage, FollowedChannel, RecentSearch, WatchedVideo, WatchedVideoStatus } from './types'

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
  updateRecentSearches: (id: string, type: 'video' | 'channel') => void
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
            return {
              ...state,
              watchedVideos: [...state.watchedVideos, newVideo],
            }
          } else {
            return {
              ...state,
              watchedVideos: state.watchedVideos.map((v) => (v.id === id ? { __typename, id, timestamp } : v)),
            }
          }
        })
      },
      updateChannelFollowing: (id, follow) => {
        set((state) => {
          const isFollowing = state.followedChannels.some((channel) => channel.id === id)
          let newFollowedChannels = []
          if (isFollowing) {
            newFollowedChannels = follow
              ? state.followedChannels
              : state.followedChannels.filter((channel) => channel.id !== id)
          } else {
            newFollowedChannels = follow ? [...state.followedChannels, { id }] : state.followedChannels
          }
          return { ...state, followedChannels: newFollowedChannels }
        })
      },
      updateRecentSearches: (id, type) => {
        set((state) => {
          const newRecentSearches = [{ id, type }, ...state.recentSearches.filter((search) => search.id !== id)]
          return { ...state, recentSearches: newRecentSearches }
        })
      },
      updateDismissedMessages: (id, add = true) => {
        set((state) => {
          const newDismissedMessages = add
            ? [{ id }, ...state.dismissedMessages.filter((dissmissedMessage) => dissmissedMessage.id !== id)]
            : [...state.dismissedMessages.filter((dissmissedMessage) => dissmissedMessage.id !== id)]

          return { ...state, dismissedMessages: newDismissedMessages }
        })
      },
      updatePlayerVolume: (volume) => set((state) => ({ ...state, playerVolume: volume })),
    }),
  },
  {
    persist: {
      key: 'personalData',
      whitelist: ['watchedVideos', 'followedChannels', 'recentSearches', 'dismissedMessages', 'playerVolume'],
      version: 1,
      migrate: (oldState, oldVersion, storageValue) => {
        if (!oldVersion && oldVersion !== 0) {
          // legacy store
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
