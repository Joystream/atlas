import { throttle } from 'lodash-es'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { transitions } from '@/theme'

import { BackgroundGradient, TAB_WIDTH, Tab, TabsGroup, TabsWrapper } from './Tabs.styles'

export type TabItem = {
  name: string
  badgeNumber?: number
}
export type TabsProps = {
  tabs: TabItem[]
  initialIndex?: number
  onSelectTab: (idx: number) => void
  selected?: number
  className?: string
  variant?: 'default' | 'large'
}

const SCROLL_SHADOW_OFFSET = 10

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  onSelectTab,
  initialIndex = -1,
  selected: paramsSelected,
  className,
  variant = 'default',
}) => {
  const [_selected, setSelected] = useState(initialIndex)
  const selected = paramsSelected ?? _selected
  const [isContentOverflown, setIsContentOverflown] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [shadowsVisible, setShadowsVisible] = useState({
    left: false,
    right: true,
  })

  useEffect(() => {
    const tabsGroup = tabsRef.current
    if (!tabsGroup) {
      return
    }
    setIsContentOverflown(tabsGroup.scrollWidth > tabsGroup.clientWidth)
  }, [])

  useEffect(() => {
    const tabsGroup = tabsRef.current
    if (!tabsGroup || !isContentOverflown) {
      return
    }
    const { clientWidth, scrollWidth } = tabsGroup

    const middleTabPosition = clientWidth / 2 - TAB_WIDTH / 2
    const currentItemOffsetleft = TAB_WIDTH * selected

    tabsGroup.scrollLeft = currentItemOffsetleft - middleTabPosition

    const touchHandler = throttle(() => {
      setShadowsVisible({
        left: tabsGroup.scrollLeft > SCROLL_SHADOW_OFFSET,
        right: tabsGroup.scrollLeft < scrollWidth - clientWidth - SCROLL_SHADOW_OFFSET,
      })
    }, 100)

    tabsGroup.addEventListener('touchmove', touchHandler)
    tabsGroup.addEventListener('scroll', touchHandler)
    return () => {
      touchHandler.cancel()
      tabsGroup.removeEventListener('touchmove', touchHandler)
      tabsGroup.removeEventListener('scroll', touchHandler)
    }
  }, [isContentOverflown, selected])

  const createClickHandler = (idx?: number) => () => {
    if (idx !== undefined) {
      onSelectTab(idx)
      setSelected(idx)
    }
  }

  return (
    <TabsWrapper className={className}>
      <CSSTransition
        in={shadowsVisible.left && isContentOverflown}
        timeout={100}
        classNames={transitions.names.fade}
        unmountOnExit
      >
        <BackgroundGradient direction="prev" />
      </CSSTransition>
      <TabsGroup ref={tabsRef}>
        {tabs.map((tab, idx) => (
          <Tab
            onClick={createClickHandler(idx)}
            key={`${tab.name}-${idx}`}
            selected={selected === idx}
            variant={variant}
          >
            <span data-badge={tab.badgeNumber}>{tab.name}</span>
          </Tab>
        ))}
      </TabsGroup>
    </TabsWrapper>
  )
}
