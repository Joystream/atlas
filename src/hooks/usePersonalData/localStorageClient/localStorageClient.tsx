import {
  CompletedVideo,
  COMPLETED_VIDEO,
  FollowedChannel,
  InterruptedVideo,
  INTERRUPTED_VIDEO,
  PersonalDataClient,
  WatchedVideo,
  RecentSearch,
} from './types'

const promisify = <T,>(fn: (...args: unknown[]) => T) => (...args: Parameters<typeof fn>) =>
  new Promise((resolve) => resolve(fn(...args))) as Promise<T>

const readFromLocalStorage = <T,>(key: string, { deserialize = JSON.parse } = {}) => {
  const valueInLocalStorage = window.localStorage.getItem(key)
  if (valueInLocalStorage) {
    try {
      return deserialize(valueInLocalStorage) as T
    } catch (error) {
      console.error(
        `An error occured when deserializing a value from Local Storage. Did you pass the correct serializer to readFromLocalStorage?`
      )
      throw error
    }
  }
}

const writeToLocalStorage = <T,>(key: string, value: T, { serialize = JSON.stringify } = {}) => {
  window.localStorage.setItem(key, serialize(value))
}

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
export const getInitialPersonalData = () => {
  const watchedVideos = readFromLocalStorage<WatchedVideo[]>('watchedVideos') ?? []
  const followedChannels = readFromLocalStorage<FollowedChannel[]>('followedChannels') ?? []
  const recentSearches = readFromLocalStorage<RecentSearch[]>('recentSearches') ?? []
  return {
    watchedVideos,
    followedChannels,
    recentSearches,
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
}

export default localStorageClient
