import { FC } from 'react'

import { SvgActionInfo, SvgActionNewTab, SvgActionSpeech, SvgActionTokensStack, SvgAlertsError24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { Information } from '@/components/Information'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button } from '@/components/_buttons/Button'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useClipboard } from '@/hooks/useClipboard'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/YppLandingView.hooks'

import { REWARDS, TIERS } from './YppDashboard.config'
import {
  Header,
  RewardsWrapper,
  StyledBanner,
  StyledSvgAlertsInformative24,
  TierCount,
  TierDescription,
  TierWrapper,
  WidgetsWrapper,
} from './YppDashboard.styles'

export const YppDashboard: FC = () => {
  const headTags = useHeadTags('Youtube Partner Program')
  const mdMatch = useMediaMatch('md')
  const { channelId } = useUser()

  const { copyToClipboard } = useClipboard()

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
        {currentChannel?.isSuspended && (
          <StyledBanner
            title="This channel has been suspended in the YouTube Partner Program"
            icon={<SvgAlertsError24 />}
            description={
              <Text variant="t200" as="p" color="colorCoreNeutral200">
                To learn more about the reason behind the suspension, please reach out on the{' '}
                <Button variant="primary" _textOnly to={atlasConfig.features.ypp.suspendedSupportLink ?? ''}>
                  {atlasConfig.features.ypp.suspendedLinkText ?? 'link destination'}
                </Button>
                . You won't be rewarded for doing tasks during the time this channel is suspended.
              </Text>
            }
          />
        )}

        <WidgetsWrapper>
          <WidgetTile
            title="Notion"
            text="Program details"
            icon={<SvgActionInfo />}
            button={{
              text: 'Go to Notion',
              variant: 'primary',
              _textOnly: true,
              icon: <SvgActionNewTab />,
              // todo add correct url here
              iconPlacement: 'right',
            }}
          />
          <WidgetTile
            title="Airtable"
            text="Payments"
            icon={<SvgActionTokensStack />}
            button={{
              text: 'Go to payments',
              variant: 'primary',
              to: absoluteRoutes.studio.payments(),
              _textOnly: true,
              icon: <SvgActionNewTab />,
              iconPlacement: 'right',
            }}
          />
          <WidgetTile
            title="Discord"
            text="Support"
            icon={<SvgActionSpeech />}
            button={{
              text: 'Go to Discord',
              variant: 'primary',
              _textOnly: true,
              icon: <SvgActionNewTab />,
              iconPlacement: 'right',
              to: atlasConfig.general.joystreamDiscordUrl,
            }}
          />
        </WidgetsWrapper>
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
      </LimitedWidthContainer>
    </>
  )
}
