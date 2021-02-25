import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import {
  CompletedVideo,
  COMPLETED_VIDEO,
  FollowedChannel,
  InterruptedVideo,
  INTERRUPTED_VIDEO,
  PersonalDataClient,
  WatchedVideo,
  RecentSearch,
  DismissedMessage,
} from './types'

const watchedVideos = promisify(() => readFromLocalStorage<WatchedVideo[]>('watchedVideos') ?? [])
const interruptedVideos = async () => {
  const videos = await watchedVideos()
  return videos.filter((video) => video.__typename === INTERRUPTED_VIDEO) as InterruptedVideo[]
}
const completedVideos = async () => {
  const videos = await watchedVideos()
  return videos.filter((video) => video.__typename === COMPLETED_VIDEO) as CompletedVideo[]
}

const watchedVideo = async (id: string) => {
  const videos = await watchedVideos()
  return videos.find((v) => v.id === id) ?? null
}
const setWatchedVideo = async (
  __typename: typeof COMPLETED_VIDEO | typeof INTERRUPTED_VIDEO,
  id: string,
  timestamp?: number
) => {
  const currentVideos = await watchedVideos()
  const currentVideo = currentVideos.find((v) => v.id === id)
  switch (currentVideo?.__typename) {
    case 'COMPLETED': {
      if (__typename === 'COMPLETED') {
        break
      }

      writeToLocalStorage(
        'watchedVideos',
        currentVideos.map((v) => (v.id === id ? { __typename, id } : v))
      )
      break
    }
    case 'INTERRUPTED': {
      writeToLocalStorage(
        'watchedVideos',
        currentVideos.map((v) => (v.id === id ? { __typename, id, timestamp } : v))
      )
      break
    }
    default: {
      break
    }
  }
  if (!currentVideo) {
    const newVideo = __typename === 'COMPLETED' ? { __typename, id } : { __typename, id, timestamp }
    writeToLocalStorage('watchedVideos', [...currentVideos, newVideo])
  }
}

const followedChannels = promisify(() => readFromLocalStorage<FollowedChannel[]>('followedChannels') ?? [])
const isFollowingChannel = async (id: string) => {
  const channels = await followedChannels()
  return channels.some((ch) => ch.id === id)
}
const setChannelFollowing = async (id: string, follow = true) => {
  const currentFollowedChannels = await followedChannels()
  const isFollowing = currentFollowedChannels.some((channel) => channel.id === id)

  let newFollowedChannels = []
  if (isFollowing) {
    newFollowedChannels = follow
      ? currentFollowedChannels
      : currentFollowedChannels.filter((channel) => channel.id !== id)
  } else {
    newFollowedChannels = follow ? [...currentFollowedChannels, { id }] : currentFollowedChannels
  }
  writeToLocalStorage('followedChannels', newFollowedChannels)
}

const recentSearches = promisify(() => readFromLocalStorage<RecentSearch[]>('recentSearches') ?? [])
const setRecentSearch = async (id: string, type: 'video' | 'channel') => {
  const currentRecentSearches = await recentSearches()
  const newRecentSearches = [{ id, type }, ...currentRecentSearches.filter((search) => search.id !== id)]

  writeToLocalStorage('recentSearches', newRecentSearches)
}

const dismissedMessages = promisify(() => readFromLocalStorage<DismissedMessage[]>('dismissedMessages') ?? [])
const setDismissedMessage = async (id: string, add = true) => {
  const currentDismissedMessages = await dismissedMessages()

  const newDismissedMessages = add
    ? [{ id }, ...currentDismissedMessages.filter((dissmissedMessage) => dissmissedMessage.id !== id)]
    : [...currentDismissedMessages.filter((dissmissedMessage) => dissmissedMessage.id !== id)]

  writeToLocalStorage('dismissedMessages', newDismissedMessages)
}

export const getInitialPersonalData = () => {
  const watchedVideos = readFromLocalStorage<WatchedVideo[]>('watchedVideos') ?? []
  const followedChannels = readFromLocalStorage<FollowedChannel[]>('followedChannels') ?? []
  const recentSearches = readFromLocalStorage<RecentSearch[]>('recentSearches') ?? []
  const dismissedMessages = readFromLocalStorage<DismissedMessage[]>('dismissedMessages') ?? []
  return {
    watchedVideos,
    followedChannels,
    recentSearches,
    dismissedMessages,
  }
}

const localStorageClient: PersonalDataClient = {
  watchedVideos,
  interruptedVideos,
  completedVideos,
  watchedVideo,
  setWatchedVideo,
  followedChannels,
  isFollowingChannel,
  setChannelFollowing,
  recentSearches,
  setRecentSearch,
  dismissedMessages,
  setDismissedMessage,
}

export default localStorageClient
