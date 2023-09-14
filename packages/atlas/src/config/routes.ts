export const BASE_PATHS = {
  // must be empty so we don't get double '/' after joining paths
  viewer: '',
  embedded: '/embedded',
  legal: '/legal',
  studio: '/studio',
  playground: '/playground',
} as const

export type MemberSettingsTabs = 'Public profile' | 'Wallet' | 'Notifications'
export type MemberTabs = 'NFTs' | 'Activity' | 'About'
export type MyChannelTabs = 'General' | 'Notifications'

const withQueryParameters = (basePath: string, query: Record<string, string> = {}) => {
  if (Object.values(query).length) {
    const queryParams = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (typeof value !== 'undefined') queryParams.set(key, value)
    })
    return `${basePath}?${queryParams.toString()}`
  }
  return basePath
}

export const relativeRoutes = {
  embedded: {
    video: (id = ':id') => `video/${id}`,
  },
  viewer: {
    index: () => '',
    discover: () => 'discover',
    category: (id = ':id') => `category/${id}`,
    search: (query?: { [QUERY_PARAMS.SEARCH]?: string }) => withQueryParameters('search', query),
    channel: (id = ':id') => `channel/${id}`,
    channels: () => 'channels',
    video: (id = ':id', query?: { [QUERY_PARAMS.COMMENT_ID]?: string }) => withQueryParameters(`video/${id}`, query),
    memberSettings: (query?: { [QUERY_PARAMS.TAB]?: MemberSettingsTabs }) =>
      withQueryParameters(`member/settings`, query),
    member: (handle = ':handle', query?: { [QUERY_PARAMS.TAB]?: MemberTabs }) =>
      withQueryParameters(`member/${handle}`, query),
    memberNotifications: () => 'notifications/member',
    marketplace: () => 'marketplace',
    ypp: (query?: { [QUERY_PARAMS.REFERRER_ID]?: string }) => withQueryParameters('ypp', query),
    yppDashboard: () => 'ypp-dashboard',
  },
  legal: {
    index: () => '',
    copyright: () => 'copyright',
    termsOfService: () => 'tos',
    privacyPolicy: () => 'privacyPolicy',
  },
  studio: {
    index: () => '',
    myChannel: (query?: { [QUERY_PARAMS.TAB]?: MyChannelTabs }) => withQueryParameters('channel', query),
    videos: () => 'videos',
    crtWelcome: () => 'crt-welcome',
    crtTokenPreview: () => 'crt-preview',
    crtTokenPreviewEdit: () => 'crt-preview-edit',
    videoWorkspace: () => 'video-workspace',
    uploads: () => 'uploads',
    signIn: () => 'signin',
    channelNotifications: () => 'notifications/channel',
    payments: () => 'payments',
    ypp: () => 'ypp',
    yppDashboard: () => 'ypp/dashboard',
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
  COMMENT_ID: 'commentId',
  REFERRER_ID: 'referrerId',
  TAB: 'tab',
} as const
