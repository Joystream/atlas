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
  studio: () => `/studio`,
  studioNewChannel: () => '/studio/channel/new',
  studioEditChannel: () => '/studio/channel',
  studioVideos: () => '/studio/videos',
  studioUploads: () => '/studio/uploads',
}

export const studioRoutes = {
  newChannel: () => '/channel/new',
  editChannel: () => '/channel',
  videos: () => '/videos',
  uploads: () => '/uploads',
}

export const QUERY_PARAMS = {
  SEARCH: 'query',
}
