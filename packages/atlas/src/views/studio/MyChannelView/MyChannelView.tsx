import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { PageTabs } from '@/components/PageTabs'
import { MyChannelTabs, QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useMountEffect } from '@/hooks/useMountEffect'
import { GeneralTab } from '@/views/studio/MyChannelView/tabs/GeneralTab/GeneralTab'

import { BottomContainer, NoGlobalPaddingWrapper, StyledLimitedWidthContainer } from './MyChannelView.styles'

const TABS = ['General', 'Notifications'] as const

export const MyChannelView = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentTab, setCurrentTab] = useState<number>(0)
  const navigate = useNavigate()
  const actionBarPortal = useRef<HTMLDivElement>(null)
  const currentTabName = searchParams.get(QUERY_PARAMS.TAB) as MyChannelTabs | null

  // At mount set the tab from the search params
  useMountEffect(() => {
    const tabIndex = TABS.findIndex((t) => t === currentTabName)
    if (tabIndex === -1) setSearchParams({ tab: TABS[0] }, { replace: true })
  })

  const handleChangeTab = useCallback(
    (idx: number) => {
      navigate(absoluteRoutes.studio.myChannel({ tab: TABS[idx] }))
      setCurrentTab(idx)
    },
    [navigate]
  )

  return (
    <>
      <NoGlobalPaddingWrapper>
        <PageTabs tabs={TABS.map((tab) => ({ name: tab }))} onSelectTab={handleChangeTab} selected={currentTab} />
      </NoGlobalPaddingWrapper>
      <StyledLimitedWidthContainer>
        {currentTabName === 'General' && <GeneralTab actionBarPortal={actionBarPortal} />}
      </StyledLimitedWidthContainer>
      <NoGlobalPaddingWrapper>
        <BottomContainer ref={actionBarPortal} />
      </NoGlobalPaddingWrapper>
    </>
  )
}
