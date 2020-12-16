import {
  CompletedVideo,
  COMPLETED_VIDEO,
  FollowedChannel,
  InterruptedVideo,
  INTERRUPTED_VIDEO,
  UserPersonalData,
  WatchedVideo,
} from './types'

function promisify<T>(fn: () => T): () => Promise<T>
function promisify<T>(fn: (...args: unknown[]) => T) {
  return function (...args: Parameters<typeof fn>) {
    return new Promise((resolve) => resolve(fn(...args)))
  }
}

function readFromLocalStorage<T>(key: string, { deserialize = JSON.parse } = {}) {
  const valueInLocalStorage = window.localStorage.getItem(key)
  if (valueInLocalStorage) {
    try {
      return deserialize(valueInLocalStorage) as T
    } catch (error) {
      console.log(
        `An error occured when deserializing a value from Local Storage. Did you pass the correct serializer to readFromLocalStorage?`
      )
      throw error
    }
  }
}

function writeToLocalStorage<T>(key: string, value: T, { serialize = JSON.stringify } = {}) {
  window.localStorage.setItem(key, serialize(value))
}

const watchedVideos = promisify(() => readFromLocalStorage<WatchedVideo[]>('watchedVideos') ?? [])
const interruptedVideos = () =>
  watchedVideos().then(
    (videos) => videos.filter((video) => video.__typename === INTERRUPTED_VIDEO) as InterruptedVideo[]
  )
const completedVideos = () =>
  watchedVideos().then((videos) => videos.filter((video) => video.__typename === COMPLETED_VIDEO) as CompletedVideo[])

const watchedVideo = (id: string) => watchedVideos().then((videos) => videos.find((v) => v.id === id) ?? null)
const setWatchedVideo = async (
  __typename: typeof COMPLETED_VIDEO | typeof INTERRUPTED_VIDEO,
  id: string,
  timestamp: number
) => {
  const currentVideos = await watchedVideos()
  const isIncluded = currentVideos.find((v) => v.id === id)
  switch (isIncluded?.__typename) {
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
        currentVideos.map((v) => (v.id ? { __typename, id, timestamp } : v))
      )
      break
    }
    default: {
      const newVideo = __typename === 'COMPLETED' ? { __typename, id } : { __typename, id, timestamp }
      writeToLocalStorage('watchedVideos', [...currentVideos, newVideo])
    }
  }
}

const followedChannels = promisify(() => readFromLocalStorage<FollowedChannel[]>('followedChannels') ?? [])
const isFollowingChannel = (id: string) => followedChannels().then((channels) => channels.some((ch) => ch.id === id))
const setChannelFollowing = async (id: string, follow = true) => {
  const currentFollowedChannels = await followedChannels()
  const isFollowing = currentFollowedChannels.some((channel) => channel.id === id)

  const newFollowedChannels = follow
    ? !isFollowing
      ? [...currentFollowedChannels, id]
      : currentFollowedChannels
    : !isFollowing
    ? currentFollowedChannels
    : currentFollowedChannels.filter((channel) => channel.id === id)

  writeToLocalStorage('followedChannels', newFollowedChannels)
}

export function getInitialPersonalData() {
  const watchedVideos = readFromLocalStorage<WatchedVideo[]>('watchedVideos') ?? []
  const followedChannels = readFromLocalStorage<FollowedChannel[]>('followedChannels') ?? []
  return {
    watchedVideos,
    followedChannels,
  }
}

const localStorageClient: UserPersonalData = {
  watchedVideos,
  interruptedVideos,
  completedVideos,
  watchedVideo,
  setWatchedVideo,
  followedChannels,
  isFollowingChannel,
  setChannelFollowing,
}

export default localStorageClient
