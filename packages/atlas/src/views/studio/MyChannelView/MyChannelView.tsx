import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { SvgActionShow } from '@/assets/icons'
import { PageTabs } from '@/components/PageTabs'
import { Button } from '@/components/_buttons/Button'
import { MyChannelTabs, QUERY_PARAMS, absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useUser } from '@/providers/user/user.hooks'

import { BottomContainer, NoGlobalPaddingWrapper, StyledLimitedWidthContainer } from './MyChannelView.styles'
import { StudioChannelGeneralTab } from './tabs/StudioChannelGeneralTab'
import { StudioChannelNotificationsTab } from './tabs/StudioChannelNotificationsTab'

const TABS = ['General', 'Notifications'] as const

export const MyChannelView = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentTab, setCurrentTab] = useState<number>(0)
  const { channelId } = useUser()
  const navigate = useNavigate()
  const xsMatch = useMediaMatch('xs')
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
          trailingContent={
            channelId &&
            xsMatch && (
              <Button variant="secondary" to={absoluteRoutes.viewer.channel(channelId)} icon={<SvgActionShow />}>
                View channel
              </Button>
            )
          }
          onSelectTab={handleChangeTab}
          selected={currentTab}
        />
      </NoGlobalPaddingWrapper>
      <StyledLimitedWidthContainer>
        {currentTabName === 'General' && <StudioChannelGeneralTab actionBarPortal={actionBarPortal} />}
        {currentTabName === 'Notifications' && <StudioChannelNotificationsTab actionBarPortal={actionBarPortal} />}
      </StyledLimitedWidthContainer>
      <NoGlobalPaddingWrapper>
        <BottomContainer ref={actionBarPortal} />
      </NoGlobalPaddingWrapper>
    </>
  )
}
