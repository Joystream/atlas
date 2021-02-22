import React, { useEffect, useRef, useState } from 'react'
import useResizeObserver from 'use-resize-observer'
import { TabsGroup, Tab, TabsWrapper, BackgroundGradient, TAB_WIDTH } from './Tabs.styles'

export type TabsProps = {
  tabs: string[]
  initialIndex?: number
  onSelectTab: (idx: number) => void
}
const Tabs: React.FC<TabsProps> = ({ tabs, onSelectTab, initialIndex = -1 }) => {
  const [selected, setSelected] = useState(initialIndex)
  const [center, setCenter] = useState(0)
  const { ref: tabsRef } = useResizeObserver<HTMLImageElement>({
    onResize: ({ width }) => {
      if (!tabsRef.current || !width) {
        return
      }
      const isScrollBarVisible = tabsRef.current.scrollWidth > width
      if (isScrollBarVisible) {
        setCenter(width / 3)
      } else {
        setCenter(0)
      }
    },
  })

  useEffect(() => {
    const tabsGroup = tabsRef.current
    if (!tabsGroup) {
      return
    }
    const currentItemOffsetleft = selected > 0 && TAB_WIDTH * selected
    if (currentItemOffsetleft) {
      tabsGroup.scrollLeft = currentItemOffsetleft - center
    }
  }, [center, selected, tabs.length, tabsRef])

  const isLeftGradientVisible = center > 0 && selected > 0
  const isRightGradientVisible = center > 0 && selected !== tabs.length - 1

  return (
    <TabsWrapper>
      {isLeftGradientVisible && <BackgroundGradient direction="prev" />}
      <TabsGroup ref={tabsRef}>
        {tabs.map((tab, idx) => (
          <Tab
            onClick={() => {
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
      {isRightGradientVisible && <BackgroundGradient direction="next" />}
    </TabsWrapper>
  )
}
export default Tabs
