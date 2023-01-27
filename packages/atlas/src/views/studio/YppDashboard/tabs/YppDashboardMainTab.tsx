import { FC } from 'react'

import { SvgActionNewTab, SvgAlertsError24, SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button } from '@/components/_buttons/Button'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { atlasConfig } from '@/config'
import { useClipboard } from '@/hooks/useClipboard'
import { useUser } from '@/providers/user/user.hooks'
import { formatNumber } from '@/utils/number'
import { configYppIconMapper } from '@/views/global/YppLandingView/YppFooter'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/YppLandingView.hooks'

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
  const multiplier = tiers ? tiers[currentTier].multiplier : 1

  return (
    <>
      {currentChannel?.yppStatus === 'Suspended' && (
        <StyledBanner
          title="This channel has been suspended in the YouTube Partner Program"
          icon={<SvgAlertsError24 />}
          description={
            <Text variant="t200" as="p" color="colorCoreNeutral200">
              To learn more about the reason behind the suspension, please reach out on the{' '}
              <Button variant="primary" _textOnly to={atlasConfig.features.ypp.suspendedSupportLink ?? ''}>
                {atlasConfig.features.ypp.suspendedLinkText ?? 'link destination'}{' '}
              </Button>
              . You won't be rewarded for doing tasks during the time this channel is suspended.{' '}
            </Text>
          }
        />
      )}
      <StyledBanner
        title="When rewards are paid out?"
        icon={<SvgAlertsInformative24 />}
        description={
          <>
            Once your channel is verified, you will qualify for the rewards. Payouts are made on a weekly basis, every
            Friday, for the previous calendar week. Your first payment will involve the reward for the sign up of{' '}
            {formatNumber((atlasConfig.features.ypp.enrollmentReward ?? 0) * multiplier)}{' '}
            {atlasConfig.joystream.tokenTicker}!
          </>
        }
        dismissibleId="ypp-first-reward-information"
      />
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
                        copyToClipboard(
                          `${window.location.host}/ypp?referrerId=${channelId}`,
                          'Referral link copied to clipboard'
                        )
                      }
                    },
                  }
                : undefined
            }
            joyAmount={reward.joyAmount * multiplier}
          />
        ))}
      </RewardsWrapper>
      <Banner
        icon={<StyledSvgAlertsInformative24 />}
        title="Have more than one YouTube channel?"
        description={`You can apply to the YouTube Partner Program with as many YouTube & ${APP_NAME} channels as you want. Each YouTube channel can be assigned to only one ${APP_NAME} channel. \nYou can create a new channel from the top right menu.`}
      />
    </>
  )
}
