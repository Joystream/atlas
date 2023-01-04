import { useState } from 'react'

import { SvgActionAddVideo, SvgActionPlus } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Select } from '@/components/_inputs/Select'
import { absoluteRoutes } from '@/config/routes'
import { PLAYLIST_SORT_OPTIONS } from '@/config/sorting'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { MobileButton, TabsContainer } from '@/views/studio/MyVideosView/MyVideos.styles'

const TABS = ['My playlists', 'Public', 'Unlisted'] as const

export const MyPlaylistsView = () => {
  const headTags = useHeadTags('My playlists')
  const smMatch = useMediaMatch('sm')
  const mdMatch = useMediaMatch('md')
  const [currentPlaylistsTab, setCurrentPlaylistsTab] = useState(0)
  const [sortPlaylistBy, setSortPlaylist] = useState(0)

  const tabName = TABS[currentPlaylistsTab]

  const mappedTabs = TABS.map((tab) => ({ name: tab }))
  return (
    <LimitedWidthContainer>
      {headTags}
      <Text as="h1" variant="h700" margin={{ top: 12, bottom: 12 }}>
        My playlists
      </Text>
      {!smMatch && (
        <MobileButton size="large" to={absoluteRoutes.studio.playlist()} icon={<SvgActionAddVideo />} fullWidth>
          Upload video
        </MobileButton>
      )}
      <TabsContainer>
        <Tabs initialIndex={0} tabs={mappedTabs} onSelectTab={setCurrentPlaylistsTab} />
        {mdMatch && (
          <Select
            size="medium"
            inlineLabel="Sort by"
            value={sortPlaylistBy}
            items={PLAYLIST_SORT_OPTIONS}
            onChange={(val) => val && setSortPlaylist(val)}
          />
        )}
        {smMatch && (
          <Button to={absoluteRoutes.studio.videoWorkspace()} icon={<SvgActionAddVideo />}>
            Create new playlist
          </Button>
        )}
      </TabsContainer>
      {tabName === 'My playlists' && (
        <EmptyFallback
          title="Create your first playlist"
          subtitle="You don’t have any playlist yet. Create one to showcase your videos in a new way."
          variant="large"
          button={
            <Button
              icon={<SvgActionPlus />}
              // to={absoluteRoutes.studio.videoWorkspace()}
              variant="secondary"
              size="large"
              // onClick={handleAddVideoTab}
            >
              Create new playlist
            </Button>
          }
        />
      )}
    </LimitedWidthContainer>
  )
}
