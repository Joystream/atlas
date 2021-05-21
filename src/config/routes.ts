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
  legal: () => '/legal',
  playground: () => '/playground',
  video: (id = ':id') => `/video/${id}`,
  videos: () => '/videos',
  myVideos: () => '/studio/videos',
  studio: () => `/studio`,
  studioNewChannel: () => '/studio/channel/new',
}

export const studioRoutes = {
  newChannel: () => '/channel/new',
  editChannel: () => `/channel`,
  myVideos: () => '/videos',
}

export const QUERY_PARAMS = {
  SEARCH: 'query',
}
