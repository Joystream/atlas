import React from 'react'

import { SvgNavChannels, SvgNavHome, SvgNavNew, SvgNavPopular } from '@/components/icons'
import { absoluteRoutes } from '@/config/routes'

export const viewerNavItems = [
  {
    icon: <SvgNavHome />,
    name: 'Home',
    to: absoluteRoutes.viewer.index(),
  },
  {
    icon: <SvgNavPopular />,
    name: 'Popular',
    to: absoluteRoutes.viewer.popular(),
  },
  {
    icon: <SvgNavNew />,
    name: 'New',
    to: absoluteRoutes.viewer.new(),
  },
  // {
  //   icon: <SvgNavDiscover />,
  //   name: 'Discover',
  //   to: absoluteRoutes.viewer.discover(),
  // },
  {
    icon: <SvgNavChannels />,
    name: 'Channels',
    to: absoluteRoutes.viewer.channels(),
  },
]
