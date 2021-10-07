import { round } from 'lodash-es'

import { createStore } from '@/store'
import { readFromLocalStorage } from '@/utils/localStorage'

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
  currentVolume: number
  cachedVolume: number
}

const WHITELIST = [
  'watchedVideos',
  'followedChannels',
  'recentSearches',
  'dismissedMessages',
  'currentVolume',
  'cachedVolume',
] as (keyof PersonalDataStoreState)[]

export type PersonalDataStoreActions = {
  updateWatchedVideos: (__typename: WatchedVideoStatus, id: string, timestamp?: number) => void
  updateChannelFollowing: (id: string, follow: boolean) => void
  updateRecentSearches: (id: string, type: RecentSearchType, title?: string) => void
  deleteRecentSearch: (id: string, type: RecentSearchType) => void
  updateDismissedMessages: (id: string, add?: boolean) => void
  setCurrentVolume: (volume: number) => void
  setCachedVolume: (volume: number) => void
}

const watchedVideos = readFromLocalStorage<WatchedVideo[]>('watchedVideos') ?? []
const followedChannels = readFromLocalStorage<FollowedChannel[]>('followedChannels') ?? []
const recentSearches = readFromLocalStorage<RecentSearch[]>('recentSearches') ?? []
const dismissedMessages = readFromLocalStorage<DismissedMessage[]>('dismissedMessages') ?? []
const currentVolume = readFromLocalStorage<number>('playerVolume') ?? 1

export const usePersonalDataStore = createStore<PersonalDataStoreState, PersonalDataStoreActions>(
  {
    state: {
      cachedVolume: 0,
      watchedVideos,
      followedChannels,
      recentSearches,
      dismissedMessages,
      currentVolume,
    },
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
      updateRecentSearches: (id, type, title) => {
        set((state) => {
          const index = state.recentSearches.findIndex((item) => item.id === id && item.type === type)
          if (index >= 0) {
            state.recentSearches.splice(index, 1)
          }
          state.recentSearches.unshift({ id, type, title })
        })
      },
      deleteRecentSearch: (id, type) => {
        set((state) => {
          state.recentSearches = state.recentSearches.filter((search) => search.id + search.type !== id + type)
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
      setCurrentVolume: (volume) =>
        set((state) => {
          state.currentVolume = round(volume, 2)
        }),
      setCachedVolume: (volume) =>
        set((state) => {
          state.cachedVolume = round(volume, 2)
        }),
    }),
  },
  {
    persist: {
      key: 'personalData',
      whitelist: WHITELIST,
      version: 0,
      onRehydrateStorage: () => {
        WHITELIST.forEach((item) => {
          window.localStorage.removeItem(item)
        })
      },
      migrate: () => null,
    },
  }
)
