import React from 'react'

import { absoluteRoutes } from '@/config/routes'
import { SvgNavChannels, SvgNavHome, SvgNavNew, SvgNavPopular } from '@/shared/icons'

export const navItems = [
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
  {
    icon: <SvgNavChannels />,
    name: 'Channels',
    to: absoluteRoutes.viewer.channels(),
  },
]
