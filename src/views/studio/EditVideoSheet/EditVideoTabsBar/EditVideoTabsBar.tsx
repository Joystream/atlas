import React from 'react'
import { EditVideoSheetTab, useEditVideoSheetTabData } from '@/hooks'
import { IconButton } from '@/shared/components'
import { SvgGlyphClose, SvgGlyphMinus, SvgGlyphPlus } from '@/shared/icons'
import { ButtonsContainer, Tab, TabsContainer, TabsHeader, TabTitle, Topbar } from './EditVideoTabsBar.style'

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
}) => (
  <Topbar>
    <TabsContainer>
      <TabsHeader variant="h6">Add new video</TabsHeader>
      {videoTabs.map((tab, idx) => (
        <EditVideoTab
          key={tab.id}
          tab={tab}
          selected={tab.id === selectedVideoTab?.id}
          onTabSelect={() => onTabSelect(idx)}
          onRemoveTabClick={() => onRemoveTabClick(idx)}
        />
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

type EditVideoTabProps = {
  tab: EditVideoSheetTab
  selected: boolean
  onTabSelect: () => void
  onRemoveTabClick: () => void
}

const EditVideoTab: React.FC<EditVideoTabProps> = ({ tab, selected, onTabSelect, onRemoveTabClick }) => {
  const { data } = useEditVideoSheetTabData(tab)

  return (
    <Tab key={tab.id} selected={selected} onClick={onTabSelect}>
      <TabTitle variant="subtitle2">{data?.title ?? '...'}</TabTitle>
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
