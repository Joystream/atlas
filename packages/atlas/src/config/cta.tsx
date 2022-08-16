import { CallToActionButtonProps } from '@/components/_buttons/CallToActionButton'
import {
  SvgSidebarChannels,
  SvgSidebarExplore,
  SvgSidebarHome,
  SvgSidebarNew,
  SvgSidebarPopular,
} from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'

export const CTA_MAP: Record<string, CallToActionButtonProps> = {
  home: {
    label: 'Home',
    to: absoluteRoutes.viewer.index(),
    colorVariant: 'yellow',
    icon: <SvgSidebarHome />,
  },
  new: {
    label: 'New & Noteworthy',
    to: absoluteRoutes.viewer.new(),
    colorVariant: 'green',
    icon: <SvgSidebarNew />,
  },
  channels: {
    label: 'Browse channels',
    to: absoluteRoutes.viewer.channels(),
    colorVariant: 'blue',
    iconColorVariant: 'lightBlue',
    icon: <SvgSidebarChannels />,
  },
  popular: {
    label: 'Popular on Atlas',
    to: absoluteRoutes.viewer.popular(),
    colorVariant: 'red',
    icon: <SvgSidebarPopular />,
  },
  discover: {
    label: 'Discover videos',
    to: absoluteRoutes.viewer.discover(),
    colorVariant: 'yellow',
    icon: <SvgSidebarExplore />,
  },
}
