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
export { ReactComponent as BringUp } from './bring-up.svg'
export { ReactComponent as Channels } from './channels.svg'
export { ReactComponent as ChevronDown } from './chevron-down-big.svg'
export { ReactComponent as ChevronUp } from './chevron-up-big.svg'
export { ReactComponent as ChevronRight } from './chevron-right-big.svg'
export { ReactComponent as ChevronLeft } from './chevron-left-big.svg'
export { ReactComponent as Check } from './check.svg'
export { ReactComponent as Dash } from './dash.svg'
export { ReactComponent as KebabMenu } from './kebab-menu.svg'
export { ReactComponent as Pencil } from './pencil.svg'
export { ReactComponent as PencilFill } from './pencil-fill.svg'
export { ReactComponent as Page } from './page.svg'
export { ReactComponent as Position } from './position.svg'
export { ReactComponent as Play } from './play.svg'
export { ReactComponent as PlayOutline } from './play-outline.svg'
export { ReactComponent as Pause } from './pause.svg'
export { ReactComponent as SoundOn } from './sound-on.svg'
export { ReactComponent as SoundOff } from './sound-off.svg'
export { ReactComponent as Search } from './search.svg'
export { ReactComponent as Trash } from './trash.svg'
export { ReactComponent as Link } from './link.svg'
export { ReactComponent as Close } from './close.svg'
export { ReactComponent as Videos } from './videos.svg'
export { ReactComponent as Info } from './info.svg'
export { ReactComponent as Error } from './error.svg'
export { ReactComponent as Success } from './success-check.svg'
export { ReactComponent as Camera } from './camera.svg'
export { ReactComponent as ZoomIn } from './zoom-in.svg'
export { ReactComponent as ZoomOut } from './zoom-out.svg'
export { ReactComponent as Warning } from './warning.svg'
export { ReactComponent as Gear } from './gear.svg'
export { ReactComponent as Unlisted } from './unlisted.svg'
export { ReactComponent as VideoDnd } from './video-dnd.svg'
export { ReactComponent as ImageDnd } from './image-dnd.svg'
export { ReactComponent as TrashFill } from './trash-fill.svg'
export { ReactComponent as PlaySmall } from './play-small.svg'
export { ReactComponent as ErrorSecond } from './error-second.svg'
export { ReactComponent as VideoCamera } from './video-camera.svg'
export { ReactComponent as Padlock } from './padlock.svg'
export { ReactComponent as Upload } from './upload.svg'
export { ReactComponent as External } from './external.svg'
export { ReactComponent as AddVideo } from './add-video.svg'
export { ReactComponent as NewChannel } from './new-channel.svg'
export { ReactComponent as Logout } from './logout.svg'
export { ReactComponent as DialogSuccess } from './dialog-success.svg'
export { ReactComponent as DialogWarning } from './dialog-warning.svg'
export { ReactComponent as DialogError } from './dialog-error.svg'
export { ReactComponent as MyVideos } from './my-videos.svg'
export { ReactComponent as MyChannel } from './my-channel.svg'
export { ReactComponent as MyUploads } from './my-uploads.svg'
export { ReactComponent as Chrome } from './chrome.svg'
export { ReactComponent as Firefox } from './firefox.svg'
export { ReactComponent as ArrowDown } from './arrow-down.svg'
export { ReactComponent as Profile } from './profile.svg'
export { ReactComponent as VideoFile } from './video-file.svg'
export { ReactComponent as ImageFile } from './image-file.svg'

const icons = [
  'bring-up',
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
  'close',
  'dash',
  'kebab-menu',
  'pencil',
  'pencil-fill',
  'page',
  'position',
  'play',
  'play-outline',
  'pause',
  'search',
  'sound-on',
  'sound-off',
  'link',
  'videos',
  'info',
  'error',
  'success',
  'camera',
  'warning',
  'trash',
  'gear',
  'unlisted',
  'zoom-in',
  'zoom-out',
  'video-dnd',
  'image-dnd',
  'trash-fill',
  'play-small',
  'error-second',
  'video-camera',
  'padlock',
  'upload',
  'external',
  'add-video',
  'new-channel',
  'logout',
  'dialog-success',
  'dialog-warning',
  'dialog-error',
  'my-videos',
  'my-channel',
  'my-uploads',
  'chrome',
  'firefox',
  'arrow-down',
  'profile',
  'video-file',
  'image-file',
] as const

export type IconType = typeof icons[number]
