export default {
  index: () => '/',
  video: (id = ':id') => `/video/${id}`,
  searchOverlay: () => `/search`,
  search: (searchStr = ':search') => `/search/${searchStr}`,
  channel: (id = ':id') => `/channel/${id}`,
  videos: () => '/videos',
  channels: () => '/channels',
}
