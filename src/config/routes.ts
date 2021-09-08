export const BASE_PATHS = {
  // must be empty so we don't get double '/' after joining paths
  viewer: '',
  legal: '/legal',
  studio: '/studio',
  playground: '/playground',
} as const

const withQueryParameters = (basePath: string, query: Record<string, string> = {}) => {
  if (Object.values(query).length) {
    const queryParams = new URLSearchParams()
    Object.entries(query).map(([key, value]) => queryParams.set(key, value))
    return `${basePath}?${queryParams.toString()}`
  }
  return basePath
}

export const relativeRoutes = {
  viewer: {
    index: () => '',
    new: () => 'new',
    popular: () => 'popular',
    search: (query?: { query?: string }) => withQueryParameters('search', query),
    channel: (id = ':id') => `channel/${id}`,
    channels: () => 'channels',
    video: (id = ':id') => `video/${id}`,
  },
  legal: {
    index: () => '',
    copyright: () => 'copyright',
    termsOfService: () => 'tos',
  },
  studio: {
    index: () => '',
    newChannel: () => 'channel/new',
    editChannel: () => 'channel',
    videos: () => 'videos',
    editVideo: () => 'edit-video',
    uploads: () => 'uploads',
    signIn: (query?: { step?: string }) => withQueryParameters('signin', query),
    signInJoin: (query?: { step?: string }) => withQueryParameters('signin/join', query),
    newMembership: () => 'membership/new',
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
    routesAcc[routeKeyStr] = (...params: never[]) => {
      // @ts-ignore typing this is too much work
      const relativeRoute = routes[routeKeyStr](...params)
      const absoluteRoute = [basePath, relativeRoute].join('/')
      // remove trailing slash if the URL is not '/'
      return absoluteRoute.length > 1 ? absoluteRoute.replace(/\/$/, '') : absoluteRoute
    }
    return routesAcc
  }, {} as typeof routes)

  return absoluteRoutesAcc
}, {} as typeof relativeRoutes)

export const QUERY_PARAMS = {
  SEARCH: 'query',
  JOIN: 'step',
}
