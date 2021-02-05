export default {
  index: () => '/',
  video: (id = ':id') => `/video/${id}`,
  searchOverlay: () => `/search`,
  search: () => `/search`,
  channel: (id = ':id') => `/channel/${id}`,
  videos: () => '/videos',
  channels: () => '/channels',
}

export const QUERY_PARAMS = {
  SEARCH: 'query',
}
