import { ReactNode, useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { PageTabs } from '@/components/PageTabs'
import { MyChannelTabs, QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMountEffect } from '@/hooks/useMountEffect'

import {
  BottomContainer,
  NoGlobalPaddingWrapper,
  ScrollWrapper,
  StyledLimitedWidthContainer,
} from './MyChannelView.styles'
import { StudioChannelGeneralTab } from './tabs/StudioChannelGeneralTab'

const TABS = ['General'] as const

const MyChannelView = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentTab, setCurrentTab] = useState<number>(0)
  const [trailingContent, setTrailingContent] = useState<null | ReactNode>(null)
  const navigate = useNavigate()
  const actionBarPortal = useRef<HTMLDivElement>(null)
  const currentTabName = searchParams.get(QUERY_PARAMS.TAB) as MyChannelTabs | null
  const headTags = useHeadTags('My channel')

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
      {headTags}
      <NoGlobalPaddingWrapper>
        <PageTabs
          tabs={TABS.map((tab) => ({ name: tab }))}
          trailingContent={trailingContent}
          onSelectTab={handleChangeTab}
          selected={currentTab}
        />

        <ScrollWrapper>
          <StyledLimitedWidthContainer>
            {currentTabName === 'General' && (
              <StudioChannelGeneralTab setTrailingContent={setTrailingContent} actionBarPortal={actionBarPortal} />
            )}
          </StyledLimitedWidthContainer>
        </ScrollWrapper>
        <BottomContainer ref={actionBarPortal} />
      </NoGlobalPaddingWrapper>
    </>
  )
}

export default MyChannelView
