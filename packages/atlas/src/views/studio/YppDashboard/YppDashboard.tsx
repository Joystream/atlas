import { FC, useEffect, useMemo, useState } from 'react'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { YppStatusPill } from '@/components/_ypp/YppStatusPill'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { YppDashboardReferralsTab } from '@/views/studio/YppDashboard/tabs/YppDashboardReferralsTab/YppDashboardReferralsTab'

import { Divider, Header, HeaderContentBox, TabsWrapper } from './YppDashboard.styles'
import { YppDashboardMainTab, YppDashboardSettingsTab } from './tabs'

const TABS = ['Dashboard', 'Referrals', 'Settings'] as const

export const YppDashboard: FC = () => {
  const headTags = useHeadTags('YouTube Partner Program')
  const mdMatch = useMediaMatch('md')
  const [currentVideosTab, setCurrentVideosTab] = useState(0)
  const { trackPageView } = useSegmentAnalytics()
  const { processingAssets, uploads } = useUploadsStore()

  const currentTier = 1
  // TIERS.reduce((prev, current, idx) => {
  //   if (subscribersCount >= (current?.subscribers || 0)) {
  //     return idx
  //   } else {
  //     return prev
  //   }
  // }, 0)

  useEffect(() => {
    // if user avatar is currently processing membership will be refetched when it's uploaded,
    // which will trigger page view event
    const avatarId = uploads.find((upload) => upload.type === 'avatar')?.id
    if (avatarId && processingAssets.some((asset) => asset.id === avatarId)) {
      return
    }
    trackPageView('YPP Dashboard', { tab: TABS[currentVideosTab] })
  }, [currentVideosTab, processingAssets, trackPageView, uploads])

  const mappedTabs = TABS.map((tab) => ({ name: tab }))

  const content = useMemo(() => {
    switch (TABS[currentVideosTab]) {
      case 'Dashboard':
        return <YppDashboardMainTab currentTier={currentTier} />
      case 'Referrals':
        return <YppDashboardReferralsTab />
      case 'Settings':
        return <YppDashboardSettingsTab />
    }
  }, [currentVideosTab, currentTier])

  return (
    <>
      {headTags}
      <LimitedWidthContainer>
        <Header>
          <Text variant={mdMatch ? 'h700' : 'h600'} as="h1">
            YouTube Partner Program
          </Text>
          <HeaderContentBox>
            <YppStatusPill />
            {/*{TIERS.length && !isLoading && (*/}
            {/*  <TierWrapper>*/}
            {/*    {TIERS[currentTier].icon}*/}
            {/*    <TierDescription>*/}
            {/*      <div>*/}
            {/*        <TierCount>*/}
            {/*          <Text variant="h300" as="span">*/}
            {/*            Tier {currentTier + 1}{' '}*/}
            {/*          </Text>*/}
            {/*          <Text variant="t100" as="span" color="colorText">*/}
            {/*            out of {TIERS.length}*/}
            {/*          </Text>*/}
            {/*        </TierCount>*/}
            {/*        <Text variant="t100" as="p" color="colorText">*/}
            {/*          {TIERS[currentTier].rules}*/}
            {/*        </Text>*/}
            {/*      </div>*/}
            {/*      {tiersTooltip ? <Information text={tiersTooltip} /> : null}*/}
            {/*    </TierDescription>*/}
            {/*  </TierWrapper>*/}
            {/*)}*/}
          </HeaderContentBox>
        </Header>
        <TabsWrapper>
          <Tabs initialIndex={0} tabs={mappedTabs} onSelectTab={setCurrentVideosTab} />
          <Divider />
        </TabsWrapper>
        {content}
      </LimitedWidthContainer>
    </>
  )
}
