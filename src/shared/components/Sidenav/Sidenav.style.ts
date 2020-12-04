import { sizes, colors, typography, zIndex } from '../../theme'
import { makeStyles, StyleFn } from '../../utils'

export const SIDENAV_WIDTH = 56
export const EXPANDED_SIDENAV_WIDTH = 360

type SidenavStyleProps = {
  expanded: boolean
}

const nav: StyleFn = () => ({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: zIndex.nearOverlay,

  overflow: 'hidden',

  padding: `${sizes(8)} ${sizes(4)}`,

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',

  backgroundColor: colors.blue[700],
  color: colors.white,
})

const expandButton: StyleFn = () => ({
  padding: '7px',
  margin: '-4px',
})

const drawerOverlay: StyleFn<SidenavStyleProps> = (_, { expanded }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: zIndex.overlay,

  display: expanded ? 'block' : 'none',

  backgroundColor: 'rgba(0, 0, 0, 0.5)',
})

const navItemsWrapper: StyleFn = () => ({
  marginTop: '90px',
})

const navItemContainer: StyleFn = () => ({
  ':not(:first-child)': {
    marginTop: sizes(10),
  },
  display: 'flex',
  flexDirection: 'column',
})

const navItem: StyleFn = () => ({
  display: 'flex',
  alignItems: 'center',
  '> span': {
    marginLeft: sizes(8),
    fontWeight: 'bold',
    fontFamily: typography.fonts.headers,
    fontSize: typography.sizes.h5,
    lineHeight: 1,
  },
})

const navSubitemsWrapper: StyleFn = () => ({
  paddingLeft: `calc(${typography.sizes.icon.xlarge} + ${sizes(8)})`,
  overflow: 'hidden',
  '> div': {
    display: 'flex',
    flexDirection: 'column',
  },
})

const navSubitem: StyleFn = () => ({
  fontSize: typography.sizes.body2,
  fontFamily: typography.fonts.base,
  marginTop: sizes(8),
  ':first-child': {
    marginTop: sizes(6),
  },
})

export const useSidenavCSS = (props: SidenavStyleProps) => ({
  nav: makeStyles([nav])(props),
  expandButton: makeStyles([expandButton])(props),
  drawerOverlay: makeStyles([drawerOverlay])(props),
  navItemsWrapper: makeStyles([navItemsWrapper])(props),
})

export const useNavItemCSS = (props: SidenavStyleProps) => ({
  navItemContainer: makeStyles([navItemContainer])(props),
  navItem: makeStyles([navItem])(props),
  navSubitemsWrapper: makeStyles([navSubitemsWrapper])(props),
  navSubitem: makeStyles([navSubitem])(props),
})
