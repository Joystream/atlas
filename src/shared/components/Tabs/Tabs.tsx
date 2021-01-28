import React, { useState } from 'react'
import { TabsGroup, Tab } from './Tabs.styles'

type TabsProps = {
  tabs: string[]
  initialIndex?: number
  onSelectTab: (idx: number) => void
}
const Tabs: React.FC<TabsProps> = ({ tabs, onSelectTab, initialIndex = -1 }) => {
  const [selected, setSelected] = useState(initialIndex)

  return (
    <TabsGroup>
      {tabs.map((tab, idx) => (
        <Tab
          onClick={(e) => {
            onSelectTab(idx)
            setSelected(idx)
          }}
          key={`${tab}-${idx}`}
          selected={selected === idx}
        >
          <span>{tab}</span>
        </Tab>
      ))}
    </TabsGroup>
  )
}
export default Tabs
