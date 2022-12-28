import { SvgActionNewTab, SvgAlertsError24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button } from '@/components/_buttons/Button'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { atlasConfig } from '@/config'
import { useClipboard } from '@/hooks/useClipboard'
import { useUser } from '@/providers/user/user.hooks'
import { configYppIconMapper } from '@/views/global/YppLandingView/YppFooter'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/YppLandingView.hooks'

import { RewardsWrapper, StyledBanner, StyledSvgAlertsInformative24, WidgetsWrapper } from './YppDashboardTabs.styles'

import { REWARDS } from '../YppDashboard.config'

const APP_NAME = atlasConfig.general.appName

export const YppDashboardMainTab = () => {
  const { copyToClipboard } = useClipboard()
  const { channelId } = useUser()
  const { currentChannel } = useGetYppSyncedChannels()

  return (
    <>
      {currentChannel?.isSuspended && (
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
        description={`You can apply to the YouTube Partner Program with as many YouTube & ${APP_NAME} channels as you want. Each YouTube channel can be assigned to only one ${APP_NAME} channel. \nYou can create a new channel from the top right menu.`}
      />
    </>
  )
}
