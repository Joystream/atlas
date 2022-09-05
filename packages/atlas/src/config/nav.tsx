import {
  SvgSidebarChannels,
  SvgSidebarExplore,
  SvgSidebarHome,
  SvgSidebarNew,
  SvgSidebarNft,
  SvgSidebarPopular,
  SvgSidebarYpp,
} from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'

export const viewerNavItems = [
  {
    icon: <SvgSidebarHome />,
    name: 'Home',
    to: absoluteRoutes.viewer.index(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarPopular />,
    name: 'Popular',
    to: absoluteRoutes.viewer.popular(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarNft />,
    expandedName: 'Video NFTs',
    name: 'NFT',
    to: absoluteRoutes.viewer.nfts(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarNew />,
    expandedName: 'New & Noteworthy',
    name: 'New',
    to: absoluteRoutes.viewer.new(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarExplore />,
    name: 'Discover',
    to: absoluteRoutes.viewer.discover(),
    bottomNav: false,
  },
  {
    icon: <SvgSidebarChannels />,
    name: 'Channels',
    to: absoluteRoutes.viewer.channels(),
    bottomNav: true,
  },
  {
    icon: <SvgSidebarYpp />,
    name: 'YPP',
    expandedName: 'YouTube Partner Program',
    to: absoluteRoutes.viewer.ypp(),
    bottomNav: false,
  },
]
