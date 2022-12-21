import { FC, useMemo, useState } from 'react'

import { SvgActionNewTab, SvgAlertsError24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { Information } from '@/components/Information'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { Select, SelectItem } from '@/components/_inputs/Select'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { atlasConfig } from '@/config'
import { displayCategories } from '@/config/categories'
import { useClipboard } from '@/hooks/useClipboard'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'
import { configYppIconMapper } from '@/views/global/YppLandingView/YppFooter'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/YppLandingView.hooks'

import { REWARDS, TIERS } from './YppDashboard.config'
import {
  Divider,
  Header,
  RewardsWrapper,
  SettingsInputsWrapper,
  StyledSvgActionArrowRight,
  StyledSvgAlertsInformative24,
  StyledTab,
  TierCount,
  TierDescription,
  TierWrapper,
  WidgetsWrapper,
} from './YppDashboard.styles'

const categoriesSelectItems: SelectItem[] =
  displayCategories?.map((c) => ({
    name: c.name || 'Unknown category',
    value: c.defaultVideoCategory,
  })) || []

const TABS = ['Dashboard', 'Settings'] as const

export const YppDashboard: FC = () => {
  const headTags = useHeadTags('YouTube Partner Program')
  const mdMatch = useMediaMatch('md')
  const { channelId } = useUser()
  const [currentVideosTab, setCurrentVideosTab] = useState(0)
  const { copyToClipboard } = useClipboard()
  const [category, setCategory] = useState<string | null | undefined>('')
  const [isSync, setIsSync] = useState<boolean>(true)

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
        return (
          <>
            {atlasConfig.features.ypp.widgets && (
              <WidgetsWrapper>
                {atlasConfig.features.ypp.widgets.map((widget) => (
                  <WidgetTile
                    icon={widget.icon && configYppIconMapper[widget.icon]}
                    key={widget.title}
                    title={widget.label ?? widget.title}
                    text={widget.title}
                    button={{
                      text: widget.linkText ?? `Go to ${widget.title}`,
                      variant: 'primary',
                      _textOnly: true,
                      icon: <SvgActionNewTab />,
                      to: widget.link,
                      iconPlacement: 'right',
                    }}
                  />
                ))}
              </WidgetsWrapper>
            )}
            <RewardsWrapper>
              {REWARDS?.map((reward) => (
                <BenefitCard
                  key={reward.title}
                  title={reward.title}
                  description={reward.description}
                  steps={reward.steps}
                  actionButton={{
                    ...reward.actionButton,
                    onClick: () => {
                      if ('copyReferral' in reward.actionButton && reward.actionButton.copyReferral === true) {
                        copyToClipboard(
                          `${window.location.host}/ypp?referrerId=${channelId}`,
                          'Referral link copied to clipboard'
                        )
                      }
                    },
                  }}
                  joyAmount={reward.joyAmount}
                />
              ))}
            </RewardsWrapper>
            <Banner
              icon={<StyledSvgAlertsInformative24 />}
              title="Have more than one YouTube channel?"
              description={
                'You can apply to the YouTube Partner Program with as many YouTube & Atlas channels as you want. Each YouTube channel can be assigned to only one Atlas channel. \nYou can create a new channel from the top right menu.'
              }
            />
          </>
        )
      case 'Settings':
        return (
          <SettingsInputsWrapper>
            <FormField
              label="YouTube Sync"
              description={
                <>
                  {`With YouTube Sync enabled, ${atlasConfig.general.appName} will import videos from your YouTube channel over to Joystream.`}
                  <Button _textOnly iconPlacement="right" icon={<StyledSvgActionArrowRight />}>
                    Learn more
                  </Button>
                </>
              }
            >
              <OptionCardGroupRadio
                options={[
                  { value: true, label: 'Sync YouTube videos', caption: 'Imports past and future videos' },
                  { value: false, label: "Don't sync YouTube videos", caption: 'Pauses importing of future videos' },
                ]}
                selectedValue={isSync}
                onChange={setIsSync as any}
                direction={!mdMatch ? 'vertical' : 'horizontal'}
              />
            </FormField>
            <FormField
              label="Category of imported videos"
              description="Choose a category to be assigned to the imported videos by default. You can change it for each video later once it’s imported."
            >
              <Select items={categoriesSelectItems} onChange={setCategory} value={category} />
            </FormField>

            <Divider />

            <FormField
              label="Danger zone"
              description="By leaving the program you will no longer receive rewards for performing the tasks, and your future YouTube videos will not be imported automatically to Joystream. You will be able to connect your YouTube channel with another Joystream channel."
            >
              <Button variant="destructive-secondary" fullWidth size="large">
                Leave the program
              </Button>
            </FormField>
          </SettingsInputsWrapper>
        )
    }
  }, [category, channelId, copyToClipboard, currentVideosTab, isSync, mdMatch])

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
        <StyledTab initialIndex={0} tabs={mappedTabs} onSelectTab={setCurrentVideosTab} />
        {content}
      </LimitedWidthContainer>
    </>
  )
}
