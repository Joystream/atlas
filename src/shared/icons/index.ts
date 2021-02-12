export { ReactComponent as Bars } from './bars.svg'
export { ReactComponent as BarsPlay } from './bars-play.svg'
export { ReactComponent as BarsPlus } from './bars-plus.svg'
export { ReactComponent as Home } from './home.svg'
export { ReactComponent as HomeFill } from './home-fill.svg'
export { ReactComponent as Binocular } from './binocular.svg'
export { ReactComponent as BinocularFill } from './binocular-fill.svg'
export { ReactComponent as Browse } from './browse.svg'
export { ReactComponent as Books } from './books.svg'
export { ReactComponent as Block } from './block.svg'
export { ReactComponent as Channels } from './channels.svg'
export { ReactComponent as ChevronDown } from './chevron-down-big.svg'
export { ReactComponent as ChevronUp } from './chevron-up-big.svg'
export { ReactComponent as ChevronRight } from './chevron-right-big.svg'
export { ReactComponent as ChevronLeft } from './chevron-left-big.svg'
export { ReactComponent as Check } from './check.svg'
export { ReactComponent as Dash } from './dash.svg'
export { ReactComponent as Play } from './play.svg'
export { ReactComponent as PlayOutline } from './play-outline.svg'
export { ReactComponent as Pause } from './pause.svg'
export { ReactComponent as SoundOn } from './sound-on.svg'
export { ReactComponent as SoundOff } from './sound-off.svg'
export { ReactComponent as Search } from './search.svg'
export { ReactComponent as Times } from './times.svg'
export { ReactComponent as Videos } from './videos.svg'
export { ReactComponent as Info } from './info.svg'
export { ReactComponent as Error } from './error.svg'
export { ReactComponent as Success } from './success-check.svg'
export { ReactComponent as Camera } from './camera.svg'

const icons = [
  'bars',
  'bars-play',
  'bars-plus',
  'home',
  'home-fill',
  'binocular',
  'binocular-fill',
  'browse',
  'books',
  'block',
  'channels',
  'chevron-down',
  'chevron-up',
  'chevron-right',
  'chevron-left',
  'check',
  'dash',
  'play',
  'play-outline',
  'pause',
  'search',
  'sound-on',
  'sound-off',
  'times',
  'videos',
  'info',
  'error',
  'success',
  'camera',
] as const

export type IconType = typeof icons[number]
