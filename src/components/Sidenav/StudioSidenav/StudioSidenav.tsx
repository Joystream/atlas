import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { NavItemType, SidenavBase } from '@/components/Sidenav/SidenavBase'
import { absoluteRoutes } from '@/config/routes'
import { chanelUnseenDraftsSelector, useDraftStore } from '@/providers/drafts'
import { useEditVideoSheet } from '@/providers/editVideoSheet'
import { useUploadsStore } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'
import { Button } from '@/shared/components/Button'
import { SvgGlyphAddVideo, SvgGlyphExternal, SvgNavChannel, SvgNavUpload, SvgNavVideos } from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { openInNewTab } from '@/utils/browser'

const studioNavbarItems: NavItemType[] = [
  {
    icon: <SvgNavVideos />,
    name: 'Videos',
    expandedName: 'My videos',
    to: absoluteRoutes.studio.videos(),
  },
  {
    icon: <SvgNavChannel />,
    name: 'Channel',
    expandedName: 'My channel',
    to: absoluteRoutes.studio.editChannel(),
  },
  {
    icon: <SvgNavUpload />,
    name: 'Uploads',
    expandedName: 'My uploads',
    to: absoluteRoutes.studio.uploads(),
  },
]

export const StudioSidenav: React.FC = () => {
  const [expanded, setExpanded] = useState(false)
  const { activeChannelId } = useAuthorizedUser()
  const unseenDrafts = useDraftStore(chanelUnseenDraftsSelector(activeChannelId))

  const { sheetState } = useEditVideoSheet()
  const uploadsStatus = useUploadsStore((state) => state.uploadsStatus)

  const assetsInProgress = Object.values(uploadsStatus).filter((asset) => asset?.lastStatus === 'inProgress')

  const studioNavbarItemsWithBadge = studioNavbarItems.map((item) => {
    if (item.to === absoluteRoutes.studio.videos()) {
      return { ...item, badgeNumber: unseenDrafts.length }
    }
    if (item.to === absoluteRoutes.studio.uploads()) {
      return { ...item, badgeNumber: assetsInProgress.length }
    }
    return item
  })

  const handleClick = () => {
    setExpanded(false)
    openInNewTab(absoluteRoutes.viewer.index(), true)
  }

  return (
    <SidenavBase
      expanded={expanded}
      toggleSideNav={setExpanded}
      isStudio
      items={studioNavbarItemsWithBadge}
      buttonsContent={
        <>
          <CSSTransition
            in={sheetState !== 'open'}
            unmountOnExit
            timeout={parseInt(transitions.timings.loading)}
            classNames={transitions.names.fade}
          >
            <Button
              icon={<SvgGlyphAddVideo />}
              to={absoluteRoutes.studio.editVideo()}
              onClick={() => setExpanded(false)}
            >
              New Video
            </Button>
          </CSSTransition>
          <Button variant="secondary" onClick={handleClick} icon={<SvgGlyphExternal />}>
            Joystream
          </Button>
        </>
      }
    />
  )
}
