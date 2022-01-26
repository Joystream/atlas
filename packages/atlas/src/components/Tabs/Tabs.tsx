import { throttle } from 'lodash-es'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Pill } from '@/components/Pill'
import { transitions } from '@/styles'

import { BackgroundGradient, Tab, TabsGroup, TabsWrapper } from './Tabs.styles'

export type TabItem = {
  name: string
  badgeNumber?: number
  pillText?: string | number
}
export type TabsProps = {
  tabs: TabItem[]
  initialIndex?: number
  onSelectTab: (idx: number) => void
  selected?: number
  className?: string
}

const SCROLL_SHADOW_OFFSET = 10

export const Tabs: React.FC<TabsProps> = React.memo(
  ({ tabs, onSelectTab, initialIndex = -1, selected: paramsSelected, className }) => {
    const [_selected, setSelected] = useState(initialIndex)
    const selected = paramsSelected ?? _selected
    const [isContentOverflown, setIsContentOverflown] = useState(false)
    const tabsGroupRef = useRef<HTMLDivElement>(null)
    const tabRef = useRef<HTMLDivElement>(null)
    const [shadowsVisible, setShadowsVisible] = useState({
      left: false,
      right: true,
    })

    useEffect(() => {
      const tabsGroup = tabsGroupRef.current
      if (!tabsGroup) {
        return
      }
      setIsContentOverflown(tabsGroup.scrollWidth > tabsGroup.clientWidth)
    }, [])

    useEffect(() => {
      const tabsGroup = tabsGroupRef.current
      const tab = tabRef.current
      if (!tabsGroup || !isContentOverflown || !tab) {
        return
      }
      const { clientWidth, scrollWidth } = tabsGroup
      const tabWidth = tab.offsetWidth

      const middleTabPosition = clientWidth / 2 - tabWidth / 2

      tabsGroup.scrollLeft = tab.offsetLeft - middleTabPosition

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
        <CSSTransition
          in={shadowsVisible.right && isContentOverflown}
          timeout={100}
          classNames={transitions.names.fade}
          unmountOnExit
        >
          <BackgroundGradient direction="next" />
        </CSSTransition>
        <TabsGroup ref={tabsGroupRef}>
          {tabs.map((tab, idx) => (
            <Tab
              onClick={createClickHandler(idx)}
              key={`${tab.name}-${idx}`}
              selected={selected === idx}
              ref={selected === idx ? tabRef : null}
            >
              <span data-badge={tab.badgeNumber}>
                {tab.name}
                {tab.pillText && <Pill size="small" label={tab.pillText} />}
              </span>
            </Tab>
          ))}
        </TabsGroup>
      </TabsWrapper>
    )
  }
)

Tabs.displayName = 'Tabs'
