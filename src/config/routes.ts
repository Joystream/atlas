export default {
  index: () => '/',
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
  channels: () => '/channels',
  playground: () => '/playground',
  video: (id = ':id') => `/video/${id}`,
  videos: () => '/videos',
  myVideos: () => '/studio/videos',
  studio: () => `/studio`,
}

export const QUERY_PARAMS = {
  SEARCH: 'query',
}
