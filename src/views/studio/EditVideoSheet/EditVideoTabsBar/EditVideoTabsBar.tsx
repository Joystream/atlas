import React, { useRef } from 'react'

import { EditVideoSheetTab, useEditVideoSheetTabData } from '@/hooks'
import { IconButton } from '@/shared/components'
import { SvgGlyphClose, SvgGlyphMinus, SvgGlyphPlus } from '@/shared/icons'

import {
  ButtonsContainer,
  Tab,
  TabsContainer,
  TabTitle,
  Topbar,
  AddDraftButtonContainer,
} from './EditVideoTabsBar.style'

type TabsBarProps = {
  videoTabs: EditVideoSheetTab[]
  selectedVideoTab?: EditVideoSheetTab
  onAddNewTabClick: () => void
  onRemoveTabClick: (tabIdx: number) => void
  onTabSelect: (tabIdx: number) => void
  onCloseClick: () => void
  onToggleMinimizedClick: () => void
}

export const EditVideoTabsBar: React.FC<TabsBarProps> = ({
  videoTabs,
  selectedVideoTab,
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
            key={tab.id}
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
          <SvgGlyphMinus />
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
  onTabSelect: (e: React.MouseEvent<HTMLDivElement>) => void
  onRemoveTabClick: () => void
}

const EditVideoTab: React.FC<EditVideoTabProps> = ({ tab, selected, onTabSelect, onRemoveTabClick }) => {
  const { tabData } = useEditVideoSheetTabData(tab)

  return (
    <Tab key={tab.id} selected={selected} onClick={onTabSelect}>
      <TabTitle variant="subtitle2">{tabData?.title || 'Untitled'}</TabTitle>
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
    </Tab>
  )
}
