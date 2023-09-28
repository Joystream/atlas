import { FC } from 'react'

import { SvgActionClose, SvgActionNewChannel, SvgActionNewTab } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button, TextButton } from '@/components/_buttons/Button'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { ServiceStatusWidget } from '@/components/_ypp/ServiceStatusWidget/ServiceStatusWidget'
import { YppDashboardTier } from '@/components/_ypp/YppDashboardTier'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useYppAuthorizeHandler } from '@/hooks/useYppAuthorizeHandler'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user/user.hooks'
import { formatDate, getNextFriday } from '@/utils/time'
import { YppAuthorizationModal } from '@/views/global/YppLandingView/YppAuthorizationModal'
import { configYppIconMapper } from '@/views/global/YppLandingView/YppFooter'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'
import { getTierRewards } from '@/views/studio/YppDashboard/YppDashboard.config'

import { StatusDot, StyledCloseButton, YppSyncStatus } from './YppDashboardTabs.styles'

const SIGNUP_MESSAGE = 'YPP_SIGNUP_MESSAGE-'

const getMessageIdForChannel = (channelId: string) => {
  return SIGNUP_MESSAGE + channelId
}

export const YppDashboardMainTab: FC = () => {
  const { channelId } = useUser()

  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const lgMatch = useMediaMatch('lg')
  const handleYppSignUpClick = useYppAuthorizeHandler()
  const hasDismissedSignupMessage = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === getMessageIdForChannel(channelId as string))
  )
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  const { unsyncedChannels } = useGetYppSyncedChannels()
  // const { trackReferralLinkGenerated } = useSegmentAnalytics()
  const nextPayoutDate = getNextFriday()
  const currentChannel = { yppStatus: 'Verified::Diamond' }
  console.log(hasDismissedSignupMessage)
  return (
    <>
      <YppAuthorizationModal unSyncedChannels={unsyncedChannels} />

      {/*<StyledBanner*/}
      {/*  icon={<StyledSvgAlertsInformative24 />}*/}
      {/*  title="Have more than one YouTube channel?"*/}
      {/*  description={`You can apply to the YouTube Partner Program with as many YouTube & ${APP_NAME} channels as you want. Each YouTube channel can be assigned to only one ${APP_NAME} channel. \nYou can create a new channel from the top right menu.`}*/}
      {/*/>*/}
      {/*{currentChannel?.yppStatus === 'Suspended' && (*/}
      {/*  <StyledBanner*/}
      {/*    title="This channel has been suspended in the YouTube Partner Program"*/}
      {/*    icon={<SvgAlertsError24 />}*/}
      {/*    description={*/}
      {/*      <Text variant="t200" as="span" color="colorCoreNeutral200">*/}
      {/*        You will not be rewarded while this channel is suspended. Your channel did not pass the verification due*/}
      {/*        to{' '}*/}
      {/*        <Button variant="primary" _textOnly to={atlasConfig.features.ypp.suspensionReasonsLink ?? ''}>*/}
      {/*          one of these reasons*/}
      {/*        </Button>*/}
      {/*        .*/}
      {/*      </Text>*/}
      {/*    }*/}
      {/*  />*/}
      {/*)}*/}
      {/*{currentChannel?.yppStatus === 'Unverified' && (*/}
      {/*  <StyledBanner*/}
      {/*    title="Channel Verification Pending"*/}
      {/*    icon={<SvgAlertsInformative24 />}*/}
      {/*    description={*/}
      {/*      <Text variant="t200" as="span" color="colorCoreNeutral200">*/}
      {/*        Your channel needs to get verified before content syncing starts. It normally takes 12-48 hours for*/}
      {/*        channels to get verified.*/}
      {/*        <br />*/}
      {/*        Once verified, you will qualify for the rewards. Payouts are made on a weekly basis, every Friday, for the*/}
      {/*        previous calendar week. Your first payment will involve the reward for the sign up of{' '}*/}
      {/*        <NumberFormat*/}
      {/*          value={(atlasConfig.features.ypp.enrollmentUsdReward ?? 0) * multiplier}*/}
      {/*          format="dollar"*/}
      {/*          as="span"*/}
      {/*          withTooltip={false}*/}
      {/*        />{' '}*/}
      {/*        USD paid out in ${atlasConfig.joystream.tokenTicker} tokens based on the market rate.*/}
      {/*      </Text>*/}
      {/*    }*/}
      {/*  />*/}
      {/*)}*/}
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
                ? currentChannel.yppStatus.startsWith('Suspended')
                  ? undefined
                  : 5
                : getTierRewards(currentChannel.yppStatus.split('::')[1].toLowerCase())?.[1]
            }
            isRangeAmount={!currentChannel || !currentChannel.yppStatus.startsWith('Verified')}
            amountTooltip="Your YouTube channel is being automatically synced with your Gleev channel. You will be rewarded every time a new video gets synced."
            actionNode={
              !currentChannel.yppStatus.startsWith('Suspended') ? (
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
            dollarAmount={getTierRewards('diamond')?.[2]}
            isRangeAmount
            actionNode={<Button fullWidth={!smMatch}>Copy referral link</Button>}
          />
        </GridItem>
      </LayoutGrid>
    </>
  )
}
