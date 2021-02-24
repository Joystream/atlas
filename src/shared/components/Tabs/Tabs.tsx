import { transitions } from '@/shared/theme'
import { throttle } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'
import { BackgroundGradient, Tab, TabsGroup, TabsWrapper, TAB_WIDTH } from './Tabs.styles'

export type TabsProps = {
  tabs: string[]
  initialIndex?: number
  onSelectTab: (idx: number) => void
}
const Tabs: React.FC<TabsProps> = ({ tabs, onSelectTab, initialIndex = -1 }) => {
  const [selected, setSelected] = useState(initialIndex)
  const [middleTabPosition, setMiddleTabPosition] = useState(0)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [shadowsVisible, setShadowsVisible] = useState({
    left: false,
    right: true,
  })

  useResizeObserver<HTMLDivElement>({
    ref: tabsRef,
    onResize: ({ width }) => {
      if (!tabsRef.current || !width) {
        return
      }
      const isScrollBarVisible = tabsRef.current.scrollWidth > width
      if (isScrollBarVisible) {
        setMiddleTabPosition(width / 3)
      } else {
        setMiddleTabPosition(0)
      }
    },
  })

  useEffect(() => {
    const tabsGroup = tabsRef.current
    if (!tabsGroup || selected < 1) {
      return
    }
    const currentItemOffsetleft = TAB_WIDTH * selected
    if (currentItemOffsetleft) {
      tabsGroup.scrollLeft = currentItemOffsetleft - middleTabPosition
    }
  }, [middleTabPosition, selected, tabs.length, tabsRef])

  useEffect(() => {
    const tabsGroup = tabsRef.current
    if (!tabsGroup) {
      return
    }
    const touchHandler = throttle(() => {
      const { scrollLeft, clientWidth, scrollWidth } = tabsGroup
      if (scrollLeft > 10) {
        setShadowsVisible((shadows) => ({ ...shadows, left: true }))
      } else {
        setShadowsVisible((shadows) => ({ ...shadows, left: false }))
      }
      if (scrollLeft < scrollWidth - clientWidth - 10) {
        setShadowsVisible((shadows) => ({ ...shadows, right: true }))
      } else {
        setShadowsVisible((shadows) => ({ ...shadows, right: false }))
      }
    }, 100)
    tabsGroup.addEventListener('touchmove', touchHandler)
    tabsGroup.addEventListener('scroll', touchHandler)
    return () => {
      touchHandler.cancel()
      tabsGroup.removeEventListener('touchmove', touchHandler)
      tabsGroup.removeEventListener('scroll', touchHandler)
    }
  }, [])

  const createClickHandler = (idx?: number) => () => {
    if (idx !== undefined) {
      onSelectTab(idx)
      setSelected(idx)
    }
  }

  const isGradientVisible = middleTabPosition > 0

  return (
    <TabsWrapper>
      <CSSTransition
        in={shadowsVisible.left && isGradientVisible}
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
        in={shadowsVisible.right && isGradientVisible}
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
