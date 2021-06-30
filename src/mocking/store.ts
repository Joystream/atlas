import { MocksStore, VideosChannelsData } from './types'

export const createStore = (data: VideosChannelsData): MocksStore => {
  const store: MocksStore = {
    videoViews: {},
    channelFollows: {},
    batchedVideoViews: [],
  }

  const { videos, channels } = data
  videos.forEach((v) => {
    if (v.views) {
      store.videoViews[v.id] = v.views
    }
    store.batchedVideoViews.push({
      id: v.id,
      views: v.views || 0,
    })
  })
  channels.forEach((c) => {
    if (c.follows) {
      store.channelFollows[c.id] = c.follows
    }
  })

  return store
}
