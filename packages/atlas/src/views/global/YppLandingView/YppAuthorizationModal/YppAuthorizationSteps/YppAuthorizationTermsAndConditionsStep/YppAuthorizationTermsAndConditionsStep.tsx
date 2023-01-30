import { FC } from 'react'

import { SvgTierIcon1, SvgTierIcon2, SvgTierIcon3 } from '@/assets/icons'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'

import { MultiplierText, TierItem } from './YppAuthorizationTermsAndConditionsStep.styles'

export const YppAuthorizationTermsAndConditionsStep: FC = () => {
  const tnc = atlasConfig.features.ypp.legal.yppTnC
  const groups = [...tnc.matchAll(/(.+)(### Tiers Multiplier.+)(### Example Rewards Calculation.+)/gs)][0]
  const [_, beforeTM, __, afterTM] = groups

  return (
    <div>
      {beforeTM && <MarkdownPreview markdown={beforeTM} />}
      <Text variant="t200-strong" as="h4" margin={{ bottom: 2 }}>
        Tiers Multiplier
      </Text>
      <Text variant="t200" as="p" color="colorText">
        Based on the YouTube channel followers count, a popularity Tier is assigned to each participant. Popularity tier
        results in multiplication effect on all rewards of the programme.
      </Text>
      <TierItem>
        <SvgTierIcon1 />
        <Text variant="t200-strong" as="span">
          Tier 1:
        </Text>{' '}
        <Text variant="t200" as="span" color="colorText">
          {'<'}5K subscribers
        </Text>
        <MultiplierText variant="t200" as="span">
          1x
        </MultiplierText>
        <SvgTierIcon2 />
        <Text variant="t200-strong" as="span">
          Tier 2:
        </Text>{' '}
        <Text variant="t200" as="span" color="colorText">
          5K-50K subscribers
        </Text>
        <MultiplierText variant="t200" as="span">
          2.5x
        </MultiplierText>
        <SvgTierIcon3 />
        <Text variant="t200-strong" as="span">
          Tier 3:
        </Text>{' '}
        <Text variant="t200" as="span" color="colorText">
          {'>'}50K subscribers
        </Text>
        <MultiplierText variant="t200" as="span">
          5x
        </MultiplierText>
      </TierItem>
      {afterTM && <MarkdownPreview markdown={afterTM} />}
    </div>
  )
}
