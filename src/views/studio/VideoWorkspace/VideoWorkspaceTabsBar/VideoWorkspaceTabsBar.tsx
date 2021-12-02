import React, { useRef } from 'react'

import { Badge } from '@/components/Badge'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionClose, SvgActionMaximize, SvgActionMinimize, SvgActionPlus } from '@/components/_icons'
import { VideoWorkspaceState, VideoWorkspaceTab, useVideoWorkspaceTabData } from '@/providers/videoWorkspace'

import {
  AddDraftButtonContainer,
  ButtonsContainer,
  Tab,
  TabTitle,
  TabWrapper,
  TabsContainer,
  Topbar,
} from './VideoWorkspaceTabsBar.styles'

type TabsBarProps = {
  videoTabs: VideoWorkspaceTab[]
  selectedVideoTab?: VideoWorkspaceTab
  videoWorkspaceState: VideoWorkspaceState
  onAddNewTabClick: () => void
  onRemoveTabClick: (tabIdx: number) => void
  onTabSelect: (tabIdx: number) => void
  onCloseClick: () => void
  onToggleMinimizedClick: () => void
}

export const VideoWorkspaceTabsBar: React.FC<TabsBarProps> = React.memo(
  ({
    videoTabs,
    selectedVideoTab,
    videoWorkspaceState,
    onAddNewTabClick,
    onRemoveTabClick,
    onTabSelect,
    onCloseClick,
    onToggleMinimizedClick,
  }) => {
    const tabsContainerRef = useRef<HTMLDivElement>(null)
    const handleTabSelect = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
      onTabSelect(idx)
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      })
    }
    return (
      <Topbar>
        <TabsContainer ref={tabsContainerRef}>
          {videoTabs.map((tab, idx) => (
            <VideoWorkspaceSingleTab
              key={tab.id || idx}
              tab={tab}
              selected={tab.id === selectedVideoTab?.id}
              onTabSelect={(e) => handleTabSelect(e, idx)}
              onRemoveTabClick={() => onRemoveTabClick(idx)}
            />
          ))}
          <AddDraftButtonContainer
            hasOverflow={
              tabsContainerRef.current
                ? tabsContainerRef?.current.scrollWidth > tabsContainerRef?.current.clientWidth
                : false
            }
          >
            <IconButton variant="tertiary" onClick={onAddNewTabClick}>
              <SvgActionPlus />
            </IconButton>
          </AddDraftButtonContainer>
        </TabsContainer>
        <ButtonsContainer>
          <IconButton variant="tertiary" onClick={onToggleMinimizedClick}>
            {videoWorkspaceState === 'open' ? <SvgActionMinimize /> : <SvgActionMaximize />}
          </IconButton>
          <IconButton variant="tertiary" onClick={onCloseClick}>
            <SvgActionClose />
          </IconButton>
        </ButtonsContainer>
      </Topbar>
    )
  }
)

VideoWorkspaceTabsBar.displayName = 'VideoWorkspaceTabsBar'

type VideoWorkspaceTabProps = {
  tab: VideoWorkspaceTab
  selected: boolean
  isLast?: boolean
  onTabSelect: (e: React.MouseEvent<HTMLDivElement>) => void
  onRemoveTabClick: () => void
}

const getBadgeText = (tab: VideoWorkspaceTab) => {
  if (tab.isNew || tab.isDraft) {
    return 'New'
  }
  if (!tab.isNew) {
    return 'Edit'
  }
  return
}

const VideoWorkspaceSingleTab: React.FC<VideoWorkspaceTabProps> = ({
  tab,
  isLast,
  selected,
  onTabSelect,
  onRemoveTabClick,
}) => {
  const { tabData } = useVideoWorkspaceTabData(tab)
  const badgeText = getBadgeText(tab)
  return (
    <TabWrapper onClick={onTabSelect} isLast={isLast}>
      <Tab selected={selected}>
        <IconButton
          size="small"
          variant="tertiary"
          onClick={(e) => {
            e.stopPropagation()
            onRemoveTabClick()
          }}
        >
          <SvgActionClose />
        </IconButton>
        <TabTitle secondary={!selected} variant="t200">
          {tabData?.title || 'Untitled'}
        </TabTitle>
        {badgeText && <Badge variant="t100">{badgeText}</Badge>}
      </Tab>
    </TabWrapper>
  )
}
