import BN from 'bn.js'
import { FC } from 'react'

import { SvgActionInfo, SvgActionNewTab, SvgActionSpeech, SvgActionTokensStack } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { Information } from '@/components/Information'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { BenefitCard } from '@/components/_ypp/BenefitCard'
import { atlasConfig } from '@/config'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { REWARDS, TIERS } from './YppDashboard.config'
import {
  Header,
  RewardsWrapper,
  StyledSvgAlertsInformative24,
  TierCount,
  TierDescription,
  TierWrapper,
  WidgetsWrapper,
} from './YppDashboard.styles'

// TODO: this needs to be taken from backend
const currentTier = 0

export const YppDashboard: FC = () => {
  const headTags = useHeadTags('Youtube Partner Program')
  const mdMatch = useMediaMatch('md')
  return (
    <>
      {headTags}
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
                    out of {TIERS.length}
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
              to: atlasConfig.general.joystreamDiscordUrl,
            }}
          />
        </WidgetsWrapper>
        <RewardsWrapper>
          {REWARDS.map((reward) => (
            <BenefitCard key={reward.title} {...reward} joyAmount={new BN(1200000000000)} />
          ))}
        </RewardsWrapper>
        <Banner
          icon={<StyledSvgAlertsInformative24 />}
          title="Have more than one YouTube channel?"
          description={
            'You can apply to the YouTube Partner Program with as many YouTube & Atlas channels as you want. Each YouTube channel can be assigned to only one Atlas channel. \nYou can create a new channel from the top right menu.'
          }
        />
      </LimitedWidthContainer>
    </>
  )
}
