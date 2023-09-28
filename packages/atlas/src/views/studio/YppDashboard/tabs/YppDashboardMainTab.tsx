import { FC } from 'react'

import { SvgActionNewTab, SvgAlertsError24, SvgAlertsInformative24 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button, TextButton } from '@/components/_buttons/Button'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { ServiceStatusWidget } from '@/components/_ypp/ServiceStatusWidget/ServiceStatusWidget'
import { YppDashboardTier } from '@/components/_ypp/YppDashboardTier'
import { atlasConfig } from '@/config'
// import { useClipboard } from '@/hooks/useClipboard'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { formatDate, getNextFriday } from '@/utils/time'
// import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
// import { useUser } from '@/providers/user/user.hooks'
import { configYppIconMapper } from '@/views/global/YppLandingView/YppFooter'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'

import { StatusDot, StyledBanner, StyledSvgAlertsInformative24, YppSyncStatus } from './YppDashboardTabs.styles'

const APP_NAME = atlasConfig.general.appName
const tiers = atlasConfig.features.ypp.tiersDefinition?.tiers

type YppDashboardMainTabProps = {
  currentTier?: number
}
const syncOn = true
export const YppDashboardMainTab: FC<YppDashboardMainTabProps> = ({ currentTier = 0 }) => {
  // const { copyToClipboard } = useClipboard()
  // const { channelId } = useUser()
  const mdMatch = useMediaMatch('md')
  const lgMatch = useMediaMatch('lg')
  const { currentChannel } = useGetYppSyncedChannels()
  // const { trackReferralLinkGenerated } = useSegmentAnalytics()
  const multiplier = tiers ? tiers[currentTier].multiplier : 1
  const nextPayoutDate = getNextFriday()
  console.log(currentChannel, 'xd')
  return (
    <>
      <StyledBanner
        icon={<StyledSvgAlertsInformative24 />}
        title="Have more than one YouTube channel?"
        description={`You can apply to the YouTube Partner Program with as many YouTube & ${APP_NAME} channels as you want. Each YouTube channel can be assigned to only one ${APP_NAME} channel. \nYou can create a new channel from the top right menu.`}
      />
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
      <LayoutGrid>
        <GridItem colSpan={{ xxs: 12, md: 4 }}>
          <YppDashboardTier status="Suspended::DuplicateContent" />
        </GridItem>

        <GridItem colSpan={{ xxs: 12, md: 8 }}>
          <ServiceStatusWidget isOptedIn={!!currentChannel} />
        </GridItem>
        <GridItem colSpan={{ xxs: 12, sm: 4 }}>
          <WidgetTile
            title="Next payments round"
            tooltip={{
              text: 'safe',
            }}
            customNode={
              <FlexBox flow="column" gap={4} marginTop={2}>
                <Text variant={mdMatch ? 'h500' : 'h400'} as="p">
                  {formatDate(nextPayoutDate)}
                </Text>
                <TextButton to="" icon={<SvgActionNewTab />} iconPlacement="right">
                  Go to Airtable
                </TextButton>
              </FlexBox>
            }
          />
        </GridItem>
        {atlasConfig.features.ypp.widgets &&
          atlasConfig.features.ypp.widgets.map((widget) => (
            <GridItem colSpan={{ xxs: 12, sm: 4 }} key={widget.title}>
              <WidgetTile
                title={widget.label ?? widget.title}
                customNode={
                  <FlexBox flow="column" gap={4} marginTop={2}>
                    <FlexBox alignItems="center">
                      {widget.icon ? configYppIconMapper[widget.icon] : null}
                      <Text variant={mdMatch ? 'h500' : 'h400'} as="p">
                        {widget.title}
                      </Text>
                    </FlexBox>
                    <TextButton to={widget.link} icon={<SvgActionNewTab />} iconPlacement="right">
                      {widget.linkText ?? `Go to ${widget.title}`}
                    </TextButton>
                  </FlexBox>
                }
              />
            </GridItem>
          ))}
        <GridItem colSpan={{ xxs: 12 }}>
          <BenefitCard
            title="Thank you for signing up!"
            description={`You will receive sign up bonus on (Friday) ${formatDate(nextPayoutDate)}`}
            dollarAmount={100}
          />
        </GridItem>
        <GridItem colSpan={{ xxs: 12 }}>
          <BenefitCard
            title="Sync videos from YouTube channel"
            description="Get paid for every new video published on YouTube after the date of sign up. Minimum video duration has to be 5 minutes. Max videos rewarded are 3 per week."
            dollarAmount={syncOn ? 5 : undefined}
            actionNode={
              syncOn ? (
                <YppSyncStatus>
                  <StatusDot />
                  <Text variant="t200" as="p">
                    Autosync: On
                  </Text>
                </YppSyncStatus>
              ) : (
                <FlexBox justifyContent={lgMatch ? 'end' : 'unset'} alignItems="center">
                  <Text variant="h400" as="h4">
                    Suspended
                  </Text>
                  <Information text="asdfhkjhaskdfj" />
                </FlexBox>
              )
            }
          />
        </GridItem>
        <GridItem colSpan={{ xxs: 12 }}>
          <BenefitCard
            title="Refer another YouTube creator"
            description="Get rewarded for every new creator who signs up to YPP program using your referral link. Referrals rewards depends on the tier assigned to the invited channel."
            dollarAmount={100}
            actionNode={<Button>Copy referral link</Button>}
          />
        </GridItem>
      </LayoutGrid>
    </>
  )
}
