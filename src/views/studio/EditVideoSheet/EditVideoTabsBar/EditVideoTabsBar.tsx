import React, { useRef } from 'react'

import { EditVideoSheetState, EditVideoSheetTab, useEditVideoSheetTabData } from '@/providers/editVideoSheet'
import { Badge } from '@/shared/components/Badge'
import { IconButton } from '@/shared/components/IconButton'
import { SvgGlyphClose, SvgGlyphMaximize, SvgGlyphMinimize, SvgGlyphPlus } from '@/shared/icons'

import {
  AddDraftButtonContainer,
  ButtonsContainer,
  Tab,
  TabTitle,
  TabWrapper,
  TabsContainer,
  Topbar,
} from './EditVideoTabsBar.style'

type TabsBarProps = {
  videoTabs: EditVideoSheetTab[]
  selectedVideoTab?: EditVideoSheetTab
  sheetState: EditVideoSheetState
  onAddNewTabClick: () => void
  onRemoveTabClick: (tabIdx: number) => void
  onTabSelect: (tabIdx: number) => void
  onCloseClick: () => void
  onToggleMinimizedClick: () => void
}

export const EditVideoTabsBar: React.FC<TabsBarProps> = ({
  videoTabs,
  selectedVideoTab,
  sheetState,
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
          <EditVideoTab
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
            <SvgGlyphPlus />
          </IconButton>
        </AddDraftButtonContainer>
      </TabsContainer>
      <ButtonsContainer>
        <IconButton variant="tertiary" onClick={onToggleMinimizedClick}>
          {sheetState === 'open' ? <SvgGlyphMinimize /> : <SvgGlyphMaximize />}
        </IconButton>
        <IconButton variant="tertiary" onClick={onCloseClick}>
          <SvgGlyphClose />
        </IconButton>
      </ButtonsContainer>
    </Topbar>
  )
}

type EditVideoTabProps = {
  tab: EditVideoSheetTab
  selected: boolean
  isLast?: boolean
  onTabSelect: (e: React.MouseEvent<HTMLDivElement>) => void
  onRemoveTabClick: () => void
}

const getBadgeText = (tab: EditVideoSheetTab) => {
  if (tab.isNew || tab.isDraft) {
    return 'New'
  }
  if (!tab.isNew) {
    return 'Edit'
  }
  return
}

const EditVideoTab: React.FC<EditVideoTabProps> = ({ tab, isLast, selected, onTabSelect, onRemoveTabClick }) => {
  const { tabData } = useEditVideoSheetTabData(tab)
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
          <SvgGlyphClose />
        </IconButton>
        <TabTitle secondary={!selected} variant="subtitle2">
          {tabData?.title || 'Untitled'}
        </TabTitle>
        {badgeText && <Badge variant="caption">{badgeText}</Badge>}
      </Tab>
    </TabWrapper>
  )
}
