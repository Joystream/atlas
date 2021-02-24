import { transitions } from '@/shared/theme'
import { throttle } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { BackgroundGradient, Tab, TabsGroup, TabsWrapper, TAB_WIDTH } from './Tabs.styles'

export type TabsProps = {
  tabs: string[]
  initialIndex?: number
  onSelectTab: (idx: number) => void
}

const SCROLL_SHADOW_OFFSET = 10

const Tabs: React.FC<TabsProps> = ({ tabs, onSelectTab, initialIndex = -1 }) => {
  const [selected, setSelected] = useState(initialIndex)
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
    const { scrollLeft, clientWidth, scrollWidth } = tabsGroup

    const middleTabPosition = clientWidth / 2 - TAB_WIDTH / 2
    const currentItemOffsetleft = TAB_WIDTH * selected

    tabsGroup.scrollLeft = currentItemOffsetleft - middleTabPosition

    const touchHandler = throttle(() => {
      setShadowsVisible({
        left: scrollLeft > SCROLL_SHADOW_OFFSET,
        right: scrollLeft < scrollWidth - clientWidth - SCROLL_SHADOW_OFFSET,
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
    <TabsWrapper>
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
          <Tab onClick={createClickHandler(idx)} key={`${tab}-${idx}`} selected={selected === idx}>
            <span>{tab}</span>
          </Tab>
        ))}
      </TabsGroup>
      <CSSTransition
        in={shadowsVisible.right && isContentOverflown}
        timeout={100}
        classNames={transitions.names.fade}
        unmountOnExit
      >
        <BackgroundGradient direction="next" />
      </CSSTransition>
    </TabsWrapper>
  )
}
export default Tabs
