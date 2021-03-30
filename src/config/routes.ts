export const BASE_PATHS = {
  // must be empty so we don't get double '/' after joining paths
  viewer: '',
  studio: '/studio',
  playground: '/playground',
} as const

export const relativeRoutes = {
  viewer: {
    index: () => '',
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
    index: () => '',
    newChannel: () => 'channel/new',
    editChannel: () => 'channel',
    videos: () => '/videos',
    uploads: () => 'uploads',
    signIn: () => 'signIn',
    newMembership: () => 'membership/new',
    selectMembership: () => 'memberships',
    selectChannel: () => 'channels',
  },
  playground: {
    index: () => '',
  },
}

export const absoluteRoutes = Object.entries(BASE_PATHS).reduce((absoluteRoutesAcc, [basePathKey, basePath]) => {
  const routes = relativeRoutes[basePathKey as keyof typeof BASE_PATHS]

  // @ts-ignore typing this is too much work ¯\_(ツ)_/¯
  absoluteRoutesAcc[basePathKey] = Object.keys(routes).reduce((routesAcc, routeKeyStr) => {
    // @ts-ignore typing this is too much work
    routesAcc[routeKeyStr] = (...params: never[]) => [basePath, routes[routeKeyStr](...params)].join('/')
    return routesAcc
  }, {} as typeof routes)

  return absoluteRoutesAcc
}, {} as typeof relativeRoutes)

export const QUERY_PARAMS = {
  SEARCH: 'query',
}
