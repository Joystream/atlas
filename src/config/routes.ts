export default {
  index: () => '/',
  video: (id = ':id') => `/video/${id}`,
  searchOverlay: () => `/search`,
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
  videos: () => '/videos',
  channels: () => '/channels',
  playground: () => '/playground',
  studio: () => `/studio`,
}

export const studioRoutes = {
  newChannel: () => '/channel/new',
  editChannel: () => `/channel`,
  uploadVideo: () => `/studio/upload`,
}

export const QUERY_PARAMS = {
  SEARCH: 'query',
}
