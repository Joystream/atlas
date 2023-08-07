import { FC, useMemo, useState } from 'react'

import { Information } from '@/components/Information'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'
import { YppDashboardReferralsTab } from '@/views/studio/YppDashboard/tabs/YppDashboardReferralsTab/YppDashboardReferralsTab'

import { TIERS } from './YppDashboard.config'
import { Divider, Header, TabsWrapper, TierCount, TierDescription, TierWrapper } from './YppDashboard.styles'
import { YppDashboardMainTab, YppDashboardSettingsTab } from './tabs'

const TABS = ['Dashboard', 'Referrals', 'Settings'] as const

const YppDashboard: FC = () => {
  const headTags = useHeadTags('YouTube Partner Program')
  const mdMatch = useMediaMatch('md')
  const [currentVideosTab, setCurrentVideosTab] = useState(0)
  const { currentChannel, isLoading } = useGetYppSyncedChannels()

  const subscribersCount = currentChannel?.subscribersCount || 0
  const currentTier = TIERS.reduce((prev, current, idx) => {
    if (subscribersCount >= (current?.subscribers || 0)) {
      return idx
    } else {
      return prev
    }
  }, 0)

  const tiersTooltip = atlasConfig.features.ypp.tiersDefinition?.tiersTooltip

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
          {TIERS.length && !isLoading && (
            <TierWrapper>
              {TIERS[currentTier].icon}
              <TierDescription>
                <div>
                  <TierCount>
                    <Text variant="h300" as="span">
                      Tier {currentTier + 1}{' '}
                    </Text>
                    <Text variant="t100" as="span" color="colorText">
                      out of {TIERS.length}
                    </Text>
                  </TierCount>
                  <Text variant="t100" as="p" color="colorText">
                    {TIERS[currentTier].rules}
                  </Text>
                </div>
                {tiersTooltip ? <Information text={tiersTooltip} /> : null}
              </TierDescription>
            </TierWrapper>
          )}
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

export default YppDashboard
