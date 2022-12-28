import { SvgActionNewTab } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { WidgetTile } from '@/components/WidgetTile'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { atlasConfig } from '@/config'
import { useClipboard } from '@/hooks/useClipboard'
import { useUser } from '@/providers/user/user.hooks'
import { configYppIconMapper } from '@/views/global/YppLandingView/YppFooter'

import { RewardsWrapper, StyledSvgAlertsInformative24, WidgetsWrapper } from './YppDashboardTabs.styles'

import { REWARDS } from '../YppDashboard.config'

const APP_NAME = atlasConfig.general.appName

export const YppDashboardMainTab = () => {
  const { copyToClipboard } = useClipboard()
  const { channelId } = useUser()

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
        description={`You can apply to the YouTube Partner Program with as many YouTube & ${APP_NAME} channels as you want. Each YouTube channel can be assigned to only one ${APP_NAME} channel. \nYou can create a new channel from the top right menu.`}
      />
    </>
  )
}
