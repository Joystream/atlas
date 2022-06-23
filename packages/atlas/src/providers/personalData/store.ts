import { round } from 'lodash-es'

import { channelIdsMapEntries, videoIdsMapEntries } from '@/data/migratedContentIdMappings.json'
import { createStore } from '@/store'

import { DismissedMessage, FollowedChannel, RecentSearch, WatchedVideo, WatchedVideoStatus } from './types'

export type PersonalDataStoreState = {
  watchedVideos: WatchedVideo[]
  followedChannels: FollowedChannel[]
  recentSearches: RecentSearch[]
  dismissedMessages: DismissedMessage[]
  currentVolume: number
  cachedVolume: number
  cinematicView: boolean
  cookiesAccepted?: boolean
  reactionPopoverDismissed: boolean
  playbackRate: number
  autoplay: boolean
}

const WHITELIST = [
  'watchedVideos',
  'followedChannels',
  'recentSearches',
  'dismissedMessages',
  'currentVolume',
  'cachedVolume',
  'playbackRate',
  'cinematicView',
  'cookiesAccepted',
  'reactionPopoverDismissed',
  'autoplay',
] as (keyof PersonalDataStoreState)[]

export type PersonalDataStoreActions = {
  updateWatchedVideos: (__typename: WatchedVideoStatus, id: string, timestamp?: number) => void
  updateChannelFollowing: (id: string, follow: boolean) => void
  addRecentSearch: (title: string) => void
  deleteRecentSearch: (title: string) => void
  updateDismissedMessages: (id: string, add?: boolean) => void
  setCurrentVolume: (volume: number) => void
  setCachedVolume: (volume: number) => void
  setPlaybackRate: (playbackRate: number) => void
  setAutoplay: (autoplay: boolean) => void
  setCinematicView: (cinematicView: boolean) => void
  setCookiesAccepted: (accept: boolean) => void
  setReactionPopoverDismission: (reactionPopoverDismissed: boolean) => void
}

const initialState: PersonalDataStoreState = {
  cachedVolume: 0,
  watchedVideos: [],
  followedChannels: [],
  recentSearches: [],
  dismissedMessages: [],
  currentVolume: 1,
  playbackRate: 1,
  cinematicView: false,
  cookiesAccepted: undefined,
  reactionPopoverDismissed: false,
  autoplay: true,
}

export const usePersonalDataStore = createStore<PersonalDataStoreState, PersonalDataStoreActions>(
  {
    state: initialState,
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
      addRecentSearch: (title) => {
        set((state) => {
          const filteredCurrentSearches = state.recentSearches.filter((item) => item.title !== title)
          const newSearches = [{ title }, ...filteredCurrentSearches]
          state.recentSearches = newSearches.slice(0, 6)
        })
      },
      deleteRecentSearch: (title) => {
        set((state) => {
          state.recentSearches = state.recentSearches.filter((search) => search.title !== title)
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
      setPlaybackRate: (playbackRate) =>
        set((state) => {
          state.playbackRate = playbackRate
        }),
      setAutoplay: (autoPlay) =>
        set((state) => {
          state.autoplay = autoPlay
        }),
      setCinematicView: (cinematicView) =>
        set((state) => {
          state.cinematicView = cinematicView
        }),
      setCookiesAccepted: (accept) =>
        set((state) => {
          state.cookiesAccepted = accept
        }),
      setReactionPopoverDismission: (reactionPopoverDismissed) =>
        set((state) => {
          state.reactionPopoverDismissed = reactionPopoverDismissed
        }),
    }),
  },
  {
    persist: {
      key: 'personalData',
      whitelist: WHITELIST,
      version: 2,
      migrate: (oldState) => {
        const typedOldState = oldState as PersonalDataStoreState

        const migratedWatchedVideos = typedOldState.watchedVideos.reduce((acc, cur) => {
          const migratedId = (videoIdsMapEntries as Record<string, string>)[cur.id]
          if (migratedId) {
            return [...acc, { ...cur, id: migratedId }]
          }
          return acc
        }, [] as WatchedVideo[])

        const migratedFollowedChannels = typedOldState.followedChannels.reduce((acc, cur) => {
          const migratedId = (channelIdsMapEntries as Record<string, string>)[cur.id]
          if (migratedId) {
            return [...acc, { ...cur, id: migratedId }]
          }
          return acc
        }, [] as FollowedChannel[])

        const migratedState: PersonalDataStoreState = {
          ...typedOldState,
          watchedVideos: migratedWatchedVideos,
          followedChannels: migratedFollowedChannels,
        }
        return migratedState
      },
    },
  }
)
