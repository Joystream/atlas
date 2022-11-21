import { FC } from 'react'

import { SvgTierIcon1, SvgTierIcon2, SvgTierIcon3 } from '@/assets/icons'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { MultiplierText, TierItem } from './YppAuthorizationTermsAndConditionsStep.styles'

export const YppAuthorizationTermsAndConditionsStep: FC = () => {
  const smMatch = useMediaMatch('sm')

  return (
    <div>
      <Text variant={smMatch ? 'h400' : 'h300'} as="h3" margin={{ bottom: 4 }}>
        Payout tiers
      </Text>
      <Text variant="t200" as="p" color="colorText">
        The more subscribers you have on YouTube, the higher the payouts in the program.{' '}
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
          5K-25K subscribers
        </Text>
        <MultiplierText variant="t200" as="span">
          1.5x
        </MultiplierText>
        <SvgTierIcon3 />
        <Text variant="t200-strong" as="span">
          Tier 3:
        </Text>{' '}
        <Text variant="t200" as="span" color="colorText">
          {'>'}25K subscribers
        </Text>
        <MultiplierText variant="t200" as="span">
          3x
        </MultiplierText>
      </TierItem>
      <Text variant={smMatch ? 'h400' : 'h300'} as="h3" margin={{ bottom: 4 }}>
        Terms
      </Text>
      <Text variant="t200-strong" as="h4" margin={{ bottom: 2 }}>
        1. You can opt out at any time
      </Text>
      <Text variant="t200" color="colorText" as="p" margin={{ bottom: 4 }}>
        To do this contact us on discord or by email and you will be opted out from the program. Your information will
        be deleted. You won’t have to return any tokens that you have already earn.
      </Text>
      <Text variant="t200-strong" as="h4" margin={{ bottom: 2 }}>
        2. Lorem ipsum et dolores
      </Text>
      <Text variant="t200" color="colorText" as="p">
        There is probably more information which we wanted to convey in here - we can do this by adding additional
        points to this list
      </Text>
    </div>
  )
}
