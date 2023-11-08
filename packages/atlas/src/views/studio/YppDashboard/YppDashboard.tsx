import { FC, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { SvgActionLinkUrl } from '@/assets/icons'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { ReferralLinkButton } from '@/components/_ypp/ReferralLinkButton'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'
import { YppDashboardReferralsTab } from '@/views/studio/YppDashboard/tabs/YppDashboardReferralsTab/YppDashboardReferralsTab'

import { Header, TabsWrapper } from './YppDashboard.styles'
import { YppDashboardMainTab, YppDashboardSettingsTab } from './tabs'

const TABS = ['Dashboard', 'Referrals', 'Settings'] as const
type Tab = typeof TABS[number]

export const YppDashboard: FC = () => {
  const headTags = useHeadTags('YouTube Partner Program')
  const mdMatch = useMediaMatch('md')
  const xsMatch = useMediaMatch('xs')
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab') as Tab | null
  const [currentVideosTab, setCurrentVideosTab] = useState(TABS.indexOf(tab || 'Dashboard'))
  const { trackPageView } = useSegmentAnalytics()
  const { processingAssets, uploads } = useUploadsStore()
  const { currentChannel } = useGetYppSyncedChannels()

  useEffect(() => {
    // if user avatar is currently processing membership will be refetched when it's uploaded,
    // which will trigger page view event
    const avatarId = uploads.find((upload) => upload.type === 'avatar')?.id
    if (avatarId && processingAssets.some((asset) => asset.id === avatarId)) {
      return
    }
    trackPageView('YPP Dashboard', { tab: TABS[currentVideosTab] })
  }, [currentVideosTab, processingAssets, trackPageView, uploads])

  const mappedTabs = TABS.filter((tab) => (currentChannel ? true : tab !== 'Settings')).map((tab) => ({ name: tab }))

  const content = useMemo(() => {
    switch (TABS[currentVideosTab]) {
      case 'Dashboard':
        return <YppDashboardMainTab />
      case 'Referrals':
        return <YppDashboardReferralsTab />
      case 'Settings':
        return <YppDashboardSettingsTab />
    }
  }, [currentVideosTab])

  return (
    <>
      {headTags}
      <LimitedWidthContainer>
        <Header>
          <Text variant={!xsMatch ? 'h500' : mdMatch ? 'h700' : 'h600'} as="h1">
            YouTube Partner Program
          </Text>
        </Header>
        <TabsWrapper>
          <Tabs initialIndex={0} tabs={mappedTabs} onSelectTab={setCurrentVideosTab} />
          {TABS[currentVideosTab] === 'Referrals' && <ReferralLinkButton icon={<SvgActionLinkUrl />} />}
        </TabsWrapper>
        {content}
      </LimitedWidthContainer>
    </>
  )
}
