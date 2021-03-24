export default {
  viewer: {
    index: () => '',
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
    index: () => 'studio',
    newChannel: () => 'channel/new',
    editChannel: () => 'channel',
    videos: () => 'videos',
    uploads: () => 'uploads',
  },
  playground: {
    index: () => 'playground',
  },
}

export const QUERY_PARAMS = {
  SEARCH: 'query',
}
