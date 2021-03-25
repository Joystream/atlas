export default {
  viewer: {
    index: (absolute?: boolean) => `${absolute ? '/' : ''}`,
    searchOverlay: () => `search`,
    search: ({ query }: { query?: string } = {}) => {
      const basePath = 'search'

      if (query) {
        const searchQueryParams = new URLSearchParams()
        searchQueryParams.set(QUERY_PARAMS.SEARCH, query.trim())
        return `${basePath}?${searchQueryParams.toString()}`
      }

      return basePath
    },
    channel: (id = ':id') => `channel/${id}`,
    channels: () => 'channels',
    video: (id = ':id') => `video/${id}`,
    videos: () => 'videos',
  },
  studio: {
    index: (absolute?: boolean) => `${absolute ? '/' : ''}studio`,
    newChannel: () => 'channel/new',
    editChannel: () => 'channel',
    videos: () => 'videos',
    uploads: () => 'uploads',
  },
  playground: {
    index: (absolute?: boolean) => `${absolute ? '/' : ''}playground`,
  },
}

export const QUERY_PARAMS = {
  SEARCH: 'query',
}
