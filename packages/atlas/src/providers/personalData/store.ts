import { round } from 'lodash-es'

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
  autoPlayNext: boolean
  captionsEnabled: boolean
  captionsLanguage: string | null
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
  'autoPlayNext',
  'captionsEnabled',
  'captionsLanguage',
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
  setAutoPlayNext: (autoPlayNext: boolean) => void
  setCinematicView: (cinematicView: boolean) => void
  setCookiesAccepted: (accept: boolean) => void
  setReactionPopoverDismission: (reactionPopoverDismissed: boolean) => void
  setCaptionsEnabled: (captionsEnabled: boolean) => void
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
    }),
  },
  {
    persist: {
      key: 'personalData',
      whitelist: WHITELIST,
      version: 2,
      migrate: (oldState) => {
        return oldState
      },
    },
  }
)
