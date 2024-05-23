import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { FC, ReactNode, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  SvgActionChevronT,
  SvgActionNewChannel,
  SvgActionNewTab,
  SvgAlertsInformative24,
  SvgLogoDiscordOnDark,
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
import { YppDashboardTier, getTierIcon } from '@/components/_ypp/YppDashboardTier'
import { TierWrapper } from '@/components/_ypp/YppDashboardTier/YppDashboardTier.styles'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useYppAuthorizeHandler } from '@/hooks/useYppAuthorizeHandler'
import { useUser } from '@/providers/user/user.hooks'
import { cVar, sizes, square, transitions } from '@/styles'
import { formatDate, getNextWeekday } from '@/utils/time'
import { BOOST_TIMESTAMP, getTierRewards, yppBackendTierToConfig } from '@/utils/ypp'
import { YppAuthorizationModal } from '@/views/global/YppLandingView/YppAuthorizationModal'
import { configYppIconMapper } from '@/views/global/YppLandingView/sections/YppFooter'
import { useGetYppSyncedChannels } from '@/views/global/YppLandingView/useGetYppSyncedChannels'

import { StatusDot, StatusDotWrapper, WidgetTileContent, YppSyncStatus } from './YppDashboardTabs.styles'

const benefitsMetadata = {
  discordCommunity: {
    title: 'Discord Community',
    description: (
      <>
        Introduce yourself to the <TextButton to={atlasConfig.general.joystreamDiscordUrl}>#intros</TextButton> channel
        and share the link to your {atlasConfig.general.appName} channel page. Five best intros per weeks are rewarded!
      </>
    ),
    reward: '10 USD',
    actionLink: atlasConfig.general.joystreamDiscordUrl,
    tooltipLink: 'https://www.notion.so/joystream/Creators-Discord-bc8df1d87b58435a9ea325b073bea4d6?pvs=4',
  },
  twitterPost: {
    title: 'Post on X',
    description: `Follow JoystreamDAO on X and post about why you signed up to ${atlasConfig.general.appName} using hashtag #${atlasConfig.general.appName}Web3Creators mentioning @JoystreamDAO to get a chance of weekly reward.`,
    reward: '10 USD',
    actionLink: 'https://twitter.com/joystreamdao?lang=en',
    tooltipLink:
      'https://www.notion.so/joystream/Social-Promotions-15a5e2ca49734b2094a7356e49e07b9f?pvs=4#27143338f8f645f0970baa830e0c8b99',
  },
  roundTableEvents: {
    title: 'Roundtable events',
    description: `Participate in Creator Roundtable events held on Discord to exchange perspectives on current ${atlasConfig.general.appName} opportunities and features in the pipeline. Best questions are rewarded.`,
    reward: '25 USD',
    actionLink: atlasConfig.general.joystreamDiscordUrl,
    tooltipLink: 'https://www.notion.so/joystream/Roundtable-Events-cd106924a7314f75acf8813277fc21a8?pvs=4',
  },
  originalCreatorsContent: {
    title: `${atlasConfig.general.appName} Original Content`,
    description: `Earn more by publishing content to ${atlasConfig.general.appName} at least 24 hours ahead of YouTube. Make sure to add hashtag #JoystreamOriginal and hyperlink to the video uploaded to ${atlasConfig.general.appName}. Text of the link should be #watchOn${atlasConfig.general.appName}.`,
    actionLink: 'https://athd8d2ml5u.typeform.com/to/jvKcRyCP',
    tooltipLink: 'https://www.notion.so/joystream/Original-Content-Rewards-de1acdc52ef549119b700df106675ce4?pvs=4',
  },
  branding: {
    title: `${atlasConfig.general.appName} Branding`,
    description: `Add Joystream branding to your video and multiply your rewards for original uploads to ${atlasConfig.general.appName}. Branded video description posted to Youtube must contain hashtag #jsb and  #watchOn${atlasConfig.general.appName}.`,
    actionLink: 'https://athd8d2ml5u.typeform.com/to/jvKcRyCP',
    tooltipLink:
      'https://www.notion.so/joystream/Original-Content-de1acdc52ef549119b700df106675ce4?pvs=4#aa1c28df46ff45e0b81be7a84fc18faf',
  },
  shareNft: {
    title: 'Share NFT',
    reward: '30 USD',
    tooltipLink: 'https://www.notion.so/joystream/Social-Promotions-15a5e2ca49734b2094a7356e49e07b9f?pvs=4',
  },
  shareToken: {
    title: 'Share Token',
    reward: '50 USD',
    tooltipLink:
      'https://www.notion.so/joystream/Social-Promotions-15a5e2ca49734b2094a7356e49e07b9f?pvs=4#8f39e46460e84f74a3dabffa516505f2',
  },
  ambassadorProgram: {
    title: 'Ambassador Program',
    description: 'Become Joystream ambassador and work with our marketing and product team on growing the platform.',
    reward: 'Up to 1k USD',
    actionLink: 'https://joystream.notion.site/Ambassador-Program-Space-93dfd2767d6b4729ac7dab79f9970d5b',
    tooltipLink: 'https://joystream.notion.site/Ambassador-Program-Space-93dfd2767d6b4729ac7dab79f9970d5b',
  },
  discordLink: atlasConfig.general.joystreamDiscordUrl,
}

export const YppDashboardMainTab: FC = () => {
  const { channelId } = useUser()
  const {
    trackAmbassadorLinkClicked,
    trackRewardsReferralLinkClicked,
    trackRewardsBrandingLinkClicked,
    trackRewardsOriginalCreatorsLinkClicked,
    trackTwitterPostLinkClicked,
    trackShareNftLinkClicked,
    trackJoinDiscordLinkClicked,
    trackShareTokenLinkClicked,
    trackRoundtableEventsClicked,
  } = useSegmentAnalytics()
  const navigate = useNavigate()
  const _handleYppSignUpClick = useYppAuthorizeHandler()
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
  const isSilverOrAbove = ['Verified::Silver', 'Verified::Gold', 'Verified::Diamond'].includes(
    currentChannel?.yppStatus ?? ''
  )
  const isBronze = currentChannel?.yppStatus === 'Verified::Bronze'
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

  const silverTierGroup = (
    <FlexBox gap={3} alignItems="center">
      <SilverTierWrapper tier="Verified::Silver">{getTierIcon('Verified::Silver')}</SilverTierWrapper>
      <Text variant="t300" as="p">
        Offers are valid for silver tiers and above.
      </Text>
      {!isBronze ? (
        <Information text="Connect YouTube channel and wait for verification by the content team to get rewards tier assigned." />
      ) : null}
    </FlexBox>
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
        <BenefitsContainer title="Youtubers">
          {!currentChannel?.yppStatus.startsWith('Suspended') && (
            <BenefitCard
              title="Connect Channel"
              description="Connect your YouTube channel to obtain rewards tier and qualify for sign up bonus."
              rewardNode={
                !currentChannel || !currentChannel.yppStatus.startsWith('Verified')
                  ? `Up to 100 USD`
                  : `${
                      (getTierRewards(yppBackendTierToConfig(currentChannel.yppStatus))?.signUp || 0) * rewardMultiplier
                    } USD`
              }
              rewardTooltip={
                <Text variant="t100" as="span">
                  Connected channels undergo verification from the DAO content team and assigned tiers based on
                  production quality. Sign up bonus, sync rewards and access to more earning opportunities are based on
                  the tier. {'\n'}
                  <TextButton to="https://www.notion.so/joystream/YouTube-Partners-2164f8685d094984a37cdb1a38e3560d?pvs=4">
                    Learn more
                  </TextButton>
                </Text>
              }
              actionNode={
                <Button
                  icon={<SvgActionNewChannel />}
                  disabled={!!currentChannel}
                  iconPlacement="right"
                  fullWidth={!smMatch}
                  onClick={handleYppSignUpClick}
                >
                  {currentChannel ? 'Connected' : 'Connect'}
                </Button>
              }
            />
          )}
          <BenefitCard
            title="Get rewards for auto-sync"
            description="Get paid for every new video published on YouTube after the date of sign up. Minimum video duration has to be 5 minutes. Max videos rewarded are 3 per week."
            rewardNode={
              !currentChannel || !currentChannel.yppStatus.startsWith('Verified') ? (
                currentChannel?.yppStatus.startsWith('Suspended') ? undefined : (
                  <FlexBox alignItems="end" flow="column" gap={0}>
                    <Text variant="h400" as="h3">
                      Up to 5 USD
                    </Text>
                    <Text variant="t200" as="p" color="colorText">
                      per video
                    </Text>
                  </FlexBox>
                )
              ) : (
                `+${getTierRewards(yppBackendTierToConfig(currentChannel.yppStatus))?.videoSync} USD`
              )
            }
            rewardTooltip={
              <Text variant="t100" as="span">
                The limit of historical videos and rewards for synced videos are based on the channel rewards tier and
                paid for weekly basis. {'\n'}
                <TextButton to="https://www.notion.so/joystream/YouTube-Partners-2164f8685d094984a37cdb1a38e3560d?pvs=4">
                  Learn more
                </TextButton>
              </Text>
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
            title="Refer YT creators"
            description="Get rewarded for every new creator who signs up to YPP program using your referral link. Referrals rewards depends on the tier assigned to the invited channel."
            rewardNode={`Up to ${(getTierRewards('diamond')?.referral || 0) * rewardMultiplier} USD`}
            rewardTooltip={
              <Text variant="t100" as="span">
                Referrals is the easiest way to ramp up rewards. Top referrers are published to the regularly updated
                leaderboard. {'\n'}
                <TextButton to="https://www.notion.so/joystream/Referrals-Program-a87e0253ff174d9aa24bd9c393b1d625?pvs=4">
                  Learn more
                </TextButton>
              </Text>
            }
            actionNode={
              <ReferralLinkButton
                onClick={() => trackRewardsReferralLinkClicked(channelId ?? '', currentChannel?.yppStatus ?? '')}
              />
            }
          />
        </BenefitsContainer>

        <BenefitsContainer title="Community Builders">
          <BenefitCard
            title={benefitsMetadata.discordCommunity.title}
            description={benefitsMetadata.discordCommunity.description}
            rewardNode={benefitsMetadata.discordCommunity.reward}
            rewardTooltip={
              <Text variant="t100" as="span">
                We are proud to be building a vibrant community of forward looking creators across a wide set of content
                categories. To stay ahead of the new opportunities to earn with {atlasConfig.general.appName} and
                connect with the peers and support team join our Discord. Newcomers are rewarded with JOY tokens for
                active participation.{'\n'}
                <TextButton to={benefitsMetadata.discordCommunity.tooltipLink}>Learn more</TextButton>
              </Text>
            }
            actionNode={
              <Button
                onClick={() => trackJoinDiscordLinkClicked(channelId ?? '', currentChannel?.yppStatus ?? '')}
                to={benefitsMetadata.discordCommunity.actionLink}
              >
                Join Discord
              </Button>
            }
          />
          <BenefitCard
            title={benefitsMetadata.twitterPost.title}
            description={benefitsMetadata.twitterPost.description}
            rewardNode={benefitsMetadata.twitterPost.reward}
            rewardTooltip={
              <Text variant="t100" as="span">
                JoystreamDAO has 50 thousand followers and we are going strong towards our first million. Join the club,
                get exposure to our growing follower base and get a chance to receive a bonus.{'\n'}
                <TextButton to={benefitsMetadata.twitterPost.tooltipLink}>Learn more</TextButton>
              </Text>
            }
            actionNode={
              <Button
                onClick={() => trackTwitterPostLinkClicked(channelId ?? '', currentChannel?.yppStatus ?? '')}
                to={benefitsMetadata.twitterPost.actionLink}
              >
                Post on X
              </Button>
            }
          />
          <BenefitCard
            title={benefitsMetadata.roundTableEvents.title}
            description={benefitsMetadata.roundTableEvents.description}
            rewardNode={benefitsMetadata.roundTableEvents.reward}
            rewardTooltip={
              <Text variant="t100" as="span">
                During every event the panelists and hosts vote on selecting 3 best questions from the audience which
                are rewarded with JOY and other prizes.{'\n'}
                <TextButton to={benefitsMetadata.roundTableEvents.tooltipLink}>Learn more</TextButton>
              </Text>
            }
            actionNode={
              <Button
                onClick={() => trackRoundtableEventsClicked(channelId ?? '', currentChannel?.yppStatus ?? '')}
                to={benefitsMetadata.roundTableEvents.actionLink}
              >
                Learn more
              </Button>
            }
          />
        </BenefitsContainer>

        <BenefitsContainer title="Original Creators">
          {isSilverOrAbove ? null : silverTierGroup}
          <BenefitCard
            title={benefitsMetadata.originalCreatorsContent.title}
            description={benefitsMetadata.originalCreatorsContent.description}
            rewardNode={
              <FlexBox alignItems="end" flow="column" gap={0}>
                <Text variant="h400" as="h3">
                  {currentChannel?.yppStatus
                    ? (getTierRewards(yppBackendTierToConfig(currentChannel.yppStatus))?.videoSync || 0) * 5
                    : 'Up to 25'}{' '}
                  USD
                </Text>
                <Text variant="t200" as="p" color="colorText">
                  per video
                </Text>
              </FlexBox>
            }
            rewardTooltip={
              <Text variant="t100" as="span">
                Original content published to {atlasConfig.general.appName} is rewarded at a multiple. We are gathering
                applicants for the beta testing of this feature. Apply early for higher multiples.{'\n'}
                <TextButton to={benefitsMetadata.originalCreatorsContent.tooltipLink}>Learn more</TextButton>
              </Text>
            }
            actionNode={
              <Button
                onClick={() =>
                  trackRewardsOriginalCreatorsLinkClicked(channelId ?? '', currentChannel?.yppStatus ?? '')
                }
                disabled={!isSilverOrAbove}
                to={benefitsMetadata.originalCreatorsContent.actionLink}
              >
                Sign up
              </Button>
            }
          />
          <BenefitCard
            title={benefitsMetadata.branding.title}
            description={benefitsMetadata.branding.description}
            rewardNode={
              <FlexBox alignItems="end" flow="column" gap={0}>
                <Text variant="h400" as="h3">
                  {currentChannel?.yppStatus
                    ? (getTierRewards(yppBackendTierToConfig(currentChannel.yppStatus))?.videoSync || 0) * 5
                    : 'Up to 25'}{' '}
                  USD
                </Text>
                <Text variant="t200" as="p" color="colorText">
                  per video
                </Text>
              </FlexBox>
            }
            rewardTooltip={
              <Text variant="t100" as="span">
                Using branded assets as a preroll for your videos published to {atlasConfig.general.appName} first allow
                to maximise the rewards. We are gathering early applicants for the beta test of this feature. Apply
                early to get higher multiple.{' '}
                <TextButton to={benefitsMetadata.branding.tooltipLink}>Learn more</TextButton>
              </Text>
            }
            actionNode={
              <Button
                onClick={() => trackRewardsBrandingLinkClicked(channelId ?? '', currentChannel?.yppStatus ?? '')}
                disabled={!isSilverOrAbove}
                to={benefitsMetadata.branding.actionLink}
              >
                Sign up
              </Button>
            }
          />
        </BenefitsContainer>

        <BenefitsContainer title="Social Promoters">
          {isSilverOrAbove ? null : silverTierGroup}
          <BenefitCard
            title={benefitsMetadata.shareNft.title}
            rewardNode={benefitsMetadata.shareNft.reward}
            description={
              <>
                Drop the link of your post to{' '}
                <TextButton to={atlasConfig.general.joystreamDiscordUrl}>#shared-NFTs</TextButton> on Discord to
                participate in rewards.
              </>
            }
            rewardTooltip={
              <Text variant="t100" as="span">
                Promote your NFTs on social media and get rewarded by the DAO for this. Rewards assigned are based on
                peer upvotes held in a dedicated Discord channel.{'\n'}
                <TextButton to={benefitsMetadata.shareNft.tooltipLink}>Learn more</TextButton>
              </Text>
            }
            actionNode={
              <Button
                onClick={() => trackShareNftLinkClicked(channelId ?? '', currentChannel?.yppStatus ?? '')}
                disabled={!isSilverOrAbove}
                to={absoluteRoutes.viewer.channel(channelId ?? '', { tab: 'NFTs' })}
              >
                Share NFTs
              </Button>
            }
          />
          <BenefitCard
            title={benefitsMetadata.shareToken.title}
            rewardNode={benefitsMetadata.shareToken.reward}
            description={
              <>
                Drop the link of your post to{' '}
                <TextButton to={atlasConfig.general.joystreamDiscordUrl}>#shared-CRTs</TextButton> on Discord to
                participate in rewards.
              </>
            }
            rewardTooltip={
              <Text variant="t100" as="span">
                Promote your Creator Token on social media and get rewarded by the DAO for this. Rewards assigned are
                based on peer upvotes held in a dedicated Discord channel.{'\n'}
                <TextButton to={benefitsMetadata.shareToken.tooltipLink}>Learn more</TextButton>
              </Text>
            }
            actionNode={
              <Button
                onClick={() => trackShareTokenLinkClicked(channelId ?? '', currentChannel?.yppStatus ?? '')}
                disabled={!isSilverOrAbove}
                to={absoluteRoutes.viewer.channel(channelId ?? '', { tab: 'Token' })}
              >
                Share token
              </Button>
            }
          />
          <BenefitCard
            title={benefitsMetadata.ambassadorProgram.title}
            description={benefitsMetadata.ambassadorProgram.description}
            rewardNode={benefitsMetadata.ambassadorProgram.reward}
            rewardTooltip={
              <Text variant="t100" as="span">
                Ambassador program is open for creators dedicated to Joystream and entails versatile tasks of your
                choice for collaboration and promotion.{'\n'}
                <TextButton to={benefitsMetadata.ambassadorProgram.tooltipLink}>Learn more</TextButton>
              </Text>
            }
            actionNode={
              <Button
                onClick={() => trackAmbassadorLinkClicked(channelId ?? '', currentChannel?.yppStatus ?? '')}
                disabled={!isSilverOrAbove}
                to={benefitsMetadata.ambassadorProgram.actionLink}
              >
                Apply
              </Button>
            }
          />
        </BenefitsContainer>

        <StyledGridItem colSpan={{ xxs: 12 }}>
          <HelpContainer alignItems="center" gap={2}>
            <SvgLogoDiscordOnDark />
            <Text variant="t300" as="p">
              Have a question? Ask for help on{' '}
              <TextButton to={benefitsMetadata.discordLink} size="large">
                Discord
              </TextButton>
            </Text>
          </HelpContainer>
        </StyledGridItem>
      </LayoutGrid>
    </>
  )
}

const HelpContainer = styled(FlexBox)`
  padding: ${sizes(4)} 0;
`

const SilverTierWrapper = styled(TierWrapper)`
  padding: ${sizes(2)};
  width: fit-content;
  border: 1px solid #cbe0f145;

  svg {
    ${square(20)};
  }
`

export const BenefitsContainer = ({ children, title }: { children: ReactNode[] | ReactNode; title: string }) => {
  const drawer = useRef<HTMLDivElement>(null)
  const [isDrawerActive, setDrawerActive] = useState(true)

  return (
    <StyledGridItem colSpan={{ xxs: 12 }}>
      <DrawerHeader
        onClick={() => setDrawerActive((prev) => !prev)}
        alignItems="start"
        justifyContent="space-between"
        width="100%"
      >
        <Text variant="h500" as="h3">
          {title}
        </Text>
        <Button icon={<StyledSvgActionChevronT isDrawerActive={isDrawerActive} />} variant="tertiary" size="small" />
      </DrawerHeader>
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
  padding: 0 ${sizes(4)};
`

const DrawerHeader = styled(FlexBox)`
  cursor: pointer;
  padding: ${sizes(4)} 0;
`

export const BenefitsDrawer = styled(FlexBox)<DrawerProps>`
  position: relative;
  max-height: ${({ isActive, maxHeight }) => (isActive ? `${maxHeight}px` : '0px')};
  overflow: hidden;
  transition: max-height ${transitions.timings.loading} ${transitions.easing};
  margin-bottom: ${({ isActive }) => (isActive ? sizes(4) : '0px')};
`

export const StyledSvgActionChevronT = styled(SvgActionChevronT, {
  shouldForwardProp: isPropValid,
})<{ isDrawerActive: boolean }>`
  transform: rotate(${({ isDrawerActive }) => (!isDrawerActive ? '-180deg' : '0deg')});
  transition: transform ${cVar('animationTransitionMedium')};
`
