import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { SvgActionClose, SvgActionNewChannel, SvgActionNewTab } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { WidgetTile } from '@/components/WidgetTile'
import { Button, TextButton } from '@/components/_buttons/Button'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { ServiceStatusWidget } from '@/components/_ypp/ServiceStatusWidget/ServiceStatusWidget'
import { YppDashboardTier } from '@/components/_ypp/YppDashboardTier'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useYppAuthorizeHandler } from '@/hooks/useYppAuthorizeHandler'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user/user.hooks'
import { formatDate, getNextFriday } from '@/utils/time'
import { YppAuthorizationModal } from '@/views/global/YppLandingView/YppAuthorizationModal'
import { configYppIconMapper } from '@/views/global/YppLandingView/YppFooter'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'
import { getTierRewards } from '@/views/studio/YppDashboard/YppDashboard.config'

import {
  StatusDot,
  StatusDotWrapper,
  StyledCloseButton,
  StyledCopyButton,
  YppSyncStatus,
} from './YppDashboardTabs.styles'

const SIGNUP_MESSAGE = 'YPP_SIGNUP_MESSAGE-'

const getMessageIdForChannel = (channelId: string) => {
  return SIGNUP_MESSAGE + channelId
}

export const YppDashboardMainTab: FC = () => {
  const { trackReferralLinkGenerated } = useSegmentAnalytics()
  const { channelId } = useUser()
  const navigate = useNavigate()
  const _handleYppSignUpClick = useYppAuthorizeHandler()
  const hasDismissedSignupMessage = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === getMessageIdForChannel(channelId as string))
  )
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  const { unsyncedChannels, currentChannel } = useGetYppSyncedChannels()

  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const lgMatch = useMediaMatch('lg')
  const nextPayoutDate = getNextFriday()
  const handleYppSignUpClick = () => {
    const success = _handleYppSignUpClick()
    if (success) {
      navigate(absoluteRoutes.viewer.ypp())
    }
  }
  return (
    <>
      <YppAuthorizationModal unSyncedChannels={unsyncedChannels} />
      <LayoutGrid>
        <GridItem colSpan={{ xxs: 12, md: 4 }}>
          <YppDashboardTier onSignUp={handleYppSignUpClick} status={currentChannel?.yppStatus} />
        </GridItem>

        <GridItem colSpan={{ xxs: 12, md: 8 }}>
          <ServiceStatusWidget status={currentChannel?.yppStatus} />
        </GridItem>
        <GridItem colSpan={{ xxs: 12, sm: 4 }}>
          <WidgetTile
            title="Next payments round"
            tooltip={{
              text: 'All of the payments are processed every Friday. The hour of payouts may vary.',
              placement: 'top-start',
            }}
            customNode={
              <FlexBox flow="column" gap={4} marginTop={2}>
                <Text variant={mdMatch ? 'h500' : 'h400'} as="p">
                  {formatDate(nextPayoutDate)}
                </Text>
                <TextButton
                  to="https://www.notion.so/joystream/YouTube-Creator-Payouts-02f7cf50972145bfb64c8543914ae4bb?pvs=4"
                  icon={<SvgActionNewTab />}
                  iconPlacement="right"
                >
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
        {!hasDismissedSignupMessage && (
          <GridItem colSpan={{ xxs: 12 }}>
            <BenefitCard
              title={
                currentChannel?.yppStatus.startsWith('Verified')
                  ? 'Thank you for signing up!'
                  : `Sign up to ${atlasConfig.general.appName}`
              }
              description={
                currentChannel?.yppStatus.startsWith('Verified')
                  ? `You will receive sign up bonus on (Friday) ${formatDate(nextPayoutDate)}`
                  : 'Connect you YouTube channels via a step-by-step flow and get your first reward. You can sign up with multiple channels!'
              }
              dollarAmount={
                !currentChannel || !currentChannel.yppStatus.startsWith('Verified')
                  ? 100
                  : getTierRewards(currentChannel.yppStatus.split('::')[1].toLowerCase())?.[0]
              }
              isRangeAmount={!currentChannel || !currentChannel.yppStatus.startsWith('Verified')}
              amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity"
              actionNode={
                !currentChannel || !currentChannel.yppStatus.startsWith('Verified') ? (
                  <Button
                    icon={<SvgActionNewChannel />}
                    disabled={!!currentChannel}
                    iconPlacement="right"
                    fullWidth={!smMatch}
                    onClick={handleYppSignUpClick}
                  >
                    Sign up
                  </Button>
                ) : (
                  <StyledCloseButton
                    variant="secondary"
                    fullWidth={!smMatch}
                    onClick={() => updateDismissedMessages(getMessageIdForChannel(channelId as string))}
                    icon={smMatch && <SvgActionClose />}
                  >
                    {!smMatch ? 'Close' : ''}
                  </StyledCloseButton>
                )
              }
            />
          </GridItem>
        )}
        <GridItem colSpan={{ xxs: 12 }}>
          <BenefitCard
            title="Sync videos from YouTube channel"
            description="Get paid for every new video published on YouTube after the date of sign up. Minimum video duration has to be 5 minutes. Max videos rewarded are 3 per week."
            dollarAmount={
              !currentChannel || !currentChannel.yppStatus.startsWith('Verified')
                ? currentChannel?.yppStatus.startsWith('Suspended')
                  ? undefined
                  : 5
                : getTierRewards(currentChannel.yppStatus.split('::')[1].toLowerCase())?.[1]
            }
            isRangeAmount={!currentChannel || !currentChannel.yppStatus.startsWith('Verified')}
            amountTooltip="Your YouTube channel is being automatically synced with your Gleev channel. You will be rewarded every time a new video gets synced."
            actionNode={
              currentChannel?.yppStatus.startsWith('Verified') ? (
                currentChannel?.shouldBeIngested && (
                  <YppSyncStatus>
                    <Tooltip text="Your YouTube channel is being automatically synced with your Gleev channel. You will be rewarded every time a new video gets synced.">
                      <StatusDotWrapper>
                        <StatusDot />
                      </StatusDotWrapper>
                    </Tooltip>
                    <Text variant="t200" as="p">
                      Autosync: {currentChannel.shouldBeIngested ? 'On' : 'Off'}
                    </Text>
                  </YppSyncStatus>
                )
              ) : !currentChannel?.yppStatus.startsWith('Suspended') ? null : (
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
            dollarAmount={getTierRewards('diamond')?.[2]}
            isRangeAmount
            actionNode={
              <StyledCopyButton
                fullWidth={!smMatch}
                textToCopy={`${window.location.host}/ypp?referrerId=${channelId}`}
                copySuccessText="Referral link copied to clipboard"
                onClick={() => trackReferralLinkGenerated(channelId)}
              >
                Copy referral link
              </StyledCopyButton>
            }
          />
        </GridItem>
      </LayoutGrid>
    </>
  )
}
