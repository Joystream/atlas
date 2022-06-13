import { throttle } from 'lodash-es'
import { FC, memo, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import useDraggableScroll from 'use-draggable-scroll'

import { Text } from '@/components/Text'
import { transitions } from '@/styles'

import { BackgroundGradient, StyledButton, StyledPill, Tab, TabsGroup, TabsWrapper } from './Tabs.styles'

import { SvgActionChevronL, SvgActionChevronR } from '../_icons'

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
  underline?: boolean
  className?: string
}

const SCROLL_SHADOW_OFFSET = 10

export const Tabs: FC<TabsProps> = memo(
  ({ tabs, onSelectTab, initialIndex = -1, selected: paramsSelected, underline, className }) => {
    const [_selected, setSelected] = useState(initialIndex)
    const selected = paramsSelected ?? _selected
    const [isContentOverflown, setIsContentOverflown] = useState(false)
    const tabsGroupRef = useRef<HTMLDivElement>(null)
    const tabRef = useRef<HTMLDivElement>(null)
    const [shadowsVisible, setShadowsVisible] = useState({
      left: false,
      right: true,
    })
    const { onMouseDown } = useDraggableScroll(tabsGroupRef, { direction: 'horizontal' })

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

    const handleArrowScroll = (direction: 'left' | 'right') => () => {
      const tabsGroup = tabsGroupRef.current
      const tab = tabRef.current
      if (!tabsGroup || !isContentOverflown || !tab) {
        return
      }

      const addition = (direction === 'left' ? -1 : 1) * (tabsGroup.clientWidth - tab.offsetWidth)
      tabsGroup.scrollLeft = tabsGroup.scrollLeft + addition
    }

    return (
      <TabsWrapper className={className}>
        <CSSTransition
          in={shadowsVisible.left && isContentOverflown}
          timeout={100}
          classNames={transitions.names.fade}
          unmountOnExit
        >
          <BackgroundGradient direction="prev">
            <StyledButton
              onClick={handleArrowScroll('left')}
              size="small"
              variant="tertiary"
              icon={<SvgActionChevronL />}
            />
          </BackgroundGradient>
        </CSSTransition>
        <CSSTransition
          in={shadowsVisible.right && isContentOverflown}
          timeout={100}
          classNames={transitions.names.fade}
          unmountOnExit
        >
          <BackgroundGradient direction="next">
            <StyledButton
              onClick={handleArrowScroll('right')}
              data-right
              size="small"
              variant="tertiary"
              icon={<SvgActionChevronR />}
            />
          </BackgroundGradient>
        </CSSTransition>
        <TabsGroup data-underline={!!underline} ref={tabsGroupRef} onMouseDown={onMouseDown}>
          {tabs.map((tab, idx) => (
            <Tab
              onClick={createClickHandler(idx)}
              key={`${tab.name}-${idx}`}
              selected={selected === idx}
              ref={selected === idx ? tabRef : null}
            >
              <Text
                as="span"
                color={selected !== idx ? 'default' : undefined}
                variant={selected === idx ? 't200-strong' : 't200'}
                align="center"
                data-badge={tab.badgeNumber}
              >
                {tab.name}
                {tab.pillText && <StyledPill size="small" label={tab.pillText} />}
              </Text>
            </Tab>
          ))}
        </TabsGroup>
      </TabsWrapper>
    )
  }
)

Tabs.displayName = 'Tabs'
