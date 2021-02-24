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
  const [center, setCenter] = useState(0)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [shadowsVisible, setShadowsVisible] = useState({
    left: false,
    right: false,
  })

  useResizeObserver<HTMLDivElement>({
    ref: tabsRef,
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

  useEffect(() => {
    const tabsGroup = tabsRef.current
    if (!tabsGroup) {
      return
    }
    const touchHandler = throttle(() => {
      const { scrollLeft, clientWidth, scrollWidth } = tabsGroup
      if (scrollLeft > 20) {
        setShadowsVisible((shadows) => ({ ...shadows, left: true }))
      } else {
        setShadowsVisible((shadows) => ({ ...shadows, left: false }))
      }
      if (scrollLeft < scrollWidth - clientWidth - 20) {
        setShadowsVisible((shadows) => ({ ...shadows, right: true }))
      } else {
        setShadowsVisible((shadows) => ({ ...shadows, right: false }))
      }
    }, 100)
    tabsGroup.addEventListener('touchmove', touchHandler)
    return () => {
      touchHandler.cancel()
      tabsGroup.removeEventListener('touchmove', touchHandler)
    }
  }, [])

  return (
    <TabsWrapper>
      <CSSTransition
        in={shadowsVisible.left}
        timeout={100}
        classNames={transitions.names.fade}
        unmountOnExit
        mountOnEnter
      >
        <BackgroundGradient direction="prev" />
      </CSSTransition>
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
      <CSSTransition
        in={shadowsVisible.right}
        timeout={100}
        classNames={transitions.names.fade}
        unmountOnExit
        mountOnEnter
      >
        <BackgroundGradient direction="next" />
      </CSSTransition>
    </TabsWrapper>
  )
}
export default Tabs
