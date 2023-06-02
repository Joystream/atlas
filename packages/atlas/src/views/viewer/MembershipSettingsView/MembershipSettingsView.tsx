import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { PageTabs } from '@/components/PageTabs'
import { MemberSettingsTabs, QUERY_PARAMS, absoluteRoutes } from '@/config/routes'

import { MembershipPublicProfile } from './MembershipPublicProfile'
import { NoGlobalPaddingWrapper } from './MembershipSettingsView.styles'

const TABS: MemberSettingsTabs[] = ['Public profile', 'Wallet', 'Notifications']

export const MembershipSettingsView: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentTab, setCurrentTab] = useState<number>(0)
  const navigate = useNavigate()
  const currentTabName = searchParams.get(QUERY_PARAMS.TAB) as MemberSettingsTabs | null

  // At mount set the tab from the search params
  const initialRender = useRef(true)
  useEffect(() => {
    if (initialRender.current) {
      const tabIndex = TABS.findIndex((t) => t === currentTabName)
      if (tabIndex === -1) setSearchParams({ tab: TABS[0] }, { replace: true })
      initialRender.current = false
    }
  }, [currentTabName, setSearchParams])

  const handleChangeTab = useCallback(
    (idx: number) => {
      navigate(absoluteRoutes.viewer.memberSettings({ tab: TABS[idx] }))
      setCurrentTab(idx)
    },
    [navigate]
  )

  return (
    <div>
      <NoGlobalPaddingWrapper>
        <PageTabs tabs={TABS.map((tab) => ({ name: tab }))} onSelectTab={handleChangeTab} selected={currentTab} />
      </NoGlobalPaddingWrapper>
      <MembershipPublicProfile />
    </div>
  )
}
