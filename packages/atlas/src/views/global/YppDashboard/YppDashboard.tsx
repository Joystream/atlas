import BN from 'bn.js'
import { FC } from 'react'

import { Banner } from '@/components/Banner'
import { Information } from '@/components/Information'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import {
  SvgActionInfo,
  SvgActionNewTab,
  SvgActionSpeech,
  SvgActionTokensStack,
  SvgTierIcon1,
  SvgTierIcon2,
  SvgTierIcon3,
} from '@/components/_icons'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import {
  Header,
  RewardsWrapper,
  TierCount,
  TierDescription,
  TierWrapper,
  WidgetsWrapper,
} from '@/views/global/YppDashboard/YppDashboard.styled'

const REWARDS = [
  {
    title: 'Publish video on Atlas',
    description:
      'Publishing your existing content on Atlas is the fastest way to earn more JOY tokens. Simply follow those steps:',
    actionButton: { text: 'Publish new video' },
    steps: [
      <>
        Click{' '}
        <Text as="span" variant="t200" color="colorTextStrong">
          “Publish new video”
        </Text>{' '}
        button and proceed to video workspace
      </>,
      <>
        While publishing your new video make sure that all assets like thumbnail, video file, title, description are{' '}
        <Text as="span" variant="t200" color="colorTextStrong">
          the same as used previously on YouTube
        </Text>
      </>,
      'Your uploads will be periodically reviewed for quality and completeness. Videos that match the criteria of programme participation listed above will score towards overall rewards',
    ],
  },
  {
    title: 'Share Atlas video on YouTube',
    description: 'To share Atlas video you need to first upload your own video to the platform.',
    actionButton: { text: 'Go to My videos' },
    steps: [
      'Publish new video or select one that you already uploaded to Atlas.',
      'Go to your new video and copy the link to it',
      'Upload a video to your YouTube channel mentioning your channel on Atlas',
      'Place the link in the video description',
    ],
  },
  {
    title: 'Refer another YouTube creator',
    description: 'Earn when another YouTube creator sign up for the program by using your link.',
    actionButton: { text: 'Get referral link' },
    steps: [
      'Copy your link with get referral link button',
      'Send it to the person who you want to recommend',
      'You will be rewarded for every new successful sign up, that uses your referral link to land on the YPP page before signing up',
    ],
  },
]

const TIERS = {
  1: {
    rules: '<5K subscribers',
    icon: <SvgTierIcon1 />,
  },
  2: {
    rules: '5K-25K subscribers',
    icon: <SvgTierIcon2 />,
  },
  3: {
    rules: '>25K subscribers',
    icon: <SvgTierIcon3 />,
  },
}

// TODO: this needs to be taken from backend
const currentTier = 1

export const YppDashboard: FC = () => {
  const mdMatch = useMediaMatch('md')
  return (
    <LimitedWidthContainer>
      <Header>
        <Text variant={mdMatch ? 'h700' : 'h600'} as="h1">
          YouTube Partner Program
        </Text>
        <TierWrapper>
          {TIERS[currentTier].icon}
          <TierDescription>
            <div>
              <TierCount>
                <Text variant="h300" as="span">
                  Tier {currentTier}{' '}
                </Text>
                <Text variant="t100" as="span" color="colorText">
                  out of {Object.keys(TIERS).length}
                </Text>
              </TierCount>
              <Text variant="t100" as="p" color="colorText">
                {TIERS[currentTier].rules}
              </Text>
            </div>
            <Information text="The more subscribers you have on YouTube, the higher the payouts in the program. For 5-25K subscribers, payouts are multiplied by 1.5, for more than 25K subscribers, payouts are 3x as high. Below displayed rewards are calculated for your channel." />
          </TierDescription>
        </TierWrapper>
      </Header>
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
          }}
        />
      </WidgetsWrapper>
      <RewardsWrapper>
        {REWARDS.map((reward) => (
          <BenefitCard key={reward.title} {...reward} joyAmount={new BN(1200000000000)} />
        ))}
      </RewardsWrapper>
      {/* TODO: add tooltip once it will show up on design */}
      <Banner
        title="Have more than one YouTube channel?"
        description={
          'You can apply to the YouTube Partner Program with as many YouTube & Atlas channels as you want. Each YouTube channel can be assigned to only one Atlas channel. \nYou can create a new channel from the top right menu.'
        }
      />
    </LimitedWidthContainer>
  )
}
