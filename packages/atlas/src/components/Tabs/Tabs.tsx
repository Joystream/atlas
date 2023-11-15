import { FC, ReactNode, memo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { FlexBox } from '@/components/FlexBox'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { useHorizonthalFade } from '@/hooks/useHorizonthalFade'
import { transitions } from '@/styles'

import { ButtonWrapper, StyledButton, StyledPill, Tab, TabsGroup, TabsWrapper } from './Tabs.styles'

import { SvgActionChevronL, SvgActionChevronR } from '../../assets/icons'

export type TabItem = {
  name: string
  description?: string
  icon?: ReactNode
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
  isBig: boolean
}

export const Tabs: FC<TabsProps> = memo(
  ({ tabs, onSelectTab, initialIndex = -1, selected: paramsSelected, underline, className, isBig }) => {
    const [_selected, setSelected] = useState(initialIndex)
    const selected = paramsSelected ?? _selected
    const tabsGroupRef = useRef<HTMLDivElement>(null)
    const tabRef = useRef<HTMLDivElement>(null)

    const { handleMouseDown, handleArrowScroll, isOverflow, visibleShadows } = useHorizonthalFade(tabsGroupRef)

    const createClickHandler = (idx?: number) => () => {
      if (idx !== undefined) {
        onSelectTab(idx)
        setSelected(idx)
      }
    }

    return (
      <TabsWrapper className={className}>
        <CSSTransition
          in={visibleShadows.left && isOverflow}
          timeout={100}
          classNames={transitions.names.fade}
          unmountOnExit
        >
          <ButtonWrapper direction="prev">
            <StyledButton
              onClick={handleArrowScroll('left')}
              size="small"
              variant="tertiary"
              icon={<SvgActionChevronL />}
            />
          </ButtonWrapper>
        </CSSTransition>
        <CSSTransition
          in={visibleShadows.right && isOverflow}
          timeout={100}
          classNames={transitions.names.fade}
          unmountOnExit
        >
          <ButtonWrapper direction="next">
            <StyledButton
              onClick={handleArrowScroll('right')}
              data-right
              size="small"
              variant="tertiary"
              icon={<SvgActionChevronR />}
            />
          </ButtonWrapper>
        </CSSTransition>
        <TabsGroup
          data-underline={!!underline}
          ref={tabsGroupRef}
          onMouseDown={handleMouseDown}
          visibleShadows={visibleShadows}
          isBig={isBig}
        >
          {tabs.map((tab, idx) => {
            const tabComponent = (
              <Text
                as="span"
                color={selected !== idx ? 'colorText' : undefined}
                variant={isBig ? 'h400' : selected === idx ? 't200-strong' : 't200'}
                align="center"
                data-badge={tab.badgeNumber}
              >
                {tab.name}
                {typeof tab.pillText !== 'undefined' && <StyledPill size="small" label={tab.pillText} />}
              </Text>
            )
            return (
              <Tab
                onClick={createClickHandler(idx)}
                key={`${tab.name}-${idx}`}
                selected={selected === idx}
                ref={selected === idx ? tabRef : null}
                isBig={isBig}
              >
                {isBig ? (
                  <FlexBox gap={3}>
                    <Pill round size="large" icon={tab.icon} />
                    <FlexBox flow="column">
                      {tabComponent}
                      <Text
                        as="span"
                        margin={{ bottom: 8 }}
                        color="colorText"
                        variant="t100"
                        align="center"
                        data-badge={tab.badgeNumber}
                      >
                        {tab.description}
                      </Text>
                    </FlexBox>
                  </FlexBox>
                ) : (
                  tabComponent
                )}
              </Tab>
            )
          })}
        </TabsGroup>
      </TabsWrapper>
    )
  }
)

Tabs.displayName = 'Tabs'
