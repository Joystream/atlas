import { FC } from 'react'

import { SvgActionNewTab, SvgAlertsError24, SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button } from '@/components/_buttons/Button'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { atlasConfig } from '@/config'
import { useClipboard } from '@/hooks/useClipboard'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useUser } from '@/providers/user/user.hooks'
import { configYppIconMapper } from '@/views/global/YppLandingView/YppFooter'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'

import { RewardsWrapper, StyledBanner, StyledSvgAlertsInformative24, WidgetsWrapper } from './YppDashboardTabs.styles'

import { REWARDS } from '../YppDashboard.config'

const APP_NAME = atlasConfig.general.appName
const tiers = atlasConfig.features.ypp.tiersDefinition?.tiers

type YppDashboardMainTabProps = {
  currentTier?: number
}

export const YppDashboardMainTab: FC<YppDashboardMainTabProps> = ({ currentTier = 0 }) => {
  const { copyToClipboard } = useClipboard()
  const { channelId } = useUser()
  const { currentChannel } = useGetYppSyncedChannels()
  const { trackReferralLinkGenerated } = useSegmentAnalytics()
  const multiplier = tiers ? tiers[currentTier].multiplier : 1

  return (
    <>
      {currentChannel?.yppStatus === 'Suspended' && (
        <StyledBanner
          title="This channel has been suspended in the YouTube Partner Program"
          icon={<SvgAlertsError24 />}
          description={
            <Text variant="t200" as="span" color="colorCoreNeutral200">
              You will not be rewarded while this channel is suspended. Your channel did not pass the verification due
              to{' '}
              <Button variant="primary" _textOnly to={atlasConfig.features.ypp.suspensionReasonsLink ?? ''}>
                one of these reasons
              </Button>
              . If you have questions, we are happy to help in our{' '}
              <Button variant="primary" _textOnly to={atlasConfig.features.ypp.suspendedSupportLink ?? ''}>
                {atlasConfig.features.ypp.suspendedLinkText ?? 'Discord support channel'}{' '}
              </Button>
              .
            </Text>
          }
        />
      )}
      {currentChannel?.yppStatus === 'Unverified' && (
        <StyledBanner
          title="Channel Verification Pending"
          icon={<SvgAlertsInformative24 />}
          description={
            <Text variant="t200" as="span" color="colorCoreNeutral200">
              Your channel needs to get verified before content syncing starts. It normally takes 12-48 hours for
              channels to get verified.
              <br />
              Once verified, you will qualify for the rewards. Payouts are made on a weekly basis, every Friday, for the
              previous calendar week. Your first payment will involve the reward for the sign up of{' '}
              <NumberFormat
                value={(atlasConfig.features.ypp.enrollmentUsdReward ?? 0) * multiplier}
                format="dollar"
                as="span"
                withTooltip={false}
              />{' '}
              USD paid out in ${atlasConfig.joystream.tokenTicker} tokens based on the market rate.
            </Text>
          }
        />
      )}
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
        {REWARDS?.map((reward) => {
          const customMultiplier = reward.customMultiplier
          const rewardAmount = reward.joyAmount
            ? typeof reward.joyAmount === 'number'
              ? {
                  type: 'number' as const,
                  amount: reward.joyAmount * (customMultiplier ? customMultiplier[currentTier] : multiplier),
                }
              : { type: 'range' as const, min: reward.joyAmount.min, max: reward.joyAmount.max }
            : null
          const rewardAmountUsd = reward.usdAmount
            ? typeof reward.usdAmount === 'number'
              ? {
                  type: 'number' as const,
                  amount: reward.usdAmount * (customMultiplier ? customMultiplier[currentTier] : multiplier),
                }
              : { type: 'range' as const, min: reward.usdAmount.min, max: reward.usdAmount.max }
            : null
          return (
            <BenefitCard
              key={reward.title}
              title={reward.title}
              description={reward.description}
              steps={reward.steps}
              actionButton={
                reward.actionButton !== undefined
                  ? {
                      ...reward.actionButton,
                      onClick: () => {
                        if (
                          reward.actionButton &&
                          'copyReferral' in reward.actionButton &&
                          reward.actionButton.copyReferral
                        ) {
                          trackReferralLinkGenerated(channelId)
                          copyToClipboard(
                            `${window.location.host}/ypp?referrerId=${channelId}`,
                            'Referral link copied to clipboard'
                          )
                        }
                      },
                    }
                  : undefined
              }
              joyAmount={rewardAmount}
              dollarAmount={rewardAmountUsd}
            />
          )
        })}
      </RewardsWrapper>
      <Banner
        icon={<StyledSvgAlertsInformative24 />}
        title="Have more than one YouTube channel?"
        description={`You can apply to the YouTube Partner Program with as many YouTube & ${APP_NAME} channels as you want. Each YouTube channel can be assigned to only one ${APP_NAME} channel. \nYou can create a new channel from the top right menu.`}
      />
    </>
  )
}
