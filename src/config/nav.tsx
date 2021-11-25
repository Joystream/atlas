import React from 'react'

import {
  SvgSidebarChannels,
  SvgSidebarExplore,
  SvgSidebarHome,
  SvgSidebarNew,
  SvgSidebarPopular,
} from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'

export const viewerNavItems = [
  {
    icon: <SvgSidebarHome />,
    name: 'Home',
    to: absoluteRoutes.viewer.index(),
  },
  {
    icon: <SvgSidebarPopular />,
    name: 'Popular',
    to: absoluteRoutes.viewer.popular(),
  },
  {
    icon: <SvgSidebarNew />,
    name: 'New',
    to: absoluteRoutes.viewer.new(),
  },
  {
    icon: <SvgSidebarExplore />,
    name: 'Discover',
    to: absoluteRoutes.viewer.discover(),
  },
  {
    icon: <SvgSidebarChannels />,
    name: 'Channels',
    to: absoluteRoutes.viewer.channels(),
  },
]
