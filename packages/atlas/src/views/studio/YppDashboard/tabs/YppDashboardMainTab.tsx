import styled from '@emotion/styled'
import { FC, ReactNode, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  SvgActionChevronB,
  SvgActionClose,
  SvgActionNewChannel,
  SvgActionNewTab,
  SvgAlertsInformative24,
} from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FlexBox } from '@/components/FlexBox'
import { Information } from '@/components/Information'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { WidgetTile } from '@/components/WidgetTile'
import { Button, TextButton } from '@/components/_buttons/Button'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { ReferralLinkButton } from '@/components/_ypp/ReferralLinkButton'
import { ServiceStatusWidget } from '@/components/_ypp/ServiceStatusWidget/ServiceStatusWidget'
import { YppDashboardTier } from '@/components/_ypp/YppDashboardTier'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useYppAuthorizeHandler } from '@/hooks/useYppAuthorizeHandler'
import { usePersonalDataStore } from '@/providers/personalData'
import { useUser } from '@/providers/user/user.hooks'
import { cVar, sizes, transitions } from '@/styles'
import { formatDate, getNextWeekday } from '@/utils/time'
import { BOOST_TIMESTAMP, getTierRewards, yppBackendTierToConfig } from '@/utils/ypp'
import { YppAuthorizationModal } from '@/views/global/YppLandingView/YppAuthorizationModal'
import { configYppIconMapper } from '@/views/global/YppLandingView/sections/YppFooter'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'

import {
  StatusDot,
  StatusDotWrapper,
  StyledCloseButton,
  WidgetTileContent,
  YppSyncStatus,
} from './YppDashboardTabs.styles'

const SIGNUP_MESSAGE = 'YPP_SIGNUP_MESSAGE-'

const getMessageIdForChannel = (channelId: string) => {
  return SIGNUP_MESSAGE + channelId
}

export const YppDashboardMainTab: FC = () => {
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
  const nextPayoutDate = getNextWeekday(new Date(), 2)
  const rewardMultiplier =
    yppBackendTierToConfig(currentChannel?.yppStatus) !== 'bronze' &&
    new Date(currentChannel?.createdAt || 0).getTime() > BOOST_TIMESTAMP
      ? atlasConfig.features.ypp.tierBoostMultiplier || 1
      : 1
  const handleYppSignUpClick = () => {
    const success = _handleYppSignUpClick()
    if (success) {
      navigate(absoluteRoutes.viewer.ypp())
    }
  }

  const syncStatusContent = (
    <YppSyncStatus>
      <Tooltip
        text={
          currentChannel?.shouldBeIngested
            ? `Your YouTube channel is being automatically synced with your ${atlasConfig.general.appName} channel. You will be rewarded every time a new video gets synced.`
            : `Automatic YouTube channel sync with ${atlasConfig.general.appName} is disabled. You can enable it again anytime in YPP settings tab.`
        }
        placement="top-start"
      >
        <StatusDotWrapper>
          <StatusDot isOn={currentChannel?.shouldBeIngested ?? false} />
        </StatusDotWrapper>
      </Tooltip>
      <Text variant="t200" as="p">
        Autosync: {currentChannel?.shouldBeIngested ? 'On' : 'Off'}
      </Text>
    </YppSyncStatus>
  )

  return (
    <>
      <YppAuthorizationModal unSyncedChannels={unsyncedChannels} />
      <LayoutGrid>
        <GridItem colSpan={{ base: 12 }}>
          <Banner
            dismissibleId="ypp-sync-second-channel"
            title="Have another YouTube channel?"
            icon={<SvgAlertsInformative24 />}
            description={`You can apply to the YouTube Partner Program with as many YouTube & ${atlasConfig.general.appName} channels as you want. Each YouTube channel can be assigned to only one ${atlasConfig.general.appName} channel.`}
            actionButton={{ text: 'Add new channel', onClick: handleYppSignUpClick }}
          />
        </GridItem>
        <GridItem colSpan={{ xxs: 12, md: 4 }}>
          <YppDashboardTier onSignUp={handleYppSignUpClick} status={currentChannel?.yppStatus} />
        </GridItem>

        <GridItem colSpan={{ xxs: 12, md: 8 }}>
          <ServiceStatusWidget status={currentChannel?.yppStatus} syncStatus={currentChannel?.syncStatus} />
        </GridItem>
        <GridItem colSpan={{ xxs: 12, sm: 4 }}>
          <WidgetTile
            title="Next payments round"
            tooltip={{
              text: 'All of the payments are processed every Tuesday. The hour of payouts may vary.',
              placement: 'top-start',
            }}
            customNode={
              <WidgetTileContent marginTop={2}>
                <Text variant={mdMatch ? 'h500' : 'h400'} as="p">
                  {formatDate(nextPayoutDate)}
                </Text>
                <TextButton
                  to="https://www.notion.so/joystream/YouTube-Creator-Payouts-02f7cf50972145bfb64c8543914ae4bb?pvs=4"
                  icon={<SvgActionNewTab />}
                  iconPlacement="right"
                >
                  View payments
                </TextButton>
              </WidgetTileContent>
            }
          />
        </GridItem>
        {atlasConfig.features.ypp.widgets &&
          atlasConfig.features.ypp.widgets
            .filter((widget) => widget.title !== 'Payments')
            .map((widget) => (
              <GridItem colSpan={{ xxs: 12, sm: 4 }} key={widget.title}>
                <WidgetTile
                  title={widget.label ?? widget.title}
                  customNode={
                    <WidgetTileContent marginTop={2}>
                      <FlexBox alignItems="center">
                        {widget.icon ? configYppIconMapper[widget.icon] : null}
                        <Text variant={mdMatch ? 'h500' : 'h400'} as="p">
                          {widget.title}
                        </Text>
                      </FlexBox>
                      <TextButton to={widget.link} icon={<SvgActionNewTab />} iconPlacement="right">
                        {widget.linkText ?? `Go to ${widget.title}`}
                      </TextButton>
                    </WidgetTileContent>
                  }
                />
              </GridItem>
            ))}
        {/*{!hasDismissedSignupMessage && !currentChannel?.yppStatus.startsWith('Suspended') && (*/}
        {/*  <GridItem colSpan={{ xxs: 12 }}>*/}
        {/*    <BenefitCard*/}
        {/*      title={*/}
        {/*        currentChannel?.yppStatus.startsWith('Verified')*/}
        {/*          ? 'Thank you for signing up!'*/}
        {/*          : `Sign up to ${atlasConfig.general.appName}`*/}
        {/*      }*/}
        {/*      description={*/}
        {/*        currentChannel?.yppStatus.startsWith('Verified')*/}
        {/*          ? `You will receive sign up bonus on (Tuesday) ${formatDate(nextPayoutDate)}`*/}
        {/*          : 'Connect you YouTube channels via a step-by-step flow and get your first reward. You can sign up with multiple channels!'*/}
        {/*      }*/}
        {/*      dollarAmount={*/}
        {/*        !currentChannel || !currentChannel.yppStatus.startsWith('Verified')*/}
        {/*          ? 100*/}
        {/*          : (getTierRewards(yppBackendTierToConfig(currentChannel.yppStatus))?.signUp || 0) * rewardMultiplier*/}
        {/*      }*/}
        {/*      isRangeAmount={!currentChannel || !currentChannel.yppStatus.startsWith('Verified')}*/}
        {/*      amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."*/}
        {/*      actionNode={*/}
        {/*        !currentChannel || !currentChannel.yppStatus.startsWith('Verified') ? (*/}
        {/*          <Button*/}
        {/*            icon={<SvgActionNewChannel />}*/}
        {/*            disabled={!!currentChannel}*/}
        {/*            iconPlacement="right"*/}
        {/*            fullWidth={!smMatch}*/}
        {/*            onClick={handleYppSignUpClick}*/}
        {/*          >*/}
        {/*            Sign up*/}
        {/*          </Button>*/}
        {/*        ) : (*/}
        {/*          <StyledCloseButton*/}
        {/*            variant="secondary"*/}
        {/*            fullWidth={!smMatch}*/}
        {/*            onClick={() => updateDismissedMessages(getMessageIdForChannel(channelId as string))}*/}
        {/*            icon={smMatch && <SvgActionClose />}*/}
        {/*          >*/}
        {/*            {!smMatch ? 'Close' : ''}*/}
        {/*          </StyledCloseButton>*/}
        {/*        )*/}
        {/*      }*/}
        {/*    />*/}
        {/*  </GridItem>*/}
        {/*)}*/}
        {/*<GridItem colSpan={{ xxs: 12 }}>*/}
        {/*  */}
        {/*</GridItem>*/}
        {/*<GridItem colSpan={{ xxs: 12 }}>*/}
        {/*  <BenefitCard*/}
        {/*    title="Refer another YouTube creator"*/}
        {/*    description="Get rewarded for every new creator who signs up to YPP program using your referral link. Referrals rewards depends on the tier assigned to the invited channel."*/}
        {/*    dollarAmount={(getTierRewards('diamond')?.referral || 0) * rewardMultiplier}*/}
        {/*    amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."*/}
        {/*    isRangeAmount*/}
        {/*    actionNode={<ReferralLinkButton />}*/}
        {/*  />*/}
        {/*</GridItem>*/}
        <BenefitsContainer title="Youtubers">
          {!hasDismissedSignupMessage && !currentChannel?.yppStatus.startsWith('Suspended') && (
            <BenefitCard
              title={
                currentChannel?.yppStatus.startsWith('Verified')
                  ? 'Thank you for signing up!'
                  : `Sign up to ${atlasConfig.general.appName}`
              }
              description={
                currentChannel?.yppStatus.startsWith('Verified')
                  ? `You will receive sign up bonus on (Tuesday) ${formatDate(nextPayoutDate)}`
                  : 'Connect you YouTube channels via a step-by-step flow and get your first reward. You can sign up with multiple channels!'
              }
              rewardNode={
                !currentChannel || !currentChannel.yppStatus.startsWith('Verified')
                  ? `Up to +100 USD`
                  : `${
                      (getTierRewards(yppBackendTierToConfig(currentChannel.yppStatus))?.signUp || 0) * rewardMultiplier
                    } USD`
              }
              amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."
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
          )}
          <BenefitCard
            title="Sync videos from YouTube channel"
            description="Get paid for every new video published on YouTube after the date of sign up. Minimum video duration has to be 5 minutes. Max videos rewarded are 3 per week."
            rewardNode={
              !currentChannel || !currentChannel.yppStatus.startsWith('Verified')
                ? currentChannel?.yppStatus.startsWith('Suspended')
                  ? undefined
                  : 'Up to +5 USD'
                : `+${getTierRewards(yppBackendTierToConfig(currentChannel.yppStatus))?.videoSync} USD`
            }
            amountTooltip={
              !currentChannel?.yppStatus.startsWith('Verified')
                ? 'Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity.'
                : `Your YouTube channel is being automatically synced with your ${atlasConfig.general.appName} channel. You will be rewarded every time a new video gets synced.`
            }
            actionNode={
              currentChannel?.yppStatus.startsWith('Verified') ? (
                syncStatusContent
              ) : !currentChannel?.yppStatus.startsWith('Suspended') ? null : (
                <FlexBox
                  gap={lgMatch ? 14 : smMatch ? 8 : 4}
                  flow={smMatch ? 'row' : 'column'}
                  alignItems={smMatch ? 'center' : 'start'}
                >
                  <FlexBox
                    width={lgMatch ? undefined : 'auto'}
                    justifyContent={lgMatch ? 'end' : 'unset'}
                    alignItems="center"
                  >
                    <Text variant="h400" as="h4">
                      Suspended
                    </Text>
                    <Information
                      text="Suspended channels are not eligible for receiving any reward from YouTube Partner Program."
                      placement="top-start"
                    />
                  </FlexBox>
                  {syncStatusContent}
                </FlexBox>
              )
            }
          />
          <BenefitCard
            title="Refer another YouTube creator"
            description="Get rewarded for every new creator who signs up to YPP program using your referral link. Referrals rewards depends on the tier assigned to the invited channel."
            rewardNode={`Up to +${(getTierRewards('diamond')?.referral || 0) * rewardMultiplier} USD`}
            amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."
            actionNode={<ReferralLinkButton />}
          />
        </BenefitsContainer>

        <BenefitsContainer title="Community Builders">
          <BenefitCard
            title="Discord Community"
            description="Connect with other creators on Discord and participate in building the platform with us. Each week 10 new active participants selected by community are rewarded with 20 USD."
            rewardNode="10 USD"
            // amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."
            actionNode={<ReferralLinkButton />}
          />
          <BenefitCard
            title="Post on X"
            description="Tweet about why you signed up to Gleev and follow JoystreamDAO on X. Each week 10 new random channels get paid and featured in our New Joiners post."
            rewardNode="10 USD"
            // amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."
            actionNode={<ReferralLinkButton />}
          />
          <BenefitCard
            title="Roundtable events"
            description="Participate in Creator Roundtable events held on Discord to exchange perspectives on current Gleev opportunities and features in the pipeline. Best 4 questions are rewarded."
            rewardNode="10 USD"
            // amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."
            actionNode={<ReferralLinkButton />}
          />
        </BenefitsContainer>

        <BenefitsContainer title="Original Creators">
          <BenefitCard
            title="Gleev Original Content"
            description="Earn more by publishing content to Gleev at least 24 hours ahead of YouTube. Make sure to add hashtag #JostreamOriginal and link to the original video on Gleev to get the reward."
            rewardNode="x5 per video"
            // amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."
            actionNode={<ReferralLinkButton />}
          />
          <BenefitCard
            title="Gleev Branding"
            description="Add Joystream branding to your video and multiply your rewards for original uploads to Gleev."
            rewardNode="x5 per video"
            // amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."
            actionNode={<ReferralLinkButton />}
          />
        </BenefitsContainer>

        <BenefitsContainer title="Social Promoters">
          <BenefitCard
            title="Share NFT"
            description="Drop the link of your post to shared NFTs channel on Discord to participate in rewards."
            rewardNode="10 USD"
            // amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."
            actionNode={<ReferralLinkButton />}
          />
          <BenefitCard
            title="Share Token"
            description="Drop the link of your post to Shared Tokens channel on Discord to participate in rewards."
            rewardNode="10 USD"
            // amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."
            actionNode={<ReferralLinkButton />}
          />
          <BenefitCard
            title="Ambassador Program"
            description="Become Joystream ambassador and work with our marketing and product team on growing the platform."
            rewardNode="Up to 1k USD pm"
            // amountTooltip="Ranks are assigned at discretion of Joystream team based on such factors as content quality and channel popularity."
            actionNode={<ReferralLinkButton />}
          />
        </BenefitsContainer>
      </LayoutGrid>
    </>
  )
}

export const BenefitsContainer = ({ children, title }: { children: ReactNode[] | ReactNode; title: string }) => {
  const drawer = useRef<HTMLDivElement>(null)
  const [isDrawerActive, setDrawerActive] = useState(true)

  return (
    <StyledGridItem colSpan={{ xxs: 12 }}>
      <FlexBox alignItems="start" justifyContent="space-between" width="100%">
        <Text variant="h500" as="h3">
          {title}
        </Text>
        <Button onClick={() => setDrawerActive((prev) => !prev)} rounded variant="tertiary">
          <SvgActionChevronB />
        </Button>
      </FlexBox>
      <BenefitsDrawer
        isActive={isDrawerActive}
        ref={drawer}
        maxHeight={drawer?.current?.scrollHeight}
        gap={4}
        flow="column"
      >
        <div />
        {children}
      </BenefitsDrawer>
    </StyledGridItem>
  )
}

type UploadStatusGroupProps = {
  isActive?: boolean
}

type DrawerProps = {
  maxHeight?: number
} & UploadStatusGroupProps

const StyledGridItem = styled(GridItem)`
  background: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(4)};
`

export const BenefitsDrawer = styled(FlexBox)<DrawerProps>`
  position: relative;
  max-height: ${({ isActive, maxHeight }) => (isActive ? `${maxHeight}px` : '0px')};
  overflow: hidden;
  transition: max-height ${transitions.timings.loading} ${transitions.easing};
`
