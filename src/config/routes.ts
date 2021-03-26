export default {
  viewer: {
    index: () => '/',
    search: ({ query }: { query?: string } = {}) => {
      const basePath = '/search'

      if (query) {
        const searchQueryParams = new URLSearchParams()
        searchQueryParams.set(QUERY_PARAMS.SEARCH, query.trim())
        return `${basePath}?${searchQueryParams.toString()}`
      }

      return basePath
    },
    channel: (id = ':id') => `/channel/${id}`,
    channels: () => '/channels',
    video: (id = ':id') => `/video/${id}`,
    videos: () => '/videos',
  },
  studio: {
    index: () => '/studio',
    newChannel: () => '/studio/channel/new',
    editChannel: () => '/studio/channel',
    videos: () => '/studio/videos',
    uploads: () => '/studio/uploads',
  },
  playground: {
    index: () => '/playground',
  },
}

export const QUERY_PARAMS = {
  SEARCH: 'query',
}
