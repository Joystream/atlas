import React from 'react'
import { EditVideoSheetTab } from '@/hooks'
import { IconButton } from '@/shared/components'
import { SvgGlyphClose, SvgGlyphMinus, SvgGlyphPlus } from '@/shared/icons'
import { ButtonsContainer, Tab, TabsContainer, TabsHeader, TabTitle, Topbar } from './EditVideoTabsBar.style'

type TabsBarProps = {
  videoTabs: EditVideoSheetTab[]
  selectedVideoTab?: EditVideoSheetTab
  onAddNewTabClick: () => void
  onRemoveTabClick: (tab: EditVideoSheetTab) => void
  onTabSelect: (tab: EditVideoSheetTab) => void
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
}) => (
  <Topbar>
    <TabsContainer>
      <TabsHeader variant="h6">Add new video</TabsHeader>
      {videoTabs.map((tab) => (
        <Tab key={tab.id} selected={tab.id === selectedVideoTab?.id} onClick={() => onTabSelect(tab)}>
          <TabTitle variant="subtitle2">{tab.title}</TabTitle>
          <IconButton size="small" variant="tertiary" onClick={() => onRemoveTabClick(tab)}>
            <SvgGlyphClose />
          </IconButton>
        </Tab>
      ))}
      <IconButton variant="tertiary" onClick={onAddNewTabClick}>
        <SvgGlyphPlus />
      </IconButton>
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
