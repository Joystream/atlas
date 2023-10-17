import { round } from 'lodash-es'

import { SentryLogger } from '@/utils/logs'
import { createStore } from '@/utils/store'

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
  autoPlayNext: boolean
  captionsEnabled: boolean
  captionsLanguage: string | null
  allowMinimizedPleyer: boolean
}

const WHITELIST: (keyof PersonalDataStoreState)[] = [
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
  'autoPlayNext',
  'captionsEnabled',
  'captionsLanguage',
]

export type PersonalDataStoreActions = {
  updateWatchedVideos: (__typename: WatchedVideoStatus, id: string, timestamp?: number) => void
  unfollowChannel: (id: string) => void
  followChannel: (id: string) => void
  addRecentSearch: (title: string) => void
  deleteRecentSearch: (title: string) => void
  updateDismissedMessages: (id: string, add?: boolean) => void
  setCurrentVolume: (volume: number) => void
  setCachedVolume: (volume: number) => void
  setPlaybackRate: (playbackRate: number) => void
  setAutoPlayNext: (autoPlayNext: boolean) => void
  setCinematicView: (cinematicView: boolean) => void
  setCookiesAccepted: (accept: boolean) => void
  setReactionPopoverDismission: (reactionPopoverDismissed: boolean) => void
  setCaptionsEnabled: (captionsEnabled: boolean) => void
  setMinimizedPlayerAllowed: (allowed: boolean) => void
  setCaptionsLanguage: (captionsLanguage: string | null) => void

  getIsCookiesPopoverVisible: () => boolean
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
  autoPlayNext: true,
  captionsEnabled: false,
  captionsLanguage: null,
  allowMinimizedPleyer: true,
}

export const usePersonalDataStore = createStore<PersonalDataStoreState, PersonalDataStoreActions>(
  {
    state: initialState,
    actionsFactory: (set, get) => ({
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
      followChannel: (id) => {
        set((state) => {
          const isFollowing = state.followedChannels.some((channel) => channel.id === id)
          if (!isFollowing) {
            state.followedChannels.push({ id })
          }
        })
      },
      unfollowChannel: (id) => {
        set((state) => {
          const isFollowing = state.followedChannels.some((channel) => channel.id === id)
          if (isFollowing) {
            state.followedChannels = state.followedChannels.filter((channel) => channel.id !== id)
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
      setAutoPlayNext: (autoPlayNext) =>
        set((state) => {
          state.autoPlayNext = autoPlayNext
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
      setCaptionsEnabled: (captionsEnabled) =>
        set((state) => {
          state.captionsEnabled = captionsEnabled
        }),
      setCaptionsLanguage: (captionsLanguage: string | null) =>
        set((state) => {
          state.captionsLanguage = captionsLanguage
        }),
      getIsCookiesPopoverVisible: () => {
        const cookiesAccepted = get().cookiesAccepted
        return cookiesAccepted === undefined
      },
      setMinimizedPlayerAllowed: (allowed) =>
        set((state) => {
          state.allowMinimizedPleyer = allowed
        }),
    }),
  },
  {
    persist: {
      key: 'personalData',
      whitelist: WHITELIST,
      version: 4,
      migrate: (oldState: PersonalDataStoreState) => oldState,
    },
  }
)
